/**
 * Block-based rental pricing: greedily stack 7-day, 3-day and 1-day blocks,
 * then check if upgrading the leftover to a bigger block is cheaper.
 * Returns the best price + a flag indicating an upgrade was applied.
 */
export interface PricingTiers {
  price_per_day: number | null;
  price_per_3days: number | null;
  price_per_7days: number;
}

export function calcRentalPrice(days: number, p: PricingTiers): { price: number; upgraded: boolean } {
  if (days <= 0) return { price: 0, upgraded: false };

  const p1 = p.price_per_day ?? Infinity;
  const p3 = p.price_per_3days ?? Infinity;
  const p7 = p.price_per_7days;

  const n7 = Math.floor(days / 7);
  const r7 = days - n7 * 7;
  const n3 = Math.floor(r7 / 3);
  const r3 = r7 - n3 * 3;

  let price = n7 * p7 + n3 * p3 + r3 * p1;
  let upgraded = false;

  if (r3 > 0 && p3 < Infinity) {
    const alt = n7 * p7 + (n3 + 1) * p3;
    if (alt < price) { price = alt; upgraded = true; }
  }

  if (r7 > 0) {
    const alt = (n7 + 1) * p7;
    if (alt < price) { price = alt; upgraded = true; }
  }

  return { price, upgraded };
}

export function applyBundleDiscount(
  subtotal: number,
  discountType: "percent" | "fixed" | null,
  discountValue: number | null
): { discount: number; total: number } {
  if (!discountType || !discountValue || discountValue <= 0) {
    return { discount: 0, total: subtotal };
  }
  if (discountType === "percent") {
    const discount = Math.round((subtotal * discountValue) / 100 * 100) / 100;
    return { discount, total: Math.max(0, subtotal - discount) };
  }
  return { discount: discountValue, total: Math.max(0, subtotal - discountValue) };
}
