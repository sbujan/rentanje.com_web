import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = "https://rentanje.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [
    { data: products, error: productsErr },
    { data: categories, error: categoriesErr },
    { data: bundles, error: bundlesErr },
    { data: posts, error: postsErr },
    { data: seoPages, error: seoPagesErr },
  ] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("is_active", true),
    supabase.from("categories").select("slug, created_at"),
    supabase.from("bundles").select("slug, created_at").eq("is_active", true),
    supabase.from("blog_posts").select("slug, updated_at").eq("is_published", true),
    supabase.from("seo_pages").select("slug, updated_at").eq("is_published", true),
  ]);

  // A partial sitemap (static pages + whatever succeeded) is far better than an
  // empty one that silently de-indexes the catalog. Each section already
  // degrades via `?? []`; we only need the failure to be observable.
  if (productsErr || categoriesErr || bundlesErr || postsErr || seoPagesErr) {
    console.error("Sitemap query partial failure:", {
      productsErr,
      categoriesErr,
      bundlesErr,
      postsErr,
      seoPagesErr,
    });
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/oprema`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/paketi`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/o-nama`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${BASE}/najam/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE}/najam/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const bundlePages: MetadataRoute.Sitemap = (bundles ?? []).map((b) => ({
    url: `${BASE}/paketi/${b.slug}`,
    lastModified: new Date(b.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const seoPagesEntries: MetadataRoute.Sitemap = (seoPages ?? []).map((p) => ({
    url: `${BASE}/stranica/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...bundlePages, ...blogPages, ...seoPagesEntries];
}
