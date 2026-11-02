import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { jsonLdSafe, fillPrice } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";
import type { LandingPageConfig } from "@/lib/landing-pages";
import ProductCard from "@/components/public/ProductCard";
import PageHero from "@/components/public/PageHero";
import FaqAccordion from "@/components/public/FaqAccordion";
import type { ProductWithCategory } from "@/types/product";

const BASE = "https://rentanje.com";

interface Props {
  landing: LandingPageConfig;
  products: ProductWithCategory[];
  parent: { name: string; slug: string; color: string | null } | null;
  /** Lowest live daily rate of the brand's products, for {cijena}. */
  rate: number;
}

export default function LandingPage({ landing, products, parent, rate }: Props) {
  const url = `${BASE}/najam/${landing.slug}`;
  const description = fillPrice(landing.seoDescription, rate);
  const faq = landing.faq.map((f) => ({ question: f.question, answer: fillPrice(f.answer, rate) }));
  const color = parent?.color ?? "#01D2D6";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: landing.h1,
    description,
    url,
    image: `${BASE}${landing.heroImage}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE}/najam/${p.slug}`,
        name: p.name,
      })),
    },
  };

  const crumbs = [
    { name: "Početna", item: BASE },
    { name: "Oprema", item: `${BASE}/oprema` },
    ...(parent ? [{ name: parent.name, item: `${BASE}/najam/${parent.slug}` }] : []),
    { name: landing.h1, item: url },
  ];
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbSchema) }} />

      <PageHero
        title={landing.h1}
        subtitle={landing.intro}
        breadcrumbs={[
          { href: "/", label: "Početna" },
          { href: "/oprema", label: "Oprema" },
          ...(parent ? [{ href: `/najam/${parent.slug}`, label: parent.name }] : []),
          { label: landing.h1 },
        ]}
        color={color}
        imageUrl={landing.heroImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="max-w-3xl space-y-10">
          {/* Tables come from config HTML without classes (src/lib is outside
              the Tailwind content glob), so they are styled from here. On
              narrow screens the table becomes a horizontal scroller. */}
          <div
            className="prose prose-sm sm:prose-base max-w-none text-brand-text leading-relaxed prose-a:text-brand-primary prose-headings:font-display [&_table]:block [&_table]:overflow-x-auto [&_table]:whitespace-nowrap sm:[&_table]:whitespace-normal [&_th]:text-left [&_td]:align-top"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(landing.bodyHtml) }}
          />

          <FaqAccordion items={faq} />
        </div>

        {parent && (
          <div className="flex justify-center">
            <Link
              href={`/najam/${parent.slug}`}
              className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-primary font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-light transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Sva oprema: {parent.name}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
