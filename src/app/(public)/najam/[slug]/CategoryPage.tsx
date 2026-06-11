import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { jsonLdSafe } from "@/lib/seo";
import ProductCard from "@/components/public/ProductCard";
import PageHero from "@/components/public/PageHero";
import { CATEGORY_IMAGES, getCategoryImageUrl } from "@/lib/category-images";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories?: { name: string; color: string | null; slug: string } | null;
};

interface Props {
  category: Category;
  products: Product[];
}

function buildCollectionPageSchema(category: Category, products: Product[]) {
  const url = `https://rentanje.com/najam/${category.slug}`;
  const absoluteImage = getCategoryImageUrl(category.slug);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description:
      category.description ??
      category.seo_description ??
      `Iznajmite ${category.name.toLowerCase()} u Zagrebu.`,
    url,
    ...(absoluteImage ? { image: absoluteImage } : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://rentanje.com/najam/${p.slug}`,
        name: p.name,
      })),
    },
  };
}

function buildBreadcrumbSchema(category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: "https://rentanje.com" },
      { "@type": "ListItem", position: 2, name: "Oprema", item: "https://rentanje.com/oprema" },
      { "@type": "ListItem", position: 3, name: category.name, item: `https://rentanje.com/najam/${category.slug}` },
    ],
  };
}

export default function CategoryPage({ category, products }: Props) {
  const imageUrl = CATEGORY_IMAGES[category.slug];
  const color = category.color ?? "#6B7280";

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(buildCollectionPageSchema(category, products)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(buildBreadcrumbSchema(category)) }}
      />

      <PageHero
        title={category.name}
        subtitle={category.description ?? undefined}
        breadcrumbs={[
          { href: "/", label: "Početna" },
          { href: "/oprema", label: "Oprema" },
          { label: category.name },
        ]}
        color={color}
        imageUrl={imageUrl}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-sm text-brand-muted mb-6">
          {products.length} {products.length === 1 ? "proizvod" : "proizvoda"} dostupno
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-brand-muted">
            <p className="text-lg mb-2">Nema dostupnih proizvoda u ovoj kategoriji.</p>
            <Link href="/oprema" className="text-brand-primary underline">
              Pregledaj svu opremu
            </Link>
          </div>
        )}

        {/* Back to homepage CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-primary font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-light transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Povratak na početnu
          </Link>
        </div>
      </div>
    </main>
  );
}
