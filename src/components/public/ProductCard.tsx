import Link from "next/link";
import Image from "next/image";
import { CalendarCheck } from "lucide-react";
import type { ProductWithCategory } from "@/types/product";
import { effectiveDailyRate } from "@/lib/pricing";

type Product = ProductWithCategory;

function AvailabilityDot({ isAvailable }: { isAvailable: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${isAvailable ? "bg-green-500" : "bg-red-400"}`}
    />
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const lowestPrice = effectiveDailyRate(product);
  const categoryColor = product.categories?.color ?? "#6B7280";

  return (
    <div
      className="product-card rounded-lg"
      style={{ "--glow": categoryColor } as React.CSSProperties}
    >
    <Link
      href={`/najam/${product.slug}`}
      className="group bg-white rounded-lg shadow-card overflow-hidden flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {product.hero_image_url ? (
          <Image
            src={product.hero_image_url}
            alt={product.hero_image_alt?.trim() || `${product.name} za iznajmljivanje — rentanje.com`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-4xl">📦</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-display font-semibold text-brand-text leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
          {product.name}
        </h3>

        {product.short_desc && (
          <p className="text-sm text-brand-muted line-clamp-2">
            {product.short_desc}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="font-price font-bold text-brand-primary text-lg">
              od {lowestPrice} €
            </span>
            <span className="text-xs text-brand-muted">/dan</span>
          </div>

          <div className="flex items-center gap-1.5">
            <AvailabilityDot isAvailable={product.is_available} />
            <span className="text-xs text-brand-muted">
              {product.is_available ? "Dostupno" : "Nedostupno"}
            </span>
          </div>
        </div>

        {/* CTA — always visible; the whole card links to the product page */}
        <div className="mt-2 w-full flex items-center justify-center gap-2 bg-brand-primary text-white text-sm font-semibold py-2.5 rounded-md group-hover:bg-brand-dark transition-colors">
          <CalendarCheck className="h-4 w-4" />
          Provjeri dostupnost
        </div>
      </div>
    </Link>
    </div>
  );
}
