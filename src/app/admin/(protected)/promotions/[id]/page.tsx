import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PromotionForm, { toDateTimeLocal } from "../PromotionForm";

interface Props {
  params: { id: string };
}

export default async function EditPromotionPage({ params }: Props) {
  const supabase = await createClient();

  const [{ data: promo }, { data: categories }, { data: products }, { data: bundles }] =
    await Promise.all([
      supabase.from("promotions").select("*").eq("id", params.id).single(),
      supabase.from("categories").select("id, name").order("name"),
      supabase.from("products").select("id, name").eq("is_active", true).order("name"),
      supabase.from("bundles").select("id, name").eq("is_active", true).order("name"),
    ]);

  if (!promo) notFound();

  return (
    <PromotionForm
      categories={categories ?? []}
      products={products ?? []}
      bundles={bundles ?? []}
      initial={{
        id: promo.id,
        name: promo.name,
        code: promo.code ?? "",
        discount_type: promo.discount_type,
        discount_value: promo.discount_value !== null ? String(promo.discount_value) : "",
        applies_to: promo.applies_to,
        applies_to_id: promo.applies_to_id ?? "",
        min_days: promo.min_days !== null ? String(promo.min_days) : "",
        starts_at: toDateTimeLocal(promo.starts_at),
        ends_at: toDateTimeLocal(promo.ends_at),
        usage_limit: promo.usage_limit !== null ? String(promo.usage_limit) : "",
        is_active: promo.is_active,
        usage_count: promo.usage_count,
      }}
    />
  );
}
