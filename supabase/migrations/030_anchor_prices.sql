-- Anchor prices ("sidrena cijena"): the price a product had on the reference
-- date, shown next to every price on the site as "Cijena na 10.09.2026: 30 €".
--
-- The anchor is stored, not derived: when the owner changes a price in admin,
-- the anchor must keep the old number. A product listed after the reference
-- date takes the price and the date of its first listing.
--
-- Seed, done once here: products that were on the site well before the
-- reference date (created before 01.09.2026) get their current prices, dated
-- 10.09.2026. This rests on the owner's statement that prices have not
-- changed since then.
--
-- NOT seeded: the 8 products added as drafts on 07.09.2026 and 12.10.2026.
-- Their creation date is not their listing date (their photos were uploaded
-- on 26.10 and 30.10), so the anchor date has to come from the owner. Until a
-- later migration sets it they show no anchor line.
--
-- Products that are not active get no anchor either: the trigger below stamps
-- it the moment they go live.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS anchor_price_per_day   numeric(10,2),
  ADD COLUMN IF NOT EXISTS anchor_price_per_3days numeric(10,2),
  ADD COLUMN IF NOT EXISTS anchor_price_per_7days numeric(10,2),
  ADD COLUMN IF NOT EXISTS anchor_price_date      date;

COMMENT ON COLUMN products.anchor_price_date IS
  'Date the anchor prices refer to: 2026-09-10, or the first listing date for products listed later. NULL = never listed.';

UPDATE products SET
  anchor_price_per_day   = price_per_day,
  anchor_price_per_3days = price_per_3days,
  anchor_price_per_7days = price_per_7days,
  anchor_price_date      = DATE '2026-09-10'
WHERE is_active
  AND anchor_price_date IS NULL
  AND created_at < TIMESTAMPTZ '2026-09-01 00:00:00+02';

-- First listing of a product: remember the price it went live with. Fires
-- only when a product becomes active (new active row, or inactive -> active),
-- never on an ordinary edit, so a later price change cannot become the anchor
-- and an active product waiting for its date is not stamped with today's.
CREATE OR REPLACE FUNCTION public.products_set_anchor_price()
RETURNS trigger
LANGUAGE plpgsql
AS $fn$
BEGIN
  IF NEW.is_active
     AND NEW.anchor_price_date IS NULL
     AND (TG_OP = 'INSERT' OR NOT COALESCE(OLD.is_active, false)) THEN
    NEW.anchor_price_per_day   := NEW.price_per_day;
    NEW.anchor_price_per_3days := NEW.price_per_3days;
    NEW.anchor_price_per_7days := NEW.price_per_7days;
    NEW.anchor_price_date      := (now() AT TIME ZONE 'Europe/Zagreb')::date;
  END IF;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS products_anchor_price ON products;
CREATE TRIGGER products_anchor_price
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.products_set_anchor_price();
