-- =====================================================================
-- WP3 — SEO title/description update for priority pages
-- rentanje.com · run in Supabase SQL editor after review
-- =====================================================================
--
-- WHAT THIS DOES
--   Rewrites seo_title / seo_description for the 4 DB-driven priority pages
--   from the tech-SEO plan (WP3): three products + one category. These pages
--   rank but under-convert (low CTR), and their titles don't sell.
--
-- WHY ONLY 4 ROWS
--   The homepage title and the /paketi title are hardcoded in code
--   (src/app/(public)/page.tsx and .../paketi/page.tsx) and were already
--   updated in the same branch — they are NOT in this SQL.
--
-- BRAND SUFFIX
--   The site title template appends " | rentanje.com" automatically, and the
--   app strips any trailing brand from seo_title (cleanSeoTitle). So the
--   titles below are intentionally brand-free; the rendered <title> becomes
--   e.g. "Najam projektora s platnom — od 40 €/dan | rentanje.com".
--
-- ⚠ PRICE IN TITLE = MANUAL MAINTENANCE
--   The daily rates below (40, 7, 5 €) are hardcoded as of 2026-07-05. If a
--   product's price changes, either re-run this with the new number, OR set
--   that row's seo_title = NULL — the product page then falls back to the
--   live template "Najam {name} — od {rate} €/dan" which always shows the
--   current price (see the commented alternative at the bottom).
--
-- Safe to re-run (idempotent). Review the SELECT output before COMMIT.
-- =====================================================================

BEGIN;

-- 1) Projektor s platnom (40 €/dan) — CTR 5% na 604 impr.
UPDATE products SET
  seo_title = 'Najam projektora s platnom — od 40 €/dan',
  seo_description = 'Iznajmite projektor s platnom u Zagrebu od 40 €/dan — kino na otvorenom, prezentacije i gaming. Dostava i brza rezervacija, odgovor u roku od 1 radnog dana.'
WHERE slug = 'projektor-s-platnom-najam';

-- 2) JBL Charge 3 (7 €/dan) — 0 klikova na "jbl charge 3" (76 impr.)
UPDATE products SET
  seo_title = 'Najam JBL Charge 3 zvučnika — od 7 €/dan',
  seo_description = 'Iznajmite JBL Charge 3 Bluetooth zvučnik u Zagrebu od 7 €/dan — vodootporan, snažan zvuk, duga baterija. Dostava i brza rezervacija online.'
WHERE slug = 'jbl-charge-3-bluetooth-zvucnik-najam';

-- 3) Paviljon / šator 3×3 m (5 €/dan) — 0 klikova na "paviljon šator" (82 impr.)
UPDATE products SET
  seo_title = 'Najam paviljon šatora 3×3 m — od 5 €/dan',
  seo_description = 'Iznajmite paviljon / šator 3×3 m u Zagrebu od 5 €/dan — zaštita od sunca i kiše za evente, sajmove i proslave. Dostava i brza rezervacija.'
WHERE slug = 'paviljon-sator-3x3m-najam';

-- 4) Kategorija: Oprema za evente — CTR 4,8%
UPDATE categories SET
  seo_title = 'Najam opreme za evente — zvučnici, šatori, igre',
  seo_description = 'Iznajmite opremu za evente u Zagrebu — zvučnici, šatori, party igre i rasvjeta na jednom mjestu. Dostava, povoljne cijene i brz odgovor.'
WHERE slug = 'oprema-za-evente';

-- Verify before committing (expect 3 product rows + 1 category row):
SELECT 'product' AS kind, slug, seo_title FROM products
  WHERE slug IN ('projektor-s-platnom-najam','jbl-charge-3-bluetooth-zvucnik-najam','paviljon-sator-3x3m-najam')
UNION ALL
SELECT 'category' AS kind, slug, seo_title FROM categories
  WHERE slug = 'oprema-za-evente'
ORDER BY kind, slug;

COMMIT;

-- =====================================================================
-- ALTERNATIVE (always-fresh price, no manual maintenance)
-- Run this INSTEAD of the product UPDATEs above to let the live template
-- generate "Najam {name} — od {live rate} €/dan | rentanje.com":
--
--   UPDATE products SET seo_title = NULL
--   WHERE slug IN ('projektor-s-platnom-najam',
--                  'jbl-charge-3-bluetooth-zvucnik-najam',
--                  'paviljon-sator-3x3m-najam');
--
-- Trade-off: you lose the hand-tuned keyword wording above, but the price
-- can never go stale. Descriptions can still be set with the UPDATEs above.
-- =====================================================================
