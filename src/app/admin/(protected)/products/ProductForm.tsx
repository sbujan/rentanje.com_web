"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type Tag = Database["public"]["Tables"]["tags"]["Row"];

interface Props {
  product?: Product;
  categories: Category[];
  tags: Tag[];
  selectedTagIds?: string[];
}

export default function ProductForm({
  product,
  categories,
  tags,
  selectedTagIds = [],
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category_id: product?.category_id ?? "",
    short_desc: product?.short_desc ?? "",
    description: product?.description ?? "",
    min_rental_days: String(product?.min_rental_days ?? "1"),
    price_per_day: product?.price_per_day?.toString() ?? "",
    price_per_3days: product?.price_per_3days?.toString() ?? "",
    price_per_7days: product?.price_per_7days?.toString() ?? "",
    requires_deposit: product?.requires_deposit ?? false,
    deposit_amount: product?.deposit_amount?.toString() ?? "",
    deposit_note: product?.deposit_note ?? "",
    stock_qty: product?.stock_qty?.toString() ?? "1",
    weight_kg: product?.weight_kg?.toString() ?? "",
    dimensions_cm: product?.dimensions_cm ?? "",
    seo_title: product?.seo_title ?? "",
    seo_description: product?.seo_description ?? "",
    seo_keywords: product?.seo_keywords?.join(", ") ?? "",
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
    sort_order: product?.sort_order?.toString() ?? "0",
    hero_image_url: product?.hero_image_url ?? "",
  });
  const [tagIds, setTagIds] = useState<string[]>(selectedTagIds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: isEdit ? f.slug : slugify(name),
    }));
  }

  function toggleTag(id: string) {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function validate(): string | null {
    const minDays = parseInt(form.min_rental_days);
    if (minDays === 1 && !form.price_per_day)
      return "Cijena za 1 dan je obavezna.";
    if (minDays <= 3 && !form.price_per_3days)
      return "Cijena za 3 dana je obavezna.";
    if (!form.price_per_7days) return "Cijena za 7 dana je obavezna.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);

    const minDays = parseInt(form.min_rental_days) as 1 | 3 | 7;

    const payload = {
      name: form.name,
      slug: form.slug,
      category_id: form.category_id || null,
      short_desc: form.short_desc || null,
      description: form.description || null,
      min_rental_days: minDays,
      price_per_day: minDays === 1 ? parseFloat(form.price_per_day) : null,
      price_per_3days:
        minDays <= 3 ? parseFloat(form.price_per_3days) : null,
      price_per_7days: parseFloat(form.price_per_7days),
      requires_deposit: form.requires_deposit,
      deposit_amount: form.deposit_amount
        ? parseFloat(form.deposit_amount)
        : null,
      deposit_note: form.deposit_note || null,
      stock_qty: parseInt(form.stock_qty) || 1,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      hero_image_url: form.hero_image_url || null,
      dimensions_cm: form.dimensions_cm || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: form.seo_keywords
        ? form.seo_keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : null,
      is_featured: form.is_featured,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
    };

    let productId = product?.id;

    if (isEdit) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId!);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      productId = data.id;
    }

    // Sync tags
    if (productId) {
      await supabase.from("product_tags").delete().eq("product_id", productId);
      if (tagIds.length > 0) {
        await supabase.from("product_tags").insert(
          tagIds.map((tag_id) => ({ product_id: productId!, tag_id }))
        );
      }
    }

    router.push("/admin/products");
    router.refresh();
  }

  const minDays = parseInt(form.min_rental_days);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic info */}
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
            placeholder="npr. JBL Partybox 310"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input
            id="slug"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="jbl-partybox-310"
            className="font-mono text-sm"
          />
          <p className="text-xs text-brand-muted">
            /najam/{form.slug || "slug"}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label>Kategorija</Label>
          <Select
            value={form.category_id}
            onValueChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Odaberi kategoriju" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="short_desc">Kratki opis</Label>
          <Textarea
            id="short_desc"
            value={form.short_desc}
            onChange={(e) =>
              setForm((f) => ({ ...f, short_desc: e.target.value }))
            }
            placeholder="Kratki opis koji se prikazuje na kartici proizvoda..."
            rows={2}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Opis (HTML)</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Puni opis proizvoda..."
            rows={6}
          />
          <p className="text-xs text-brand-muted">
            Tiptap editor dolazi u Phase 2. Zasad unesite HTML ili čisti tekst.
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <Label>Oznake</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className="px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all"
                style={
                  tagIds.includes(tag.id)
                    ? {
                        backgroundColor: tag.color ?? "#6B7280",
                        borderColor: tag.color ?? "#6B7280",
                        color: "white",
                      }
                    : {
                        backgroundColor: "transparent",
                        borderColor: tag.color ?? "#6B7280",
                        color: tag.color ?? "#6B7280",
                      }
                }
              >
                {tag.name}
              </button>
            ))}
            {tags.length === 0 && (
              <p className="text-sm text-brand-muted">
                Nema oznaka. Dodajte ih u{" "}
                <a href="/admin/tags" className="underline">
                  Oznake
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <h2 className="font-display text-base font-semibold text-brand-text">
          Slike
        </h2>
        <ImageUpload
          label="Hero slika *"
          value={form.hero_image_url}
          onChange={(url) => setForm((f) => ({ ...f, hero_image_url: url }))}
        />
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <h2 className="font-display text-base font-semibold text-brand-text">
          Cijene i najam
        </h2>

        <div className="space-y-1.5">
          <Label>Minimalni period iznajmljivanja *</Label>
          <Select
            value={form.min_rental_days}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, min_rental_days: v }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 dan</SelectItem>
              <SelectItem value="3">3 dana</SelectItem>
              <SelectItem value="7">7 dana (tjedan)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price_per_day">
              Cijena 1 dan (€){" "}
              {minDays === 1 && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="price_per_day"
              type="number"
              min={0}
              step="0.01"
              disabled={minDays > 1}
              value={form.price_per_day}
              onChange={(e) =>
                setForm((f) => ({ ...f, price_per_day: e.target.value }))
              }
              placeholder={minDays > 1 ? "N/A" : "25.00"}
              className={minDays > 1 ? "bg-gray-50 text-gray-400" : ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price_per_3days">
              Cijena 3 dana (€){" "}
              {minDays <= 3 && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="price_per_3days"
              type="number"
              min={0}
              step="0.01"
              disabled={minDays > 3}
              value={form.price_per_3days}
              onChange={(e) =>
                setForm((f) => ({ ...f, price_per_3days: e.target.value }))
              }
              placeholder={minDays > 3 ? "N/A" : "60.00"}
              className={minDays > 3 ? "bg-gray-50 text-gray-400" : ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price_per_7days">
              Cijena 7 dana (€) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price_per_7days"
              type="number"
              min={0}
              step="0.01"
              required
              value={form.price_per_7days}
              onChange={(e) =>
                setForm((f) => ({ ...f, price_per_7days: e.target.value }))
              }
              placeholder="100.00"
            />
          </div>
        </div>

        {/* Deposit */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requires_deposit"
              checked={form.requires_deposit}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  requires_deposit: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            <Label htmlFor="requires_deposit">Zahtijeva kauciju</Label>
          </div>

          {form.requires_deposit && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div className="space-y-1.5">
                <Label htmlFor="deposit_amount">Iznos kaucije (€)</Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.deposit_amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, deposit_amount: e.target.value }))
                  }
                  placeholder="100.00"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deposit_note">Napomena o kauciji</Label>
                <Input
                  id="deposit_note"
                  value={form.deposit_note}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, deposit_note: e.target.value }))
                  }
                  placeholder="Kaucija se vraća po povratku..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stock & specs */}
      <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <h2 className="font-display text-base font-semibold text-brand-text">
          Zaliha i tehnički podaci
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="stock_qty">Ukupna količina</Label>
            <Input
              id="stock_qty"
              type="number"
              min={1}
              value={form.stock_qty}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock_qty: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="weight_kg">Težina (kg)</Label>
            <Input
              id="weight_kg"
              type="number"
              min={0}
              step="0.1"
              value={form.weight_kg}
              onChange={(e) =>
                setForm((f) => ({ ...f, weight_kg: e.target.value }))
              }
              placeholder="2.5"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dimensions_cm">Dimenzije (cm)</Label>
            <Input
              id="dimensions_cm"
              value={form.dimensions_cm}
              onChange={(e) =>
                setForm((f) => ({ ...f, dimensions_cm: e.target.value }))
              }
              placeholder="30x20x15"
            />
          </div>
        </div>
      </div>

      {/* SEO */}
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
            placeholder="JBL Partybox 310 – Iznajmljivanje | rentanje.com"
            maxLength={60}
          />
          <p className="text-xs text-brand-muted">
            {form.seo_title.length}/60 znakova
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="seo_description">SEO opis (meta description)</Label>
          <Textarea
            id="seo_description"
            value={form.seo_description}
            onChange={(e) =>
              setForm((f) => ({ ...f, seo_description: e.target.value }))
            }
            placeholder="Iznajmite JBL Partybox 310 za vaš event. Pošaljite upit danas!"
            maxLength={160}
            rows={3}
          />
          <p className="text-xs text-brand-muted">
            {form.seo_description.length}/160 znakova
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="seo_keywords">Ključne riječi (odvojene zarezom)</Label>
          <Input
            id="seo_keywords"
            value={form.seo_keywords}
            onChange={(e) =>
              setForm((f) => ({ ...f, seo_keywords: e.target.value }))
            }
            placeholder="iznajmljivanje zvučnika, najam bluetooth zvučnika, JBL za rent"
          />
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <h2 className="font-display text-base font-semibold text-brand-text">
          Postavke
        </h2>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_active: e.target.checked }))
              }
              className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-sm font-medium text-brand-text">Aktivno</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_featured: e.target.checked }))
              }
              className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-sm font-medium text-brand-text">
              Istaknuto (prikaži na početnoj)
            </span>
          </label>
        </div>

        <div className="space-y-1.5 max-w-xs">
          <Label htmlFor="sort_order">Redosljed</Label>
          <Input
            id="sort_order"
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(e) =>
              setForm((f) => ({ ...f, sort_order: e.target.value }))
            }
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Spremanje..."
            : isEdit
            ? "Spremi promjene"
            : "Dodaj proizvod"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Odustani
        </Button>
      </div>
    </form>
  );
}
