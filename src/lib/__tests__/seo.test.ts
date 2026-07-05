import { describe, expect, it } from "vitest";
import { cleanSeoTitle, jsonLdSafe, productTitleField } from "@/lib/seo";

const BRAND = /rentanje\.com/i;

describe("jsonLdSafe", () => {
  it("escapes </script> so strings cannot break out of the script tag", () => {
    const out = jsonLdSafe({ name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c/script");
    // Still valid JSON round-trip.
    expect(JSON.parse(out)).toEqual({ name: "</script><script>alert(1)</script>" });
  });

  it("escapes U+2028 and U+2029 line separators", () => {
    const out = jsonLdSafe({ s: "a\u2028b\u2029c" });
    expect(out).not.toContain("\u2028");
    expect(out).not.toContain("\u2029");
    expect(out).toContain("\\u2028");
    expect(out).toContain("\\u2029");
    expect(JSON.parse(out)).toEqual({ s: "a\u2028b\u2029c" });
  });
});

describe("cleanSeoTitle", () => {
  it("strips pipe/dash brand suffix variants", () => {
    expect(cleanSeoTitle("Naslov | rentanje.com")).toBe("Naslov");
    expect(cleanSeoTitle("Naslov - rentanje.com")).toBe("Naslov");
    expect(cleanSeoTitle("Naslov – rentanje.com")).toBe("Naslov");
    expect(cleanSeoTitle("Naslov — rentanje.com")).toBe("Naslov");
    expect(cleanSeoTitle("Naslov|rentanje.com")).toBe("Naslov");
  });

  it("is case-insensitive and tolerates trailing whitespace", () => {
    expect(cleanSeoTitle("Naslov | RENTANJE.COM  ")).toBe("Naslov");
  });

  it("leaves clean titles alone", () => {
    expect(cleanSeoTitle("Naslov bez sufiksa")).toBe("Naslov bez sufiksa");
  });

  it("does not strip the brand when it appears mid-title", () => {
    expect(cleanSeoTitle("rentanje.com vodič za najam")).toBe("rentanje.com vodič za najam");
  });
});

describe("productTitleField", () => {
  // Invariant: the returned value never carries the brand, because the root
  // layout template ("%s | rentanje.com") appends it exactly once.
  it("falls back to a brand-free, price-bearing title when seo_title is empty", () => {
    const t = productTitleField(null, "GoPro Hero 10", 20);
    expect(t).toBe("Najam GoPro Hero 10 — od 20 €/dan");
    expect(t).not.toMatch(BRAND);
    expect(t).toContain("20 €/dan");
  });

  it("strips a brand suffix off a DB seo_title so the template doesn't double it", () => {
    expect(productTitleField("Najam JBL Charge 3 | Bluetooth zvučnik | Rentanje.com", "JBL Charge 3", 7))
      .toBe("Najam JBL Charge 3 | Bluetooth zvučnik");
    expect(productTitleField("Najam Ledomata | rentanje.com", "Ledomat", 15)).not.toMatch(/\|\s*rentanje\.com\s*$/i);
  });

  it("leaves a brand-free DB seo_title untouched", () => {
    expect(productTitleField("Najam DJI Mini 2 drona — 4K video", "DJI Mini 2", 20))
      .toBe("Najam DJI Mini 2 drona — 4K video");
  });
});
