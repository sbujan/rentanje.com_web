/**
 * Per-product delivery rules, shared by the cart UI (display) and
 * /api/inquiry (authoritative recomputation).
 *
 * - A cart can be delivered only when EVERY line allows delivery. One
 *   pickup-only product makes the whole inquiry pickup-only.
 * - The fee charged is the highest single-product fee in the cart. It is not
 *   summed and not multiplied by quantity: one van trip, one fee.
 * - A fee of 0 on a deliverable product means free delivery.
 */

/** Global service-area note shown next to the delivery option. */
export const DELIVERY_AREA_NOTE =
  "Dostavljamo na području Zagreba i okolice. Izvan Zagreba cijena dostave na upit.";

export interface DeliveryLine {
  productName: string;
  /**
   * `null`/`undefined` = unknown (cart items persisted before this feature
   * existed). Treated as deliverable so the UI does not block on stale data;
   * the server always has the real value and decides.
   */
  deliveryAvailable: boolean | null | undefined;
  deliveryFee: number | null | undefined;
}

export type DeliveryQuote =
  | { available: true; fee: number }
  | { available: false; blockedBy: string[] };

export function resolveDelivery(lines: DeliveryLine[]): DeliveryQuote {
  const blockedBy = Array.from(
    new Set(
      lines.filter((l) => l.deliveryAvailable === false).map((l) => l.productName)
    )
  );
  if (blockedBy.length > 0) return { available: false, blockedBy };

  const fee = lines.reduce((max, l) => {
    const f = Number(l.deliveryFee ?? 0);
    return Number.isFinite(f) && f > max ? f : max;
  }, 0);
  return { available: true, fee };
}

/** Spec-table value for a single product page. */
export function deliverySpecValue(available: boolean, fee: number): string {
  if (!available) return "Samo preuzimanje";
  if (fee <= 0) return "Besplatna dostava";
  return `Moguća, ${fee} €`;
}
