-- ============================================================
-- rentanje.com — Tighten RLS so only active admin_users can mutate
-- Replaces the 001 "authenticated can do everything" policies.
-- ============================================================

-- Helper: returns the caller's admin role, or NULL if they are not a
-- registered admin. SECURITY DEFINER so policy evaluation is not caught
-- in an RLS loop when reading admin_users from inside an admin_users policy.
CREATE OR REPLACE FUNCTION public.current_admin_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM admin_users
  WHERE id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.current_admin_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_admin_role() TO authenticated;

-- Drop the old over-permissive policies.
DROP POLICY IF EXISTS "admin_all_products"       ON products;
DROP POLICY IF EXISTS "admin_all_categories"     ON categories;
DROP POLICY IF EXISTS "admin_all_tags"           ON tags;
DROP POLICY IF EXISTS "admin_all_product_tags"   ON product_tags;
DROP POLICY IF EXISTS "admin_all_product_rel"    ON product_relations;
DROP POLICY IF EXISTS "admin_all_bundles"        ON bundles;
DROP POLICY IF EXISTS "admin_all_bundle_prod"    ON bundle_products;
DROP POLICY IF EXISTS "admin_all_promotions"     ON promotions;
DROP POLICY IF EXISTS "admin_all_availability"   ON availability;
DROP POLICY IF EXISTS "admin_all_inquiries"      ON inquiries;
DROP POLICY IF EXISTS "admin_all_testimonials"   ON testimonials;
DROP POLICY IF EXISTS "admin_all_blog"           ON blog_posts;
DROP POLICY IF EXISTS "admin_all_seo_pages"      ON seo_pages;
DROP POLICY IF EXISTS "admin_all_settings"       ON settings;

-- Content tables: owner + manager may mutate; editor may mutate content
-- (products, blog, seo_pages, testimonials, bundles, tags, categories,
-- product_tags, product_relations, availability, bundle_products).
-- promotions + settings are restricted to owner/manager.
-- inquiries are read-only for editor (they contain customer PII),
-- writable by owner/manager only.

-- products
CREATE POLICY "admin_rw_products" ON products
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- categories
CREATE POLICY "admin_rw_categories" ON categories
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- tags
CREATE POLICY "admin_rw_tags" ON tags
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- product_tags
CREATE POLICY "admin_rw_product_tags" ON product_tags
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- product_relations
CREATE POLICY "admin_rw_product_relations" ON product_relations
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- bundles
CREATE POLICY "admin_rw_bundles" ON bundles
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- bundle_products
CREATE POLICY "admin_rw_bundle_products" ON bundle_products
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- availability
CREATE POLICY "admin_rw_availability" ON availability
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- testimonials
CREATE POLICY "admin_rw_testimonials" ON testimonials
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- blog_posts
CREATE POLICY "admin_rw_blog" ON blog_posts
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- seo_pages
CREATE POLICY "admin_rw_seo_pages" ON seo_pages
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager','editor'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager','editor'));

-- promotions: owner + manager only (controls pricing/discounts)
CREATE POLICY "admin_rw_promotions" ON promotions
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager'));

-- settings: owner + manager only
CREATE POLICY "admin_rw_settings" ON settings
  FOR ALL TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager'));

-- inquiries: editor read only; owner + manager read/write.
CREATE POLICY "admin_read_inquiries" ON inquiries
  FOR SELECT TO authenticated
  USING (public.current_admin_role() IN ('owner','manager','editor'));

CREATE POLICY "admin_write_inquiries" ON inquiries
  FOR INSERT TO authenticated
  WITH CHECK (public.current_admin_role() IN ('owner','manager'));

CREATE POLICY "admin_update_inquiries" ON inquiries
  FOR UPDATE TO authenticated
  USING       (public.current_admin_role() IN ('owner','manager'))
  WITH CHECK  (public.current_admin_role() IN ('owner','manager'));

CREATE POLICY "admin_delete_inquiries" ON inquiries
  FOR DELETE TO authenticated
  USING (public.current_admin_role() IN ('owner','manager'));

-- Note: the public inquiry submission form uses the service-role client
-- in /api/inquiry, which bypasses RLS — anonymous users never get a
-- direct INSERT policy on this table.
