import { describe, expect, it } from "vitest";
import { contrastRatio, readableTextColor } from "@/lib/color";

// The category colours in the database on 2026-11-18.
const CATEGORY_COLORS = ["#5B8DEF", "#01D2D6", "#F59E0B", "#EC4899", "#FF6B6B", "#FF8E6C", "#6EE7B7", "#FFD166", "#BCA7F0"];

describe("readableTextColor", () => {
  it("picks white on dark and dark on light backgrounds", () => {
    expect(readableTextColor("#000000")).toBe("#FFFFFF");
    expect(readableTextColor("#1A1A2E")).toBe("#FFFFFF");
    expect(readableTextColor("#FFFFFF")).toBe("#1A1A2E");
    expect(readableTextColor("#fd6")).toBe("#1A1A2E");
  });

  it("keeps text readable (WCAG AA, 4.5:1) on every category colour", () => {
    for (const c of CATEGORY_COLORS) {
      expect(contrastRatio(c, readableTextColor(c)), c).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("does not crash on something that is not a hex colour", () => {
    expect(contrastRatio("tomato", "#FFFFFF")).toBe(1);
    expect(readableTextColor("tomato")).toBe("#1A1A2E");
  });
});
