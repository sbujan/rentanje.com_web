import { describe, expect, it } from "vitest";
import { descriptionToHtml } from "@/lib/description-html";

describe("descriptionToHtml", () => {
  it("returns existing HTML untouched", () => {
    const html = "<p>Već HTML.</p>\n<ul><li>a</li></ul>";
    expect(descriptionToHtml(html)).toBe(html);
  });

  it("returns an empty string for empty input", () => {
    expect(descriptionToHtml(null)).toBe("");
    expect(descriptionToHtml("   ")).toBe("");
  });

  it("turns blank-line separated plain text into paragraphs", () => {
    expect(descriptionToHtml("Prvi odlomak.\n\nDrugi odlomak.")).toBe("<p>Prvi odlomak.</p>\n<p>Drugi odlomak.</p>");
  });

  it("turns markdown bullets and bold into a list and strong", () => {
    const md = "Kompletni paket!\n\n**Što dobivate:**\n- Šator za 4 osobe\n- 2 madraca\nIdealno za festivale.";
    expect(descriptionToHtml(md)).toBe(
      "<p>Kompletni paket!</p>\n<p><strong>Što dobivate:</strong></p>\n<ul><li>Šator za 4 osobe</li><li>2 madraca</li></ul>\n<p>Idealno za festivale.</p>"
    );
  });

  it("joins single line breaks inside a paragraph with <br>", () => {
    expect(descriptionToHtml("Red jedan\nRed dva")).toBe("<p>Red jedan<br>Red dva</p>");
  });

  it("escapes stray angle brackets in plain text", () => {
    expect(descriptionToHtml("Snaga > 2000 W & tiho")).toBe("<p>Snaga &gt; 2000 W &amp; tiho</p>");
  });

  it("normalises Windows line endings", () => {
    expect(descriptionToHtml("A\r\n\r\n- b\r\n- c")).toBe("<p>A</p>\n<ul><li>b</li><li>c</li></ul>");
  });
});
