import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcRentalPrice, applyBundleDiscount } from "@/lib/pricing";
import BundleAddToCart from "./BundleAddToCart";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("bundles")
      .select("slug")
      .eq("is_active", true);
    if (error) {
      console.error("generateStaticParams (paketi) query failed:", error);
      return [];
    }
    return (data ?? []).map((b) => ({ slug: b.slug }));
  } catch (err) {
    console.error("generateStaticParams (paketi) threw:", err);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: bundle } = await supabase
    .from("bundles")
    .select("name, seo_title, seo_description, hero_image_url, slug, description")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!bundle) return {};

  const title = bundle.seo_title ?? `${bundle.name} — paket za iznajmljivanje`;
  const description = bundle.seo_description ?? bundle.description ?? "";
  const canonical = `https://rentanje.com/paketi/${bundle.slug}`;

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
      images: bundle.hero_image_url
        ? [{ url: bundle.hero_image_url, width: 1200, height: 630, alt: bundle.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: bundle.hero_image_url ? [bundle.hero_image_url] : undefined,
    },
  };
}

export default async function BundlePage({ params }: Props) {
  const supabase = await createClient();

  // `.single()` reports "no rows" as PGRST116 — that's the notFound() path,
  // not a failure. Any other error is a real DB problem.
  const { data: bundle, error: bundleErr } = await supabase
    .from("bundles")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (bundleErr && bundleErr.code !== "PGRST116") {
    console.error("Bundle lookup failed:", bundleErr);
    throw new Error("Failed to load bundle");
  }

  if (!bundle) notFound();

  const { data: bundleProductRows, error: bundleProductsErr } = await supabase
    .from("bundle_products")
    .select("qty, product:products(id, name, slug, hero_image_url, price_per_day, price_per_3days, price_per_7days, min_rental_days, requires_deposit, deposit_amount)")
    .eq("bundle_id", bundle.id);

  if (bundleProductsErr) {
    console.error("Bundle products query failed:", bundleProductsErr);
    throw new Error("Failed to load bundle contents");
  }

  type BundleProductRow = {
    qty: number;
    product: {
      id: string;
      name: string;
      slug: string;
      hero_image_url: string | null;
      price_per_day: number | null;
      price_per_3days: number | null;
      price_per_7days: number;
      min_rental_days: 1 | 3 | 7;
      requires_deposit: boolean;
      deposit_amount: number | null;
    } | null;
  };

  const bundleProducts = ((bundleProductRows ?? []) as unknown as BundleProductRow[])
    .filter((r) => r.product !== null) as Array<BundleProductRow & { product: NonNullable<BundleProductRow["product"]> }>;

  // Reference price: 7-day rental of the bundle
  const referenceDays = 7;
  const referenceSubtotal = bundleProducts.reduce((sum, row) => {
    const { price } = calcRentalPrice(referenceDays, row.product);
    return sum + price * row.qty;
  }, 0);
  const { discount: referenceDiscount, total: referenceTotal } = applyBundleDiscount(
    referenceSubtotal,
    bundle.discount_type,
    bundle.discount_value
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-1 text-sm text-brand-muted mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-primary">Početna</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/paketi" className="hover:text-brand-primary">Paketi</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-brand-text font-medium line-clamp-1">{bundle.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div>
          {bundle.hero_image_url && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-gray-100">
              <Image
                src={bundle.hero_image_url}
                alt={bundle.name}
                fill
                className="object-cover"
                priority
              />
              {bundle.discount_value && bundle.discount_type && (
                <span className="absolute top-4 right-4 bg-brand-primary text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  {bundle.discount_type === "percent" ? `-${bundle.discount_value}%` : `-${bundle.discount_value} €`}
                </span>
              )}
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-text leading-tight mb-3">
            {bundle.name}
          </h1>

          {bundle.description && (
            <p className="text-brand-muted text-lg leading-relaxed mb-8">{bundle.description}</p>
          )}

          <h2 className="font-display text-xl font-bold text-brand-text mb-4">
            Što paket uključuje
          </h2>

          {bundleProducts.length === 0 ? (
            <p className="text-brand-muted">Sadržaj paketa uskoro.</p>
          ) : (
            <div className="space-y-3">
              {bundleProducts.map((row) => {
                const { price } = calcRentalPrice(referenceDays, row.product);
                return (
                  <Link
                    key={row.product.id}
                    href={`/najam/${row.product.slug}`}
                    className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:border-brand-primary/40 transition-colors"
                  >
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {row.product.hero_image_url ? (
                        <Image
                          src={row.product.hero_image_url}
                          alt={row.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-text line-clamp-1">{row.product.name}</p>
                      <p className="text-xs text-brand-muted mt-0.5">
                        Količina: {row.qty} · 7 dana cca {(price * row.qty).toFixed(0)} €
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Reference price card (when no dates picked) */}
          <div className="mt-6 bg-brand-light rounded-xl p-5">
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-2">
              Okvirna cijena (7 dana, sve uključeno)
            </p>
            <div className="flex items-end justify-between flex-wrap gap-2">
              <div>
                {referenceDiscount > 0 && (
                  <p className="text-sm text-gray-400 line-through">
                    {referenceSubtotal.toFixed(0)} €
                  </p>
                )}
                <p className="font-display font-bold text-brand-primary text-3xl">
                  {referenceTotal.toFixed(0)} €
                </p>
              </div>
              {referenceDiscount > 0 && (
                <span className="text-sm text-green-600 font-semibold">
                  Ušteda {referenceDiscount.toFixed(0)} €
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: date picker + add to cart */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <BundleAddToCart
            bundle={{
              id: bundle.id,
              name: bundle.name,
              slug: bundle.slug,
              hero_image_url: bundle.hero_image_url,
              discount_type: bundle.discount_type,
              discount_value: bundle.discount_value,
            }}
            products={bundleProducts.map((row) => ({
              id: row.product.id,
              name: row.product.name,
              slug: row.product.slug,
              hero_image_url: row.product.hero_image_url,
              price_per_day: row.product.price_per_day,
              price_per_3days: row.product.price_per_3days,
              price_per_7days: row.product.price_per_7days,
              min_rental_days: row.product.min_rental_days,
              requires_deposit: row.product.requires_deposit,
              deposit_amount: row.product.deposit_amount,
              qty: row.qty,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
