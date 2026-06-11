import { describe, expect, it } from "vitest";
import { cleanSeoTitle, jsonLdSafe } from "@/lib/seo";

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
