-- Blog prices now match the product prices in the database.
--   Šator za 4 osobe s madracima: 50 € za 3 dana, 90 € za tjedan (blog said 60 and 100).
--   Šator za 3 osobe: 25 € za 3 dana, 45 € za tjedan, no daily rental (blog said 13 €/dan).
--   DJI Power 1000 Mini: 30 €/dan (blog said 29,97).
-- Phrases are replaced in place, so a re-run changes nothing and admin edits are kept.

-- Blog: tent rental guide
UPDATE blog_posts SET
  excerpt = replace(
    excerpt,
    'šator za 4 osobe od 60 € za vikend.',
    'šator za 4 osobe 50 € za 3 dana.'),
  seo_description = replace(
    seo_description,
    'Najam šatora u Zagrebu od 60 € za vikend - šator za 4 osobe s madracima i pumpom, paviljoni od 15 €.',
    'Najam šatora u Zagrebu od 25 € za 3 dana. Šator za 4 osobe s madracima i pumpom 50 €, paviljon od 15 €.'),
  content = replace(replace(
    content,
    'platite 60 € za vikend i vratite ga nama',
    'platite 50 € za tri dana i vratite ga nama'),
    'Kod nas isti komplet stoji 60 € za vikend: kampirate li dva vikenda godišnje, trošite 120 €',
    'Kod nas isti komplet stoji 50 € za tri dana: kampirate li dva vikenda godišnje, trošite 100 €'),
  faq = replace(replace(
    faq::text,
    'stoji 60 € za 3 dana ili 100 € za tjedan dana.',
    'stoji 50 € za 3 dana ili 90 € za tjedan dana. Šator za 3 osobe s madracem i pumpom stoji 25 € za 3 dana ili 45 € za tjedan.'),
    'Cijena od 60 € pokriva cijeli taj period',
    'Cijena od 50 € pokriva cijeli taj period')::jsonb
WHERE slug = 'najam-satora-zagreb';

-- Blog: camping checklist
UPDATE blog_posts SET
  seo_description = replace(
    seo_description,
    'za najam u Zagrebu, od 13 €/dan.',
    'za najam u Zagrebu, od 25 € za 3 dana.'),
  content = replace(replace(replace(
    content,
    'dolazi s madracem na napuhavanje i pumpom, već od 13 eura na dan.',
    'dolazi s madracem na napuhavanje i pumpom, već za 25 eura na tri dana.'),
    'dva zračna madraca i električnom pumpom, od 17 eura na dan.',
    'dva zračna madraca i električnom pumpom, za 50 eura na tri dana.'),
    'Iznajmljuje se od 29,97 eura na dan.',
    'Iznajmljuje se od 30 eura na dan.'),
  faq = replace(replace(
    faq::text,
    'Najam šatora počinje već od 13 eura na dan, što',
    'Najam šatora počinje već od 25 eura za tri dana, što'),
    'Najam šatora u Zagrebu na rentanje.com počinje od 13 eura na dan za šator za 3 osobe, koji uključuje madrac na napuhavanje i pumpu. Šator za 4 osobe s dva madraca i električnom pumpom dostupan je od 17 eura na dan.',
    'Na rentanje.com šator za 3 osobe s madracem na napuhavanje i pumpom stoji 25 eura za tri dana ili 45 eura za tjedan. Šator za 4 osobe s dva madraca i električnom pumpom stoji 50 eura za tri dana ili 90 eura za tjedan.')::jsonb
WHERE slug = 'sto-ponijeti-na-kampiranje';
