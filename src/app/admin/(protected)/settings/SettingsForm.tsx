"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SITE_PHONE } from "@/lib/site";
import { Loader2, Save, CheckCircle } from "lucide-react";

const FIELDS = [
  { key: "phone", label: "Telefon", placeholder: SITE_PHONE, type: "text" },
  { key: "email", label: "E-mail", placeholder: "info@rentanje.com", type: "email" },
  { key: "address", label: "Adresa", placeholder: "Zagreb, Hrvatska", type: "text" },
  { key: "working_hours", label: "Radno vrijeme", placeholder: "Svaki dan, 8–20h", type: "text" },
  { key: "oib", label: "OIB", placeholder: "30800965664", type: "text" },
  { key: "company_name", label: "Naziv tvrtke", placeholder: "List 360 d.o.o.", type: "text" },
  { key: "delivery_fee", label: "Naknada za dostavu (€)", placeholder: "0", type: "number" },
  { key: "min_order_value", label: "Minimalna vrijednost narudžbe (€)", placeholder: "0", type: "number" },
  { key: "meta_title_suffix", label: "Sufiks naslova stranica", placeholder: "| rentanje.com", type: "text" },
  { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/...", type: "url" },
  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/...", type: "url" },
] as const;

type Key = (typeof FIELDS)[number]["key"];

interface Props {
  initial: Record<string, string>;
}

export default function SettingsForm({ initial }: Props) {
  const supabase = createClient();
  const [values, setValues] = useState<Record<Key, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, initial[f.key] ?? ""])) as Record<Key, string>
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const upserts = FIELDS.map((f) => ({
      key: f.key,
      value: values[f.key],
    }));

    const { error: err } = await supabase
      .from("settings")
      .upsert(upserts, { onConflict: "key" });

    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Kontakt i tvrtka</p>
        {FIELDS.slice(0, 6).map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-brand-text mb-1">{field.label}</label>
            <input
              type={field.type}
              value={values[field.key]}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Trgovina</p>
        {FIELDS.slice(6, 8).map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-brand-text mb-1">{field.label}</label>
            <input
              type={field.type}
              value={values[field.key]}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">SEO i društvene mreže</p>
        {FIELDS.slice(8).map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-brand-text mb-1">{field.label}</label>
            <input
              type={field.type}
              value={values[field.key]}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saved ? "Spremljeno!" : "Spremi postavke"}
      </button>
    </form>
  );
}
