-- ============================================================
-- 014_update_product_prices.sql
--
-- Sets prices from "rentanje csv.csv" (2026-05-08).
-- Slugs verified against the live production DB on 2026-05-08
-- (the 002 migration slugs were stale — admin had renamed them).
--
-- Mapping rules:
--   * NULL price_per_day means: cannot be booked for 1 day (CSV "n/a")
--   * 38 of 38 priced CSV rows mapped to actual production slugs.
--   * 2 CSV rows skipped (footer): šećerna vuna (no slug),
--     kotao 10L bez stalka (duplicate label of row 20).
--   * Idempotent: re-running sets the same values.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- ACTIVE products (currently visible on the live site)
-- ────────────────────────────────────────────────────────────
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'gopro-hero-10-black-najam';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'gopro-hero-13-black-najam';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'dji-osmo-action-5-pro-najam';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'dji-mini-2-dron-fly-more-najam';
UPDATE products SET price_per_day = 30.00, price_per_3days = 60.00,  price_per_7days = 80.00  WHERE slug = 'dji-osmo-pocket-3-najam';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 100.00 WHERE slug = 'insta360-go-3-mini-kamera-najam';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'insta360-x5-360-kamera-najam';
UPDATE products SET price_per_day = 40.00, price_per_3days = 70.00,  price_per_7days = 100.00 WHERE slug = 'jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima';
UPDATE products SET price_per_day = NULL,  price_per_3days = 20.00,  price_per_7days = 40.00  WHERE slug = 'jbl-charge-3-bluetooth-zvucnik-najam';
UPDATE products SET price_per_day = 50.00, price_per_3days = 100.00, price_per_7days = 150.00 WHERE slug = 'projektor-s-platnom-najam';
UPDATE products SET price_per_day = 40.00, price_per_3days = 70.00,  price_per_7days = 100.00 WHERE slug = 'ooni-koda-16-plinska-pec-pizza-najam';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'razanj-s-motorom-najam';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'kotlovina-73cm-najam';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'kotao-lijevani-zeljezo-10l-stalak-najam';
UPDATE products SET price_per_day = 40.00, price_per_3days = 70.00,  price_per_7days = 100.00 WHERE slug = 'solo-stove-bonfire-firepit-najam';
-- CSV row 22 says "Točionik za pivo — 6L"; live slug is the 5L variant (only one in DB).
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'tocionik-za-pivu-5l-najam';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'blumfeldt-dark-wave-infracrvena-grijalica-najam';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'ledomat-aparat-za-led-najam';
UPDATE products SET price_per_day = 25.00, price_per_3days = 45.00,  price_per_7days = 80.00  WHERE slug = 'karcher-puzzi-mokro-suhi-usisavac-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 30.00  WHERE slug = 'paviljon-sator-3x3m-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 60.00,  price_per_7days = 100.00 WHERE slug = 'sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'aparat-za-slushie-margaritu-najam';

-- ────────────────────────────────────────────────────────────
-- INACTIVE products (will show when admin flips is_active=true)
-- ────────────────────────────────────────────────────────────
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'fujifilm-instax-mini-evo-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 20.00,  price_per_7days = 40.00  WHERE slug = 'jbl-bezicni-mikrofoni-par-najam';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'vertikalni-kebab-rostilj-najam';
UPDATE products SET price_per_day = 10.00, price_per_3days = 20.00,  price_per_7days = 30.00  WHERE slug = 'peka-tradicionalna-najam';
UPDATE products SET price_per_day = 10.00, price_per_3days = 20.00,  price_per_7days = 50.00  WHERE slug = 'aparat-za-kokice-popcorn-masina-najam';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'prijenosni-ratan-stol-klupe-8-osoba-najam';
-- "Plamenik za hranu (BBQ plamen.)" matched to dedicated slug, not the rostilj torch.
UPDATE products SET price_per_day = 10.00, price_per_3days = 20.00,  price_per_7days = 50.00  WHERE slug = 'plamenik-torch-za-hranu-najam';
UPDATE products SET price_per_day = 10.00, price_per_3days = 20.00,  price_per_7days = 30.00  WHERE slug = 'cornhole-igra-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 25.00  WHERE slug = 'velika-jenga-giant-jenga-igra-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 25.00  WHERE slug = 'spikeball-igra-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 25.00  WHERE slug = 'kubb-viking-igra-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 25.00  WHERE slug = 'ladder-golf-igra-najam';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'beer-pong-stol-case-najam';
UPDATE products SET price_per_day = 30.00, price_per_3days = 60.00,  price_per_7days = 80.00  WHERE slug = 'sup-stand-up-paddle-najam';
-- "Spyra Two" in CSV → mapped to both SpyraThree colors (only model in DB)
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00
WHERE slug IN (
  'spyrathree-vodeni-pistolj-crveni-najam',
  'spyrathree-vodeni-pistolj-plavi-najam'
);

-- ────────────────────────────────────────────────────────────
-- CSV rows skipped (no DB match)
-- ────────────────────────────────────────────────────────────
-- Row 23: Aparat za šećernu vunu — no candy-floss slug exists
-- Row 42: Kotao 10L (no stalak) — same product as row 20 with conflicting price
