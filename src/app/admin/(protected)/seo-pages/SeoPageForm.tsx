"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, Eye, Trash2, ExternalLink } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils";
import { saveSeoPage, deleteSeoPage } from "./actions";

interface SeoPageFormState {
  id?: string;
  title: string;
  slug: string;
  content: string;
  hero_image_url: string;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  seo_keywords: string; // comma-separated in the form
  schema_json: string;  // JSON string in the form
}

const EMPTY: SeoPageFormState = {
  title: "",
  slug: "",
  content: "",
  hero_image_url: "",
  is_published: false,
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  schema_json: "",
};

interface Props {
  initial?: Partial<SeoPageFormState>;
}

export default function SeoPageForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<SeoPageFormState>({ ...EMPTY, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!initial?.id;

  function set<K extends keyof SeoPageFormState>(key: K, value: SeoPageFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(v: string) {
    set("title", v);
    if (!isEdit) set("slug", slugify(v));
  }

  function handleSave(publish?: boolean) {
    setError(null);

    let parsedSchema: unknown = null;
    if (form.schema_json.trim()) {
      try {
        parsedSchema = JSON.parse(form.schema_json);
      } catch {
        setError("Schema JSON je neispravan — provjerite sintaksu.");
        return;
      }
    }

    const keywords = form.seo_keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      slug: form.slug,
      content: form.content || null,
      hero_image_url: form.hero_image_url || null,
      is_published: publish !== undefined ? publish : form.is_published,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: keywords.length > 0 ? keywords : null,
      schema_json: parsedSchema,
    };

    startTransition(async () => {
      const result = await saveSeoPage({ pageId: initial?.id, payload });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/seo-pages");
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Obrisati ovu SEO stranicu?")) return;
    setDeleting(true);
    const result = await deleteSeoPage({ pageId: initial.id });
    setDeleting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin/seo-pages");
    router.refresh();
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? "Uredi SEO stranicu" : "Nova SEO stranica"}
        </h1>
        <div className="flex gap-2">
          {isEdit && form.is_published && form.slug && (
            <Link
              href={`/stranica/${form.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 border border-white/20 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Otvori
            </Link>
          )}
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting || pending}
              className="flex items-center gap-1.5 border border-red-400/30 text-red-400 px-3 py-2 rounded-lg text-sm hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Obriši
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={pending}
            className="flex items-center gap-1.5 border border-white/20 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
          >
            <Save className="h-4 w-4" /> Spremi skicu
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={pending}
            className="flex items-center gap-1.5 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Objavi
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-5 bg-white rounded-xl p-6 border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Naslov *</label>
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Najam ozvučenja Zagreb — cijene i dostupnost"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">
            Slug (URL: /stranica/[slug]) *
          </label>
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="najam-ozvucenja-zagreb"
          />
        </div>

        <ImageUpload
          label="Hero slika"
          value={form.hero_image_url}
          onChange={(v) => set("hero_image_url", v)}
          folder="seo-pages"
        />

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Sadržaj (HTML)</label>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={18}
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
            placeholder="<p>Sadržaj stranice u HTML formatu — naslovi, popisi, slike...</p>"
          />
          <p className="text-xs text-gray-400 mt-1">
            HTML se renderira nakon XSS sanitizacije (skripte i inline event handleri uklonjeni).
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-4">
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">SEO</p>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">SEO naslov</label>
            <input
              value={form.seo_title}
              onChange={(e) => set("seo_title", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Ako ostavite prazno, koristi se naslov stranice."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Meta opis</label>
            <textarea
              value={form.seo_description}
              onChange={(e) => set("seo_description", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Ključne riječi (zarezima odvojene)
            </label>
            <input
              value={form.seo_keywords}
              onChange={(e) => set("seo_keywords", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="najam ozvučenja, zvučnici za zabavu, najam zagreb"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-brand-text mb-1">
            JSON-LD schema (opcionalno)
          </label>
          <textarea
            value={form.schema_json}
            onChange={(e) => set("schema_json", e.target.value)}
            rows={8}
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
            placeholder='{"@context":"https://schema.org","@type":"FAQPage", ...}'
          />
          <p className="text-xs text-gray-400 mt-1">
            Validan JSON. Ubacuje se kao &lt;script type=&quot;application/ld+json&quot;&gt; u &lt;head&gt;.
          </p>
        </div>
      </div>
    </div>
  );
}
