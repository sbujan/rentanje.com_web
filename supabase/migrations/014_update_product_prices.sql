-- ============================================================
-- 014_update_product_prices.sql
-- Sets prices from "rentanje csv.csv" (2026-05-08).
--
-- Mapping rules:
--   * NULL price_per_day means: cannot be booked for 1 day (CSV "n/a")
--   * 32 of the 38 CSV rows mapped to existing slugs (24 active in 002,
--     8 inactive in 012). 6 rows had no DB match — skipped (see footer).
--   * Idempotent: re-running sets the same values.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Active catalog (migration 002)
-- ────────────────────────────────────────────────────────────
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'akcijska-kamera-gopro-hero-10';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'dji-mavic-mini-2-fly-more';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'fujifilm-instax-mini-evo';
UPDATE products SET price_per_day = NULL,  price_per_3days = 20.00,  price_per_7days = 40.00  WHERE slug = 'jbl-charge-3-prijenosni-zvucnik';
UPDATE products SET price_per_day = NULL,  price_per_3days = 20.00,  price_per_7days = 40.00  WHERE slug = 'jbl-mikrofoni-bezicni';
UPDATE products SET price_per_day = 50.00, price_per_3days = 100.00, price_per_7days = 150.00 WHERE slug = 'projektor-sa-platnom';
UPDATE products SET price_per_day = 40.00, price_per_3days = 70.00,  price_per_7days = 100.00 WHERE slug = 'plinska-pec-za-pizzu-ooni-16';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'prenosivi-razanj-s-motorom';
UPDATE products SET price_per_day = 10.00, price_per_3days = 20.00,  price_per_7days = 30.00  WHERE slug = 'pekasac';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'kotlovina-735cm';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'kotao-od-lijevanog-zeljeza-10-l-sa-stalkom';
UPDATE products SET price_per_day = 40.00, price_per_3days = 70.00,  price_per_7days = 100.00 WHERE slug = 'firepit-bonfire-20';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'tocionik-za-pivo-6l';
UPDATE products SET price_per_day = NULL,  price_per_3days = 60.00,  price_per_7days = 100.00 WHERE slug = 'sator-2-zracna-madraca-elektricna-pumpa-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 30.00  WHERE slug = 'paviljonsator-3x3m';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'prenosivi-stol-i-2-klupe-za-8-osoba';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'blumfeldt-dark-wave-infrared-grijalica';
-- "Plamenik za hranu (BBQ plamen.)" → mapped to active baklja-za-rostilj
UPDATE products SET price_per_day = 10.00, price_per_3days = 20.00,  price_per_7days = 50.00  WHERE slug = 'baklja-za-rostilj';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'ledomat';
-- "Käscher Puzzi (čistač tepiha)" → mapped to existing Kärcher slug
UPDATE products SET price_per_day = 25.00, price_per_3days = 45.00,  price_per_7days = 80.00  WHERE slug = 'krcher-usisavac-za-dubinsko-pranje-najam';
UPDATE products SET price_per_day = 10.00, price_per_3days = 20.00,  price_per_7days = 30.00  WHERE slug = 'cornhole';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 25.00  WHERE slug = 'velika-jenga';
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00  WHERE slug = 'beerpong-stol';
UPDATE products SET price_per_day = 10.00, price_per_3days = 20.00,  price_per_7days = 50.00  WHERE slug = 'kokicar';

-- ────────────────────────────────────────────────────────────
-- Inactive products (migration 012) — prices ready for when admin
-- flips is_active=true after adding category, images, etc.
-- ────────────────────────────────────────────────────────────
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'vertikalni-kebab-rostilj-najam';
UPDATE products SET price_per_day = 20.00, price_per_3days = 40.00,  price_per_7days = 70.00  WHERE slug = 'aparat-za-slushie-margaritu-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 25.00  WHERE slug = 'spikeball-igra-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 25.00  WHERE slug = 'kubb-viking-igra-najam';
UPDATE products SET price_per_day = NULL,  price_per_3days = 15.00,  price_per_7days = 25.00  WHERE slug = 'ladder-golf-igra-najam';
UPDATE products SET price_per_day = 30.00, price_per_3days = 60.00,  price_per_7days = 80.00  WHERE slug = 'sup-stand-up-paddle-najam';
-- "Spyra Two" in CSV → mapped to both SpyraThree colors (same price each)
UPDATE products SET price_per_day = 15.00, price_per_3days = 30.00,  price_per_7days = 50.00
WHERE slug IN (
  'spyrathree-vodeni-pistolj-crveni-najam',
  'spyrathree-vodeni-pistolj-plavi-najam'
);

-- ────────────────────────────────────────────────────────────
-- CSV rows skipped (no DB match)
-- ────────────────────────────────────────────────────────────
-- Row  2: GoPro Hero 13 (NOVO)        — not yet in DB
-- Row  3: DJI Osmo Action 5 Pro       — not yet in DB
-- Row  5: DJI Osmo Pocket 3           — not yet in DB
-- Row  6: Insta360 GO 3 — 64GB        — not yet in DB
-- Row  7: Insta360 X5                 — not yet in DB
-- Row  9: JBL PartyBox Stage 320      — DB has only 310 model
-- Row 23: Aparat za šećernu vunu      — not yet in DB
-- Row 42: Kotao odljevanog željeza 10 L (no stalak) — duplicate label of row 20 with conflicting price; row 20 wins
