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
      await insertAvailabilityRowsForInquiry(
        supabase,
        inquiryId,
        inquiry.inquiry_number,
        items
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
