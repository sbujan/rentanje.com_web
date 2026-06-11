"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, NotAuthorizedError } from "@/lib/admin-auth";
import type { CartItem } from "@/lib/cart";
import {
  insertAvailabilityRowsForInquiry,
  deleteAvailabilityRowsForInquiry,
} from "@/lib/availability";

const STATUS_VALUES = ["new", "read", "replied", "confirmed", "cancelled"] as const;
type InquiryStatus = (typeof STATUS_VALUES)[number];

const setStatusSchema = z.object({
  inquiryId: z.string().uuid(),
  status: z.enum(STATUS_VALUES),
});

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function setInquiryStatus(
  input: z.infer<typeof setStatusSchema>
): Promise<ActionResult<{ status: InquiryStatus }>> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch (e) {
    if (e instanceof NotAuthorizedError) return { ok: false, error: "Niste ovlašteni." };
    throw e;
  }

  const parsed = setStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Neispravni podaci." };

  const { inquiryId, status: nextStatus } = parsed.data;

  const { data: inquiry, error: loadErr } = await supabase
    .from("inquiries")
    .select("id, inquiry_number, status, items")
    .eq("id", inquiryId)
    .maybeSingle();

  if (loadErr) return { ok: false, error: loadErr.message };
  if (!inquiry) return { ok: false, error: "Upit ne postoji." };

  const wasCancelled = inquiry.status === "cancelled";
  const willBeCancelled = nextStatus === "cancelled";

  // Availability rows are written when an inquiry is submitted. Status
  // transitions only matter when crossing the cancelled boundary:
  //  - going to cancelled: free the dates
  //  - leaving cancelled: re-reserve them
  if (willBeCancelled && !wasCancelled) {
    try {
      await deleteAvailabilityRowsForInquiry(supabase, inquiryId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Greška pri oslobađanju datuma.";
      return { ok: false, error: msg };
    }
  } else if (!willBeCancelled && wasCancelled) {
    const items = parseItems(inquiry.items);
    if (items.length === 0) {
      return { ok: false, error: "Upit nema stavki za blokiranje." };
    }
    try {
      // force: an admin re-activating an inquiry is an explicit decision —
      // write the blocks even if the dates were taken in the meantime.
      await insertAvailabilityRowsForInquiry(
        supabase,
        inquiryId,
        inquiry.inquiry_number,
        items,
        { force: true }
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Greška pri rezervaciji datuma.";
      return { ok: false, error: msg };
    }
  }

  const { error: updErr } = await supabase
    .from("inquiries")
    .update({ status: nextStatus })
    .eq("id", inquiryId);
  if (updErr) return { ok: false, error: updErr.message };

  revalidatePath("/admin/upiti");
  revalidatePath(`/admin/upiti/${inquiryId}`);
  revalidatePath("/admin/availability");
  for (const slug of collectProductSlugs(inquiry.items)) {
    revalidatePath(`/najam/${slug}`);
  }

  return { ok: true, data: { status: nextStatus } };
}

const inquiryIdSchema = z.object({ inquiryId: z.string().uuid() });

/**
 * Permanently delete an inquiry and free its reserved dates.
 * The availability FK is ON DELETE SET NULL, so we must drop the inquiry's
 * availability rows first — otherwise the date blocks would survive the delete
 * and keep those dates unavailable forever.
 */
export async function deleteInquiry(
  input: z.infer<typeof inquiryIdSchema>
): Promise<ActionResult> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin(["owner", "manager"]));
  } catch (e) {
    if (e instanceof NotAuthorizedError) return { ok: false, error: "Niste ovlašteni." };
    throw e;
  }

  const parsed = inquiryIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Neispravni ID." };

  const { inquiryId } = parsed.data;

  const { data: inquiry, error: loadErr } = await supabase
    .from("inquiries")
    .select("id, items")
    .eq("id", inquiryId)
    .maybeSingle();
  if (loadErr) return { ok: false, error: loadErr.message };
  if (!inquiry) return { ok: false, error: "Upit ne postoji." };

  // Free the dates first (FK is ON DELETE SET NULL, not CASCADE).
  try {
    await deleteAvailabilityRowsForInquiry(supabase, inquiryId);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Greška pri oslobađanju datuma.";
    return { ok: false, error: msg };
  }

  const { error: delErr } = await supabase.from("inquiries").delete().eq("id", inquiryId);
  if (delErr) return { ok: false, error: delErr.message };

  revalidatePath("/admin/upiti");
  revalidatePath("/admin/availability");
  for (const slug of collectProductSlugs(inquiry.items)) {
    revalidatePath(`/najam/${slug}`);
  }

  return { ok: true, data: undefined };
}

/**
 * Re-write the availability (date-block) rows for an inquiry from its stored
 * items. Recovery lever for bookings whose blocks silently failed to insert at
 * submission time. Idempotent — clears this inquiry's prior rows then re-inserts.
 */
export async function resyncInquiryAvailability(
  input: z.infer<typeof inquiryIdSchema>
): Promise<ActionResult<{ count: number }>> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin(["owner", "manager"]));
  } catch (e) {
    if (e instanceof NotAuthorizedError) return { ok: false, error: "Niste ovlašteni." };
    throw e;
  }

  const parsed = inquiryIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Neispravni ID." };

  const { inquiryId } = parsed.data;

  const { data: inquiry, error: loadErr } = await supabase
    .from("inquiries")
    .select("id, inquiry_number, status, items")
    .eq("id", inquiryId)
    .maybeSingle();
  if (loadErr) return { ok: false, error: loadErr.message };
  if (!inquiry) return { ok: false, error: "Upit ne postoji." };

  if (inquiry.status === "cancelled") {
    return { ok: false, error: "Upit je otkazan — termini se namjerno ne blokiraju." };
  }

  const items = parseItems(inquiry.items);
  if (items.length === 0) return { ok: false, error: "Upit nema stavki za blokiranje." };

  try {
    // force: re-sync is a manual recovery lever — the admin decides the
    // blocks must exist regardless of what was booked since.
    await insertAvailabilityRowsForInquiry(
      supabase,
      inquiryId,
      inquiry.inquiry_number,
      items,
      { force: true }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Greška pri rezervaciji datuma.";
    return { ok: false, error: msg };
  }

  revalidatePath("/admin/availability");
  for (const slug of collectProductSlugs(inquiry.items)) {
    revalidatePath(`/najam/${slug}`);
  }

  return { ok: true, data: { count: items.length } };
}

function parseItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw as CartItem[];
}

function collectProductSlugs(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return Array.from(
    new Set(
      raw
        .map((i: { slug?: unknown }) => (typeof i?.slug === "string" ? i.slug : null))
        .filter((s): s is string => !!s)
    )
  );
}
