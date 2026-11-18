-- Anchor prices ("sidrena cijena"): the price a product had on the reference
-- date, shown next to every price on the site as "Cijena na 10.09.2026: 30 €".
--
-- The anchor is stored, not derived: when the owner changes a price in admin,
-- the anchor must keep the old number. A product listed after the reference
-- date takes the price and the date of its first listing.
--
-- Seed, done once here:
--   products created up to 10.09.2026  -> current prices, dated 10.09.2026
--   products created after 10.09.2026  -> current prices, dated the day they were created
-- Both rest on the owner's statement that prices have not changed since then.
-- Products that are not active get no anchor yet: the trigger below stamps it
-- the first time they go live.

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
  anchor_price_date      = CASE
    WHEN created_at < TIMESTAMPTZ '2026-09-11 00:00:00+02' THEN DATE '2026-09-10'
    ELSE (created_at AT TIME ZONE 'Europe/Zagreb')::date
  END
WHERE is_active
  AND anchor_price_date IS NULL;

-- First listing of a product: remember the price it went live with.
CREATE OR REPLACE FUNCTION public.products_set_anchor_price()
RETURNS trigger
LANGUAGE plpgsql
AS $fn$
BEGIN
  IF NEW.is_active AND NEW.anchor_price_date IS NULL THEN
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
