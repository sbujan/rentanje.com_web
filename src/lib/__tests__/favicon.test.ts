import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const file = (name: string) => readFileSync(join(process.cwd(), "public", name));

/** PNG width and height live at fixed offsets in the IHDR chunk. */
const pngSize = (buf: Buffer) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];

describe("site icons", () => {
  // Google Search requires a 1:1 favicon. The old SVG was 140.6 x 135.34, and
  // search results showed a generic globe.
  it("keeps the SVG square", () => {
    const viewBox = file("favicon.svg").toString().match(/viewBox="([^"]+)"/)?.[1];
    expect(viewBox).toBeDefined();
    const [, , w, h] = viewBox!.split(/\s+/).map(Number);
    expect(w).toBeGreaterThan(0);
    expect(w).toBe(h);
  });

  it("ships a real .ico with 16, 32 and 48 px icons", () => {
    const ico = file("favicon.ico");
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);
    const count = ico.readUInt16LE(4);
    const sizes = Array.from({ length: count }, (_, i) => ico[6 + i * 16]);
    expect(sizes).toEqual([16, 32, 48]);
  });

  it("ships square PNGs at the declared sizes", () => {
    expect(pngSize(file("icon-192.png"))).toEqual([192, 192]);
    expect(pngSize(file("apple-touch-icon.png"))).toEqual([180, 180]);
  });
});
