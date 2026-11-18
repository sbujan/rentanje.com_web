import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { readableTextColor } from "@/lib/color";

export interface HomeCategoryImage {
  src: string;
  alt: string;
}

export interface HomeCategory {
  slug: string;
  name: string;
  color: string | null;
  productCount: number;
  /** Photos of the products that represent the category; the first is the large one. */
  images: HomeCategoryImage[];
}

/** Short "what's inside" line per category slug. */
const CATEGORY_HINT: Record<string, string> = {
  "kamere-i-dronovi": "GoPro, DJI, Insta360, dronovi",
  "audio-video-oprema": "Zvučnici, mikrofoni, projektori",
  "igre-na-otvorenom": "Cornhole, Jenga, beer pong",
  "aparati-za-hranu-i-pice": "Kokice, ledomat, točionik",
  "oprema-za-evente": "Stolovi, paviljon, grijalica",
  "rostilj-kuhanje": "Pizza peć, ražanj, kotlovina",
  "kamp-outdoor": "Šatori, hladnjak, SUP, firepit",
  "alati-ciscenje": "Kärcher za dubinsko čišćenje",
};

function productCountLabel(n: number): string {
  return n === 1 ? "1 proizvod" : `${n} proizvoda`;
}

/**
 * Photo area of a category box. One photo fills it. With more, the first
 * stays large and the others stack beside it from the sm breakpoint up; on a
 * phone the box is too narrow for that, so only the large one shows.
 */
function CategoryPhotos({ images }: { images: HomeCategoryImage[] }) {
  const [main, ...rest] = images;
  if (!main) return <div className="h-full w-full bg-gray-100" />;

  const side = rest.slice(0, 2);
  const grid =
    side.length === 2
      ? "sm:grid-cols-3 sm:grid-rows-2"
      : side.length === 1
        ? "sm:grid-cols-2 sm:grid-rows-1"
        : "";
  const mainSpan = side.length === 2 ? "sm:col-span-2 sm:row-span-2" : "";

  return (
    <div className={`grid h-full grid-cols-1 gap-0.5 bg-white ${grid}`}>
      <div className={`relative overflow-hidden bg-gray-100 ${mainSpan}`}>
        <Image
          src={main.src}
          alt={main.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 34vw, 17vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {side.map((img) => (
        <div key={img.src} className="relative hidden overflow-hidden bg-gray-100 sm:block">
          <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 17vw, 9vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function HomeCategoryBoxes({ categories }: { categories: HomeCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-text mb-2 text-center">
        Što želite iznajmiti?
      </h2>
      <p className="text-brand-muted text-center mb-8">Odaberite kategoriju i pronađite opremu koja vam treba.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {categories.map((c, index) => {
          const hint = CATEGORY_HINT[c.slug];
          const color = c.color ?? "#01D2D6";
          // TEMPORARY, for the owner to compare on staging: the first row
          // colours the label strip (A), the rest tint the photos (B).
          // Keep one and delete the other before this goes to production.
          const variant: "strip" | "tint" = index < 4 ? "strip" : "tint";
          const stripText = readableTextColor(color);
          return (
            <Link
              key={c.slug}
              href={`/najam/${c.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              <div className="relative aspect-[4/3]">
                <CategoryPhotos images={c.images} />
                {variant === "tint" && (
                  // Light wash of the category colour over the photos; multiply
                  // keeps the products sharp and it lifts on hover.
                  <span
                    className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-10"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                )}
              </div>
              {variant === "strip" ? (
                <div
                  className="flex flex-1 items-start justify-between gap-2 px-3 py-3 sm:px-4"
                  style={{ backgroundColor: color, color: stripText }}
                >
                  <span>
                    <span className="block font-display font-bold leading-snug">{c.name}</span>
                    {hint && <span className="mt-1 hidden text-sm leading-snug opacity-80 sm:block">{hint}</span>}
                    <span className="mt-1 block text-xs opacity-80">{productCountLabel(c.productCount)}</span>
                  </span>
                  <ArrowRight
                    className="mt-1 hidden h-4 w-4 shrink-0 opacity-80 transition-transform group-hover:translate-x-1 sm:block"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <div className="flex flex-1 items-start justify-between gap-2 border-t border-gray-100 px-3 py-3 sm:px-4">
                  <span>
                    <span className="flex items-center gap-2 font-display font-bold leading-snug text-brand-text transition-colors group-hover:text-brand-primary">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                      {c.name}
                    </span>
                    {hint && <span className="mt-1 hidden text-sm leading-snug text-brand-muted sm:block">{hint}</span>}
                    <span className="mt-1 block text-xs text-brand-muted">{productCountLabel(c.productCount)}</span>
                  </span>
                  <ArrowRight
                    className="mt-1 hidden h-4 w-4 shrink-0 text-brand-muted transition-colors group-hover:text-brand-primary sm:block"
                    aria-hidden="true"
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
