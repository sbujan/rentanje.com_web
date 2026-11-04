import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isGone } from "@/lib/gone-urls";

describe("isGone", () => {
  it("matches doorway slugs however they start", () => {
    for (const p of [
      "/For-Beagle-Lovers-Flannel-Blanket-1318349",
      "/Superior-Engineering-Lift-0-847353",
      "/8-quot-Drop-Rise-12-500-Lbs-Capacity-With-Double-Ball-2-quot-1394655",
      "/quot-Drive-33mm-Extra-Deep-Impact-Socket-8-Inch-Long-6-Point-1415438",
      "/co-Aluinu-Tent-Poles-Replaceent-Pre-Assebled-Tent-Poles-1220152",
      "/feet-By-18-feet-LED-Illuminated-Patio-Mat-729898",
    ]) {
      expect(isGone(p), p).toBe(true);
    }
  });

  it("matches the cloned store trees, including their root", () => {
    for (const p of [
      "/shop",
      "/shop/product/review/add",
      "/s/sports-fan-shop",
      "/p/credit-service/benefits",
      "/ce/watches-buying-guide/index",
      "/wishlist/home",
      "/account/giftcardbalance",
      "/purchases/lookup",
    ]) {
      expect(isGone(p), p).toBe(true);
    }
  });

  it("matches old WordPress feeds", () => {
    expect(isGone("/feed")).toBe(true);
    expect(isGone("/proizvod/ledomat/feed")).toBe(true);
  });

  it("never matches a real page", () => {
    for (const p of [
      "/",
      "/oprema",
      "/paketi",
      "/paketi/paket-2-zvucnika-2-stalka-jbl-partybox-320",
      "/blog",
      "/blog/najam-satora-zagreb",
      "/najam/dji",
      "/najam/gopro-hero-13-black-najam",
      "/o-nama",
      "/kontakt",
      "/upit",
      "/hvala",
      "/privatnost",
      "/uvjeti-koristenja",
      "/uvjeti-odgovornosti",
      "/stranica/neka-stranica",
      "/admin",
      "/admin/products",
      "/api/inquiry",
      "/llms.txt",
      "/sitemap.xml",
      "/robots.txt",
    ]) {
      expect(isGone(p), p).toBe(false);
    }
  });

  it("does not catch nested slugs that merely end in digits, or lookalike roots", () => {
    expect(isGone("/najam/kamera-model-12345")).toBe(false);
    expect(isGone("/blog/vodic-2026-12345")).toBe(false);
    expect(isGone("/shopping")).toBe(false);
    expect(isGone("/proizvod/ledomat")).toBe(false);
    expect(isGone("/kontakt-1234")).toBe(false);
  });

  it("does not shadow any route that exists in the app", () => {
    // Fails if someone adds, say, an /account page without updating the rules.
    const routes = readdirSync(join(process.cwd(), "src/app/(public)"), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => `/${e.name}`);
    expect(routes.length).toBeGreaterThan(5);
    for (const r of routes) expect(isGone(r), r).toBe(false);
  });
});
