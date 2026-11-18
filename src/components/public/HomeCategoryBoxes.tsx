import Link from "next/link";
import {
  Camera,
  Dices,
  Flame,
  Package,
  PartyPopper,
  Popcorn,
  Speaker,
  SprayCan,
  Tent,
  type LucideIcon,
} from "lucide-react";

export interface HomeCategory {
  slug: string;
  name: string;
  color: string | null;
  productCount: number;
}

/** Icon and a short "what's inside" line per category slug. */
const CATEGORY_LOOK: Record<string, { icon: LucideIcon; hint: string }> = {
  "kamere-i-dronovi": { icon: Camera, hint: "GoPro, DJI, Insta360, dronovi" },
  "audio-video-oprema": { icon: Speaker, hint: "Zvučnici, mikrofoni, projektori" },
  "igre-na-otvorenom": { icon: Dices, hint: "Cornhole, Jenga, beer pong" },
  "aparati-za-hranu-i-pice": { icon: Popcorn, hint: "Kokice, ledomat, točionik" },
  "oprema-za-evente": { icon: PartyPopper, hint: "Stolovi, paviljon, grijalica" },
  "rostilj-kuhanje": { icon: Flame, hint: "Pizza peć, ražanj, kotlovina" },
  "kamp-outdoor": { icon: Tent, hint: "Šatori, hladnjak, SUP, firepit" },
  "alati-ciscenje": { icon: SprayCan, hint: "Kärcher za dubinsko čišćenje" },
};

function productCountLabel(n: number): string {
  // Croatian plural: 1 proizvod, 2-4 proizvoda, 5+ proizvoda (11-14 too).
  return n === 1 ? "1 proizvod" : `${n} proizvoda`;
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
        {categories.map((c) => {
          const look = CATEGORY_LOOK[c.slug];
          const Icon = look?.icon ?? Package;
          const color = c.color ?? "#01D2D6";
          return (
            <Link
              key={c.slug}
              href={`/najam/${c.slug}`}
              className="group flex flex-col items-center text-center gap-3 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              <span
                className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{ backgroundColor: `${color}26` }}
              >
                <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.6} style={{ color }} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display font-bold text-brand-text leading-snug group-hover:text-brand-primary transition-colors">
                  {c.name}
                </span>
                {look?.hint && (
                  <span className="mt-1 hidden sm:block text-sm text-brand-muted leading-snug">{look.hint}</span>
                )}
                <span className="mt-1 block text-xs text-brand-muted">{productCountLabel(c.productCount)}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
