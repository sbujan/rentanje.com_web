import Link from "next/link";
import ProductCard from "@/components/public/ProductCard";
import { ChevronRight } from "lucide-react";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories?: { name: string; color: string | null; slug: string } | null;
};

interface Props {
  category: Category;
  products: Product[];
}

export default function CategoryPage({ category, products }: Props) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-brand-muted mb-6">
        <Link href="/" className="hover:text-brand-primary">Početna</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/oprema" className="hover:text-brand-primary">Oprema</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-brand-text font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        {category.color && (
          <div
            className="h-12 w-1.5 rounded-full shrink-0 mt-1"
            style={{ backgroundColor: category.color }}
          />
        )}
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-text">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-brand-muted mt-2">{category.description}</p>
          )}
          <p className="text-sm text-brand-muted mt-1">
            {products.length} {products.length === 1 ? "proizvod" : "proizvoda"} dostupno
          </p>
        </div>
      </div>

      {/* Products */}
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
    </main>
  );
}
