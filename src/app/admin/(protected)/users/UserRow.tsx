"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  user: { id: string; full_name: string; role: string; is_active: boolean };
  email: string;
  roleInfo: { label: string; className: string };
  createdAt: string;
}

export default function UserRow({ user, email, roleInfo, createdAt }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [toggling, setToggling] = useState(false);

  async function toggleActive() {
    setToggling(true);
    await supabase
      .from("admin_users")
      .update({ is_active: !user.is_active })
      .eq("id", user.id);
    router.refresh();
    setToggling(false);
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900">{user.full_name}</p>
        <p className="text-xs text-gray-400">{email}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleInfo.className}`}>
          {roleInfo.label}
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">{createdAt}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-medium ${user.is_active ? "text-green-600" : "text-gray-400"}`}>
          {user.is_active ? "Aktivan" : "Neaktivan"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={toggleActive}
          disabled={toggling}
          className="text-xs text-brand-primary hover:underline disabled:opacity-50"
        >
          {user.is_active ? "Deaktiviraj" : "Aktiviraj"}
        </button>
      </td>
    </tr>
  );
}
