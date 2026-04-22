import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Secret key client — server-side only, never expose to browser
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
