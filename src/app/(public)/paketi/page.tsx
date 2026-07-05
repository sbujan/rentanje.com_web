import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/server";
import { Package, Phone, ChevronRight } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import { SITE_PHONE as PHONE, SITE_PHONE_HREF as PHONE_HREF } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  // Layout template appends "| rentanje.com".
  title: "Paketi opreme za najam — event, roštilj, kamp",
  description:
    "Iznajmite gotove pakete opreme za evente, roštilj, kamp i zabavu. Sve u jednom, uz popust. | rentanje.com",
  alternates: { canonical: "https://rentanje.com/paketi" },
  openGraph: {
    title: "Paketi opreme za najam — event, roštilj, kamp | rentanje.com",
    description: "Gotove kombinacije opreme za vaš event, roštilj ili kamp izlet — sve u jednom, uz popust.",
    url: "https://rentanje.com/paketi",
    siteName: "rentanje.com",
    type: "website",
    locale: "hr_HR",
    images: [{ url: "/rentanje-najam-zagreb-iznajmi.jpg", width: 1254, height: 1254, alt: "RENTANJE.COM — Ne kupuj, iznajmi." }],
  },
  twitter: { card: "summary_large_image", title: "Paketi opreme za najam — event, roštilj, kamp | rentanje.com", images: ["/rentanje-najam-zagreb-iznajmi.jpg"] },
};

export default async function PaketiPage() {
  const supabase = createPublicClient();

  const { data: bundles, error: bundlesErr } = await supabase
    .from("bundles")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false });

  // Degrade to "Paketi uskoro!" empty-state, but make the failure observable.
  if (bundlesErr) console.error("Bundles listing query failed:", bundlesErr);

  return (
    <main>
      <PageHero
        title="Paketi za iznajmljivanje"
        subtitle="Gotove kombinacije opreme za vaš event, roštilj ili kamp izlet — sve u jednom, uz popust."
        breadcrumbs={[{ href: "/", label: "Početna" }, { label: "Paketi" }]}
        color="#FF6B6B"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {bundles && bundles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <div key={bundle.id} className="bg-white rounded-xl shadow-card overflow-hidden flex flex-col">
                {/* Image */}
                <div className="relative aspect-[16/9] bg-gray-100">
                  {bundle.hero_image_url ? (
                    <Image
                      src={bundle.hero_image_url}
                      alt={bundle.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-light">
                      <Package className="h-12 w-12 text-brand-primary/40" />
                    </div>
                  )}
                  {bundle.discount_value && (
                    <span className="absolute top-3 right-3 bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {bundle.discount_type === "percent"
                        ? `-${bundle.discount_value}%`
                        : `-${bundle.discount_value} €`}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-display font-bold text-brand-text text-lg mb-2">
                    {bundle.name}
                  </h2>
                  {bundle.description && (
                    <p className="text-sm text-brand-muted leading-relaxed mb-4 flex-1">
                      {bundle.description}
                    </p>
                  )}
                  <Link
                    href={`/paketi/${bundle.slug}`}
                    className="mt-auto flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Pogledaj paket
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No bundles yet — coming soon */
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-brand-primary" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl font-bold text-brand-text mb-3">
              Paketi uskoro!
            </h2>
            <p className="text-brand-muted max-w-md mx-auto mb-8">
              Pripremamo gotove pakete opreme za vaše evente, roštilj i kamp avanture.
              Za sada nas nazovite i složit ćemo paket po mjeri.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Phone className="h-5 w-5" />
                {PHONE}
              </a>
              <Link
                href="/oprema"
                className="inline-flex items-center justify-center gap-2 border-2 border-brand-primary text-brand-primary font-bold px-8 py-3 rounded-lg hover:bg-brand-light transition-colors"
              >
                Pregledaj svu opremu
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
