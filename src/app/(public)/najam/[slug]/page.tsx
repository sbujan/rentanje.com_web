import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CategoryPage from "./CategoryPage";
import ProductPage from "./ProductPage";

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createAdminClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("slug"),
    supabase.from("products").select("slug").eq("is_active", true),
  ]);

  return [
    ...(categories ?? []).map((c) => ({ slug: c.slug })),
    ...(products ?? []).map((p) => ({ slug: p.slug })),
  ];
}

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();

  // Try category first
  const { data: cat } = await supabase
    .from("categories")
    .select("name, seo_title, seo_description, slug")
    .eq("slug", params.slug)
    .single();

  if (cat) {
    const title = cat.seo_title ?? `${cat.name} za iznajmljivanje`;
    const description =
      cat.seo_description ??
      `Iznajmite ${cat.name.toLowerCase()} u Zagrebu. Povoljne cijene, brz odgovor. | rentanje.com`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://rentanje.com/najam/${cat.slug}`,
        siteName: "rentanje.com",
        type: "website",
      },
    };
  }

  // Try product
  const { data: product } = await supabase
    .from("products")
    .select("name, seo_title, seo_description, slug, hero_image_url, short_desc")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (product) {
    const title = product.seo_title ?? `${product.name} – Iznajmljivanje`;
    const description =
      product.seo_description ??
      product.short_desc ??
      `Iznajmite ${product.name} u Zagrebu. Pošaljite upit danas! | rentanje.com`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://rentanje.com/najam/${product.slug}`,
        siteName: "rentanje.com",
        type: "website",
        images: product.hero_image_url
          ? [{ url: product.hero_image_url, width: 1200, height: 630, alt: product.name }]
          : [],
      },
    };
  }

  return {};
}

export default async function NajamSlugPage({ params }: Props) {
  const supabase = await createClient();

  // Check if slug is a category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (category) {
    const { data: products } = await supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .eq("is_active", true)
      .eq("category_id", category.id)
      .order("sort_order");

    return <CategoryPage category={category} products={(products ?? []) as any} />;
  }

  // Check if slug is a product
  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name, color, slug)")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const { data: availability } = await supabase
    .from("availability")
    .select("date, qty_booked")
    .eq("product_id", product.id);

  const { data: tags } = await supabase
    .from("product_tags")
    .select("tags(id, name, color, slug)")
    .eq("product_id", product.id);

  return (
    <ProductPage
      product={product as any}
      availability={availability ?? []}
      tags={tags?.map((t: any) => t.tags).filter(Boolean) ?? []}
    />
  );
}
