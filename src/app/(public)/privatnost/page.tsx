import type { Metadata } from "next";
import PageHero from "@/components/public/PageHero";

export const metadata: Metadata = {
  title: "Politika privatnosti — rentanje.com",
  robots: { index: false },
};

export default function PrivatnostPage() {
  return (
    <>
      <PageHero
        title="Politika privatnosti"
        subtitle="Kako prikupljamo i čuvamo vaše osobne podatke."
        breadcrumbs={[{ href: "/", label: "Početna" }, { label: "Privatnost" }]}
        color="#BCA7F0"
      />
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-sm text-brand-muted mb-8">Zadnja izmjena: 1. siječnja 2025.</p>

      <div className="prose prose-sm max-w-none text-brand-text space-y-6">
        <section>
          <h2 className="font-display font-bold text-lg">1. Upravljač podacima</h2>
          <p>Upravljač osobnih podataka je List 360 d.o.o., Zagreb, OIB: 30800965664. Kontakt: <a href="mailto:info@rentanje.com" className="text-brand-primary underline">info@rentanje.com</a></p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">2. Koje podatke prikupljamo</h2>
          <p>Prikupljamo samo podatke koje nam vi direktno dajete putem obrazaca na stranici:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ime i prezime</li>
            <li>E-mail adresa</li>
            <li>Broj telefona</li>
            <li>Adresa dostave (opcionalno)</li>
            <li>Poruka / napomena (opcionalno)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">3. Svrha obrade</h2>
          <p>Podatke koristimo isključivo za:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Odgovaranje na vaš upit za iznajmljivanje</li>
            <li>Potvrdu i organizaciju rezervacije</li>
            <li>Komunikaciju u svrhu pružanja usluge</li>
          </ul>
          <p>Ne koristimo vaše podatke za marketinške svrhe bez vaše izričite suglasnosti.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">4. Pohrana podataka</h2>
          <p>Podaci se pohranjuju na sigurnim serverima (Supabase, EU). Čuvamo ih onoliko dugo koliko je potrebno za ispunjenje usluge, a najdulje 2 godine od zadnjeg kontakta.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">5. Vaša prava</h2>
          <p>Imate pravo na pristup, ispravak, brisanje i prenosivost vaših podataka. Za ostvarivanje prava kontaktirajte nas na <a href="mailto:info@rentanje.com" className="text-brand-primary underline">info@rentanje.com</a>.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">6. Kolačići (cookies)</h2>
          <p>Stranica koristi isključivo funkcionalne kolačiće potrebne za rad košarice (localStorage). Ne koristimo kolačiće za praćenje bez vaše suglasnosti.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg">7. Analitika</h2>
          <p>Koristimo Google Analytics 4 za anonimnu analizu prometa (bez osobnih podataka). IP adrese su anonimizirane.</p>
        </section>
      </div>
    </main>
    </>
  );
}
