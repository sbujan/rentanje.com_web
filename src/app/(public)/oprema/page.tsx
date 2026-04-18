import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";
import PageHero from "@/components/public/PageHero";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sva oprema za iznajmljivanje",
  description:
    "Pregledajte svu opremu dostupnu za iznajmljivanje — audio, video, event, roštilj, kamp i outdoor. Pošaljite upit danas! | rentanje.com",
  alternates: { canonical: "https://rentanje.com/oprema" },
  openGraph: {
    title: "Sva oprema za iznajmljivanje",
    description:
      "Pregledajte svu opremu dostupnu za iznajmljivanje — audio, video, event, roštilj, kamp i outdoor.",
    url: "https://rentanje.com/oprema",
    siteName: "rentanje.com",
    type: "website",
    locale: "hr_HR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sva oprema za iznajmljivanje",
    description: "Audio, video, event, roštilj, kamp i outdoor oprema za iznajmljivanje.",
  },
};

export default async function OpremaPage() {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .eq("is_active", true)
      .order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  return (
    <main>
      <PageHero
        title="Sva oprema za iznajmljivanje"
        subtitle="Iznajmite opremu za svaku prigodu — evente, roštilj, kamp i još mnogo toga."
        breadcrumbs={[{ href: "/", label: "Početna" }, { label: "Oprema" }]}
        color="#01D2D6"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <ProductsClient
          products={(products ?? []) as any}
          categories={categories ?? []}
        />
      </div>
    </main>
  );
}
