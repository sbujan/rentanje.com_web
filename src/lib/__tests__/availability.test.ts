import { describe, expect, it } from "vitest";
import { expandRentalDates, maxAvailableUnits } from "@/lib/availability";

describe("expandRentalDates", () => {
  it("expands an inclusive date range", () => {
    expect(expandRentalDates("2026-06-01", "2026-06-03")).toEqual([
      "2026-06-01",
      "2026-06-02",
      "2026-06-03",
    ]);
  });

  it("returns a single day when start equals end", () => {
    expect(expandRentalDates("2026-06-01", "2026-06-01")).toEqual(["2026-06-01"]);
  });

  it("returns empty for an inverted range", () => {
    expect(expandRentalDates("2026-06-03", "2026-06-01")).toEqual([]);
  });

  it("returns empty when either bound is null", () => {
    expect(expandRentalDates(null, "2026-06-03")).toEqual([]);
    expect(expandRentalDates("2026-06-01", null)).toEqual([]);
    expect(expandRentalDates(null, null)).toEqual([]);
  });
});

describe("maxAvailableUnits", () => {
  it("returns full stock when no dates are requested", () => {
    expect(maxAvailableUnits([{ date: "2026-06-01", qty_booked: 2 }], 3, [])).toBe(3);
  });

  it("returns the minimum free count across the requested dates", () => {
    const availability = [
      { date: "2026-06-01", qty_booked: 2 },
      { date: "2026-06-02", qty_booked: 1 },
    ];
    expect(
      maxAvailableUnits(availability, 3, ["2026-06-01", "2026-06-02", "2026-06-03"])
    ).toBe(1);
  });

  it("sums multiple bookings on the same date", () => {
    const availability = [
      { date: "2026-06-01", qty_booked: 1 },
      { date: "2026-06-01", qty_booked: 1 },
    ];
    expect(maxAvailableUnits(availability, 3, ["2026-06-01"])).toBe(1);
  });

  it("floors at zero when overbooked", () => {
    expect(
      maxAvailableUnits([{ date: "2026-06-01", qty_booked: 5 }], 3, ["2026-06-01"])
    ).toBe(0);
  });
});
