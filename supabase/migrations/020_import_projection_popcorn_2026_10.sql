-- ============================================================
-- 020_import_projection_popcorn_2026_10.sql
--
-- Imports 4 new products with full SEO / GEO / AIO copy and re-targets
-- one existing draft:
--   1. Veliko projekcijsko platno na stalku 211 x 160 cm, 100 inča (DMT)
--      SEO angle: konferencije, kongresi, velika događanja
--   2. Epson EB-FH52 profesionalni projektor (Full HD, 4000 lm, 3LCD)
--      SEO angle: poslovni korisnici, seminari, prezentacije
--   3. BenQ TH575i kino projektor (Full HD, 3800 lm, Google TV)
--      SEO angle: kino u dvorištu, dječji rođendani, manji eventi
--   4. Aparat za kokice s kolicima VEVOR (8 oz, retro kino stil)
--      SEO angle: eventi, rođendani, momačke i djevojačke
--   5. UPDATE of the existing draft projekcijsko-platno-tronozac-172x172-najam
--      (SBOX PSMT-96-2, inserted by 019). The owner asked for this product
--      again on 2026-10-12 with a new angle (prijenosno, prezentacije, manji
--      događaji), so instead of a duplicate row its SEO copy is rewritten and
--      cross-linked to the new projectors. Prices (10/20/35) are kept.
--
-- CATEGORIES (owner delegated the choice):
--   * projectors + screens -> audio-video-oprema (video equipment; the 172
--     draft is moved there too so all four projection products sit together)
--   * popcorn machine      -> oprema-za-evente
--   The live "Projektor s platnom" stays in oprema-za-evente (not touched).
--
-- CONVENTIONS (same as 019, verified against the running app):
--   * description is HTML (sanitizeHtml + dangerouslySetInnerHTML), not markdown
--   * dimensions_cm has NO "cm" suffix (ProductPage appends it)
--   * seo_title is brand-free; the layout appends " | rentanje.com"
--   * schema_json feeds the Product JSON-LD brand; faq feeds FAQPage JSON-LD
--   * copy contains no em dash or en dash (owner request 2026-10-12)
--
-- PRICING: the owner enters all prices in /admin/products. The 4 new rows use
--   the same placeholder as Tilta in 019 (price_per_7days = 0, others NULL) and
--   price-free seo_titles, so nothing has to be rewritten once prices are set.
--   Optional: after setting the price, set seo_title = NULL to let the app
--   generate a live price-bearing title, or keep the keyword title below.
--
-- IMAGES: owner uploads hero_image_url + images (+ alt) in admin.
--
-- ALL FOUR NEW ROWS ARE HIDDEN DRAFTS (is_active = false). Publish checklist:
--   1) upload images, 2) set prices, 3) flip is_active = true.
--
-- SPECS TO DOUBLE-CHECK before publishing the popcorn machine: the mall.hr
--   listing (100166779055) blocked automated reads, so the 800 W / 8 oz /
--   ~48 šalica po turi figures come from VEVOR's own listings of the same
--   cart model. Confirm against the unit you own.
--
-- Idempotent: ON CONFLICT (slug) DO UPDATE refreshes SEO copy only; pricing,
-- images and is_active are never overwritten on re-run.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1) Veliko projekcijsko platno na stalku 211 x 160 cm (100 inča), DMT
--    Owns "veliko platno / platno za konferencije / 100 inča". The 172 cm
--    draft owns "prijenosno platno za prezentacije"; the live projektor
--    bundle owns "najam projektora". No keyword overlap by design.
-- ------------------------------------------------------------
INSERT INTO products (
  name, slug, category_id, short_desc, description,
  seo_title, seo_description, seo_keywords, faq, schema_json,
  min_rental_days, price_per_day, price_per_3days, price_per_7days,
  requires_deposit, deposit_amount, deposit_note,
  weight_kg, dimensions_cm,
  stock_qty, is_active, is_available, is_featured, sort_order
) VALUES (
  'Veliko projekcijsko platno na stalku 211 x 160 cm (100 inča)',
  'veliko-projekcijsko-platno-stalak-211x160-100-inca-najam',
  (SELECT id FROM categories WHERE slug = 'audio-video-oprema'),
  'Samostojeće projekcijsko platno dijagonale 100 inča (211 x 160 cm) na stalku za konferencije, seminare i velika događanja. Vidljiva površina 203 x 152 cm, mat bijela površina, gain 1.1, postavljanje bez alata.',
  '<p>Kad prezentaciju gleda 50, 100 ili više ljudi, slika mora biti velika i vidljiva iz zadnjeg reda. Projekcijsko platno DMT od 100 inča stoji na vlastitom stalku, postavlja se bez alata i bušenja i u nekoliko minuta pretvara bilo koju dvoranu, šator ili restoran u konferencijski prostor.</p>
<h3>Tehnički podaci</h3>
<ul>
<li>Dijagonala 100 inča (254 cm), ukupne dimenzije platna 211 x 160 cm</li>
<li>Vidljiva projekcijska površina 203 x 152 cm u formatu 4:3; sadržaj u 16:9 prikazuje se u širini od 203 cm</li>
<li>Mat bijela površina s gainom 1.1: svjetlija slika nego na običnom platnu, bez odsjaja i vrućih točaka</li>
<li>Tkanina otporna na vatru i plijesan, pogodna za javne prostore</li>
<li>Okvir od aluminija i čelika na samostojećem stalku, podesiva visina platna</li>
<li>Težina 12 kg, prenosi se i postavlja u jednom komadu</li>
</ul>
<h3>Za koje prilike</h3>
<p>Konferencije, kongresi i seminari, poslovne edukacije i treninzi, press konferencije, godišnje skupštine, vjenčanja s projekcijom fotografija, javno gledanje utakmica, ljetno kino za veću publiku i promocije na sajmovima. Platno je dovoljno veliko da ga publika jasno vidi i s 15 metara udaljenosti.</p>
<h3>Što još trebate za konferenciju</h3>
<p>Uz platno najčešće ide <a href="/najam/epson-eb-fh52-profesionalni-projektor-najam">Epson EB-FH52 profesionalni projektor s 4000 lumena</a>, koji daje jasnu sliku i u osvijetljenoj dvorani. Za zvuk i govornike preporučujemo <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a> i <a href="/najam/jbl-bezicni-mikrofoni-par-najam">bežične mikrofone</a>. Za manje sastanke i radionice pogledajte <a href="/najam/projekcijsko-platno-tronozac-172x172-najam">prijenosno platno 172 x 172 cm</a>.</p>',
  'Najam projekcijskog platna 100 inča za konferencije',
  'Iznajmite veliko projekcijsko platno 100 inča (211 x 160 cm) na stalku u Zagrebu. Za konferencije, seminare i velika događanja. Postavljanje bez alata, dostava.',
  ARRAY[
    'najam projekcijskog platna za konferencije',
    'veliko platno za projektor najam',
    'projekcijsko platno 100 inča najam',
    'platno za konferenciju iznajmljivanje',
    'oprema za konferencije najam zagreb',
    'platno za prezentacije najam'
  ],
  '[
    {"question":"Koliko je veliko platno od 100 inča?","answer":"Ukupne dimenzije platna su 211 x 160 cm, a vidljiva projekcijska površina 203 x 152 cm. Dijagonala od 100 inča odgovara 254 cm. Slika je dovoljno velika da je publika jasno vidi i s udaljenosti od 15 metara."},
    {"question":"Za koliko ljudi je prikladno?","answer":"Platno od 100 inča namijenjeno je dvoranama s 50 do 150 gledatelja: konferencijama, seminarima, kongresima i većim prezentacijama. Za sastanke do 30 osoba dovoljno je manje prijenosno platno od 172 cm."},
    {"question":"Treba li mi zid, alat ili montaža?","answer":"Ne. Platno stoji na vlastitom samostojećem stalku i postavlja se bez alata i bušenja. Razvučete stalak, podignete platno na željenu visinu i spremno je za projekciju u nekoliko minuta."},
    {"question":"Je li platno prikladno za 16:9 prezentacije i video?","answer":"Da. Platno je u formatu 4:3, pa se 16:9 sadržaj prikazuje u punoj širini od 203 cm s malo neiskorištenog prostora gore i dolje. Za PowerPoint, Keynote i video konferencije to je standardna i potpuno uobičajena postavka."},
    {"question":"Koji projektor ide uz ovo platno?","answer":"Za konferencije u osvijetljenoj dvorani preporučujemo Epson EB-FH52 s 4000 lumena, koji na 100 inča daje oštru Full HD sliku i bez potpunog zamračenja. Projektor se iznajmljuje zasebno."},
    {"question":"Može li se koristiti vani?","answer":"Da, u natkrivenom prostoru, šatoru ili na terasi bez jakog vjetra. Platno od 211 cm ima veliku površinu pa ga na otvorenom treba zaštititi od vjetra. Za projekciju vani preporučujemo početak nakon zalaska sunca."},
    {"question":"Koliko je teško i kako se prevozi?","answer":"Platno sa stalkom teži 12 kg i sklapa se u jedan duži komad koji stane u kombi ili veći automobil s preklopljenim sjedalima. Na području Zagreba nudimo i dostavu na lokaciju događanja."},
    {"question":"Nudite li popust za višednevne konferencije?","answer":"Da. Najam na 3 dana i na 7 dana povoljniji je po danu nego jednodnevni najam, a za opremanje cijele konferencije s projektorom, zvukom i mikrofonima pošaljite nam upit pa ćemo složiti paket."}
  ]'::jsonb,
  '{"@context":"https://schema.org","@type":"Product","name":"Veliko projekcijsko platno na stalku 211 x 160 cm (100 inča)","brand":{"@type":"Brand","name":"DMT"}}'::jsonb,
  1, NULL, NULL, 0,
  true, 0, 'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  12, '211 x 160',
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
-- 2) Epson EB-FH52 profesionalni projektor (Full HD, 4000 lm, 3LCD)
--    Owns "profesionalni projektor / projektor za konferencije / 4000 lumena".
-- ------------------------------------------------------------
INSERT INTO products (
  name, slug, category_id, short_desc, description,
  seo_title, seo_description, seo_keywords, faq, schema_json,
  min_rental_days, price_per_day, price_per_3days, price_per_7days,
  requires_deposit, deposit_amount, deposit_note,
  weight_kg, dimensions_cm,
  stock_qty, is_active, is_available, is_featured, sort_order
) VALUES (
  'Epson EB-FH52 profesionalni projektor, Full HD, 4000 lumena',
  'epson-eb-fh52-profesionalni-projektor-najam',
  (SELECT id FROM categories WHERE slug = 'audio-video-oprema'),
  'Poslovni 3LCD projektor Full HD 1080p s 4000 lumena za prezentacije u osvijetljenim dvoranama. Slika od 30 do 300 inča, 2x HDMI, bežično dijeljenje ekrana i Miracast, ugrađeni zvučnik 16 W.',
  '<p>Epson EB-FH52 je projektor za poslovne prilike u kojima slika mora biti oštra i vidljiva bez gašenja svjetla: konferencije, seminare, edukacije, sajmove i prezentacije klijentima. S <strong>4000 lumena</strong> u boji i bijeloj te Full HD rezolucijom daje jasan tekst, čitljive tablice i vjerne boje i u dvorani s dnevnim svjetlom.</p>
<h3>Tehnički podaci</h3>
<ul>
<li>Svjetlina 4000 lumena (boja i bijela), 3LCD tehnologija bez efekta duge i s punom svjetlinom boja</li>
<li>Full HD 1080p (1920 x 1080), kontrast 16 000:1, format 16:9</li>
<li>Veličina slike od 30 do 300 inča, ručni zoom 1,6x, throw ratio 1,32 do 2,14</li>
<li>Automatska vertikalna i ručna horizontalna korekcija trapeza do 30 stupnjeva</li>
<li>2x HDMI, VGA, USB (slika i zvuk preko USB kabela), kompozitni ulaz</li>
<li>Ugrađeni WiFi i Miracast: prezentirajte s laptopa, mobitela ili tableta bez kabela, uz aplikaciju Epson iProjection</li>
<li>Ugrađeni zvučnik 16 W dovoljan za sastanke do 30 osoba</li>
<li>Split screen za dva izvora istovremeno, PC-free prezentacije s USB sticka</li>
<li>Tiho hlađenje: 37 dB u normalnom i 28 dB u eco načinu rada</li>
<li>Težina 3,1 kg, dimenzije 31 x 28 x 9 cm, dolazi s daljinskim i kabelima</li>
</ul>
<h3>Za koje prilike</h3>
<p>Konferencije i kongresi, seminari i radionice, edukacije zaposlenika, sajmovi i promocije, press konferencije, hibridni sastanci i video pozivi na velikom ekranu, godišnje skupštine i akademski skupovi. Projektor radi iz kutije: priključite laptop na HDMI i prezentacija je na zidu za manje od minute.</p>
<h3>Složite komplet</h3>
<p>Za veliku dvoranu uzmite <a href="/najam/veliko-projekcijsko-platno-stalak-211x160-100-inca-najam">veliko projekcijsko platno 100 inča</a>, za manju salu <a href="/najam/projekcijsko-platno-tronozac-172x172-najam">prijenosno platno 172 x 172 cm</a>. Za zvuk govornika i videa dodajte <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a> s <a href="/najam/jbl-bezicni-mikrofoni-par-najam">bežičnim mikrofonima</a> i <a href="/najam/stalak-za-zvucnik-tripod-najam">stalkom za zvučnik</a>. Za filmsku večer ili dječji rođendan prikladniji je <a href="/najam/benq-th575i-kino-projektor-google-tv-najam">BenQ TH575i kino projektor s Google TV-om</a>.</p>',
  'Najam profesionalnog projektora Full HD 4000 lumena',
  'Iznajmite Epson EB-FH52 u Zagrebu: Full HD projektor s 4000 lumena, slika do 300 inča, 2x HDMI i bežično spajanje. Za konferencije, seminare i poslovne prezentacije.',
  ARRAY[
    'najam projektora za konferencije',
    'profesionalni projektor najam',
    'projektor 4000 lumena najam',
    'epson projektor iznajmljivanje',
    'projektor za prezentacije najam zagreb',
    'oprema za seminare najam'
  ],
  '[
    {"question":"Je li slika vidljiva u dvorani s upaljenim svjetlom?","answer":"Da. Epson EB-FH52 ima 4000 lumena, što je oko dvostruko više od kućnih projektora, pa je prezentacija čitljiva i u dvorani s dnevnim svjetlom ili upaljenom rasvjetom. Za najbolji kontrast ipak preporučujemo prigušiti svjetlo iznad platna."},
    {"question":"Koliko veliku sliku može projicirati?","answer":"Od 30 do 300 inča dijagonale. Za sliku od 100 inča projektor stoji oko 3 do 4,8 metra od platna, ovisno o zoomu. Zoom je ručni 1,6x pa veličinu slike podešavate bez pomicanja projektora."},
    {"question":"Kako spajam laptop ili mobitel?","answer":"Kabelom preko jednog od dva HDMI ulaza, VGA kabelom za starije laptope ili USB kabelom koji prenosi sliku i zvuk. Bežično radi preko ugrađenog WiFi-ja i Miracasta ili aplikacije Epson iProjection za iOS i Android. HDMI kabel dobivate uz najam."},
    {"question":"Mogu li prezentirati bez laptopa?","answer":"Da. Projektor ima PC-free funkciju: ubacite USB stick s fotografijama ili PDF-om i prezentaciju vodite daljinskim upravljačem. Za PowerPoint s animacijama ipak preporučujemo laptop."},
    {"question":"Trebam li dodatne zvučnike?","answer":"Za sastanke i seminare do 30 osoba dovoljan je ugrađeni zvučnik od 16 W. Za konferencije u većoj dvorani ili video s glazbom preporučujemo iznajmiti JBL PartyBox Stage 320 i bežične mikrofone."},
    {"question":"Je li projektor glasan tijekom sastanka?","answer":"Ne. Hlađenje radi na 37 dB u normalnom i 28 dB u eco načinu rada, što je tiše od uobičajenog uredskog klima uređaja, pa ne ometa govornika."},
    {"question":"Što je uključeno u najam?","answer":"Projektor Epson EB-FH52, daljinski upravljač, kabel za napajanje i HDMI kabel, u torbi za prijenos. Platno se iznajmljuje zasebno; preporučujemo veliko platno od 100 inča za konferencije ili prijenosno platno 172 cm za manje sale."},
    {"question":"Izdajete li račun za firmu i nudite li dostavu?","answer":"Da. Izdajemo R1 račun za poslovne korisnike, a na području Zagreba nudimo dostavu i preuzimanje na lokaciji događanja. Za višednevne konferencije najam na 3 ili 7 dana po danu je znatno povoljniji."}
  ]'::jsonb,
  '{"@context":"https://schema.org","@type":"Product","name":"Epson EB-FH52 profesionalni projektor","brand":{"@type":"Brand","name":"Epson"}}'::jsonb,
  1, NULL, NULL, 0,
  true, 0, 'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  3.1, '31 x 28 x 9',
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
-- 3) BenQ TH575i kino projektor (Full HD, 3800 lm, Google TV)
--    Owns "projektor za rođendan / kino u dvorištu / projektor s Netflixom".
--    The live projektor-s-platnom-najam keeps the generic "najam projektora".
-- ------------------------------------------------------------
INSERT INTO products (
  name, slug, category_id, short_desc, description,
  seo_title, seo_description, seo_keywords, faq, schema_json,
  min_rental_days, price_per_day, price_per_3days, price_per_7days,
  requires_deposit, deposit_amount, deposit_note,
  weight_kg, dimensions_cm,
  stock_qty, is_active, is_available, is_featured, sort_order
) VALUES (
  'BenQ TH575i kino projektor, Full HD, 3800 lumena, Google TV',
  'benq-th575i-kino-projektor-google-tv-najam',
  (SELECT id FROM categories WHERE slug = 'audio-video-oprema'),
  'Kino projektor Full HD s 3800 lumena i Google TV: Netflix, YouTube i Disney+ bez laptopa. Slika do 120 inča, zvučnik 10 W, niski input lag za gaming. Za filmske večeri, dječje rođendane i manje evente.',
  '<p>BenQ TH575i je projektor kojim u pet minuta napravite kino u dvorištu, dnevnoj sobi ili na dječjem rođendanu. Ima <strong>Google TV ugrađen u priloženi dongle</strong>, pa Netflix, YouTube, Disney+ i HBO Max pokrećete daljinskim, bez laptopa i bez kabela. Sa 3800 lumena slika je svijetla i prije potpunog mraka, a Full HD rezolucija daje oštar film i na 120 inča.</p>
<h3>Tehnički podaci</h3>
<ul>
<li>Svjetlina 3800 ANSI lumena, DLP tehnologija, Full HD 1080p (1920 x 1080)</li>
<li>Kontrast 15 000:1, 1,07 milijardi boja, Cinema, Sports, Game i Living Room načini slike</li>
<li>Slika do 120 inča (305 cm dijagonale), zoom 1,1x, automatska korekcija trapeza</li>
<li>Google TV dongle s Netflixom, YouTubeom, Disney+ i Google Playom; glasovno pretraživanje daljinskim</li>
<li>HDMI ulaz za konzolu, laptop ili TV stick, audio izlaz 3,5 mm za vanjski zvučnik</li>
<li>Ugrađeni zvučnik 10 W, dovoljan za dnevnu sobu i manje društvo</li>
<li>Input lag samo 16,7 ms: PlayStation, Xbox ili Switch turnir bez kašnjenja</li>
<li>Tih rad: 34 dB normalno, 29 dB u eco načinu</li>
<li>Težina 2,3 kg, dimenzije 30 x 24 x 12 cm, dolazi s daljinskim i kabelima</li>
</ul>
<h3>Za koje prilike</h3>
<p>Filmska večer u dvorištu ili na terasi, dječji rođendan s crtićem na cijelom zidu, gaming turnir, gledanje utakmice s prijateljima, rođendani i proslave, manji eventi do 50 ljudi, vjenčanja i obljetnice s projekcijom fotografija i videa.</p>
<h3>Složite kino u dvorištu</h3>
<p>Uz projektor uzmite <a href="/najam/projekcijsko-platno-tronozac-172x172-najam">prijenosno platno 172 x 172 cm</a> ili za veću publiku <a href="/najam/veliko-projekcijsko-platno-stalak-211x160-100-inca-najam">veliko platno 100 inča</a>. Zvuk pokriva <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a> ili manji <a href="/najam/jbl-charge-3-bluetooth-zvucnik-najam">JBL Charge 3</a>. Za pravi kino doživljaj dodajte <a href="/najam/aparat-za-kokice-s-kolicima-vevor-najam">aparat za kokice s kolicima</a>, a za dječji rođendan <a href="/najam/aparat-za-slushie-margaritu-najam">aparat za slushie</a>. Za poslovne prezentacije u osvijetljenoj dvorani prikladniji je <a href="/najam/epson-eb-fh52-profesionalni-projektor-najam">Epson EB-FH52 s 4000 lumena</a>.</p>',
  'Najam kino projektora za filmsku večer i rođendane',
  'Iznajmite BenQ TH575i: Full HD projektor s 3800 lumena i Google TV, Netflix bez laptopa, slika do 120 inča. Za kino u dvorištu, dječje rođendane i evente u Zagrebu.',
  ARRAY[
    'najam projektora za rođendan',
    'projektor za kino na otvorenom najam',
    'benq projektor najam',
    'projektor s netflixom najam',
    'najam projektora za dječji rođendan',
    'projektor za filmsku večer najam zagreb'
  ],
  '[
    {"question":"Mogu li gledati Netflix bez laptopa?","answer":"Da. BenQ TH575i dolazi s Google TV donglom koji je već spojen i podešen. Prijavite se u svoj Netflix, YouTube, Disney+ ili HBO Max račun i film pokrećete daljinskim upravljačem, bez laptopa i bez kabela. Potreban je samo WiFi."},
    {"question":"Koliko velika može biti slika?","answer":"Do 120 inča dijagonale, što je oko 265 cm širine. Za sliku od 100 inča projektor stoji otprilike 3,3 do 3,6 metra od platna ili zida. Slika se projicira i na bijeli ili svijetli zid, ali je na platnu znatno oštrija."},
    {"question":"Je li dovoljno svijetao za kino na otvorenom?","answer":"Da. Sa 3800 lumena slika je gledljiva već u sumrak, a nakon zalaska sunca je kao u kinu. Za gledanje po danu nijedan projektor ne daje pravi doživljaj, pa vanjsku projekciju planirajte nakon sumraka."},
    {"question":"Je li prikladan za dječji rođendan?","answer":"Vrlo. Djeca gledaju crtić ili pjevaju karaoke s YouTubea na cijelom zidu, a postavljanje traje pet minuta. Projektor je tih i ne grije prostor. Uz njega dobro ide aparat za kokice i aparat za slushie koji također iznajmljujemo."},
    {"question":"Mogu li spojiti PlayStation, Xbox ili Switch?","answer":"Da, preko HDMI ulaza. Input lag je samo 16,7 ms, pa je BenQ TH575i pogodan i za gaming turnire bez primjetnog kašnjenja slike. Game mode dodatno izvlači detalje u tamnim scenama."},
    {"question":"Trebam li dodatni zvučnik?","answer":"Za dnevnu sobu ili društvo do 10 ljudi dovoljan je ugrađeni zvučnik od 10 W. Za kino u dvorištu ili rođendan vani preporučujemo Bluetooth zvučnik poput JBL Charge 3 ili JBL PartyBox Stage 320, koji se spaja na audio izlaz projektora."},
    {"question":"Što dobivam u najmu?","answer":"Projektor BenQ TH575i, Google TV dongle, daljinski upravljač, kabel za napajanje i HDMI kabel u torbi za prijenos. Platno se iznajmljuje zasebno; za filmsku večer preporučujemo prijenosno platno 172 x 172 cm."},
    {"question":"Koja je razlika u odnosu na vaš paket projektor s platnom?","answer":"BenQ TH575i je svjetliji, Full HD kino projektor s ugrađenim Google TV-om, pa je za filmske večeri, rođendane i gaming najbolji izbor. Osnovni paket projektor s platnom povoljnija je opcija za jednostavne projekcije manjeg društva."}
  ]'::jsonb,
  '{"@context":"https://schema.org","@type":"Product","name":"BenQ TH575i kino projektor","brand":{"@type":"Brand","name":"BenQ"}}'::jsonb,
  1, NULL, NULL, 0,
  true, 0, 'Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
  2.3, '30 x 24 x 12',
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
-- 4) Aparat za kokice s kolicima VEVOR (8 oz, retro kino stil)
--    Owns "aparat za kokice s kolicima / kokice za event / momačka".
--    The older inactive row aparat-za-kokice-popcorn-masina-najam keeps
--    the generic "aparat za kokice najam" and is not linked (it is hidden).
-- ------------------------------------------------------------
INSERT INTO products (
  name, slug, category_id, short_desc, description,
  seo_title, seo_description, seo_keywords, faq, schema_json,
  min_rental_days, price_per_day, price_per_3days, price_per_7days,
  requires_deposit, deposit_amount, deposit_note,
  weight_kg, dimensions_cm,
  stock_qty, is_active, is_available, is_featured, sort_order
) VALUES (
  'Aparat za kokice s kolicima VEVOR, 8 oz, retro kino stil',
  'aparat-za-kokice-s-kolicima-vevor-najam',
  (SELECT id FROM categories WHERE slug = 'oprema-za-evente'),
  'Profesionalni aparat za kokice u retro kino stilu na kolicima s kotačima. Kotlić od 8 oz, oko 48 šalica svježih kokica po turi za 3 minute, grijač za održavanje topline. Za evente, rođendane, momačke i djevojačke.',
  '<p>Miris svježih kokica je najbrži način da event dobije atmosferu. Aparat za kokice VEVOR u retro kino stilu dolazi na vlastitim <strong>kolicima s kotačima</strong>, pa ga dovezete točno tamo gdje su gosti: u dvorište, dvoranu, na terasu ili na štand. Jedna tura od 8 oz kukuruza daje oko 48 šalica kokica za 3 minute, dovoljno da se nitko ne čeka u redu.</p>
<h3>Što dobivate</h3>
<ul>
<li>Aparat za kokice snage 800 W na 230 V, standardna kućna utičnica</li>
<li>Kotlić od nehrđajućeg čelika zapremine 8 oz (oko 230 g kukuruza po turi)</li>
<li>Oko 48 šalica kokica po turi, nova tura svake 3 minute: 400 do 600 porcija u satu kontinuiranog rada</li>
<li>Grijaća lampa koja kokice drži toplima i hrskavima dok čekaju goste</li>
<li>Kabinet od kaljenog stakla s vratima i ladicom za ljuskice, lako se čisti</li>
<li>Kolica s dva velika kotača i policom za kukuruz, vrećice i pribor</li>
<li>Mjerica za kukuruz i žlice za posluživanje</li>
<li>Odvojeni prekidači za grijanje kotlića, miješanje i lampu</li>
</ul>
<h3>Za koje prilike</h3>
<p>Dječji i odrasli rođendani, momačke i djevojačke večeri, filmska večer u dvorištu, vjenčanja i candy bar, korporativni eventi i team building, sajmovi, štandovi i promocije, školske priredbe, sportski turniri i kvartovske fešte. Retro crveni aparat na kolicima je i dekoracija i atrakcija za fotografiranje.</p>
<h3>Kako radi</h3>
<p>Uključite grijanje kotlića, nakon par minuta ulijte ulje i kukuruz, pokrenite miješanje i za oko 3 minute kokice padaju u kabinet. Isključite kotlić, pospite sol ili šećer i poslužite. Uz aparat dobivate kratke upute, a cijeli postupak nauči svatko u jednoj turi.</p>
<h3>Složite event</h3>
<p>Za filmsku večer kombinirajte ga s <a href="/najam/benq-th575i-kino-projektor-google-tv-najam">BenQ kino projektorom s Google TV-om</a> i <a href="/najam/projekcijsko-platno-tronozac-172x172-najam">prijenosnim platnom</a>. Za rođendane i momačke dodajte <a href="/najam/aparat-za-slushie-margaritu-najam">aparat za slushie i margaritu</a>, <a href="/najam/tocionik-za-pivu-5l-najam">točionik za pivo</a> ili <a href="/najam/ledomat-aparat-za-led-najam">ledomat</a>, a za glazbu <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a>. Slatki kutak zaokružuje <a href="/najam/ninja-creami-swirl-aparat-sladoled-najam">aparat za sladoled Ninja CREAMi</a>.</p>',
  'Najam aparata za kokice s kolicima za evente i rođendane',
  'Iznajmite profesionalni aparat za kokice s kolicima u Zagrebu: retro kino stil, 48 šalica po turi, svježe kokice za rođendane, momačke, djevojačke i evente. Dostava.',
  ARRAY[
    'najam aparata za kokice',
    'aparat za kokice s kolicima najam',
    'popcorn aparat za event najam',
    'aparat za kokice za rođendan',
    'kokice za momačku večer',
    'najam aparata za kokice zagreb'
  ],
  '[
    {"question":"Koliko kokica napravi i koliko brzo?","answer":"Kotlić od 8 oz (oko 230 g kukuruza) u jednoj turi napravi oko 48 šalica kokica, a tura traje otprilike 3 minute. U sat vremena kontinuiranog rada to je 400 do 600 porcija, dovoljno za rođendan, vjenčanje ili štand na sajmu."},
    {"question":"Je li kukuruz uključen u najam?","answer":"Kukuruz za kokice, ulje, sol i vrećice nisu uključeni u osnovnu cijenu najma. Kukuruz za kokice i kokosovo ili suncokretovo ulje nabavite u svakom većem dućanu, a ako želite da mi osiguramo potrošni materijal, napišite to u upitu."},
    {"question":"Treba li mi posebna struja?","answer":"Ne. Aparat ima 800 W i radi na običnu kućnu utičnicu od 230 V. Vani ga spojite na produžni kabel, a za lokacije bez struje možete iznajmiti i našu prijenosnu stanicu za napajanje."},
    {"question":"Može li se koristiti na otvorenom?","answer":"Da, uz zaštitu od kiše. Kolica s kotačima omogućuju da ga dovezete u dvorište, na terasu ili na štand, a staklo i grijaća lampa drže kokice toplima i vani. Za vjetrovite lokacije postavite ga uz zid ili pod šator."},
    {"question":"Je li prikladan za dječji rođendan?","answer":"Da, djeca ga obožavaju. Odrasla osoba rukuje kotlićem jer je vruć, a djeca kokice uzimaju iz donjeg dijela kabineta ili iz vrećica. Jedna tura pokrije 10 do 15 djece, a za duži rođendan jednostavno napravite još."},
    {"question":"Je li aparat težak za prevoziti?","answer":"Aparat se skida s kolica i prevozi odvojeno, pa oboje stane u veći automobil ili kombi. Kolica imaju dva velika kotača i lako se guraju i po travi. Na području Zagreba nudimo dostavu i postavljanje na lokaciji."},
    {"question":"Kako se čisti nakon eventa?","answer":"Kotlić i kabinet se obrišu vlažnom krpom dok su još topli, ljuskice se isprazne iz ladice, a staklo se obriše sredstvom za staklo. Aparat vraćate čist, a za pomoć s čišćenjem javite nam se pri povratu."},
    {"question":"Koliko dana unaprijed trebam rezervirati?","answer":"Preporučujemo rezervaciju barem tjedan dana prije eventa, a za vikende u svibnju, lipnju i rujnu, kad su vjenčanja i momačke večeri najčešće, i ranije. Na upit odgovaramo u roku od jednog radnog dana."}
  ]'::jsonb,
  '{"@context":"https://schema.org","@type":"Product","name":"Aparat za kokice s kolicima VEVOR","brand":{"@type":"Brand","name":"VEVOR"}}'::jsonb,
  1, NULL, NULL, 0,
  true, 0, 'Polog se vraća u cijelosti nakon povrata opreme u ispravnom i čistom stanju.',
  NULL, NULL,
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
  updated_at = now();

-- ------------------------------------------------------------
-- 5) Re-target the existing 172 x 172 cm draft (SBOX PSMT-96-2, from 019)
--    toward "prijenosno platno za prezentacije i manje događaje" and move it
--    next to the other projection gear. Prices 10/20/35 are kept, so the
--    title and description may carry the price. No em/en dashes.
-- ------------------------------------------------------------
UPDATE products SET
  name = 'Prijenosno projekcijsko platno na tronošcu 172 x 172 cm (96 inča)',
  category_id = (SELECT id FROM categories WHERE slug = 'audio-video-oprema'),
  short_desc = 'Prijenosno samostojeće platno 172 x 172 cm (96 inča) na tronošcu za prezentacije, radionice i manje događaje. Mat bijela tkanina, gain 1.0, kut gledanja 160 stupnjeva, formati 16:9, 4:3 i 1:1. Postavljanje u dvije minute.',
  description = '<p>Prijenosno projekcijsko platno koje ponesete u ruci i postavite za dvije minute, bez zida, bušenja i montaže. Razvučete tronožac, izvučete platno na željenu visinu i imate ekran dijagonale 96 inča u uredu, učionici, dvorištu ili sali za manje događaje.</p>
<h3>Tehnički podaci</h3>
<ul>
<li>Površina platna 172 x 172 cm (dijagonala 96 inča), sklapa se u čelično kućište duljine 184 cm</li>
<li>Mat bijela tkanina debljine 0,4 mm, bez odsjaja i bez nabora</li>
<li>Gain 1.0 i kut gledanja 160 stupnjeva: slika jednako izgleda i gledateljima sa strane</li>
<li>Podržani formati: 16:9 za film i video, 4:3 za prezentacije i 1:1; format birate visinom izvlačenja</li>
<li>Crni obrub koji podiže kontrast: 5 cm gore, 4 cm dolje, 3 cm sa strane</li>
<li>Ručno izvlačenje s podesivom visinom, tronožac se sklapa uz kućište</li>
</ul>
<h3>Za koje prilike</h3>
<p>Poslovne prezentacije i sastanci do 30 osoba, radionice i edukacije, predavanja u učionici, filmska večer u dvorištu, dječji rođendani, gledanje utakmica s prijateljima, manji eventi i promocije, te snimanje ispred neutralne pozadine. Za dvoranu s više od 50 gledatelja pogledajte <a href="/najam/veliko-projekcijsko-platno-stalak-211x160-100-inca-najam">veliko platno od 100 inča za konferencije</a>.</p>
<h3>Složite komplet</h3>
<p>Za prezentacije u osvijetljenoj sali uzmite <a href="/najam/epson-eb-fh52-profesionalni-projektor-najam">Epson EB-FH52 profesionalni projektor</a>, za kino u dvorištu i rođendane <a href="/najam/benq-th575i-kino-projektor-google-tv-najam">BenQ TH575i s Google TV-om</a>, a za jednostavnu projekciju <a href="/najam/projektor-s-platnom-najam">osnovni paket projektor s platnom</a>. Zvuk uz film pokriva <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a> ili <a href="/najam/jbl-charge-3-bluetooth-zvucnik-najam">JBL Charge 3</a>.</p>',
  seo_title = 'Najam prijenosnog platna za prezentacije od 10 €/dan',
  seo_description = 'Prijenosno projekcijsko platno 172 x 172 cm (96 inča) na tronošcu od 10 €/dan u Zagrebu. Za prezentacije, radionice i manje događaje, postavljanje u 2 minute.',
  seo_keywords = ARRAY[
    'najam projekcijskog platna',
    'prijenosno platno za projektor najam',
    'platno za prezentacije najam',
    'platno na tronošcu najam',
    'projekcijsko platno najam zagreb',
    'platno za manje događaje iznajmljivanje'
  ],
  faq = '[
    {"question":"Koliko je platno veliko?","answer":"Površina platna je 172 x 172 cm, što odgovara dijagonali od 96 inča. U formatu 16:9 slika je široka 172 cm i visoka oko 97 cm, a u 4:3 formatu za prezentacije 172 x 129 cm."},
    {"question":"Za koliko ljudi je prikladno?","answer":"Za sastanke, radionice i prezentacije do 30 osoba te za filmske večeri i rođendane u dvorištu ili dnevnoj sobi. Za konferencije i dvorane s više od 50 gledatelja iznajmljujemo veliko platno od 100 inča."},
    {"question":"Treba li mi zid ili montaža?","answer":"Ne. Platno stoji na vlastitom tronošcu, pa ga postavite bilo gdje: u uredu, učionici, dvorištu ili sali. Nema bušenja ni vješanja, a za postavljanje nije potreban alat."},
    {"question":"Koliko traje postavljanje i je li prijenosno?","answer":"Postavljanje traje oko dvije minute: razvučete tronožac, izvučete platno na željenu visinu i zaključate ga. Sklopljeno platno je jedan komad duljine 184 cm koji stane u svaki automobil s preklopljenim sjedalom ili u kombi."},
    {"question":"Koje formate slike podržava?","answer":"Platno je kvadratno 172 x 172 cm pa podržava 16:9 za filmove i video, 4:3 za klasične prezentacije i 1:1. Format birate visinom na koju izvučete platno, bez dodatnog podešavanja."},
    {"question":"Je li dobro za projekciju danju?","answer":"Mat bijela tkanina s gainom 1.0 daje ravnomjernu sliku bez odsjaja, ali svaki projektor najbolje radi u zamračenoj prostoriji ili nakon sumraka. Za prezentacije po danu preporučujemo svjetliji projektor, poput Epsona EB-FH52 s 4000 lumena, i spuštene rolete."},
    {"question":"Je li projektor uključen u cijenu?","answer":"Nije, ovo je samo platno. Projektor iznajmljujete zasebno: Epson EB-FH52 za poslovne prezentacije, BenQ TH575i s Google TV-om za filmske večeri i rođendane ili osnovni paket projektor s platnom."},
    {"question":"Koliko košta najam platna?","answer":"Jedan dan je 10 eura, tri dana 20 eura, a sedam dana 35 eura. Dostava je moguća na području Zagreba, a za platno uz projektor rado složimo paket."}
  ]'::jsonb,
  schema_json = '{"@context":"https://schema.org","@type":"Product","name":"Prijenosno projekcijsko platno na tronošcu 172 x 172 cm","brand":{"@type":"Brand","name":"SBOX"}}'::jsonb,
  updated_at = now()
WHERE slug = 'projekcijsko-platno-tronozac-172x172-najam';

COMMIT;

-- Verify (expect 5 rows; the 4 new ones with is_active = false and
-- price_per_7days = 0; the 172 draft with 10/20/35 and 8 faq items):
--   SELECT p.slug, c.slug AS category, p.is_active,
--          p.price_per_day, p.price_per_3days, p.price_per_7days,
--          p.dimensions_cm, jsonb_array_length(p.faq) AS faq_items
--   FROM products p LEFT JOIN categories c ON c.id = p.category_id
--   WHERE p.slug IN (
--     'veliko-projekcijsko-platno-stalak-211x160-100-inca-najam',
--     'epson-eb-fh52-profesionalni-projektor-najam',
--     'benq-th575i-kino-projektor-google-tv-najam',
--     'aparat-za-kokice-s-kolicima-vevor-najam',
--     'projekcijsko-platno-tronozac-172x172-najam'
--   );
-- No dashes in copy:
--   SELECT slug FROM products WHERE slug IN (...) AND
--     (name || short_desc || description || seo_title || seo_description || faq::text) ~ '[—–]';
--   -- expect 0 rows
