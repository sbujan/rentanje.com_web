-- ============================================================
-- 021_product_delivery.sql
--
-- Per-product delivery instead of one hard-coded site-wide fee.
--
--   delivery_available  can this product be delivered at all?
--   delivery_fee        EUR charged for delivery of this product; 0 = free
--
-- Cart rules (implemented in src/lib/delivery.ts, enforced server-side in
-- /api/inquiry): delivery is offered only when EVERY product in the cart
-- allows it, and the fee charged is the HIGHEST single-product fee (not a
-- sum, not multiplied by quantity).
--
-- Owner decision 2026-10-27: every existing product starts as deliverable
-- at 20 EUR (the previous flat fee was 10 EUR, hard-coded in src/lib/site.ts).
-- ADD COLUMN ... DEFAULT fills existing rows, so no UPDATE is needed and a
-- re-run never clobbers per-product values the owner has since edited.
--
-- The settings-table fee was dead code: nothing read it. Removed so the
-- admin Postavke page and the DB stop suggesting it does something.
-- ============================================================

BEGIN;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS delivery_available boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS delivery_fee numeric(10,2) NOT NULL DEFAULT 20
    CHECK (delivery_fee >= 0);

DELETE FROM settings WHERE key IN ('delivery_fee', 'delivery_fee_zagreb');

COMMIT;

-- Verify:
--   SELECT count(*) FILTER (WHERE delivery_available) AS deliverable,
--          count(*) FILTER (WHERE delivery_fee = 20) AS at_default_fee,
--          count(*) AS total
--   FROM products;
--   SELECT key FROM settings WHERE key LIKE 'delivery%';  -- expect 0 rows
