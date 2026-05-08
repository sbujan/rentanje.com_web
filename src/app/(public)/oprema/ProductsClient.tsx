"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/public/ProductCard";
import { Search } from "lucide-react";
import { effectiveDailyRate } from "@/lib/pricing";

type Product = {
  id: string;
  name: string;
  slug: string;
  short_desc: string | null;
  hero_image_url: string | null;
  price_per_day: number | null;
  price_per_3days: number | null;
  price_per_7days: number;
  min_rental_days: 1 | 3 | 7;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  category_id: string | null;
  requires_deposit: boolean;
  deposit_amount: number | null;
  categories?: { name: string; color: string | null; slug: string } | null;
};

type Category = { id: string; name: string; slug: string; color: string | null };

interface Props {
  products: Product[];
  categories: Category[];
  activeCategory?: string;
}

const sortOptions = [
  { value: "sort_order", label: "Preporučeno" },
  { value: "price_asc", label: "Cijena rastuće" },
  { value: "price_desc", label: "Cijena padajuće" },
  { value: "name_asc", label: "Naziv A–Z" },
];

export default function ProductsClient({ products, categories, activeCategory }: Props) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(activeCategory ?? "sve");
  const [sort, setSort] = useState("sort_order");

  const filtered = useMemo(() => {
    let list = [...products];

    // Category filter
    if (catFilter !== "sve") {
      list = list.filter((p) => (p.categories as any)?.slug === catFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_desc?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === "price_asc") {
      list.sort((a, b) => effectiveDailyRate(a) - effectiveDailyRate(b));
    } else if (sort === "price_desc") {
      list.sort((a, b) => effectiveDailyRate(b) - effectiveDailyRate(a));
    } else if (sort === "name_asc") {
      list.sort((a, b) => a.name.localeCompare(b.name, "hr"));
    } else {
      list.sort((a, b) => a.sort_order - b.sort_order);
    }

    return list;
  }, [products, catFilter, search, sort]);

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
          <input
            type="search"
            placeholder="Pretraži opremu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCatFilter("sve")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors ${
            catFilter === "sve"
              ? "bg-brand-primary border-brand-primary text-white"
              : "border-gray-200 text-brand-muted hover:border-brand-primary hover:text-brand-primary"
          }`}
        >
          Sve
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCatFilter(cat.slug)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors"
            style={
              catFilter === cat.slug
                ? { backgroundColor: cat.color ?? "#6B7280", borderColor: cat.color ?? "#6B7280", color: "white" }
                : { borderColor: cat.color ?? "#e5e7eb", color: cat.color ?? "#6B7280", backgroundColor: "transparent" }
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-brand-muted mb-6">
        {filtered.length} {filtered.length === 1 ? "proizvod" : "proizvoda"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-brand-muted">
          Nema rezultata za traženi pojam.
        </div>
      )}
    </div>
  );
}
