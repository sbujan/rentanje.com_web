import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import DeleteTagButton from "./DeleteTagButton";

export default async function TagsPage() {
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-brand-text">
          Oznake
        </h1>
        <Link href="/admin/tags/new">
          <Button>
            <Plus className="h-4 w-4" />
            Nova oznaka
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {!tags?.length ? (
          <div className="p-8 text-center text-brand-muted">
            Nema oznaka. Dodajte prvu!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
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
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: tag.color ?? "#6B7280" }}
                      >
                        {tag.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-muted font-mono text-xs">
                      {tag.slug}
                    </td>
                    <td className="px-4 py-3">
                      {tag.color ? (
                        <span className="text-brand-muted font-mono text-xs">
                          {tag.color}
                        </span>
                      ) : (
                        <span className="text-brand-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/tags/${tag.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3 w-3" />
                            Uredi
                          </Button>
                        </Link>
                        <DeleteTagButton id={tag.id} name={tag.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
