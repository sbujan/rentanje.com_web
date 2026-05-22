import type { CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function buildAdminInquiryHtml(params: {
  name: string;
  email: string;
  phone: string;
  delivery_address?: string;
  note?: string;
  items: CartItem[];
  subtotal: number;
  totalDeposit: number;
  deliveryFee: number;
  inquiryId: string;
  inquiryNumber: string;
}): string {
  const {
    name,
    email,
    phone,
    delivery_address,
    note,
    items,
    subtotal,
    totalDeposit,
    deliveryFee,
    inquiryId,
    inquiryNumber,
  } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rentanje.com";

  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 12px;color:#111827;font-weight:500">${esc(item.productName)}<br/><span style="color:#6b7280;font-size:12px;font-weight:400">${item.days} dana · kom: ${item.qty}</span></td>
      <td style="padding:10px 12px;color:#374151;font-size:13px">${formatDate(item.rentalStart)} – ${formatDate(item.rentalEnd)}</td>
      <td style="padding:10px 12px;text-align:right;color:#111827;font-weight:500">${formatPrice(item.totalPrice)}</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html><html lang="hr"><body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:32px 0">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
  <div style="background:#F05554;padding:24px 32px">
    <p style="margin:0;color:white;font-size:22px;font-weight:700">rentanje.com — Novi upit</p>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">${esc(inquiryNumber)}</p>
  </div>
  <div style="padding:32px">
    <h2 style="margin:0 0 16px;font-size:16px;color:#111827">Podaci o korisniku</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:8px 0;color:#6b7280;width:140px">Ime</td><td style="padding:8px 0;color:#111827;font-weight:500">${esc(name)}</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:8px 0;color:#6b7280">E-mail</td><td style="padding:8px 0;color:#111827;font-weight:500"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:8px 0;color:#6b7280">Telefon</td><td style="padding:8px 0;color:#111827;font-weight:500"><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
      ${delivery_address ? `<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:8px 0;color:#6b7280">Adresa dostave</td><td style="padding:8px 0;color:#111827;font-weight:500">${esc(delivery_address)}</td></tr>` : ""}
      ${note ? `<tr><td style="padding:8px 0;color:#6b7280">Napomena</td><td style="padding:8px 0;color:#111827;font-weight:500">${esc(note)}</td></tr>` : ""}
    </table>
    <h2 style="margin:32px 0 16px;font-size:16px;color:#111827">Stavke upita</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead><tr style="background:#f9fafb">
        <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:500">Proizvod</th>
        <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:500">Datum</th>
        <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:500">Cijena</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="border-top:2px solid #e5e7eb"><td colspan="2" style="padding:10px 12px;font-weight:600;color:#111827">Ukupno iznajmljivanje</td><td style="padding:10px 12px;text-align:right;font-weight:700;color:#111827">${formatPrice(subtotal)}</td></tr>
        ${totalDeposit > 0 ? `<tr><td colspan="2" style="padding:4px 12px;color:#d97706">Depozit (povratni)</td><td style="padding:4px 12px;text-align:right;color:#d97706;font-weight:600">${formatPrice(totalDeposit)}</td></tr>` : ""}
        ${deliveryFee > 0 ? `<tr><td colspan="2" style="padding:4px 12px;color:#2563eb;font-weight:600">Dostava</td><td style="padding:4px 12px;text-align:right;color:#2563eb;font-weight:600">${formatPrice(deliveryFee)}</td></tr>` : ""}
      </tfoot>
    </table>
    <div style="margin-top:32px;text-align:center">
      <a href="${siteUrl}/admin/upiti/${encodeURIComponent(inquiryId)}" style="display:inline-block;background:#F05554;color:white;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;font-size:14px">Otvori upit u adminu</a>
    </div>
  </div>
  <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center">rentanje.com — Automatska obavijest</div>
</div></body></html>`;
}

export function buildCustomerConfirmationHtml(params: {
  name: string;
  items: CartItem[];
  subtotal: number;
  totalDeposit: number;
}): string {
  const { name, items, subtotal, totalDeposit } = params;

  const rows = items
    .map(
      (item) => `
    <tr style="border-top:1px solid #f3f4f6">
      <td style="padding:10px 12px;color:#111827;font-weight:500">${esc(item.productName)}${item.qty > 1 ? ` <span style="color:#6b7280;font-weight:400">· ${item.qty} kom</span>` : ""}</td>
      <td style="padding:10px 12px;color:#374151;font-size:13px">${formatDate(item.rentalStart)} – ${formatDate(item.rentalEnd)}</td>
      <td style="padding:10px 12px;text-align:right;color:#111827">${formatPrice(item.totalPrice)}</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html><html lang="hr"><body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:32px 0">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
  <div style="background:#F05554;padding:24px 32px">
    <p style="margin:0;color:white;font-size:22px;font-weight:700">rentanje.com</p>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">Vaš upit je zaprimljen!</p>
  </div>
  <div style="padding:32px">
    <p style="margin:0 0 16px;font-size:16px;color:#111827">Pozdrav, <strong>${esc(name)}</strong>!</p>
    <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.6">Vaš upit je uspješno zaprimljen. Kontaktirat ćemo vas u roku od <strong>1–2 sata</strong> s potvrdom dostupnosti i detaljima.</p>
    <h2 style="margin:0 0 16px;font-size:16px;color:#111827">Sažetak upita</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead><tr style="background:#f9fafb">
        <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:500">Oprema</th>
        <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:500">Datum</th>
        <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:500">Cijena</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="border-top:2px solid #e5e7eb"><td colspan="2" style="padding:10px 12px;font-weight:600;color:#111827">Ukupno</td><td style="padding:10px 12px;text-align:right;font-weight:700;color:#111827">${formatPrice(subtotal)}</td></tr>
        ${totalDeposit > 0 ? `<tr><td colspan="2" style="padding:4px 12px 10px;color:#d97706;font-size:13px">Depozit (povratni)</td><td style="padding:4px 12px 10px;text-align:right;color:#d97706">${formatPrice(totalDeposit)}</td></tr>` : ""}
      </tfoot>
    </table>
    <div style="margin-top:32px;background:#fef2f2;border-radius:8px;padding:16px 20px">
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6"><strong>Hitno?</strong> Nazovite nas direktno:</p>
      <a href="tel:+385952044414" style="font-size:20px;font-weight:700;color:#F05554;text-decoration:none">+385 95 204 4414</a>
    </div>
  </div>
  <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center">
    rentanje.com — List 360 d.o.o. · Zagreb, Hrvatska<br/>Automatska poruka — molimo ne odgovarajte.
  </div>
</div></body></html>`;
}
