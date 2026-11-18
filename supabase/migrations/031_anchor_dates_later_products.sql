-- Anchor prices for the 8 products migration 030 left out.
-- Owner, 2026-11-18: their prices have not changed since they were listed, and
-- a product added after the reference date is dated the day its photos were
-- added (first upload to storage, Europe/Zagreb).
-- Šator Arpenaz 4.1 got its photos on 09.09.2026, before the reference date,
-- so it carries the reference date like the other products.

UPDATE products p SET
  anchor_price_per_day   = p.price_per_day,
  anchor_price_per_3days = p.price_per_3days,
  anchor_price_per_7days = p.price_per_7days,
  anchor_price_date      = v.anchor_date
FROM (VALUES
  ('sator-arpenaz-41-4-osobe-najam',                           DATE '2026-09-10'),
  ('aparat-za-kokice-s-kolicima-vevor-najam',                  DATE '2026-10-26'),
  ('epson-eb-fh52-profesionalni-projektor-najam',              DATE '2026-10-26'),
  ('veliko-projekcijsko-platno-stalak-211x160-100-inca-najam', DATE '2026-10-26'),
  ('benq-th575i-kino-projektor-google-tv-najam',               DATE '2026-10-30'),
  ('prijenosni-hladnjak-50l-kompresorski-najam',               DATE '2026-10-30'),
  ('projekcijsko-platno-tronozac-172x172-najam',               DATE '2026-10-30'),
  ('tilta-hydra-alien-mini-auto-nosac-kamere-najam',           DATE '2026-10-30')
) AS v(slug, anchor_date)
WHERE p.slug = v.slug
  AND p.anchor_price_date IS NULL;
