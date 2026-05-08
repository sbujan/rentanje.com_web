-- ============================================================
-- 012_import_new_products.sql
-- Import 30 new products (rental catalog expansion).
--
-- All products are inserted with:
--   * category_id  = NULL          (admin assigns category later)
--   * hero_image_url = NULL        (admin uploads hero image later)
--   * images       = NULL          (admin uploads gallery later)
--   * price_*      = 0.00          (placeholder; admin sets real prices)
--   * deposit_amount = 0.00        (placeholder; admin sets real amount)
--   * is_active    = false         (HIDDEN from public site until admin
--                                   finishes setup and flips this flag)
--
-- The migration is idempotent: ON CONFLICT DO NOTHING on every insert.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Tags used by some of the new products
-- ────────────────────────────────────────────────────────────

INSERT INTO tags (name, slug, color) VALUES
  ('Najpopularnije', 'najpopularnije', '#F05554'),
  ('Za vjenčanja',   'za-vjencanja',   '#6366F1'),
  ('Profesionalno',  'profesionalno',  '#0EA5E9')
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 1. Fujifilm Instax Mini EVO – Hibridna instant kamera
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Fujifilm Instax Mini EVO – Hibridna instant kamera',
  'fujifilm-instax-mini-evo-najam',
  'Hibridna instant kamera s 10 efekata leće i 10 efekata filma – 100 kreativnih kombinacija! Ispisuje retro fotografije na licu mjesta.',
  E'Fujifilm Instax Mini EVO – hibridna instant kamera koja spaja digitalni i analogni svijet fotografije.\n\n**Što dobivate:**\n- 10 efekata leće + 10 efekata filma = 100 kreativnih kombinacija\n- LCD ekran za pregled i odabir prije ispisa\n- Bluetooth povezivanje sa smartphoneom za ispis s mobitela\n- Elegantan retro dizajn, samo 285 g\n- Baterija za ~100 ispisa po punjenju\n\nIspisuje na Instax Mini film – male, šarmantne fotografije savršene za vjenčanja, rođendane i evente.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 0.285, '8.7 x 12.3 x 3.6 cm',
  'Najam Fujifilm Instax Mini EVO | Instant kamera | rentanje.com',
  'Iznajmite Fujifilm Instax Mini EVO – hibridna instant kamera, 100 kreativnih efekata, Bluetooth ispis. Za vjenčanja i evente!',
  ARRAY['instax najam', 'instant kamera rent', 'Fujifilm Instax iznajmljivanje', 'photobooth kamera najam zagreb'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Fujifilm Instax Mini EVO – Hibridna instant kamera',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Fujifilm')
  ),
  100
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'fujifilm-instax-mini-evo-najam'), id
FROM tags WHERE slug IN ('za-vjencanja', 'najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 2. DJI Neo Motion Fly More Combo – Selfie dron 135g
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'DJI Neo Motion Fly More Combo – Selfie dron 135 g',
  'dji-neo-motion-fly-more-combo-najam',
  'Najlakši DJI dron od samo 135 g s palm takeoff, 4K kamerom, AI praćenjem i FPV naočalama. Leti s dlana – bez kontrolera!',
  E'DJI Neo Motion Fly More Combo – revolucionaran selfie dron koji polijeće s dlana!\n\n**Što dobivate:**\n- DJI Neo dron (samo 135 g) + DJI Goggles N3 + RC Motion 3\n- 3 baterije za ukupno ~54 minute leta\n- 4K/30fps stabiliziran video + 12 MP fotografije\n- AI praćenje subjekta + 6 QuickShots modova\n- Potpuno zatvoreni zaštitnici propelera (sigurno i indoor)\n- Glasovno upravljanje, Wi-Fi kontrola, 22 GB memorije\n\nPalm takeoff – polijeće s dlana jednim pritiskom. Idealan za vlogove, evente i kreativne snimke.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 0.135, '13 x 15.7 x 4.9 cm',
  'Najam DJI Neo Motion Fly More | Selfie dron 135 g | rentanje.com',
  'Iznajmite DJI Neo – 135 g selfie dron, 4K video, palm takeoff, FPV naočale, 3 baterije. Za vlogove, evente i zabavu!',
  ARRAY['DJI Neo najam', 'selfie dron rent', 'mali dron iznajmljivanje', 'FPV dron najam zagreb'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'DJI Neo Motion Fly More Combo – Selfie dron 135 g',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'DJI')
  ),
  110
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'dji-neo-motion-fly-more-combo-najam'), id
FROM tags WHERE slug IN ('najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 3. DJI Avata 2 Fly More Combo – FPV dron
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'DJI Avata 2 Fly More Combo – FPV dron',
  'dji-avata-2-fly-more-combo-fpv-dron-najam',
  'Imerzivni FPV dron s 4K/100fps kamerom, ugrađenim zaštitnicima propelera i Goggles 3 naočalama. Letite kao ptica!',
  E'DJI Avata 2 Fly More Combo – ultimativni FPV dron za imerzivno letenje!\n\n**Što dobivate:**\n- DJI Avata 2 dron + Goggles 3 (Micro-OLED) + RC Motion 3\n- 3 baterije za ~69 minuta ukupnog leta\n- 1/1.3" senzor, 4K pri 100fps, 155° FOV\n- Ugrađeni zaštitnici propelera za sigurnost\n- EasyACRO – barrel rollovi i flipovi jednim pritiskom\n\nIskusite letenje iz ptičje perspektive s kristalno jasnim prijenosom slike u realnom vremenu.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 0.377, '18.5 x 16.4 x 8 cm',
  'Najam DJI Avata 2 Fly More | FPV dron | rentanje.com',
  'Iznajmite DJI Avata 2 – FPV dron s Goggles 3, 4K/100fps, zaštićeni propeleri, 3 baterije. Letite kao nikad prije!',
  ARRAY['DJI Avata najam', 'FPV dron rent', 'imerzivni dron iznajmljivanje', 'dron s naočalama najam zagreb'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'DJI Avata 2 Fly More Combo – FPV dron',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'DJI')
  ),
  120
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'dji-avata-2-fly-more-combo-fpv-dron-najam'), id
FROM tags WHERE slug IN ('profesionalno')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 4. Šator za 3 osobe – Kompaktni camping šator
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Šator za 3 osobe – Kompaktni camping šator',
  'sator-za-3-osobe-camping-najam',
  'Kompaktni šator za 3 osobe s Fresh&Black tehnologijom za tamno i hladno unutra. Lako postavljanje za camping i festivale.',
  E'Kompaktni šator za 3 osobe – idealan za vikend kampiranje i festivale!\n\n**Što dobivate:**\n- Šator za 3 osobe s Fresh&Black tehnologijom\n- Vodootporna konstrukcija\n- Ventilacijski otvori za protok zraka\n- Brzo i jednostavno postavljanje (10–15 min)\n- Lagan i kompaktan za transport',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 4.0, '210 x 170 x 115 cm',
  'Najam Šatora za 3 osobe | Camping šator | rentanje.com',
  'Iznajmite šator za 3 osobe – vodootporan, Fresh&Black, lako postavljanje. Za kampiranje, festivale i vikend avanture!',
  ARRAY['najam šatora', 'camping šator rent', 'šator za 3 osobe iznajmljivanje', 'festival šator najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Šator za 3 osobe – Kompaktni camping šator'
  ),
  130
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 5. SUP – Stand Up Paddle na napuhavanje
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'SUP – Stand Up Paddle na napuhavanje',
  'sup-stand-up-paddle-najam',
  'SUP daska na napuhavanje s veslom, pumpom i ruksakom. Za jezera, more i rijeke – sport i relaksacija na vodi!',
  E'SUP (Stand Up Paddle) daska na napuhavanje – najam za jezera, more i rijeke!\n\n**Što dobivate:**\n- SUP daska na napuhavanje (~350 cm)\n- Podesivo veslo\n- Ručna pumpa + sigurnosni leash + fin\n- Transportni ruksak\n\nStabilna i izdržljiva, pogodna za početnike i iskusne. Idealno za Jarun, Bundek i jadransku obalu.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 10.0, '350 x 84 x 15 cm',
  'Najam SUP Daske | Stand Up Paddle | rentanje.com',
  'Iznajmite SUP dasku na napuhavanje – veslo, pumpa i ruksak uključeni! Za jezera, more i rijeke.',
  ARRAY['SUP najam', 'stand up paddle rent', 'paddle board iznajmljivanje', 'SUP daska najam zagreb'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'SUP – Stand Up Paddle na napuhavanje',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Mistral')
  ),
  140
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'sup-stand-up-paddle-najam'), id
FROM tags WHERE slug IN ('najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 6. Camping paket – Šator za 4 osobe + 2 madraca + pumpa
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Camping paket – Šator za 4 osobe + 2 madraca + pumpa',
  'camping-paket-sator-4-osobe-madraci-pumpa-najam',
  'Kompletni camping paket: šator za 4 osobe, 2 zračna madraca i električna pumpa. Sve za udobno kampiranje u jednom najmu!',
  E'Kompletni camping paket – krenite na avanturu bez kupovine opreme!\n\n**Što dobivate:**\n- Šator za 4 osobe s Fresh&Black tehnologijom\n- 2 udobna zračna madraca\n- Električna pumpa za brzo napuhavanje\n\nSve zajedno pruža udoban, gotov-za-kampiranje set.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 12.0, 'šator + 2 madraca',
  'Najam camping paketa | Šator + madraci + pumpa | rentanje.com',
  'Iznajmite camping paket – šator za 4, 2 zračna madraca i el. pumpa! Sve za udobno kampiranje bez kupovine opreme.',
  ARRAY['camping paket najam', 'šator i madraci rent', 'kampiranje oprema iznajmljivanje', 'camping set najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Camping paket – Šator za 4 osobe + 2 madraca + pumpa'
  ),
  150
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 7. SpyraThree vodeni pištolj – Crveni
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'SpyraThree vodeni pištolj – Crveni',
  'spyrathree-vodeni-pistolj-crveni-najam',
  'Najnapredniji električni vodeni pištolj na svijetu! Automatsko punjenje, digitalni displej, domet do 15 m. Vodena zabava na steroidima!',
  E'SpyraThree – najnapredniji električni vodeni pištolj na svijetu!\n\n**Što dobivate:**\n- Domet do 15 metara s koncentriranim vodenim mecima\n- Automatsko punjenje iz vode u 0,6 s po metku\n- Spremnik za 30 metaka (22 ml po metku)\n- LCD displej (preostali meci + baterija)\n- 3 moda: Single, Burst, Open Surge\n- IPX7 vodootpornost, USB-C punjenje, ~1500 ispucavanja\n\nPretvara svaku ljetnu zabavu u epsku vodenu bitku!',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 0.85, '47 x 8 x 22 cm',
  'Najam SpyraThree vodenog pištolja – Crveni | rentanje.com',
  'Iznajmite SpyraThree – električni vodeni pištolj, domet 15 m, auto-punjenje, LCD displej. Epska vodena zabava!',
  ARRAY['vodeni pištolj najam', 'SpyraThree rent', 'električni vodeni pištolj najam', 'ljetna zabava oprema'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'SpyraThree vodeni pištolj – Crveni',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Spyra')
  ),
  160
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'spyrathree-vodeni-pistolj-crveni-najam'), id
FROM tags WHERE slug IN ('najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 8. SpyraThree vodeni pištolj – Plavi
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'SpyraThree vodeni pištolj – Plavi',
  'spyrathree-vodeni-pistolj-plavi-najam',
  'Plava verzija najnaprednijeg električnog vodenog pištolja! Domet 15 m, auto-punjenje, LCD displej. Savršen za timske bitke!',
  E'SpyraThree u plavoj boji – isti nevjerojatni električni vodeni pištolj, savršen za protivnički tim!\n\nKombinirajte s crvenom verzijom za epske timske vodene bitke. Identične specifikacije: domet 15 m, 30 metaka, LCD displej, 3 moda pucanja, IPX7, USB-C punjenje, ~1500 ispucavanja.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 0.85, '47 x 8 x 22 cm',
  'Najam SpyraThree plavi vodeni pištolj | rentanje.com',
  'Iznajmite SpyraThree plavi – električni vodeni pištolj za timske bitke! Domet 15 m, 30 metaka, auto-punjenje.',
  ARRAY['SpyraThree plavi najam', 'vodeni pištolj rent', 'timska vodena igra najam', 'Spyra blue iznajmljivanje'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'SpyraThree vodeni pištolj – Plavi',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Spyra')
  ),
  170
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'spyrathree-vodeni-pistolj-plavi-najam'), id
FROM tags WHERE slug IN ('najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 9. JBL bežični mikrofoni (par) – Za karaoke i evente
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'JBL bežični mikrofoni (par) – Za karaoke i evente',
  'jbl-bezicni-mikrofoni-par-najam',
  'Par JBL bežičnih mikrofona za karaoke, govore i nastupe. Plug & play – spojite na JBL zvučnik i pjevajte!',
  E'Par JBL bežičnih mikrofona – savršen za karaoke, govore i evente!\n\n**Što dobivate:**\n- 2 bežična mikrofona\n- Plug & play spajanje na JBL PartyBox zvučnike\n- Profesionalna kvaliteta zvuka\n- Sloboda kretanja bez kablova\n\nIdealno za karaoke večeri, vjenčanja, prezentacije i live nastupe.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 0.5, '25 x 5 x 5 cm',
  'Najam JBL bežičnih mikrofona (par) | rentanje.com',
  'Iznajmite par JBL bežičnih mikrofona – za karaoke, vjenčanja i evente! Plug & play, profesionalan zvuk.',
  ARRAY['bežični mikrofon najam', 'JBL mikrofon rent', 'karaoke mikrofon iznajmljivanje', 'mikrofon za event najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'JBL bežični mikrofoni (par) – Za karaoke i evente',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'JBL')
  ),
  180
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'jbl-bezicni-mikrofoni-par-najam'), id
FROM tags WHERE slug IN ('za-vjencanja')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 10. Vertikalni kebab roštilj 1800 W
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Vertikalni kebab roštilj 1800 W',
  'vertikalni-kebab-rostilj-najam',
  'Električni vertikalni roštilj za kebab, gyros i shawarmu od 1800–2000 W. Pravi döner kebab kod kuće!',
  E'Vertikalni kebab roštilj – autentičan döner kebab, gyros ili shawarma kod kuće!\n\n**Što dobivate:**\n- Električni vertikalni roštilj 1800–2000 W\n- Rotirajući ražanj od nehrđajućeg čelika\n- Kapacitet 2–5 kg mesa (10–20+ porcija)\n\nZa kućne zabave, street food evente i festivale.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 5.0, '35 x 35 x 50 cm',
  'Najam vertikalnog kebab roštilja | Döner kod kuće | rentanje.com',
  'Iznajmite vertikalni kebab roštilj – 1800 W, za pravi döner, gyros i shawarmu! Za zabave i street food evente.',
  ARRAY['kebab roštilj najam', 'vertikalni roštilj rent', 'döner aparat iznajmljivanje', 'gyros roštilj najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Vertikalni kebab roštilj 1800 W',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Klarstein')
  ),
  190
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 11. Fröbel Tower – Timska igra koordinacije
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Fröbel Tower – Timska igra koordinacije',
  'froebel-tower-timska-igra-najam',
  'Timska igra koordinacije za 2–24 igrača! Svi zajedno upravljaju kranom pomoću uzica da slože toranj. Savršena za team building!',
  E'Fröbel Tower – fantastična timska igra koordinacije!\n\n**Kako se igra:**\nDrveni kran spojen je na više uzica – svaki igrač drži jednu. Tim mora koordinirano upravljati kranom da pokupi blokove i složi toranj.\n\nZa 2–24 igrača. Zahtijeva komunikaciju, strpljenje i timski rad. Savršena za korporativne evente, radionice i škole.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 2.0, '30 x 30 x 15 cm',
  'Najam Fröbel Tower timske igre | Team building | rentanje.com',
  'Iznajmite Fröbel Tower – timska igra koordinacije za 2–24 igrača! Za team building, škole i korporativne evente.',
  ARRAY['team building igra najam', 'Fröbel Tower rent', 'timska igra iznajmljivanje', 'korporativna igra najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Fröbel Tower – Timska igra koordinacije'
  ),
  200
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 12. Veliki Connect 4 (4 u nizu) – Drvena igra
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Veliki Connect 4 (4 u nizu) – Drvena igra',
  'veliki-connect-4-drvena-igra-najam',
  'Velika drvena verzija klasične igre „4 u nizu"! Impresivna veličina za vrtne zabave, vjenčanja i evente.',
  E'Giant Connect 4 – velika drvena verzija popularne igre „4 u nizu"!\n\nDva igrača ubacuju diskove u okomiti okvir, pokušavajući spojiti 4 u nizu. Velika veličina čini igru spektakularnom za vrtne zabave i evente. Kvalitetna drvena izrada.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 8.0, '60 x 50 x 15 cm',
  'Najam Velikog Connect 4 | Drvena igra | rentanje.com',
  'Iznajmite Giant Connect 4 – veliku drvenu igru „4 u nizu" za vrtne zabave, vjenčanja i evente!',
  ARRAY['veliki connect 4 najam', '4 u nizu igra rent', 'giant connect four iznajmljivanje', 'outdoor igre najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Veliki Connect 4 (4 u nizu) – Drvena igra'
  ),
  210
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 13. Ring Toss – Igra bacanja prstenova
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Ring Toss – Igra bacanja prstenova',
  'ring-toss-igra-bacanja-prstenova-najam',
  'Klasična outdoor igra bacanja prstenova na kolce! Za sve uzraste – jednostavna, zabavna i natjecateljska.',
  E'Ring Toss – klasična igra bacanja prstenova na kolce!\n\nIgrači bacaju prstenove na kolce različitih vrijednosti. Jednostavna pravila, ali preciznost je ključ. Za sve uzraste, savršena za vrtne zabave, piknik i evente.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 1.5, '40 x 40 x 30 cm',
  'Najam Ring Toss igre | Bacanje prstenova | rentanje.com',
  'Iznajmite Ring Toss – igru bacanja prstenova za vrtne zabave i evente! Za sve uzraste.',
  ARRAY['ring toss najam', 'igra bacanja prstenova rent', 'outdoor igre najam', 'party igra iznajmljivanje'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Ring Toss – Igra bacanja prstenova'
  ),
  220
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 14. Softarchery set – Luk i strijela za zabavu
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Softarchery set – Luk i strijela za zabavu',
  'softarchery-luk-strijela-najam',
  'Siguran set za streljaštvo s mekanim strelicama! Za djecu i odrasle – outdoor zabava bez rizika.',
  E'Softarchery set – sigurna verzija streljaštva s lukom i mekanim strelicama!\n\n**Što dobivate:**\n- Luk dizajniran za lagano povlačenje\n- Mekane strelice s vakuumskim vrhovima\n- Meta za sigurno gađanje\n\nIdealno za dječje rođendane, team building i outdoor evente.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 1.0, '70 x 20 x 10 cm',
  'Najam Softarchery seta | Luk i strijela | rentanje.com',
  'Iznajmite Softarchery – siguran luk i mekane strelice za djecu i odrasle! Za rođendane i team building.',
  ARRAY['luk i strijela najam', 'softarchery rent', 'streljaštvo za djecu najam', 'outdoor igra iznajmljivanje'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Softarchery set – Luk i strijela za zabavu'
  ),
  230
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 15. Fingerdisc – Moderna igra boćanja
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Fingerdisc – Moderna igra boćanja',
  'fingerdisc-bocanje-igra-najam',
  'Moderan twist na klasično boćanje! Bacajte diskove prema meti – preciznost i strategija za outdoor zabavu.',
  E'Fingerdisc – moderna outdoor igra inspirirana boćanjem!\n\nUmjesto kugli, bacaju se ergonomski diskovi prema meti (jacku). Kombinira preciznost, strategiju i zabavu. Za 2–8 igrača, sve outdoor površine.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 0.8, '30 x 20 x 10 cm',
  'Najam Fingerdisc igre | Moderno boćanje | rentanje.com',
  'Iznajmite Fingerdisc – modernu igru boćanja s diskovima! Za 2–8 igrača, outdoor zabava.',
  ARRAY['fingerdisc najam', 'boćanje igra rent', 'outdoor igra iznajmljivanje', 'disc game najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Fingerdisc – Moderna igra boćanja'
  ),
  240
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 16. Badminton set s mrežom
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Badminton set s mrežom',
  'badminton-set-mreza-najam',
  'Kompletni badminton set s mrežom, reketima i lopticama. Postavi i igraj – za vrt, plažu i park!',
  E'Kompletni badminton set – mreža, reketi i loptice!\n\nBrzo postavljanje bez alata. Za obiteljska druženja, vikende na otvorenom, team building i ljetne zabave.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 3.0, 'mreža 3 m + reketi',
  'Najam badminton seta s mrežom | rentanje.com',
  'Iznajmite badminton set – mreža, reketi i loptice! Za vrt, plažu i park. Zabava za sve uzraste.',
  ARRAY['badminton set najam', 'badminton mreža rent', 'outdoor sport iznajmljivanje', 'badminton oprema najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Badminton set s mrežom'
  ),
  250
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 17. Soft Play set + napuhanac (Bouncy Castle)
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Soft Play set + napuhanac (Bouncy Castle)',
  'soft-play-napuhanac-bouncy-castle-najam',
  'Mekani igrački set i napuhanac za najmlađe! Siguran, šaren i zabavan – savršen za dječje rođendane i evente.',
  E'Soft Play set s napuhancem – savršen za dječje rođendane i evente!\n\n**Što dobivate:**\n- Mekani PVC elementi u živim bojama\n- Napuhanac (bouncy castle) za skakanje\n- Električni ventilator za neprekidno napuhavanje\n\nSvi elementi mekani i sigurni, bez oštrih rubova. Za djecu 2–10 godina.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 25.0, 'ovisno o modelu',
  'Najam Soft Play seta + napuhanca | Dječja zabava | rentanje.com',
  'Iznajmite soft play set i napuhanac – sigurna zabava za djecu! Za rođendane i evente.',
  ARRAY['napuhanac najam', 'bouncy castle rent', 'soft play iznajmljivanje', 'dječji rođendan oprema najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Soft Play set + napuhanac (Bouncy Castle)'
  ),
  260
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'soft-play-napuhanac-bouncy-castle-najam'), id
FROM tags WHERE slug IN ('najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 18. Plinski plamenik za kampiranje
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Plinski plamenik za kampiranje',
  'plinski-plamenik-kampiranje-najam',
  'Kompaktno plinsko kuhalo za kampiranje i outdoor kuhanje. Jednostavno, pouzdano i prijenosno!',
  E'Kompaktno plinsko kuhalo za pripremu obroka u prirodi.\n\nJednostavno spajanje na standardnu plinsku bočicu, stabilno i pouzdano. Za kampiranje, piknik i festivale.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 1.0, '25 x 25 x 10 cm',
  'Najam plinskog plamenika za kampiranje | rentanje.com',
  'Iznajmite plinsko kuhalo za kampiranje – kompaktno, pouzdano i prijenosno! Za outdoor kuhanje.',
  ARRAY['plinsko kuhalo najam', 'camping plamenik rent', 'outdoor kuhalo iznajmljivanje', 'kampiranje oprema najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Plinski plamenik za kampiranje'
  ),
  270
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 19. Baklja za roštilj – Plinski plamenik
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Baklja za roštilj – Plinski plamenik',
  'baklja-za-rostilj-plamenik-najam',
  'Profesionalna plinska baklja za brzo paljenje roštilja i ugljena. Palite ugljen u minutama, ne satima!',
  E'Profesionalna baklja za roštilj – ugljen za 2–5 minuta umjesto 20–30!\n\nSnažan, usmjeren plamen bez tekućine za potpalu. Također za karamelizaciju, searing i paljenje vatre.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 0.5, '30 x 10 x 8 cm',
  'Najam baklje za roštilj | Plinski plamenik | rentanje.com',
  'Iznajmite baklju za roštilj – zapalite ugljen u minutama! Profesionalni plinski plamenik za BBQ.',
  ARRAY['baklja za roštilj najam', 'plamenik za ugljen rent', 'BBQ plamenik iznajmljivanje'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Baklja za roštilj – Plinski plamenik',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Bernzomatic')
  ),
  280
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 20. Aparat za slushie i margaritu
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Aparat za slushie i margaritu',
  'aparat-za-slushie-margaritu-najam',
  'Aparat za pripremu ledenih slushie napitaka, margarita i frozen koktela! Osvježenje za svaku zabavu.',
  E'Aparat za slushie i margaritu – ledeni kokteli za zabave!\n\nUbacite sastojke, uključite – aparat automatski priprema glatke frozen napitke. I bezalkoholne varijante za djecu: smrznuti sokovi, ledeni čaj, smoothiji.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 5.0, '40 x 25 x 35 cm',
  'Najam aparata za slushie i margaritu | rentanje.com',
  'Iznajmite aparat za slushie i margaritu – frozen kokteli za zabave! Za pool party, rođendane i evente.',
  ARRAY['slushie aparat najam', 'margarita mašina rent', 'frozen koktel aparat iznajmljivanje', 'party piće najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Aparat za slushie i margaritu',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Ninja')
  ),
  290
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'aparat-za-slushie-margaritu-najam'), id
FROM tags WHERE slug IN ('najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 21. Ninja Creami – Aparat za domaći sladoled
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Ninja Creami – Aparat za domaći sladoled',
  'ninja-creami-aparat-sladoled-najam',
  'Napravite domaći sladoled, sorbet i frozen yogurt za par minuta! Ninja Creami pretvara zamrznute baze u kremaste slastice.',
  E'Ninja Creami – revolucionaran aparat za domaći sladoled!\n\n**Kako radi:**\n1. Pripremite bazu (mlijeko, voće, jogurt…)\n2. Zamrznite 24 sata\n3. Stavite u Ninja Creami – kremast sladoled za par minuta!\n\nPotpuna kontrola nad sastojcima. Za ljetne zabave, rođendane i zdrave slastice.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 5.5, '38 x 23 x 35 cm',
  'Najam Ninja Creami aparata za sladoled | rentanje.com',
  'Iznajmite Ninja Creami – domaći sladoled, sorbet i frozen yogurt za minute! Za zabave i rođendane.',
  ARRAY['aparat za sladoled najam', 'Ninja Creami rent', 'domaći sladoled aparat iznajmljivanje'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Ninja Creami – Aparat za domaći sladoled',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Ninja')
  ),
  300
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 22. Prijenosni ratan stol s 2 klupe – Za 6 osoba
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Prijenosni ratan stol s 2 klupe – Za 6 osoba',
  'prijenosni-ratan-stol-klupe-6-osoba-najam',
  'Elegantan sklopivi ratan set stola i 2 klupe za do 6 osoba. Za vrtne zabave, piknik i outdoor evente.',
  E'Prijenosni ratan set stola i 2 klupe za 6 osoba.\n\nSklopiva konstrukcija u ratan stilu – moderan izgled uz praktičnost. 3 osobe po klupi. Za manja vrtna druženja, piknik i evente.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 15.0, '180 x 75 x 75 cm',
  'Najam ratan stola i klupa za 6 osoba | rentanje.com',
  'Iznajmite prijenosni ratan stol i 2 klupe za 6 osoba – sklopiv, elegantan, za vrtne zabave!',
  ARRAY['najam stola za 6', 'ratan namještaj rent', 'prijenosni stol iznajmljivanje', 'sklopivi stol najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Prijenosni ratan stol s 2 klupe – Za 6 osoba'
  ),
  310
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 23. Philips Pasta Maker – Aparat za domaću tjesteninu
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Philips Pasta Maker – Aparat za domaću tjesteninu',
  'philips-pasta-maker-najam',
  'Napravite svježu domaću tjesteninu za 10 minuta! Automatsko miješanje, gnječenje i ekstrudiranje – jednostavno i brzo.',
  E'Philips Pasta Maker – svježa domaća tjestenina za 10 minuta!\n\n**Što dobivate:**\n- Automatsko miješanje, gnječenje i ekstrudiranje\n- Kalupi: špageti, penne, fettuccine, lasagne i više\n- Svježa tjestenina se kuha samo 2–3 min\n\nZa dinner partye, kulinarske radionice i obiteljska kuhanja.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 7.5, '30 x 20 x 35 cm',
  'Najam Philips Pasta Makera | Domaća tjestenina | rentanje.com',
  'Iznajmite Philips Pasta Maker – svježa domaća tjestenina za 10 min! Za dinner partye i radionice.',
  ARRAY['pasta maker najam', 'aparat za tjesteninu rent', 'Philips Pasta Maker iznajmljivanje'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Philips Pasta Maker – Aparat za domaću tjesteninu',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Philips')
  ),
  320
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 24. Kubb Viking igra – Drvena outdoor igra
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Kubb Viking igra – Drvena outdoor igra',
  'kubb-viking-igra-najam',
  'Tradicionalna skandinavska drvena igra za 2–12 igrača. Strategija, preciznost i zabava – za parkove i dvorišta.',
  E'Kubb – tradicionalna skandinavska drvena igra („Viking šah"). Oborite protivničke kubbove štapovima, pa srušite kralja. Za 2–12 igrača, parkove, plaže i team building.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 3.0, '30 x 20 x 15 cm',
  'Najam Kubb Viking igre | rentanje.com',
  'Iznajmite Kubb Viking igru za 2–12 igrača! Za parkove, plaže i team building.',
  ARRAY['kubb najam', 'viking igra rent', 'outdoor igre najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Kubb Viking igra – Drvena outdoor igra'
  ),
  330
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 25. Ladder Golf – Igra bacanja bola
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Ladder Golf – Igra bacanja bola',
  'ladder-golf-igra-najam',
  'Outdoor igra bacanja bola prema ljestvici s tri prečke. Jednostavna, zabavna i natjecateljska!',
  E'Ladder Golf – bacanje bola prema ljestvici. Gornja prečka 3 boda, srednja 2, donja 1. Do 21 boda. Za 2–4 igrača.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 3.0, '60 x 40 x 10 cm',
  'Najam Ladder Golf igre | rentanje.com',
  'Iznajmite Ladder Golf za outdoor zabavu! Za 2–4 igrača.',
  ARRAY['ladder golf najam', 'bola igra rent', 'outdoor igre najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Ladder Golf – Igra bacanja bola'
  ),
  340
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 26. Spikeball – Dinamična igra za 4 igrača
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Spikeball – Dinamična igra za 4 igrača',
  'spikeball-igra-najam',
  'Dinamična outdoor igra koja kombinira odbojku i foursquare. Za plažu, park i team building!',
  E'Spikeball – 2 tima po 2 igrača udaraju loptu o trampolinsku mrežu. Kombinira odbojku i foursquare, 360° akcija. Za plažu i team building.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 1.5, 'mreža + loptice u torbi',
  'Najam Spikeball seta | rentanje.com',
  'Iznajmite Spikeball – dinamična igra za 4 igrača! Za plažu i team building.',
  ARRAY['spikeball najam', 'spike ball rent', 'outdoor igre najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Spikeball – Dinamična igra za 4 igrača',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Spikeball')
  ),
  350
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'spikeball-igra-najam'), id
FROM tags WHERE slug IN ('najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 27. Velika Jenga (Giant Jenga)
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Velika Jenga (Giant Jenga)',
  'velika-jenga-giant-jenga-igra-najam',
  'Velika verzija klasične Jenge s drvenim blokovima do 150 cm! Spektakularna igra za outdoor evente.',
  E'Giant Jenga – velika verzija klasične igre, raste do 150 cm! Izvlačite blokove, slažite na vrh – tko sruši toranj, gubi! Spektakularna za evente.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 8.0, '60 x 20 x 20 cm (pakirana)',
  'Najam Velike Jenge | rentanje.com',
  'Iznajmite Giant Jenga – veliku drvenu igru za outdoor zabave!',
  ARRAY['velika jenga najam', 'giant jenga rent', 'outdoor igre najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Velika Jenga (Giant Jenga)'
  ),
  360
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'velika-jenga-giant-jenga-igra-najam'), id
FROM tags WHERE slug IN ('najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 28. Beer Pong stol s čašama
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Beer Pong stol s čašama',
  'beer-pong-stol-case-najam',
  'Komplet za najpopularniju party igru – sklopivi stol i čaše! Za kućne zabave, roštilj i team building.',
  E'Beer Pong komplet – stol i čaše, sve spremno za zabavu. Za kućne partye, roštilj i team building.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 7.0, '240 x 60 x 70 cm',
  'Najam Beer Pong stola | rentanje.com',
  'Iznajmite Beer Pong set za savršenu party zabavu!',
  ARRAY['beer pong najam', 'party igre rent', 'beer pong stol najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Beer Pong stol s čašama'
  ),
  370
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT (SELECT id FROM products WHERE slug = 'beer-pong-stol-case-najam'), id
FROM tags WHERE slug IN ('najpopularnije')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 29. Cornhole – Igra bacanja vrećica
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Cornhole – Igra bacanja vrećica',
  'cornhole-igra-najam',
  'Popularna outdoor igra bacanja vrećica za sve uzraste! Zarazno natjecanje za roštilj, vjenčanja i team building.',
  E'Cornhole – bacanje vrećica! U rupi 3 boda, na dasci 1. Do 21 boda. Za 2–4 igrača, sve uzraste i evente.',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 5.0, '120 x 60 x 15 cm',
  'Najam Cornhole igre | rentanje.com',
  'Iznajmite Cornhole za outdoor zabavu! Za sve uzraste.',
  ARRAY['cornhole najam', 'outdoor igre rent', 'party igre najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Cornhole – Igra bacanja vrećica'
  ),
  380
) ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 30. Peka – Tradicionalna peka za kuhanje
-- ────────────────────────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, short_desc, description,
  hero_image_url, images,
  price_per_day, price_per_3days, price_per_7days,
  min_rental_days, requires_deposit, deposit_amount, deposit_note,
  is_available, is_featured, is_active,
  stock_qty, weight_kg, dimensions_cm,
  seo_title, seo_description, seo_keywords, schema_json, sort_order
) VALUES (
  NULL,
  'Peka – Tradicionalna peka za kuhanje',
  'peka-tradicionalna-najam',
  'Tradicionalna peka za autentičnu pripremu janjetine, hobotnice i povrća pod žarom. Dalmatinsko iskustvo!',
  E'Tradicionalna peka za autentičnu pripremu jela pod žarom. Sporo kuhanje pod žeravom daje nevjerojatno sočno meso i povrće. Pravo dalmatinsko iskustvo!',
  NULL, NULL,
  0.00, 0.00, 0.00,
  1, true, 0.00,
  'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  true, false, false,
  1, 6.0, 'Ø 39 cm',
  'Najam peke | Tradicionalno kuhanje | rentanje.com',
  'Iznajmite peku za janjetinu i hobotnicu pod žarom! Dalmatinsko iskustvo.',
  ARRAY['peka najam', 'tradicionalna peka rent', 'kuhanje pod pekom najam'],
  jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Peka – Tradicionalna peka za kuhanje'
  ),
  390
) ON CONFLICT (slug) DO NOTHING;
