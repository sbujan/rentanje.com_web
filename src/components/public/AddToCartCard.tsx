"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { Phone, ShoppingCart, Info, Minus, Plus, CalendarDays } from "lucide-react";
import { useCartStore } from "@/lib/cart";
import { calcRentalPrice, effectiveDailyRate } from "@/lib/pricing";
import {
  anchorDailyRate,
  anchorRentalPrice,
  anchorTiersText,
  getAnchorPrice,
  type AnchorPriceFields,
} from "@/lib/anchor-price";
import { formatPrice, toYmd } from "@/lib/utils";
import { expandRentalDates, maxAvailableUnits, type AvailabilityRecord } from "@/lib/availability";
import { trackAddToCart, trackAvailabilityChecked, trackPhoneClick } from "@/lib/gtag";
import { SITE_PHONE as PHONE, SITE_PHONE_HREF as PHONE_HREF } from "@/lib/site";
import AvailabilityCalendar from "./AvailabilityCalendar";
import AnchorPriceNote from "./AnchorPriceNote";

interface Props {
  product: AnchorPriceFields & {
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
    deposit_note: string | null;
    delivery_available: boolean;
    delivery_fee: number;
    stock_qty: number;
    category?: string;
  };
  availability: AvailabilityRecord[];
}

const TIER_GRID: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" };

function daysLabel(n: number): string {
  return `${n} ${n === 1 ? "dan" : "dana"}`;
}

/**
 * Booking card of a product page.
 *
 * Layout rule: whatever the visitor needs to finish a booking (what is picked,
 * what it costs, the button) stays on screen. On desktop the card is sticky
 * and capped at the viewport height: the body (prices, calendar, notes)
 * scrolls inside it and the footer is pinned. Without that cap a 13" laptop
 * showed the calendar but not the button, which only came into view after
 * scrolling past the whole description. On a phone the card sits in the page
 * and a fixed bottom bar carries the same state and the same button.
 */
export default function AddToCartCard({ product, availability }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const [rentalStart, setRentalStart] = useState<Date | null>(null);
  const [rentalEnd, setRentalEnd] = useState<Date | null>(null);
  const [days, setDays] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const tiers = [
    { label: "1 dan", tierDays: 1, price: product.price_per_day, show: product.min_rental_days <= 1 },
    { label: "3 dana", tierDays: 3, price: product.price_per_3days, show: product.min_rental_days <= 3 },
    { label: "7 dana", tierDays: 7, price: product.price_per_7days, show: true },
  ].filter((t) => t.show && t.price !== null) as { label: string; tierDays: number; price: number; show: boolean }[];

  function savingsLabel(tierDays: number, tierPrice: number) {
    if (!product.price_per_day) return null;
    const saving = product.price_per_day * tierDays - tierPrice;
    return saving > 0 ? `Uštedite ${saving.toFixed(0)} €` : null;
  }

  // Block-based pricing: stack 7-day, 3-day, 1-day blocks, auto-upgrade if cheaper
  const { price: unitPrice, upgraded } = calcRentalPrice(days, product);

  // Anchor price ("Cijena na 10.09.2026"): the stored price on the reference
  // date, run through the same block pricing. Null when none is stored.
  const anchor = getAnchorPrice(product);
  const anchorTiers = anchor
    ? tiers.flatMap((t) => {
        const amount =
          t.tierDays === 1
            ? anchor.tiers.price_per_day
            : t.tierDays === 3
              ? anchor.tiers.price_per_3days
              : anchor.tiers.price_per_7days;
        return amount == null ? [] : [{ label: t.label, amount }];
      })
    : [];

  // Max units bookable for the selected range: the smallest free count across
  // every day in the range (calendar already blocks fully-booked days, so this
  // is >= 1 once a valid range is picked). Falls back to total stock otherwise.
  const maxQty = useMemo(() => {
    if (!rentalStart || !rentalEnd) return product.stock_qty;
    const dates = expandRentalDates(toYmd(rentalStart), toYmd(rentalEnd));
    return Math.max(1, maxAvailableUnits(availability, product.stock_qty, dates));
  }, [rentalStart, rentalEnd, availability, product.stock_qty]);

  const qtyClamped = Math.min(qty, maxQty);
  const unitDeposit = product.requires_deposit ? (product.deposit_amount ?? 0) : 0;
  const totalPrice = unitPrice * qtyClamped;
  const anchorTotal = anchor && days > 0 ? anchorRentalPrice(anchor, days) * qtyClamped : null;

  const hasRange = Boolean(rentalStart && rentalEnd && days > 0);
  const tooShort = hasRange && days < product.min_rental_days;
  const canAdd = hasRange && !tooShort;
  const startOnly = Boolean(rentalStart && !rentalEnd);
  const rangeLabel =
    rentalStart && rentalEnd
      ? `${format(rentalStart, "d. MMM", { locale: hr })} - ${format(rentalEnd, "d. MMM yyyy", { locale: hr })}`
      : "";

  function handleAddToCart() {
    if (!rentalStart || !rentalEnd || !canAdd) return;

    addItem({
      productId: product.id,
      productName: product.name,
      heroImage: product.hero_image_url ?? "",
      slug: product.slug,
      rentalStart: toYmd(rentalStart),
      rentalEnd: toYmd(rentalEnd),
      days,
      minRentalDays: product.min_rental_days,
      priceTierLabel: `${days} dana`,
      priceForTier: unitPrice,
      totalPrice,
      depositAmount: unitDeposit * qtyClamped,
      qty: qtyClamped,
      deliveryAvailable: product.delivery_available,
      deliveryFee: product.delivery_fee,
      ...(anchor && anchorTotal != null ? { anchorPrice: anchorTotal, anchorDate: anchor.date } : {}),
    });

    trackAddToCart({
      id: product.id,
      name: product.name,
      price: totalPrice,
      category: product.category,
    });

    setAdded(true);
    setTimeout(() => {
      router.push("/upit");
    }, 800);
  }

  const addButtonLabel = added ? "Dodano! ✓" : "Dodaj u košaricu";

  return (
    <>
      <div className="booking-card bg-white rounded-lg shadow-card flex flex-col">
        {/* BODY: on desktop a scroll area inside the card, for short screens.
            On a phone it dissolves (display: contents) so its two parts can be
            ordered around the footer: prices and calendar, then the footer
            with the status and the button, then the notes. */}
        <div className="contents lg:block lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <div className="order-1 p-4 sm:p-5 lg:p-4 space-y-3">
            {/* Price tiers */}
            <div>
              <div className={`grid gap-2 ${TIER_GRID[tiers.length] ?? "grid-cols-3"}`}>
                {tiers.map((tier) => (
                  <div key={tier.label} className="rounded-md border border-gray-100 px-2 py-1.5 text-center">
                    <div className="text-xs text-brand-muted">{tier.label}</div>
                    <div className="font-price font-bold text-brand-primary leading-tight">{tier.price} €</div>
                    {savingsLabel(tier.tierDays, tier.price) && (
                      <div className="text-[11px] leading-tight text-green-600 font-semibold">
                        {savingsLabel(tier.tierDays, tier.price)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {anchor && anchorTiers.length > 0 && (
                <p className="mt-1.5 text-[11px] leading-tight text-brand-muted">
                  {anchorTiersText(anchor.date, anchorTiers)}
                </p>
              )}
            </div>

            {/* Calendar */}
            <AvailabilityCalendar
              stockQty={product.stock_qty}
              availability={availability}
              onError={setCalendarError}
              onRangeChange={(start, end, d) => {
                setRentalStart(start);
                setRentalEnd(end);
                setDays(d);
                if (start && end && d > 0) {
                  trackAvailabilityChecked(product.id, start.toISOString(), end.toISOString(), d);
                }
              }}
            />

          </div>

          <div className="order-3 px-4 pb-4 sm:px-5 sm:pb-5 lg:px-4 lg:pb-4 space-y-3">
            {/* Deposit badge */}
            {unitDeposit > 0 && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-700">
                  <span className="font-semibold">
                    Kaucija: {(unitDeposit * qtyClamped).toFixed(0)} €
                    {qtyClamped > 1 ? ` (${qtyClamped} × ${product.deposit_amount} €)` : ""}
                  </span>
                  <br />
                  {product.deposit_note ?? "Kaucija se vraća po povratku opreme u ispravnom stanju."}
                </div>
              </div>
            )}

            {/* Trust badges and phone */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              {[
                "✓ Preuzimanje u Zagrebu",
                product.delivery_available &&
                  (product.delivery_fee > 0
                    ? `✓ Dostava ${formatPrice(product.delivery_fee)} (Zagreb i okolica)`
                    : "✓ Besplatna dostava (Zagreb i okolica)"),
                "✓ Odgovor u roku 1 radnog dana",
              ]
                .filter((t): t is string => Boolean(t))
                .map((t) => (
                  <p key={t} className="text-xs text-brand-muted">
                    {t}
                  </p>
                ))}
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 pt-1 text-sm text-brand-primary font-bold hover:text-brand-dark transition-colors"
                onClick={trackPhoneClick}
              >
                <Phone className="h-4 w-4" />
                {PHONE}
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER: always visible on desktop (pinned under the scroll area),
            right under the calendar on a phone. What is picked, what it
            costs, the button. */}
        <div className="order-2 border-t border-gray-100 p-4 sm:px-5 lg:px-4 space-y-2.5 lg:rounded-b-lg bg-white">
          <div role="status" aria-live="polite">
            {calendarError ? (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{calendarError}</p>
            ) : startOnly && rentalStart ? (
              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                  2
                </span>
                <div>
                  <div>
                    Početak: <strong>{format(rentalStart, "d. MMM yyyy", { locale: hr })}</strong>
                  </div>
                  <div className="mt-0.5 text-xs text-amber-800">
                    Kliknite još jednom na datum kraja najma. Za jedan dan kliknite ponovno isti datum.
                  </div>
                </div>
              </div>
            ) : tooShort ? (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                Minimalni period je {product.min_rental_days} dana. Odabrali ste {days}. Odaberite dulji raspon.
              </p>
            ) : hasRange ? (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-brand-text">
                    {rangeLabel} <span className="font-normal text-brand-muted">({daysLabel(days)})</span>
                  </div>
                  {upgraded && (
                    <div className="text-xs text-green-600 font-semibold">Primijenjena povoljnija cijena paketa</div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-price font-bold text-brand-primary text-xl leading-tight">
                    {totalPrice.toFixed(0)} €
                  </div>
                  <AnchorPriceNote date={anchor?.date} amount={anchorTotal} />
                </div>
              </div>
            ) : (
              <p className="text-xs text-brand-muted">
                Kliknite datum početka, a zatim datum kraja najma. Za najam od jednog dana kliknite isti datum dva puta.
                {product.min_rental_days > 1 && (
                  <>
                    {" "}
                    Minimalni najam je <strong>{product.min_rental_days} dana</strong>.
                  </>
                )}
              </p>
            )}
          </div>

          {/* Quantity: only when more than one unit exists. It changes the
              total, so it lives next to it. */}
          {product.stock_qty > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-text">
                <span className="font-semibold">Količina</span>{" "}
                <span className="text-xs text-brand-muted">(dostupno {maxQty} kom)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qtyClamped - 1))}
                  disabled={qtyClamped <= 1}
                  aria-label="Smanji količinu"
                  className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-brand-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-bold text-brand-text tabular-nums">{qtyClamped}</span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(maxQty, qtyClamped + 1))}
                  disabled={qtyClamped >= maxQty}
                  aria-label="Povećaj količinu"
                  className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-brand-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!canAdd || added}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
            {addButtonLabel}
          </button>
        </div>
      </div>

      {/* MOBILE: fixed bottom bar that follows the selection. Before dates are
          picked it leads to the calendar; once they are valid it shows the
          total and books, so the button is under the thumb wherever the
          visitor has scrolled. */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
        {canAdd ? (
          <>
            <div className="min-w-0">
              <div className="leading-tight">
                <span className="font-price font-bold text-brand-primary text-lg">{totalPrice.toFixed(0)} €</span>
                <span className="text-xs text-brand-muted">
                  {" "}
                  · {daysLabel(days)}
                  {qtyClamped > 1 ? ` · ${qtyClamped} kom` : ""}
                </span>
              </div>
              <div className="truncate text-xs text-brand-muted">{rangeLabel}</div>
              <AnchorPriceNote date={anchor?.date} amount={anchorTotal} />
            </div>
            <button
              onClick={handleAddToCart}
              disabled={added}
              className="shrink-0 flex items-center gap-2 bg-brand-primary text-white font-bold px-4 py-2.5 rounded-lg disabled:opacity-50 hover:bg-brand-dark transition-colors active:scale-95"
            >
              <ShoppingCart className="h-4 w-4" />
              {addButtonLabel}
            </button>
          </>
        ) : (
          <>
            <div className="min-w-0">
              {startOnly && rentalStart ? (
                <>
                  <div className="text-sm font-semibold text-brand-text leading-tight">
                    Početak: {format(rentalStart, "d. MMM", { locale: hr })}
                  </div>
                  <div className="text-xs text-amber-800">Odaberite još datum kraja</div>
                </>
              ) : tooShort ? (
                <div className="text-xs text-red-600">Minimalni period je {product.min_rental_days} dana</div>
              ) : calendarError ? (
                <div className="text-xs text-red-600">Raspon uključuje zauzet datum</div>
              ) : (
                <>
                  <span className="font-price font-bold text-brand-primary text-lg">
                    od {effectiveDailyRate(product)} €
                  </span>
                  <span className="text-xs text-brand-muted">/dan</span>
                  {anchor && <AnchorPriceNote date={anchor.date} amount={anchorDailyRate(anchor)} unit="/dan" />}
                </>
              )}
            </div>
            <a
              href="#rezervacija"
              className="shrink-0 flex items-center gap-2 bg-brand-primary text-white font-bold px-4 py-2.5 rounded-lg hover:bg-brand-dark transition-colors"
            >
              <CalendarDays className="h-4 w-4" />
              {startOnly ? "Odaberi kraj" : "Odaberi datume"}
            </a>
          </>
        )}
      </div>
    </>
  );
}
