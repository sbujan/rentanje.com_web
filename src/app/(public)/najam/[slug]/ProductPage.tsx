import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddToCartCard from "@/components/public/AddToCartCard";
import ProductCard from "@/components/public/ProductCard";
import ViewTracker from "@/components/public/ViewTracker";
import ImageLightbox from "@/components/public/ImageLightbox";
import type { Database } from "@/types/database";

interface FaqItem { question: string; answer: string; }

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories?: { name: string; color: string | null; slug: string } | null;
};
type Tag = { id: string; name: string; color: string | null; slug: string };

interface Props {
  product: Product;
  availability: { date: string; qty_booked: number }[];
  tags: Tag[];
  relatedProducts?: Product[];
}

function buildProductSchema(product: Product) {
  const productUrl = `https://rentanje.com/najam/${product.slug}`;
  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_desc ?? product.name,
    image: product.hero_image_url ? [product.hero_image_url] : undefined,
    sku: product.slug,
    url: productUrl,
    ...(product.categories ? { category: product.categories.name } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: String(product.price_per_day),
      priceValidUntil: priceValidUntil.toISOString().slice(0, 10),
      itemCondition: "https://schema.org/UsedCondition",
      availability: product.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: productUrl,
    },
  };
}

function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function buildBreadcrumbSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: "https://rentanje.com" },
      { "@type": "ListItem", position: 2, name: "Oprema", item: "https://rentanje.com/oprema" },
      ...(product.categories
        ? [{ "@type": "ListItem", position: 3, name: product.categories.name, item: `https://rentanje.com/najam/${product.categories.slug}` }]
        : []),
      { "@type": "ListItem", position: product.categories ? 4 : 3, name: product.name, item: `https://rentanje.com/najam/${product.slug}` },
    ],
  };
}

export default function ProductPage({ product, availability, tags, relatedProducts = [] }: Props) {
  const specs = [
    product.weight_kg ? { label: "Težina", value: `${product.weight_kg} kg` } : null,
    product.dimensions_cm ? { label: "Dimenzije", value: `${product.dimensions_cm} cm` } : null,
    { label: "Min. iznajmljivanje", value: `${product.min_rental_days} ${product.min_rental_days === 1 ? "dan" : "dana"}` },
    { label: "Dostupno komada", value: `${product.stock_qty} kom` },
  ].filter(Boolean) as { label: string; value: string }[];

  const seoKeywords = product.seo_keywords?.join(", ");
  const faq: FaqItem[] = ((product as any).faq as FaqItem[] | null) ?? [];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductSchema(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(product)) }}
      />
      {faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faq)) }}
        />
      )}

      <ViewTracker
        product={{
          id: product.id,
          name: product.name,
          price: product.price_per_day ?? product.price_per_7days,
          category: product.categories?.name,
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-brand-muted mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-primary">Početna</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/oprema" className="hover:text-brand-primary">Oprema</Link>
          {product.categories && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/najam/${product.categories.slug}`} className="hover:text-brand-primary">
                {product.categories.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-brand-text font-medium">{product.name}</span>
        </nav>

        {/* Hero image — mobile only (with lightbox) */}
        {product.hero_image_url && (
          <div className="lg:hidden">
            <ImageLightbox
              images={[product.hero_image_url, ...(product.images ?? [])]}
              alts={[product.hero_image_alt, ...(product.image_alts ?? [])]}
              alt={`${product.name} za iznajmljivanje — rentanje.com`}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            <div>
              {/* Category tag */}
              {product.categories && (
                <Link
                  href={`/najam/${product.categories.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold mb-3 hover:underline"
                  style={{ color: product.categories.color ?? "#6B7280" }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: product.categories.color ?? "#6B7280" }}
                  />
                  {product.categories.name}
                </Link>
              )}

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-text leading-tight">
                {product.name}
              </h1>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: tag.color ?? "#6B7280" }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Hero image + gallery — desktop (with lightbox) */}
            {product.hero_image_url && (
              <div className="hidden lg:block">
                <ImageLightbox
                  images={[product.hero_image_url, ...(product.images ?? [])]}
                  alts={[product.hero_image_alt, ...(product.image_alts ?? [])]}
                  alt={`${product.name} za iznajmljivanje — rentanje.com`}
                />
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h2 className="font-display font-bold text-lg text-brand-text">Opis</h2>
                <div
                  className="prose prose-sm max-w-none text-brand-text leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description, {
                      USE_PROFILES: { html: true },
                      FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
                      FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur", "style"],
                    }),
                  }}
                />
              </div>
            )}

            {/* Specs */}
            {specs.length > 0 && (
              <div className="space-y-2">
                <h2 className="font-display font-bold text-lg text-brand-text">Tehnički podaci</h2>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  {specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <span className="text-brand-muted">{spec.label}</span>
                      <span className="font-medium text-brand-text">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ accordion */}
            {faq.length > 0 && (
              <div className="space-y-2">
                <h2 className="font-display font-bold text-lg text-brand-text">Često postavljena pitanja</h2>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                  {faq.map((item, i) => (
                    <details key={i} className="group bg-white">
                      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none font-medium text-brand-text text-sm hover:bg-gray-50 transition-colors">
                        {item.question}
                        <ChevronDown className="h-4 w-4 text-brand-muted flex-shrink-0 ml-2 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-4 pb-4 text-sm text-brand-muted leading-relaxed">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* SEO keywords (hidden, for context) */}
            {seoKeywords && (
              <p className="text-xs text-brand-muted">
                Ključne riječi: {seoKeywords}
              </p>
            )}
          </div>

          {/* RIGHT COLUMN — sticky */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <AddToCartCard
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                hero_image_url: product.hero_image_url,
                price_per_day: product.price_per_day,
                price_per_3days: product.price_per_3days,
                price_per_7days: product.price_per_7days,
                min_rental_days: product.min_rental_days,
                requires_deposit: product.requires_deposit,
                deposit_amount: product.deposit_amount,
                deposit_note: product.deposit_note,
                stock_qty: product.stock_qty,
                category: product.categories?.name,
              }}
              availability={availability}
            />
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="font-display text-2xl font-bold text-brand-text mb-6">Povezani proizvodi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
