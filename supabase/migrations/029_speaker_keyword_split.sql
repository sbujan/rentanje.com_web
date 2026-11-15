-- One keyword per page for the speaker pages, so they stop competing:
--   /najam/jbl-zvucnici (hub, in code)   najam JBL
--   JBL PartyBox Stage 320               najam zvučnika (with the full price ladder)
--   JBL Charge 3                         najam bluetooth zvučnika
--   JBL bežični mikrofoni                najam mikrofona
--   Stalak                               najam stalka za zvučnik
--   Paket 2 zvučnika + 2 stalka          najam ozvučenja za vjenčanje
-- Needs the code that fills {cijena3} and {cijena7} (3-day and 7-day prices)
-- to be live first. Phrases are replaced in place, so a re-run changes nothing.

-- JBL PartyBox Stage 320: najam zvučnika
UPDATE products SET
  seo_title = 'Najam zvučnika JBL PartyBox 320 od {cijena} €/dan',
  seo_description = 'Najam zvučnika u Zagrebu: JBL PartyBox Stage 320 za {cijena} € na dan, {cijena3} € za 3 dana ili {cijena7} € za tjedan. 240 W, svjetlosni show, baterija do 18 h.',
  seo_keywords = ARRAY[
    'najam zvučnika',
    'najam zvučnika Zagreb',
    'iznajmljivanje zvučnika',
    'najam zvučnika za rođendan',
    'najam zvučnika za vjenčanje',
    'najam JBL PartyBox'
  ],
  hero_image_alt = 'Najam zvučnika JBL PartyBox Stage 320 u Zagrebu',
  description = replace(
    description,
    'Iznajmite ga u Zagrebu za rođendan, momačku, vjenčanje ili zabavu u dvorištu.</p>',
    $html$Ako vam treba najam zvučnika u Zagrebu za rođendan, momačku, vjenčanje ili zabavu u dvorištu, ovo je model koji najčešće iznajmljujemo.</p>
<h3>Cijena najma zvučnika</h3>
<ul>
<li>1 dan: {cijena} €</li>
<li>3 dana: {cijena3} €</li>
<li>7 dana: {cijena7} €</li>
</ul>
<p>Cijena vrijedi za jedan zvučnik s baterijom i kabelom. Zvučnik preuzimate na Naserovom trgu 4 u Zagrebu ili ga dostavljamo na adresu u Zagrebu i okolici.</p>$html$),
  faq = replace(replace(
    faq::text,
    '"Koliko košta najam JBL PartyBox Stage 320?"',
    '"Koliko košta najam zvučnika JBL PartyBox Stage 320?"'),
    'Najam JBL PartyBox Stage 320 u Zagrebu kreće od {cijena} eura dnevno. Najam na 3 ili 7 dana povoljniji je po danu, a točnu cijenu',
    'Najam zvučnika JBL PartyBox Stage 320 u Zagrebu stoji {cijena} € za jedan dan, {cijena3} € za 3 dana i {cijena7} € za 7 dana. Točnu cijenu')::jsonb
WHERE slug = 'jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima';

UPDATE products SET
  faq = jsonb_insert(
    faq,
    '{1}',
    jsonb_build_object(
      'question', 'Koji zvučnik iznajmiti za rođendan ili vjenčanje?',
      'answer', 'Za rođendan, momačku ili zabavu u dvorištu dovoljan je jedan JBL PartyBox Stage 320, koji ozvuči prostor veličine teniskog terena. Za vjenčanje ili veću salu uzmite dva zvučnika na stalcima, uparena u stereo.'))
WHERE slug = 'jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima'
  AND jsonb_typeof(faq) = 'array'
  AND faq::text NOT LIKE '%Koji zvučnik iznajmiti za rođendan ili vjenčanje?%';

-- JBL Charge 3: najam bluetooth zvučnika. It rents for 3 days minimum, so the
-- copy quotes the 3-day and 7-day prices and no daily rate.
UPDATE products SET
  seo_title = 'Najam Bluetooth zvučnika JBL Charge 3 u Zagrebu',
  seo_description = 'Najam prijenosnog Bluetooth zvučnika JBL Charge 3 u Zagrebu: {cijena3} € za 3 dana, {cijena7} € za tjedan. Baterija do 20 h, vodootporan IPX7, puni mobitel.',
  seo_keywords = ARRAY[
    'najam bluetooth zvučnika',
    'najam prijenosnog zvučnika',
    'najam malog zvučnika',
    'najam JBL Charge 3'
  ],
  description = replace(
    description,
    'Iznajmite ga u Zagrebu za izlet, kampiranje ili manje druženje.</p>',
    'Najam Bluetooth zvučnika u Zagrebu dobar je izbor za izlet, kampiranje ili manje druženje.</p>'),
  faq = replace(
    faq::text,
    'Najam JBL Charge 3 u Zagrebu kreće od {cijena} eura dnevno uz minimalni najam od 3 dana. Najam na 7 dana povoljniji je po danu, a točnu cijenu',
    'Najam JBL Charge 3 u Zagrebu stoji {cijena3} € za 3 dana ili {cijena7} € za 7 dana. Minimalni najam je 3 dana, a točnu cijenu')::jsonb
WHERE slug = 'jbl-charge-3-bluetooth-zvucnik-najam';

-- JBL bežični mikrofoni: najam mikrofona
UPDATE products SET
  seo_title = 'Najam mikrofona za karaoke: JBL bežični par',
  seo_description = 'Najam mikrofona u Zagrebu: par JBL bežičnih mikrofona za karaoke i govore, {cijena3} € za 3 dana. Plug and play s JBL PartyBox zvučnicima, domet do 30 m.',
  seo_keywords = ARRAY[
    'najam mikrofona',
    'najam bežičnih mikrofona',
    'najam mikrofona za karaoke',
    'najam JBL mikrofona'
  ],
  description = replace(
    description,
    'Iznajmite ih u Zagrebu za karaoke večer, vjenčanje, prezentaciju ili rođendan.</p>',
    'Ako trebate najam mikrofona u Zagrebu za karaoke večer, vjenčanje, prezentaciju ili rođendan, ovaj par je spreman za nekoliko sekundi.</p>'),
  faq = replace(replace(
    faq::text,
    '"Koliko košta najam JBL bežičnih mikrofona?"',
    '"Koliko košta najam bežičnih mikrofona?"'),
    'Najam para JBL bežičnih mikrofona u Zagrebu kreće od {cijena} eura dnevno uz minimalni najam od 3 dana. Točnu cijenu',
    'Najam para JBL bežičnih mikrofona u Zagrebu stoji {cijena3} € za 3 dana ili {cijena7} € za 7 dana. Minimalni najam je 3 dana, a točnu cijenu')::jsonb
WHERE slug = 'jbl-bezicni-mikrofoni-par-najam';

-- Stalak: title stays, keywords and image alt cleaned up
UPDATE products SET
  seo_keywords = ARRAY[
    'najam stalka za zvučnik',
    'stalak za zvučnik najam',
    'tronožac za zvučnik',
    'stalak za zvučnike Zagreb'
  ],
  hero_image_alt = 'Stalak za zvučnik za najam u Zagrebu'
WHERE slug = 'stalak-za-zvucnik-tripod-najam';

-- Paket: it was the only page with "Najam zvučnika" in the title
UPDATE bundles SET
  seo_title = 'Najam ozvučenja za vjenčanje: 2 JBL PartyBox',
  seo_description = 'Najam ozvučenja za vjenčanje, rođendan ili event u Zagrebu: paket 2 JBL PartyBox 320 zvučnika i 2 stalka. Snažan stereo zvuk, uz popust na paket.'
WHERE slug = 'paket-2-zvucnika-2-stalka-jbl-partybox-320'
  AND seo_title LIKE 'Najam Zvučnika |%';

-- Kategorija: the link to the PartyBox page carries its keyword
UPDATE categories SET
  seo_text = replace(
    seo_text,
    '<a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a> s 240 W pokriva zabavu u dvorištu ili sali, a manji',
    'Za zabavu u dvorištu ili sali pogledajte <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">najam zvučnika JBL PartyBox Stage 320</a> s 240 W, a manji')
WHERE slug = 'audio-video-oprema';
