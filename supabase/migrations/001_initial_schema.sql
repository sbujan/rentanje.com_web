-- ============================================================
-- rentanje.com — Initial Database Schema
-- Run in Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- TABLES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  text NOT NULL,
  role       text DEFAULT 'editor' CHECK (role IN ('owner', 'manager', 'editor')),
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  icon_url        text,
  color           text,
  sort_order      integer DEFAULT 0,
  seo_title       text,
  seo_description text,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
  id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name  text NOT NULL,
  slug  text UNIQUE NOT NULL,
  color text
);

CREATE TABLE IF NOT EXISTS products (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id      uuid REFERENCES categories(id) ON DELETE SET NULL,
  name             text NOT NULL,
  slug             text UNIQUE NOT NULL,
  short_desc       text,
  description      text,
  hero_image_url   text,
  images           text[],
  price_per_day    numeric(10,2),
  price_per_3days  numeric(10,2),
  price_per_7days  numeric(10,2) NOT NULL,
  min_rental_days  integer DEFAULT 1 CHECK (min_rental_days IN (1, 3, 7)),
  requires_deposit boolean DEFAULT false,
  deposit_amount   numeric(10,2),
  deposit_note     text,
  is_available     boolean DEFAULT true,
  is_featured      boolean DEFAULT false,
  is_active        boolean DEFAULT true,
  stock_qty        integer DEFAULT 1,
  weight_kg        numeric(6,2),
  dimensions_cm    text,
  seo_title        text,
  seo_description  text,
  seo_keywords     text[],
  schema_json      jsonb,
  view_count       integer DEFAULT 0,
  inquiry_count    integer DEFAULT 0,
  sort_order       integer DEFAULT 0,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_tags (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  tag_id     uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE TABLE IF NOT EXISTS product_relations (
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  related_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  type        text CHECK (type IN ('connected', 'suggested')),
  sort_order  integer DEFAULT 0,
  PRIMARY KEY (product_id, related_id, type)
);

CREATE TABLE IF NOT EXISTS bundles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  hero_image_url  text,
  discount_type   text CHECK (discount_type IN ('percent', 'fixed')),
  discount_value  numeric(10,2),
  is_active       boolean DEFAULT true,
  is_featured     boolean DEFAULT false,
  seo_title       text,
  seo_description text,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundle_products (
  bundle_id  uuid REFERENCES bundles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  qty        integer DEFAULT 1,
  PRIMARY KEY (bundle_id, product_id)
);

CREATE TABLE IF NOT EXISTS promotions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  code           text UNIQUE,
  discount_type  text CHECK (discount_type IN ('percent', 'fixed', 'free_day')),
  discount_value numeric(10,2),
  applies_to     text CHECK (applies_to IN ('all', 'category', 'product', 'bundle')),
  applies_to_id  uuid,
  min_days       integer,
  starts_at      timestamptz,
  ends_at        timestamptz,
  usage_limit    integer,
  usage_count    integer DEFAULT 0,
  is_active      boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS availability (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  date        date NOT NULL,
  qty_booked  integer DEFAULT 0,
  note        text,
  UNIQUE(product_id, date)
);

CREATE TABLE IF NOT EXISTS inquiries (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_number          text UNIQUE NOT NULL,
  status                  text DEFAULT 'new' CHECK (status IN ('new','read','replied','confirmed','cancelled')),
  customer_name           text NOT NULL,
  customer_email          text NOT NULL,
  customer_phone          text,
  company_name            text,
  company_oib             text,
  company_address         text,
  needs_r1_invoice        boolean DEFAULT false,
  delivery_type           text DEFAULT 'pickup' CHECK (delivery_type IN ('pickup', 'delivery')),
  delivery_address        text,
  delivery_fee            numeric(10,2) DEFAULT 0,
  rental_start            date,
  rental_end              date,
  message                 text,
  accepted_liability_terms boolean DEFAULT false,
  promo_code              text,
  discount_amount         numeric(10,2) DEFAULT 0,
  subtotal_estimate       numeric(10,2),
  total_estimate          numeric(10,2),
  items                   jsonb NOT NULL,
  source_url              text,
  utm_source              text,
  utm_medium              text,
  utm_campaign            text,
  created_at              timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  content     text NOT NULL,
  rating      integer DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active   boolean DEFAULT true,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,
  excerpt         text,
  content         text,
  hero_image_url  text,
  author          text DEFAULT 'Rentanje tim',
  category_id     uuid REFERENCES categories(id) ON DELETE SET NULL,
  tags            text[],
  is_published    boolean DEFAULT false,
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  seo_keywords    text[],
  reading_time    integer,
  view_count      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_pages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,
  content         text,
  hero_image_url  text,
  is_published    boolean DEFAULT false,
  seo_title       text,
  seo_description text,
  seo_keywords    text[],
  schema_json     jsonb,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key   text PRIMARY KEY,
  value jsonb
);

-- ────────────────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_slug         ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category     ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active       ON products(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_slug             ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published        ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_availability          ON availability(product_id, date);
CREATE INDEX IF NOT EXISTS idx_inquiries_status      ON inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_pages_slug        ON seo_pages(slug);

-- ────────────────────────────────────────────────────────────
-- updated_at TRIGGER
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER seo_pages_updated_at
  BEFORE UPDATE ON seo_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability   ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users    ENABLE ROW LEVEL SECURITY;

-- Public read (active/published content)
CREATE POLICY "public_read_products"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "public_read_categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "public_read_tags"
  ON tags FOR SELECT USING (true);

CREATE POLICY "public_read_product_tags"
  ON product_tags FOR SELECT USING (true);

CREATE POLICY "public_read_product_relations"
  ON product_relations FOR SELECT USING (true);

CREATE POLICY "public_read_bundles"
  ON bundles FOR SELECT USING (is_active = true);

CREATE POLICY "public_read_bundle_products"
  ON bundle_products FOR SELECT USING (true);

CREATE POLICY "public_read_testimonials"
  ON testimonials FOR SELECT USING (is_active = true);

CREATE POLICY "public_read_blog"
  ON blog_posts FOR SELECT USING (is_published = true);

CREATE POLICY "public_read_seo_pages"
  ON seo_pages FOR SELECT USING (is_published = true);

CREATE POLICY "public_read_settings"
  ON settings FOR SELECT USING (true);

-- Admin full access (authenticated users)
CREATE POLICY "admin_all_products"       ON products       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_categories"     ON categories     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_tags"           ON tags           FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_product_tags"   ON product_tags   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_product_rel"    ON product_relations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_bundles"        ON bundles        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_bundle_prod"    ON bundle_products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_promotions"     ON promotions     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_availability"   ON availability   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_inquiries"      ON inquiries      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_testimonials"   ON testimonials   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_blog"           ON blog_posts     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_seo_pages"      ON seo_pages      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_settings"       ON settings       FOR ALL USING (auth.role() = 'authenticated');

-- Admin users: self-read, owner-manage
CREATE POLICY "admin_self_read"
  ON admin_users FOR SELECT USING (id = auth.uid());

CREATE POLICY "owner_all_admin_users"
  ON admin_users FOR ALL USING (
    (SELECT role FROM admin_users WHERE id = auth.uid()) = 'owner'
  );

-- ────────────────────────────────────────────────────────────
-- SEED: Categories
-- ────────────────────────────────────────────────────────────

INSERT INTO categories (name, slug, color, sort_order) VALUES
  ('Audio i video oprema',       'audio-video-oprema',  '#6366F1', 1),
  ('Oprema za evente i zabavu',  'oprema-za-evente',    '#F05554', 2),
  ('Oprema za roštilj i kuhanje','rostilj-kuhanje',     '#F97316', 3),
  ('Kamp i outdoor oprema',      'kamp-outdoor',        '#22C55E', 4),
  ('Alati i oprema za čišćenje', 'alati-ciscenje',      '#EAB308', 5),
  ('Ostalo',                     'ostalo',              '#8B5CF6', 6)
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- SEED: Default settings
-- ────────────────────────────────────────────────────────────

INSERT INTO settings (key, value) VALUES
  ('site_name',           '"rentanje.com"'),
  ('contact_email',       '"info@rentanje.com"'),
  ('contact_phone',       '"+385952044414"'),
  ('delivery_fee_zagreb', '10'),
  ('announcement_bar',    'null')
ON CONFLICT (key) DO NOTHING;
