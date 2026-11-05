-- ============================================================
-- 024_karcher_pivski_set_copy.sql
--
-- Search Console, 2026-08-04 to 2026-11-03:
--   * Kärcher Puzzi is a best seller, yet its product page got 1 click, while
--     the blog post about it got 45. For "najam usisavača za dubinsko čišćenje"
--     the site sat at position 17.7. The title said neither "usisavač" nor
--     "dubinsko čišćenje", and the description was 442 characters of plain text.
--   * The ratan table set, which the owner wants to rent more, got 4 impressions
--     in 3 months. It targeted "stol s klupama" and buried "pivski set".
--
-- Rewrites both pages. Facts come from the existing rows and the site's own blog
-- posts. {cijena} is filled with the live daily rate. Also links the table set
-- from the gazebo, the heater and the Oprema za evente text.
--
-- Data only. Idempotent. No em or en dashes in copy (owner rule).
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1) Kärcher Puzzi 10/1
-- ------------------------------------------------------------
UPDATE products SET
  name = 'Kärcher Puzzi 10/1 usisavač za dubinsko čišćenje',
  short_desc = 'Profesionalni usisavač za dubinsko čišćenje kauča, tepiha, madraca i autosjedala. Uz najam dobivate upute, a tekstil je suh za 2 do 4 sata.',
  seo_title = 'Najam Kärcher usisavača za dubinsko čišćenje',
  seo_description = 'Najam Kärcher Puzzi 10/1 u Zagrebu od {cijena} €/dan. Stroj za dubinsko (kemijsko) čišćenje kauča, tepiha, madraca i auta. Tekstil je suh za 2 do 4 sata.',
  description = '<p>Kärcher Puzzi 10/1 je profesionalni usisavač za dubinsko čišćenje, isti tip stroja koji koriste firme za čišćenje. Pod pritiskom uštrca otopinu vode i sredstva duboko u tkaninu, a zatim je snažno usiše natrag, zajedno s prljavštinom koju obični usisavač ne može dohvatiti. Iznajmite ga u Zagrebu i sami operite kauč, tepih, madrac ili auto.</p>
<h3>Što sve možete oprati</h3>
<ul>
<li>Kauče, fotelje i tapecirane stolice</li>
<li>Tepihe i zidne tepisone koje ne možete odnijeti u praonicu</li>
<li>Autosjedala i unutrašnjost auta, ono što saloni naplaćuju kao kemijsko čišćenje auta</li>
<li>Madrace i dječje autosjedalice</li>
</ul>
<h3>Zašto najam, a ne usluga ili kupnja</h3>
<ul>
<li>Novi Puzzi 10/1 košta oko 500 eura, a većini kućanstava dubinsko čišćenje treba jednom ili dvaput godišnje</li>
<li>Usluga se obično naplaćuje po komadu namještaja ili kvadratu tepiha, a s najmom operete sve što stignete</li>
<li>Puzzi izvlači većinu vlage, pa je tekstil suh za 2 do 4 sata umjesto za nekoliko dana</li>
</ul>
<h3>Što dobivate u najmu</h3>
<ul>
<li>Kärcher Puzzi 10/1 sa spremnikom za svježu vodu od 10 litara</li>
<li>Nastavak za velike površine i manji nastavak za namještaj i uske dijelove</li>
<li>Upute za korištenje, a osnovno rukovanje nauči se u par minuta</li>
</ul>
<p>Preporučujemo originalno Kärcher sredstvo za čišćenje, koje možete zatražiti kod najma. Pri preuzimanju objasnimo doziranje i što je uključeno.</p>
<h3>Kako se koristi</h3>
<ol>
<li>Površinu prvo dobro usišite običnim usisavačem</li>
<li>U spremnik ulijte toplu vodu i sredstvo za čišćenje</li>
<li>Radite polako, u ravnim potezima, a jače zaprljane dijelove prijeđite dvaput</li>
<li>Prostoriju prozračite dok se tekstil ne osuši</li>
</ol>
<p>Prije pranja provjerite etiketu i isprobajte stroj na skrivenom dijelu tkanine. Vuneni i perzijski tepisi ne peru se ovim strojem.</p>
<h3>Saznajte više</h3>
<p>Detaljno smo opisali <a href="/blog/karcher-puzzi-10-1-kako-radi">kako radi Kärcher Puzzi 10/1</a> i <a href="/blog/dubinsko-ciscenje-kauca-tepiha-auta">kako dubinski očistiti kauč, tepih i auto</a>. Ostalu opremu pogledajte u kategoriji <a href="/najam/alati-ciscenje">alati i oprema za čišćenje</a>.</p>',
  faq = '[
    {"question":"Koliko košta najam Kärcher Puzzi usisavača?","answer":"Najam Kärcher Puzzi 10/1 u Zagrebu kreće od {cijena} eura dnevno. Najam na 3 ili 7 dana povoljniji je po danu, a točnu cijenu za odabrane datume vidite u kalendaru na ovoj stranici."},
    {"question":"Što mogu očistiti s Kärcher Puzzi?","answer":"Kauče, fotelje, tapecirane stolice, tepihe, zidne tepisone, madrace, autosjedala i dječje autosjedalice. Vuneni i perzijski tepisi ne peru se ovim strojem, a osjetljive tkanine prvo isprobajte na skrivenom dijelu."},
    {"question":"Je li to stroj za kemijsko čišćenje?","answer":"Da, to je ono što se obično zove kemijsko čišćenje kauča ili auta. Stručno se zove ekstrakcijsko dubinsko pranje: stroj uštrca otopinu vode i sredstva u tkaninu, a zatim je zajedno s prljavštinom usiše natrag."},
    {"question":"Trebam li kupiti sredstvo za čišćenje?","answer":"Preporučujemo originalno Kärcher sredstvo, koje možete zatražiti kod najma. Pri preuzimanju objasnimo doziranje i što je uključeno."},
    {"question":"Koliko se brzo suši nakon čišćenja?","answer":"Tekstil se obično osuši za 2 do 4 sata uz dobru ventilaciju. Puzzi izvlači većinu vlage, pa je sušenje puno brže nego kod ručnog pranja."},
    {"question":"Je li teško za korištenje?","answer":"Ne. Uz najam dobivate upute, a osnovno rukovanje nauči se u par minuta. Površinu prvo usišite običnim usisavačem, a zatim radite polako, u ravnim potezima."},
    {"question":"Koja je razlika između Puzzi 10/1 i 8/1?","answer":"Razlika je u veličini. Model 10/1, koji iznajmljujemo, ima spremnik za svježu vodu od 10 litara, a 8/1 manji, pa s 10/1 rjeđe prekidate posao radi dolijevanja i pražnjenja."},
    {"question":"Treba li polog?","answer":"Da. Polog se vraća u cijelosti nakon povrata opreme u ispravnom stanju. Iznos je naveden na ovoj stranici, uz cijenu najma."},
    {"question":"Mogu li dobiti dostavu?","answer":"Da. Dostavljamo na području Zagreba i okolice, a cijena dostave navedena je na ovoj stranici. Izvan Zagreba cijena dostave je na upit. Stroj možete i osobno preuzeti na Naserovom trgu 4 u Zagrebu."}
  ]'::jsonb,
  hero_image_alt = 'Kärcher Puzzi 10/1 usisavač za dubinsko čišćenje za najam u Zagrebu',
  image_alts = ARRAY(SELECT format('Kärcher Puzzi 10/1 za dubinsko čišćenje, fotografija %s', i) FROM generate_series(1, coalesce(array_length(images, 1), 0)) AS i),
  updated_at = now()
WHERE slug = 'karcher-puzzi-mokro-suhi-usisavac-najam';

-- ------------------------------------------------------------
-- 2) Pivski set u ratan izvedbi
-- ------------------------------------------------------------
UPDATE products SET
  name = 'Pivski set ratan: stol i 2 klupe za 8 osoba',
  short_desc = 'Sklopivi pivski set u ratan izvedbi: stol i dvije klupe za do 8 osoba. Za vrtne zabave, rođendane, piknike i evente na otvorenom.',
  seo_title = 'Najam pivskog seta: stol i klupe za 8 osoba',
  seo_description = 'Iznajmite pivski set u ratan izvedbi u Zagrebu od {cijena} €/dan: sklopivi stol i 2 klupe za 8 osoba. Za vrtne zabave, rođendane, piknike i evente.',
  description = '<p>Trebate mjesta za sjedenje za vrtnu zabavu, rođendan ili roštilj s društvom? Ovaj sklopivi pivski set u ratan izvedbi čine stol i dvije klupe za do 8 osoba, po 4 na svakoj klupi. Izgleda urednije od klasičnog pivskog seta, a prevozi se i postavlja jednako lako.</p>
<h3>Što dobivate</h3>
<ul>
<li>Sklopivi stol i dvije sklopive klupe</li>
<li>Mjesta za do 8 osoba</li>
<li>Ratan izvedba otporna na vremenske uvjete i laka za održavanje</li>
</ul>
<h3>Za koje prilike</h3>
<p>Vrtne zabave, rođendani, roštilj s društvom, piknici, obiteljska okupljanja i manji eventi na otvorenom.</p>
<h3>Za veće društvo</h3>
<p>Za više od 8 osoba uzmite više setova. Količinu birate pri rezervaciji, a vidite i koliko je setova slobodno za vaše datume.</p>
<h3>Složite vrtnu zabavu</h3>
<p>Hlad i zaštitu od kiše daje <a href="/najam/paviljon-sator-3x3m-najam">paviljon 3x3 m</a>, a kad padne mrak <a href="/najam/blumfeldt-dark-wave-infracrvena-grijalica-najam">infracrvena grijalica</a>. Za piće tu su <a href="/najam/tocionik-za-pivu-5l-najam">točionik za pivo</a> i <a href="/najam/ledomat-aparat-za-led-najam">ledomat</a>, a za zabavu <a href="/najam/igre-na-otvorenom">igre na otvorenom</a> i <a href="/najam/jbl-zvucnici">JBL zvučnici</a>. Sve pogledajte u kategoriji <a href="/najam/oprema-za-evente">oprema za evente</a>.</p>',
  faq = '[
    {"question":"Koliko košta najam pivskog seta?","answer":"Najam pivskog seta u ratan izvedbi u Zagrebu kreće od {cijena} eura dnevno. Najam na 3 ili 7 dana povoljniji je po danu, a točnu cijenu za odabrane datume vidite u kalendaru na ovoj stranici."},
    {"question":"Za koliko osoba je set?","answer":"Stol s dvije klupe udobno prima do 8 osoba, po 4 na svakoj klupi."},
    {"question":"Po čemu se razlikuje od klasičnog pivskog seta?","answer":"Princip je isti: sklopivi stol i dvije klupe. Razlika je u ratan izvedbi, koja izgleda urednije na vrtnim zabavama i eventima."},
    {"question":"Mogu li iznajmiti više setova?","answer":"Da. Količinu birate pri rezervaciji, a vidite i koliko je setova slobodno za vaše datume."},
    {"question":"Je li set sklopiv?","answer":"Da. Stol i klupe su sklopivi i prijenosni, što olakšava prijevoz i postavljanje na bilo kojoj lokaciji."},
    {"question":"Može li se koristiti na otvorenom?","answer":"Da. Set je namijenjen vanjskoj upotrebi u vrtovima, na terasama, u parkovima i na event prostorima. Ratan izvedba otporna je na vremenske uvjete i laka za održavanje."},
    {"question":"Mogu li dobiti dostavu?","answer":"Da. Dostavljamo na području Zagreba i okolice, a cijena dostave navedena je na ovoj stranici. Izvan Zagreba cijena dostave je na upit. Set možete i osobno preuzeti na Naserovom trgu 4 u Zagrebu."}
  ]'::jsonb,
  hero_image_alt = 'Pivski set od ratana, sklopivi stol i dvije klupe za najam u Zagrebu',
  image_alts = ARRAY(SELECT format('Pivski set ratan za najam, fotografija %s', i) FROM generate_series(1, coalesce(array_length(images, 1), 0)) AS i),
  updated_at = now()
WHERE slug = 'prijenosni-ratan-stol-klupe-8-osoba-najam';

-- ------------------------------------------------------------
-- 3) Internal links to and from the set
-- ------------------------------------------------------------
DELETE FROM product_relations
WHERE type = 'connected'
  AND product_id = (SELECT id FROM products WHERE slug = 'prijenosni-ratan-stol-klupe-8-osoba-najam');

INSERT INTO product_relations (product_id, related_id, type, sort_order)
SELECT p.id, r.id, 'connected', v.ord
FROM (VALUES
  ('prijenosni-ratan-stol-klupe-8-osoba-najam', 'paviljon-sator-3x3m-najam', 0),
  ('prijenosni-ratan-stol-klupe-8-osoba-najam', 'blumfeldt-dark-wave-infracrvena-grijalica-najam', 1),
  ('prijenosni-ratan-stol-klupe-8-osoba-najam', 'tocionik-za-pivu-5l-najam', 2),
  ('prijenosni-ratan-stol-klupe-8-osoba-najam', 'cornhole-igra-najam', 3),
  ('paviljon-sator-3x3m-najam', 'prijenosni-ratan-stol-klupe-8-osoba-najam', 0),
  ('blumfeldt-dark-wave-infracrvena-grijalica-najam', 'prijenosni-ratan-stol-klupe-8-osoba-najam', 0)
) AS v(src, dst, ord)
JOIN products p ON p.slug = v.src
JOIN products r ON r.slug = v.dst
ON CONFLICT (product_id, related_id, type) DO UPDATE SET sort_order = EXCLUDED.sort_order;

UPDATE categories
SET seo_text = replace(seo_text, '>ratan stol s dvije klupe</a>', '>pivski set u ratan izvedbi</a>')
WHERE slug = 'oprema-za-evente';

COMMIT;

-- Verify:
--   SELECT slug, name, seo_title, length(description), jsonb_array_length(faq)
--   FROM products
--   WHERE slug IN ('karcher-puzzi-mokro-suhi-usisavac-najam', 'prijenosni-ratan-stol-klupe-8-osoba-najam');
