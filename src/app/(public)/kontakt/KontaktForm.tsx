"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export default function KontaktForm() {
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

  if (status === "ok") {
    return (
      <div className="text-center py-10">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <p className="font-semibold text-brand-text">Poruka je poslana!</p>
        <p className="text-sm text-brand-muted mt-1">Javit ćemo vam se uskoro.</p>
      </div>
    );
  }

  return (
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
  );
}
