-- ============================================================
-- rentanje.com — Link availability rows to source inquiry
-- ============================================================
-- When an admin confirms an inquiry, we auto-insert availability
-- rows for the booked product/date pairs and tag them with
-- source_inquiry_id so we can:
--   1) cleanly remove them when the inquiry is un-confirmed,
--   2) distinguish "from inquiry" vs "manually blocked" in the
--      admin UI without losing either.
--
-- Multiple inquiries may book the same (product, date), so the old
-- UNIQUE(product_id, date) constraint is dropped and replaced with a
-- partial unique index that only constrains manual rows. Inquiry-
-- derived rows can stack alongside manual blocks and each other.
-- Total qty_booked for a date is computed by summing all rows.
-- ============================================================

ALTER TABLE availability
  ADD COLUMN IF NOT EXISTS source_inquiry_id uuid
  REFERENCES inquiries(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_availability_source_inquiry
  ON availability(source_inquiry_id);

-- Drop the broad uniqueness constraint and replace with a partial
-- one. Constraint name follows Postgres' default for UNIQUE(a, b):
-- "<table>_<col1>_<col2>_key".
ALTER TABLE availability
  DROP CONSTRAINT IF EXISTS availability_product_id_date_key;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_availability_manual
  ON availability(product_id, date)
  WHERE source_inquiry_id IS NULL;

-- ============================================================
-- Backfill inquiry-level rental_start / rental_end from items JSONB
-- ============================================================
-- The inquiry-creation API never set these columns; the dates lived
-- only inside the items JSONB. The new server action needs reliable
-- inquiry-level dates, so backfill from min/max of item dates.
-- (Going forward, src/app/api/inquiry/route.ts populates them.)

UPDATE inquiries
SET
  rental_start = (
    SELECT MIN((item->>'rentalStart')::date)
    FROM jsonb_array_elements(items) AS item
  ),
  rental_end = (
    SELECT MAX((item->>'rentalEnd')::date)
    FROM jsonb_array_elements(items) AS item
  )
WHERE rental_start IS NULL
  AND items IS NOT NULL
  AND jsonb_array_length(items) > 0;
