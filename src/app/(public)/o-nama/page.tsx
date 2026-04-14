import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import PageHero from "@/components/public/PageHero";

export const metadata: Metadata = {
  title: "O nama — rentanje.com",
  description:
    "Saznajte više o rentanje.com — Zagreb. Iznajmljujemo audio/video, event, roštilj, kamp i outdoor opremu. List 360 d.o.o.",
  openGraph: {
    title: "O nama — rentanje.com",
    description: "Saznajte više o rentanje.com — iznajmljivanje opreme iz Zagreba. List 360 d.o.o.",
    url: "https://rentanje.com/o-nama",
    siteName: "rentanje.com",
    type: "website",
  },
  twitter: { card: "summary", title: "O nama — rentanje.com" },
};

const PHONE = "+385 95 204 4414";
const PHONE_HREF = "tel:+385952044414";

const values = [
  { title: "Brz odgovor", desc: "Odgovaramo na svaki upit u roku od 1–2 sata, radnim danima i vikendom." },
  { title: "Čista i testirana oprema", desc: "Svaki proizvod čistimo i testiramo nakon svakog iznajmljivanja." },
  { title: "Bez skrivenih troškova", desc: "Cijena je cijena. Nema naknade za rezervaciju ni iznenađenja." },
  { title: "Lokalno, iz Zagreba", desc: "Dostupni smo za dostavu i preuzimanje u Zagrebu i okolici." },
];

export default function ONamaPage() {
  return (
    <main>
      <PageHero
        title="O nama"
        subtitle="rentanje.com je platforma za iznajmljivanje opreme u Zagrebu i okolici — jednostavna ideja, jednostavan servis."
        breadcrumbs={[{ href: "/", label: "Početna" }, { label: "O nama" }]}
        color="#6EE7B7"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

      <div className="prose prose-sm max-w-none text-brand-text mb-12 space-y-4">
        <p>
          Iza rentanje.com stoji{" "}
          <strong>List 360 d.o.o.</strong>, tvrtka sa sjedištem u Zagrebu.
          Bavimo se iznajmljivanjem audio/video opreme, event opreme, roštilja,
          kamping opreme i svega što vam treba za savršen event na otvorenom.
        </p>
        <p>
          Naš cilj je jednostavan: vi se fokusirate na zabavu, mi brinemo za
          opremu. Donosimo, preuzimamo, a ako nešto ne radi — nazovite nas i
          riješit ćemo problem.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {values.map((v) => (
          <div key={v.title} className="flex gap-3 p-5 bg-brand-light rounded-xl border border-gray-100">
            <CheckCircle className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-brand-text">{v.title}</p>
              <p className="text-sm text-brand-muted mt-0.5">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact box */}
      <div className="bg-white border border-gray-100 rounded-xl p-7 space-y-4">
        <h2 className="font-display font-bold text-xl text-brand-text">Kontakt</h2>
        <div className="space-y-2.5">
          <a href={PHONE_HREF} className="flex items-center gap-3 text-brand-text hover:text-brand-primary transition-colors">
            <Phone className="h-4 w-4 text-brand-primary" />
            <span className="font-medium">{PHONE}</span>
          </a>
          <a href="mailto:info@rentanje.com" className="flex items-center gap-3 text-brand-text hover:text-brand-primary transition-colors">
            <Mail className="h-4 w-4 text-brand-primary" />
            <span>info@rentanje.com</span>
          </a>
          <div className="flex items-center gap-3 text-brand-muted">
            <MapPin className="h-4 w-4 text-brand-primary flex-shrink-0" />
            <span>Naserov trg 4, Zagreb</span>
          </div>
        </div>
        <p className="text-xs text-brand-muted pt-2 border-t border-gray-100">
          List 360 d.o.o. · OIB: 30800965664
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/oprema"
          className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Pregledaj opremu
        </Link>
        <Link
          href="/kontakt"
          className="border border-gray-200 text-brand-text px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Pošalji poruku
        </Link>
      </div>
      </div>
    </main>
  );
}
