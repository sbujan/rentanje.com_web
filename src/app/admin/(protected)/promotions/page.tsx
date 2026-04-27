import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";

function statusOf(p: {
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  usage_limit: number | null;
  usage_count: number;
}) {
  const now = Date.now();
  if (!p.is_active) return { label: "Neaktivno", className: "text-gray-400" };
  if (p.starts_at && new Date(p.starts_at).getTime() > now)
    return { label: "Najavljeno", className: "text-blue-600" };
  if (p.ends_at && new Date(p.ends_at).getTime() < now)
    return { label: "Isteklo", className: "text-red-500" };
  if (p.usage_limit !== null && p.usage_count >= p.usage_limit)
    return { label: "Iskorišteno", className: "text-gray-400" };
  return { label: "Aktivno", className: "text-green-600" };
}

export default async function AdminPromotionsPage() {
  const supabase = await createClient();

  const { data: promos } = await supabase
    .from("promotions")
    .select("id, name, code, discount_type, discount_value, is_active, starts_at, ends_at, usage_count, usage_limit")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Promocije</h1>
        <Link
          href="/admin/promotions/new"
          className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Nova promocija
        </Link>
      </div>

      {!promos || promos.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center text-gray-400">
          <p className="mb-4">Još nema promocija.</p>
          <Link href="/admin/promotions/new" className="text-brand-primary underline text-sm">
            Stvori prvu promociju
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Naziv</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Kod</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Popust</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Vrijedi do</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {promos.map((p) => {
                const status = statusOf(p);
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 line-clamp-1">{p.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {p.code ? (
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{p.code}</code>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">
                      {p.discount_type === "percent"
                        ? `${p.discount_value ?? 0}%`
                        : p.discount_type === "fixed"
                          ? `${p.discount_value ?? 0} €`
                          : "1 dan"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">
                      {p.ends_at ? format(new Date(p.ends_at), "d. MMM yyyy", { locale: hr }) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-medium ${status.className}`}>
                        {p.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/promotions/${p.id}`}
                        className="inline-flex items-center gap-1 text-brand-primary text-xs font-medium hover:underline"
                      >
                        <Pencil className="h-3 w-3" /> Uredi
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
