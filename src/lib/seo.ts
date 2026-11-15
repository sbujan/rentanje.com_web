/**
 * SEO helpers shared by public pages.
 */

/**
 * Serialize an object for embedding inside a <script type="application/ld+json">
 * tag. Escapes `<` so attacker-controlled strings (e.g. `</script><script>...`)
 * can't break out of the script element, plus the JS line separators U+2028 and
 * U+2029 which are valid JSON but invalid in inline JS.
 */
export function jsonLdSafe(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Strip a trailing "| rentanje.com" / "– rentanje.com" / "— rentanje.com"
 * (any spacing/dash variant, case-insensitive) from a title. DB seo_title
 * values often carry the brand suffix already; the root layout title
 * template re-appends it, so we de-duplicate here.
 */
export function cleanSeoTitle(t: string): string {
  return t.replace(/\s*[|\-–—]\s*rentanje\.com\s*$/i, "").trim();
}

/**
 * Token that SEO copy (product seo_title / seo_description / description /
 * FAQ answers, brand-hub copy) may contain instead of a hard-coded number. It is replaced with the live
 * daily rate at render time, so a price change in admin can never leave a
 * stale "od 20 €/dan" in the SERP.
 */
export const PRICE_PLACEHOLDER = "{cijena}";
/** Price for a 3-day rental, e.g. "70 € za 3 dana". */
export const PRICE_3DAYS_PLACEHOLDER = "{cijena3}";
/** Price for a 7-day rental. */
export const PRICE_7DAYS_PLACEHOLDER = "{cijena7}";

export interface PriceTiers {
  price_per_3days?: number | null;
  price_per_7days?: number | null;
}

/**
 * Replace the price placeholders in `text`: {cijena} with the daily rate,
 * {cijena3} and {cijena7} with the 3-day and 7-day prices. A missing tier
 * falls back to the daily rate times the days, so a placeholder never
 * reaches the page as literal text.
 */
export function fillPrice(text: string, dailyRate: number, tiers?: PriceTiers): string {
  return text
    .split(PRICE_PLACEHOLDER)
    .join(String(dailyRate))
    .split(PRICE_3DAYS_PLACEHOLDER)
    .join(String(tiers?.price_per_3days ?? dailyRate * 3))
    .split(PRICE_7DAYS_PLACEHOLDER)
    .join(String(tiers?.price_per_7days ?? dailyRate * 7));
}

/**
 * Build the `title` field for a product page. The root layout template appends
 * " | rentanje.com", so the returned value must never carry its own brand
 * suffix (or the SERP shows it twice). DB `seo_title` values often include the
 * brand, so we strip it; the price-bearing fallback is brand-free by design.
 */
export function productTitleField(
  seoTitle: string | null | undefined,
  name: string,
  dailyRate: number,
  tiers?: PriceTiers
): string {
  return cleanSeoTitle(fillPrice(seoTitle ?? `Najam ${name} od ${dailyRate} €/dan`, dailyRate, tiers));
}
