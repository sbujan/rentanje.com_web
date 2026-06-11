import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/server";
import { jsonLdSafe } from "@/lib/seo";
import type { ProductWithCategory } from "@/types/product";
import ProductCard from "@/components/public/ProductCard";
import { CategoryAccordion } from "@/components/ui/interactive-image-accordion";
import HomeCTAContact from "@/components/public/HomeCTAContact";
import { Star, ArrowRight, Zap, Truck, BadgeCent } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  // `absolute` bypasses the layout template so the homepage isn't double-suffixed.
  title: { absolute: "Iznajmljivanje opreme u Zagrebu | rentanje.com" },
  description:
    "Iznajmite audio, video, event, roštilj, kamp i outdoor opremu u Zagrebu. Brza dostava, povoljne cijene. Pošaljite upit danas!",
  alternates: { canonical: "https://rentanje.com/" },
  openGraph: {
    title: "Iznajmljivanje opreme u Zagrebu | rentanje.com",
    description:
      "Iznajmite audio, video, event, roštilj, kamp i outdoor opremu u Zagrebu. Brza dostava, povoljne cijene.",
    url: "https://rentanje.com/",
    siteName: "rentanje.com",
    type: "website",
    locale: "hr_HR",
    images: [{ url: "/rentanje-najam-zagreb-iznajmi.jpg", width: 1254, height: 1254, alt: "RENTANJE.COM — Ne kupuj, iznajmi." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iznajmljivanje opreme u Zagrebu | rentanje.com",
    description: "Iznajmite audio, video, event, roštilj, kamp i outdoor opremu u Zagrebu.",
    images: ["/rentanje-najam-zagreb-iznajmi.jpg"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "rentanje.com — List 360 d.o.o.",
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
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "rentanje.com",
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
};

const whyUs = [
  {
    icon: <Zap className="h-8 w-8 text-brand-primary" strokeWidth={1.5} />,
    title: "Brz odgovor",
    desc: "Odgovaramo u roku od 1 radnog dana, dostupni svaki dan 8–20h.",
  },
  {
    icon: <Truck className="h-8 w-8 text-brand-primary" strokeWidth={1.5} />,
    title: "Dostava u Zagreb",
    desc: "Dostavljamo opremu na vašu adresu u Zagrebu za samo 10 €.",
  },
  {
    icon: <BadgeCent className="h-8 w-8 text-brand-primary" strokeWidth={1.5} />,
    title: "Povoljne cijene",
    desc: "Iznajmite skupu opremu po pristupačnoj cijeni, bez skrivenih troškova.",
  },
];

export default async function HomePage() {
  const supabase = createPublicClient();

  const [
    { data: featured, error: featuredErr },
    { data: testimonials, error: testimonialsErr },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order")
      .limit(8),
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .limit(6),
  ]);

  // Homepage degrades gracefully (sections hide if empty), but log failures.
  if (featuredErr || testimonialsErr) {
    console.error("Homepage data query failed:", featuredErr || testimonialsErr);
  }

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
            Iznajmi, uživaj, vrati.
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Oprema za evente, roštilj, kamp i zabavu. Dostava u Zagreb i okolicu.
          </p>
        </div>
      </section>

      {/* WHAT CAN YOU RENT — Image Accordion */}
      <CategoryAccordion />

      {/* FEATURED PRODUCTS */}
      {featured && featured.length > 0 && (
        <section className="bg-[#F0F4FF] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-text">
                Popularna oprema
              </h2>
              <Link
                href="/oprema"
                className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-dark"
              >
                Sve <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(featured as unknown as ProductWithCategory[]).map((p) => (
                <ProductCard key={p.id} product={p} />
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
