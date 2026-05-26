"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Loader2, Save, Eye, Trash2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import FaqEditor, { type FaqItem } from "@/components/admin/FaqEditor";
import { saveBlogPost, deleteBlogPost } from "./actions";

interface Post {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  hero_image_url: string;
  author: string;
  is_published: boolean;
  reading_time: number | null;
  seo_title: string;
  seo_description: string;
  faq: FaqItem[];
}

interface Props {
  initial?: Partial<Post>;
}

const EMPTY: Post = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  hero_image_url: "",
  author: "rentanje.com",
  is_published: false,
  reading_time: null,
  seo_title: "",
  seo_description: "",
  faq: [],
};

export default function BlogForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Post>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initial?.id;

  function set<K extends keyof Post>(key: K, value: Post[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(v: string) {
    set("title", v);
    if (!isEdit) set("slug", slugify(v));
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError(null);

    const isPublished = publish !== undefined ? publish : form.is_published;
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      hero_image_url: form.hero_image_url || null,
      author: form.author,
      reading_time: form.reading_time,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      faq: form.faq,
      is_published: isPublished,
      // On edit: only stamp published_at when promoting to published.
      // On insert: stamp now if publishing, else null.
      published_at: publish
        ? new Date().toISOString()
        : isEdit
        ? undefined
        : null,
    };

    const result = await saveBlogPost({
      postId: initial?.id,
      payload,
    });

    setSaving(false);
    if (!result.ok) { setError(result.error); return; }
    router.push("/admin/blog");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Obrisati ovaj članak?")) return;
    setDeleting(true);
    const result = await deleteBlogPost({ postId: initial!.id! });
    setDeleting(false);
    if (!result.ok) { setError(result.error); return; }
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">{isEdit ? "Uredi članak" : "Novi članak"}</h1>
        <div className="flex gap-2">
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 border border-red-400/30 text-red-400 px-3 py-2 rounded-lg text-sm hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Obriši
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-1.5 border border-white/20 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
          >
            <Save className="h-4 w-4" /> Spremi skicu
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-1.5 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Objavi
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700 mb-6">{error}</div>}

      <div className="space-y-5 bg-white rounded-xl p-6 border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Naslov *</label>
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Kako organizirati savršeni outdoor event"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Slug (URL)</label>
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <ImageUpload
          label="Hero slika"
          value={form.hero_image_url}
          onChange={(v) => set("hero_image_url", v)}
          folder="blog"
        />

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Kratki opis (excerpt)</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            placeholder="Kratki opis koji se prikazuje u listingu..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Sadržaj (HTML)</label>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={16}
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
            placeholder="<p>Sadržaj članka u HTML formatu...</p>"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Autor</label>
            <input
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Čitanje (min)</label>
            <input
              type="number"
              value={form.reading_time ?? ""}
              onChange={(e) => set("reading_time", e.target.value ? Number(e.target.value) : null)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              min={1}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-4">
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">SEO</p>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">SEO naslov</label>
            <input
              value={form.seo_title}
              onChange={(e) => set("seo_title", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div>
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">FAQ</p>
            <p className="text-xs text-brand-muted mt-1">Prikazuju se na stranici članka. Pomaže Google, ChatGPT i Perplexity da razumiju sadržaj.</p>
          </div>
          <FaqEditor
            value={form.faq}
            onChange={(faq) => set("faq", faq)}
          />
        </div>
      </div>
    </div>
  );
}
