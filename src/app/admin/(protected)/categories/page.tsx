import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-text">
          Kategorije
        </h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="h-4 w-4" />
            Nova kategorija
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {!categories?.length ? (
          <div className="p-8 text-center text-brand-muted">
            Nema kategorija. Dodajte prvu!
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-brand-muted">
                  Naziv
                </th>
                <th className="px-4 py-3 text-left font-medium text-brand-muted">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-medium text-brand-muted">
                  Boja
                </th>
                <th className="px-4 py-3 text-left font-medium text-brand-muted">
                  Redosljed
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand-text">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3 text-brand-muted font-mono text-xs">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3">
                    {cat.color ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full inline-block border border-gray-200"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-brand-muted font-mono text-xs">
                          {cat.color}
                        </span>
                      </span>
                    ) : (
                      <span className="text-brand-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-muted">
                    {cat.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/categories/${cat.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-3 w-3" />
                          Uredi
                        </Button>
                      </Link>
                      <DeleteCategoryButton id={cat.id} name={cat.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
