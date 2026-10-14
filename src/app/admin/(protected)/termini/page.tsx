import { createClient } from "@/lib/supabase/server";
import { parseCartItems } from "@/lib/cart";
import { toYmd } from "@/lib/utils";
import type { InquiryStatus } from "@/lib/inquiry-status";
import UpcomingRentals, { type RentalLine } from "./UpcomingRentals";

const HORIZONS = [7, 14, 30, 60] as const;
const DEFAULT_HORIZON = 30;
/** Finished rentals stay listed this many days so returns can be ticked off. */
const RETURN_GRACE_DAYS = 14;

function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return toYmd(new Date(y, m - 1, d + days));
}

export default async function TerminiPage({
  searchParams,
}: {
  searchParams?: { dani?: string };
}) {
  const requested = Number(searchParams?.dani);
  const horizon = (HORIZONS as readonly number[]).includes(requested)
    ? requested
    : DEFAULT_HORIZON;

  const today = toYmd(new Date());
  const windowStart = addDays(today, -RETURN_GRACE_DAYS);
  const windowEnd = addDays(today, horizon);

  const supabase = await createClient();

  // Everything that overlaps [today - grace, today + horizon] at inquiry
  // level, then narrowed per item below (items carry their own dates).
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select(
      "id, inquiry_number, status, customer_name, customer_phone, delivery_type, delivery_address, rental_start, rental_end, items"
    )
    .neq("status", "cancelled")
    .gte("rental_end", windowStart)
    .lte("rental_start", windowEnd)
    .order("rental_start", { ascending: true });

  if (error) {
    console.error("Termini query failed:", error);
    throw new Error("Failed to load upcoming rentals");
  }

  const lines: RentalLine[] = [];
  for (const inq of inquiries ?? []) {
    for (const item of parseCartItems(inq.items)) {
      if (item.rentalEnd < windowStart || item.rentalStart > windowEnd) continue;
      lines.push({
        key: `${inq.id}:${item.productId}:${item.rentalStart}`,
        inquiryId: inq.id,
        inquiryNumber: inq.inquiry_number,
        status: inq.status as InquiryStatus,
        customerName: inq.customer_name,
        customerPhone: inq.customer_phone,
        deliveryType: inq.delivery_type === "delivery" ? "delivery" : "pickup",
        deliveryAddress: inq.delivery_address,
        productName: item.productName,
        productSlug: item.slug,
        qty: item.qty,
        rentalStart: item.rentalStart,
        rentalEnd: item.rentalEnd,
        days: item.days,
      });
    }
  }

  lines.sort(
    (a, b) =>
      a.rentalStart.localeCompare(b.rentalStart) ||
      a.rentalEnd.localeCompare(b.rentalEnd) ||
      a.productName.localeCompare(b.productName, "hr")
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-text">Termini najma</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Što je vani, što se vraća i što kreće u najam. Kvačica &quot;Vraćeno&quot; pamti se
          samo u ovom pregledniku, ne u bazi.
        </p>
      </div>

      <UpcomingRentals
        lines={lines}
        today={today}
        horizon={horizon}
        horizons={[...HORIZONS]}
        graceDays={RETURN_GRACE_DAYS}
      />
    </div>
  );
}
