import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Phone, ArrowLeft } from "lucide-react";
import { SITE_PHONE, SITE_PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Upit primljen",
  robots: { index: false },
};

export default function HvalaPage() {
  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
      </div>

      <h1 className="font-display text-3xl font-bold text-brand-text mb-3">
        Upit je primljen!
      </h1>
      <p className="text-brand-muted text-base mb-2">
        Hvala! Kontaktirat ćemo vas u roku od 1 radnog dana s potvrdom dostupnosti i
        detaljima rezervacije.
      </p>
      <p className="text-brand-muted text-sm mb-8">
        Provjeri e-mail — poslan vam je sažetak upita.
      </p>

      <div className="bg-brand-light rounded-xl px-6 py-5 mb-8 inline-flex items-center gap-3 mx-auto">
        <Phone className="h-5 w-5 text-brand-primary flex-shrink-0" />
        <div className="text-left">
          <p className="text-xs text-brand-muted">Hitno? Nazovite direktno:</p>
          <a
            href={SITE_PHONE_HREF}
            className="font-bold text-brand-text text-lg hover:text-brand-primary transition-colors"
          >
            {SITE_PHONE}
          </a>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
        <h2 className="font-display font-bold text-brand-text mb-4 text-center">
          Što dalje?
        </h2>
        <ol className="space-y-3">
          {[
            "Provjeravamo dostupnost opreme za vaše datume.",
            "Šaljemo potvrdu e-mailom u roku od 1 radnog dana.",
            "Dogovaramo preuzimanje ili dostavu.",
          ].map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-brand-muted leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/oprema"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-brand-text px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Nastavi pregledavati
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Na početnu stranicu
        </Link>
      </div>
    </main>
  );
}
