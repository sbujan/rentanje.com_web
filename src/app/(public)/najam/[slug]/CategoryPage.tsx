import Link from "next/link";
import ProductCard from "@/components/public/ProductCard";
import PageHero from "@/components/public/PageHero";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories?: { name: string; color: string | null; slug: string } | null;
};

// Fallback images per slug (used if category has no hero_image_url in DB)
const CATEGORY_IMAGES: Record<string, string> = {
  "audio-video-oprema": "/Projektor-s-platnom.jpg",
  "oprema-za-evente": "/Druzenje-na-otvorenom.jpg",
  "rostilj-kuhanje": "/Kulinarski-dozivljaj.jpg",
  "kamp-outdoor": "/sator-za-kampiranje-mh100-fresh-black-za-tri-osobe-2.avif",
  "alati-ciscenje": "/kercher%20puzzi.jpg",
  "ostalo": "/Hiluckey-solarni-Powerbank-25000mAh.jpg",
};

interface Props {
  category: Category;
  products: Product[];
}

export default function CategoryPage({ category, products }: Props) {
  const imageUrl = (category as any).hero_image_url ?? CATEGORY_IMAGES[category.slug] ?? undefined;
  const color = category.color ?? "#6B7280";

  return (
    <main>
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
      </div>
    </main>
  );
}
