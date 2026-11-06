-- Tents need no deposit, and the Insta360 X5 box contents are listed.
-- Owner, 2026-11-06: no deposit for tents. The X5 box holds the camera, a selfie
-- stick, two batteries and a charger for both.
-- Phrases are replaced in place, so a re-run changes nothing and admin edits are kept.

-- Tents: the deposit was switched on with an amount of 0 €, so the site never showed it.
UPDATE products SET
  requires_deposit = false,
  deposit_note = NULL
WHERE slug IN (
    'sator-za-3-osobe-kampiranje-najam',
    'sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam',
    'sator-arpenaz-41-4-osobe-najam'
  )
  AND coalesce(deposit_amount, 0) = 0;

UPDATE products SET
  faq = replace(replace(
    faq::text,
    '"Da. Vraća se u cijelosti ako je šator vraćen čist i suh."',
    '"Ne. Šator samo vratite čist i suh."'),
    '"question": "Polog?"',
    '"question": "Treba li polog?"')::jsonb
WHERE slug = 'sator-za-3-osobe-kampiranje-najam';

-- Blog: tent rental guide
UPDATE blog_posts SET
  content = replace(
    content,
    '<p>Kod preuzimanja se ostavlja polog, koji se vraća u cijelosti kad opremu vratite u ispravnom stanju. Šator prije',
    '<p>Šator prije'),
  seo_description = replace(
    seo_description,
    'Dostava po gradu, polog se vraća u cijelosti.',
    'Dostava u Zagrebu i okolici, bez pologa.'),
  faq = replace(
    faq::text,
    'Da, kod preuzimanja se ostavlja polog koji se vraća u cijelosti nakon povrata opreme u ispravnom stanju.',
    'Ne, za najam šatora polog se ne ostavlja.')::jsonb
WHERE slug = 'najam-satora-zagreb';

-- Insta360 X5: what comes in the box
UPDATE products SET
  faq = jsonb_insert(
    faq,
    '{1}',
    jsonb_build_object(
      'question', 'Što dolazi u paketu pri najmu?',
      'answer', 'U kutiji dobivate kameru, selfie štap, dvije baterije i punjač za obje baterije.'))
WHERE slug = 'insta360-x5-360-kamera-najam'
  AND jsonb_typeof(faq) = 'array'
  AND faq::text NOT LIKE '%Što dolazi u paketu%';

UPDATE products SET
  faq = replace(replace(
    faq::text,
    'U 8K modu očekujte oko 80 minuta snimanja."',
    'U 8K modu očekujte oko 80 minuta snimanja. U paketu su dvije baterije i punjač za obje, pa jedna može biti na punjenju dok snimate drugom."'),
    'snimke iz trećeg lica bez drona."',
    'snimke iz trećeg lica bez drona. Selfie štap dobivate u paketu."')::jsonb
WHERE slug = 'insta360-x5-360-kamera-najam';

-- Blog: ski checklist (still a draft)
UPDATE blog_posts SET
  content = replace(
    content,
    'Uz Insta360 X5 u kutiji dobivate selfie štap i dvije baterije.',
    'Uz Insta360 X5 u kutiji dobivate selfie štap, dvije baterije i punjač za obje.'),
  faq = replace(
    faq::text,
    'Uz Insta360 X5 kod nas dobivate dvije baterije."',
    'Uz Insta360 X5 kod nas dobivate dvije baterije i punjač za obje."')::jsonb
WHERE slug = 'sto-ponijeti-na-skijanje';
