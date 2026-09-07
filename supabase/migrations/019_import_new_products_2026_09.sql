-- ============================================================
-- 019_import_new_products_2026_09.sql
--
-- Imports 4 new products with full SEO / GEO / AIO copy:
--   1. Šator za 4 osobe – Quechua Arpenaz 4.1 Fresh&Black (+ madrac, pumpa)
--   2. Prijenosni hladnjak 50 L – Klarstein PolarForce (kompresorski)
--   3. Tilta Hydra Alien Mini – auto nosač za kameru
--   4. Projekcijsko platno na tronošcu 172 × 172 cm (SBOX PSMT-96-2)
--
-- CONVENTIONS THIS FILE FOLLOWS (verified against the running app):
--   * description is rendered with dangerouslySetInnerHTML through
--     sanitizeHtml() (src/lib/sanitize.ts) — it is HTML, NOT markdown.
--     Older rows store markdown and render as one unformatted blob; these
--     four use real <p>/<h3>/<ul> so headings and bullets actually appear.
--   * dimensions_cm must NOT carry a "cm" suffix — ProductPage.tsx renders
--     `{dimensions_cm} cm`, so "43 x 33 x 46 cm" prints "… cm cm".
--     (Section 5 below repairs the 18 existing rows with that bug.)
--   * seo_title must be brand-free — the layout title template appends
--     " | rentanje.com" and cleanSeoTitle() strips any duplicate.
--   * schema_json feeds the Product JSON-LD `brand` (see extractBrand()).
--   * faq feeds the FAQPage JSON-LD + the on-page accordion. Answers are
--     written self-contained so an LLM can quote one without the question.
--
-- PRICING (supplied by the owner, 2026-09-07):
--   Šator   — min 3 dana; 3 dana 40 €, 7 dana 75 € (madrac + pumpa uključeni)
--   Hladnjak— 1 dan 30 €, 3 dana 50 €, 7 dana 75 €
--   Platno  — 1 dan 10 €, 3 dana 20 €, 7 dana 35 €
--   ⚠ Tilta — NO PRICE GIVEN. Inserted with a 0 placeholder and a price-free
--     seo_title. Set the real price in /admin/products, then either rewrite
--     the title as "Najam … — od X €/dan" or set seo_title = NULL to let the
--     app generate it live from the current price.
--
-- ⚠ ALL FOUR ARE INSERTED AS HIDDEN DRAFTS (is_active = false) because no
--   images are uploaded yet. To publish, in /admin/products:
--     1) upload hero_image_url + images (+ alt texts)
--     2) confirm price and stock
--     3) flip is_active = true
--
-- Idempotent: ON CONFLICT (slug) DO UPDATE refreshes the SEO copy only —
-- pricing, images and the is_active flag are never overwritten on re-run.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1) Šator za 4 osobe – Quechua Arpenaz 4.1 Fresh&Black
--    Deliberately positioned AGAINST the existing 4-person listing
--    (sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam = Arpenaz 4.2,
--    2 spavaonice, 2 madraca) to avoid cannibalising it: that one owns
--    "camping paket", this one owns "šator za 4 osobe / 1 spavaonica".
-- ------------------------------------------------------------
INSERT INTO products (
  name, slug, category_id, short_desc, description,
  seo_title, seo_description, seo_keywords, faq, schema_json,
  min_rental_days, price_per_day, price_per_3days, price_per_7days,
  requires_deposit, deposit_amount, deposit_note,
  weight_kg, dimensions_cm,
  stock_qty, is_active, is_available, is_featured, sort_order
) VALUES (
  'Šator za 4 osobe – Arpenaz 4.1 Fresh&Black + madrac i pumpa',
  'sator-arpenaz-41-fresh-black-4-osobe-najam',
  (SELECT id FROM categories WHERE slug = 'kamp-outdoor'),
  'Šator za 4 osobe s jednom velikom spavaonicom i Fresh&Black tehnologijom (99 % zamračenja). U najam dolazi s madracem na napuhavanje i pumpom.',
  '<p>Quechua Arpenaz 4.1 Fresh&amp;Black je šator za 4 osobe s jednom velikom spavaonicom, brzim postavljanjem i mrakom koji traje do kasnog jutra. U najam dolazi kompletno spreman — ne trebate kupovati ništa dodatno.</p>
<h3>Što dobivate</h3>
<ul>
<li>Šator za 4 osobe s jednom spavaonicom 240 × 210 cm</li>
<li>Madrac na napuhavanje i električna pumpa</li>
<li>Fresh &amp; Black tkanina — blokira 99 % svjetla i odbija sunce, pa je unutra mračno i osjetno hladnije nego u običnom šatoru</li>
<li>Dnevni boravak ~5 m² s visinom 190 cm — stoji se uspravno</li>
<li>Vodootporna nadstrešnica: 2000 mm vodenog stupa i toplinski zavareni šavovi</li>
<li>Šipke označene bojama — postavljanje oko 15 minuta u dvoje</li>
</ul>
<p>Idealan za vikend kampiranje, festivale, obiteljske izlete i roadtripove po Hrvatskoj. Spakiran zauzima 65 × 30 × 25 cm i lako stane u prtljažnik osobnog auta. Težina 10,6 kg.</p>
<p>Trebate dvije odvojene spavaonice? Pogledajte <a href="/najam/sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam">camping paket sa šatorom za 4 osobe i 2 madraca</a>. Za manju ekipu tu je <a href="/najam/sator-za-3-osobe-kampiranje-najam">šator za 3 osobe</a>, a uz njega dobro idu <a href="/najam/sklopivi-stol-kampiranje-4-stolice-najam">sklopivi stol sa stolicama</a> i <a href="/najam/plinski-plamenik-kampiranje-najam">plinski plamenik</a>.</p>',
  'Najam šatora Arpenaz 4.1 za 4 osobe — 40 €/3 dana',
  'Iznajmite šator za 4 osobe Arpenaz 4.1 Fresh&Black u Zagrebu — 40 € za 3 dana. Madrac i pumpa uključeni, postavljanje 15 min, vodootporan 2000 mm.',
  ARRAY[
    'najam šatora',
    'šator za 4 osobe najam',
    'arpenaz 4.1 najam',
    'šator fresh black iznajmljivanje',
    'šator za festival najam',
    'najam šatora zagreb'
  ],
  '[
    {"question":"Koliko osoba stane u šator?","answer":"Četiri odrasle osobe u jednoj spavaonici dimenzija 240 x 210 cm. Za dvoje ili troje s opremom je vrlo prostrano."},
    {"question":"Što je sve uključeno u najam?","answer":"Šator Quechua Arpenaz 4.1 Fresh&Black, madrac na napuhavanje i električna pumpa. Vreće za spavanje nisu uključene — javite nam u upitu ako ih trebate."},
    {"question":"Koliko traje postavljanje šatora?","answer":"Oko 15 minuta u dvoje. Šipke su označene bojama pa nije potrebno prethodno iskustvo s kampiranjem."},
    {"question":"Što znači Fresh & Black tehnologija?","answer":"To je dvoslojna tkanina koja blokira 99 posto vanjskog svjetla i odbija sunčevu toplinu. U praksi znači da je u šatoru mračno i nakon izlaska sunca te osjetno hladnije nego u običnom šatoru."},
    {"question":"Je li šator vodootporan?","answer":"Da. Nadstrešnica ima 2000 mm vodenog stupa i toplinski zavarene šavove, što pokriva uobičajenu ljetnu kišu i pljusak."},
    {"question":"Koliki je minimalni najam i koliko košta?","answer":"Minimalni najam je 3 dana. Tri dana su 40 eura, a sedam dana 75 eura — madrac na napuhavanje i pumpa uključeni su u cijenu."},
    {"question":"Koliko je težak i stane li u auto?","answer":"Šator teži 10,6 kg, a spakiran je 65 x 30 x 25 cm. Bez problema stane u prtljažnik osobnog automobila."},
    {"question":"Treba li polog?","answer":"Da, uzima se polog koji se vraća u cijelosti kad šator vratite čist i suh."}
  ]'::jsonb,
  '{"@context":"https://schema.org","@type":"Product","name":"Šator za 4 osobe – Arpenaz 4.1 Fresh&Black","brand":{"@type":"Brand","name":"Quechua"}}'::jsonb,
  3, NULL, 40, 75,
  true, 0, 'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  10.6, '460 x 260 x 172',
  1, false, true, false, 0
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq,
  schema_json = EXCLUDED.schema_json,
  weight_kg = EXCLUDED.weight_kg,
  dimensions_cm = EXCLUDED.dimensions_cm,
  updated_at = now();

-- ------------------------------------------------------------
-- 2) Prijenosni hladnjak 50 L – Klarstein PolarForce (kompresorski)
-- ------------------------------------------------------------
INSERT INTO products (
  name, slug, category_id, short_desc, description,
  seo_title, seo_description, seo_keywords, faq, schema_json,
  min_rental_days, price_per_day, price_per_3days, price_per_7days,
  requires_deposit, deposit_amount, deposit_note,
  weight_kg, dimensions_cm,
  stock_qty, is_active, is_available, is_featured, sort_order
) VALUES (
  'Prijenosni hladnjak 50 L – Klarstein PolarForce (kompresorski, 12V/230V)',
  'prijenosni-hladnjak-50l-kompresorski-najam',
  (SELECT id FROM categories WHERE slug = 'kamp-outdoor'),
  'Kompresorski prijenosni hladnjak od 50 L koji hladi od -20 °C do +20 °C. Radi na 12V u autu i 230V na struji, ima kotačiće i teleskopsku ručku.',
  '<p>Pravi hladnjak koji putuje s vama. Klarstein PolarForce 50 L hladi <strong>kompresorom</strong>, a ne termoelektrično — drži zadanu temperaturu i po najvećoj vrućini, neovisno o tome koliko je toplo vani. Led i rashladni ulošci vam više ne trebaju.</p>
<h3>Što dobivate</h3>
<ul>
<li>50 litara korisnog prostora — hrana i piće za cijeli vikend ili za 4-6 osoba</li>
<li>Raspon temperature od -20 °C do +20 °C — radi i kao prijenosni zamrzivač</li>
<li>Napajanje na 12 V (auto upaljač) i 230 V (kućna utičnica) — oba kabela uključena</li>
<li>LCD upravljačka ploča za točno postavljanje temperature i ECO način rada</li>
<li>Trostupanjska zaštita akumulatora — ne isprazni vam bateriju auta</li>
<li>Automatsko LED osvjetljenje, dvije izvadive košare i pregrada koja služi i kao daska za rezanje</li>
<li>Teleskopska ručka i off-road kotačići — vučete ga i kad je pun</li>
</ul>
<p>Idealan za kampiranje, festivale, ribolov, catering, duga putovanja autom i evente na otvorenom. Dimenzije 44,1 × 53,1 × 65,4 cm, težina 16 kg.</p>
<p>Za veći event kombinirajte ga s <a href="/najam/ledomat-aparat-za-led-najam">ledomatom</a> ili <a href="/najam/tocionik-za-pivu-5l-najam">točionikom za pivo</a>, a za kampiranje s <a href="/najam/sator-arpenaz-41-fresh-black-4-osobe-najam">šatorom za 4 osobe</a> i <a href="/najam/dji-power-1000-mini-stanica-napajanje-powerbank-najam">prijenosnom stanicom za napajanje</a>.</p>',
  'Najam prijenosnog hladnjaka 50 L — od 30 €/dan',
  'Iznajmite kompresorski prijenosni hladnjak 50 L u Zagrebu od 30 €/dan — hladi do -20 °C, radi na 12V u autu i 230V. Za kampiranje, festivale i evente.',
  ARRAY[
    'najam hladnjaka',
    'prijenosni hladnjak najam',
    'kompresorski hladnjak iznajmljivanje',
    'auto hladnjak 12v najam',
    'hladnjak za kampiranje najam',
    'rashladna škrinja najam zagreb'
  ],
  '[
    {"question":"Koliko hladi ovaj hladnjak?","answer":"Kompresorski hladnjak Klarstein PolarForce 50 L postiže temperature od -20 °C do +20 °C, koje postavljate na LCD ploči. Za razliku od termoelektričnih hladnjaka, temperatura ne ovisi o tome koliko je toplo vani."},
    {"question":"Kako se hladnjak napaja?","answer":"Na dva načina: preko 12 V utičnice (auto upaljač) u automobilu, kamperu ili na brodu, i preko 230 V kućne utičnice. Oba kabela dolaze uz najam."},
    {"question":"Može li mi isprazniti akumulator auta?","answer":"Ne. Hladnjak ima trostupanjsku zaštitu akumulatora koja ga automatski isključi prije nego što napon padne preniže, pa ga možete ostaviti uključenog u autu."},
    {"question":"Za koliko osoba je dovoljan?","answer":"Zapremina od 50 litara pokriva hranu i piće za 4 do 6 osoba tijekom vikenda, ili zalihe pića za manji event."},
    {"question":"Trebam li led ili rashladne uloške?","answer":"Ne. Hladnjak aktivno hladi kompresorom pa led nije potreban — dobivate cijelih 50 litara korisnog prostora umjesto da ga pola zauzme led."},
    {"question":"Je li glasan i mogu li ga držati u šatoru?","answer":"Radi tiho, na razini uobičajenog kućnog hladnjaka, pa ne smeta ni u šatoru ni u prostoriji. U ECO načinu rada troši još manje i radi još tiše."},
    {"question":"Koliko je težak i kako se prenosi?","answer":"Težak je 16 kg i mjeri 44,1 x 53,1 x 65,4 cm, ali ima teleskopsku ručku i off-road kotačiće pa ga vučete kao putnu torbu, čak i pun."},
    {"question":"Koliko košta najam?","answer":"Jedan dan je 30 eura, tri dana 50 eura, a sedam dana 75 eura. Dostava je moguća na području Zagreba."}
  ]'::jsonb,
  '{"@context":"https://schema.org","@type":"Product","name":"Prijenosni hladnjak 50 L – Klarstein PolarForce","brand":{"@type":"Brand","name":"Klarstein"}}'::jsonb,
  1, 30, 50, 75,
  true, 0, 'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  16, '44 x 53 x 65',
  1, false, true, false, 0
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq,
  schema_json = EXCLUDED.schema_json,
  weight_kg = EXCLUDED.weight_kg,
  dimensions_cm = EXCLUDED.dimensions_cm,
  updated_at = now();

-- ------------------------------------------------------------
-- 3) Tilta Hydra Alien Mini – auto nosač za kameru
--    ⚠ PRICE NOT SUPPLIED — placeholder 0, price-free seo_title.
-- ------------------------------------------------------------
INSERT INTO products (
  name, slug, category_id, short_desc, description,
  seo_title, seo_description, seo_keywords, faq, schema_json,
  min_rental_days, price_per_day, price_per_3days, price_per_7days,
  requires_deposit, deposit_amount, deposit_note,
  weight_kg, dimensions_cm,
  stock_qty, is_active, is_available, is_featured, sort_order
) VALUES (
  'Tilta Hydra Alien Mini – Auto nosač za kameru s elektroničkom vakuumskom čašom',
  'tilta-hydra-alien-mini-auto-nosac-kamere-najam',
  (SELECT id FROM categories WHERE slug = 'audio-video-oprema'),
  'Profesionalni car mount za akcijske kamere: elektronička vakuumska čaša s nadzorom tlaka i hidraulična ruka koja upija vibracije. Za DJI Osmo Pocket 3, Action i Insta360 X.',
  '<p>Tilta Hydra Alien Mini je kompaktni auto nosač (car mount) kojim snimate glatke vožnje bez trzaja — kadrove kakve inače vidite u auto reklamama i car spotovima. Umjesto obične vakuumske čaše i štapa, dobivate <strong>elektroničku čašu s nadzorom tlaka u stvarnom vremenu</strong> i hidrauličnu ruku koja upija vibracije s ceste.</p>
<h3>Što dobivate</h3>
<ul>
<li>Elektronička vakuumska čaša 11,5 cm (4,5 inča) s rosette nosačem</li>
<li>Nadzor tlaka u stvarnom vremenu — sama dopumpa vakuum ako tlak padne</li>
<li>Ugrađena baterija 2000 mAh za oko 8 sati rada; može raditi i stalno na USB-C napajanju (5 V / 1 A)</li>
<li>Hidraulična ruka koja upija vibracije, po uzoru na veliki Tilta Hydra Arm</li>
<li>Produžna ruka koja se montira vodoravno ili okomito</li>
<li>Stezaljka za DJI Osmo Pocket 3, protuuteg, nosač, potporna ruka i mekana torba za transport</li>
<li>CNC obrađena aluminijska legura — cijeli rig teži oko 985 g</li>
</ul>
<h3>Kompatibilnost</h3>
<p>DJI Osmo Action 3 i 4, DJI Osmo Pocket 3, Insta360 X3 i X4, te slični setupi do 600 g. Radi i s Tilta Khronos kavezima za smartphone.</p>
<p>Nemate kameru? Uzmite ga uz <a href="/najam/dji-osmo-pocket-3-najam">DJI Osmo Pocket 3</a>, <a href="/najam/dji-osmo-action-5-pro-najam">DJI Osmo Action 5 Pro</a> ili <a href="/najam/insta360-x5-360-kamera-najam">Insta360 X5</a>.</p>',
  'Najam Tilta Hydra Alien Mini — auto nosač za kameru',
  'Iznajmite Tilta Hydra Alien Mini u Zagrebu — elektronička vakuumska čaša i hidraulična ruka za glatke car shotove s DJI Osmo Pocket 3, Action i Insta360 X.',
  ARRAY[
    'tilta hydra alien mini najam',
    'car mount za kameru najam',
    'auto nosač za kameru iznajmljivanje',
    'vakuumska čaša za kameru najam',
    'suction cup mount rent',
    'oprema za snimanje iz auta najam'
  ],
  '[
    {"question":"Koje kamere stanu na Hydra Alien Mini?","answer":"DJI Osmo Action 3 i 4, DJI Osmo Pocket 3, Insta360 X3 i X4, te slični setupi ukupne težine do 600 g. Podržava i Tilta Khronos kaveze za smartphone."},
    {"question":"Što je sve u kompletu?","answer":"Elektronička vakuumska čaša 11,5 cm s rosette nosačem, hidraulična ruka koja upija vibracije, produžna ruka, stezaljka za DJI Osmo Pocket 3, protuuteg, nosač, potporna ruka i mekana torba za transport."},
    {"question":"Koliko traje baterija vakuumske čaše?","answer":"Ugrađena baterija od 2000 mAh traje oko 8 sati. Za duža snimanja čašu možete napajati vanjskim USB izvorom od 5 V i 1 A, pa radi neprekidno."},
    {"question":"Je li sigurno za lak automobila?","answer":"Da. Vakuumska čaša se lijepi na čistu, glatku i ravnu površinu (lak, staklo) i ne ostavlja trag. Elektronika stalno mjeri tlak i automatski dopumpa vakuum ako počne padati, a upozorit će vas i zvučno."},
    {"question":"Zašto ne obična vakuumska čaša?","answer":"Obična čaša prenosi svaku vibraciju s ceste na kameru. Hidraulična ruka Hydra Alien Mini sustava upija te vibracije, pa je snimka glatka i bez trzaja i kad vozite po lošem asfaltu."},
    {"question":"Mogu li ga koristiti kao gimbal iz ruke?","answer":"Da, uz zasebno dostupnu ručku sustav radi i kao stabilizator iz ruke. Javite nam u upitu ako vam treba i ona."},
    {"question":"Trebam li iskustvo da bih ga koristio?","answer":"Ne. Postavljanje traje nekoliko minuta: očistite površinu, prislonite čašu, pritisnite gumb i pričekajte da elektronika potvrdi vakuum. Uz opremu dobivate i kratke upute."}
  ]'::jsonb,
  '{"@context":"https://schema.org","@type":"Product","name":"Tilta Hydra Alien Mini – Auto nosač za kameru","brand":{"@type":"Brand","name":"Tilta"}}'::jsonb,
  1, NULL, NULL, 0,
  true, 0, 'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  0.99, NULL,
  1, false, true, false, 0
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq,
  schema_json = EXCLUDED.schema_json,
  weight_kg = EXCLUDED.weight_kg,
  updated_at = now();

-- ------------------------------------------------------------
-- 4) Projekcijsko platno na tronošcu 172 × 172 cm (SBOX PSMT-96-2)
--    Complements projektor-s-platnom-najam rather than competing:
--    that page owns "najam projektora", this one "najam platna".
-- ------------------------------------------------------------
INSERT INTO products (
  name, slug, category_id, short_desc, description,
  seo_title, seo_description, seo_keywords, faq, schema_json,
  min_rental_days, price_per_day, price_per_3days, price_per_7days,
  requires_deposit, deposit_amount, deposit_note,
  weight_kg, dimensions_cm,
  stock_qty, is_active, is_available, is_featured, sort_order
) VALUES (
  'Projekcijsko platno na tronošcu 172 × 172 cm (96 inča)',
  'projekcijsko-platno-tronozac-172x172-najam',
  (SELECT id FROM categories WHERE slug = 'oprema-za-evente'),
  'Samostojeće projekcijsko platno 172 × 172 cm na tronošcu. Mat bijela tkanina, gain 1.0, kut gledanja 160°, formati 16:9, 4:3 i 1:1. Postavljanje u dvije minute.',
  '<p>Samostojeće projekcijsko platno na tronošcu — ne treba vam zid, bušenje ni montaža. Razvučete tronožac, izvučete platno i za dvije minute imate ekran dijagonale 96 inča gdje god vam treba.</p>
<h3>Tehnički podaci</h3>
<ul>
<li>Površina platna 172 × 172 cm (dijagonala 96 inča)</li>
<li>Mat bijela tkanina, debljina 0,4 mm — bez odsjaja i bez nabora</li>
<li>Gain 1.0 i kut gledanja 160° — slika jednako izgleda i onima sa strane</li>
<li>Podržani formati: 16:9 (film i serije), 4:3 (prezentacije) i 1:1</li>
<li>Crni obrub koji povećava kontrast: 5 cm gore, 4 cm dolje, 3 cm sa strane</li>
<li>Manualno izvlačenje s podesivom visinom, sklapa se u vlastito kućište</li>
</ul>
<p>Idealno za prezentacije i radionice, kino na otvorenom u dvorištu, gledanje utakmica, vjenčanja i rođendane, te snimanje ispred neutralne pozadine.</p>
<p>Trebate i projektor? Uzmite <a href="/najam/projektor-s-platnom-najam">projektor s platnom u paketu</a>. Za zvuk uz filmsku večer dobro ide <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a> ili <a href="/najam/jbl-charge-3-bluetooth-zvucnik-najam">JBL Charge 3</a>.</p>',
  'Najam projekcijskog platna — od 10 €/dan',
  'Iznajmite projekcijsko platno na tronošcu 172 × 172 cm (96 inča) u Zagrebu od 10 €/dan — mat bijelo, gain 1.0, formati 16:9, 4:3 i 1:1. Bez montaže.',
  ARRAY[
    'najam projekcijskog platna',
    'projekcijsko platno najam',
    'platno za projektor iznajmljivanje',
    'platno na tronošcu najam',
    'projekcijsko platno najam zagreb',
    'kino na otvorenom oprema najam'
  ],
  '[
    {"question":"Koliko je platno veliko?","answer":"Površina platna je 172 x 172 cm, što odgovara dijagonali od 96 inča. U formatu 16:9 to je slika široka 172 cm i visoka oko 97 cm."},
    {"question":"Treba li mi zid ili montaža?","answer":"Ne. Platno stoji na vlastitom tronošcu, pa ga postavite bilo gdje — u dvorištu, dvorani, na travi ili u uredu. Nema bušenja ni vješanja."},
    {"question":"Koliko traje postavljanje?","answer":"Oko dvije minute. Razvučete tronožac, izvučete platno na željenu visinu i zaključate ga. Sklapanje je jednako brzo."},
    {"question":"Koje formate slike podržava?","answer":"Platno je kvadratno 172 x 172 cm pa podržava 16:9 za filmove i serije, 4:3 za klasične prezentacije i 1:1. Format birate visinom na koju izvučete platno."},
    {"question":"Je li dobro i za projekciju danju?","answer":"Mat bijela tkanina s gainom 1.0 daje ravnomjernu sliku bez odsjaja, ali svaki projektor najbolje radi u zamračenom prostoru ili nakon sumraka. Za vanjsko kino preporučujemo početak projekcije nakon zalaska sunca."},
    {"question":"Je li projektor uključen u cijenu?","answer":"Nije — ovo je samo platno. Ako trebate i projektor, iznajmite paket projektor s platnom, koji dolazi s kablovima za laptop, mobitel i streaming uređaje."},
    {"question":"Koliko košta najam platna?","answer":"Jedan dan je 10 eura, tri dana 20 eura, a sedam dana 35 eura. Dostava je moguća na području Zagreba."}
  ]'::jsonb,
  '{"@context":"https://schema.org","@type":"Product","name":"Projekcijsko platno na tronošcu 172 × 172 cm","brand":{"@type":"Brand","name":"SBOX"}}'::jsonb,
  1, 10, 20, 35,
  false, NULL, NULL,
  NULL, '172 x 172',
  1, false, true, false, 0
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq,
  schema_json = EXCLUDED.schema_json,
  dimensions_cm = EXCLUDED.dimensions_cm,
  updated_at = now();

-- ------------------------------------------------------------
-- 5) Content fix: strip the trailing unit from dimensions_cm.
--    ProductPage.tsx renders `{dimensions_cm} cm`, so rows that store
--    "40 x 25 x 35 cm" print "40 x 25 x 35 cm cm" in the spec table on
--    18 live product pages. Idempotent.
-- ------------------------------------------------------------
UPDATE products
SET dimensions_cm = trim(regexp_replace(dimensions_cm, '\s*cm\s*$', '', 'i')),
    updated_at = now()
WHERE dimensions_cm ~* '\s*cm\s*$';

COMMIT;

-- Verify (expect the 4 new slugs, is_active = false, and no "cm" left in
-- any dimensions_cm value):
--   SELECT slug, is_active, price_per_day, price_per_3days, price_per_7days,
--          min_rental_days, dimensions_cm, jsonb_array_length(faq) AS faq_items
--   FROM products
--   WHERE slug IN (
--     'sator-arpenaz-41-fresh-black-4-osobe-najam',
--     'prijenosni-hladnjak-50l-kompresorski-najam',
--     'tilta-hydra-alien-mini-auto-nosac-kamere-najam',
--     'projekcijsko-platno-tronozac-172x172-najam'
--   );
--   SELECT count(*) FROM products WHERE dimensions_cm ~* 'cm\s*$';  -- expect 0
