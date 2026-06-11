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
