-- =============================================
-- IMPORT: Categories + 33 Products from Excel
-- =============================================

-- 1. Create categories
INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Audio i video oprema', 'audio-i-video-oprema', '#01D2D6', 0)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Dronovi', 'dronovi', '#6EE7B7', 10)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Grijalice i grijanje', 'grijalice-i-grijanje', '#FF6B6B', 20)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Hrana i piće oprema', 'hrana-i-pice-oprema', '#FF8E6C', 30)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Igre i zabava', 'igre-i-zabava', '#BCA7F0', 40)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Kamere i oprema', 'kamere-i-oprema', '#6EE7B7', 50)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Namještaj i oprema', 'namjestaj-i-oprema', '#4ECDC4', 60)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Napajanje i oprema', 'napajanje-i-oprema', '#FFD166', 70)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Piće i oprema', 'pice-i-oprema', '#FFD166', 80)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Roštilji i kuhanje', 'rostilji-i-kuhanje', '#FF8E6C', 90)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Vatru i grijanje', 'vatru-i-grijanje', '#FF6B6B', 100)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Zvučnici', 'zvucnici', '#01D2D6', 110)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO categories (name, slug, color, sort_order)
VALUES ('Čišćenje i održavanje', 'ciscenje-i-odrzavanje', '#A78BFA', 120)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;


-- 2. Insert products
INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'JBL Boombox 3',
  'jbl-boombox-3-najam',
  (SELECT id FROM categories WHERE slug = 'zvucnici'),
  'Moćan prijenosni Bluetooth zvučnik s 180W JBL Pro Sound zvukom, 24h baterijom i IP67 vodootpornošću. Idealan za zabave na otvorenom i zatvorenom.',
  'Iznajmite JBL Boombox 3 – najmoćniji prijenosni Bluetooth zvučnik s masivnim JBL Original Pro Sound zvukom. Opremljen 3-way speaker sustavom koji isporučuje do 180W snage (AC) s dubokim, snažnim basevima. Baterija traje čak 24 sata, a IP67 certifikat znači potpunu zaštitu od vode i prašine – nosite ga na plažu, bazen ili kišu bez brige. Metalna ručka sa silikonskim gripom olakšava transport, a PartyBoost tehnologija omogućuje povezivanje više zvučnika za još veći zvuk. Težak samo 6,7 kg, savršen je za roštilj, house party ili cjelodnevni izlet. Bluetooth 5.3, USB powerbank funkcija i JBL Portable aplikacija za podešavanje EQ-a čine ga najboljim izborom za najam prijenosnog zvučnika.',
  'Najam JBL Boombox 3 | Prijenosni zvučnik 180W | Rentanje.com',
  'Iznajmite JBL Boombox 3 – 180W zvuka, 24h baterija, IP67 vodootporan. Idealan za party, roštilj i plažu. Brza dostava!',
  '{"najam JBL Boombox","iznajmljivanje zvučnika","JBL Boombox 3 rent","prijenosni zvučnik najam","party zvučnik najam","bluetooth zvučnik iznajmljivanje"}',
  '[{"question": "Koliko je glasan JBL Boombox 3?", "answer": "JBL Boombox 3 isporučuje do 180W RMS snage na struju (136W na bateriju) kroz 3-way sustav – subwoofer, dva midrange i dva visokotonca. Dovoljno glasan za kućnu zabavu ili roštilj na otvorenom."}, {"question": "Koliko traje baterija?", "answer": "Baterija traje do 24 sata na jednom punjenju. Punjenje traje oko 6,5 sati. Zvučnik ima i powerbank funkciju pa možete napuniti mobitel preko USB porta."}, {"question": "Je li JBL Boombox 3 vodootporan?", "answer": "Da, ima IP67 certifikat koji ga štiti od potpunog uranjanja u vodu do 1 metra na 30 minuta, kao i od prašine. Savršen za plažu, bazen ili kišu."}, {"question": "Mogu li spojiti više zvučnika?", "answer": "Da, pomoću PartyBoost tehnologije možete upariti dva JBL zvučnika za stereo zvuk ili povezati više kompatibilnih modela za još veći zvuk."}, {"question": "Koliko teži JBL Boombox 3?", "answer": "Zvučnik teži 6,7 kg s dimenzijama 48,2 × 25,7 × 20 cm. Ima metalnu ručku sa silikonskim gripom za lakše nošenje."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Blumfeldt Dark Wave Infrared Grijalica',
  'blumfeldt-dark-wave-infracrvena-grijalica-najam',
  (SELECT id FROM categories WHERE slug = 'grijalice-i-grijanje'),
  'Infracrvena grijalica snage 2000W s 9 razina grijanja, MinimalGlare tehnologijom i IP65 zaštitom. Grije odmah, bez čekanja – savršena za terase i vrtove.',
  'Iznajmite Blumfeldt Dark Wave infracrvenu grijalicu i produžite svaku vanjsku zabavu do kasno u noć. Snažnih 2000W grijanja s 9 razina snage i 24-satnim timerom, ova grijalica zagrijava direktno osobe, a ne zrak – što znači trenutnu toplinu bez čekanja. Posebna MinimalGlare zlatom obložena karbonska cijev filtrira gotovo svo crveno svjetlo pa ne zasljepljuje goste. IP65 zaštita od prskanja čini je idealnom za terase, vrtove i garaže. Dolazi sa stalkom podesivim od 110 do 178 cm i mogućnošću zidne montaže. LED zaslon s touch panelom za jednostavno upravljanje.',
  'Najam Blumfeldt Dark Wave Grijalice 2000W | Rentanje.com',
  'Iznajmite Blumfeldt Dark Wave infracrvenu grijalicu – 2000W, 9 razina grijanja, IP65, stalak i zidna montaža. Za terase i vrtne zabave!',
  '{"najam grijalice","infracrvena grijalica najam","terasa grijalica iznajmljivanje","Blumfeldt Dark Wave rent","vanjska grijalica najam"}',
  '[{"question": "Koliko brzo Blumfeldt Dark Wave zagrijava?", "answer": "Infracrvena tehnologija zagrijava odmah – toplinu osjećate u trenutku uključivanja. Nema čekanja jer grijalica grije direktno osobe i predmete, a ne zrak oko sebe."}, {"question": "Mogu li je koristiti na kiši?", "answer": "Da, grijalica ima IP65 zaštitu od prskanja vode, što je čini pogodnom za korištenje na otvorenom čak i uz blagu kišu. Nije namijenjena za potpuno izlaganje jakoj kiši."}, {"question": "Koliko je daleko domet grijanja?", "answer": "Efektivni domet grijanja iznosi 2-4 metra, ovisno o odabranoj razini snage. Idealno za manje terase i sjedeće prostore na otvorenom."}, {"question": "Može li se montirati na zid?", "answer": "Da, dolazi s kompletnim materijalom za zidnu montažu. Također uključuje podesivi stalak (110-178 cm) s nagibnim držačem za optimalno usmjeravanje topline."}, {"question": "Što je MinimalGlare tehnologija?", "answer": "MinimalGlare znači da je karbonska cijev obložena zlatom kako bi filtrirala gotovo svo vidljivo crveno svjetlo. Rezultat je ugodna toplina bez neugodnog blještanja – možete uživati u toplini bez zasljepljivanja."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'GoPro Hero 13',
  'gopro-hero-13-black-najam',
  (SELECT id FROM categories WHERE slug = 'kamere-i-oprema'),
  'Akcijska kamera s 5.3K/60fps videom, HyperSmooth 6.0 stabilizacijom, 1900mAh baterijom i vodootpornošću do 10m. Za svaku avanturu!',
  'Iznajmite GoPro Hero 13 Black – najnoviju akcijsku kameru s 5.3K snimanjem pri 60fps i 4K pri 120fps za nevjerojatno glatke usporene snimke. Nova 1900mAh Enduro baterija pruža do 2,5 sata neprekidnog snimanja. HyperSmooth 6.0 stabilizacija eliminira sve tresanje, a vodootpornost do 10 metara bez kućišta omogućuje snimanje pod vodom. Burst Slo-Mo do 400fps pri 720p hvata svaki detalj akcije. Senzor od 27,6 megapiksela daje oštre fotografije, a Wi-Fi 6 i Bluetooth 5.3 ubrzavaju prijenos datoteka. Podržava zamjenjive HB-Series leće za makro, ultra-wide i anamorfne snimke.',
  'Najam GoPro Hero 13 Black | Akcijska kamera 5.3K | Rentanje.com',
  'Iznajmite GoPro Hero 13 Black – 5.3K video, HyperSmooth 6.0, vodootporna do 10m. Idealna za avanture, sport i putovanja!',
  '{"najam GoPro","GoPro Hero 13 iznajmljivanje","akcijska kamera najam","rent kamera","GoPro rent Hrvatska"}',
  '[{"question": "Koja je rezolucija GoPro Hero 13?", "answer": "GoPro Hero 13 snima video do 5.3K pri 60fps i 4K pri 120fps. Za fotografije koristi senzor od 27,6 megapiksela. Podržava i Burst Slo-Mo do 400fps pri 720p za ultra-usporene snimke."}, {"question": "Koliko traje baterija GoPro Hero 13?", "answer": "Nova 1900mAh Enduro baterija pruža do 2,5 sata neprekidnog snimanja. Trajanje ovisi o rezoluciji – na 1080p traje do 3 sata, a na 5.3K oko 1,5 sat."}, {"question": "Je li GoPro Hero 13 vodootporan?", "answer": "Da, vodootporna je do 10 metara dubine bez dodatnog kućišta. Idealna za ronjenje s maskom, surfanje, kajak i sve vodene aktivnosti."}, {"question": "Mogu li snimati usporene snimke?", "answer": "Apsolutno! Hero 13 podržava 4K pri 120fps za glatke usporene snimke, te ekskluzivni Burst Slo-Mo mod s 400fps pri 720p za 15 sekundi u stvarnom vremenu."}, {"question": "Što dolazi u paketu pri najmu?", "answer": "Uz kameru dobivate bateriju, USB-C kabel za punjenje i prijenos, te montažne prste kompatibilne sa svim GoPro dodacima. Dodatni dodaci dostupni su na upit."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Beerpong stol i čaše',
  'beer-pong-stol-case-najam',
  (SELECT id FROM categories WHERE slug = 'igre-i-zabava'),
  'Komplet za najpopularniju party igru – sklopivi stol i čaše, spreman za zabavu u par minuta. Za roštilj, tulume i team building.',
  'Iznajmite komplet za Beer Pong – najpopularniju društvenu igru za svaku zabavu! Set uključuje sklopivi stol idealne veličine za igru i set čaša, sve spremno za postavljanje u par minuta. Beer Pong je savršen za kućne zabave, roštilj u vrtu, team building događanja ili studentske tulume. Jednostavna pravila znače da se svatko može pridružiti, a natjecateljski duh garantira sate smijeha i zabave. Stol se lako prenosi i sprema nakon zabave.',
  'Najam Beer Pong Stola s Čašama | Party igra | Rentanje.com',
  'Iznajmite Beer Pong set – stol i čaše za savršenu zabavu! Idealno za kućne partye, roštilj i team building. Brzo postavljanje!',
  '{"beer pong najam","iznajmljivanje beer pong stola","party igre najam","društvene igre najam","beer pong set rent"}',
  '[{"question": "Što uključuje Beer Pong set?", "answer": "Set uključuje sklopivi stol prilagođen za Beer Pong igru i komplet čaša. Sve što trebate za postavljanje igre je u paketu."}, {"question": "Koliko ljudi može igrati Beer Pong?", "answer": "Standardno igraju 2 tima po 2 igrača (ukupno 4), ali pravila se mogu prilagoditi za veće grupe – čak i turnirski format za 10+ igrača."}, {"question": "Je li Beer Pong stol sklopiv?", "answer": "Da, stol je sklopiv i lako prenosiv. Možete ga postaviti u vrtu, na terasi, u garaži ili u zatvorenom prostoru u samo par minuta."}, {"question": "Za kakve događaje je Beer Pong idealan?", "answer": "Savršen za kućne zabave, studentske tulume, roštilj u vrtu, team building, rođendane ili bilo koji društveni event gdje želite dodatnu dozu zabave i natjecanja."}, {"question": "Trebam li donijeti vlastite loptice?", "answer": "Obratite nam se prilikom rezervacije – potvrdićemo sve što je uključeno u najam i dogovoriti eventualne dodatke."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'DJI Osmo Action 5 Pro',
  'dji-osmo-action-5-pro-najam',
  (SELECT id FROM categories WHERE slug = 'kamere-i-oprema'),
  'Akcijska kamera s velikim 1/1.3" senzorom, 4K/120fps videom, 4h baterijom i vodootpornošću do 20m. Profesionalna kvaliteta u kompaktnom tijelu.',
  'Iznajmite DJI Osmo Action 5 Pro – akcijsku kameru nove generacije s velikim 1/1.3-inčnim senzorom od 40 megapiksela i dinamičkim rasponom od 13,5 stopova koji rivalizira profesionalnim kamerama. Snima 4K video pri 120fps za ultra-glatke usporene snimke. Baterija od 1950mAh pruža do 4 sata rada – 50% dulje od prethodnika. Vodootporna do 20 metara bez kućišta (60m s kućištem), s dualnim OLED touchscreenovima za jednostavno kadriranje. RockSteady 3.0 i 360° HorizonSteady stabilizacija osiguravaju savršeno mirne snimke čak i u ekstremnim uvjetima. Ugrađenih 64GB memorije plus microSD utor.',
  'Najam DJI Osmo Action 5 Pro | 4K kamera | Rentanje.com',
  'Iznajmite DJI Osmo Action 5 Pro – 4K/120fps, 4h baterija, vodootporna do 20m, 40MP senzor. Za sport, avanture i vlogove!',
  '{"najam DJI kamere","DJI Osmo Action 5 najam","akcijska kamera rent","4K kamera iznajmljivanje","DJI rent"}',
  '[{"question": "Koja je razlika između DJI Osmo Action 5 Pro i GoPro Hero 13?", "answer": "DJI Action 5 Pro ima veći 1/1.3\" senzor s boljim performansama pri slabom svjetlu i 13,5 stopova dinamičkog raspona. Baterija traje do 4 sata naspram ~2,5h kod GoPro. GoPro pak nudi 5.3K rezoluciju i zamjenjive leće."}, {"question": "Koliko traje baterija DJI Osmo Action 5 Pro?", "answer": "Do 4 sata neprekidnog snimanja pri 1080p/24fps. Na 4K/60fps očekujte oko 2 sata. Radi čak i na temperaturama do -20°C."}, {"question": "Je li vodootporna bez dodatnog kućišta?", "answer": "Da, vodootporna je do 20 metara bez kućišta. S vodootpornim kućištem može roniti do 60 metara dubine."}, {"question": "Ima li ugrađenu memoriju?", "answer": "Da, dolazi s 64GB ugrađene memorije (47GB dostupno za korištenje) plus microSD utor koji podržava kartice do 1TB."}, {"question": "Kakva je stabilizacija slike?", "answer": "Koristi RockSteady 3.0 elektronsku stabilizaciju i 360° HorizonSteady koja održava horizont ravan čak i pri rotacijama od 360°. Rezultat su profesionalno mirne snimke bez gimbala."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Insta360 X5',
  'insta360-x5-360-kamera-najam',
  (SELECT id FROM categories WHERE slug = 'kamere-i-oprema'),
  'Vrhunska 360° kamera s 8K videom, zamjenjivim lećama, IP68 zaštitom i FlowState stabilizacijom. Snimite sve oko sebe i odaberite kut naknadno.',
  'Iznajmite Insta360 X5 – najnoviju 360° kameru koja snima nevjerojatnih 8K pri 30fps s naduzorkovanem iz 11K za kristalno jasne detalje. Veći 1/1.28" senzori (144% veći od prethodnika) hvataju drastično više svjetla, a Triple AI Chip sustav s PureVideo modom daje čiste, žive snimke čak i noću. Zamjenjive leće štite od ogrebotina, a baterija od 2400mAh traje do 185 minuta. Vodootporna do 15 metara bez kućišta (IP68). FlowState stabilizacija i 360° Horizon Lock osiguravaju savršeno glatke snimke. Snimajte sve oko sebe i odaberite najbolji kut naknadno u Insta360 aplikaciji.',
  'Najam Insta360 X5 | 8K 360° kamera | Rentanje.com',
  'Iznajmite Insta360 X5 – 8K 360° video, zamjenjive leće, IP68, FlowState stabilizacija. Za putovanja, sport i kreativne projekte!',
  '{"najam Insta360","360 kamera najam","Insta360 X5 rent","8K kamera iznajmljivanje","360 video kamera najam"}',
  '[{"question": "Što je posebno kod 360° kamere?", "answer": "360° kamera snima sve oko vas istovremeno. Naknadno u aplikaciji birate najbolji kut, kadar i kompoziciju. Nikad nećete propustiti savršen trenutak jer je sve snimljeno!"}, {"question": "Koliko je dobra kvaliteta slike Insta360 X5?", "answer": "Insta360 X5 snima u 8K rezoluciji pri 30fps, s naduzorkovanem iz 11K. Senzori su 144% veći od prethodnog modela, što daje drastično bolju sliku, posebno pri slabom svjetlu."}, {"question": "Je li Insta360 X5 vodootporna?", "answer": "Da, ima IP68 certifikat i vodootporna je do 15 metara bez dodatnog kućišta. Savršena za snorkeling, surfanje i vodene sportove."}, {"question": "Koliko traje baterija?", "answer": "Baterija od 2400mAh traje do 185 minuta u štedljivom načinu rada. U 8K modu očekujte oko 80 minuta snimanja."}, {"question": "Kako se koristi ''nevidljivi selfie štap''?", "answer": "Zahvaljujući 360° snimanju, selfie štap se automatski briše iz kadra – kao da ga nema! Dobivate dron-like snimke iz trećeg lica bez drona."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Insta360 GO 3 - 64GB',
  'insta360-go-3-mini-kamera-najam',
  (SELECT id FROM categories WHERE slug = 'kamere-i-oprema'),
  'Najmanji akcijski kamera na svijetu – samo 35g! Snima 2.7K video s magnetskom montažom i Action Podom. Za kreativne POV snimke.',
  'Iznajmite Insta360 GO 3 – najmanji akcijski kamera na svijetu, teška samo 35 grama! Unatoč minijaturnoj veličini, snima u 2.7K rezoluciji s FlowState stabilizacijom za glatke, profesionalne snimke. Magnetski dizajn omogućuje montažu doslovno bilo gdje – na kapu, ogrlicu, kacig, skateboard ili čak na kućnog ljubimca. Action Pod s 2.2" flip touchscreenom služi kao daljinski upravljač, punjač i live preview monitor s 170 minuta baterije. Vodootporna do 5 metara. 64GB ugrađene memorije. Savršena za kreativne POV snimke koje nijedna druga kamera ne može uhvatiti.',
  'Najam Insta360 GO 3 | Mini kamera 35g | Rentanje.com',
  'Iznajmite Insta360 GO 3 – 35g mini kamera, 2.7K video, magnetska montaža, vodootporna. Za kreativne POV snimke!',
  '{"najam mini kamere","Insta360 GO 3 rent","mala akcijska kamera najam","POV kamera iznajmljivanje","mini kamera rent"}',
  '[{"question": "Koliko je zapravo mala Insta360 GO 3?", "answer": "Teži samo 35 grama i dimenzije su joj 54,4 × 25,6 × 23,3 mm – otprilike veličine palca. To je najmanji akcijski kamera na svijetu."}, {"question": "Kako se montira?", "answer": "Magnetski dizajn omogućuje montažu na ogrlicu (Magnet Pendant), kopču za odjeću (Easy Clip) ili bilo koju metalnu površinu. Dolazi s tri uključena dodatka za montažu."}, {"question": "Koliko traje baterija?", "answer": "Sama kamera ima 45 minuta snimanja. S Action Podom ukupno dobivate 170 minuta. Action Pod puni kameru i služi kao daljinski s flip touchscreenom."}, {"question": "Je li vodootporna?", "answer": "Da, kamera je vodootporna do 5 metara (16 stopa). Action Pod je otporan na prskanje vode."}, {"question": "Koliko memorije ima?", "answer": "64GB ugrađene memorije – dovoljno za satima snimanja u 2.7K rezoluciji."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Kamado roštilj',
  'kamado-rostilj-keramicki-najam',
  (SELECT id FROM categories WHERE slug = 'rostilji-i-kuhanje'),
  'Keramički roštilj za roštiljanje, dimljenje, pečenje i slow cooking. Od 80°C do 400°C – najsvestraniji roštilj za posebne prilike.',
  'Iznajmite Kamado keramički roštilj – kralj svih roštiljanja! Kamado stil kombinira roštiljanje, dimljenje, pečenje i slow cooking u jednom uređaju zahvaljujući debelim keramičkim stijenkama koje zadržavaju toplinu i vlagu. Postiže temperature od 80°C za nisko i sporo dimljenje do preko 400°C za savršenu pizzu ili searing steaka. Keramička izolacija znači minimalnu potrošnju ugljena i ravnomjernu temperaturu satima. Idealan za roštilj za veće društvo, family gathering ili posebne prilike kada želite impresionirati goste.',
  'Najam Kamado Roštilja | Keramički BBQ | Rentanje.com',
  'Iznajmite Kamado keramički roštilj – roštiljanje, dimljenje i pečenje u jednom! Idealan za posebne prilike i veće društvo.',
  '{"kamado najam","keramički roštilj iznajmljivanje","najam roštilja","kamado rent","BBQ najam","roštilj za dimljenje najam"}',
  '[{"question": "Što mogu pripremiti na Kamado roštilju?", "answer": "Gotovo sve! Roštiljanje steakova i kobasica, slow cooking pulled porka (8-12h), dimljenje rebara, pečenje pizze na 400°C, pa čak i pečenje kruha. Kamado je najsvestraniji roštilj."}, {"question": "Koliko ugljena treba?", "answer": "Zahvaljujući keramičkoj izolaciji, Kamado troši znatno manje ugljena od klasičnih roštiljeva. Za 6-8 sati kuhanja dovoljno je jedno punjenje ugljena."}, {"question": "Je li teško upravljati temperaturom?", "answer": "Ne, zapravo je jednostavno! Temperatura se regulira otvaranjem i zatvaranjem gornjeg i donjeg ventila. Jednom kad namjestite, Kamado održava konstantnu temperaturu satima."}, {"question": "Za koliko ljudi mogu pripremiti hranu?", "answer": "Ovisno o veličini modela, udobno priprema hranu za 8-15 osoba. Idealan za obiteljska okupljanja i veće zabave."}, {"question": "Trebam li iskustvo s Kamado roštiljem?", "answer": "Osnovna upotreba je jednostavna. Uz najam dobivate upute za korištenje, a naš tim vam može dati savjete za pripremu konkretnih jela."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Točionik za pivu 5L',
  'tocionik-za-pivu-5l-najam',
  (SELECT id FROM categories WHERE slug = 'pice-i-oprema'),
  'Kompaktni aparat za točenje i hlađenje piva iz 5L bačvi na 2-12°C. Kremasta pjena kao u pivnici – za svaku kućnu zabavu!',
  'Iznajmite aparat za točenje piva s hlađenjem – savršen za svaku kućnu zabavu! Ovaj kompaktni točionik prima standardne 5-litrene bačve piva i hladi ih na idealnu temperaturu servirana (2-12°C). Jednostavno ubacite bačvu, uključite hlađenje i za kratko vrijeme toči se savršeno hladno pivo s kremastom pjenom – baš kao u pivnici! Srebrno-crni dizajn uklapa se u svaki prostor, a jednostavno upravljanje znači da ga može koristiti svatko.',
  'Najam Točionika za Pivu 5L | Hlađenje i točenje | Rentanje.com',
  'Iznajmite aparat za točenje piva 5L – hlađenje 2-12°C, kremasta pjena, za standardne bačve. Savršen za party i roštilj!',
  '{"točionik za pivu najam","aparat za pivo iznajmljivanje","točenje piva najam","beer dispenser rent","party oprema najam"}',
  '[{"question": "Koje bačve piva odgovaraju u točionik?", "answer": "Točionik prima standardne 5-litrene bačve piva koje se mogu kupiti u većini trgovina – Heineken, Paulaner, BudBeer i mnogi drugi brendovi."}, {"question": "Na koju temperaturu hladi pivo?", "answer": "Aparat hladi pivo na temperaturu od 2 do 12°C, ovisno o vašoj želji. Idealna temperatura za većinu piva je oko 4-6°C."}, {"question": "Koliko brzo ohladi pivo?", "answer": "Sustav hlađenja počinje raditi odmah po uključivanju. Za optimalno hladno pivo, preporučujemo da bačvu stavite barem 8-10 sati ranije ili koristite već ohlađenu bačvu."}, {"question": "Je li teško za korištenje?", "answer": "Iznimno jednostavno – stavite bačvu u aparat, spojite crijevo, uključite hlađenje i točite. Nema potrebe za CO2 bočicama ni kompliciranim podešavanjem."}, {"question": "Trebam li nešto dodatno uz najam?", "answer": "Samo kupite 5-litarsku bačvu piva po svom izboru – aparat uključuje sve potrebno za točenje i hlađenje."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'DJI Osmo Pocket 3',
  'dji-osmo-pocket-3-najam',
  (SELECT id FROM categories WHERE slug = 'kamere-i-oprema'),
  'Kompaktna gimbal kamera s 1" senzorom, 4K/120fps videom i rotirajućim OLED ekranom. Savršena za vlogove, putovanja i evente.',
  'Iznajmite DJI Osmo Pocket 3 – kompaktnu gimbal kameru s 1-inčnim CMOS senzorom koja snima profesionalni 4K video pri 120fps. Mehanička 3-osna stabilizacija osigurava savršeno glatke snimke bez ikakve post-produkcije. Rotirajući 2" OLED touchscreen omogućuje brzo prebacivanje između horizontalnog i vertikalnog snimanja – idealno za TikTok i Instagram Reels. Podržava D-Log M i 10-bit boju za filmski look, ActiveTrack 6.0 za automatsko praćenje subjekata i DJI Mic 2 za profesionalan zvuk. Savršena za vlogere, putovanja i dokumentiranje događaja.',
  'Najam DJI Osmo Pocket 3 | Gimbal kamera 4K | Rentanje.com',
  'Iznajmite DJI Osmo Pocket 3 – 4K/120fps, 3-osni gimbal, 1" senzor, OLED ekran. Idealna za vlogove, putovanja i evente!',
  '{"najam DJI Pocket","DJI Osmo Pocket 3 rent","gimbal kamera najam","vlog kamera iznajmljivanje","4K gimbal najam"}',
  '[{"question": "Čemu služi gimbal u kameri?", "answer": "3-osni mehanički gimbal stabilizira kameru u svim smjerovima, eliminira tresanje ruku i daje profesionalno glatke snimke – bez potrebe za dodatnom stabilizacijom u post-produkciji."}, {"question": "Može li snimati vertikalni video?", "answer": "Da! Rotirajući 2\" OLED ekran omogućuje brzo prebacivanje iz horizontalnog u vertikalni mod – savršeno za TikTok, Instagram Reels i Stories."}, {"question": "Kakva je kvaliteta slike?", "answer": "1-inčni CMOS senzor snima 4K pri 120fps s 10-bit bojom i D-Log M profilom. Dinamički raspon i low-light performanse su na razini mnogo skupljih kamera."}, {"question": "Može li pratiti subjekt automatski?", "answer": "Da, ActiveTrack 6.0 prepoznaje i prati lica i objekte automatski, držeći ih u kadru dok se krećete – idealno za vlogove i intervjue."}, {"question": "Koliko traje baterija?", "answer": "Baterija pruža oko 166 minuta snimanja na 1080p/24fps. Na 4K/60fps očekujte oko 80-100 minuta."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Prenosivi stol i 2 klupe za 8 osoba ratan',
  'prijenosni-ratan-stol-klupe-8-osoba-najam',
  (SELECT id FROM categories WHERE slug = 'namjestaj-i-oprema'),
  'Elegantni sklopivi set ratan stola i dvije klupe za do 8 osoba. Za vrtne zabave, piknik i evente na otvorenom.',
  'Iznajmite elegantni prijenosni set ratan stola i dvije klupe za do 8 osoba. Savršen za vrtne zabave, piknik, obiteljska okupljanja ili evente na otvorenom. Ratan dizajn daje moderan i sofisticiran izgled, a sklopiva konstrukcija omogućuje lak transport i postavljanje. Set je dovoljno prostran da udobno sjedi 8 osoba za stolom, idealan za objed, večeru ili druženje na otvorenom.',
  'Najam Ratan Stola i Klupa za 8 osoba | Rentanje.com',
  'Iznajmite prijenosni ratan stol i 2 klupe za 8 osoba – elegantan, sklopiv, idealan za vrtne zabave i evente!',
  '{"najam stola i klupa","ratan namještaj najam","prijenosni stol iznajmljivanje","event namještaj rent","stol za 8 osoba najam"}',
  '[{"question": "Za koliko osoba je stol?", "answer": "Stol s dvije klupe udobno prima do 8 osoba – 4 na svakoj klupi."}, {"question": "Je li set sklopiv?", "answer": "Da, stol i klupe su sklopivi i prijenosni, što olakšava transport i postavljanje na bilo kojoj lokaciji."}, {"question": "Može li se koristiti na otvorenom?", "answer": "Apsolutno! Set je dizajniran za vanjsku upotrebu – vrtove, terase, parkove i event prostore."}, {"question": "Kakav je materijal?", "answer": "Ratan dizajn pruža moderan i elegantan izgled, otporan je na vremenske uvjete i lak za održavanje."}, {"question": "Dostavljate li na lokaciju?", "answer": "Da, kontaktirajte nas za detalje o dostavi i postavljanju na vašoj lokaciji."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Paviljon/Šator 3x3m',
  'paviljon-sator-3x3m-najam',
  (SELECT id FROM categories WHERE slug = 'namjestaj-i-oprema'),
  'Prijenosni party šator 3×3m za zaštitu od sunca i kiše. Brzo postavljanje, čvrsta konstrukcija – za sve outdoor evente.',
  'Iznajmite prijenosni paviljon dimenzija 3x3 metra za zaštitu od sunca i kiše na vašim outdoor događanjima. Čvrsta konstrukcija pruža pouzdano sklonište za do 10-15 stojećih gostiju ili 8-10 sjedećih. Idealan za vrtne zabave, roštilj, rođendane, sajmove ili bilo koji event na otvorenom. Brzo se postavlja i sklapa bez potrebe za posebnim alatom. Pruža hlad tijekom vrućih ljetnih dana i zaštitu od neočekivane kiše.',
  'Najam Paviljona / Šatora 3x3m | Rentanje.com',
  'Iznajmite paviljon 3x3m – zaštita od sunca i kiše za vrtne zabave, roštilj i evente. Brzo postavljanje, čvrsta konstrukcija!',
  '{"najam paviljona","šator 3x3 najam","party šator iznajmljivanje","event šator rent","paviljon za vrt najam"}',
  '[{"question": "Koje su dimenzije paviljona?", "answer": "Paviljon je dimenzija 3×3 metra, što daje 9 m² zaštićene površine – dovoljno za stol s 8 stolica ili prostor za stajanje 10-15 osoba."}, {"question": "Koliko je brzo postavljanje?", "answer": "Postavljanje je brzo i jednostavno – obično 15-20 minuta s dvije osobe, bez potrebe za posebnim alatom."}, {"question": "Štiti li od kiše?", "answer": "Da, paviljon pruža zaštitu od sunca i laganije kiše. Za jake oborine preporučujemo dodatno osiguranje konstrukcije."}, {"question": "Mogu li ga postaviti na travu?", "answer": "Da, paviljon se može postaviti na travu, beton, asfalt ili bilo koju ravnu površinu. Dolazi s klinovima za učvršćivanje na mekom tlu."}, {"question": "Može li se dodati bočna stranica?", "answer": "Kontaktirajte nas za informacije o dostupnosti bočnih stranica i dodatnih opcija za vaš event."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Projektor sa platnom',
  'projektor-s-platnom-najam',
  (SELECT id FROM categories WHERE slug = 'audio-i-video-oprema'),
  'Projektor s platnom za filmske večeri na otvorenom, gledanje utakmica i prezentacije. Veliki ekran bez odlaska u kino!',
  'Iznajmite projektor s platnom i pretvorite bilo koji prostor u privatno kino! Savršen za filmske večeri na otvorenom, gledanje utakmica s prijateljima, prezentacije ili romantične evening pod zvijezdama. Projektor daje jasnu, veliku sliku na uključenom platnu, a postavljanje je brzo i jednostavno. Spojite laptop, mobitel, USB ili streaming uređaj i uživajte u velikom ekranu bez odlaska u kino. Idealan za dvorišta, terase, kućne zabave i poslovne prezentacije.',
  'Najam Projektora s Platnom | Kino na otvorenom | Rentanje.com',
  'Iznajmite projektor s platnom – veliki ekran za filmske večeri, utakmice i evente. Jednostavno postavljanje, jasna slika!',
  '{"najam projektora","projektor s platnom rent","kino na otvorenom najam","filmska večer oprema","projektor iznajmljivanje"}',
  '[{"question": "Što je uključeno u najam?", "answer": "Paket uključuje projektor i platno – sve što trebate za veliki ekran. Kablove za najčešće uređaje također dobivate."}, {"question": "Kako spojiti uređaj na projektor?", "answer": "Projektor se može spojiti na laptop, smartphone, USB, gaming konzolu ili streaming uređaj poput Chromecast-a. HDMI je najčešća opcija."}, {"question": "Mogu li ga koristiti na otvorenom?", "answer": "Da! Projektor je idealan za dvorišta i terase. Za najbolju sliku, koristite ga u mraku ili sumraku."}, {"question": "Kolika je veličina slike?", "answer": "Veličina slike ovisi o udaljenosti projektora od platna. Obično pokriva dijagonalu od 80-120 inča za filmski doživljaj."}, {"question": "Trebam li dodatne zvučnike?", "answer": "Projektor ima ugrađene zvučnike za manje grupe. Za veći event preporučujemo kombinaciju s jednim od naših Bluetooth zvučnika za puni zvučni doživljaj."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Cornhole',
  'cornhole-igra-najam',
  (SELECT id FROM categories WHERE slug = 'igre-i-zabava'),
  'Popularna outdoor igra bacanja vrećica za sve uzraste. Jednostavna pravila, zarazno natjecanje – za roštilj, vjenčanja i team building.',
  'Iznajmite Cornhole – jednu od najpopularnijih outdoor igara na svijetu! Cilj igre je baciti vrećice punjene kukuruzom u rupu na kosoj dasci koja se nalazi na 10 metara udaljenosti. Jednostavna pravila, ali iznenađujuće zarazno natjecanje koje garantira sate zabave za sve uzraste. Savršena za roštilj u vrtu, team building, vjenčanja, festivale ili bilo koji outdoor event. Igra za 2-4 igrača, a može se igrati i turnirski s većim grupama.',
  'Najam Cornhole Igre | Outdoor zabava | Rentanje.com',
  'Iznajmite Cornhole set – popularna outdoor igra za sve uzraste! Za roštilj, vjenčanja i team building. Jednostavna i zarazna!',
  '{"cornhole najam","igra bacanja vrećica rent","outdoor igre najam","team building igre iznajmljivanje","party igre najam"}',
  '[{"question": "Kako se igra Cornhole?", "answer": "Dva igrača ili tima naizmjenično bacaju vrećice prema kosoj dasci s rupom. Vrećica u rupi nosi 3 boda, a na dasci 1 bod. Igra se obično do 21 boda."}, {"question": "Za koliko igrača je Cornhole?", "answer": "Standardno za 2 igrača ili 2 tima po 2 igrača (ukupno 4). Može se organizirati i turnir za veće grupe."}, {"question": "Je li pogodna za djecu?", "answer": "Apsolutno! Cornhole je igra za sve uzraste – od djece do seniora. Pravila su jednostavna, a igra ne zahtijeva fizičku snagu."}, {"question": "Koliko prostora treba?", "answer": "Službena udaljenost između dasaka je oko 8-10 metara, plus prostor za igrače. Ukupno oko 12-15 metara u dužinu."}, {"question": "Može li se igrati na travi?", "answer": "Da, Cornhole se može igrati na travi, pijesku, betonu ili bilo kojoj relativno ravnoj površini."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Igra - Velika Jenga (big jenga)',
  'velika-jenga-giant-jenga-igra-najam',
  (SELECT id FROM categories WHERE slug = 'igre-i-zabava'),
  'Velika verzija klasične Jenge s drvenim blokovima koji rastu do 150cm! Spektakularna igra za vrtne zabave i evente.',
  'Iznajmite Giant Jenga – veliku verziju klasične igre s drvenim blokovima koja raste do impresivne visine! Igrači naizmjenično izvlače blokove iz tornja i slažu ih na vrh, a napetost raste sa svakim potezom. Tko sruši toranj – gubi! Velika Jenga je savršena za vrtne zabave, vjenčanja, team building, festivale i sve outdoor evente. Drveni blokovi su dovoljno veliki da igra postane spektakularna i privuče pozornost svih gostiju.',
  'Najam Velike Jenge (Giant Jenga) | Party igra | Rentanje.com',
  'Iznajmite Giant Jenga – veliku drvenu igru za outdoor zabave! Savršena za vjenčanja, team building i festivale.',
  '{"velika jenga najam","giant jenga rent","outdoor igre najam","party igre iznajmljivanje","drvena jenga najam"}',
  '[{"question": "Koliko je velika Giant Jenga?", "answer": "Giant Jenga započinje na visini od oko 60-75 cm i može narasti do 150 cm ili više tijekom igre – što je čini spektakularnom za gledanje i igranje!"}, {"question": "Koliko ljudi može igrati?", "answer": "Nema strogog ograničenja – može igrati 2 do 10+ igrača. Idealna za grupe jer se igrači jednostavno izmjenjuju."}, {"question": "Je li pogodna za djecu?", "answer": "Da, djeca obožavaju Giant Jenga! Velike blokove je lakše držati nego standardne, ali pazite pri višim tornjevima jer su blokovi teži od obične Jenge."}, {"question": "Mogu li igrati na travi?", "answer": "Da, ali preporučujemo ravnu i čvrstu podlogu (beton, terasa) za stabilniji toranj. Na travi igra funkcionira, ali toranj može biti manje stabilan."}, {"question": "Od čega su blokovi?", "answer": "Blokovi su izrađeni od čvrstog drveta, brušeni i otporni na habanje. Kvalitetna izrada osigurava dug vijek trajanja i ugodno korištenje."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Firepit Bonfire 2.0',
  'solo-stove-bonfire-firepit-najam',
  (SELECT id FROM categories WHERE slug = 'vatru-i-grijanje'),
  'Prijenosno vatrište od nehrđajućeg čelika s patentiranim sustavom koji proizvodi prekrasne plamene s minimalno dima.',
  'Iznajmite Solo Stove Bonfire 2.0 – revolucionarno prijenosno vatrište koje proizvodi prekrasne plamene s minimalno dima! Patentirana dvostruka stijenka usmjerava protok zraka tako da drvo gori potpunije, što znači manje dima, manje pepela i intenzivniju vatru. Kompaktan i prijenosan dizajn od nehrđajućeg čelika idealan je za dvorišta, kampiranje, plaže i evente. Nikad više nećete sjesti s pogrešne strane vatre – jer dima gotovo nema!',
  'Najam Solo Stove Bonfire 2.0 | Vatrište bez dima | Rentanje.com',
  'Iznajmite Solo Stove Bonfire 2.0 – prijenosno vatrište bez dima! Savršeno za dvorišta, kampiranje i romantične večeri.',
  '{"firepit najam","vatrište bez dima rent","Solo Stove najam","prijenosno vatrište iznajmljivanje","bonfire najam"}',
  '[{"question": "Zašto ovo vatrište ne dimi?", "answer": "Patentirani sustav dvostruke stijenke usmjerava protok zraka koji ''sagorijeva'' dim prije nego izađe. Rezultat je čista, intenzivna vatra s minimalnim dimom."}, {"question": "Što mogu koristiti kao gorivo?", "answer": "Koristi standardno drvo za ogrjev, brikete ili pellete. Ne koristi plin ni tekuća goriva."}, {"question": "Je li sigurno za dvorište?", "answer": "Da, uz odgovarajuću podlogu otpornu na toplinu. Preporučujemo korištenje na vatrostalnoj površini i udaljeno od zapaljivih materijala."}, {"question": "Koliko je veliko?", "answer": "Bonfire 2.0 je kompaktan – promjer oko 49 cm, dovoljno velik za ugodnu vatru ali prijenosan za transport."}, {"question": "Mogu li na njemu kuhati?", "answer": "Solo Stove nudi opcionalne rešetke za kuhanje. Za najam, kontaktirajte nas i provjerit ćemo raspoloživost dodatne opreme."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Aparat za raditi kokice',
  'aparat-za-kokice-popcorn-masina-najam',
  (SELECT id FROM categories WHERE slug = 'hrana-i-pice-oprema'),
  'Retro aparat za kokice koji priprema svježe, hrskave kokice u minutama. Savršen za filmske večeri, rođendane i evente.',
  'Iznajmite aparat za kokice i dodajte retro šarm svakoj zabavi! Profesionalni popcorn maker priprema svježe, hrskave kokice u roku od nekoliko minuta – miris koji će privući sve goste. Savršen za kućne filmske večeri, rođendane, festivale, sajmove, team building ili bilo koji event. Jednostavan za korištenje – samo dodajte kukuruz i ulje, uključite i uživajte u svježim kokicama kao u kinu!',
  'Najam Aparata za Kokice | Popcorn mašina | Rentanje.com',
  'Iznajmite aparat za kokice – svježi popcorn za filmske večeri, rođendane i evente! Retro dizajn, brzo pripremanje.',
  '{"aparat za kokice najam","popcorn mašina rent","najam popcorn aparata","kokice za event","party oprema najam"}',
  '[{"question": "Koliko brzo priprema kokice?", "answer": "Aparat priprema porciju svježih kokica u 3-5 minuta. Dovoljno brzo da opslužite goste tijekom cijelog eventa."}, {"question": "Trebam li donijeti kukuruz?", "answer": "Kontaktirajte nas pri rezervaciji – dogovorit ćemo što je uključeno u najam i što trebate osigurati sami."}, {"question": "Može li se koristiti na otvorenom?", "answer": "Da, aparat se može koristiti na otvorenom uz pristup strujnoj utičnici."}, {"question": "Za kakve evente je idealan?", "answer": "Filmske večeri, rođendani, festivali, sajmovi, team building, vjenčanja, korporativni eventi – kokice su uvijek hit!"}, {"question": "Koliko kokica može napraviti?", "answer": "Profesionalni aparat može pripremiti veće količine kokica – dovoljno za deseti gostiju tijekom cijelog eventa."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Kärcher Puzzi',
  'karcher-puzzi-mokro-suhi-usisavac-najam',
  (SELECT id FROM categories WHERE slug = 'ciscenje-i-odrzavanje'),
  'Profesionalni mokro-suhi ekstraktor za dubinsko čišćenje tepiha, namještaja i autosjedala. Rezultati kao od profesionalaca!',
  'Iznajmite Kärcher Puzzi 10/1 – profesionalni mokro-suhi ekstraktor za dubinsko čišćenje tepiha, tapeciranog namještaja, autosjedala i ostalih tekstilnih površina. Snažna usisna moć izvlači duboko unesenu prljavštinu, mrlje i tekućine koje obični usisivači ne mogu doseći. Rezultat je dubinski očišćen, osvježen tekstil koji izgleda i miriše kao nov. Idealan za generalno čišćenje stanova, automobila, ureda ili pripremu prostora nakon eventa.',
  'Najam Kärcher Puzzi 10/1 | Dubinsko čišćenje | Rentanje.com',
  'Iznajmite Kärcher Puzzi 10/1 – profesionalno dubinsko čišćenje tepiha, namještaja i autosjedala. Rezultati kao od profesionalaca!',
  '{"Kärcher Puzzi najam","dubinsko čišćenje najam","ekstraktor za tepihe rent","najam čistača tepiha","mokri usisavač najam"}',
  '[{"question": "Što mogu čistiti s Kärcher Puzzi?", "answer": "Tepihe, tapacirani namještaj (kauče, fotelje), autosjedala, madrace, tepisone i sve tekstilne površine. Izvlači duboko unesenu prljavštinu, mrlje i tekućine."}, {"question": "Kako funkcionira ekstraktor?", "answer": "Puzzi prska otopinu vode i sredstva za čišćenje u tekstil pod pritiskom, a zatim snažno usisava svu prljavštinu i vlagu. Rezultat je dubinski čist i osvježen tekstil."}, {"question": "Trebam li kupiti sredstvo za čišćenje?", "answer": "Kontaktirajte nas – informirat ćemo vas o tome što je uključeno u najam i preporučiti najprikladnije sredstvo za čišćenje."}, {"question": "Koliko se brzo suši nakon čišćenja?", "answer": "Tekstil se obično osuši za 2-4 sata uz dobru ventilaciju. Puzzi izvlači većinu vlage pa je sušenje brže nego kod ručnog pranja."}, {"question": "Je li teško za korištenje?", "answer": "Ne, Kärcher Puzzi je dizajniran za jednostavno korištenje. Uz najam dobivate upute, a osnovno rukovanje nauči se u par minuta."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Weber prijenosni roštilj',
  'weber-traveler-prijenosni-plinski-rostilj-najam',
  (SELECT id FROM categories WHERE slug = 'rostilji-i-kuhanje'),
  'Prijenosni plinski roštilj sa sklopivim dizajnom poput kofera na kotačima. Instant paljenje, za 6-8 osoba. Za kampiranje i piknik.',
  'Iznajmite Weber Traveler – prijenosni plinski roštilj dizajniran za avanture! Jedinstveni sklopivi dizajn omogućuje postavljanje i spremanje u samo par sekundi – poput sklopivog kofera na kotačima. Prostrana površina za roštiljanje (2.065 cm²) dovoljna je za pripremu hrane za 6-8 osoba. Plinski pogon znači instant paljenje, brzo zagrijavanje i preciznu kontrolu temperature. Porculanski emajlirani poklopac i rešetka zadržavaju toplinu i daju savršene rezultate. Idealan za kampiranje, piknik, plažu ili roštilj u parku.',
  'Najam Weber Traveler Roštilja | Prijenosni BBQ | Rentanje.com',
  'Iznajmite Weber Traveler prijenosni plinski roštilj – sklopiv, brzo paljenje, za 6-8 osoba. Za kampiranje, piknik i evente!',
  '{"Weber roštilj najam","prijenosni roštilj rent","plinski roštilj iznajmljivanje","Weber Traveler najam","camping roštilj najam"}',
  '[{"question": "Koliko brzo se postavlja?", "answer": "Weber Traveler se postavlja i sklapa u nekoliko sekundi – funkcionira poput sklopivog kofera s kotačima. Nema kompliciranog montiranja."}, {"question": "Koji plin koristi?", "answer": "Koristi standardne plinske boce. Kontaktirajte nas za informacije o tome što je uključeno u najam."}, {"question": "Kolika je površina za roštiljanje?", "answer": "Površina za roštiljanje iznosi 2.065 cm² – dovoljno za pripremu hrane za 6-8 osoba istovremeno."}, {"question": "Može li se koristiti na kampiranju?", "answer": "Apsolutno! Weber Traveler je dizajniran upravo za mobilnu upotrebu – kampiranje, piknik, plaža ili roštilj u parku. Kotači olakšavaju transport."}, {"question": "Koliko je težak?", "answer": "Roštilj teži oko 22 kg, ali zahvaljujući kotačima i sklopivom dizajnu, lako se transportira na bilo koju lokaciju."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Select Ražanj s motorom',
  'razanj-s-motorom-najam',
  (SELECT id FROM categories WHERE slug = 'rostilji-i-kuhanje'),
  'Ražanj s elektromotorom za ravnomjerno pečenje janjetine, odojka i piletine. Dolazi u praktičnoj transportnoj torbi.',
  'Iznajmite ražanj s elektromotorom – idealan za pripremu janjetine, odojka, piletine ili bilo kojeg većeg komada mesa na otvorenoj vatri. Motor osigurava ravnomjerno okretanje za savršeno pečenje sa svih strana, bez potrebe za ručnim okretanjem. Dolazi u praktičnoj transportnoj torbi za lako prenošenje na bilo koju lokaciju. Robustan i stabilan dizajn izdržava težinu većih komada mesa. Savršen za slavlja, proslave, roštilj za veće društvo i tradicionalna druženja.',
  'Najam Ražnja s Motorom | Transportna torba | Rentanje.com',
  'Iznajmite ražanj s elektromotorom u torbi – ravnomjerno pečenje janjetine, odojka i piletine. Za slavlja i velika druženja!',
  '{"ražanj najam","ražanj s motorom rent","električni ražanj iznajmljivanje","najam ražnja za janjetinu","roštilj ražanj najam"}',
  '[{"question": "Što mogu peći na ražnju?", "answer": "Janjetinu, odojka, piletinu, puretinu i bilo koji veći komad mesa. Ražanj je dovoljno robustan za cijele životinje."}, {"question": "Kako radi motor?", "answer": "Elektromotor ravnomjerno okreće meso, osiguravajući jednako pečenje sa svih strana. Trebate pristup strujnoj utičnici."}, {"question": "Dolazi li s transportnom torbom?", "answer": "Da, ražanj dolazi u praktičnoj transportnoj torbi koja olakšava prijenos na željenu lokaciju."}, {"question": "Trebam li ugljen ili drvo?", "answer": "Da, za vatru ispod ražnja koristite ugljen ili drvo. Ražanj se postavlja iznad vatre na odgovarajućoj visini."}, {"question": "Za koliko osoba mogu pripremiti meso?", "answer": "Ovisno o veličini mesa – cijela janjetina ili odojak služi 15-30+ osoba, ovisno o težini."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Peka',
  'peka-tradicionalna-najam',
  (SELECT id FROM categories WHERE slug = 'rostilji-i-kuhanje'),
  'Tradicionalna peka za autentičnu pripremu janjetine, hobotnice i povrća pod žarom. Pravo dalmatinsko iskustvo kuhanja!',
  'Iznajmite tradicionalnu peku za autentičnu pripremu jela pod žarom – onako kako se kuhalo generacijama! Peka je savršena za pripremu janjetine, teletine, hobotnice, krumpira i povrća pod poklopcem s žeravom na vrhu. Sporo kuhanje u zatvorenoj peki daje nevjerojatno sočno i aromatično meso koje se otapa u ustima. Idealna za obiteljska okupljanja, slavlja i sve koji žele pravo dalmatinsko ili mediteransko iskustvo kuhanja.',
  'Najam Peke | Tradicionalno kuhanje pod žarom | Rentanje.com',
  'Iznajmite tradicionalnu peku za janjetinu, hoboticu i povrće pod žarom. Autentično dalmatinsko iskustvo kuhanja!',
  '{"peka najam","tradicionalna peka rent","kuhanje pod pekom","najam peke za janjetinu","peka za roštilj najam"}',
  '[{"question": "Što mogu pripremiti pod pekom?", "answer": "Janjetinu, teletinu, hoboticu, piletinu, krumpir s povrćem, pa čak i kruh. Pod pekom sve postaje sočno i aromatično."}, {"question": "Kako funkcionira peka?", "answer": "Hranu stavite u posudu, poklopite pekom (zvono) i pokrijete žeravom. Toplina od žeravice ravnomjerno kuha hranu od svih strana."}, {"question": "Trebam li posebno vatrište?", "answer": "Idealno je imati ognjište ili prostrani roštilj. Možete koristiti i otvorenu vatru s ugljenom. Bitno je imati dovoljno žeravice."}, {"question": "Koliko dugo traje kuhanje?", "answer": "Ovisno o jelu: janjetina i teletina 2-3 sata, hobotnica 1-2 sata, krumpir s povrćem oko 1,5 sat. Sporo kuhanje je ključ savršenog okusa."}, {"question": "Za koliko osoba?", "answer": "Ovisno o veličini peke, obično priprema za 4-8 osoba. Kontaktirajte nas za informacije o veličini dostupne peke."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Plamenik za hranu',
  'plamenik-torch-za-hranu-najam',
  (SELECT id FROM categories WHERE slug = 'rostilji-i-kuhanje'),
  'Kulinarsko plamenik za karamelizaciju crème brûlée, glasiranje mesa i profesionalne završne obrade jela.',
  'Iznajmite kulinarsko plamenik (torch) za profesionalne kulinarske završne obrade – savršen za karameliziranje crème brûlée, glasiranje mesa, topljenje sira, opékanje povrća i dodavanje dimljenog okusa jelima. Precizan plamen omogućuje kontroliranu primjenu topline točno tamo gdje vam treba, bez pregrijavanja cijelog jela. Jednostavan za korištenje, siguran i efikasan. Idealan za kulinarske radionice, dinner partye i sve koji žele podići svoja jela na višu razinu.',
  'Najam Kulinarskog Plamenika / Torch | Rentanje.com',
  'Iznajmite kulinarsko plamenik – za crème brûlée, glasiranje mesa i karamelizaciju. Profesionalni rezultati kod kuće!',
  '{"plamenik za hranu najam","kulinarsko torch rent","crème brûlée plamenik najam","kuhinjski plamenik iznajmljivanje"}',
  '[{"question": "Za što mogu koristiti kulinarsko plamenik?", "answer": "Karamelizacija šećera na crème brûlée, glasiranje mesa, topljenje sira na burgerima, opékanje povrća, priprema smore''s i dodavanje dimljenog okusa jelima."}, {"question": "Je li siguran za korištenje?", "answer": "Da, dizajniran je za kulinarsku upotrebu s preciznom kontrolom plamena i sigurnosnim mehanizmima. Ipak, koristite s oprezom i podalje od zapaljivih materijala."}, {"question": "Koji plin koristi?", "answer": "Koristi standardne butanske punive. Kontaktirajte nas za detalje o tome što je uključeno u najam."}, {"question": "Mogu li ga koristiti za searing steaka?", "answer": "Da! Torch daje intenzivnu površinsku toplinu idealan za searing sous-vide steakova – savršena korica bez prekuhanog mesa iznutra."}, {"question": "Je li težak za korištenje?", "answer": "Ne, jako je jednostavan – upalite, usmjerite plamen i kontrolirajte udaljenost. Rezultati su profesionalni, a tehnika se nauči u par minuta."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Kotao od lijevanog željeza, 10 L, sa stalkom',
  'kotao-lijevani-zeljezo-10l-stalak-najam',
  (SELECT id FROM categories WHERE slug = 'rostilji-i-kuhanje'),
  'Kotao od lijevanog željeza (10L) sa stalkom i poklopcem za gulaš, čobanac i fiš na otvorenoj vatri. Za 10-15 osoba.',
  'Iznajmite kotao od lijevanog željeza zapremnine 10 litara s poklopcem i stalkom – savršen za pripremu gulaša, čobanca, fiša, graha i drugih tradicionalnih jela na otvorenoj vatri. Lijevano željezo ravnomjerno raspodjeljuje toplinu i zadržava je dugo, što daje duboke, bogate okuse koji se ne mogu postići na štednjaku. Stalak omogućuje vješanje kotla nad vatrom na idealnoj visini. Idealan za veća druženja na otvorenom, slavlja i tradicionalne kuharske prilike.',
  'Najam Kotla 10L od Lijevanog Željeza | Rentanje.com',
  'Iznajmite kotao 10L od lijevanog željeza sa stalkom – za gulaš, čobanac i fiš na otvorenoj vatri. Tradicionalno kuhanje!',
  '{"kotao najam","lijevano željezo kotao rent","gulaš kotao najam","kuhanje na vatri najam","10L kotao iznajmljivanje"}',
  '[{"question": "Koliki je kotao?", "answer": "Zapremnina je 10 litara – dovoljno za pripremu gulaša, čobanca ili fiša za 10-15 osoba."}, {"question": "Dolazi li sa stalkom?", "answer": "Da, u kompletu je stalak koji omogućuje vješanje kotla nad otvorenom vatrom na odgovarajućoj visini, plus poklopac."}, {"question": "Što mogu kuhati u kotlu?", "answer": "Gulaš, čobanac, fiš paprikaš, grah, varivo – sva tradicionalna jela koja se kuhaju na otvorenoj vatri."}, {"question": "Zašto je lijevano željezo bolje?", "answer": "Ravnomjerno raspodjeljuje toplinu, dugo zadržava temperaturu i daje duboke, bogate okuse koje moderno posuđe ne može replicirati."}, {"question": "Trebam li vatru ili ugljen?", "answer": "Da, kotao se koristi na otvorenoj vatri (drvo) ili na ugljenu. Stalak se postavlja iznad vatrišta."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Kotlovina – 73,5cm',
  'kotlovina-73cm-najam',
  (SELECT id FROM categories WHERE slug = 'rostilji-i-kuhanje'),
  'Velika čelična posuda promjera 73,5cm za pripremu kotlovine, pljeskavica i roštiljanje za 20+ osoba.',
  'Iznajmite kotlovinu promjera 73,5 cm – veliku čeličnu posudu za pripremu kotlovine, pljeskavica, ćevapa i roštiljanje za veće društvo. Prostrana površina omogućuje pripremu hrane za 20+ osoba istovremeno. Idealna za slavlja, roštilj za veća društva, festivale i sva okupljanja gdje treba nahraniti veću grupu ljudi. Robusna čelična konstrukcija za dugotrajno korištenje na otvorenoj vatri ili ugljenu.',
  'Najam Kotlovine 73,5cm | Roštilj za društvo | Rentanje.com',
  'Iznajmite kotlovinu 73,5cm – za roštilj, pljeskavice i kotlovinu za 20+ osoba! Idealna za slavlja i velika druženja.',
  '{"kotlovina najam","velika kotlovina rent","roštilj za društvo najam","kotlovina 73cm iznajmljivanje","najam za slavlje"}',
  '[{"question": "Koliki je promjer kotlovine?", "answer": "73,5 cm promjera – dovoljno prostrana za pripremu hrane za 20+ osoba istovremeno."}, {"question": "Što mogu pripremiti?", "answer": "Klasičnu kotlovinu (gulaš/čobanac na kotlovini), pljeskavice, ćevape, kobasice i sve vrste roštiljanog mesa i povrća."}, {"question": "Trebam li ugljen ili drvo?", "answer": "Da, koristite ugljen ili drvo za vatru. Kotlovina se postavlja direktno na vatru ili na stalak."}, {"question": "Za koliko osoba?", "answer": "Lako priprema hranu za 20-30 osoba, ovisno o količini mesa i priloga."}, {"question": "Kako se transportira?", "answer": "Kotlovina je robusna ali prenosiva. Dostava i preuzimanje mogu se dogovoriti prilikom rezervacije."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'IGRA - Spike Ball',
  'spikeball-igra-najam',
  (SELECT id FROM categories WHERE slug = 'igre-i-zabava'),
  'Dinamična outdoor igra za 4 igrača koja kombinira odbojku i foursquare. Za plažu, park i team building!',
  'Iznajmite Spikeball – jednu od najuzbudljivijih outdoor sportskih igara! Dva tima po dva igrača udaraju loptu o malu trampolinsku mrežu, pokušavajući pogoditi tako da protivnički tim ne može vratiti. Kombinira elemente odbojke i foursquarea s brzom, dinamičnom akcijom na 360°. Igra se bilo gdje – na plaži, u parku, na travi ili pijesku. Pravila su jednostavna, ali ovladavanje zahtijeva vještinu i timski rad. Idealna za sportski nastrojene grupe, team building i ljetne zabave.',
  'Najam Spikeball Seta | Outdoor igra | Rentanje.com',
  'Iznajmite Spikeball set – dinamična igra za 4 igrača! Za plažu, park i team building. Brza, zabavna i kompetitivna!',
  '{"spikeball najam","spike ball rent","outdoor sportska igra najam","plaža igra iznajmljivanje","team building igre najam"}',
  '[{"question": "Kako se igra Spikeball?", "answer": "Dva tima po 2 igrača stoje oko male trampolinske mreže. Igrači udaraju loptu o mrežu, a protivnički tim ima 3 dodira da je vrati. Igra se do 21 boda."}, {"question": "Koliko ljudi treba za igru?", "answer": "Standardno 4 igrača (2 tima po 2). Može se igrati i 1 na 1 za vježbu ili zabavu."}, {"question": "Može li se igrati na pijesku?", "answer": "Da! Spikeball je fantastičan na plaži, pijesku, travi, betonu – bilo kojoj relativno ravnoj površini."}, {"question": "Je li teško naučiti?", "answer": "Osnovna pravila nauče se u 5 minuta. Savladavanje naprednih tehnika zahtijeva praksu, ali zabava počinje od prvog udarca!"}, {"question": "Što dolazi u setu?", "answer": "Set uključuje trampolinsku mrežu s nogama, loptice i torbu za nošenje – sve spremno za igru."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Ledomat',
  'ledomat-aparat-za-led-najam',
  (SELECT id FROM categories WHERE slug = 'pice-i-oprema'),
  'Kompaktni aparat koji proizvodi do 12kg leda dnevno. Nikad više bez leda na zabavi – za koktele i osvježenje!',
  'Iznajmite ledomat i nikad više nemojte ostati bez leda na zabavi! Ovaj kompaktni aparat proizvodi do 12 kg leda dnevno i ima spremnik za vodu od 1,3 litre. Jednostavno napunite vodom, uključite i za kratko vrijeme imate svježe kockice leda. Idealan za kućne zabave, roštilj, koktail večeri, poslovne evente i sve prilike gdje vam treba obilna količina leda. Kompaktan dizajn stane na svaki stol ili pult.',
  'Najam Ledomata | Aparat za led | Rentanje.com',
  'Iznajmite ledomat – do 12kg leda dnevno, kompaktan i jednostavan! Za zabave, koktele i evente. Nikad bez leda!',
  '{"ledomat najam","aparat za led rent","ice maker najam","kockice leda iznajmljivanje","party oprema najam"}',
  '[{"question": "Koliko leda proizvodi?", "answer": "Do 12 kg leda u 24 sata – dovoljno za veliku zabavu. Prva serija kockica gotova je za 10-15 minuta."}, {"question": "Trebam li priključak na vodu?", "answer": "Ne, ledomat ima spremnik za vodu od 1,3 litre koji ručno punite. Nema potrebe za priključkom na vodovod."}, {"question": "Kakav oblik leda proizvodi?", "answer": "Proizvodi standardne kockice leda pogodne za sve vrste pića – koktele, sokove, vodu i ostala osvježavajuća pića."}, {"question": "Trebam li struju?", "answer": "Da, ledomat se priključuje na standardnu strujnu utičnicu (220V)."}, {"question": "Koliko je velik?", "answer": "Kompaktan dizajn stane na kuhinjski pult ili stol. Idealan za korištenje u zatvorenom prostoru, ali može se koristiti i na otvorenom uz pristup struji."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'JBL Charge 3 prijenosni zvučnik',
  'jbl-charge-3-bluetooth-zvucnik-najam',
  (SELECT id FROM categories WHERE slug = 'zvucnici'),
  'Kompaktni Bluetooth zvučnik s 20h baterijom, IPX7 vodootpornošću i powerbank funkcijom. Za manja druženja i izlete.',
  'Iznajmite JBL Charge 3 – kompaktni prijenosni Bluetooth zvučnik s moćnim zvukom koji nadmašuje svoju veličinu. Baterija traje do 20 sati, a IPX7 vodootpornost znači da ga možete nositi na plažu, bazen ili pod kišu bez brige. Ugrađena powerbank funkcija omogućuje punjenje mobitela u pokretu. JBL Connect+ omogućuje povezivanje više zvučnika za veći zvuk. Savršen za manja druženja, piknik, kampiranje ili kao dodatni zvučnik uz veći setup.',
  'Najam JBL Charge 3 | Bluetooth zvučnik | Rentanje.com',
  'Iznajmite JBL Charge 3 – 20h baterija, IPX7 vodootporan, powerbank. Kompaktan zvučnik za plažu, piknik i party!',
  '{"JBL Charge 3 najam","bluetooth zvučnik rent","prijenosni zvučnik najam","mali zvučnik iznajmljivanje","JBL rent"}',
  '[{"question": "Koliko traje baterija JBL Charge 3?", "answer": "Do 20 sati reprodukcije na jednom punjenju – dovoljno za cjelodnevni izlet ili večernju zabavu."}, {"question": "Je li vodootporan?", "answer": "Da, ima IPX7 certifikat – može se potpuno uroniti u vodu do 1 metra na 30 minuta bez oštećenja."}, {"question": "Koliko je glasan?", "answer": "JBL Charge 3 isporučuje 20W snage – dovoljno za manja druženja do 15-20 osoba na otvorenom ili manju sobu."}, {"question": "Može li puniti mobitel?", "answer": "Da, ima ugrađenu powerbank funkciju – možete puniti smartphone preko USB porta dok slušate glazbu."}, {"question": "Mogu li spojiti više zvučnika?", "answer": "Da, JBL Connect+ tehnologija omogućuje povezivanje više kompatibilnih JBL zvučnika za veći zvuk."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'DJI Mavic Mini 2 Fly More',
  'dji-mini-2-dron-fly-more-najam',
  (SELECT id FROM categories WHERE slug = 'dronovi'),
  'Ultra-lagan dron od 249g s 4K kamerom, 3-osnim gimbalom i 3 baterije (93 min leta). Za snimanje iz ptičje perspektive.',
  'Iznajmite DJI Mini 2 Fly More Combo – ultra lagan dron od samo 249 grama koji ne zahtijeva registraciju u većini zemalja! Snima 4K video pri 30fps i 12MP fotografije s 3-osnom gimbal stabilizacijom za profesionalno mirne snimke iz zraka. Domet do 10 km i otpornost na vjetar do 38 km/h. Fly More Combo uključuje 3 baterije za ukupno do 93 minute leta, punjač, zaštitu za propelere i torbu za nošenje. Savršen za putovanja, vjenčanja, nekretnine i kreativno snimanje iz ptičje perspektive.',
  'Najam DJI Mini 2 Fly More Drona | 4K video | Rentanje.com',
  'Iznajmite DJI Mini 2 dron – 249g, 4K video, 31 min leta, 3 baterije. Za putovanja, vjenčanja i kreativno snimanje!',
  '{"najam drona","DJI Mini 2 rent","dron za snimanje najam","4K dron iznajmljivanje","DJI dron najam"}',
  '[{"question": "Trebam li dozvolu za letenje?", "answer": "DJI Mini 2 teži samo 249g, što ga u većini zemalja oslobađa od registracije. Ipak, uvijek provjerite lokalne propise prije letenja."}, {"question": "Koliko dugo može letjeti?", "answer": "Jedna baterija pruža do 31 minutu leta. Fly More Combo uključuje 3 baterije za ukupno do 93 minute."}, {"question": "Kakva je kvaliteta snimke?", "answer": "Snima 4K video pri 30fps i 12MP fotografije. 3-osni gimbal osigurava potpuno stabilne snimke bez tresanja, čak i na vjetru."}, {"question": "Koliko daleko može letjeti?", "answer": "Maksimalni domet je do 10 km (u idealnim uvjetima). Otporan je na vjetar do 38 km/h."}, {"question": "Što je uključeno u Fly More Combo?", "answer": "3 baterije, punjač za više baterija, zaštita za propelere, rezervni propeleri i torba za nošenje – sve za duže i bezbrižnije letenje."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'Plinska peč za pizzu OONI 16',
  'ooni-koda-16-plinska-pec-pizza-najam',
  (SELECT id FROM categories WHERE slug = 'rostilji-i-kuhanje'),
  'Profesionalna plinska peć za pizzu koja postiže 500°C – savršena napolitanska pizza gotova za 60 sekundi!',
  'Iznajmite Ooni Koda 16 – profesionalnu plinsku peć za pizzu koja postiže 500°C i peče savršenu napolitansku pizzu u samo 60 sekundi! Velika ploča od 40 cm (16 inča) prima pizze do 40 cm promjera. Plinski pogon omogućuje instant paljenje i preciznu kontrolu temperature – nema čekanja na zagrijavanje ugljena. L-oblik plamenika osigurava ravnomjernu distribuciju topline preko cijele kamene ploče. Osim pizze, peče fokaccu, flatbread, pa čak i steakove. Idealna za pizza party, vrtne zabave i kulinarsko iskustvo na otvorenom.',
  'Najam Ooni Koda 16 Pizza Peći | 500°C | Rentanje.com',
  'Iznajmite Ooni Koda 16 plinsku peć za pizzu – 500°C, pizza gotova za 60 sekundi! Za pizza party i vrtne zabave.',
  '{"Ooni najam","pizza peć najam","plinska peć za pizzu rent","Ooni Koda 16 iznajmljivanje","pizza party najam"}',
  '[{"question": "Koliko brzo peče pizzu?", "answer": "Pizza je gotova za samo 60 sekundi na temperaturi od 500°C! Peć se zagrije na radnu temperaturu za 20 minuta."}, {"question": "Koliko velika pizza stane?", "answer": "Ooni Koda 16 prima pizze do 40 cm (16 inča) promjera – pravu veliku pizzu za cijelu obitelj."}, {"question": "Koji plin koristi?", "answer": "Koristi propan/butan plin. Kontaktirajte nas za informacije o uključenoj opremi."}, {"question": "Mogu li peći nešto osim pizze?", "answer": "Da! Fokaccu, flatbread, calzone, steakove, ribu i povrće – sve što zahtijeva intenzivnu toplinu."}, {"question": "Je li teško napraviti dobru pizzu?", "answer": "S Ooni peći, najtjeglasvniji dio je priprema tijesta. Peć sama obavlja savršen posao. Uz malo prakse, rezultati su kao iz prave napolitanske pizzerije!"}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'GoPro Hero 10',
  'gopro-hero-10-black-najam',
  (SELECT id FROM categories WHERE slug = 'kamere-i-oprema'),
  'Pouzdana akcijska kamera s 5.3K/60fps videom, HyperSmooth 4.0 stabilizacijom i vodootpornošću do 10m.',
  'Iznajmite GoPro Hero 10 Black – pouzdanu akcijsku kameru koja i dalje impresionira s 5.3K video snimanjem pri 60fps i 23MP fotografijama. GP2 procesor donosi bolju stabilizaciju (HyperSmooth 4.0), brži prijenos podataka i unaprijeđenu kvalitetu slike pri slabom svjetlu. Vodootporna do 10 metara, s prednjim i stražnjim ekranom za lakše kadriranje. Savršena za avanture, sport, putovanja i dokumentiranje bilo kojeg dinamičnog trenutka.',
  'Najam GoPro Hero 10 Black | 5.3K kamera | Rentanje.com',
  'Iznajmite GoPro Hero 10 – 5.3K video, HyperSmooth 4.0, vodootporna do 10m. Pouzdana akcijska kamera za svaku avanturu!',
  '{"GoPro Hero 10 najam","akcijska kamera rent","GoPro iznajmljivanje","5.3K kamera najam","GoPro 10 rent"}',
  '[{"question": "Koja je razlika između GoPro 10 i 13?", "answer": "Hero 10 snima 5.3K/60fps kao i 13, ali Hero 13 ima bolju bateriju (1900mAh vs 1720mAh), HyperSmooth 6.0 vs 4.0, zamjenjive leće, Burst Slo-Mo i Wi-Fi 6."}, {"question": "Je li vodootporna?", "answer": "Da, vodootporna do 10 metara bez dodatnog kućišta."}, {"question": "Koliko traje baterija?", "answer": "Baterija od 1720mAh pruža oko 1-1,5 sata snimanja na visokim rezolucijama. Preporučujemo najam dodatne baterije za duže snimanje."}, {"question": "Ima li prednji ekran?", "answer": "Da, ima prednji ekran za selfie kadriranje i stražnji touchscreen za pregled snimki i navigaciju izbornicima."}, {"question": "S kojim dodacima je kompatibilna?", "answer": "Kompatibilna sa svim GoPro montažnim dodacima – kacige, prsa, ruke, selfie štapovi, vodeni dodaci i mnogi drugi."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'IGRA - Kubb Viking Game',
  'kubb-viking-igra-najam',
  (SELECT id FROM categories WHERE slug = 'igre-i-zabava'),
  'Tradicionalna skandinavska drvena igra za 2-12 igrača. Strategija, preciznost i zabava – za parkove i dvorišta.',
  'Iznajmite Kubb – tradicionalnu skandinavsku drvenu igru poznatu i kao ''Viking šah''! Cilj je oboriti protivničke drvene blokove (kubbove) bacanjem drvenih štapova, a zatim srušiti kralja u centru. Igra kombinira strategiju, preciznost i zabavu za 2-12 igrača. Savršena za parkove, plaže, dvorišta i sve outdoor evente. Kubb se igra već stotinama godina u Skandinaviji, a danas je popularna igra za obitelji, prijatelje i team building.',
  'Najam Kubb Viking Igre | Outdoor zabava | Rentanje.com',
  'Iznajmite Kubb – skandinavsku Viking igru za 2-12 igrača! Za parkove, plaže i team building. Strategija i zabava!',
  '{"kubb najam","viking igra rent","outdoor igre najam","drvena igra iznajmljivanje","Kubb game najam"}',
  '[{"question": "Kako se igra Kubb?", "answer": "Dva tima naizmjenično bacaju drvene štapove prema protivničkim kubbovima (blokovima). Kad srušite sve protivničke kubbove, ciljate kralja u centru. Tko sruši kralja – pobjeđuje!"}, {"question": "Za koliko igrača je Kubb?", "answer": "Standardno za 2-12 igrača, podijeljenih u 2 tima. Fleksibilna pravila omogućuju prilagodbu broja igrača po timu."}, {"question": "Koliko prostora treba?", "answer": "Standardno igralište je 5×8 metara, ali može se prilagoditi manjim ili većim prostorima."}, {"question": "Je li pogodna za sva dobra?", "answer": "Da! Kubb je igra za sve uzraste – od djece do seniora. Ne zahtijeva posebnu fizičku spremu, a strategija dodaje dubinu igri."}, {"question": "Na kojim površinama se može igrati?", "answer": "Trava, pijesak, snijeg – bilo koja relativno ravna površina. Igra najbolje funkcionira na travi u parku ili dvorištu."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'IGRA - Ladder Golf',
  'ladder-golf-igra-najam',
  (SELECT id FROM categories WHERE slug = 'igre-i-zabava'),
  'Outdoor igra bacanja bola prema ljestvici s tri prečke. Jednostavna, zabavna i natjecateljska – za sve uzraste!',
  'Iznajmite Ladder Golf – popularnu outdoor igru bacanja bola! Igrači bacaju bola (dva loptica povezana užetom) prema ljestvici s tri prečke na različitim visinama – svaka prečka nosi drugačiji broj bodova. Gornja prečka = 3 boda, srednja = 2 boda, donja = 1 bod. Igra za 2-4 igrača ili timove, igra se do 21 boda. Jednostavna za naučiti, ali zahtijeva preciznost i vještinu. Idealna za vrtove, parkove, plaže i sve outdoor zabave.',
  'Najam Ladder Golf Igre | Outdoor zabava | Rentanje.com',
  'Iznajmite Ladder Golf – igru bacanja bola za vrtove, plaže i evente! Za 2-4 igrača, jednostavna i zabavna.',
  '{"ladder golf najam","ljestvica golf rent","outdoor igre najam","bola igra iznajmljivanje","party igre najam"}',
  '[{"question": "Kako se igra Ladder Golf?", "answer": "Bacajte bola (dva loptica na užetu) prema ljestvici s tri prečke. Gornja prečka = 3 boda, srednja = 2, donja = 1. Igra se do 21 boda."}, {"question": "Koliko igrača treba?", "answer": "2-4 igrača ili dva tima. Može se igrati i turnirski s više timova."}, {"question": "Koliko prostora treba?", "answer": "Oko 5-7 metara u dužinu – ljestvice se postave na odgovarajućoj udaljenosti, a igrači bacaju s jedne strane."}, {"question": "Je li pogodna za djecu?", "answer": "Da, Ladder Golf je zabavna i sigurna igra za sve uzraste. Djeca brzo nauče bacati bola i uživaju u natjecanju."}, {"question": "Na kakvoj površini se igra?", "answer": "Trava, pijesak, beton – bilo koja relativno ravna površina. Idealna za vrtove, parkove i plaže."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;

INSERT INTO products (name, slug, category_id, short_desc, description, seo_title, seo_description, seo_keywords, faq, min_rental_days, price_per_day, price_per_3days, price_per_7days, stock_qty, is_active, is_available, is_featured, sort_order)
VALUES (
  'DJI Power 1000 Mini',
  'dji-power-1000-mini-stanica-napajanje-najam',
  (SELECT id FROM categories WHERE slug = 'napajanje-i-oprema'),
  'Prijenosna stanica za napajanje s 1024Wh kapacitetom i 2200W izlazom. Struja bilo gdje – za evente, kampiranje i snimanja.',
  'Iznajmite DJI Power 1000 Mini – kompaktnu prijenosnu stanicu za napajanje koja osigurava struju bilo gdje! S kapacitetom baterije od 1024Wh i izlaznom snagom do 2200W, napaja laptope, kamere, dronove, projektore, zvučnike, ledomate i ostale uređaje na lokacijama bez pristupa strujnoj mreži. Višestruki izlazi uključuju AC utičnice, USB-C, USB-A i DC izlaze. Brzo punjenje od 0 do 80% za oko 50 minuta. Idealna za outdoor evente, kampiranje, snimanja na lokaciji i kao backup napajanje.',
  'Najam DJI Power 1000 Mini | Prijenosno napajanje | Rentanje.com',
  'Iznajmite DJI Power 1000 Mini – 1024Wh, 2200W, AC/USB/DC izlazi. Struja bilo gdje za evente, kampiranje i snimanje!',
  '{"prijenosno napajanje najam","powerstation rent","DJI Power 1000 najam","outdoor struja iznajmljivanje","backup baterija najam"}',
  '[{"question": "Koje uređaje mogu napajati?", "answer": "Laptope, projektore, zvučnike, kamere, dronove, ledomate, telefone, rasvjetu – gotovo sve uređaje do 2200W."}, {"question": "Koliko dugo traje baterija?", "answer": "S kapacitetom od 1024Wh, može napajati laptop 10-15 sati, projektor 3-4 sata, ili puniti smartphone 50+ puta, ovisno o potrošnji uređaja."}, {"question": "Koliko brzo se puni?", "answer": "Od 0 do 80% za samo 50 minuta brzim punjenjem – idealno za brzu pripremu prije eventa."}, {"question": "Koje priključke ima?", "answer": "AC utičnice (220V), USB-C s Power Delivery, USB-A priključke i DC izlaze – pokriva sve tipove uređaja."}, {"question": "Koliko je teška?", "answer": "Kompaktna i prijenosna, dizajnirana za lako prenošenje na lokaciju. Idealna za outdoor korištenje gdje nema pristupa strujnoj mreži."}]'::jsonb,
  1, NULL, NULL, 0, 1, true, true, false, 0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  faq = EXCLUDED.faq;
