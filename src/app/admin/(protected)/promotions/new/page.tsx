import { createClient } from "@/lib/supabase/server";
import PromotionForm from "../PromotionForm";

export default async function NewPromotionPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: products }, { data: bundles }] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("products").select("id, name").eq("is_active", true).order("name"),
    supabase.from("bundles").select("id, name").eq("is_active", true).order("name"),
  ]);

  return (
    <PromotionForm
      categories={categories ?? []}
      products={products ?? []}
      bundles={bundles ?? []}
    />
  );
}
