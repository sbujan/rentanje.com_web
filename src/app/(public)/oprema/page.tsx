import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sva oprema za iznajmljivanje",
  description:
    "Pregledajte svu opremu dostupnu za iznajmljivanje — audio, video, event, roštilj, kamp i outdoor. Pošaljite upit danas! | rentanje.com",
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-text">
          Sva oprema za iznajmljivanje
        </h1>
        <p className="text-brand-muted mt-2">
          Iznajmite opremu za svaku prigodu — evente, roštilj, kamp i još mnogo toga.
        </p>
      </div>

      <ProductsClient
        products={(products ?? []) as any}
        categories={categories ?? []}
      />
    </main>
  );
}
