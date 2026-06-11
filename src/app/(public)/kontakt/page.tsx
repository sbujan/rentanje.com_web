import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import KontaktForm from "./KontaktForm";
import { SITE_PHONE as PHONE, SITE_PHONE_HREF as PHONE_HREF } from "@/lib/site";

// Layout template appends "| rentanje.com" to the bare title.
const TITLE = "Kontakt";
const OG_TITLE = "Kontakt | rentanje.com";
const DESCRIPTION =
  "Nazovite, napišite ili svratite. Odgovaramo u roku od 1 radnog dana. Zagreb, Naserov trg 4.";
const CANONICAL = "https://rentanje.com/kontakt";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: OG_TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: "rentanje.com",
    type: "website",
    locale: "hr_HR",
    images: [{ url: "/rentanje-najam-zagreb-iznajmi.jpg", width: 1254, height: 1254, alt: "RENTANJE.COM — Ne kupuj, iznajmi." }],
  },
  twitter: {
    card: "summary",
    title: OG_TITLE,
    description: DESCRIPTION,
    images: ["/rentanje-najam-zagreb-iznajmi.jpg"],
  },
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        title="Kontakt"
        subtitle="Odgovaramo u roku od 1 radnog dana."
        breadcrumbs={[{ href: "/", label: "Početna" }, { label: "Kontakt" }]}
        color="#FF8E6C"
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          {/* Contact form */}
          <div className="bg-white border border-gray-100 rounded-xl p-7">
            <h2 className="font-display font-bold text-lg text-brand-text mb-5">Pošaljite poruku</h2>
            <KontaktForm />
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="bg-brand-light rounded-xl p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-brand-text">Direktni kontakt</h2>

              <a href={PHONE_HREF} className="flex items-center gap-3 hover:text-brand-primary transition-colors group">
                <div className="h-9 w-9 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted">Telefon</p>
                  <p className="font-bold text-brand-text">{PHONE}</p>
                </div>
              </a>

              <a href="mailto:info@rentanje.com" className="flex items-center gap-3 hover:text-brand-primary transition-colors group">
                <div className="h-9 w-9 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted">E-mail</p>
                  <p className="font-medium text-brand-text">info@rentanje.com</p>
                </div>
              </a>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted">Lokacija</p>
                  <p className="font-medium text-brand-text">Naserov trg 4, Zagreb</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted">Dostupnost</p>
                  <p className="font-medium text-brand-text">Svaki dan, 8–20h</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <p className="text-xs text-brand-muted">
                <strong className="text-brand-text">List 360 d.o.o.</strong><br />
                OIB: 30800965664<br />
                Naserov trg 4, Zagreb
              </p>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-10 rounded-xl overflow-hidden border border-gray-100" style={{ height: 360 }}>
          <iframe
            src="https://maps.google.com/maps?q=Naserov+trg+4,+Zagreb&t=m&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokacija — Naserov trg 4, Zagreb"
          />
        </div>
      </main>
    </>
  );
}
