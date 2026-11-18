import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/server";
import { jsonLdSafe } from "@/lib/seo";
import { SOCIAL_LINKS } from "@/lib/site";
import type { ProductWithCategory } from "@/types/product";
import ProductCard from "@/components/public/ProductCard";
import HomeCategoryBoxes, { type HomeCategory } from "@/components/public/HomeCategoryBoxes";
import HomeBrandBoxes, { type HomeBrand } from "@/components/public/HomeBrandBoxes";
import HomeCTAContact from "@/components/public/HomeCTAContact";
import { getLandingPage } from "@/lib/landing-pages";
import { extraProductIdsForCategory, withExtraProducts } from "@/lib/category-extras";
import { Star, ArrowRight, Zap, Truck, BadgeCent } from "lucide-react";

export const revalidate = 3600;

const HOME_TITLE = "Najam opreme u Zagrebu: kamere, zvučnici, igre | rentanje.com";
const HOME_DESCRIPTION =
  "Iznajmite GoPro i DJI kamere, JBL zvučnike, roštilje, šatore i igre za evente u Zagrebu. Više od 50 proizvoda, online rezervacija, preuzimanje ili dostava.";

export const metadata: Metadata = {
  // `absolute` bypasses the layout template so the homepage isn't double-suffixed.
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "https://rentanje.com/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "https://rentanje.com/",
    siteName: "rentanje.com",
    type: "website",
    locale: "hr_HR",
    images: [{ url: "/rentanje-najam-zagreb-iznajmi.jpg", width: 1254, height: 1254, alt: "RENTANJE.COM: Ne kupuj, iznajmi." }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/rentanje-najam-zagreb-iznajmi.jpg"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Rentanje.com",
  legalName: "List 360 d.o.o.",
  telephone: "+385952044414",
  email: "info@rentanje.com",
  url: "https://rentanje.com",
  image: "https://rentanje.com/rentanje-najam-zagreb-iznajmi.jpg",
  address: { "@type": "PostalAddress", addressCountry: "HR", addressLocality: "Zagreb", streetAddress: "Naserov trg 4" },
  areaServed: [
    { "@type": "City", name: "Zagreb" },
    { "@type": "Country", name: "Hrvatska" },
  ],
  openingHours: "Mo-Su 08:00-20:00",
  priceRange: "€€",
  description: "Iznajmljivanje opreme za evente, roštilj, kamp i audio/video u Hrvatskoj.",
  sameAs: Object.values(SOCIAL_LINKS),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rentanje.com",
  legalName: "List 360 d.o.o.",
  url: "https://rentanje.com",
  logo: "https://rentanje.com/logo.png",
  telephone: "+385952044414",
  email: "info@rentanje.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "HR",
    addressLocality: "Zagreb",
    streetAddress: "Naserov trg 4",
  },
  sameAs: Object.values(SOCIAL_LINKS),
};

const whyUs = [
  {
    icon: <Zap className="h-8 w-8 text-brand-primary" strokeWidth={1.5} />,
    title: "Brz odgovor",
    desc: "Odgovaramo u roku od 1 radnog dana, dostupni svaki dan 8-20h.",
  },
  {
    icon: <Truck className="h-8 w-8 text-brand-primary" strokeWidth={1.5} />,
    title: "Dostava u Zagreb",
    desc: "Dostavljamo opremu na vašu adresu u Zagrebu i okolici. Cijena dostave je navedena uz svaki proizvod.",
  },
  {
    icon: <BadgeCent className="h-8 w-8 text-brand-primary" strokeWidth={1.5} />,
    title: "Povoljne cijene",
    desc: "Iznajmite skupu opremu po pristupačnoj cijeni, bez skrivenih troškova.",
  },
];

/** Brand boxes, in the order they appear on the homepage. */
const HOME_BRAND_SLUGS = ["gopro-kamere", "jbl-zvucnici", "karcher", "dji"];

const FEATURED_LIMIT = 8;

// Product rows: on a phone one row that scrolls sideways (57 full-width cards
// stacked would make the page endless), a regular grid from the sm breakpoint.
const PRODUCT_ROW =
  "flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-6 pt-2 sm:mx-0 sm:px-0 sm:pb-0 sm:pt-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4";
const PRODUCT_ROW_ITEM = "w-[78%] max-w-[300px] shrink-0 snap-start sm:w-auto sm:max-w-none [&>*]:h-full";

export default async function HomePage() {
  const supabase = createPublicClient();

  const [
    { data: productRows, error: productsErr },
    { data: categoryRows, error: categoriesErr },
    { data: testimonials, error: testimonialsErr },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .eq("is_active", true)
      .order("sort_order")
      .order("slug"),
    supabase.from("categories").select("id, name, slug, color, sort_order").order("sort_order"),
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .limit(6),
  ]);

  // Homepage degrades gracefully (sections hide if empty), but log failures.
  if (productsErr || categoriesErr || testimonialsErr) {
    console.error("Homepage data query failed:", productsErr || categoriesErr || testimonialsErr);
  }

  const products = (productRows ?? []) as unknown as ProductWithCategory[];
  const featured = products.filter((p) => p.is_featured).slice(0, FEATURED_LIMIT);

  const productById = new Map(products.map((p) => [p.id, p]));

  // Every category that has something to rent, in admin order, with its
  // products: feeds both the category boxes and the full list below. Same
  // contents as the category page, so the counts agree: a category's own
  // products plus the ones it shows from elsewhere (GoPro under audio-video).
  const groups = (categoryRows ?? [])
    .map((c) => {
      const extraIds = extraProductIdsForCategory(c.slug);
      const extras = extraIds.map((id) => productById.get(id)).filter((p): p is ProductWithCategory => Boolean(p));
      return {
        category: c,
        products: withExtraProducts(products.filter((p) => p.category_id === c.id), extras, extraIds),
      };
    })
    .filter((g) => g.products.length > 0);
  const homeCategories: HomeCategory[] = groups.map((g) => ({
    slug: g.category.slug,
    name: g.category.name,
    color: g.category.color,
    productCount: g.products.length,
  }));

  const brands: HomeBrand[] = HOME_BRAND_SLUGS.flatMap((slug) => {
    const hub = getLandingPage(slug);
    if (!hub) return [];
    const showcase = productById.get(hub.showcaseProductId);
    return [
      {
        slug: hub.slug,
        name: hub.brandName,
        label: hub.navLabel,
        logo: hub.brandLogo,
        productImage: showcase?.hero_image_url ?? null,
        productName: showcase?.name ?? null,
      },
    ];
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(localBusinessSchema) }}
      />

      {/* HERO */}
      <section
        className="relative flex items-center justify-center text-white px-4 overflow-hidden"
        style={{ minHeight: "25vh" }}
      >
        {/* Background image */}
        <Image
          src="/rentanje-com-hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/80 to-[#1A1A2E]/90" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center py-10">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
            Najam opreme u Zagrebu
          </h1>
          <p className="font-display text-xl sm:text-2xl font-semibold mb-2">
            Iznajmi, uživaj, vrati.
          </p>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Oprema za evente, roštilj, kamp i zabavu. Dostava u Zagreb i okolicu.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <HomeCategoryBoxes categories={homeCategories} />

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="bg-[#F0F4FF] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-text">
                Istaknuti proizvodi
              </h2>
              <Link
                href="/oprema"
                className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-dark"
              >
                Sve <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className={PRODUCT_ROW}>
              {featured.map((p) => (
                <div key={p.id} className={PRODUCT_ROW_ITEM}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BRANDS */}
      <HomeBrandBoxes brands={brands} />

      {/* ALL PRODUCTS, grouped by category */}
      {groups.length > 0 && (
        <section className="bg-[#F0F4FF] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-text mb-2 text-center">
              Sva oprema za najam
            </h2>
            <p className="text-brand-muted text-center mb-10">
              {products.length} proizvoda, poredano po kategorijama.
              <span className="sm:hidden"> Povucite red ulijevo za više.</span>
            </p>
            <div className="space-y-12">
              {groups.map((g) => (
                <div key={g.category.slug}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-text">
                      <Link href={`/najam/${g.category.slug}`} className="hover:text-brand-primary transition-colors">
                        {g.category.name}
                      </Link>
                    </h3>
                    <Link
                      href={`/najam/${g.category.slug}`}
                      className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-dark shrink-0"
                    >
                      Kategorija <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className={PRODUCT_ROW}>
                    {g.products.map((p) => (
                      <div key={p.id} className={PRODUCT_ROW_ITEM}>
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-text mb-10 text-center">
          Zašto rentanje.com?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {whyUs.map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow-card p-8 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-brand-light flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="font-display font-bold text-brand-text mb-2 text-lg">{item.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-brand-light py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-text mb-8 text-center">
              Što kažu naši klijenti
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white rounded-lg shadow-card p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-brand-text text-sm leading-relaxed mb-4">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-sm text-brand-text">{t.author_name}</div>
                    {t.author_role && (
                      <div className="text-xs text-brand-muted">{t.author_role}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA + CONTACT */}
      <HomeCTAContact />
    </>
  );
}
