import { describe, expect, it } from "vitest";
import {
  anchorDailyRate,
  anchorPriceText,
  anchorRentalPrice,
  formatAnchorDate,
  getAnchorPrice,
  sumAnchorPrices,
} from "@/lib/anchor-price";

const NBSP = / /g;
const stored = {
  anchor_price_per_day: 40,
  anchor_price_per_3days: 70,
  anchor_price_per_7days: 100,
  anchor_price_date: "2026-09-10",
};

describe("getAnchorPrice", () => {
  it("reads the stored anchor", () => {
    expect(getAnchorPrice(stored)).toEqual({
      date: "2026-09-10",
      tiers: { price_per_day: 40, price_per_3days: 70, price_per_7days: 100 },
    });
  });

  it("gives nothing when the anchor is not stored, so the live price is never shown as the anchor", () => {
    expect(getAnchorPrice({})).toBeNull();
    expect(getAnchorPrice({ ...stored, anchor_price_date: null })).toBeNull();
    expect(getAnchorPrice({ ...stored, anchor_price_per_7days: null })).toBeNull();
    // A product row from a database without the columns (the price fields are irrelevant).
    expect(getAnchorPrice({ price_per_day: 40, price_per_7days: 100 } as never)).toBeNull();
  });
});

describe("anchor amounts", () => {
  const anchor = getAnchorPrice(stored)!;

  it("uses the same block pricing as the live price", () => {
    expect(anchorDailyRate(anchor)).toBe(40);
    expect(anchorRentalPrice(anchor, 1)).toBe(40);
    expect(anchorRentalPrice(anchor, 3)).toBe(70);
    expect(anchorRentalPrice(anchor, 7)).toBe(100);
  });

  it("derives the daily figure the same way for products without a daily price", () => {
    const tent = getAnchorPrice({ anchor_price_per_3days: 25, anchor_price_per_7days: 45, anchor_price_date: "2026-09-10" })!;
    expect(anchorDailyRate(tent)).toBe(8);
    expect(anchorRentalPrice(tent, 3)).toBe(25);
  });

  it("does not move when the live price changes", () => {
    const product = { ...stored, price_per_day: 55, price_per_3days: 90, price_per_7days: 130 };
    expect(anchorDailyRate(getAnchorPrice(product)!)).toBe(40);
  });
});

describe("text", () => {
  it("formats the date as DD.MM.YYYY", () => {
    expect(formatAnchorDate("2026-09-10")).toBe("10.09.2026");
    expect(formatAnchorDate("2026-10-12T00:00:00+00:00")).toBe("12.10.2026");
  });

  it("builds the line shown under a price", () => {
    expect(anchorPriceText("2026-09-10", 30, "/dan").replace(NBSP, " ")).toBe("Cijena na 10.09.2026: 30 €/dan");
    expect(anchorPriceText("2026-09-10", 70).replace(NBSP, " ")).toBe("Cijena na 10.09.2026: 70 €");
    expect(anchorPriceText("2026-09-10", 30)).not.toMatch(/[—–]/);
  });
});

describe("sumAnchorPrices", () => {
  it("adds parts that share a date", () => {
    expect(sumAnchorPrices([{ date: "2026-09-10", amount: 100 }, { date: "2026-09-10", amount: 15 }]))
      .toEqual({ date: "2026-09-10", amount: 115 });
  });

  it("gives nothing when a part has no anchor or the dates differ", () => {
    expect(sumAnchorPrices([{ date: "2026-09-10", amount: 100 }, null])).toBeNull();
    expect(sumAnchorPrices([{ date: "2026-09-10", amount: 100 }, { date: "2026-10-12", amount: 15 }])).toBeNull();
    expect(sumAnchorPrices([])).toBeNull();
  });
});
