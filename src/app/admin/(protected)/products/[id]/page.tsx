import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const [
    { data: product },
    { data: categories },
    { data: tags },
    { data: productTags },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("id", params.id).single(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("tags").select("*").order("name"),
    supabase
      .from("product_tags")
      .select("tag_id")
      .eq("product_id", params.id),
  ]);

  if (!product) notFound();

  const selectedTagIds = productTags?.map((pt) => pt.tag_id) ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-text mb-6">
        Uredi proizvod
      </h1>
      <ProductForm
        product={product}
        categories={categories ?? []}
        tags={tags ?? []}
        selectedTagIds={selectedTagIds}
      />
    </div>
  );
}
