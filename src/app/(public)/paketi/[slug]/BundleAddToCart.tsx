"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker, DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";
import { hr } from "date-fns/locale";
import { ShoppingCart, Phone } from "lucide-react";
import "react-day-picker/dist/style.css";
import { useCartStore, type CartItem } from "@/lib/cart";
import { calcRentalPrice, applyBundleDiscount } from "@/lib/pricing";
import { toYmd } from "@/lib/utils";
import { gtagEvent, trackBundleViewed, trackPhoneClick } from "@/lib/gtag";

interface BundleProduct {
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
  qty: number;
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
}

const PHONE_HREF = "tel:+385952044414";

export default function BundleAddToCart({ bundle, products }: Props) {
  const router = useRouter();
  const addBundle = useCartStore((s) => s.addBundle);

  const [range, setRange] = useState<DateRange | undefined>();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    trackBundleViewed(bundle.id, bundle.name);
  }, [bundle.id, bundle.name]);

  const today = new Date();
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

  const canAdd = !!range?.from && !!range?.to && days >= minRentalDays && products.length > 0;

  function handleAdd() {
    if (!canAdd || !range?.from || !range?.to) return;

    const startIso = toYmd(range.from);
    const endIso = toYmd(range.to);

    const items: CartItem[] = products.map((p) => {
      const { price } = calcRentalPrice(days, p);
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

  return (
    <div className="bg-white rounded-xl shadow-card p-5 space-y-5 border border-gray-100">
      <a
        href={PHONE_HREF}
        onClick={trackPhoneClick}
        className="flex items-center gap-2 text-brand-primary font-bold hover:text-brand-dark transition-colors"
      >
        <Phone className="h-5 w-5" />
        +385 95 204 4414
      </a>

      <div>
        <p className="text-sm font-semibold text-brand-text mb-2">Odaberite datume najma</p>
        <div className="rounded-md border border-gray-100 overflow-hidden">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: today }}
            locale={hr}
            numberOfMonths={1}
            className="!m-0 p-3"
          />
        </div>
        {minRentalDays > 1 && (
          <p className="text-xs text-brand-muted mt-2">
            Minimalni period: <strong>{minRentalDays} dana</strong>.
          </p>
        )}
      </div>

      {days > 0 && (
        <div className="bg-brand-light rounded-md px-3 py-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-brand-muted">Iznajmljivanje ({days} {days === 1 ? "dan" : "dana"})</span>
            <span className="font-semibold text-brand-text">{subtotal.toFixed(0)} €</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Paket popust</span>
              <span className="font-semibold">- {discount.toFixed(0)} €</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-200/60">
            <span className="font-bold text-brand-text">Ukupno</span>
            <span className="font-price font-bold text-brand-primary text-lg">{total.toFixed(0)} €</span>
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={!canAdd || added}
        className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors active:scale-95"
      >
        <ShoppingCart className="h-5 w-5" />
        {added ? "Dodano! ✓" : "Dodaj paket u košaricu"}
      </button>

      {!canAdd && days > 0 && days < minRentalDays && (
        <p className="text-xs text-red-500 text-center">
          Minimalni period je {minRentalDays} dana. Odabrali ste {days}.
        </p>
      )}
    </div>
  );
}
