import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Package, Phone } from "lucide-react";
import PageHero from "@/components/public/PageHero";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Paketi za iznajmljivanje — rentanje.com",
  description:
    "Iznajmite gotove pakete opreme za evente, roštilj, kamp i zabavu. Sve u jednom, uz popust. | rentanje.com",
};

const PHONE = "+385 95 204 4414";
const PHONE_HREF = "tel:+385952044414";

export default async function PaketiPage() {
  const supabase = await createClient();

  const { data: bundles } = await supabase
    .from("bundles")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false });

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
                  <a
                    href={PHONE_HREF}
                    className="mt-auto flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    Rezerviraj paket
                  </a>
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
