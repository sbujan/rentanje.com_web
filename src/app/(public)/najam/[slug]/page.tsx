import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CategoryPage from "./CategoryPage";
import ProductPage from "./ProductPage";

export const revalidate = 3600;
export const dynamicParams = true;

// Fallback category slugs so category pages always build even if DB is unreachable
const FALLBACK_CATEGORY_SLUGS = [
  "audio-video-oprema",
  "oprema-za-evente",
  "rostilj-kuhanje",
  "kamp-outdoor",
  "alati-ciscenje",
  "ostalo",
];

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();

    const [{ data: categories }, { data: products }] = await Promise.all([
      supabase.from("categories").select("slug"),
      supabase.from("products").select("slug").eq("is_active", true),
    ]);

    const categorySlugs = (categories ?? []).map((c) => ({ slug: c.slug }));
    const productSlugs = (products ?? []).map((p) => ({ slug: p.slug }));

    // Always include fallback slugs in case DB returns empty
    const allCategorySlugs = categorySlugs.length > 0
      ? categorySlugs
      : FALLBACK_CATEGORY_SLUGS.map((slug) => ({ slug }));

    return [...allCategorySlugs, ...productSlugs];
  } catch {
    // DB unreachable at build time — return fallback so pages still generate
    return FALLBACK_CATEGORY_SLUGS.map((slug) => ({ slug }));
  }
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
    const canonical = `https://rentanje.com/najam/${cat.slug}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "rentanje.com",
        type: "website",
        locale: "hr_HR",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
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
    const canonical = `https://rentanje.com/najam/${product.slug}`;
    const ogImages = product.hero_image_url
      ? [{ url: product.hero_image_url, width: 1200, height: 630, alt: product.name }]
      : [];
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "rentanje.com",
        type: "website",
        locale: "hr_HR",
        images: ogImages,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.hero_image_url ? [product.hero_image_url] : undefined,
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

  // Fan out the three independent reads in parallel instead of awaiting each.
  const [
    { data: availability },
    { data: tags },
    { data: relatedRows },
  ] = await Promise.all([
    supabase
      .from("availability")
      .select("date, qty_booked")
      .eq("product_id", product.id),
    supabase
      .from("product_tags")
      .select("tags(id, name, color, slug)")
      .eq("product_id", product.id),
    supabase
      .from("product_relations")
      .select("related_id, sort_order")
      .eq("product_id", product.id)
      .eq("type", "connected")
      .order("sort_order"),
  ]);

  let relatedProducts: any[] = [];
  if (relatedRows && relatedRows.length > 0) {
    const ids = relatedRows.map((r) => r.related_id);
    const { data } = await supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .in("id", ids)
      .eq("is_active", true);
    relatedProducts = ids
      .map((id) => data?.find((p: any) => p.id === id))
      .filter(Boolean);
  }

  return (
    <ProductPage
      product={product as any}
      availability={availability ?? []}
      tags={tags?.map((t: any) => t.tags).filter(Boolean) ?? []}
      relatedProducts={relatedProducts}
    />
  );
}
