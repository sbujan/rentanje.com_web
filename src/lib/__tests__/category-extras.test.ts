import { describe, expect, it } from "vitest";
import { CATEGORY_EXTRA_PRODUCT_IDS, extraProductIdsForCategory, withExtraProducts } from "@/lib/category-extras";
import { FALLBACK_CATEGORY_SLUGS, getLandingPage } from "@/lib/landing-pages";

describe("category extras", () => {
  it("only names known categories", () => {
    for (const slug of Object.keys(CATEGORY_EXTRA_PRODUCT_IDS)) expect(FALLBACK_CATEGORY_SLUGS).toContain(slug);
  });

  it("shows the GoPro cameras under audio and video too", () => {
    const gopro = getLandingPage("gopro-kamere")!;
    expect(extraProductIdsForCategory("audio-video-oprema")).toEqual(gopro.brandProductIds);
    expect(extraProductIdsForCategory("kamp-outdoor")).toEqual([]);
  });

  it("appends extras after the category's own products, in config order, without duplicates", () => {
    const own = [{ id: "a" }, { id: "b" }];
    const extras = [{ id: "y" }, { id: "x" }, { id: "b" }];
    expect(withExtraProducts(own, extras, ["x", "y", "b", "missing"]).map((p) => p.id)).toEqual(["a", "b", "x", "y"]);
    expect(withExtraProducts(own, [], ["x"]).map((p) => p.id)).toEqual(["a", "b"]);
  });
});
