/**
 * Product descriptions are rendered as HTML (through sanitizeHtml), but many
 * older rows were written as plain text or markdown. Rendered raw, those
 * collapse into one paragraph with literal "**" and "- " markers. This turns
 * them into minimal HTML so every description gets real paragraphs, bullet
 * lists and bold text, without rewriting the rows.
 *
 * Rows that already contain block-level HTML are returned untouched.
 * The output still goes through sanitizeHtml at render time.
 */

const BLOCK_HTML = /<(p|h[1-6]|ul|ol|li|table|div|br)\b/i;
const BULLET = /^\s*(?:[-•*])\s+/;

function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return escapeText(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function descriptionToHtml(raw: string | null | undefined): string {
  const text = (raw ?? "").replace(/\r\n?/g, "\n").trim();
  if (!text) return "";
  if (BLOCK_HTML.test(text)) return text;

  const out: string[] = [];
  for (const block of text.split(/\n\s*\n/)) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    let para: string[] = [];
    let list: string[] = [];
    const flushPara = () => {
      if (para.length) out.push(`<p>${para.map(inline).join("<br>")}</p>`);
      para = [];
    };
    const flushList = () => {
      if (list.length) out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`);
      list = [];
    };
    for (const line of lines) {
      if (BULLET.test(line)) {
        flushPara();
        list.push(line.replace(BULLET, ""));
      } else {
        flushList();
        para.push(line);
      }
    }
    flushPara();
    flushList();
  }
  return out.join("\n");
}
