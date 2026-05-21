"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ShoppingCart, Info } from "lucide-react";
import { useCartStore } from "@/lib/cart";
import { trackAddToCart, trackAvailabilityChecked, trackPhoneClick } from "@/lib/gtag";
import AvailabilityCalendar from "./AvailabilityCalendar";

const PHONE = "+385 95 204 4414";
const PHONE_HREF = "tel:+385952044414";

interface AvailabilityRecord { date: string; qty_booked: number }

interface Props {
  product: {
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
    stock_qty: number;
    category?: string;
  };
  availability: AvailabilityRecord[];
}

export default function AddToCartCard({ product, availability }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const [rentalStart, setRentalStart] = useState<Date | null>(null);
  const [rentalEnd, setRentalEnd] = useState<Date | null>(null);
  const [days, setDays] = useState(0);
  const [added, setAdded] = useState(false);

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
  function calcPrice(d: number) {
    if (d <= 0) return { price: 0, upgraded: false };

    const p1 = product.price_per_day ?? Infinity;
    const p3 = product.price_per_3days ?? Infinity;
    const p7 = product.price_per_7days;

    const n7 = Math.floor(d / 7);
    const r7 = d - n7 * 7;
    const n3 = Math.floor(r7 / 3);
    const r3 = r7 - n3 * 3;

    let price = n7 * p7 + n3 * p3 + r3 * p1;
    let upgraded = false;

    // Check: upgrade leftover days to a 3-day package if cheaper
    if (r3 > 0 && p3 < Infinity) {
      const alt = n7 * p7 + (n3 + 1) * p3;
      if (alt < price) { price = alt; upgraded = true; }
    }

    // Check: upgrade all remainder to a 7-day package if cheaper
    if (r7 > 0) {
      const alt = (n7 + 1) * p7;
      if (alt < price) { price = alt; upgraded = true; }
    }

    return { price, upgraded };
  }

  const { price: totalPrice, upgraded } = calcPrice(days);

  function handleAddToCart() {
    if (!rentalStart || !rentalEnd || days <= 0) return;

    addItem({
      productId: product.id,
      productName: product.name,
      heroImage: product.hero_image_url ?? "",
      slug: product.slug,
      rentalStart: rentalStart.toISOString(),
      rentalEnd: rentalEnd.toISOString(),
      days,
      minRentalDays: product.min_rental_days,
      priceTierLabel: `${days} dana`,
      priceForTier: totalPrice,
      totalPrice,
      depositAmount: product.requires_deposit ? (product.deposit_amount ?? 0) : 0,
      qty: 1,
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

  const canAdd = rentalStart && rentalEnd && days >= product.min_rental_days;

  return (
    <div className="bg-white rounded-lg shadow-card p-5 space-y-5">
      {/* Phone */}
      <a
        href={PHONE_HREF}
        className="flex items-center gap-2 text-brand-primary font-bold hover:text-brand-dark transition-colors"
        onClick={trackPhoneClick}
      >
        <Phone className="h-5 w-5" />
        {PHONE}
      </a>

      {/* Price tiers */}
      <div className="space-y-2">
        {tiers.map((tier) => (
          <div key={tier.label} className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">{tier.label}</span>
            <div className="text-right">
              <span className="font-price font-bold text-brand-primary">
                {tier.price} €
              </span>
              {savingsLabel(tier.tierDays, tier.price) && (
                <span className="ml-2 text-xs text-green-600 font-semibold">
                  {savingsLabel(tier.tierDays, tier.price)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <AvailabilityCalendar
        stockQty={product.stock_qty}
        availability={availability}
        minRentalDays={product.min_rental_days}
        onRangeChange={(start, end, d) => {
          setRentalStart(start);
          setRentalEnd(end);
          setDays(d);
          if (start && end && d > 0) {
            trackAvailabilityChecked(product.id, start.toISOString(), end.toISOString(), d);
          }
        }}
      />

      {/* Price for selected days */}
      {days > 0 && (
        <div className="bg-brand-light rounded-md px-3 py-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-muted">Cijena ({days} dana)</span>
            <span className="font-price font-bold text-brand-primary">
              {totalPrice.toFixed(0)} €
            </span>
          </div>
          {upgraded && (
            <p className="text-xs text-green-600 font-semibold mt-1">
              Automatski primijenjena povoljnija cijena paketa!
            </p>
          )}
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={!canAdd || added}
        className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors active:scale-95"
      >
        <ShoppingCart className="h-5 w-5" />
        {added ? "Dodano! ✓" : "Dodaj u košaricu"}
      </button>

      {!canAdd && days > 0 && days < product.min_rental_days && (
        <p className="text-xs text-red-500 text-center">
          Minimalni period je {product.min_rental_days} dana. Odabrali ste {days}.
        </p>
      )}

      {/* Deposit badge */}
      {product.requires_deposit && product.deposit_amount && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700">
            <span className="font-semibold">Kaucija: {product.deposit_amount} €</span>
            <br />
            {product.deposit_note ?? "Kaucija se vraća po povratku opreme u ispravnom stanju."}
          </div>
        </div>
      )}

      {/* Trust badges */}
      <div className="space-y-1.5 pt-1 border-t border-gray-100">
        {["✓ Preuzimanje u Zagrebu", "✓ Dostava 10 € (Zagreb)", "✓ Brz odgovor <2h"].map((t) => (
          <p key={t} className="text-xs text-brand-muted">{t}</p>
        ))}
      </div>
    </div>
  );
}
