import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  role: z.enum(["manager", "editor"]),
});

export async function POST(req: NextRequest) {
  // Verify caller is an authenticated owner
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminUser?.role !== "owner") {
    return NextResponse.json({ error: "Only owners can invite users" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 422 });

  const { email, full_name, role } = parsed.data;
  const admin = createAdminClient();

  // Create auth user and send invite email
  const { data: invited, error: authErr } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/login`,
  });

  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 });

  // Insert into admin_users
  const { error: dbErr } = await admin.from("admin_users").insert({
    id: invited.user.id,
    full_name,
    role,
    is_active: true,
  });

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
