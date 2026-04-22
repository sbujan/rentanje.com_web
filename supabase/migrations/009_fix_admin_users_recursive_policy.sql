-- ============================================================
-- rentanje.com — Fix recursive RLS policy on admin_users
-- ============================================================
-- The original "owner_all_admin_users" policy queried admin_users
-- from inside a policy on admin_users, causing Postgres to raise
-- "infinite recursion detected in policy for relation admin_users".
-- That broke every admin page load because the (protected) layout
-- must SELECT the caller's own admin_users row.
--
-- Replace it with a policy that delegates to current_admin_role()
-- (SECURITY DEFINER, defined in migration 007), which bypasses RLS
-- when resolving the caller's role.
-- ============================================================

DROP POLICY IF EXISTS "owner_all_admin_users" ON admin_users;

CREATE POLICY "owner_manage_admin_users"
  ON admin_users FOR ALL
  TO authenticated
  USING       (public.current_admin_role() = 'owner')
  WITH CHECK  (public.current_admin_role() = 'owner');
