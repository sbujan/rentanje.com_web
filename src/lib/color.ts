/** Colour helpers for backgrounds that come from the database (category colours). */

const DARK_TEXT = "#1A1A2E";
const LIGHT_TEXT = "#FFFFFF";

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
function luminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two hex colours (1 to 21); 1 if either is not a hex colour. */
export function contrastRatio(a: string, b: string): number {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) return 1;
  const [hi, lo] = [luminance(ca), luminance(cb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Dark or white text, whichever reads better on the given background. */
export function readableTextColor(background: string): string {
  return contrastRatio(background, DARK_TEXT) >= contrastRatio(background, LIGHT_TEXT) ? DARK_TEXT : LIGHT_TEXT;
}

/**
 * The colour as it looks at `amount` opacity on a white background (0 = white,
 * 1 = the colour itself), as a solid hex. Used for soft, pastel backgrounds.
 * Returns the input unchanged if it is not a hex colour.
 */
export function mixWithWhite(hex: string, amount: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const a = Math.min(1, Math.max(0, amount));
  return "#" + rgb.map((v) => Math.round(255 - (255 - v) * a).toString(16).padStart(2, "0")).join("").toUpperCase();
}
