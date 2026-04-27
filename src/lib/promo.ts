import type { CartItem } from "@/lib/cart";
import { createAdminClient } from "@/lib/supabase/admin";

export interface PromoValidationItem {
  productId: string;
  totalPrice: number; // line subtotal (price × qty)
  bundleId?: string | null;
  categoryId?: string | null;
}

export type PromoValidationResult =
  | { ok: true; promotionId: string; code: string; discount: number; appliesLabel: string }
  | { ok: false; error: string };

const ERR_NOT_FOUND = "Promo kod nije pronađen.";
const ERR_INACTIVE = "Promo kod nije aktivan.";
const ERR_EXHAUSTED = "Promo kod je iskorišten.";
const ERR_NOT_STARTED = "Promo kod još nije aktivan.";
const ERR_EXPIRED = "Promo kod je istekao.";
const ERR_MIN_DAYS = (n: number) => `Promo kod zahtijeva minimalno ${n} dana najma.`;
const ERR_NO_MATCH = "Promo kod ne važi za stavke u košarici.";

/**
 * Look up a promo code, validate eligibility against the cart, and compute the
 * discount amount. Used by both the cart's "primijeni" button and the final
 * inquiry submission so the discount can never be tampered with client-side.
 *
 * Does NOT increment usage_count — that happens only when an inquiry is
 * actually persisted (see /api/inquiry/route.ts).
 */
export async function validatePromoCode(
  code: string,
  items: PromoValidationItem[],
  rentalDays: number
): Promise<PromoValidationResult> {
  const supabase = createAdminClient();

  const trimmed = code.trim();
  if (!trimmed) return { ok: false, error: ERR_NOT_FOUND };

  const { data: promo } = await supabase
    .from("promotions")
    .select("*")
    .eq("code", trimmed)
    .maybeSingle();

  if (!promo) return { ok: false, error: ERR_NOT_FOUND };
  if (!promo.is_active) return { ok: false, error: ERR_INACTIVE };

  if (promo.usage_limit !== null && promo.usage_count >= promo.usage_limit) {
    return { ok: false, error: ERR_EXHAUSTED };
  }

  const now = Date.now();
  if (promo.starts_at && new Date(promo.starts_at).getTime() > now) {
    return { ok: false, error: ERR_NOT_STARTED };
  }
  if (promo.ends_at && new Date(promo.ends_at).getTime() < now) {
    return { ok: false, error: ERR_EXPIRED };
  }

  if (promo.min_days !== null && rentalDays < promo.min_days) {
    return { ok: false, error: ERR_MIN_DAYS(promo.min_days) };
  }

  // Filter items by scope.
  let eligible = items;
  let appliesLabel = "sve stavke";
  if (promo.applies_to === "product" && promo.applies_to_id) {
    eligible = items.filter((i) => i.productId === promo.applies_to_id);
    appliesLabel = "odabrani proizvod";
  } else if (promo.applies_to === "bundle" && promo.applies_to_id) {
    eligible = items.filter((i) => i.bundleId === promo.applies_to_id);
    appliesLabel = "odabrani paket";
  } else if (promo.applies_to === "category" && promo.applies_to_id) {
    eligible = items.filter((i) => i.categoryId === promo.applies_to_id);
    appliesLabel = "odabranu kategoriju";
  }

  if (eligible.length === 0) return { ok: false, error: ERR_NO_MATCH };

  const eligibleSubtotal = eligible.reduce((sum, i) => sum + i.totalPrice, 0);
  if (eligibleSubtotal <= 0) return { ok: false, error: ERR_NO_MATCH };

  let discount = 0;
  if (promo.discount_type === "percent") {
    discount = Math.round((eligibleSubtotal * (promo.discount_value ?? 0)) / 100 * 100) / 100;
  } else if (promo.discount_type === "fixed") {
    discount = Math.min(eligibleSubtotal, promo.discount_value ?? 0);
  } else if (promo.discount_type === "free_day") {
    // free_day: subtract one day's worth from eligible subtotal (rentalDays > 0).
    if (rentalDays > 0) {
      discount = Math.round((eligibleSubtotal / rentalDays) * 100) / 100;
    }
  }

  if (discount <= 0) return { ok: false, error: ERR_NO_MATCH };

  return {
    ok: true,
    promotionId: promo.id,
    code: trimmed,
    discount,
    appliesLabel,
  };
}

/**
 * Convert a CartItem[] to PromoValidationItem[] (drop client-only fields,
 * categoryId left null since the cart doesn't carry it — promo for category
 * scope is enforced server-side from product → category lookup if needed).
 */
export function toPromoItems(items: CartItem[]): PromoValidationItem[] {
  return items.map((i) => ({
    productId: i.productId,
    totalPrice: i.totalPrice,
    bundleId: i.bundleId ?? null,
    categoryId: null,
  }));
}
