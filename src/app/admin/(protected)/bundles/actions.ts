"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, NotAuthorizedError } from "@/lib/admin-auth";

const bundleProductSchema = z.object({
  product_id: z.string().uuid(),
  qty: z.number().int().min(1),
});

const bundlePayloadSchema = z.object({
  name: z.string().min(1, "Naziv je obavezan."),
  slug: z.string().min(1, "Slug je obavezan.").regex(/^[a-z0-9-]+$/),
  description: z.string().nullable(),
  hero_image_url: z.string().nullable(),
  discount_type: z.enum(["percent", "fixed"]).nullable(),
  discount_value: z.number().nullable(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
});

const saveInputSchema = z.object({
  bundleId: z.string().uuid().optional(),
  payload: bundlePayloadSchema,
  products: z.array(bundleProductSchema),
});

export type SaveBundleInput = z.infer<typeof saveInputSchema>;
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

function revalidateBundlePaths(slug?: string | null) {
  revalidatePath("/admin/bundles");
  revalidatePath("/paketi");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/paketi/${slug}`);
}

export async function saveBundle(
  input: SaveBundleInput
): Promise<ActionResult<{ id: string; slug: string }>> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin(["owner", "manager", "editor"]));
  } catch (e) {
    if (e instanceof NotAuthorizedError) return { ok: false, error: "Niste ovlašteni." };
    throw e;
  }

  const parsed = saveInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Neispravni podaci: " + parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const { bundleId, payload, products } = parsed.data;
  const isEdit = !!bundleId;

  let id: string;
  let previousSlug: string | null = null;

  if (isEdit) {
    const { data: existing } = await supabase
      .from("bundles")
      .select("slug")
      .eq("id", bundleId!)
      .maybeSingle();
    previousSlug = existing?.slug ?? null;

    const { error } = await supabase.from("bundles").update(payload).eq("id", bundleId!);
    if (error) return { ok: false, error: error.message };
    id = bundleId!;
  } else {
    const { data, error } = await supabase
      .from("bundles")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id;
  }

  // Replace bundle_products entirely.
  {
    const { error: delErr } = await supabase
      .from("bundle_products")
      .delete()
      .eq("bundle_id", id);
    if (delErr) return { ok: false, error: delErr.message };

    if (products.length > 0) {
      const { error: insErr } = await supabase
        .from("bundle_products")
        .insert(products.map((p) => ({ bundle_id: id, product_id: p.product_id, qty: p.qty })));
      if (insErr) return { ok: false, error: insErr.message };
    }
  }

  if (previousSlug && previousSlug !== payload.slug) {
    revalidatePath(`/paketi/${previousSlug}`);
  }
  revalidateBundlePaths(payload.slug);

  return { ok: true, data: { id, slug: payload.slug } };
}

const deleteInputSchema = z.object({ bundleId: z.string().uuid() });

export async function deleteBundle(
  input: z.infer<typeof deleteInputSchema>
): Promise<ActionResult> {
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
    .from("bundles")
    .select("slug")
    .eq("id", parsed.data.bundleId)
    .maybeSingle();

  const { error } = await supabase.from("bundles").delete().eq("id", parsed.data.bundleId);
  if (error) return { ok: false, error: error.message };

  revalidateBundlePaths(existing?.slug ?? null);
  return { ok: true, data: undefined };
}
