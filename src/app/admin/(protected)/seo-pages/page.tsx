import Link from "next/link";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSeoPagesPage() {
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from("seo_pages")
    .select("id, title, slug, is_published, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">SEO stranice</h1>
        <Link
          href="/admin/seo-pages/new"
          className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Nova stranica
        </Link>
      </div>

      {!pages || pages.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center text-gray-400">
          <p className="mb-4">Još nema SEO stranica.</p>
          <Link href="/admin/seo-pages/new" className="text-brand-primary underline text-sm">
            Stvori prvu stranicu
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Naslov</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Ažurirano</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 line-clamp-1">{page.title}</p>
                    <p className="text-xs text-gray-400 font-mono">/stranica/{page.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">
                    {format(new Date(page.updated_at), "d. MMM yyyy", { locale: hr })}
                  </td>
                  <td className="px-4 py-3">
                    {page.is_published ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <Eye className="h-3.5 w-3.5" /> Objavljeno
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <EyeOff className="h-3.5 w-3.5" /> Skica
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/seo-pages/${page.id}`}
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
