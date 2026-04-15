import { createClient } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: tags }, { data: allProducts }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("tags").select("*").order("name"),
    supabase.from("products").select("id, name").eq("is_active", true).order("name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-text mb-6">
        Novi proizvod
      </h1>
      <ProductForm
        categories={categories ?? []}
        tags={tags ?? []}
        allProducts={allProducts ?? []}
      />
    </div>
  );
}
