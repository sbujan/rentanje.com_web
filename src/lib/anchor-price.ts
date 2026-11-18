import { calcRentalPrice, effectiveDailyRate, type PricingTiers } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

/**
 * Anchor price ("sidrena cijena"): the price a product had on the reference
 * date, which the site shows next to the current price. It comes from the
 * products.anchor_* columns and is never derived from the current price: if
 * a product has no stored anchor, nothing is shown.
 *
 * The wording lives here so a change in the required text is one edit.
 */
export const ANCHOR_PRICE_LABEL = "Cijena na";

/** The products.anchor_* columns. Optional: a database without them yields no anchor. */
export interface AnchorPriceFields {
  anchor_price_per_day?: number | null;
  anchor_price_per_3days?: number | null;
  anchor_price_per_7days?: number | null;
  anchor_price_date?: string | null;
}

export interface AnchorPrice {
  /** "YYYY-MM-DD" */
  date: string;
  tiers: PricingTiers;
}

export function getAnchorPrice(p: AnchorPriceFields): AnchorPrice | null {
  if (!p.anchor_price_date || p.anchor_price_per_7days == null) return null;
  return {
    date: p.anchor_price_date,
    tiers: {
      price_per_day: p.anchor_price_per_day ?? null,
      price_per_3days: p.anchor_price_per_3days ?? null,
      price_per_7days: p.anchor_price_per_7days,
    },
  };
}

/** Anchor counterpart of the "od X €/dan" figure. */
export function anchorDailyRate(anchor: AnchorPrice): number {
  return effectiveDailyRate(anchor.tiers);
}

/** Anchor counterpart of the price for a rental of `days` days. */
export function anchorRentalPrice(anchor: AnchorPrice, days: number): number {
  return calcRentalPrice(days, anchor.tiers).price;
}

/** "2026-09-10" -> "10.09.2026" */
export function formatAnchorDate(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : ymd;
}

/** "Cijena na 10.09.2026: 30 €/dan" */
export function anchorPriceText(date: string, amount: number, unit = ""): string {
  return `${ANCHOR_PRICE_LABEL} ${formatAnchorDate(date)}: ${formatPrice(amount)}${unit}`;
}

/**
 * One line for the price tiers shown side by side, each amount named so it
 * cannot be mistaken: "Cijena na 10.09.2026: 1 dan 40 €, 3 dana 70 €".
 */
export function anchorTiersText(date: string, tiers: { label: string; amount: number }[]): string {
  const parts = tiers.map((t) => `${t.label} ${formatPrice(t.amount)}`).join(", ");
  return `${ANCHOR_PRICE_LABEL} ${formatAnchorDate(date)}: ${parts}`;
}

/**
 * One anchor line for several prices added together (a bundle, the cart).
 * Only when every part has an anchor and all refer to the same date;
 * otherwise there is no single true "price on date" to show.
 */
export function sumAnchorPrices(parts: ({ date: string; amount: number } | null)[]): { date: string; amount: number } | null {
  if (parts.length === 0) return null;
  let total = 0;
  let date: string | null = null;
  for (const part of parts) {
    if (!part) return null;
    if (date !== null && part.date !== date) return null;
    date = part.date;
    total += part.amount;
  }
  return date === null ? null : { date, amount: total };
}
