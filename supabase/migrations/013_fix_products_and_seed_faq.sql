-- ============================================================
-- 013_fix_products_and_seed_faq.sql
--
-- (1) Corrects two products from migration 012 whose names were wrong
--     in the source SQL pasted by the user (verified against vendor links
--     in rentanje_novi_proizvodi.csv):
--       - "DJI Avata 2"        →  "DJI Avata 360"  (different model: 360° camera)
--       - "Ninja Creami"        →  "Ninja Swirli"  (NC701EU, soft-serve hybrid)
-- (2) SpyraThree red+blue: stock_qty 1 → 2 (CSV: "2 crvene i 2 plave puške").
-- (3) Seeds FAQ for all 30 new products.
--
-- All statements are idempotent. UPDATE WHERE slug='old' is a no-op on re-run.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Rename DJI Avata 2 → DJI Avata 360 Motion Fly More Combo
-- ────────────────────────────────────────────────────────────
UPDATE products SET
  slug = 'dji-avata-360-motion-fly-more-combo-najam',
  name = 'DJI Avata 360 Motion Fly More Combo',
  short_desc = 'FPV dron s 360° kamerom — snimi cijelo okruženje odjednom i reframe-aj u postu. Goggles 3 + RC Motion 3 + 3 baterije.',
  description = E'DJI Avata 360 Motion Fly More Combo — FPV dron s revolucionarnom 360° kamerom!\n\n**Što dobivate:**\n- DJI Avata 360 dron + Goggles 3 (Micro-OLED) + RC Motion 3\n- 3 baterije za ~69 minuta ukupnog leta\n- 360° kamera koja snima cijelo okruženje odjednom\n- Reframing u postu: birate kut snimke nakon leta\n- Ugrađeni zaštitnici propelera za sigurnost\n\nIdealno za kreativne snimke gdje ne znate unaprijed što vam treba u kadru — sve snimite, kasnije birate.',
  seo_title = 'Najam DJI Avata 360 Motion Fly More | 360° FPV dron | rentanje.com',
  seo_description = 'Iznajmite DJI Avata 360 — FPV dron s 360° kamerom, Goggles 3, 3 baterije. Reframe snimke nakon leta!',
  seo_keywords = ARRAY['DJI Avata 360 najam', '360 dron rent', 'FPV dron iznajmljivanje', 'dron 360 kamera najam zagreb'],
  schema_json = jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'DJI Avata 360 Motion Fly More Combo',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'DJI')
  )
WHERE slug = 'dji-avata-2-fly-more-combo-fpv-dron-najam';

-- ────────────────────────────────────────────────────────────
-- 2. Rename Ninja Creami → Ninja Swirli
-- ────────────────────────────────────────────────────────────
UPDATE products SET
  slug = 'ninja-swirli-aparat-sladoled-najam',
  name = 'Ninja Swirli – Aparat za soft-serve sladoled',
  short_desc = 'Ninja Swirli (NC701EU) — hibridni aparat za soft-serve sladoled, sorbet i frozen yogurt iz zamrznute baze. Kremasta tekstura za par minuta!',
  description = E'Ninja Swirli (NC701EU) — hibridni aparat za sladoled koji radi i klasičan i soft-serve!\n\n**Kako radi:**\n1. Pripremite bazu (mlijeko, voće, jogurt…)\n2. Zamrznite 24 sata u priloženoj posudi\n3. Ubacite u Swirli — kremast sladoled ili soft-serve za par minuta\n\nPotpuna kontrola nad sastojcima i šećerom. Idealno za ljetne zabave, rođendane i zdrave slastice.',
  seo_title = 'Najam Ninja Swirli aparata za sladoled | NC701EU | rentanje.com',
  seo_description = 'Iznajmite Ninja Swirli NC701EU — soft-serve sladoled, sorbet, frozen yogurt iz zamrznute baze. Za zabave i rođendane.',
  seo_keywords = ARRAY['aparat za sladoled najam', 'Ninja Swirli rent', 'soft serve aparat iznajmljivanje', 'NC701EU najam'],
  schema_json = jsonb_build_object(
    '@context', 'https://schema.org', '@type', 'Product',
    'name', 'Ninja Swirli – Aparat za soft-serve sladoled',
    'brand', jsonb_build_object('@type', 'Brand', 'name', 'Ninja')
  )
WHERE slug = 'ninja-creami-aparat-sladoled-najam';

-- ────────────────────────────────────────────────────────────
-- 3. SpyraThree red + blue: stock_qty 1 → 2 (vlasnik ima 2 svake boje)
-- ────────────────────────────────────────────────────────────
UPDATE products SET stock_qty = 2
WHERE slug IN (
  'spyrathree-vodeni-pistolj-crveni-najam',
  'spyrathree-vodeni-pistolj-plavi-najam'
);

-- ────────────────────────────────────────────────────────────
-- 4. FAQ — Fujifilm Instax Mini EVO
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Što dobivam u najmu?","answer":"Kameru Fujifilm Instax Mini EVO, USB-C kabel za punjenje i kratke upute. Film se kupuje zasebno."},
  {"question":"Koji film treba?","answer":"Standardni Fujifilm Instax Mini film (paket od 10 ili 20 listova). Nije uključen u cijenu najma."},
  {"question":"Mogu li ispisati fotografije s mobitela?","answer":"Da. Kamera se Bluetooth-om povezuje s besplatnom Fujifilm aplikacijom — odaberete fotku s mobitela i ispišete na Mini film."},
  {"question":"Trebam li platiti polog?","answer":"Da. Polog se vraća u cijelosti nakon povrata uređaja u ispravnom stanju."},
  {"question":"Je li prikladno za vjenčanja?","answer":"Idealno — gosti tijekom večeri rade vlastite portrete koji im odmah ostaju kao uspomena."}
]'::jsonb
WHERE slug = 'fujifilm-instax-mini-evo-najam';

-- ────────────────────────────────────────────────────────────
-- 5. FAQ — DJI Neo Motion Fly More Combo
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Što je uključeno u najam?","answer":"DJI Neo dron, DJI Goggles N3 naočale, RC Motion 3 kontroler i 3 baterije za ukupno ~54 minute leta."},
  {"question":"Trebam li dozvolu za letenje?","answer":"DJI Neo (135 g) spada u kategoriju C0 prema EU regulativi. Registracija drona nije obavezna, ali se preporučuje registracija pilota na portalu HACZ-a prije prvog leta."},
  {"question":"Koliko traje let?","answer":"Oko 18 minuta po bateriji. Combo paket sa 3 baterije daje ~54 minuta ukupnog vremena u zraku."},
  {"question":"Mogu li letjeti bez kontrolera?","answer":"Da. DJI Neo podržava palm takeoff (polazak iz dlana), QuickShot modove i osnovno glasovno upravljanje preko Fly aplikacije."},
  {"question":"Polog?","answer":"Da. Polog je refundabilan ako je sva oprema vraćena u ispravnom stanju."}
]'::jsonb
WHERE slug = 'dji-neo-motion-fly-more-combo-najam';

-- ────────────────────────────────────────────────────────────
-- 6. FAQ — DJI Avata 360 (renamed)
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Što je uključeno?","answer":"DJI Avata 360 dron, DJI Goggles 3 (Micro-OLED), RC Motion 3 kontroler i 3 baterije."},
  {"question":"Što je posebno kod Avata 360?","answer":"360° kamera snima cijelo okruženje odjednom — kut snimke birate nakon leta u editoru. Drukčije od običnog Avata 2 koji snima samo unaprijed."},
  {"question":"Koliko traje let?","answer":"Otprilike 23 minute po bateriji, ukupno ~69 minuta s tri baterije iz Combo paketa."},
  {"question":"Trebam li iskustvo letenja?","answer":"Goggles 3 + RC Motion 3 jako olakšavaju upravljanje, ali se preporučuje barem osnovno iskustvo s FPV ili motion-controlled dronom prije zahtjevnijih snimaka."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku opreme u ispravnom stanju."}
]'::jsonb
WHERE slug = 'dji-avata-360-motion-fly-more-combo-najam';

-- ────────────────────────────────────────────────────────────
-- 7. FAQ — Šator za 3 osobe
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Koliko dugo traje postavljanje?","answer":"10–15 minuta za jednu osobu. Ne zahtijeva prethodno iskustvo."},
  {"question":"Je li vodootporan?","answer":"Da. Šator ima HH ~2000 mm vodeni stup, podnosi tipičnu kišu."},
  {"question":"Koliko ljudi stane?","answer":"3 odrasle osobe na karimat-podlogama. Za 2 osobe + opremu, vrlo udobno."},
  {"question":"Jesu li vreće za spavanje uključene?","answer":"Ne, ali se mogu posuditi posebno — javite nam u upitu."},
  {"question":"Polog?","answer":"Da. Vraća se u cijelosti ako je šator vraćen čist i suh."}
]'::jsonb
WHERE slug = 'sator-za-3-osobe-camping-najam';

-- ────────────────────────────────────────────────────────────
-- 8. FAQ — SUP
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Što je uključeno?","answer":"SUP daska na napuhavanje (Mistral Adventure 11.5), podesivo veslo, ručna pumpa, sigurnosni leash, fin i transportni ruksak."},
  {"question":"Trebam li iskustvo?","answer":"Ne. Daska je široka i stabilna, prikladna za potpune početnike i iskusne veslače."},
  {"question":"Gdje smijem koristiti?","answer":"Mirne vode: jezera (Jarun, Bundek), more uz obalu, mirne rijeke. Provjerite lokalna pravila prije izlaska na vodu."},
  {"question":"Koliko se napuha?","answer":"5–7 minuta s priloženom ručnom pumpom do preporučenog tlaka 15 PSI."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku opreme u ispravnom stanju."}
]'::jsonb
WHERE slug = 'sup-stand-up-paddle-najam';

-- ────────────────────────────────────────────────────────────
-- 9. FAQ — Camping paket (4 osobe)
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Što je sve u paketu?","answer":"Šator za 4 osobe (Decathlon Arpenaz 4.2 Fresh&Black), 2 zračna madraca i električna pumpa."},
  {"question":"Treba li 220V za pumpu?","answer":"Pumpa radi na 12V (priključak za auto utičnicu). Ako vam treba 220V verzija, javite u upitu."},
  {"question":"Koliko traje postavljanje?","answer":"Šator ~15 minuta. Svaki madrac se napuše u ~3 minute električnom pumpom."},
  {"question":"Polog?","answer":"Da, vraća se po povratku opreme u ispravnom stanju."},
  {"question":"Za što je idealan?","answer":"Vikend kampiranja, festivali, obiteljska putovanja — sve što vam treba u jednom najmu."}
]'::jsonb
WHERE slug = 'camping-paket-sator-4-osobe-madraci-pumpa-najam';

-- ────────────────────────────────────────────────────────────
-- 10. FAQ — SpyraThree crveni
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Koliki je domet?","answer":"Do 15 metara s koncentriranim vodenim mecima — dosta za bilo koju dvorišnu ili plažnu vodenu bitku."},
  {"question":"Koliko metaka po punjenju vodom?","answer":"30 metaka po punjenju, 22 ml vode po metku. Automatsko punjenje iz vode (jezera, kade, kante) u ~0,6 sekunde po metku."},
  {"question":"Kako se puni baterija?","answer":"USB-C punjenje. Jedno punjenje izdrži ~1500 ispucavanja."},
  {"question":"Je li vodootporan?","answer":"Da, IPX7 — pištolj može pasti u vodu bez oštećenja."},
  {"question":"Mogu li ga kombinirati s plavom verzijom?","answer":"Da — idealno za timske bitke (crveni vs plavi). Imamo 2 crvena i 2 plava SpyraThree na zalihi."}
]'::jsonb
WHERE slug = 'spyrathree-vodeni-pistolj-crveni-najam';

-- ────────────────────────────────────────────────────────────
-- 11. FAQ — SpyraThree plavi
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Razlika od crvene verzije?","answer":"Samo boja. Tehnički potpuno identično: 15 m domet, 30 metaka, IPX7, USB-C punjenje, ~1500 ispucavanja."},
  {"question":"Koliko ih imate?","answer":"2 plava i 2 crvena SpyraThree pištolja — dovoljno za 2-na-2 timsku bitku."},
  {"question":"Koliko se puni baterija?","answer":"~2,5 sata punog punjenja USB-C kabelom."},
  {"question":"Smije li u more?","answer":"Da. IPX7 vodootpornost znači da kontakt sa slatkom ili slanom vodom nije problem — preporučujemo isprati i osušiti nakon korištenja u moru."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku u ispravnom stanju."}
]'::jsonb
WHERE slug = 'spyrathree-vodeni-pistolj-plavi-najam';

-- ────────────────────────────────────────────────────────────
-- 12. FAQ — JBL bežični mikrofoni
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Na što se spajaju?","answer":"Plug & play s JBL PartyBox zvučnicima (Encore, 110, 310, 1000…) — utaknete USB stick u zvučnik i mikrofoni rade."},
  {"question":"Mogu li ih spojiti na ne-JBL zvučnik?","answer":"Standardno rade samo s PartyBox serijom. Za drugi zvučnik treba poseban prijemnik (nije u kompletu)."},
  {"question":"Koliki je domet?","answer":"Do ~30 metara u otvorenom prostoru, manje uz prepreke (zidovi, ljudi)."},
  {"question":"Koliko traje baterija?","answer":"Oko 20 sati po punjenju — dovoljno za cijelo vjenčanje ili event."},
  {"question":"Idealno za?","answer":"Karaoke, vjenčanja, prezentacije, govore, livestreamove."}
]'::jsonb
WHERE slug = 'jbl-bezicni-mikrofoni-par-najam';

-- ────────────────────────────────────────────────────────────
-- 13. FAQ — Vertikalni kebab roštilj
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Koliki je kapacitet?","answer":"2–5 kg mesa na ražnju (10–20+ porcija döner kebaba ili gyrosa)."},
  {"question":"Treba li 220V?","answer":"Da, standardna utičnica. Snaga 1800–2000 W."},
  {"question":"Koliko traje pečenje?","answer":"30–45 minuta da meso bude pečeno do kraja na vanjskom sloju (rezete kako se peče)."},
  {"question":"Kako se čisti?","answer":"Dijelovi se rastavljaju i peru u toploj vodi sa sapunicom. Ne preporučujemo perilicu posuđa."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku očišćene opreme."}
]'::jsonb
WHERE slug = 'vertikalni-kebab-rostilj-najam';

-- ────────────────────────────────────────────────────────────
-- 14. FAQ — Fröbel Tower
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Za koliko ljudi je igra?","answer":"2–24 igrača istovremeno — svaki igrač drži po jednu uzicu kojom upravlja kranom."},
  {"question":"Koliko traje partija?","answer":"20–45 minuta, ovisno o broju igrača i razini izazova."},
  {"question":"Koliko mi prostora treba?","answer":"Otprilike 3×3 m čistog poda za udobnu igru."},
  {"question":"Idealno za?","answer":"Team building, korporativni eventi, radionice, škole, obiteljska druženja."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku opreme u ispravnom stanju."}
]'::jsonb
WHERE slug = 'froebel-tower-timska-igra-najam';

-- ────────────────────────────────────────────────────────────
-- 15. FAQ — Veliki Connect 4
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Kolika je veličina?","answer":"60×50×15 cm, drvena izrada (Toyfel Four Wins) — dovoljno velika da bude statement piece na eventu."},
  {"question":"Za koliko igrača?","answer":"2 igrača prema klasičnim pravilima 4 u nizu."},
  {"question":"Indoor ili outdoor?","answer":"Oba. Za outdoor uporabu preporučujemo zaštititi od duge kiše — drvo se može deformirati ako stoji mokro."},
  {"question":"Idealno za?","answer":"Vrtne zabave, vjenčanja, evente s djecom, outdoor barove."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'veliki-connect-4-drvena-igra-najam';

-- ────────────────────────────────────────────────────────────
-- 16. FAQ — Ring Toss
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Kako se igra?","answer":"Bacaš prstenove na kolce različitih bodovnih vrijednosti — najviše bodova nakon ugovorenog broja rundi pobjeđuje."},
  {"question":"Za koliko igrača?","answer":"2–8, igraju se naizmjence ili u dva tima."},
  {"question":"Indoor ili outdoor?","answer":"Oba. Treba samo ravna površina za postaviti baznu ploču."},
  {"question":"Pristaje li za djecu?","answer":"Da, igra je sigurna i jednostavna za dob 5+."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'ring-toss-igra-bacanja-prstenova-najam';

-- ────────────────────────────────────────────────────────────
-- 17. FAQ — Softarchery
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Za koju dob?","answer":"Preporučena dob 6+. Mekane strelice s vakuumskim vrhovima sigurne su za djecu i odrasle."},
  {"question":"Što je uključeno?","answer":"Luk dizajniran za lagano povlačenje, mekane strelice s vakuumskim vrhovima i meta."},
  {"question":"Koliki je domet?","answer":"Praktičan domet 5–10 metara, dovoljno za zanimljivu igru bez rizika."},
  {"question":"Treba li mi outdoor prostor?","answer":"Preporučujemo da. Indoor je također moguće u većoj prostoriji s metom uza zid."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'softarchery-luk-strijela-najam';

-- ────────────────────────────────────────────────────────────
-- 18. FAQ — Fingerdisc
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Kako se igra?","answer":"Slično boćanju — bacaš diskove prema malom centralnom disku (jacku); najbliži disk dobiva bod. Prvi do dogovorenog broja bodova pobjeđuje."},
  {"question":"Za koliko igrača?","answer":"2–8, individualno ili u timovima."},
  {"question":"Na kojoj površini?","answer":"Trava, pijesak, beton, parket — sve odgovara. Diskovi su dizajnirani za sve outdoor podloge."},
  {"question":"Idealno za?","answer":"Plaža, park, vrt, festivali, vikend druženja."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'fingerdisc-bocanje-igra-najam';

-- ────────────────────────────────────────────────────────────
-- 19. FAQ — Badminton set
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Što je u kompletu?","answer":"Mreža (3 m), 2 reketa i 3 plastične loptice u torbi za prijevoz."},
  {"question":"Postavljanje?","answer":"Bez alata, ~5 minuta. Mreža se sklapa na priložene podupirače."},
  {"question":"Indoor ili outdoor?","answer":"Oba. Za outdoor preporučujemo dane bez vjetra zbog laganih loptica."},
  {"question":"Površina?","answer":"Trava, beton, parket. Mreža stoji na svakoj ravnoj površini."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'badminton-set-mreza-najam';

-- ────────────────────────────────────────────────────────────
-- 20. FAQ — Soft Play set + napuhanac
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Za koju dob?","answer":"Preporučena dob 2–10 godina. Svi mekani elementi su bez oštrih rubova."},
  {"question":"Treba li struja?","answer":"Da. Električni ventilator napuhanca radi kontinuirano na 220V dok god je napuhanac u uporabi."},
  {"question":"Koliko djece odjednom?","answer":"Ovisno o modelu napuhanca, tipično 4–8 djece istovremeno na napuhancu, plus djeca na soft play elementima izvan njega."},
  {"question":"Postavljanje?","answer":"~15–20 minuta — napuhanac se napuše ventilatorom, soft play elementi se ručno raspoređuju."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku čistog seta."}
]'::jsonb
WHERE slug = 'soft-play-napuhanac-bouncy-castle-najam';

-- ────────────────────────────────────────────────────────────
-- 21. FAQ — Plinski plamenik za kampiranje
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Koju plinsku bočicu koristi?","answer":"Standardna butane plinska bočica (250 g, screw-on tip) — dostupna na svakoj benzinskoj postaji."},
  {"question":"Dolazi li s plinom?","answer":"Ne, plinska bočica se kupuje zasebno (cijena ~3–5 EUR po komadu)."},
  {"question":"Kolika je snaga?","answer":"Otprilike 2,2 kW — dovoljno za kuhanje obroka za 2–4 osobe ili grijanje vode."},
  {"question":"Sigurnost?","answer":"Koristi isključivo na otvorenom ili u dobro provjetrenom prostoru. Nikad u zatvorenom šatoru."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'plinski-plamenik-kampiranje-najam';

-- ────────────────────────────────────────────────────────────
-- 22. FAQ — Baklja za roštilj (Bernzomatic)
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Koju plinsku bočicu koristi?","answer":"MAP-Pro ili propane bočicu (1 lb / ~400 g, screw-on tip). Nije uključena u najam — kupuje se zasebno."},
  {"question":"Za što se koristi?","answer":"Brzo paljenje ugljena u roštilju (2–5 min umjesto 20–30), karamelizacija (creme brulee), searing mesa, paljenje vatre, otapanje leda."},
  {"question":"Sigurnost?","answer":"Isključivo na otvorenom ili u dobro provjetrenom prostoru. Nikad usmjeriti prema osobi. Držati dalje od djece."},
  {"question":"Koliko traje plin?","answer":"Jedna 1 lb bočica daje ~1,5 sata neprekidnog rada — dovoljno za desetke paljenja roštilja."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'baklja-za-rostilj-plamenik-najam';

-- ────────────────────────────────────────────────────────────
-- 23. FAQ — Aparat za slushie (Ninja Slushi FS301EU)
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Koji je točno model?","answer":"Ninja Slushi FS301EU — službeni aparat za pripremu slushie napitaka i frozen koktela."},
  {"question":"Što mogu pripremiti?","answer":"Slushie, margarite, frozen koktele, smoothie, smrznuti čaj — sve hladne tekućine sa šećerom ili sirupom (alkohol max ~10%)."},
  {"question":"Koliko traje priprema?","answer":"15–60 minuta od početka do gotovog napitka, ovisno o sastojcima i početnoj temperaturi."},
  {"question":"Treba li struja?","answer":"Da, 220V tijekom rada. Dok je u modu chill, troši malo — možeš ga ostaviti uključen tijekom cijelog eventa."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku očišćene opreme."}
]'::jsonb
WHERE slug = 'aparat-za-slushie-margaritu-najam';

-- ────────────────────────────────────────────────────────────
-- 24. FAQ — Ninja Swirli (renamed)
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Koji je točno model?","answer":"Ninja Swirli NC701EU — hibridni aparat za soft-serve sladoled i klasične smrznute slastice."},
  {"question":"Kako radi?","answer":"Pripremiš bazu (mlijeko, voće, jogurt…), zamrzneš 24 sata u priloženoj posudi, pa ubaciš u Swirli — kremast sladoled za par minuta."},
  {"question":"Što mogu pripremiti?","answer":"Sladoled, sorbet, frozen yogurt, gelato, milkshake, soft-serve."},
  {"question":"Koliko porcija po ciklusu?","answer":"Posuda prima ~470 ml baze (oko 4 manje ili 2 veće porcije)."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku očišćene opreme."}
]'::jsonb
WHERE slug = 'ninja-swirli-aparat-sladoled-najam';

-- ────────────────────────────────────────────────────────────
-- 25. FAQ — Prijenosni ratan stol
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Za koliko osoba?","answer":"Do 6 osoba — 3 po klupi, plus prostor na stolu od 180 cm dužine."},
  {"question":"Sklapa li se?","answer":"Da, brzo postavljanje bez alata. Cijeli set se sklapa u kompaktan paket za prijevoz."},
  {"question":"Indoor ili outdoor?","answer":"Oba. Za outdoor preporučujemo zaštitu od duge kiše."},
  {"question":"Koja nosivost?","answer":"Klupe podnose ~150 kg po klupi (do 3 odrasle osobe)."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'prijenosni-ratan-stol-klupe-6-osoba-najam';

-- ────────────────────────────────────────────────────────────
-- 26. FAQ — Philips Pasta Maker
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Što je uključeno?","answer":"Aparat Philips Pasta Maker s 4–8 kalupa za različite oblike tjestenine (špageti, penne, fettuccine, lasagne…)."},
  {"question":"Koje sastojke trebam?","answer":"Brašno, jaja i voda. Sve se kupuje zasebno. Aparat dolazi s mjernom posudom za točne omjere."},
  {"question":"Koliko porcija?","answer":"~600 g svježe tjestenine po ciklusu — dovoljno za 6 osoba kao glavno jelo."},
  {"question":"Koliko traje priprema?","answer":"~10 minuta od ubacivanja sastojaka do gotove svježe tjestenine. Tjestenina se kuha samo 2–3 minute."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku očišćene opreme."}
]'::jsonb
WHERE slug = 'philips-pasta-maker-najam';

-- ────────────────────────────────────────────────────────────
-- 27. FAQ — Kubb
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Za koliko igrača?","answer":"2–12 igrača u dva tima, idealno 3–4 igrača po timu."},
  {"question":"Kako se igra?","answer":"Oborite protivničke kubbove (drvene blokove) bacanjem štapova. Tko prvi sruši kralja u sredini, pobjeđuje."},
  {"question":"Površina?","answer":"Idealno trava ili pijesak. Treba čistih ~5×8 metara."},
  {"question":"Koliko traje partija?","answer":"15–30 minuta. Brzo se nauči, dugo zabavlja."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'kubb-viking-igra-najam';

-- ────────────────────────────────────────────────────────────
-- 28. FAQ — Ladder Golf
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Pravila ukratko?","answer":"Bacaj bola (par povezanih loptica) na ljestvicu. Gornja prečka 3 boda, srednja 2, donja 1. Prvi do točno 21 bod pobjeđuje."},
  {"question":"Za koliko igrača?","answer":"2–4 igrača, individualno ili u timovima."},
  {"question":"Površina?","answer":"Trava, beton, pijesak — sve odgovara."},
  {"question":"Indoor ili outdoor?","answer":"Primarno outdoor, ali se može igrati i u većoj prostoriji s mekanim podom."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'ladder-golf-igra-najam';

-- ────────────────────────────────────────────────────────────
-- 29. FAQ — Spikeball
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Pravila ukratko?","answer":"2 tima po 2 igrača udaraju loptu o trampolinsku mrežu u sredini — slično odbojci, ali se može gađati u svim smjerovima (360°)."},
  {"question":"Što je uključeno?","answer":"Sklopiva mreža, 3 loptice, torba za prijevoz."},
  {"question":"Površina?","answer":"Najbolje na mekanoj podlozi (trava, pijesak) — igrači često padaju za loptu."},
  {"question":"Za koliko igrača?","answer":"4 (2-na-2). Može se igrati i 1-na-1 ili 3-na-3 s prilagođenim pravilima."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'spikeball-igra-najam';

-- ────────────────────────────────────────────────────────────
-- 30. FAQ — Velika Jenga
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Koliko visoko može narasti?","answer":"Do otprilike 150 cm (54 bloka složena u toranj 18 razina × 3 bloka)."},
  {"question":"Za koliko igrača?","answer":"2 ili više, idealno 2–6 igrača u krugu oko tornja."},
  {"question":"Indoor ili outdoor?","answer":"Oba. Za outdoor preporučujemo čvrstu ravnu podlogu — toranj se ne smije njihati."},
  {"question":"Koliko traje partija?","answer":"15–40 minuta dok netko ne sruši toranj."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku svih blokova u ispravnom stanju."}
]'::jsonb
WHERE slug = 'velika-jenga-giant-jenga-igra-najam';

-- ────────────────────────────────────────────────────────────
-- 31. FAQ — Beer Pong stol
-- (Napomena: postoji već starija varijanta `beerpong-stol` iz migracije
--  002. Ovaj novi je zasad is_active=false; deaktiviraj jednog u admin
--  panelu kad odlučiš koji ćeš zadržati.)
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Što je uključeno?","answer":"Sklopivi Beer Pong stol (240 cm), 12 čaša i loptice za bacanje."},
  {"question":"Sklapa li se?","answer":"Da, stol se preklapa u kovčeg za jednostavan prijevoz i pohranu."},
  {"question":"Indoor ili outdoor?","answer":"Oba. Površina je vodootporna pa nema brige od proljevenog pića."},
  {"question":"Za koliko igrača?","answer":"Klasično 4 (2-na-2), ali se može igrati i 1-na-1 ili 3-na-3."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'beer-pong-stol-case-najam';

-- ────────────────────────────────────────────────────────────
-- 32. FAQ — Cornhole
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Pravila ukratko?","answer":"Bacaj vrećice na dasku s rupom: vrećica u rupi 3 boda, na dasci 1 bod, izvan daske 0. Prvi do točno 21 bod pobjeđuje."},
  {"question":"Što je uključeno?","answer":"2 daske i 8 vrećica (4 jedne, 4 druge boje)."},
  {"question":"Površina?","answer":"Trava, beton, pijesak — daske se postavljaju 8 metara jedna od druge."},
  {"question":"Za koliko igrača?","answer":"2–4 (1-na-1 ili 2-na-2)."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku."}
]'::jsonb
WHERE slug = 'cornhole-igra-najam';

-- ────────────────────────────────────────────────────────────
-- 33. FAQ — Peka
-- ────────────────────────────────────────────────────────────
UPDATE products SET faq = '[
  {"question":"Za što služi?","answer":"Tradicionalna dalmatinska peka za pripremu janjetine, hobotnice, povrća i krumpira pod žarom — sporo kuhanje koje daje sočno meso."},
  {"question":"Trebam li otvoreno ognjište?","answer":"Da. Peka radi na žari ili otvorenoj vatri — potrebno vam je vanjsko ognjište ili roštilj na drva/ugljen."},
  {"question":"Koliko traje priprema?","answer":"1,5–3 sata, ovisno o jelu. Janjetina ~2,5 h, hobotnica ~1,5 h, povrće ~1 h."},
  {"question":"Koliki je promjer?","answer":"Ø 39 cm — dovoljno za 4–8 osoba."},
  {"question":"Polog?","answer":"Da, refundabilan po povratku očišćene peke."}
]'::jsonb
WHERE slug = 'peka-tradicionalna-najam';
