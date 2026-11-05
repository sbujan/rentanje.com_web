import { describe, expect, it } from "vitest";
import { PRODUCT_REDIRECTS, legacyQueryRedirect } from "@/lib/legacy-redirects.mjs";

const run = (pathname: string, query: string) =>
  legacyQueryRedirect(pathname, new URLSearchParams(query));

const PARTYBOX = "/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima";

describe("legacyQueryRedirect", () => {
  it("sends an old product link to the product and drops the parameter", () => {
    expect(run("/", "product=jbl-partybox-310")).toEqual({ pathname: PARTYBOX, drop: ["product"] });
  });

  it("sends an unknown product link to the catalogue", () => {
    expect(run("/", "product=nepostojeci")).toEqual({ pathname: "/oprema", drop: ["product"] });
    expect(run("/", "product=")).toEqual({ pathname: "/oprema", drop: ["product"] });
  });

  it("cleans addresses Google already learned", () => {
    expect(run(PARTYBOX, "product=jbl-partybox-310")).toEqual({ pathname: PARTYBOX, drop: ["product"] });
    expect(run("/oprema", "product=gopro-hero-13")).toEqual({ pathname: "/oprema", drop: ["product"] });
  });

  it("moves the old category filter to the category page", () => {
    expect(run("/oprema", "cat=rostilj-kuhanje")).toEqual({
      pathname: "/najam/rostilj-kuhanje",
      drop: ["cat", "product"],
    });
  });

  it("does not build a path from a malformed category", () => {
    expect(run("/oprema", "cat=../../admin")).toEqual({ pathname: "/oprema", drop: ["cat", "product"] });
    expect(run("/oprema", "cat=https://example.com")?.pathname).toBe("/oprema");
  });

  it("leaves clean URLs and unrelated parameters alone", () => {
    expect(run("/", "")).toBeNull();
    expect(run("/", "utm_source=google")).toBeNull();
    expect(run("/oprema", "")).toBeNull();
    expect(run(PARTYBOX, "utm_source=google")).toBeNull();
    expect(run("/blog/nesto", "product=x")).toBeNull();
  });

  it("settles after one hop: the result needs no further redirect", () => {
    for (const [, destination] of PRODUCT_REDIRECTS) {
      expect(run(destination, ""), destination).toBeNull();
    }
  });
});
