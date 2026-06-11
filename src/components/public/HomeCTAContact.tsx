"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle } from "lucide-react";
import { trackContactForm } from "@/lib/gtag";

const PHONE = "+385 95 204 4414";
const PHONE_HREF = "tel:+385952044414";

export default function HomeCTAContact() {
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
      if (res.ok) trackContactForm("homepage");
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-brand-primary text-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
            Trebate opremu? Javite se!
          </h2>
          <p className="text-white/80">Odgovaramo u roku 1–2 sata, svaki dan 8–20h.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Contact form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            {status === "ok" ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <CheckCircle className="h-10 w-10 text-white" />
                <p className="font-semibold text-white text-lg">Poruka je poslana!</p>
                <p className="text-white/70 text-sm">Javit ćemo vam se uskoro.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">Ime i prezime</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full h-10 px-3 rounded-md bg-white/15 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                      placeholder="Ana Anić"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full h-10 px-3 rounded-md bg-white/15 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                      placeholder="ana@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">Poruka</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 rounded-md bg-white/15 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
                    placeholder="Što vas zanima? Koje datume trebate?"
                  />
                </div>
                <label className="flex gap-2 items-start cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 h-4 w-4 flex-shrink-0 accent-white" />
                  <span className="text-xs text-white/70">
                    Slažem se da se moji osobni podaci koriste u obradi poruke putem interneta.{" "}
                    <a href="/privatnost" className="underline text-white/90 hover:text-white">Pravila privatnosti</a>
                  </span>
                </label>
                {status === "error" && (
                  <p className="text-xs text-red-200">Greška pri slanju. Pokušajte ponovo ili nas nazovite.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 bg-white text-brand-primary font-bold py-2.5 rounded-lg hover:bg-brand-light transition-colors disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Šaljem...</>
                  ) : "Pošalji poruku"}
                </button>
              </form>
            )}
          </div>

          {/* Company info */}
          <div className="flex flex-col gap-4 justify-center">
            <a href={PHONE_HREF} className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60">Telefon</p>
                <p className="font-bold text-white">{PHONE}</p>
              </div>
            </a>

            <a href="mailto:info@rentanje.com" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60">E-mail</p>
                <p className="font-medium text-white">info@rentanje.com</p>
              </div>
            </a>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60">Adresa</p>
                <p className="font-medium text-white">Naserov trg 4, Zagreb</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60">Dostupnost</p>
                <p className="font-medium text-white">Svaki dan, 8–20h</p>
              </div>
            </div>

            <div className="mt-2 pt-4 border-t border-white/20 text-xs text-white/50 leading-relaxed">
              <strong className="text-white/70">List 360 d.o.o.</strong><br />
              OIB: 30800965664<br />
              Naserov trg 4, Zagreb
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-8 rounded-xl overflow-hidden" style={{ height: 280 }}>
          <iframe
            src="https://maps.google.com/maps?q=Naserov+trg+4,+Zagreb&t=m&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            className="w-full h-full border-0 opacity-90"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokacija — Naserov trg 4, Zagreb"
          />
        </div>
      </div>
    </section>
  );
}
