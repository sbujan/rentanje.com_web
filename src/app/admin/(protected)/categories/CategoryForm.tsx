"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface Props {
  category?: Category;
}

export default function CategoryForm({ category }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!category;

  const [form, setForm] = useState({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    color: category?.color ?? "",
    sort_order: category?.sort_order ?? 0,
    seo_title: category?.seo_title ?? "",
    seo_description: category?.seo_description ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: isEdit ? f.slug : slugify(name),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      color: form.color || null,
      sort_order: Number(form.sort_order),
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
    };

    const { error } = isEdit
      ? await supabase.from("categories").update(payload).eq("id", category.id)
      : await supabase.from("categories").insert(payload);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <h2 className="font-display text-base font-semibold text-brand-text">
          Osnovne informacije
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="name">Naziv *</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="npr. Audio i video oprema"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input
            id="slug"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="audio-video-oprema"
            className="font-mono text-sm"
          />
          <p className="text-xs text-brand-muted">
            /oprema/{form.slug || "slug"}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Opis</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Kratki opis kategorije..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="color">Boja (hex)</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                value={form.color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color: e.target.value }))
                }
                placeholder="#6366F1"
                className="font-mono"
              />
              {form.color && (
                <div
                  className="w-10 h-10 rounded-md border border-gray-200 shrink-0"
                  style={{ backgroundColor: form.color }}
                />
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sort_order">Redosljed</Label>
            <Input
              id="sort_order"
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  sort_order: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <h2 className="font-display text-base font-semibold text-brand-text">
          SEO
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="seo_title">SEO naslov</Label>
          <Input
            id="seo_title"
            value={form.seo_title}
            onChange={(e) =>
              setForm((f) => ({ ...f, seo_title: e.target.value }))
            }
            placeholder="Audio oprema za iznajmljivanje – rentanje.com"
            maxLength={60}
          />
          <p className="text-xs text-brand-muted">
            {form.seo_title.length}/60 znakova
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="seo_description">SEO opis</Label>
          <Textarea
            id="seo_description"
            value={form.seo_description}
            onChange={(e) =>
              setForm((f) => ({ ...f, seo_description: e.target.value }))
            }
            placeholder="Iznajmite profesionalnu audio i video opremu..."
            maxLength={160}
            rows={3}
          />
          <p className="text-xs text-brand-muted">
            {form.seo_description.length}/160 znakova
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Spremanje..." : isEdit ? "Spremi promjene" : "Dodaj kategoriju"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
        >
          Odustani
        </Button>
      </div>
    </form>
  );
}
