"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import { savePromotion, deletePromotion } from "./actions";

interface Option { id: string; name: string }

interface PromotionFormState {
  id?: string;
  name: string;
  code: string;
  discount_type: "percent" | "fixed" | "free_day";
  discount_value: string;
  applies_to: "all" | "category" | "product" | "bundle";
  applies_to_id: string;
  min_days: string;
  starts_at: string; // datetime-local string
  ends_at: string;
  usage_limit: string;
  is_active: boolean;
  usage_count?: number;
}

const EMPTY: PromotionFormState = {
  name: "",
  code: "",
  discount_type: "percent",
  discount_value: "",
  applies_to: "all",
  applies_to_id: "",
  min_days: "",
  starts_at: "",
  ends_at: "",
  usage_limit: "",
  is_active: true,
};

interface Props {
  initial?: Partial<PromotionFormState>;
  categories: Option[];
  products: Option[];
  bundles: Option[];
}

function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  // datetime-local expects "yyyy-MM-ddTHH:mm" in local time
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromDateTimeLocal(v: string): string | null {
  if (!v) return null;
  return new Date(v).toISOString();
}

export default function PromotionForm({ initial, categories, products, bundles }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PromotionFormState>({ ...EMPTY, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!initial?.id;

  function set<K extends keyof PromotionFormState>(key: K, value: PromotionFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const targetOptions =
    form.applies_to === "category" ? categories
    : form.applies_to === "product" ? products
    : form.applies_to === "bundle" ? bundles
    : [];

  function handleSave(activate?: boolean) {
    setError(null);

    const value = form.discount_value.trim() ? Number(form.discount_value) : null;
    if (form.discount_type !== "free_day" && (value === null || isNaN(value) || value <= 0)) {
      setError("Unesite ispravnu vrijednost popusta.");
      return;
    }

    const payload = {
      name: form.name,
      code: form.code.trim() || null,
      discount_type: form.discount_type,
      discount_value: form.discount_type === "free_day" ? null : value,
      applies_to: form.applies_to,
      applies_to_id: form.applies_to === "all" ? null : (form.applies_to_id || null),
      min_days: form.min_days.trim() ? Number(form.min_days) : null,
      starts_at: fromDateTimeLocal(form.starts_at),
      ends_at: fromDateTimeLocal(form.ends_at),
      usage_limit: form.usage_limit.trim() ? Number(form.usage_limit) : null,
      is_active: activate !== undefined ? activate : form.is_active,
    };

    startTransition(async () => {
      const result = await savePromotion({ promotionId: initial?.id, payload });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/promotions");
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Obrisati ovu promociju?")) return;
    setDeleting(true);
    const result = await deletePromotion({ promotionId: initial.id });
    setDeleting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin/promotions");
    router.refresh();
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? "Uredi promociju" : "Nova promocija"}
        </h1>
        <div className="flex gap-2">
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
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
            onChange={(e) => set("name", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Ljetna akcija -10 %"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">
            Promo kod (opcionalno)
          </label>
          <input
            value={form.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="LJETO10"
          />
          <p className="text-xs text-gray-400 mt-1">
            Bez koda → promocija nije unosiva u košarici (rezervirano za buduće automatske primjene).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Vrsta popusta *</label>
            <select
              value={form.discount_type}
              onChange={(e) => set("discount_type", e.target.value as PromotionFormState["discount_type"])}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="percent">Postotak (%)</option>
              <option value="fixed">Fiksno (€)</option>
              <option value="free_day">Besplatni dan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Vrijednost {form.discount_type === "percent" ? "(%)" : form.discount_type === "fixed" ? "(€)" : ""}
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.discount_value}
              disabled={form.discount_type === "free_day"}
              onChange={(e) => set("discount_value", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Vrijedi za *</label>
            <select
              value={form.applies_to}
              onChange={(e) => set("applies_to", e.target.value as PromotionFormState["applies_to"])}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">Sve stavke</option>
              <option value="category">Kategoriju</option>
              <option value="product">Proizvod</option>
              <option value="bundle">Paket</option>
            </select>
          </div>
          {form.applies_to !== "all" && (
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Cilj</label>
              <select
                value={form.applies_to_id}
                onChange={(e) => set("applies_to_id", e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">— Odaberite —</option>
                {targetOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Min. dana najma</label>
            <input
              type="number"
              min={1}
              value={form.min_days}
              onChange={(e) => set("min_days", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="npr. 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Limit korištenja</label>
            <input
              type="number"
              min={1}
              value={form.usage_limit}
              onChange={(e) => set("usage_limit", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="npr. 100"
            />
            {isEdit && form.usage_count !== undefined && (
              <p className="text-xs text-gray-400 mt-1">Iskorišteno: {form.usage_count}</p>
            )}
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-primary accent-brand-primary"
              />
              Aktivno
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Aktivno od</label>
            <input
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) => set("starts_at", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Aktivno do</label>
            <input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => set("ends_at", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { toDateTimeLocal };
