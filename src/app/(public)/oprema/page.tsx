import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import type { ProductWithCategory } from "@/types/product";
import ProductsClient from "./ProductsClient";
import PageHero from "@/components/public/PageHero";

export const revalidate = 3600;

const DEFAULT_TITLE = "Sva oprema za iznajmljivanje | rentanje.com";
const DEFAULT_DESCRIPTION =
  "Pregledajte svu opremu dostupnu za iznajmljivanje — audio, video, event, roštilj, kamp i outdoor. Pošaljite upit danas!";

export const metadata: Metadata = {
  // /oprema?cat=<slug> is permanent-redirected to /najam/<slug> in next.config.mjs,
  // so metadata only needs to cover the unfiltered catalog.
  title: { absolute: DEFAULT_TITLE },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "https://rentanje.com/oprema" },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "https://rentanje.com/oprema",
    siteName: "rentanje.com",
    type: "website",
    locale: "hr_HR",
    images: [{ url: "/rentanje-najam-zagreb-iznajmi.jpg", width: 1254, height: 1254, alt: "RENTANJE.COM — Ne kupuj, iznajmi." }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/rentanje-najam-zagreb-iznajmi.jpg"],
  },
};

export default async function OpremaPage() {
  const supabase = createPublicClient();

  const [
    { data: products, error: productsErr },
    { data: categories, error: categoriesErr },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .eq("is_active", true)
      .order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  // Listing degrades to empty-state on failure, but the failure must be observable.
  if (productsErr || categoriesErr) {
    console.error("Oprema listing query failed:", productsErr || categoriesErr);
  }

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
          products={(products ?? []) as unknown as ProductWithCategory[]}
          categories={categories ?? []}
        />
      </div>
    </main>
  );
}
