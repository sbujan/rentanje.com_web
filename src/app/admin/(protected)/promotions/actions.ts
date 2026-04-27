"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, NotAuthorizedError } from "@/lib/admin-auth";

const promotionPayloadSchema = z.object({
  name: z.string().min(1, "Naziv je obavezan."),
  code: z.string().nullable(),
  discount_type: z.enum(["percent", "fixed", "free_day"]),
  discount_value: z.number().nullable(),
  applies_to: z.enum(["all", "category", "product", "bundle"]),
  applies_to_id: z.string().uuid().nullable(),
  min_days: z.number().int().nullable(),
  starts_at: z.string().nullable(),
  ends_at: z.string().nullable(),
  usage_limit: z.number().int().nullable(),
  is_active: z.boolean(),
});

const saveInputSchema = z.object({
  promotionId: z.string().uuid().optional(),
  payload: promotionPayloadSchema,
});

export type SavePromotionInput = z.infer<typeof saveInputSchema>;
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

export async function savePromotion(
  input: SavePromotionInput
): Promise<ActionResult<{ id: string }>> {
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

  const { promotionId, payload } = parsed.data;

  // Normalise: applies_to=all means applies_to_id must be null.
  const normalised = {
    ...payload,
    applies_to_id: payload.applies_to === "all" ? null : payload.applies_to_id,
  };

  let id: string;
  if (promotionId) {
    const { error } = await supabase.from("promotions").update(normalised).eq("id", promotionId);
    if (error) return { ok: false, error: error.message };
    id = promotionId;
  } else {
    const { data, error } = await supabase
      .from("promotions")
      .insert(normalised)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id;
  }

  revalidatePath("/admin/promotions");
  return { ok: true, data: { id } };
}

const deleteInputSchema = z.object({ promotionId: z.string().uuid() });

export async function deletePromotion(
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

  const { error } = await supabase.from("promotions").delete().eq("id", parsed.data.promotionId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/promotions");
  return { ok: true, data: undefined };
}
