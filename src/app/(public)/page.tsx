import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/public/ProductCard";
import { Phone, Package, Star, ArrowRight, CheckCircle } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Iznajmljivanje opreme — rentanje.com",
  description:
    "Iznajmite audio, video, event, roštilj, kamp i outdoor opremu u Zagrebu. Brza dostava, povoljne cijene. Pošaljite upit danas!",
};

const PHONE = "+385 95 204 4414";
const PHONE_HREF = "tel:+385952044414";

const categoryCards = [
  { slug: "audio-video-oprema", name: "Audio i video", emoji: "🎵", color: "#6366F1" },
  { slug: "oprema-za-evente", name: "Evente i zabava", emoji: "🎉", color: "#F05554" },
  { slug: "rostilj-kuhanje", name: "Roštilj i kuhanje", emoji: "🔥", color: "#F97316" },
  { slug: "kamp-outdoor", name: "Kamp i outdoor", emoji: "⛺", color: "#22C55E" },
  { slug: "alati-ciscenje", name: "Alati i čišćenje", emoji: "🔧", color: "#EAB308" },
  { slug: "ostalo", name: "Ostalo", emoji: "📦", color: "#8B5CF6" },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "rentanje.com — List 360 d.o.o.",
  telephone: "+385952044414",
  url: "https://rentanje.com",
  address: { "@type": "PostalAddress", addressCountry: "HR", addressLocality: "Zagreb" },
  openingHours: "Mo-Fr 08:00-17:00",
  priceRange: "€€",
  description: "Iznajmljivanje opreme za evente, roštilj, kamp i audio/video u Hrvatskoj.",
};

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featured }, { data: testimonials }] = await Promise.all([
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Iznajmi, uživaj, vrati.
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Oprema za evente, roštilj, kamp i zabavu — dostava u Zagreb i okolicu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/oprema"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary font-bold px-8 py-3 rounded-lg hover:bg-brand-light transition-colors text-base"
            >
              <Package className="h-5 w-5" />
              Pregledaj opremu
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-base"
            >
              <Phone className="h-5 w-5" />
              {PHONE}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-white/70">
            {["Preuzimanje u Zagrebu", "Dostava 10 € (Zagreb)", "Odgovor <24h", "Bez naknade za rezervaciju"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-brand-accent2" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-text mb-8 text-center">
          Što možete iznajmiti?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryCards.map((cat) => (
            <Link
              key={cat.slug}
              href={`/najam/${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-card hover:shadow-md transition-all hover:-translate-y-0.5 text-center group"
            >
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: cat.color + "20" }}
              >
                {cat.emoji}
              </div>
              <span className="text-sm font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured && featured.length > 0 && (
        <section className="bg-gray-50 py-16">
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
              {featured.map((p) => (
                <ProductCard key={p.id} product={p as any} />
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
          {[
            { icon: "⚡", title: "Brz odgovor", desc: "Odgovaramo na sve upite unutar 24 sata, radnim danima i vikendom." },
            { icon: "🚚", title: "Dostava u Zagreb", desc: "Dostavljamo opremu na vašu adresu u Zagrebu za samo 10 €." },
            { icon: "💰", title: "Povoljne cijene", desc: "Iznajmite skupu opremu po pristupačnoj cijeni, bez skrivenih troškova." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow-card p-6 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-display font-bold text-brand-text mb-2">{item.title}</h3>
              <p className="text-brand-muted text-sm">{item.desc}</p>
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

      {/* CTA BAND */}
      <section className="bg-brand-primary text-white py-14 text-center px-4">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
          Trebate opremu? Javite se!
        </h2>
        <p className="text-white/80 mb-6">Pošaljite upit ili nas nazovite — odgovaramo brzo.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/upit"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary font-bold px-8 py-3 rounded-lg hover:bg-brand-light transition-colors"
          >
            Pošalji upit
          </Link>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Phone className="h-5 w-5" />
            {PHONE}
          </a>
        </div>
      </section>
    </>
  );
}
