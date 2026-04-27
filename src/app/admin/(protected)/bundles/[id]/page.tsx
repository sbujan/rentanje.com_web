import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BundleForm from "../BundleForm";

interface Props {
  params: { id: string };
}

export default async function EditBundlePage({ params }: Props) {
  const supabase = await createClient();

  const [{ data: bundle }, { data: bundleProducts }, { data: products }] = await Promise.all([
    supabase.from("bundles").select("*").eq("id", params.id).single(),
    supabase
      .from("bundle_products")
      .select("product_id, qty")
      .eq("bundle_id", params.id),
    supabase.from("products").select("id, name").eq("is_active", true).order("name"),
  ]);

  if (!bundle) notFound();

  return (
    <BundleForm
      productOptions={products ?? []}
      initial={{
        id: bundle.id,
        name: bundle.name,
        slug: bundle.slug,
        description: bundle.description ?? "",
        hero_image_url: bundle.hero_image_url ?? "",
        discount_type: (bundle.discount_type ?? "") as "percent" | "fixed" | "",
        discount_value: bundle.discount_value !== null ? String(bundle.discount_value) : "",
        is_active: bundle.is_active,
        is_featured: bundle.is_featured,
        seo_title: bundle.seo_title ?? "",
        seo_description: bundle.seo_description ?? "",
        products: (bundleProducts ?? []).map((p) => ({ product_id: p.product_id, qty: p.qty })),
      }}
    />
  );
}
