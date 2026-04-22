import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("full_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  // Authenticated but not a registered (or still active) admin → sign out and bounce.
  if (!adminUser || adminUser.is_active === false) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        userEmail={user.email ?? ""}
        userName={adminUser.full_name ?? "Admin"}
        userRole={adminUser.role ?? "editor"}
      />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
