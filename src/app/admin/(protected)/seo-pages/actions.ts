"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, NotAuthorizedError } from "@/lib/admin-auth";
import type { Json } from "@/types/database";

const seoPagePayloadSchema = z.object({
  title: z.string().min(1, "Naslov je obavezan."),
  slug: z.string().min(1, "Slug je obavezan.").regex(/^[a-z0-9-]+$/, "Slug smije sadržavati samo mala slova, brojeve i crticu."),
  content: z.string().nullable(),
  hero_image_url: z.string().nullable(),
  is_published: z.boolean(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
  seo_keywords: z.array(z.string()).nullable(),
  schema_json: z.unknown().nullable(),
});

const saveInputSchema = z.object({
  pageId: z.string().uuid().optional(),
  payload: seoPagePayloadSchema,
});

export type SaveSeoPageInput = z.infer<typeof saveInputSchema>;
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

function revalidateSeoPaths(slug?: string | null) {
  revalidatePath("/admin/seo-pages");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/stranica/${slug}`);
}

export async function saveSeoPage(
  input: SaveSeoPageInput
): Promise<ActionResult<{ id: string; slug: string }>> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin(["owner", "manager"]));
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

  const { pageId, payload } = parsed.data;
  const isEdit = !!pageId;
  // schema_json comes through Zod as `unknown`; the DB column is jsonb so any
  // serialisable value is fine — narrow it to satisfy the typed Insert/Update.
  const dbPayload = {
    ...payload,
    schema_json: (payload.schema_json ?? null) as Json | null,
  };

  let id: string;
  let previousSlug: string | null = null;

  if (isEdit) {
    const { data: existing } = await supabase
      .from("seo_pages")
      .select("slug")
      .eq("id", pageId!)
      .maybeSingle();
    previousSlug = existing?.slug ?? null;

    // updated_at is maintained by the touch_updated_at trigger from migration 001.
    const { error } = await supabase
      .from("seo_pages")
      .update(dbPayload)
      .eq("id", pageId!);
    if (error) return { ok: false, error: error.message };
    id = pageId!;
  } else {
    const { data, error } = await supabase
      .from("seo_pages")
      .insert(dbPayload)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id;
  }

  if (previousSlug && previousSlug !== payload.slug) {
    revalidatePath(`/stranica/${previousSlug}`);
  }
  revalidateSeoPaths(payload.slug);

  return { ok: true, data: { id, slug: payload.slug } };
}

const deleteInputSchema = z.object({ pageId: z.string().uuid() });

export async function deleteSeoPage(
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
    .from("seo_pages")
    .select("slug")
    .eq("id", parsed.data.pageId)
    .maybeSingle();

  const { error } = await supabase.from("seo_pages").delete().eq("id", parsed.data.pageId);
  if (error) return { ok: false, error: error.message };

  revalidateSeoPaths(existing?.slug ?? null);
  return { ok: true, data: undefined };
}
