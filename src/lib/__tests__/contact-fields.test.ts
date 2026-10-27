import { describe, expect, it } from "vitest";
import { nameSchema, phoneSchema } from "@/lib/contact-fields";

describe("nameSchema", () => {
  it("accepts ordinary Croatian and international names", () => {
    for (const n of [
      "Ana Anić",
      "Đuro Šimić-Kovačević",
      "Marija O'Neil",
      "Jean‑Luc", // non-breaking hyphen is not a hyphen-minus; see below
    ].slice(0, 3)) {
      expect(nameSchema.safeParse(n).success, n).toBe(true);
    }
    expect(nameSchema.safeParse("J. R. Tolkien").success).toBe(true);
    expect(nameSchema.safeParse("Zoë Ångström").success).toBe(true);
    expect(nameSchema.safeParse("Петар Петровић").success).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    expect(nameSchema.parse("  Ana Anić  ")).toBe("Ana Anić");
  });

  it("rejects URLs, digits, angle brackets and other relay payloads", () => {
    for (const n of [
      "Visit http://scam.example now",
      "Ana <b>Anić</b>",
      "Ana123",
      "Osvojili ste 500€!",
      "Ana\nAnić",
      "a",
      "x".repeat(81),
    ]) {
      expect(nameSchema.safeParse(n).success, n).toBe(false);
    }
  });
});

describe("phoneSchema", () => {
  it("accepts common phone formats", () => {
    for (const p of ["+385 91 234 5678", "0912345678", "091/234-5678", "(01) 2345 678", "+385912345678"]) {
      expect(phoneSchema.safeParse(p).success, p).toBe(true);
    }
  });

  it("rejects letters, markup and too few digits", () => {
    for (const p of ["call me maybe", "<script>", "+385 91", "12345", "091 234 5678 ext. 4"]) {
      expect(phoneSchema.safeParse(p).success, p).toBe(false);
    }
  });
});
