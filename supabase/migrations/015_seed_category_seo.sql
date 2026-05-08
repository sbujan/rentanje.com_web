-- ============================================================
-- 015_seed_category_seo.sql
--
-- Seeds seo_title and seo_description for the 6 seeded categories.
-- Used by /oprema?cat=<slug> generateMetadata to render per-category
-- meta tags. Format: "Najam <X> u Zagrebu | rentanje.com" plus a
-- localized description that mentions Zagreb and the main equipment
-- types in that category.
--
-- Idempotent: re-running sets the same values.
-- ============================================================

UPDATE categories SET
  seo_title = 'Najam audio i video opreme u Zagrebu | rentanje.com',
  seo_description = 'Iznajmite zvučnike, mikrofone, projektore, kamere i drugu audio/video opremu. Povoljne cijene, brza dostava u Zagrebu. Pošaljite upit danas!'
WHERE slug = 'audio-video-oprema';

UPDATE categories SET
  seo_title = 'Najam opreme za evente u Zagrebu | rentanje.com',
  seo_description = 'Iznajmite stolove, klupe, šatore, igre i opremu za zabavu. Sve za vjenčanja, rođendane i evente. Brza dostava u Zagrebu!'
WHERE slug = 'oprema-za-evente';

UPDATE categories SET
  seo_title = 'Najam roštilja i opreme za kuhanje | rentanje.com',
  seo_description = 'Iznajmite vertikalni roštilj, peku, kotlovinu, ražanj i drugu BBQ opremu. Brza dostava u Zagrebu i okolici!'
WHERE slug = 'rostilj-kuhanje';

UPDATE categories SET
  seo_title = 'Najam kamp opreme u Zagrebu | rentanje.com',
  seo_description = 'Iznajmite šatore, madrace, kuhala, hladnjake i outdoor opremu za kampiranje. Sve za vikend avanture u prirodi!'
WHERE slug = 'kamp-outdoor';

UPDATE categories SET
  seo_title = 'Najam alata i opreme za čišćenje | rentanje.com',
  seo_description = 'Iznajmite Kärcher Puzzi, usisavače, pranje tepiha i drugu opremu za čišćenje. Profesionalna kvaliteta, povoljne cijene!'
WHERE slug = 'alati-ciscenje';

UPDATE categories SET
  seo_title = 'Ostala oprema za iznajmljivanje | rentanje.com',
  seo_description = 'Pregledajte specijalnu opremu za iznajmljivanje koja ne spada u standardne kategorije. Pošaljite upit danas!'
WHERE slug = 'ostalo';
