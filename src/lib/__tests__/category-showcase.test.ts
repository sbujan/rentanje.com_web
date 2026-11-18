import { describe, expect, it } from "vitest";
import { CATEGORY_SHOWCASE_PRODUCT_IDS, pickShowcaseProducts } from "@/lib/category-showcase";
import { FALLBACK_CATEGORY_SLUGS } from "@/lib/landing-pages";

const product = (id: string, opts: { featured?: boolean; photo?: boolean } = {}) => ({
  id,
  hero_image_url: opts.photo === false ? null : `https://example.test/${id}.png`,
  is_featured: Boolean(opts.featured),
});

describe("category showcase", () => {
  it("only names known categories and lists each product once", () => {
    for (const [slug, ids] of Object.entries(CATEGORY_SHOWCASE_PRODUCT_IDS)) {
      expect(FALLBACK_CATEGORY_SLUGS).toContain(slug);
      expect(new Set(ids).size, slug).toBe(ids.length);
    }
  });

  it("shows the configured picks first, in config order", () => {
    const [first, second, third] = CATEGORY_SHOWCASE_PRODUCT_IDS["igre-na-otvorenom"];
    const products = [product("x"), product(third), product(second), product(first)];
    expect(pickShowcaseProducts("igre-na-otvorenom", products).map((p) => p.id)).toEqual([first, second, third]);
  });

  it("tops up with featured products, then the rest, when a pick is missing or has no photo", () => {
    const [first, second] = CATEGORY_SHOWCASE_PRODUCT_IDS["kamp-outdoor"];
    const products = [product("a"), product(second, { photo: false }), product("b", { featured: true }), product(first)];
    expect(pickShowcaseProducts("kamp-outdoor", products).map((p) => p.id)).toEqual([first, "b", "a"]);
  });

  it("works for a category without picks and never returns more than asked", () => {
    const products = [product("a"), product("b", { featured: true }), product("c"), product("d")];
    expect(pickShowcaseProducts("nepoznata", products).map((p) => p.id)).toEqual(["b", "a", "c"]);
    expect(pickShowcaseProducts("nepoznata", products, 1).map((p) => p.id)).toEqual(["b"]);
    expect(pickShowcaseProducts("nepoznata", [product("a", { photo: false })])).toEqual([]);
  });
});
