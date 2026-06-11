import type { Metadata } from "next";
import PageHero from "@/components/public/PageHero";

export const metadata: Metadata = {
  title: "Uvjeti odgovornosti",
  robots: { index: false },
};

export default function UvjetiOdgovornostiPage() {
  return (
    <>
      <PageHero
        title="Uvjeti odgovornosti"
        subtitle="Odgovornosti korisnika i tvrtke pri iznajmljivanju opreme."
        breadcrumbs={[{ href: "/", label: "Početna" }, { label: "Uvjeti odgovornosti" }]}
        color="#FFD166"
      />
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-sm text-brand-muted mb-8">Zadnja izmjena: 1. siječnja 2025.</p>

      <div className="prose prose-sm max-w-none text-brand-text space-y-6">
        <section>
          <h2 className="font-display font-bold text-lg">1. Preuzimanje opreme</h2>
          <p>Korisnik preuzimanjem opreme potvrđuje da je ista u ispravnom stanju i bez vidljivih oštećenja. Eventualne primjedbe potrebno je prijaviti u trenutku preuzimanja.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">2. Odgovornost za oštećenja</h2>
          <p>Korisnik je materijalno odgovoran za sva oštećenja, gubitak ili uništenje iznajmljene opreme za vrijeme trajanja najma. Troškovi popravka ili zamjene naplaćuju se po tržišnoj cijeni.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">3. Depozit</h2>
          <p>Za određenu opremu naplaćuje se povratni depozit koji se vraća nakon preuzimanja i provjere ispravnosti opreme. Iznos depozita naveden je uz svaki takav proizvod.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">4. Ograničenje odgovornosti</h2>
          <p>rentanje.com ne odgovara za posrednu štetu nastalu kao posljedica korištenja ili nemogućnosti korištenja iznajmljene opreme. Naša odgovornost ograničena je na iznos naknade za iznajmljivanje.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">5. Sigurnost</h2>
          <p>Korisnik se obvezuje koristiti opremu u skladu s uputama za korištenje i na siguran način. rentanje.com nije odgovoran za ozljede ili štetu nastalu nepropisnim korištenjem opreme.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">6. Kontakt</h2>
          <p>Za pitanja: <a href="mailto:info@rentanje.com" className="text-brand-primary underline">info@rentanje.com</a></p>
        </section>
      </div>
    </main>
    </>
  );
}
