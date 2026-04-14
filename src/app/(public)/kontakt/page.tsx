"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle } from "lucide-react";
import PageHero from "@/components/public/PageHero";

const PHONE = "+385 95 204 4414";
const PHONE_HREF = "tel:+385952044414";

export default function KontaktPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <PageHero
        title="Kontakt"
        subtitle="Odgovaramo u roku 1–2 sata, svaki dan."
        breadcrumbs={[{ href: "/", label: "Početna" }, { label: "Kontakt" }]}
        color="#FF8E6C"
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* Contact form */}
        <div className="bg-white border border-gray-100 rounded-xl p-7">
          <h2 className="font-display font-bold text-lg text-brand-text mb-5">Pošaljite poruku</h2>

          {status === "ok" ? (
            <div className="text-center py-10">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-brand-text">Poruka je poslana!</p>
              <p className="text-sm text-brand-muted mt-1">Javit ćemo vam se uskoro.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">Ime i prezime</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Ana Anić"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="ana@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Poruka</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  placeholder="Što vas zanima? Možemo li vam pomoći?"
                />
              </div>

              <label className="flex gap-2 items-start cursor-pointer">
                <input type="checkbox" required className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="text-xs text-brand-muted">
                  Slažem se da se moji osobni podaci koriste u obradi poruke putem interneta.{" "}
                  <a href="/privatnost" className="underline text-brand-primary hover:opacity-80">Pravila privatnosti</a>
                </span>
              </label>
              {status === "error" && (
                <p className="text-sm text-red-500">Greška pri slanju. Pokušajte ponovo ili nas nazovite.</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === "sending" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Šaljem...</>
                ) : "Pošalji poruku"}
              </button>
            </form>
          )}
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
