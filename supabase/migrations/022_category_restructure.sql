-- ============================================================
-- 022_category_restructure.sql
--
-- Splits the two overloaded categories into topical ones (owner decision
-- 2026-10-30). Product URLs (/najam/<product-slug>) do not change; only the
-- breadcrumb parent, the /oprema filter and the category listing change.
--
--   NEW  kamere-i-dronovi         action/360/gimbal/instant cameras, drones
--   NEW  igre-na-otvorenom        the 12 lawn/party games
--   NEW  aparati-za-hranu-i-pice  popcorn, ice, beer tap, slushie, ice cream
--   KEPT audio-video-oprema       speakers, mics, stand, projectors, screens
--   KEPT oprema-za-evente         gazebo, table set, heater
--
-- Why: for "najam gopro" Google ranked /najam/audio-video-oprema (a mix of
-- 15 cameras, drones, speakers and projectors) instead of the product, and
-- five games shared the same "outdoor igre najam" target with no page owning
-- it. Topical categories give each intent one clear listing page.
--
-- Also adds categories.seo_text / categories.faq with IF NOT EXISTS: both
-- columns already exist in production (added by hand) but no migration
-- described them. Code that renders them ships separately; until then the
-- copy written here is stored but not shown, so links inside it to the
-- not-yet-deployed brand hubs (/najam/gopro-kamere, /najam/jbl-zvucnici)
-- cannot 404.
--
-- sort_order: only cameras and audio/video are reordered, with values 0..8,
-- so the global "Preporučeno" order on /oprema and the 8 featured products on
-- the homepage stay where they were. Games and food machines keep theirs.
--
-- Data only, additive, harmless to the currently deployed code. Copy has no
-- em or en dashes (owner rule). Idempotent: re-running converges.
-- ============================================================

BEGIN;

ALTER TABLE categories ADD COLUMN IF NOT EXISTS seo_text text;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS faq jsonb;

-- ------------------------------------------------------------
-- 1) New categories
-- ------------------------------------------------------------
INSERT INTO categories (name, slug, color, sort_order, description, seo_title, seo_description, seo_text, faq)
VALUES
(
  'Kamere i dronovi',
  'kamere-i-dronovi',
  '#5B8DEF',
  1,
  'Akcijske kamere, 360 kamere, gimbal kamera, instant kamera i dronovi za putovanja, sport, evente i snimanje sadržaja. Iznajmljivanje u Zagrebu na jedan ili više dana.',
  'Najam kamera i dronova u Zagrebu: GoPro, DJI',
  'Iznajmite GoPro, DJI Osmo i Insta360 kamere, instant kameru i DJI dronove u Zagrebu. Rezervacija online, preuzimanje ili dostava po Zagrebu i okolici.',
  '<p>Trebate kameru za more, skijanje, vjenčanje ili snimanje sadržaja, a kupnja vam se ne isplati? Na rentanje.com iznajmljujete provjerene kamere i dronove u Zagrebu, s osobnim preuzimanjem ili dostavom po Zagrebu i okolici.</p>
<h2>Akcijske kamere</h2>
<p>Najtraženije su GoPro kamere. Na stranici <a href="/najam/gopro-kamere">najam GoPro kamere</a> usporedili smo GoPro Hero 13 Black i povoljniji GoPro Hero 10 Black. Obje su vodootporne do 10 m i snimaju 5.3K video. Alternativa je <a href="/najam/dji-osmo-action-5-pro-najam">DJI Osmo Action 5 Pro</a> s većim senzorom i vodootpornošću do 20 m.</p>
<h2>360 i mini kamere</h2>
<p><a href="/najam/insta360-x5-360-kamera-najam">Insta360 X5</a> snima 8K 360 video, pa kadar birate naknadno. <a href="/najam/insta360-go-3-mini-kamera-najam">Insta360 GO 3</a> teži samo 35 g i kači se magnetom gotovo bilo gdje. Za vlogove i evente tu je gimbal kamera <a href="/najam/dji-osmo-pocket-3-najam">DJI Osmo Pocket 3</a>.</p>
<h2>Dronovi i instant kamera</h2>
<p>Za snimke iz zraka iznajmite <a href="/najam/dji-mini-2-dron-fly-more-najam">DJI Mini 2 Fly More</a> s tri baterije ili selfie dron <a href="/najam/dji-neo-motion-fly-more-combo-najam">DJI Neo</a> koji polijeće s dlana. Za vjenčanja i rođendane gosti obožavaju instant fotografije s <a href="/najam/fujifilm-instax-mini-evo-najam">Fujifilm Instax Mini EVO</a>.</p>',
  '[
    {"question":"Koliko košta najam kamere ili drona?","answer":"Cijena ovisi o modelu i trajanju najma. Najam na 3 ili 7 dana povoljniji je po danu od jednodnevnog, a točnu cijenu za odabrane datume vidite odmah u kalendaru na stranici svakog proizvoda."},
    {"question":"Koja je kamera najbolja za more i snimanje pod vodom?","answer":"GoPro Hero 13 Black i GoPro Hero 10 Black vodootporne su do 10 metara bez kućišta, a DJI Osmo Action 5 Pro do 20 metara. Insta360 X5 ima IP68 zaštitu i vodootporna je do 15 metara."},
    {"question":"Što dobivam uz kameru?","answer":"Što je točno uključeno navedeno je u opisu svake kamere. Dodatna oprema poput memorijske kartice, rezervnih baterija ili stativa dostupna je na upit."},
    {"question":"Mogu li dobiti dostavu?","answer":"Da. Dostavljamo na području Zagreba i okolice, a cijena dostave navedena je uz svaki proizvod. Izvan Zagreba cijena dostave je na upit. Opremu možete i osobno preuzeti."},
    {"question":"Koliko unaprijed trebam rezervirati?","answer":"Za vikende i ljetnu sezonu preporučujemo rezervaciju nekoliko dana unaprijed, jer većinu kamera imamo u jednom primjerku. Slobodne datume vidite odmah u kalendaru na stranici proizvoda."}
  ]'::jsonb
),
(
  'Igre na otvorenom',
  'igre-na-otvorenom',
  '#F59E0B',
  3,
  'Igre za dvorište, park i plažu: cornhole, kubb, velika jenga, ladder golf, spikeball, beer pong i još mnogo toga. Za rođendane, vjenčanja, team building i druženja.',
  'Najam igara na otvorenom u Zagrebu',
  'Iznajmite cornhole, kubb, veliku jengu, spikeball, beer pong i druge igre na otvorenom u Zagrebu. Za rođendane, vjenčanja, team building i druženja.',
  '<p>Najbolja druženja na otvorenom imaju dobru igru. Na rentanje.com iznajmljujete igre za dvorište, park, plažu i event prostor u Zagrebu, bez kupnje i bez spremanja nakon zabave.</p>
<h2>Klasične igre za sve uzraste</h2>
<p><a href="/najam/cornhole-igra-najam">Cornhole</a>, <a href="/najam/kubb-viking-igra-najam">kubb</a>, <a href="/najam/ladder-golf-igra-najam">ladder golf</a>, <a href="/najam/ring-toss-igra-bacanja-prstenova-najam">ring toss</a> i <a href="/najam/velika-jenga-giant-jenga-igra-najam">velika jenga</a> igraju se bez pripreme i zabavljaju i djecu i odrasle.</p>
<h2>Sportske i party igre</h2>
<p>Za aktivnije društvo tu su <a href="/najam/spikeball-igra-najam">spikeball</a>, <a href="/najam/badminton-set-mreza-najam">badminton s mrežom</a> i <a href="/najam/softarchery-luk-strijela-najam">luk i strijela s mekanim strelicama</a>. Za momačke, djevojačke i rođendane odraslih tu je <a href="/najam/beer-pong-stol-case-najam">beer pong stol s čašama</a>, a ljeti električni vodeni pištolji <a href="/najam/spyrathree-vodeni-pistolj-plavi-najam">SpyraThree</a> u plavoj i crvenoj boji za timske bitke.</p>
<h2>Team building</h2>
<p><a href="/najam/froebel-tower-timska-igra-najam">Fröbel Tower</a> je timska igra za 2 do 24 igrača: svi zajedno upravljaju drvenim kranom pomoću uzica i slažu toranj. Idealna je za korporativne evente, radionice i škole.</p>',
  '[
    {"question":"Koliki je minimalni najam igara?","answer":"Cornhole, beer pong stol i SpyraThree vodeni pištolji iznajmljuju se već od jednog dana. Ostale igre iznajmljuju se na minimalno 3 dana, a najam na 7 dana najpovoljniji je po danu."},
    {"question":"Koje igre su najbolje za team building?","answer":"Fröbel Tower je napravljen upravo za timski rad, jer cijela ekipa zajedno upravlja kranom. Kubb, cornhole i spikeball odlični su za turnire među timovima, a velika jenga privlači publiku na svakom eventu."},
    {"question":"Mogu li iznajmiti više igara za isti event?","answer":"Da. Dodajte više igara u košaricu za iste datume i pošaljite jedan upit. Za veće evente igre možete kombinirati s paviljonom, stolom s klupama i ozvučenjem."},
    {"question":"Mogu li dobiti dostavu?","answer":"Da. Dostavljamo na području Zagreba i okolice, a cijena dostave navedena je uz svaki proizvod. Izvan Zagreba cijena dostave je na upit. Igre možete i osobno preuzeti."}
  ]'::jsonb
),
(
  'Aparati za hranu i piće',
  'aparati-za-hranu-i-pice',
  '#EC4899',
  4,
  'Aparat za kokice, ledomat, točionik za pivo, aparat za slushie i aparat za sladoled za rođendane, momačke, vjenčanja i evente u Zagrebu.',
  'Najam aparata za kokice, led i pivo u Zagrebu',
  'Iznajmite aparat za kokice s kolicima, ledomat, točionik za pivo, aparat za slushie i Ninja aparat za sladoled u Zagrebu. Za rođendane, zabave i evente.',
  '<p>Kokice, hladno pivo, led za koktele i sladoled pretvaraju obično druženje u pravi event. Na rentanje.com iznajmljujete aparate za hranu i piće u Zagrebu, za jedan dan ili cijeli tjedan.</p>
<h2>Za rođendane i filmske večeri</h2>
<p><a href="/najam/aparat-za-kokice-s-kolicima-vevor-najam">Aparat za kokice s kolicima</a> u retro kino stilu radi svježe kokice za par minuta i sam je atrakcija za fotografiranje. Djeci se uvijek svidi i <a href="/najam/ninja-creami-swirl-aparat-sladoled-najam">Ninja CREAMi Swirl aparat za sladoled</a> koji radi i soft serve.</p>
<h2>Za zabave i momačke</h2>
<p><a href="/najam/tocionik-za-pivu-5l-najam">Točionik za pivo</a> hladi 5 litrene bačve i toči pivo s kremastom pjenom, <a href="/najam/ledomat-aparat-za-led-najam">ledomat</a> proizvodi do 12 kg leda dnevno, a <a href="/najam/aparat-za-slushie-margaritu-najam">Ninja SLUSHi</a> radi slushie, margaritu i frozen koktele.</p>',
  '[
    {"question":"Jesu li sastojci uključeni u najam?","answer":"Ne. Kukuruz za kokice, pivo, sastojci za slushie i baza za sladoled nisu uključeni u najam. Sve ih nabavite u svakom većem dućanu, a za veće evente javite nam u upitu što trebate."},
    {"question":"Treba li aparatima posebna struja?","answer":"Ne. Svi aparati rade na običnu kućnu utičnicu od 230 V. Za lokacije bez struje možete iznajmiti i prijenosnu stanicu za napajanje DJI Power 1000 Mini."},
    {"question":"Koji aparat odabrati za dječji rođendan?","answer":"Aparat za kokice s kolicima i Ninja CREAMi Swirl aparat za sladoled najpopularniji su izbor za dječje rođendane. Za starije goste dobro dođu ledomat, točionik za pivo i aparat za slushie i margaritu."},
    {"question":"Mogu li dobiti dostavu?","answer":"Da. Dostavljamo na području Zagreba i okolice, a cijena dostave navedena je uz svaki proizvod. Izvan Zagreba cijena dostave je na upit. Aparate možete i osobno preuzeti."}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_text = EXCLUDED.seo_text,
  faq = EXCLUDED.faq;

-- ------------------------------------------------------------
-- 2) Existing categories whose contents change
-- ------------------------------------------------------------
UPDATE categories SET
  sort_order = 2,
  description = 'Zvučnici, mikrofoni, projektori i projekcijska platna za zabave, vjenčanja, prezentacije i kino na otvorenom. Iznajmljivanje u Zagrebu na jedan ili više dana.',
  seo_title = 'Najam ozvučenja i projektora u Zagrebu',
  seo_description = 'Iznajmite JBL party zvučnike, bežične mikrofone za karaoke, stalke, projektore i projekcijska platna u Zagrebu. Za zabave, vjenčanja i konferencije.',
  seo_text = '<p>Za dobru zabavu ili uspješnu prezentaciju trebaju zvuk i slika. Na rentanje.com iznajmljujete ozvučenje i projekcijsku opremu u Zagrebu, s osobnim preuzimanjem ili dostavom po Zagrebu i okolici.</p>
<h2>Zvučnici i mikrofoni</h2>
<p>Sve JBL zvučnike usporedili smo na stranici <a href="/najam/jbl-zvucnici">najam JBL zvučnika</a>. <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a> s 240 W pokriva zabavu u dvorištu ili sali, a manji <a href="/najam/jbl-charge-3-bluetooth-zvucnik-najam">JBL Charge 3</a> stane u ruksak. Za karaoke i govore dodajte <a href="/najam/jbl-bezicni-mikrofoni-par-najam">JBL bežične mikrofone</a> i <a href="/najam/stalak-za-zvucnik-tripod-najam">stalak za zvučnik</a>.</p>
<h2>Projektori i platna</h2>
<p>Za konferencije i seminare preporučujemo <a href="/najam/epson-eb-fh52-profesionalni-projektor-najam">Epson EB-FH52 s 4000 lumena</a> i <a href="/najam/veliko-projekcijsko-platno-stalak-211x160-100-inca-najam">veliko platno od 100 inča</a>. Za filmsku večer u dvorištu dovoljan je <a href="/najam/projektor-s-platnom-najam">projektor s platnom u paketu</a>.</p>',
  faq = '[
    {"question":"Koji zvučnik odabrati za zabavu?","answer":"Za zabavu u dvorištu ili sali odaberite JBL PartyBox Stage 320 s 240 W snage i svjetlosnim showom. Za manje društvo od 15 do 20 osoba dovoljan je JBL Charge 3. Za veći prostor dostupan je paket s dva PartyBox zvučnika i dva stalka."},
    {"question":"Mogu li uz zvučnik dobiti mikrofon za karaoke?","answer":"Da. JBL bežični mikrofoni rade plug and play s JBL PartyBox zvučnicima: prijemnik utaknete u zvučnik i mikrofoni rade. Domet je do 30 metara, a baterija traje oko 20 sati."},
    {"question":"Koji projektor odabrati za prezentaciju u osvijetljenoj dvorani?","answer":"Epson EB-FH52 ima 4000 lumena i Full HD rezoluciju, pa je prezentacija čitljiva i bez potpunog zamračenja. Uz njega preporučujemo veliko projekcijsko platno od 100 inča."},
    {"question":"Mogu li dobiti dostavu?","answer":"Da. Dostavljamo na području Zagreba i okolice, a cijena dostave navedena je uz svaki proizvod. Izvan Zagreba cijena dostave je na upit. Opremu možete i osobno preuzeti."}
  ]'::jsonb
WHERE slug = 'audio-video-oprema';

UPDATE categories SET
  name = 'Oprema za evente',
  sort_order = 5,
  description = 'Paviljon šator, stol s klupama i infracrvena grijalica za vrtne zabave, rođendane, sajmove i evente na otvorenom u Zagrebu.',
  seo_title = 'Najam paviljona, stolova i grijalica u Zagrebu',
  seo_description = 'Iznajmite paviljon šator 3x3 m, ratan stol s klupama za 8 osoba i infracrvenu grijalicu u Zagrebu. Za vrtne zabave, rođendane, sajmove i evente.',
  seo_text = '<p>Za event na otvorenom trebaju hlad, mjesto za sjedenje i toplina kad padne mrak. Na rentanje.com iznajmljujete osnovnu opremu za evente u Zagrebu, s osobnim preuzimanjem ili dostavom po Zagrebu i okolici.</p>
<p><a href="/najam/paviljon-sator-3x3m-najam">Paviljon šator 3x3 m</a> štiti od sunca i kiše, <a href="/najam/prijenosni-ratan-stol-klupe-8-osoba-najam">ratan stol s dvije klupe</a> udobno prima 8 osoba, a <a href="/najam/blumfeldt-dark-wave-infracrvena-grijalica-najam">infracrvena grijalica Blumfeldt Dark Wave</a> produžuje zabavu do kasno u noć.</p>
<p>Za zabavu dodajte <a href="/najam/igre-na-otvorenom">igre na otvorenom</a>, <a href="/najam/aparati-za-hranu-i-pice">aparate za hranu i piće</a> i <a href="/najam/audio-video-oprema">ozvučenje</a>.</p>',
  faq = '[
    {"question":"Koliko gostiju stane pod paviljon 3x3 m?","answer":"Paviljon 3x3 m pruža sklonište za 10 do 15 stojećih ili 8 do 10 sjedećih gostiju. Postavlja se i sklapa bez posebnog alata."},
    {"question":"Za koliko osoba je ratan stol s klupama?","answer":"Set ratan stola i dvije klupe udobno prima 8 osoba. Sklopiv je, pa se lako prevozi i postavlja."},
    {"question":"Mogu li dobiti dostavu?","answer":"Da. Dostavljamo na području Zagreba i okolice, a cijena dostave navedena je uz svaki proizvod. Izvan Zagreba cijena dostave je na upit. Opremu možete i osobno preuzeti."}
  ]'::jsonb
WHERE slug = 'oprema-za-evente';

-- Remaining categories: shift sort_order so the new ones slot in.
UPDATE categories SET sort_order = 6 WHERE slug = 'rostilj-kuhanje';
UPDATE categories SET sort_order = 7 WHERE slug = 'kamp-outdoor';
UPDATE categories SET sort_order = 8 WHERE slug = 'alati-ciscenje';
UPDATE categories SET sort_order = 9 WHERE slug = 'ostalo';

-- ------------------------------------------------------------
-- 3) Move products (active and inactive drafts alike)
-- ------------------------------------------------------------
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'kamere-i-dronovi'), updated_at = now()
WHERE slug IN (
  'gopro-hero-13-black-najam',
  'gopro-hero-10-black-kamera-najam',
  'dji-osmo-action-5-pro-najam',
  'insta360-x5-360-kamera-najam',
  'insta360-go-3-mini-kamera-najam',
  'dji-osmo-pocket-3-najam',
  'dji-neo-motion-fly-more-combo-najam',
  'dji-mini-2-dron-fly-more-najam',
  'fujifilm-instax-mini-evo-najam',
  'dji-avata-360-motion-fly-more-combo-najam',
  'tilta-hydra-alien-mini-auto-nosac-kamere-najam'
);

UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'igre-na-otvorenom'), updated_at = now()
WHERE slug IN (
  'cornhole-igra-najam',
  'velika-jenga-giant-jenga-igra-najam',
  'kubb-viking-igra-najam',
  'ladder-golf-igra-najam',
  'spikeball-igra-najam',
  'beer-pong-stol-case-najam',
  'ring-toss-igra-bacanja-prstenova-najam',
  'badminton-set-mreza-najam',
  'softarchery-luk-strijela-najam',
  'froebel-tower-timska-igra-najam',
  'spyrathree-vodeni-pistolj-plavi-najam',
  'spyrathree-vodeni-pistolj-crveni-najam',
  'fingerdisc-bocanje-igra-najam',
  'veliki-connect-4-drvena-igra-najam'
);

UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'aparati-za-hranu-i-pice'), updated_at = now()
WHERE slug IN (
  'aparat-za-kokice-s-kolicima-vevor-najam',
  'ledomat-aparat-za-led-najam',
  'tocionik-za-pivu-5l-najam',
  'aparat-za-slushie-margaritu-najam',
  'ninja-creami-swirl-aparat-sladoled-najam',
  'aparat-za-kokice-popcorn-masina-najam'
);

-- Projector bundle belongs with the other projection gear.
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'audio-video-oprema'), updated_at = now()
WHERE slug = 'projektor-s-platnom-najam';

-- ------------------------------------------------------------
-- 4) Order inside the two reshaped listings (values 0..8, see header)
-- ------------------------------------------------------------
UPDATE products p SET sort_order = v.ord
FROM (VALUES
  ('gopro-hero-13-black-najam', 0),
  ('gopro-hero-10-black-kamera-najam', 1),
  ('dji-osmo-action-5-pro-najam', 2),
  ('insta360-x5-360-kamera-najam', 3),
  ('insta360-go-3-mini-kamera-najam', 4),
  ('dji-osmo-pocket-3-najam', 5),
  ('dji-neo-motion-fly-more-combo-najam', 6),
  ('dji-mini-2-dron-fly-more-najam', 7),
  ('fujifilm-instax-mini-evo-najam', 8),
  ('jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima', 0),
  ('jbl-charge-3-bluetooth-zvucnik-najam', 1),
  ('jbl-bezicni-mikrofoni-par-najam', 2),
  ('stalak-za-zvucnik-tripod-najam', 3),
  ('epson-eb-fh52-profesionalni-projektor-najam', 4),
  ('veliko-projekcijsko-platno-stalak-211x160-100-inca-najam', 5),
  ('projektor-s-platnom-najam', 6)
) AS v(slug, ord)
WHERE p.slug = v.slug;

COMMIT;

-- Verify:
--   SELECT c.slug, c.sort_order, count(p.*) FILTER (WHERE p.is_active) AS active
--   FROM categories c LEFT JOIN products p ON p.category_id = c.id
--   GROUP BY c.slug, c.sort_order ORDER BY c.sort_order;
--   -- expect kamere-i-dronovi 9, audio-video-oprema 7, igre-na-otvorenom 12,
--   -- aparati-za-hranu-i-pice 5, oprema-za-evente 3
