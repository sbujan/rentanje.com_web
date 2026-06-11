import type { Metadata } from "next";
import PageHero from "@/components/public/PageHero";

export const metadata: Metadata = {
  title: "Uvjeti korištenja",
  robots: { index: false },
};

const UPDATED = "1. siječnja 2025.";

export default function UvjetiKoristenjaPage() {
  return (
    <>
      <PageHero
        title="Uvjeti korištenja"
        subtitle="Pravila i uvjeti korištenja usluga rentanje.com."
        breadcrumbs={[{ href: "/", label: "Početna" }, { label: "Uvjeti korištenja" }]}
        color="#FF8E6C"
      />
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-sm text-brand-muted mb-8">Zadnja izmjena: {UPDATED}</p>

      <div className="prose prose-sm max-w-none text-brand-text space-y-6">
        <section>
          <h2 className="font-display font-bold text-lg">1. Opće odredbe</h2>
          <p>Korištenjem web stranice rentanje.com i usluga koje pruža List 360 d.o.o. (dalje: &ldquo;mi&rdquo;, &ldquo;rentanje.com&rdquo;) prihvaćate ove Uvjete korištenja. Ukoliko se ne slažete s uvjetima, molimo vas da ne koristite naše usluge.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">2. Usluga iznajmljivanja</h2>
          <p>rentanje.com omogućuje iznajmljivanje opreme za privatne i poslovne potrebe. Svaki upit šalje se putem web obrasca, nakon čega vas kontaktiramo radi potvrde dostupnosti i dogovora o preuzimanju ili dostavi.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Rezervacija postaje valjana tek nakon pisane potvrde s naše strane.</li>
            <li>Cijena iznajmljivanja navedena na web stranici je okvirna i može se razlikovati ovisno o trajanju i specifičnim uvjetima.</li>
            <li>Minimalni period iznajmljivanja naveden je uz svaki proizvod.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">3. Obveze korisnika</h2>
          <p>Korisnik se obvezuje:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Opremu koristiti isključivo u svrhu za koju je namijenjena.</li>
            <li>Vrati opremu u istom stanju u kakvom je preuzeta, unutar dogovorenog roka.</li>
            <li>Odmah prijaviti eventualna oštećenja ili kvarove.</li>
            <li>Ne davati opremu trećim osobama bez naše izričite suglasnosti.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">4. Odgovornost za štetu</h2>
          <p>Korisnik snosi materijalnu odgovornost za oštećenja, gubitak ili uništenje opreme nastalo za vrijeme trajanja iznajmljivanja. Za pojedine proizvode naplaćuje se povratni depozit koji se vraća nakon provjere opreme.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">5. Otkazivanje</h2>
          <p>Otkazivanje rezervacije moguće je bez naknade najkasnije 48 sati prije dogovorenog termina preuzimanja. Za kasnija otkazivanja zadržavamo pravo naplate administrativne naknade.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">6. Izmjene uvjeta</h2>
          <p>Zadržavamo pravo izmjene ovih Uvjeta korištenja u bilo koje vrijeme. Izmijenjeni uvjeti stupaju na snagu objavom na ovoj stranici.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">7. Kontakt</h2>
          <p>Za sva pitanja u vezi uvjeta korištenja možete nas kontaktirati na <a href="mailto:info@rentanje.com" className="text-brand-primary underline">info@rentanje.com</a> ili na broj <a href="tel:+385952044414" className="text-brand-primary underline">+385 95 204 4414</a>.</p>
        </section>
      </div>
    </main>
    </>
  );
}
