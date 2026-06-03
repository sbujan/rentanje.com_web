import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import StatusSelect from "./StatusSelect";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  new: { label: "Novi", className: "bg-red-100 text-red-700" },
  read: { label: "Pročitan", className: "bg-blue-100 text-blue-700" },
  replied: { label: "Odgovoreno", className: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Potvrđen", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Otkazan", className: "bg-gray-100 text-gray-500" },
};

function formatPrice(n: number | null) {
  if (n === null) return "–";
  return n.toLocaleString("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

function formatDate(value: string) {
  // Date-only strings ("YYYY-MM-DD") parse as UTC midnight, which can roll back
  // a day in negative-UTC timezones — anchor them at local noon. Legacy ISO
  // datetime values (older records) pass through unchanged.
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value;
  return new Date(iso).toLocaleDateString("hr-HR", { day: "numeric", month: "short", year: "numeric" });
}

interface Props {
  params: { id: string };
}

export default async function InquiryDetailPage({ params }: Props) {
  const supabase = await createClient();

  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!inquiry) notFound();

  // Mark as read if still "new"
  if (inquiry.status === "new") {
    const admin = createAdminClient();
    await admin.from("inquiries").update({ status: "read" }).eq("id", inquiry.id);
  }

  const items = Array.isArray(inquiry.items) ? inquiry.items as any[] : [];
  const statusInfo = STATUS_LABELS[inquiry.status] ?? STATUS_LABELS.new;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/upiti" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{inquiry.inquiry_number}</h1>
          <p className="text-sm text-gray-400">
            {format(new Date(inquiry.created_at), "d. MMMM yyyy u HH:mm", { locale: hr })}
          </p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Podaci o korisniku</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Ime i prezime</p>
                <p className="font-semibold text-gray-900">{inquiry.customer_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${inquiry.customer_email}`} className="text-brand-primary hover:underline text-sm">
                  {inquiry.customer_email}
                </a>
              </div>
              {inquiry.customer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${inquiry.customer_phone}`} className="text-brand-primary hover:underline text-sm">
                    {inquiry.customer_phone}
                  </a>
                </div>
              )}
              {inquiry.delivery_address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{inquiry.delivery_address}</span>
                </div>
              )}
            </div>

            {inquiry.message && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Napomena</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Stavke upita</h2>
            {items.length === 0 ? (
              <p className="text-sm text-gray-400">Nema stavki.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-2 font-medium text-gray-400">Proizvod</th>
                    <th className="pb-2 font-medium text-gray-400">Datum</th>
                    <th className="pb-2 font-medium text-gray-400 text-right">Cijena</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="py-3 font-medium text-gray-900">
                        {item.productName}
                        <div className="text-xs text-gray-400 font-normal">{item.days} dana · kom: {item.qty}</div>
                      </td>
                      <td className="py-3 text-gray-500 text-xs">
                        {formatDate(item.rentalStart)} –<br/>{formatDate(item.rentalEnd)}
                      </td>
                      <td className="py-3 font-medium text-gray-900 text-right">
                        {formatPrice(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-100">
                    <td colSpan={2} className="pt-3 font-bold text-gray-900">Ukupno</td>
                    <td className="pt-3 font-bold text-gray-900 text-right">
                      {formatPrice(inquiry.subtotal_estimate)}
                    </td>
                  </tr>
                  {inquiry.total_estimate && inquiry.total_estimate !== inquiry.subtotal_estimate && (
                    <tr>
                      <td colSpan={2} className="py-1 text-amber-600 text-sm">+ Depozit</td>
                      <td className="py-1 text-amber-600 text-sm text-right">
                        {formatPrice((inquiry.total_estimate ?? 0) - (inquiry.subtotal_estimate ?? 0))}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Status upita</h3>
            <StatusSelect inquiryId={inquiry.id} currentStatus={inquiry.status} />
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-2">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Brzi odgovor</h3>
            <a
              href={`mailto:${inquiry.customer_email}?subject=Re: Vaš upit ${inquiry.inquiry_number} — rentanje.com`}
              className="flex items-center gap-2 w-full justify-center bg-brand-primary text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Mail className="h-4 w-4" />
              Pošalji e-mail
            </a>
            {inquiry.customer_phone && (
              <a
                href={`tel:${inquiry.customer_phone}`}
                className="flex items-center gap-2 w-full justify-center border border-gray-200 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Nazovi
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
