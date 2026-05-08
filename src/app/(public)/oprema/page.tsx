import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";
import PageHero from "@/components/public/PageHero";

export const revalidate = 3600;

interface PageProps {
  searchParams?: { cat?: string };
}

const DEFAULT_TITLE = "Sva oprema za iznajmljivanje | rentanje.com";
const DEFAULT_DESCRIPTION =
  "Pregledajte svu opremu dostupnu za iznajmljivanje — audio, video, event, roštilj, kamp i outdoor. Pošaljite upit danas!";

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const cat = searchParams?.cat;

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;
  let canonical = "https://rentanje.com/oprema";

  if (cat) {
    const supabase = await createClient();
    const { data: category } = await supabase
      .from("categories")
      .select("name, seo_title, seo_description")
      .eq("slug", cat)
      .single();

    if (category) {
      title =
        category.seo_title ??
        `Najam ${category.name.toLowerCase()} u Zagrebu | rentanje.com`;
      description =
        category.seo_description ??
        `Iznajmite ${category.name.toLowerCase()} u Zagrebu. Povoljne cijene, brza dostava. Pošaljite upit danas!`;
      canonical = `https://rentanje.com/oprema?cat=${cat}`;
    }
  }

  return {
    // Seeded titles already include "| rentanje.com", so bypass the layout template.
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "rentanje.com",
      type: "website",
      locale: "hr_HR",
      images: [{ url: "/rentanje-com-hero.jpg", width: 1200, height: 630, alt: "rentanje.com" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/rentanje-com-hero.jpg"],
    },
  };
}

export default async function OpremaPage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name, color, slug)")
      .eq("is_active", true)
      .order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  const requestedCat = searchParams?.cat;
  const activeCategory = (categories ?? []).some((c) => c.slug === requestedCat)
    ? requestedCat
    : undefined;

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
          activeCategory={activeCategory}
        />
      </div>
    </main>
  );
}
