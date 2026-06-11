import { eachDayOfInterval, parseISO, format } from "date-fns";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { CartItem } from "@/lib/cart";

/** One availability row: units already booked for a product on a calendar day. */
export interface AvailabilityRecord {
  date: string;
  qty_booked: number;
}

export function expandRentalDates(start: string | null, end: string | null): string[] {
  if (!start || !end) return [];
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  if (endDate < startDate) return [];
  return eachDayOfInterval({ start: startDate, end: endDate }).map((d) =>
    format(d, "yyyy-MM-dd")
  );
}

export interface UnavailableHit {
  productId: string;
  productName: string;
  dates: string[];
}

/** Min free units across the given dates; stockQty if no dates given. */
export function maxAvailableUnits(
  availability: AvailabilityRecord[],
  stockQty: number,
  dates: string[],
): number {
  if (dates.length === 0) return stockQty;
  const bookedByDate = new Map<string, number>();
  for (const a of availability) {
    bookedByDate.set(a.date, (bookedByDate.get(a.date) ?? 0) + a.qty_booked);
  }
  let min = stockQty;
  for (const d of dates) min = Math.min(min, stockQty - (bookedByDate.get(d) ?? 0));
  return Math.max(0, min);
}

type AvailabilityCartItem = Pick<
  CartItem,
  "productId" | "productName" | "rentalStart" | "rentalEnd" | "qty"
>;

export type AvailabilityCheckResult =
  | { ok: true }
  | { ok: false; conflicts: UnavailableHit[] };

export async function validateCartAvailability(
  supabase: SupabaseClient<Database>,
  items: AvailabilityCartItem[]
): Promise<AvailabilityCheckResult> {
  const productDates = new Map<string, Set<string>>();
  const cartDemand = new Map<string, number>();

  for (const item of items) {
    if (!item?.productId) continue;
    const dates = expandRentalDates(item.rentalStart, item.rentalEnd);
    if (dates.length === 0) continue;
    if (!productDates.has(item.productId)) productDates.set(item.productId, new Set());
    const set = productDates.get(item.productId)!;
    const qty = Number(item.qty) > 0 ? Number(item.qty) : 1;
    for (const d of dates) {
      set.add(d);
      const key = `${item.productId}|${d}`;
      cartDemand.set(key, (cartDemand.get(key) ?? 0) + qty);
    }
  }

  const productIds = Array.from(productDates.keys());
  if (productIds.length === 0) return { ok: true };

  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("id, name, stock_qty")
    .in("id", productIds);
  if (pErr) throw pErr;

  const stockById = new Map<string, number>();
  const nameById = new Map<string, string>();
  for (const p of products ?? []) {
    stockById.set(p.id, p.stock_qty ?? 0);
    nameById.set(p.id, p.name);
  }

  const { data: avail, error: aErr } = await supabase
    .from("availability")
    .select("product_id, date, qty_booked")
    .in("product_id", productIds);
  if (aErr) throw aErr;

  const booked = new Map<string, number>();
  for (const row of avail ?? []) {
    const key = `${row.product_id}|${row.date}`;
    booked.set(key, (booked.get(key) ?? 0) + (row.qty_booked ?? 0));
  }

  const conflicts = new Map<string, UnavailableHit>();
  for (const [productId, dateSet] of Array.from(productDates.entries())) {
    const stock = stockById.get(productId) ?? 0;
    const productName = nameById.get(productId) ?? "Proizvod";
    for (const date of Array.from(dateSet)) {
      const key = `${productId}|${date}`;
      const existing = booked.get(key) ?? 0;
      const fromCart = cartDemand.get(key) ?? 0;
      if (stock - existing < fromCart) {
        if (!conflicts.has(productId)) {
          conflicts.set(productId, { productId, productName, dates: [] });
        }
        conflicts.get(productId)!.dates.push(date);
      }
    }
  }

  if (conflicts.size === 0) return { ok: true };
  return {
    ok: false,
    conflicts: Array.from(conflicts.values()).map((c) => ({
      ...c,
      dates: c.dates.sort(),
    })),
  };
}

type InquiryItem = Pick<CartItem, "productId" | "rentalStart" | "rentalEnd" | "qty">;

/**
 * Reserve the (product, date) pairs of an inquiry atomically via the
 * `reserve_inquiry_availability` RPC. In one DB transaction the function
 * locks the affected product rows, re-checks remaining stock and inserts
 * the availability rows — closing the race where two concurrent inquiries
 * for the last unit both pass a separate pre-check.
 *
 * Returns the conflicts found (empty array = reservation succeeded).
 * With `force: true` (admin re-sync / un-cancel) the stock check is
 * skipped and rows are written unconditionally. Idempotent either way:
 * prior rows from the same inquiry are replaced.
 */
export async function insertAvailabilityRowsForInquiry(
  supabase: SupabaseClient<Database>,
  inquiryId: string,
  inquiryNumber: string,
  items: InquiryItem[],
  options: { force?: boolean } = {}
): Promise<UnavailableHit[]> {
  const payload = items
    .filter((item) => item?.productId && item.rentalStart && item.rentalEnd)
    .map((item) => ({
      productId: item.productId,
      rentalStart: item.rentalStart,
      rentalEnd: item.rentalEnd,
      qty: Number(item.qty) > 0 ? Number(item.qty) : 1,
    }));
  if (payload.length === 0) return [];

  const { data, error } = await supabase.rpc("reserve_inquiry_availability", {
    p_inquiry_id: inquiryId,
    p_inquiry_number: inquiryNumber,
    p_items: payload,
    p_force: options.force ?? false,
  });
  if (error) throw error;

  return Array.isArray(data) ? (data as unknown as UnavailableHit[]) : [];
}

export async function deleteAvailabilityRowsForInquiry(
  supabase: SupabaseClient<Database>,
  inquiryId: string
): Promise<void> {
  const { error } = await supabase
    .from("availability")
    .delete()
    .eq("source_inquiry_id", inquiryId);
  if (error) throw error;
}
