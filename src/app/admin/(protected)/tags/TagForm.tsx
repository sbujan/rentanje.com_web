"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import type { Database } from "@/types/database";

type Tag = Database["public"]["Tables"]["tags"]["Row"];

interface Props {
  tag?: Tag;
}

export default function TagForm({ tag }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!tag;

  const [form, setForm] = useState({
    name: tag?.name ?? "",
    slug: tag?.slug ?? "",
    color: tag?.color ?? "#6B7280",
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
      color: form.color || null,
    };

    const { error } = isEdit
      ? await supabase.from("tags").update(payload).eq("id", tag.id)
      : await supabase.from("tags").insert(payload);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/tags");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Naziv *</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="npr. Novo"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="novo"
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="color">Boja (hex)</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              id="color-picker"
              value={form.color}
              onChange={(e) =>
                setForm((f) => ({ ...f, color: e.target.value }))
              }
              className="h-10 w-12 rounded cursor-pointer border border-gray-200"
            />
            <Input
              id="color"
              value={form.color}
              onChange={(e) =>
                setForm((f) => ({ ...f, color: e.target.value }))
              }
              placeholder="#6B7280"
              className="font-mono"
            />
          </div>
          {/* Preview */}
          <div className="mt-1">
            <span
              className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: form.color || "#6B7280" }}
            >
              {form.name || "Pregled oznake"}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Spremanje..." : isEdit ? "Spremi promjene" : "Dodaj oznaku"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/tags")}
        >
          Odustani
        </Button>
      </div>
    </form>
  );
}
