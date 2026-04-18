import { createClient } from "@/lib/supabase/server";

export type AdminRole = "owner" | "manager" | "editor";

export class NotAuthorizedError extends Error {
  constructor(message = "Not authorized") {
    super(message);
    this.name = "NotAuthorizedError";
  }
}

/**
 * Resolve the caller's admin_users row for use in a server action or route handler.
 * Throws NotAuthorizedError if the caller is not a signed-in, active admin with
 * one of the allowed roles.
 */
export async function requireAdmin(allowed: AdminRole[] = ["owner", "manager", "editor"]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new NotAuthorizedError();

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, full_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminUser || adminUser.is_active === false) throw new NotAuthorizedError();
  if (!allowed.includes(adminUser.role as AdminRole)) throw new NotAuthorizedError();

  return { supabase, user, admin: adminUser };
}
