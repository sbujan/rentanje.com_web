"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Star } from "lucide-react";

interface Props {
  initial?: {
    id: string;
    author_name: string;
    author_role: string | null;
    content: string;
    rating: number;
    is_active: boolean;
    sort_order: number;
  };
}

export default function TestimonialForm({ initial }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState({
    author_name: initial?.author_name ?? "",
    author_role: initial?.author_role ?? "",
    content: initial?.content ?? "",
    rating: initial?.rating ?? 5,
    is_active: initial?.is_active ?? true,
    sort_order: initial?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.author_name || !form.content) return;
    setSaving(true);
    setError(null);

    const payload = {
      author_name: form.author_name,
      author_role: form.author_role || null,
      content: form.content,
      rating: form.rating,
      is_active: form.is_active,
      sort_order: form.sort_order,
    };

    const { error: err } = isEdit
      ? await supabase.from("testimonials").update(payload).eq("id", initial!.id)
      : await supabase.from("testimonials").insert(payload);

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/admin/testimonials");
    router.refresh();
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-8">
        {isEdit ? "Uredi recenziju" : "Nova recenzija"}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700 mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Ime i prezime *</label>
          <input
            value={form.author_name}
            onChange={(e) => set("author_name", e.target.value)}
            required
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Ana Anić"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Uloga / opis</label>
          <input
            value={form.author_role}
            onChange={(e) => set("author_role", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Organizator eventa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Recenzija *</label>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            placeholder="Sve je bilo odlično! Oprema je stigla na vrijeme..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-2">Ocjena</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set("rating", n)}
                className="p-0.5"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    n <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Redosljed</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              min={0}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-brand-primary"
              />
              <span className="text-sm font-medium text-brand-text">Aktivna</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Spremi promjene" : "Dodaj recenziju"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-200 text-brand-text px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Odustani
          </button>
        </div>
      </form>
    </div>
  );
}
