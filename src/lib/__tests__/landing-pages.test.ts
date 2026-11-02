import { describe, expect, it } from "vitest";
import {
  FALLBACK_CATEGORY_SLUGS,
  LANDING_PAGES,
  getLandingPage,
  landingPagesForCategory,
  landingPagesForProduct,
} from "@/lib/landing-pages";
import { sanitizeHtml } from "@/lib/sanitize";
import { fillPrice } from "@/lib/seo";

const DASH = /[—–]/;
const BRAND_SUFFIX = " | rentanje.com";

describe("LANDING_PAGES", () => {
  it("has unique slugs that do not collide with category slugs", () => {
    const slugs = LANDING_PAGES.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(FALLBACK_CATEGORY_SLUGS).not.toContain(s);
  });

  it("keeps brand products a subset of the displayed products", () => {
    for (const l of LANDING_PAGES) {
      for (const id of l.brandProductIds) expect(l.productIds).toContain(id);
      expect(new Set(l.productIds).size).toBe(l.productIds.length);
    }
  });

  it("points every hub at a known parent category", () => {
    for (const l of LANDING_PAGES) expect(FALLBACK_CATEGORY_SLUGS).toContain(l.parentCategorySlug);
  });

  it("contains no em or en dashes in any visible copy", () => {
    for (const l of LANDING_PAGES) {
      const copy = [l.h1, l.seoTitle, l.seoDescription, l.intro, l.navLabel, l.productLinkLabel, l.bodyHtml,
        ...l.faq.flatMap((f) => [f.question, f.answer])].join("\n");
      expect(copy, l.slug).not.toMatch(DASH);
    }
  });

  it("keeps the filled title within ~60 characters including the brand suffix", () => {
    for (const l of LANDING_PAGES) {
      expect(fillPrice(l.seoTitle, 99).length + BRAND_SUFFIX.length, l.slug).toBeLessThanOrEqual(60);
      expect(fillPrice(l.seoDescription, 99).length, l.slug).toBeLessThanOrEqual(160);
    }
  });

  it("keeps tables and internal links after sanitizing", () => {
    for (const l of LANDING_PAGES) {
      const clean = sanitizeHtml(l.bodyHtml);
      expect(clean, l.slug).toContain("<table>");
      expect(clean, l.slug).toContain(`href="/najam/${l.parentCategorySlug}"`);
    }
    expect(sanitizeHtml(getLandingPage("jbl-zvucnici")!.bodyHtml)).toContain(
      'href="/paketi/paket-2-zvucnika-2-stalka-jbl-partybox-320"'
    );
  });

  it("spans categories on the DJI hub: every DJI product links back to it", () => {
    const dji = getLandingPage("dji")!;
    expect(dji.productIds).toHaveLength(5);
    for (const id of dji.productIds) {
      expect(landingPagesForProduct(id).map((l) => l.slug)).toContain("dji");
    }
    expect(dji.seoTitle.startsWith("Najam DJI")).toBe(true);
    expect(dji.seoDescription).toContain("iznajmljivanje DJI");
  });

  it("has a complete FAQ", () => {
    for (const l of LANDING_PAGES) {
      expect(l.faq.length, l.slug).toBeGreaterThanOrEqual(6);
      for (const f of l.faq) {
        expect(f.question.trim()).not.toBe("");
        expect(f.answer.trim()).not.toBe("");
      }
    }
  });
});

describe("lookups", () => {
  it("finds hubs by slug, category and brand product", () => {
    const gopro = getLandingPage("gopro-kamere")!;
    expect(gopro).toBeDefined();
    expect(getLandingPage("nepostoji")).toBeUndefined();
    expect(landingPagesForCategory("kamere-i-dronovi").map((l) => l.slug)).toEqual(["gopro-kamere", "dji"]);
    expect(landingPagesForProduct(gopro.brandProductIds[0]).map((l) => l.slug)).toEqual(["gopro-kamere"]);
    // Alternatives shown on the GoPro hub (e.g. DJI) do not get a "Sve GoPro kamere" backlink.
    const alternative = gopro.productIds.find((id) => !gopro.brandProductIds.includes(id))!;
    expect(landingPagesForProduct(alternative).map((l) => l.slug)).not.toContain("gopro-kamere");
  });
});
