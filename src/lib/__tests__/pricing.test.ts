import { describe, expect, it } from "vitest";
import { applyBundleDiscount, calcRentalPrice, effectiveDailyRate } from "@/lib/pricing";

const fullTiers = { price_per_day: 20, price_per_3days: 50, price_per_7days: 100 };

describe("calcRentalPrice", () => {
  it("returns 0 for zero or negative days", () => {
    expect(calcRentalPrice(0, fullTiers)).toEqual({ price: 0, upgraded: false });
    expect(calcRentalPrice(-3, fullTiers)).toEqual({ price: 0, upgraded: false });
  });

  it("prices exact tier lengths directly", () => {
    expect(calcRentalPrice(1, fullTiers).price).toBe(20);
    expect(calcRentalPrice(3, fullTiers).price).toBe(50);
    expect(calcRentalPrice(7, fullTiers).price).toBe(100);
  });

  it("stacks blocks: 10 days = one 7-day + one 3-day block", () => {
    const result = calcRentalPrice(10, fullTiers);
    expect(result.price).toBe(150);
    expect(result.upgraded).toBe(false);
  });

  it("stacks blocks: 4 days = one 3-day block + one day", () => {
    const result = calcRentalPrice(4, fullTiers);
    expect(result.price).toBe(70);
    expect(result.upgraded).toBe(false);
  });

  it("upgrades the leftover day to a 3-day block when cheaper", () => {
    // 4 days with an expensive daily rate: 3-day block (50) + 1 day (60) = 110,
    // but two 3-day blocks cost 100 — the upgrade wins.
    const tiers = { price_per_day: 60, price_per_3days: 50, price_per_7days: 100 };
    expect(calcRentalPrice(4, tiers)).toEqual({ price: 100, upgraded: true });
  });

  it("upgrades the remainder to a full 7-day block when cheaper", () => {
    // 5 days: 3-day block (50) + 2 days (40) = 90, but a 7-day block costs 80.
    const tiers = { price_per_day: 20, price_per_3days: 50, price_per_7days: 80 };
    expect(calcRentalPrice(5, tiers)).toEqual({ price: 80, upgraded: true });
  });

  it("falls back to the 7-day block when smaller tiers are unset", () => {
    // 2 days but only a weekly price exists: the raw stack is unpriceable
    // (Infinity), so the 7-day upgrade applies.
    const tiers = { price_per_day: null, price_per_3days: null, price_per_7days: 70 };
    expect(calcRentalPrice(2, tiers)).toEqual({ price: 70, upgraded: true });
  });
});

describe("effectiveDailyRate", () => {
  it("uses the daily price when present", () => {
    expect(effectiveDailyRate(fullTiers)).toBe(20);
  });

  it("falls back to a third of the 3-day price", () => {
    expect(
      effectiveDailyRate({ price_per_day: null, price_per_3days: 45, price_per_7days: 100 })
    ).toBe(15);
  });

  it("falls back to a seventh of the 7-day price, rounded", () => {
    expect(
      effectiveDailyRate({ price_per_day: null, price_per_3days: null, price_per_7days: 100 })
    ).toBe(14);
  });
});

describe("applyBundleDiscount", () => {
  it("applies a percent discount", () => {
    expect(applyBundleDiscount(200, "percent", 10)).toEqual({ discount: 20, total: 180 });
  });

  it("rounds percent discounts to cents", () => {
    expect(applyBundleDiscount(99.99, "percent", 10)).toEqual({ discount: 10, total: 89.99 });
  });

  it("applies a fixed discount", () => {
    expect(applyBundleDiscount(200, "fixed", 15)).toEqual({ discount: 15, total: 185 });
  });

  it("never produces a negative total", () => {
    expect(applyBundleDiscount(10, "fixed", 25)).toEqual({ discount: 25, total: 0 });
  });

  it("returns no discount for a null type or non-positive value", () => {
    expect(applyBundleDiscount(200, null, 10)).toEqual({ discount: 0, total: 200 });
    expect(applyBundleDiscount(200, "percent", null)).toEqual({ discount: 0, total: 200 });
    expect(applyBundleDiscount(200, "fixed", 0)).toEqual({ discount: 0, total: 200 });
  });
});
