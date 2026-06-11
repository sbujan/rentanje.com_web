import { describe, expect, it } from "vitest";
import { formatDate, formatPrice, slugify, toYmd } from "@/lib/utils";

/** Intl inserts non-breaking spaces; normalize them for stable assertions. */
const plain = (s: string) => s.replace(/[\u00a0\u202f]/g, " ");

describe("toYmd", () => {
  it("formats the LOCAL calendar day with zero padding", () => {
    expect(toYmd(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(toYmd(new Date(2026, 11, 31))).toBe("2026-12-31");
  });

  it("does not shift the day for late-evening local times", () => {
    expect(toYmd(new Date(2026, 5, 10, 23, 30))).toBe("2026-06-10");
  });
});

describe("slugify", () => {
  it("strips Croatian diacritics", () => {
    expect(slugify("Čaša žuta đip Šešir")).toBe("casa-zuta-dip-sesir");
  });

  it("collapses whitespace and dashes", () => {
    expect(slugify("  Roštilj   na   plin  ")).toBe("rostilj-na-plin");
    expect(slugify("a -- b")).toBe("a-b");
  });

  it("drops other special characters", () => {
    expect(slugify("Zvučnik (JBL) 100%!")).toBe("zvucnik-jbl-100");
  });
});

describe("formatPrice", () => {
  it("renders whole euros without decimals by default", () => {
    expect(plain(formatPrice(10))).toBe("10 €");
  });

  it("renders fractional amounts with up to two decimals by default", () => {
    expect(plain(formatPrice(10.5))).toBe("10,5 €");
  });

  it("forces fixed decimals when fractionDigits is given", () => {
    expect(plain(formatPrice(10, 2))).toBe("10,00 €");
    expect(plain(formatPrice(10.4, 0))).toBe("10 €");
  });
});

describe("formatDate", () => {
  it("renders a date-only string without UTC day rollback", () => {
    expect(formatDate("2026-06-05")).toBe("5. lip 2026.");
  });

  it("passes ISO datetime strings through unchanged", () => {
    expect(formatDate("2026-06-05T20:00:00")).toBe("5. lip 2026.");
  });
});
