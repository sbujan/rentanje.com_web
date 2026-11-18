"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker, DateRange, Matcher } from "react-day-picker";
import { differenceInCalendarDays, eachDayOfInterval, format, startOfDay } from "date-fns";
import { hr } from "date-fns/locale";
import { ShoppingCart, Phone } from "lucide-react";
import "react-day-picker/dist/style.css";
import { useCartStore, type CartItem } from "@/lib/cart";
import { calcRentalPrice, applyBundleDiscount } from "@/lib/pricing";
import { anchorRentalPrice, getAnchorPrice, sumAnchorPrices, type AnchorPriceFields } from "@/lib/anchor-price";
import AnchorPriceNote from "@/components/public/AnchorPriceNote";
import type { AvailabilityRecord } from "@/lib/availability";
import { SITE_PHONE, SITE_PHONE_HREF } from "@/lib/site";
import { toYmd } from "@/lib/utils";
import { gtagEvent, trackBundleViewed, trackPhoneClick } from "@/lib/gtag";

interface BundleProduct extends AnchorPriceFields {
  id: string;
  name: string;
  slug: string;
  hero_image_url: string | null;
  price_per_day: number | null;
  price_per_3days: number | null;
  price_per_7days: number;
  min_rental_days: 1 | 3 | 7;
  requires_deposit: boolean;
  deposit_amount: number | null;
  delivery_available: boolean;
  delivery_fee: number;
  stock_qty: number;
  qty: number;
}

/** Bundle calendars need per-product rows, so extend the shared record. */
interface ProductAvailabilityRecord extends AvailabilityRecord {
  product_id: string;
}

interface Bundle {
  id: string;
  name: string;
  slug: string;
  hero_image_url: string | null;
  discount_type: "percent" | "fixed" | null;
  discount_value: number | null;
}

interface Props {
  bundle: Bundle;
  products: BundleProduct[];
  availability: ProductAvailabilityRecord[];
}

export default function BundleAddToCart({ bundle, products, availability }: Props) {
  const router = useRouter();
  const addBundle = useCartStore((s) => s.addBundle);

  const [range, setRange] = useState<DateRange | undefined>();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackBundleViewed(bundle.id, bundle.name);
  }, [bundle.id, bundle.name]);

  // startOfDay so today's own bookings can still block today (calendar days
  // are midnight-local; a timestamped "now" would never match them).
  const today = startOfDay(new Date());

  // booked units per (product, day)
  const bookedByProductDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of availability) {
      const key = `${a.product_id}|${a.date}`;
      map.set(key, (map.get(key) ?? 0) + a.qty_booked);
    }
    return map;
  }, [availability]);

  // A day is unavailable when ANY component product lacks enough free units
  // for the bundle's required quantity of it.
  function isUnavailable(date: Date) {
    if (date < today) return false;
    const key = format(date, "yyyy-MM-dd");
    return products.some((p) => {
      const booked = bookedByProductDate.get(`${p.id}|${key}`) ?? 0;
      return p.stock_qty - booked < p.qty;
    });
  }

  function handleSelect(r: DateRange | undefined) {
    if (r?.from && r?.to) {
      const blocked = eachDayOfInterval({ start: r.from, end: r.to }).find(isUnavailable);
      if (blocked) {
        setError(
          `Odabrani period uključuje nedostupan datum (${format(blocked, "d. MMM yyyy", { locale: hr })}). Molimo odaberite drugi raspon.`
        );
        setRange(undefined);
        return;
      }
    }
    setError(null);
    setRange(r);
  }

  const disabledDays: Matcher[] = [{ before: today }, isUnavailable];

  const days =
    range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) + 1 : 0;

  const minRentalDays = products.reduce(
    (max, p) => Math.max(max, p.min_rental_days),
    1
  );

  const subtotal = products.reduce(
    (sum, p) => sum + calcRentalPrice(days, p).price * p.qty,
    0
  );
  const { discount, total } = applyBundleDiscount(
    subtotal,
    bundle.discount_type,
    bundle.discount_value
  );

  // Anchor price of the same rental, per product line and for the bundle.
  const anchorLine = (p: BundleProduct) => {
    const anchor = getAnchorPrice(p);
    return anchor && days > 0 ? { date: anchor.date, amount: anchorRentalPrice(anchor, days) * p.qty } : null;
  };
  const anchorSubtotal = sumAnchorPrices(products.map(anchorLine));
  const anchorTotal = anchorSubtotal
    ? applyBundleDiscount(anchorSubtotal.amount, bundle.discount_type, bundle.discount_value).total
    : null;

  const canAdd = !!range?.from && !!range?.to && days >= minRentalDays && products.length > 0;

  function handleAdd() {
    if (!canAdd || !range?.from || !range?.to) return;

    const startIso = toYmd(range.from);
    const endIso = toYmd(range.to);

    const items: CartItem[] = products.map((p) => {
      const { price } = calcRentalPrice(days, p);
      const lineAnchor = anchorLine(p);
      return {
        productId: p.id,
        productName: p.name,
        heroImage: p.hero_image_url ?? "",
        slug: p.slug,
        rentalStart: startIso,
        rentalEnd: endIso,
        days,
        minRentalDays: p.min_rental_days,
        priceTierLabel: `${days} dana`,
        priceForTier: price,
        totalPrice: price * p.qty,
        depositAmount: p.requires_deposit ? (p.deposit_amount ?? 0) * p.qty : 0,
        qty: p.qty,
        bundleId: bundle.id,
        bundleName: bundle.name,
        bundleDiscountAmount: 0,
        deliveryAvailable: p.delivery_available,
        deliveryFee: p.delivery_fee,
        ...(lineAnchor ? { anchorPrice: lineAnchor.amount, anchorDate: lineAnchor.date } : {}),
      };
    });

    // Stamp the bundle discount on the FIRST item only so the cart sums it once.
    if (items.length > 0) {
      items[0] = { ...items[0], bundleDiscountAmount: discount };
    }

    addBundle(items);

    gtagEvent("add_to_cart", {
      currency: "EUR",
      value: total,
      items: items.map((i) => ({
        item_id: i.productId,
        item_name: i.productName,
        price: i.totalPrice,
      })),
    });

    setAdded(true);
    setTimeout(() => router.push("/upit"), 600);
  }

  const rangeLabel =
    range?.from && range?.to
      ? `${format(range.from, "d. MMM", { locale: hr })} - ${format(range.to, "d. MMM yyyy", { locale: hr })}`
      : "";
  const startOnly = Boolean(range?.from && !range?.to);
  const tooShort = days > 0 && days < minRentalDays;

  // Same layout rule as the product booking card (AddToCartCard): on desktop
  // the card is sticky and capped at the viewport height, the calendar
  // scrolls inside it and the footer with the total and the button is pinned,
  // so the button never ends up below the fold on a laptop.
  return (
    <div className="booking-card bg-white rounded-xl shadow-card border border-gray-100 flex flex-col">
      <div className="p-4 sm:p-5 lg:p-4 space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <p className="text-sm font-semibold text-brand-text">Odaberite datume najma</p>
        <div className="rounded-md border border-gray-100 overflow-hidden">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={disabledDays}
            modifiers={{ unavailable: isUnavailable }}
            modifiersStyles={{
              unavailable: {
                backgroundColor: "#fee2e2",
                color: "#ef4444",
                textDecoration: "line-through",
                opacity: 1,
              },
            }}
            locale={hr}
            numberOfMonths={1}
            className="booking-calendar !m-0 p-3"
          />
        </div>
        <a
          href={SITE_PHONE_HREF}
          onClick={trackPhoneClick}
          className="inline-flex items-center gap-2 text-sm text-brand-primary font-bold hover:text-brand-dark transition-colors"
        >
          <Phone className="h-4 w-4" />
          {SITE_PHONE}
        </a>
      </div>

      <div className="border-t border-gray-100 p-4 sm:px-5 lg:px-4 space-y-2.5 rounded-b-xl bg-white">
        <div role="status" aria-live="polite">
          {error ? (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
          ) : startOnly && range?.from ? (
            <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              Početak: <strong>{format(range.from, "d. MMM yyyy", { locale: hr })}</strong>. Kliknite još datum kraja
              najma.
            </p>
          ) : tooShort ? (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              Minimalni period je {minRentalDays} dana. Odabrali ste {days}. Odaberite dulji raspon.
            </p>
          ) : days > 0 ? (
            <div className="text-sm space-y-1">
              <div className="flex justify-between gap-3">
                <span className="text-brand-muted">
                  {rangeLabel} ({days} {days === 1 ? "dan" : "dana"})
                </span>
                <span className="font-semibold text-brand-text">{subtotal.toFixed(0)} €</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Paket popust</span>
                  <span className="font-semibold">- {discount.toFixed(0)} €</span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-gray-200/60">
                <span className="font-bold text-brand-text">Ukupno</span>
                <span className="font-price font-bold text-brand-primary text-lg">{total.toFixed(0)} €</span>
              </div>
              <AnchorPriceNote date={anchorSubtotal?.date} amount={anchorTotal} className="text-right" />
            </div>
          ) : (
            <p className="text-xs text-brand-muted">
              Kliknite datum početka, a zatim datum kraja najma.
              {minRentalDays > 1 && (
                <>
                  {" "}
                  Minimalni period je <strong>{minRentalDays} dana</strong>.
                </>
              )}
            </p>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!canAdd || added}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors active:scale-95"
        >
          <ShoppingCart className="h-5 w-5" />
          {added ? "Dodano! ✓" : "Dodaj paket u košaricu"}
        </button>
      </div>
    </div>
  );
}
