import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface HomeBrand {
  slug: string;
  /** Brand name, e.g. "GoPro". */
  name: string;
  /** Link text and caption: the phrase the hub targets, e.g. "Najam GoPro kamera". */
  label: string;
  logo: string;
  /** Photo of the brand's main product, revealed on hover. */
  productImage: string | null;
  productName: string | null;
}

/**
 * White boxes with the brand logo. On a device with hover the product photo
 * fades in over the logo; on touch screens there is no hover, so the photo
 * sits next to the logo from the start.
 */
export default function HomeBrandBoxes({ brands }: { brands: HomeBrand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-text mb-2 text-center">
        Najam po brendu
      </h2>
      <p className="text-brand-muted text-center mb-8">Znate što tražite? Krenite od brenda.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/najam/${b.slug}`}
            className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200 hover:border-brand-primary hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            <div className="relative h-32 sm:h-44">
              {/* Logo: centred; steps aside for the photo on hover, and sits
                  in the top corner on touch screens. */}
              <div className="absolute inset-0 z-10 flex items-center justify-center p-6 transition-opacity duration-300 group-hover:opacity-0 [@media(hover:none)]:items-start [@media(hover:none)]:justify-start [@media(hover:none)]:p-2 [@media(hover:none)]:group-hover:opacity-100">
                <Image
                  src={b.logo}
                  alt={`${b.name} logo`}
                  width={160}
                  height={64}
                  unoptimized
                  className="max-h-12 sm:max-h-16 w-auto max-w-[70%] object-contain [@media(hover:none)]:max-h-7 [@media(hover:none)]:max-w-[50%] [@media(hover:none)]:rounded-md [@media(hover:none)]:bg-white [@media(hover:none)]:p-1"
                />
              </div>
              {b.productImage && (
                <Image
                  src={b.productImage}
                  alt={b.productName ? `${b.productName}, najam u Zagrebu` : ""}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-0 scale-105 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 [@media(hover:none)]:opacity-100 [@media(hover:none)]:scale-100"
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-4 py-3">
              <span className="font-display font-semibold text-sm sm:text-base text-brand-text group-hover:text-brand-primary transition-colors">
                {b.label}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-brand-muted group-hover:text-brand-primary transition-colors" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
