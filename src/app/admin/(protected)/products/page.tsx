import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price_per_day, price_per_7days, min_rental_days, is_active, is_featured, sort_order, categories(name)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-text">
          Proizvodi
        </h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Novi proizvod
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {!products?.length ? (
          <div className="p-8 text-center text-brand-muted">
            Nema proizvoda. Dodajte prvi!
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-brand-muted">
                  Naziv
                </th>
                <th className="px-4 py-3 text-left font-medium text-brand-muted">
                  Kategorija
                </th>
                <th className="px-4 py-3 text-left font-medium text-brand-muted">
                  Cijena od
                </th>
                <th className="px-4 py-3 text-left font-medium text-brand-muted">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => {
                const lowestPrice = p.price_per_day ?? p.price_per_7days;
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      p.is_active
                        ? "bg-green-50/60 hover:bg-green-50"
                        : "bg-red-50/60 hover:bg-red-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-brand-text">{p.name}</div>
                      <div className="text-xs text-brand-muted font-mono">
                        /najam/{p.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {(p.categories as unknown as { name: string } | null)?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-price font-bold text-brand-primary">
                      {lowestPrice} €
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        <Badge variant={p.is_active ? "success" : "secondary"}>
                          {p.is_active ? "Aktivno" : "Neaktivno"}
                        </Badge>
                        {p.is_featured && (
                          <Badge variant="default">Istaknuto</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/products/${p.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3 w-3" />
                            Uredi
                          </Button>
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
