-- ============================================================
-- 016_import_sklopivi_stol_kampiranje.sql
--
-- Imports one new SEO product from
-- public/rentanje_sklopivi_stol_kampiranje_SEO.xlsx:
--   "Sklopivi Stol za Kampiranje s 4 Stolice – Za 4-6 osoba"
--
-- Notes:
--   * category   → kamp-outdoor ("Kamp i outdoor oprema"); the
--     Excel "Kampiranje" maps to this seeded category.
--   * price_*    → placeholder (price_per_7days = 0); admin sets
--     real prices later via the admin panel.
--   * is_active  → false: HIDDEN from the public site until admin
--     fills in pricing and uploads hero/gallery images.
--
-- Idempotent: ON CONFLICT (slug) DO UPDATE refreshes the SEO copy
-- without touching pricing, images or the is_active flag.
-- ============================================================

INSERT INTO products (
  name, slug, category_id, short_desc, description,
  seo_title, seo_description, seo_keywords, faq,
  min_rental_days, price_per_day, price_per_3days, price_per_7days,
  stock_qty, is_active, is_available, is_featured, sort_order
)
VALUES (
  'Sklopivi Stol za Kampiranje s 4 Stolice – Za 4-6 osoba',
  'sklopivi-stol-kampiranje-4-stolice-najam',
  (SELECT id FROM categories WHERE slug = 'kamp-outdoor'),
  'Kompletni set: sklopivi stol s laminiranom pločom i 4 stolice za 4-6 osoba. Podesiva visina, kompaktno sklapanje, 2 ručke za nošenje.',
  E'Sklopivi stol za kampiranje s 4 stolice – kompletno rješenje za blagovanje na otvorenom za 4 do 6 osoba!\n\n**Što dobivate:**\n- Stabilan sklopivi stol s laminiranom pločom (120 x 60 cm) i aluminijskim okvirom\n- 4 sklopive stolice koje se spremaju ispod ploče stola\n- Podesiva visina (45 ili 70 cm) – za sjedenje na stolicama ili na tlu\n- 2 ručke za nošenje + kompaktno sklapanje (samo ~38 l, 60 x 60 cm)\n- Čelične noge i izdržljiva konstrukcija (Quechua)\n\nCijeli set stane u jedan kompaktan paket koji ponesete bilo gdje. Idealno za kampiranje, piknik, festivale, plažu i vrtne zabave. Stol nosi do 50 kg, svaka stolica do 110 kg.',
  'Najam Sklopivog Stola s 4 Stolice | Kampiranje | rentanje.com',
  'Iznajmite sklopivi stol za kampiranje s 4 stolice (4-6 osoba) – podesiva visina, kompaktno sklapanje, 2 ručke. Za kamp, piknik i festivale!',
  '{"stol za kampiranje najam","sklopivi stol rent","stol i stolice iznajmljivanje","kamping stol najam zagreb"}',
  '[{"question": "Za koliko osoba je set?", "answer": "Stol i 4 stolice udobno primaju 4 osobe, a po potrebi i do 6 osoba oko stola."}, {"question": "Što je sve uključeno?", "answer": "Sklopivi stol s laminiranom pločom (120 x 60 cm) i 4 sklopive stolice koje se spremaju ispod ploče stola."}, {"question": "Koliko je kompaktan za transport?", "answer": "Sklopljen zauzima samo ~38 l (60 x 60 x 10,5 cm) i ima 2 ručke za lako nošenje – stane u prtljažnik."}, {"question": "Mogu li podesiti visinu stola?", "answer": "Da, visina je podesiva na 45 ili 70 cm – više za klasično sjedenje, niže za sjedenje na tlu ili dekama."}, {"question": "Koliku težinu podnosi?", "answer": "Ploča stola nosi do 50 kg, a svaka stolica do 110 kg. Stabilna čelična konstrukcija s aluminijskim okvirom."}]'::jsonb,
  1, NULL, NULL, 0, 1, false, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;
