import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { Shield } from "lucide-react";
import InviteUserForm from "./InviteUserForm";
import UserRow from "./UserRow";

const ROLE_LABELS = {
  owner: { label: "Vlasnik", className: "bg-red-100 text-red-700" },
  manager: { label: "Menadžer", className: "bg-blue-100 text-blue-700" },
  editor: { label: "Urednik", className: "bg-gray-100 text-gray-600" },
};

export default async function UsersPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: adminUsers } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at");

  // Get auth emails via service role
  const { data: authUsers } = await admin.auth.admin.listUsers();
  const emailMap = Object.fromEntries(
    (authUsers?.users ?? []).map((u) => [u.id, u.email ?? ""])
  );

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-6 w-6 text-brand-primary" />
        <h1 className="text-2xl font-bold text-white">Korisnici admina</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Korisnik</th>
                <th className="px-4 py-3 font-medium text-gray-500">Uloga</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Dodano</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(adminUsers ?? []).map((user) => {
                const roleInfo = ROLE_LABELS[user.role];
                return (
                  <UserRow
                    key={user.id}
                    user={user}
                    email={emailMap[user.id] ?? "–"}
                    roleInfo={roleInfo}
                    createdAt={format(new Date(user.created_at), "d. MMM yyyy", { locale: hr })}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-brand-text mb-4">Pozovi novog korisnika</h2>
        <InviteUserForm />
      </div>
    </div>
  );
}
