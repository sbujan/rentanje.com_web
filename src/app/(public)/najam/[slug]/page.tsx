import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanSeoTitle, fillPrice, productTitleField } from "@/lib/seo";
import { effectiveDailyRate } from "@/lib/pricing";
import { getCategoryImageUrl } from "@/lib/category-images";
import { pickNeighbors } from "@/lib/related";
import {
  FALLBACK_CATEGORY_SLUGS,
  LANDING_PAGES,
  getLandingPage,
  landingPagesForCategory,
  landingPagesForProduct,
  type LandingPageConfig,
} from "@/lib/landing-pages";
import type { ProductWithCategory } from "@/types/product";
import CategoryPage from "./CategoryPage";
import ProductPage, { type ProductTag } from "./ProductPage";
import LandingPage from "./LandingPage";

export const revalidate = 3600;
export const dynamicParams = true;

const BASE = "https://rentanje.com";
const PRODUCT_WITH_CATEGORY = "*, categories(name, color, slug)";

export async function generateStaticParams() {
  const hubSlugs = LANDING_PAGES.map((l) => ({ slug: l.slug }));
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

    return [...hubSlugs, ...allCategorySlugs, ...productSlugs];
  } catch {
    // DB unreachable at build time — return fallback so pages still generate
    return [...hubSlugs, ...FALLBACK_CATEGORY_SLUGS.map((slug) => ({ slug }))];
  }
}

interface Props {
  params: { slug: string };
}

/** Active hub products in config order, plus the {cijena} rate. */
async function loadLanding(landing: LandingPageConfig) {
  const supabase = createPublicClient();
  const [{ data: rows, error }, { data: parent }] = await Promise.all([
    supabase.from("products").select(PRODUCT_WITH_CATEGORY).in("id", landing.productIds).eq("is_active", true),
    supabase.from("categories").select("name, slug, color").eq("slug", landing.parentCategorySlug).maybeSingle(),
  ]);
  if (error) {
    console.error("Landing products query failed:", error);
    throw new Error("Failed to load landing products");
  }
  const byId = new Map(((rows ?? []) as unknown as ProductWithCategory[]).map((p) => [p.id, p]));
  const products = landing.productIds
    .map((id) => byId.get(id))
    .filter((p): p is ProductWithCategory => Boolean(p));
  const brandRates = products
    .filter((p) => landing.brandProductIds.includes(p.id))
    .map((p) => effectiveDailyRate(p));
  const rate = brandRates.length > 0 ? Math.min(...brandRates) : 0;
  return { products, parent: parent ?? null, rate };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Brand hubs first: a config lookup, no DB round trip to decide.
  const landing = getLandingPage(params.slug);
  if (landing) {
    const { rate } = await loadLanding(landing);
    const title = cleanSeoTitle(fillPrice(landing.seoTitle, rate));
    const description = fillPrice(landing.seoDescription, rate);
    const canonical = `${BASE}/najam/${landing.slug}`;
    const image = `${BASE}${landing.heroImage}`;
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
        images: [{ url: image, width: 1200, height: 630, alt: landing.h1 }],
      },
      twitter: { card: "summary_large_image", title, description, images: [image] },
    };
  }

  const supabase = createPublicClient();

  // Try category first
  const { data: cat } = await supabase
    .from("categories")
    .select("id, name, seo_title, seo_description, slug")
    .eq("slug", params.slug)
    .single();

  if (cat) {
    // An empty category is thin content: keep it reachable, keep it out of
    // the index. (It is also left out of the sitemap.)
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("category_id", cat.id);
    const title = cleanSeoTitle(cat.seo_title ?? `${cat.name} za iznajmljivanje`);
    const description =
      cat.seo_description ??
      `Iznajmite ${cat.name.toLowerCase()} u Zagrebu. Povoljne cijene, brz odgovor.`;
    const canonical = `${BASE}/najam/${cat.slug}`;
    const ogImage = getCategoryImageUrl(cat.slug);
    const ogImages = ogImage
      ? [{ url: ogImage, width: 1200, height: 630, alt: cat.name }]
      : [];
    return {
      title,
      description,
      alternates: { canonical },
      ...(count === 0 ? { robots: { index: false, follow: true } } : {}),
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
    // DB copy may use {cijena} so a price change never leaves a stale number.
    const rate = effectiveDailyRate(product);
    const title = productTitleField(product.seo_title, product.name, rate);
    const description = fillPrice(
      product.seo_description ??
        product.short_desc ??
        `Iznajmite ${product.name} u Zagrebu od ${rate} €/dan. Dostava na području Zagreba i okolice, brza rezervacija online. Odgovor u roku od 1 radnog dana.`,
      rate
    );
    const canonical = `${BASE}/najam/${product.slug}`;
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
  const landing = getLandingPage(params.slug);
  if (landing) {
    const { products, parent, rate } = await loadLanding(landing);
    return <LandingPage landing={landing} products={products} parent={parent} rate={rate} />;
  }

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
      .select(PRODUCT_WITH_CATEGORY)
      .eq("is_active", true)
      .eq("category_id", category.id)
      .order("sort_order")
      .order("slug");

    if (productsErr) {
      console.error("Category products query failed:", productsErr);
      throw new Error("Failed to load category products");
    }

    return (
      <CategoryPage
        category={category}
        products={(products ?? []) as unknown as ProductWithCategory[]}
        landings={landingPagesForCategory(category.slug)}
      />
    );
  }

  // Check if slug is a product. Same PGRST116 nuance: no rows → notFound().
  const { data: product, error: productErr } = await supabase
    .from("products")
    .select(PRODUCT_WITH_CATEGORY)
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (productErr && productErr.code !== "PGRST116") {
    console.error("Product lookup failed:", productErr);
    throw new Error("Failed to load product");
  }

  if (!product) {
    // A deactivated product's URL may still be indexed or linked. Send it to
    // its category (permanent) instead of a dead end, so its equity lands on
    // a live page. RLS hides inactive rows from the anon client, hence admin.
    const { data: inactive } = await createAdminClient()
      .from("products")
      .select("categories(slug)")
      .eq("slug", params.slug)
      .eq("is_active", false)
      .maybeSingle();
    const categorySlug = (inactive as { categories: { slug: string } | null } | null)?.categories?.slug;
    if (categorySlug) permanentRedirect(`/najam/${categorySlug}`);
    notFound();
  }

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
      .select(PRODUCT_WITH_CATEGORY)
      .in("id", ids)
      .eq("is_active", true);
    if (relProdErr) console.error("Related products query failed:", relProdErr);
    const rows = (data ?? []) as unknown as ProductWithCategory[];
    relatedProducts = ids
      .map((id) => rows.find((p) => p.id === id))
      .filter((p): p is ProductWithCategory => Boolean(p));
  }

  // Fallback: many products have no curated "connected" relations, so top up
  // from the same category. Take the siblings that FOLLOW this product in
  // category order (wrapping), not the first N: otherwise the same top-of-
  // category products get every link and the rest are orphans.
  const RELATED_TARGET = 4;
  if (relatedProducts.length < RELATED_TARGET && product.category_id) {
    const { data: siblings, error: sameCatErr } = await supabase
      .from("products")
      .select(PRODUCT_WITH_CATEGORY)
      .eq("is_active", true)
      .eq("category_id", product.category_id)
      .order("sort_order")
      .order("slug");
    if (sameCatErr) console.error("Same-category related fallback failed:", sameCatErr);
    relatedProducts = [
      ...relatedProducts,
      ...pickNeighbors(
        (siblings ?? []) as unknown as ProductWithCategory[],
        product.id,
        new Set(relatedProducts.map((p) => p.id)),
        RELATED_TARGET - relatedProducts.length
      ),
    ];
  }

  const tagRows = (tags ?? []) as unknown as { tags: ProductTag | null }[];
  const hubLinks = landingPagesForProduct(product.id).map((l) => ({
    href: `/najam/${l.slug}`,
    label: l.productLinkLabel,
  }));

  return (
    <ProductPage
      product={product as unknown as ProductWithCategory}
      availability={availability ?? []}
      tags={tagRows.map((t) => t.tags).filter((t): t is ProductTag => Boolean(t))}
      relatedProducts={relatedProducts}
      hubLinks={hubLinks}
    />
  );
}
