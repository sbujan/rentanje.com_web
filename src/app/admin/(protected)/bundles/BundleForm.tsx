"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, Eye, Trash2, ExternalLink, Plus, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils";
import { saveBundle, deleteBundle } from "./actions";

interface ProductOption {
  id: string;
  name: string;
}

interface BundleProductRow {
  product_id: string;
  qty: number;
}

interface BundleFormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  hero_image_url: string;
  discount_type: "percent" | "fixed" | "";
  discount_value: string; // string in form, parsed on save
  is_active: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  products: BundleProductRow[];
}

const EMPTY: BundleFormState = {
  name: "",
  slug: "",
  description: "",
  hero_image_url: "",
  discount_type: "",
  discount_value: "",
  is_active: true,
  is_featured: false,
  seo_title: "",
  seo_description: "",
  products: [],
};

interface Props {
  initial?: Partial<BundleFormState>;
  productOptions: ProductOption[];
}

export default function BundleForm({ initial, productOptions }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<BundleFormState>({ ...EMPTY, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!initial?.id;

  function set<K extends keyof BundleFormState>(key: K, value: BundleFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleNameChange(v: string) {
    set("name", v);
    if (!isEdit) set("slug", slugify(v));
  }

  function addProductRow() {
    set("products", [...form.products, { product_id: "", qty: 1 }]);
  }

  function updateProductRow(index: number, patch: Partial<BundleProductRow>) {
    const next = form.products.map((row, i) => (i === index ? { ...row, ...patch } : row));
    set("products", next);
  }

  function removeProductRow(index: number) {
    set("products", form.products.filter((_, i) => i !== index));
  }

  function handleSave(activate?: boolean) {
    setError(null);

    const filteredProducts = form.products.filter((p) => p.product_id);
    if (filteredProducts.length === 0) {
      setError("Dodajte barem jedan proizvod u paket.");
      return;
    }

    const discountValue = form.discount_value.trim()
      ? Number(form.discount_value)
      : null;
    if (form.discount_type && (discountValue === null || isNaN(discountValue) || discountValue <= 0)) {
      setError("Unesite ispravnu vrijednost popusta.");
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      hero_image_url: form.hero_image_url || null,
      discount_type: (form.discount_type || null) as "percent" | "fixed" | null,
      discount_value: form.discount_type ? discountValue : null,
      is_active: activate !== undefined ? activate : form.is_active,
      is_featured: form.is_featured,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
    };

    startTransition(async () => {
      const result = await saveBundle({
        bundleId: initial?.id,
        payload,
        products: filteredProducts.map((p) => ({ product_id: p.product_id, qty: p.qty })),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/bundles");
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Obrisati ovaj paket?")) return;
    setDeleting(true);
    const result = await deleteBundle({ bundleId: initial.id });
    setDeleting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin/bundles");
    router.refresh();
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">{isEdit ? "Uredi paket" : "Novi paket"}</h1>
        <div className="flex gap-2">
          {isEdit && form.is_active && form.slug && (
            <Link
              href={`/paketi/${form.slug}`}
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
            <Save className="h-4 w-4" /> Spremi (neaktivno)
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={pending}
            className="flex items-center gap-1.5 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Aktiviraj
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
          <label className="block text-sm font-medium text-brand-text mb-1">Naziv *</label>
          <input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Paket za roštilj zabavu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">
            Slug (URL: /paketi/[slug]) *
          </label>
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="paket-za-rostilj-zabavu"
          />
        </div>

        <ImageUpload
          label="Hero slika"
          value={form.hero_image_url}
          onChange={(v) => set("hero_image_url", v)}
          folder="bundles"
        />

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Opis</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            placeholder="Sve što treba za zabavu — roštilj, stol, stolice, hladnjak."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Vrsta popusta</label>
            <select
              value={form.discount_type}
              onChange={(e) => set("discount_type", e.target.value as BundleFormState["discount_type"])}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Bez popusta</option>
              <option value="percent">Postotak (%)</option>
              <option value="fixed">Fiksno (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Vrijednost popusta
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.discount_value}
              onChange={(e) => set("discount_value", e.target.value)}
              disabled={!form.discount_type}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-primary accent-brand-primary"
            />
            Aktivno
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-primary accent-brand-primary"
            />
            Istaknuto
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Proizvodi u paketu
            </p>
            <button
              onClick={addProductRow}
              className="flex items-center gap-1 text-brand-primary text-sm hover:underline"
              type="button"
            >
              <Plus className="h-3.5 w-3.5" /> Dodaj proizvod
            </button>
          </div>

          {form.products.length === 0 ? (
            <p className="text-sm text-gray-400">
              Nema proizvoda. Kliknite &laquo;Dodaj proizvod&raquo; iznad.
            </p>
          ) : (
            <div className="space-y-2">
              {form.products.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={row.product_id}
                    onChange={(e) => updateProductRow(i, { product_id: e.target.value })}
                    className="flex-1 h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="">— Odaberite proizvod —</option>
                    {productOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={row.qty}
                    onChange={(e) => updateProductRow(i, { qty: Math.max(1, Number(e.target.value)) })}
                    className="w-20 h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button
                    onClick={() => removeProductRow(i)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
      </div>
    </div>
  );
}
