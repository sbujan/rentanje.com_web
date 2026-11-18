-- "Najam Kärcher" belongs to the brand hub /najam/karcher (in code), the way
-- the GoPro and JBL hubs own their brand terms. The Puzzi product page moves
-- to "najam dubinskog usisavača" so the two pages do not share one keyword,
-- and the pages that talk about Kärcher link to the hub.
-- Needs the hub to be live first: the links below point at it.

UPDATE products SET
  seo_title = 'Najam dubinskog usisavača Kärcher Puzzi 10/1',
  seo_description = 'Najam dubinskog usisavača u Zagrebu: Kärcher Puzzi 10/1 za {cijena} € na dan, {cijena3} € za 3 dana ili {cijena7} € za tjedan. Za kauč, tepih, madrac i auto.',
  seo_keywords = ARRAY[
    'najam dubinskog usisavača',
    'najam usisavača za dubinsko čišćenje',
    'najam stroja za dubinsko čišćenje',
    'najam ekstraktora za tepihe',
    'najam Kärcher Puzzi 10/1'
  ],
  faq = replace(
    faq::text,
    'Najam Kärcher Puzzi 10/1 u Zagrebu kreće od {cijena} eura dnevno. Najam na 3 ili 7 dana povoljniji je po danu, a točnu cijenu',
    'Najam Kärcher Puzzi 10/1 u Zagrebu stoji {cijena} € za jedan dan, {cijena3} € za 3 dana i {cijena7} € za 7 dana. Točnu cijenu')::jsonb
WHERE slug = 'karcher-puzzi-mokro-suhi-usisavac-najam';

UPDATE products SET
  description = replace(
    description,
    'Ostalu opremu pogledajte u kategoriji <a href="/najam/alati-ciscenje">',
    'Plan rada, najčešće greške i odgovore na pitanja prije najma naći ćete na stranici <a href="/najam/karcher">najam Kärcher</a>. Ostalu opremu pogledajte u kategoriji <a href="/najam/alati-ciscenje">')
WHERE slug = 'karcher-puzzi-mokro-suhi-usisavac-najam'
  AND description NOT LIKE '%href="/najam/karcher"%';

-- Blog posts: one link each to the hub, next to the links to the machine
UPDATE blog_posts SET
  content = replace(
    content,
    'a ne za jednu fotelju.',
    'a ne za jednu fotelju. Sve prije najma je na stranici <a href="/najam/karcher">najam Kärcher u Zagrebu</a>.')
WHERE slug = 'karcher-puzzi-10-1-kako-radi'
  AND content NOT LIKE '%href="/najam/karcher"%';

UPDATE blog_posts SET
  content = replace(
    content,
    'detaljan vodič kroz Kärcher Puzzi</a>.',
    'detaljan vodič kroz Kärcher Puzzi</a>. Plan rada i savjeti prije najma su na stranici <a href="/najam/karcher">najam Kärcher</a>.')
WHERE slug = 'dubinsko-ciscenje-kauca-tepiha-auta'
  AND content NOT LIKE '%href="/najam/karcher"%';
