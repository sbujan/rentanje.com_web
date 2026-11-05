-- Removes every em and en dash from product and bundle copy, and fixes outdated
-- text in two blog posts (delivery is 20 euros, the portable fridge is available).
--
-- Dash rules, in order:
--   1. A dash between digits is a range and becomes a hyphen.
--   2. Any other dash becomes the marker ~~, so this file holds no dash characters.
--   3. The phrases listed below get a colon, a new sentence or a lowercase word.
--   4. Every remaining marker becomes a comma.
-- Phrases are replaced in place, so edits made in admin before this runs are kept.

CREATE OR REPLACE FUNCTION public._migration_026_undash(t text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $fn$
DECLARE
  r record;
  result text := t;
BEGIN
  IF t IS NULL THEN
    RETURN NULL;
  END IF;

  result := regexp_replace(result, '(\d)\s*[' || chr(8211) || chr(8212) || ']\s*(\d)', '\1-\2', 'g');
  result := regexp_replace(result, '\s*[' || chr(8211) || chr(8212) || ']\s*', ' ~~ ', 'g');

  FOR r IN
    SELECT * FROM (VALUES
      -- Names: the second part stays lowercase
      (' ~~ Plinski plamenik', ', plinski plamenik'),
      (' ~~ Moderna igra boćanja', ', moderna igra boćanja'),
      (' ~~ Drvena igra', ', drvena igra'),
      (' ~~ Selfie dron', ', selfie dron'),
      (' ~~ Crveni', ', crveni'),
      (' ~~ Plavi', ', plavi'),
      (' ~~ Za karaoke i evente', ', za karaoke i evente'),
      (' ~~ Hibridna instant kamera', ', hibridna instant kamera'),
      (' ~~ Šator za 4 osobe', ', šator za 4 osobe'),
      (' ~~ Timska igra koordinacije', ', timska igra koordinacije'),
      (' ~~ Aparat za soft-serve sladoled', ', aparat za soft-serve sladoled'),
      (' ~~ Igra bacanja prstenova', ', igra bacanja prstenova'),
      (' ~~ Luk i strijela za zabavu', ', luk i strijela za zabavu'),
      (' ~~ Auto nosač', ', auto nosač'),
      (' ~~ Kompaktni camping šator', ', kompaktni camping šator'),

      -- A list or an explanation follows: colon
      (' set ~~ mreža', ' set: mreža'),
      ('bilo gdje ~~ na', 'bilo gdje: na'),
      ('Plug & play ~~ spojite', 'Plug & play: spojite'),
      ('Iznimno jednostavno ~~ stavite', 'Iznimno jednostavno: stavite'),
      ('Slično boćanju ~~ bacaš', 'Slično boćanju: bacaš'),
      ('jako je jednostavan ~~ upalite', 'jako je jednostavan: upalite'),
      ('Jednostavan za korištenje ~~ samo', 'Jednostavan za korištenje: samo'),
      ('zvučni sustav ~~ dva JBL', 'zvučni sustav: dva JBL'),
      ('minuta ~~ napuhanac', 'minuta: napuhanac'),
      ('trgovina ~~ Heineken', 'trgovina: Heineken'),
      ('camping paket ~~ krenite', 'camping paket: krenite'),
      ('baklja za roštilj ~~ ugljen', 'baklja za roštilj: ugljen'),
      ('baklju za roštilj ~~ zapalite', 'baklju za roštilj: zapalite'),
      ('Palm takeoff ~~ polijeće', 'Palm takeoff: polijeće'),
      ('Ovisno o veličini mesa ~~ cijela', 'Ovisno o veličini mesa: cijela'),
      ('korporativni eventi ~~ kokice', 'korporativni eventi: kokice'),
      ('mobilnu upotrebu ~~ kampiranje', 'mobilnu upotrebu: kampiranje'),
      ('vrste pića ~~ koktele', 'vrste pića: koktele'),
      ('je kompaktan ~~ promjer', 'je kompaktan: promjer'),
      ('keramički roštilj ~~ roštiljanje', 'keramički roštilj: roštiljanje'),
      ('Mini u Zagrebu ~~ elektronička', 'Mini u Zagrebu: elektronička'),
      ('zagrijava odmah ~~ toplinu', 'zagrijava odmah: toplinu'),
      ('Za sve uzraste ~~ jednostavna', 'Za sve uzraste: jednostavna'),
      ('Instax Mini film ~~ male', 'Instax Mini film: male'),

      -- Two separate thoughts
      ('po svom izboru ~~ aparat', 'po svom izboru. Aparat'),
      ('nije problem ~~ preporučujemo', 'nije problem, ali preporučujemo'),
      ('duge kiše ~~ drvo', 'duge kiše. Drvo')
    ) AS v(old_text, new_text)
  LOOP
    result := replace(result, r.old_text, r.new_text);
  END LOOP;

  RETURN replace(result, ' ~~ ', ', ');
END;
$fn$;

-- Titles and meta for the fridge and Tilta, the two titles the rule would leave awkward.
UPDATE products SET
  seo_title = 'Najam prijenosnog hladnjaka 50 L od {cijena} €/dan',
  seo_description = 'Iznajmite kompresorski prijenosni hladnjak 50 L u Zagrebu od {cijena} €/dan. Hladi do -20 °C, radi na 12 V u autu i 230 V. Za kampiranje, festivale i evente.',
  description = replace(
    description,
    '/najam/sator-arpenaz-41-fresh-black-4-osobe-najam',
    '/najam/sator-arpenaz-41-4-osobe-najam'
  )
WHERE slug = 'prijenosni-hladnjak-50l-kompresorski-najam';

UPDATE products SET
  seo_title = 'Najam Tilta Hydra Alien Mini auto nosača za kameru'
WHERE slug = 'tilta-hydra-alien-mini-auto-nosac-kamere-najam';

UPDATE products SET
  name = public._migration_026_undash(name),
  short_desc = public._migration_026_undash(short_desc),
  description = public._migration_026_undash(description),
  seo_title = public._migration_026_undash(seo_title),
  seo_description = public._migration_026_undash(seo_description),
  faq = public._migration_026_undash(faq::text)::jsonb,
  schema_json = public._migration_026_undash(schema_json::text)::jsonb
WHERE concat_ws(' ', name, short_desc, description, seo_title, seo_description, faq::text, schema_json::text)
  ~ ('[' || chr(8211) || chr(8212) || ']');

UPDATE bundles SET
  name = public._migration_026_undash(name),
  description = public._migration_026_undash(description),
  seo_description = public._migration_026_undash(seo_description)
WHERE concat_ws(' ', name, description, seo_description) ~ ('[' || chr(8211) || chr(8212) || ']');

DROP FUNCTION public._migration_026_undash(text);

-- Blog: camping checklist
UPDATE blog_posts SET
  excerpt = replace(excerpt, 'struja u prirodi sve to', 'struja u prirodi: sve to'),
  content = replace(replace(replace(replace(replace(replace(
    content,
    'struja u prirodi &ndash; to su stvari',
    'struja u prirodi: to su stvari'),
    '<strong>Posuđe i pribor za jelo</strong> &ndash; tanjuri',
    '<strong>Posuđe i pribor za jelo</strong>: tanjuri'),
    '<strong>Prva pomoć i sredstvo protiv komaraca</strong> &ndash; mala torbica',
    '<strong>Prva pomoć i sredstvo protiv komaraca</strong>, mala torbica'),
    'dio kampiranja &ndash; šator, madraci, vatrište i struja &ndash; možete riješiti',
    'dio kampiranja (šator, madrace, vatrište i struju) možete riješiti'),
    'Hladnjak i prijenosno kuhalo zasad ponesite svoje, no uskoro će biti dostupni i za najam kod nas.',
    'Ako nemate svoje, kod nas možete iznajmiti <a href="/najam/plinski-plamenik-kampiranje-najam">plinski plamenik</a>, a za hranu i piće <a href="/najam/prijenosni-hladnjak-50l-kompresorski-najam">prijenosni hladnjak</a>.'),
    'ili vam je dostavljamo na adresu već od 10 eura',
    'ili vam je dostavljamo na adresu u Zagrebu i okolici za 20 eura'),
  faq = replace(replace(
    faq::text,
    'ili vam je dostavljamo na adresu već od 10 eura',
    'ili vam je dostavljamo na adresu u Zagrebu i okolici za 20 eura'),
    'Šator, vatrište, struja u prirodi sve to koristite par puta godišnje. Donosimo popis opreme za kampiranje i objašnjavamo što se isplati iznajmiti, a što ponijeti svoje.',
    'Što je obavezno ponijeti na kampiranje?')::jsonb
WHERE slug = 'sto-ponijeti-na-kampiranje';

-- Blog: Kärcher guide
UPDATE blog_posts SET
  content = replace(
    content,
    'a dostava po gradu stoji 10 €',
    'a dostava u Zagrebu i okolici stoji 20 €')
WHERE slug = 'karcher-puzzi-10-1-kako-radi';
