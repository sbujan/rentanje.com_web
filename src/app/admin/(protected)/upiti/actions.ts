"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eachDayOfInterval, parseISO, format } from "date-fns";
import { requireAdmin, NotAuthorizedError } from "@/lib/admin-auth";
import type { CartItem } from "@/lib/cart";

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
    .select("id, inquiry_number, status, rental_start, rental_end, items")
    .eq("id", inquiryId)
    .maybeSingle();

  if (loadErr) return { ok: false, error: loadErr.message };
  if (!inquiry) return { ok: false, error: "Upit ne postoji." };

  const wasConfirmed = inquiry.status === "confirmed";
  const willBeConfirmed = nextStatus === "confirmed";

  // Confirming (from any non-confirmed state, or re-confirming): rebuild
  // availability rows from scratch so they always reflect the current
  // inquiry items / dates.
  if (willBeConfirmed) {
    const dates = expandRentalDates(inquiry.rental_start, inquiry.rental_end);
    if (dates.length === 0) {
      return {
        ok: false,
        error: "Upit nema postavljene datume najma. Provjerite rental_start i rental_end.",
      };
    }

    const items = parseItems(inquiry.items);
    const quantities = sumQuantitiesByProduct(items);
    if (quantities.size === 0) {
      return { ok: false, error: "Upit nema stavki za blokiranje." };
    }

    // Wipe any prior rows from this inquiry (idempotent re-confirm).
    const { error: delErr } = await supabase
      .from("availability")
      .delete()
      .eq("source_inquiry_id", inquiryId);
    if (delErr) return { ok: false, error: delErr.message };

    const note = `Iz upita ${inquiry.inquiry_number}`;
    const rows: Array<{
      product_id: string;
      date: string;
      qty_booked: number;
      note: string;
      source_inquiry_id: string;
    }> = [];
    for (const [productId, qty] of Array.from(quantities.entries())) {
      for (const date of dates) {
        rows.push({
          product_id: productId,
          date,
          qty_booked: qty,
          note,
          source_inquiry_id: inquiryId,
        });
      }
    }

    const { error: insErr } = await supabase.from("availability").insert(rows);
    if (insErr) return { ok: false, error: insErr.message };
  } else if (wasConfirmed) {
    // Un-confirming: free the dates this inquiry blocked.
    const { error: delErr } = await supabase
      .from("availability")
      .delete()
      .eq("source_inquiry_id", inquiryId);
    if (delErr) return { ok: false, error: delErr.message };
  }

  const { error: updErr } = await supabase
    .from("inquiries")
    .update({ status: nextStatus })
    .eq("id", inquiryId);
  if (updErr) return { ok: false, error: updErr.message };

  revalidatePath("/admin/upiti");
  revalidatePath(`/admin/upiti/${inquiryId}`);
  revalidatePath("/admin/availability");
  // Public product pages render the calendar; bust their caches too.
  for (const slug of collectProductSlugs(inquiry.items)) {
    revalidatePath(`/najam/${slug}`);
  }

  return { ok: true, data: { status: nextStatus } };
}

function expandRentalDates(start: string | null, end: string | null): string[] {
  if (!start || !end) return [];
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  if (endDate < startDate) return [];
  return eachDayOfInterval({ start: startDate, end: endDate }).map((d) =>
    format(d, "yyyy-MM-dd")
  );
}

function parseItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw as CartItem[];
}

function sumQuantitiesByProduct(items: CartItem[]): Map<string, number> {
  const totals = new Map<string, number>();
  for (const item of items) {
    if (!item?.productId) continue;
    const qty = Number(item.qty) > 0 ? Number(item.qty) : 1;
    totals.set(item.productId, (totals.get(item.productId) ?? 0) + qty);
  }
  return totals;
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
