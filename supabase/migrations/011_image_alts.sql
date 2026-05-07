-- ============================================================
-- rentanje.com — Image alt-text columns for SEO
-- ============================================================
-- Stores per-image alt text alongside the existing image URL
-- arrays so admins can hand-write descriptive captions that
-- (a) accessibility tools read aloud, and (b) Google/Bing/LLM
-- crawlers use as the primary signal for what the image shows.
--
-- Filenames are also being moved to a slug-based pattern
-- (vespa-px-150-{nonce}.jpg) at upload time — see ImageUpload.tsx.
-- That gives a secondary signal; alt text remains the dominant one.
-- ============================================================

alter table products
  add column if not exists hero_image_alt text,
  add column if not exists image_alts text[];

comment on column products.hero_image_alt is
  'Alt text for hero_image_url. Falls back to product name when null.';
comment on column products.image_alts is
  'Per-index alt text aligned with images[]. NULL or short array means fall back to product name + index.';
