"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, NotAuthorizedError } from "@/lib/admin-auth";
import type { FaqItem } from "@/components/admin/FaqEditor";

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const productPayloadSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category_id: z.string().nullable(),
  short_desc: z.string().nullable(),
  description: z.string().nullable(),
  min_rental_days: z.union([z.literal(1), z.literal(3), z.literal(7)]),
  price_per_day: z.number().nullable(),
  price_per_3days: z.number().nullable(),
  price_per_7days: z.number(),
  requires_deposit: z.boolean(),
  deposit_amount: z.number().nullable(),
  deposit_note: z.string().nullable(),
  stock_qty: z.number().int().min(0),
  weight_kg: z.number().nullable(),
  hero_image_url: z.string().nullable(),
  hero_image_alt: z.string().nullable(),
  images: z.array(z.string()).nullable(),
  // Aligned by index with `images`. Individual entries may be null when
  // the admin hasn't filled in the alt yet — the public renderer falls
  // back to the product name.
  image_alts: z.array(z.string().nullable()).nullable(),
  dimensions_cm: z.string().nullable(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
  seo_keywords: z.array(z.string()).nullable(),
  faq: z.array(faqItemSchema),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number().int(),
});

const saveInputSchema = z.object({
  productId: z.string().uuid().optional(),
  payload: productPayloadSchema,
  tagIds: z.array(z.string().uuid()),
  relatedIds: z.array(z.string().uuid()),
});

export type SaveProductInput = z.infer<typeof saveInputSchema>;
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

function revalidateProductPaths(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/oprema");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/najam/${slug}`);
}

export async function saveProduct(
  input: SaveProductInput
): Promise<ActionResult<{ id: string; slug: string }>> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch (e) {
    if (e instanceof NotAuthorizedError) return { ok: false, error: "Niste ovlašteni." };
    throw e;
  }

  const parsed = saveInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Neispravni podaci: " + parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const { productId, payload, tagIds, relatedIds } = parsed.data;
  const isEdit = !!productId;

  let id: string;
  let previousSlug: string | null = null;

  if (isEdit) {
    const { data: existing } = await supabase
      .from("products")
      .select("slug")
      .eq("id", productId!)
      .maybeSingle();
    previousSlug = existing?.slug ?? null;

    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId!);
    if (error) return { ok: false, error: error.message };
    id = productId!;
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id;
  }

  // Sync product_tags: replace all
  {
    const { error: delErr } = await supabase.from("product_tags").delete().eq("product_id", id);
    if (delErr) return { ok: false, error: delErr.message };
    if (tagIds.length > 0) {
      const { error: insErr } = await supabase
        .from("product_tags")
        .insert(tagIds.map((tag_id) => ({ product_id: id, tag_id })));
      if (insErr) return { ok: false, error: insErr.message };
    }
  }

  // Sync connected product_relations: replace all of type=connected
  {
    const { error: delErr } = await supabase
      .from("product_relations")
      .delete()
      .eq("product_id", id)
      .eq("type", "connected");
    if (delErr) return { ok: false, error: delErr.message };
    if (relatedIds.length > 0) {
      const { error: insErr } = await supabase
        .from("product_relations")
        .insert(
          relatedIds.map((related_id, idx) => ({
            product_id: id,
            related_id,
            type: "connected" as const,
            sort_order: idx,
          }))
        );
      if (insErr) return { ok: false, error: insErr.message };
    }
  }

  // Invalidate both the old and new slugs in case the slug changed.
  if (previousSlug && previousSlug !== payload.slug) {
    revalidatePath(`/najam/${previousSlug}`);
  }
  revalidateProductPaths(payload.slug);

  return { ok: true, data: { id, slug: payload.slug } };
}

const deleteInputSchema = z.object({
  productId: z.string().uuid(),
});

export async function deleteProduct(input: z.infer<typeof deleteInputSchema>): Promise<ActionResult> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin(["owner", "manager"]));
  } catch (e) {
    if (e instanceof NotAuthorizedError) return { ok: false, error: "Niste ovlašteni." };
    throw e;
  }

  const parsed = deleteInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Neispravni ID." };

  const { data: existing } = await supabase
    .from("products")
    .select("slug")
    .eq("id", parsed.data.productId)
    .maybeSingle();

  const { error } = await supabase.from("products").delete().eq("id", parsed.data.productId);
  if (error) return { ok: false, error: error.message };

  revalidateProductPaths(existing?.slug ?? null);
  return { ok: true, data: undefined };
}

// Re-exported so the client form can use the shared type without hitting the
// server schemas directly.
export type { FaqItem };
