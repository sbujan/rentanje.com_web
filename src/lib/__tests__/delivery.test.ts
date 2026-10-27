import { describe, expect, it } from "vitest";
import { resolveDelivery, deliverySpecValue } from "@/lib/delivery";

const line = (
  productName: string,
  deliveryAvailable: boolean | null | undefined,
  deliveryFee: number | null | undefined
) => ({ productName, deliveryAvailable, deliveryFee });

describe("resolveDelivery", () => {
  it("charges the highest single fee, not the sum", () => {
    const q = resolveDelivery([line("A", true, 20), line("B", true, 35), line("C", true, 10)]);
    expect(q).toEqual({ available: true, fee: 35 });
  });

  it("ignores quantity: the fee is per cart, not per unit", () => {
    // Quantity is not part of the line at all, so three identical lines still
    // resolve to one fee.
    const q = resolveDelivery([line("A", true, 20), line("A", true, 20), line("A", true, 20)]);
    expect(q).toEqual({ available: true, fee: 20 });
  });

  it("blocks delivery for the whole cart when one product is pickup-only", () => {
    const q = resolveDelivery([line("Projektor", true, 20), line("Napuhanac", false, 0)]);
    expect(q).toEqual({ available: false, blockedBy: ["Napuhanac"] });
  });

  it("lists every blocking product once", () => {
    const q = resolveDelivery([
      line("Napuhanac", false, 0),
      line("Napuhanac", false, 0),
      line("Šator", false, 0),
    ]);
    expect(q).toEqual({ available: false, blockedBy: ["Napuhanac", "Šator"] });
  });

  it("treats a 0 fee as free delivery", () => {
    expect(resolveDelivery([line("A", true, 0)])).toEqual({ available: true, fee: 0 });
  });

  it("treats unknown (legacy cart) lines as deliverable with no fee", () => {
    expect(resolveDelivery([line("Old", undefined, undefined), line("New", true, 20)])).toEqual({
      available: true,
      fee: 20,
    });
    expect(resolveDelivery([line("Old", null, null)])).toEqual({ available: true, fee: 0 });
  });

  it("handles an empty cart", () => {
    expect(resolveDelivery([])).toEqual({ available: true, fee: 0 });
  });
});

describe("deliverySpecValue", () => {
  it("describes the three states", () => {
    expect(deliverySpecValue(false, 20)).toBe("Samo preuzimanje");
    expect(deliverySpecValue(true, 0)).toBe("Besplatna dostava");
    expect(deliverySpecValue(true, 20)).toBe("Moguća, 20 €");
  });
});
