import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { Mail, Phone } from "lucide-react";
import { parseCartItems } from "@/lib/cart";
import { INQUIRY_STATUS_META } from "@/lib/inquiry-status";
import { formatPrice } from "@/lib/utils";
import DeleteInquiryButton from "./DeleteInquiryButton";

function formatNullablePrice(n: number | null) {
  if (n === null) return "–";
  return formatPrice(n, 2);
}

/** Short date for a "YYYY-MM-DD" string (parsed as local day, no UTC shift). */
function formatDayShort(value: string | null) {
  if (!value) return null;
  return format(parseISO(value), "d. MMM yyyy", { locale: hr });
}

function formatRange(start: string | null, end: string | null) {
  const s = formatDayShort(start);
  const e = formatDayShort(end);
  if (!s && !e) return "–";
  if (s && e) return s === e ? s : `${s} – ${e}`;
  return s ?? e ?? "–";
}

/** Compact "Naziv ×2 · Drugi naziv" summary from the items JSONB. */
function itemsSummary(raw: unknown): string {
  const items = parseCartItems(raw);
  if (items.length === 0) return "–";
  return items
    .map((i) => `${i.productName}${i.qty > 1 ? ` ×${i.qty}` : ""}`)
    .join(" · ");
}

export default async function UpitiPage() {
  const supabase = await createClient();

  const { data: inquiries, error: inquiriesErr } = await supabase
    .from("inquiries")
    .select("id, inquiry_number, status, customer_name, customer_email, customer_phone, subtotal_estimate, created_at, rental_start, rental_end, items")
    .order("created_at", { ascending: false });

  // Admin must never see a misleading "Nema upita." when the DB is actually down.
  if (inquiriesErr) {
    console.error("Inquiries query failed:", inquiriesErr);
    throw new Error("Failed to load inquiries");
  }

  const newCount = inquiries?.filter((i) => i.status === "new").length ?? 0;

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Upiti</h1>
          {newCount > 0 && (
            <p className="text-sm text-brand-primary mt-0.5 font-medium">
              {newCount} novih upita
            </p>
          )}
        </div>
      </div>

      {!inquiries || inquiries.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center text-gray-400">
          Nema upita.
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Broj</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Kupac</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Termin</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Stavke</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Kontakt</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell text-right">Iznos</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Datum</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inquiries.map((inquiry) => {
                  const statusInfo = INQUIRY_STATUS_META[inquiry.status] ?? INQUIRY_STATUS_META.new;
                  return (
                    <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">
                        {inquiry.inquiry_number}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {inquiry.customer_name}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600 text-xs whitespace-nowrap">
                        {formatRange(inquiry.rental_start, inquiry.rental_end)}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-600 text-xs max-w-[16rem]">
                        <span className="line-clamp-2">{itemsSummary(inquiry.items)}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <a href={`mailto:${inquiry.customer_email}`} className="flex items-center gap-1 text-gray-500 hover:text-brand-primary text-xs">
                            <Mail className="h-3 w-3" />
                            {inquiry.customer_email}
                          </a>
                          {inquiry.customer_phone && (
                            <a href={`tel:${inquiry.customer_phone}`} className="flex items-center gap-1 text-gray-500 hover:text-brand-primary text-xs">
                              <Phone className="h-3 w-3" />
                              {inquiry.customer_phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-right font-medium text-gray-900">
                        {formatNullablePrice(inquiry.subtotal_estimate)}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">
                        {format(new Date(inquiry.created_at), "d. MMM yyyy · HH:mm", { locale: hr })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/upiti/${inquiry.id}`}
                            className="text-brand-primary text-xs font-medium hover:underline"
                          >
                            Otvori
                          </Link>
                          <DeleteInquiryButton
                            inquiryId={inquiry.id}
                            inquiryNumber={inquiry.inquiry_number}
                            iconOnly
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
