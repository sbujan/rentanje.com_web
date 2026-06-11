import type { Database } from "@/types/database";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

/**
 * Shape returned by `products.select("*, categories(name, color, slug)")`.
 * The manual Database type has no Relationships metadata, so supabase-js
 * cannot infer the embedded join — query results are cast to this type.
 */
export type ProductWithCategory = ProductRow & {
  categories: { name: string; color: string | null; slug: string } | null;
};
