import { describe, expect, it } from "vitest";
import { contrastRatio, mixWithWhite, readableTextColor, safeHexColor } from "@/lib/color";

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

describe("mixWithWhite", () => {
  it("fades a colour towards white", () => {
    expect(mixWithWhite("#000000", 1)).toBe("#000000");
    expect(mixWithWhite("#000000", 0)).toBe("#FFFFFF");
    expect(mixWithWhite("#FF0000", 0.5)).toBe("#FF8080");
    expect(mixWithWhite("tomato", 0.5)).toBe("tomato");
  });

  it("gives soft category strips that dark text reads well on", () => {
    for (const c of CATEGORY_COLORS) {
      const soft = mixWithWhite(c, 0.3);
      expect(readableTextColor(soft), c).toBe("#1A1A2E");
      expect(contrastRatio(soft, "#1A1A2E"), c).toBeGreaterThanOrEqual(7);
    }
  });
});

describe("safeHexColor", () => {
  it("passes hex colours and replaces anything else", () => {
    expect(safeHexColor("#5B8DEF", "#000000")).toBe("#5B8DEF");
    expect(safeHexColor(" #fd6 ", "#000000")).toBe("#fd6");
    expect(safeHexColor(null, "#000000")).toBe("#000000");
    expect(safeHexColor("red; background-image: url(https://example.test/x)", "#000000")).toBe("#000000");
  });
});
