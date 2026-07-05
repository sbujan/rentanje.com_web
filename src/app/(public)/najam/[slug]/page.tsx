import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/server";
import { cleanSeoTitle, productTitleField } from "@/lib/seo";
import { effectiveDailyRate } from "@/lib/pricing";
import { getCategoryImageUrl } from "@/lib/category-images";
import type { ProductWithCategory } from "@/types/product";
import CategoryPage from "./CategoryPage";
import ProductPage, { type ProductTag } from "./ProductPage";

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
    // Cookie-free anon client: RLS public-read policies cover both reads
    // (categories: USING(true); products: USING(is_active = true)).
    const supabase = createPublicClient();

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
  const supabase = createPublicClient();

  // Try category first
  const { data: cat } = await supabase
    .from("categories")
    .select("name, seo_title, seo_description, slug")
    .eq("slug", params.slug)
    .single();

  if (cat) {
    const title = cleanSeoTitle(cat.seo_title ?? `${cat.name} za iznajmljivanje`);
    const description =
      cat.seo_description ??
      `Iznajmite ${cat.name.toLowerCase()} u Zagrebu. Povoljne cijene, brz odgovor. | rentanje.com`;
    const canonical = `https://rentanje.com/najam/${cat.slug}`;
    const ogImage = getCategoryImageUrl(cat.slug);
    const ogImages = ogImage
      ? [{ url: ogImage, width: 1200, height: 630, alt: cat.name }]
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
        images: ogImage ? [ogImage] : undefined,
      },
    };
  }

  // Try product
  const { data: product } = await supabase
    .from("products")
    .select("name, seo_title, seo_description, slug, hero_image_url, hero_image_alt, short_desc, price_per_day, price_per_3days, price_per_7days")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (product) {
    // Default title/description carry the live daily rate for CTR. The root
    // layout template appends " | rentanje.com", so fallbacks must NOT include
    // the brand; cleanSeoTitle strips it from any DB seo_title that still does.
    const rate = effectiveDailyRate(product);
    const title = productTitleField(product.seo_title, product.name, rate);
    const description =
      product.seo_description ??
      product.short_desc ??
      `Iznajmite ${product.name} u Zagrebu od ${rate} €/dan. Dostava na području Zagreba, brza rezervacija online — odgovor u roku od 1 radnog dana.`;
    const canonical = `https://rentanje.com/najam/${product.slug}`;
    const ogImages = product.hero_image_url
      ? [{ url: product.hero_image_url, width: 1200, height: 630, alt: product.hero_image_alt?.trim() || product.name }]
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
  const supabase = createPublicClient();

  // Check if slug is a category. `.single()` reports "no rows" as PGRST116 —
  // that's the expected "not a category, try product" path, not a failure.
  const { data: category, error: categoryErr } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (categoryErr && categoryErr.code !== "PGRST116") {
    console.error("Category lookup failed:", categoryErr);
    throw new Error("Failed to load category");
  }

  if (category) {
    const { data: products, error: productsErr } = await supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .eq("is_active", true)
      .eq("category_id", category.id)
      .order("sort_order");

    if (productsErr) {
      console.error("Category products query failed:", productsErr);
      throw new Error("Failed to load category products");
    }

    return (
      <CategoryPage
        category={category}
        products={(products ?? []) as unknown as ProductWithCategory[]}
      />
    );
  }

  // Check if slug is a product. Same PGRST116 nuance: no rows → notFound().
  const { data: product, error: productErr } = await supabase
    .from("products")
    .select("*, categories(name, color, slug)")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (productErr && productErr.code !== "PGRST116") {
    console.error("Product lookup failed:", productErr);
    throw new Error("Failed to load product");
  }

  if (!product) notFound();

  // Fan out the three independent reads in parallel instead of awaiting each.
  const [
    { data: availability, error: availErr },
    { data: tags, error: tagsErr },
    { data: relatedRows, error: relErr },
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

  if (availErr || tagsErr || relErr) {
    console.error("Product detail queries failed:", availErr || tagsErr || relErr);
    throw new Error("Failed to load product details");
  }

  let relatedProducts: ProductWithCategory[] = [];
  if (relatedRows && relatedRows.length > 0) {
    const ids = relatedRows.map((r) => r.related_id);
    // Related products are supplementary — log and degrade rather than fail the page.
    const { data, error: relProdErr } = await supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .in("id", ids)
      .eq("is_active", true);
    if (relProdErr) console.error("Related products query failed:", relProdErr);
    const rows = (data ?? []) as unknown as ProductWithCategory[];
    relatedProducts = ids
      .map((id) => rows.find((p) => p.id === id))
      .filter((p): p is ProductWithCategory => Boolean(p));
  }

  // Fallback: many products have no manually-curated "connected" relations, so
  // their page would render zero related items and become an orphan. Top up from
  // the same category (excluding self and anything already linked) so every
  // product page links out to siblings for crawl depth + user discovery.
  const RELATED_TARGET = 4;
  if (relatedProducts.length < RELATED_TARGET && product.category_id) {
    const excludeIds = [product.id, ...relatedProducts.map((p) => p.id)];
    const { data: sameCat, error: sameCatErr } = await supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .eq("is_active", true)
      .eq("category_id", product.category_id)
      .not("id", "in", `(${excludeIds.join(",")})`)
      .order("sort_order")
      .limit(RELATED_TARGET - relatedProducts.length);
    if (sameCatErr) console.error("Same-category related fallback failed:", sameCatErr);
    relatedProducts = [
      ...relatedProducts,
      ...((sameCat ?? []) as unknown as ProductWithCategory[]),
    ];
  }

  const tagRows = (tags ?? []) as unknown as { tags: ProductTag | null }[];

  return (
    <ProductPage
      product={product as unknown as ProductWithCategory}
      availability={availability ?? []}
      tags={tagRows.map((t) => t.tags).filter((t): t is ProductTag => Boolean(t))}
      relatedProducts={relatedProducts}
    />
  );
}
