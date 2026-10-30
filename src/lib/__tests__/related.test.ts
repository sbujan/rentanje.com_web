import { describe, expect, it } from "vitest";
import { pickNeighbors } from "@/lib/related";

const items = ["a", "b", "c", "d", "e", "f"].map((id) => ({ id }));
const ids = (xs: { id: string }[]) => xs.map((x) => x.id);

describe("pickNeighbors", () => {
  it("takes the products that follow, wrapping around", () => {
    expect(ids(pickNeighbors(items, "e", new Set(), 4))).toEqual(["f", "a", "b", "c"]);
  });

  it("never returns the product itself", () => {
    expect(ids(pickNeighbors(items, "a", new Set(), 10))).toEqual(["b", "c", "d", "e", "f"]);
  });

  it("skips curated ids", () => {
    expect(ids(pickNeighbors(items, "b", new Set(["c", "d"]), 2))).toEqual(["e", "f"]);
  });

  it("spreads inbound links: every product is picked by someone", () => {
    const linked = new Set(items.flatMap((p) => ids(pickNeighbors(items, p.id, new Set(), 2))));
    expect(linked).toEqual(new Set(ids(items)));
  });

  it("handles a product missing from the list and empty input", () => {
    expect(ids(pickNeighbors(items, "zzz", new Set(), 2))).toEqual(["b", "c"]);
    expect(pickNeighbors([], "a", new Set(), 4)).toEqual([]);
    expect(pickNeighbors(items, "a", new Set(), 0)).toEqual([]);
  });
});
