import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, EyeOff, Star, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBundlesPage() {
  const supabase = await createClient();

  const { data: bundles } = await supabase
    .from("bundles")
    .select("id, name, slug, hero_image_url, discount_type, discount_value, is_active, is_featured")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Paketi</h1>
        <Link
          href="/admin/bundles/new"
          className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Novi paket
        </Link>
      </div>

      {!bundles || bundles.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center text-gray-400">
          <p className="mb-4">Još nema paketa.</p>
          <Link href="/admin/bundles/new" className="text-brand-primary underline text-sm">
            Stvori prvi paket
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Paket</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Popust</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bundles.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden">
                        {b.hero_image_url ? (
                          <Image src={b.hero_image_url} alt={b.name} fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="h-4 w-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-1 flex items-center gap-1.5">
                          {b.name}
                          {b.is_featured && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">/paketi/{b.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                    {b.discount_value
                      ? b.discount_type === "percent"
                        ? `${b.discount_value}%`
                        : `${b.discount_value} €`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {b.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <Eye className="h-3.5 w-3.5" /> Aktivno
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <EyeOff className="h-3.5 w-3.5" /> Neaktivno
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/bundles/${b.id}`}
                      className="inline-flex items-center gap-1 text-brand-primary text-xs font-medium hover:underline"
                    >
                      <Pencil className="h-3 w-3" /> Uredi
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
