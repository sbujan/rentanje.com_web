"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore, CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { trackPurchase } from "@/lib/gtag";
import { Trash2, ShoppingBag, ChevronRight, Loader2, Phone } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Unesite ime i prezime"),
  email: z.string().email("Unesite ispravnu e-mail adresu"),
  phone: z.string().min(8, "Unesite ispravan broj telefona"),
  delivery_address: z.string().optional(),
  note: z.string().optional(),
  agree: z.literal(true, { errorMap: () => ({ message: "Morate prihvatiti uvjete" }) }),
});

type FormData = z.infer<typeof schema>;

function CartItemRow({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  const start = parseISO(item.rentalStart);
  const end = parseISO(item.rentalEnd);

  return (
    <div className="flex gap-4 py-4">
      {item.heroImage ? (
        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
          <Image src={item.heroImage} alt={item.productName} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-16 w-16 rounded-md bg-gray-100 flex-shrink-0 flex items-center justify-center">
          <ShoppingBag className="h-6 w-6 text-gray-300" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <Link href={`/najam/${item.slug}`} className="font-semibold text-brand-text hover:underline text-sm truncate block">
          {item.productName}
        </Link>
        <div className="text-xs text-brand-muted mt-0.5 space-y-0.5">
          <p>
            {format(start, "d. MMM", { locale: hr })} – {format(end, "d. MMM yyyy", { locale: hr })}
            {" "}· {item.days} {item.days === 1 ? "dan" : "dana"}
          </p>
          <p>Cijena: {formatPrice(item.totalPrice)}</p>
          {item.depositAmount > 0 && (
            <p className="text-amber-600">Depozit: {formatPrice(item.depositAmount)}</p>
          )}
        </div>
      </div>

      <button
        onClick={onRemove}
        aria-label="Ukloni iz košarice"
        className="self-start text-gray-400 hover:text-red-500 transition-colors mt-1"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const totalDeposit = items.reduce((sum, i) => sum + i.depositAmount, 0);

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, items }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Greška pri slanju upita.");
      }

      const { inquiryId } = await res.json();
      trackPurchase(inquiryId, subtotal + totalDeposit, items.map((i) => ({ id: i.productId, name: i.productName, price: i.totalPrice })));
      clearCart();
      router.push("/hvala");
    } catch (err: any) {
      setServerError(err.message ?? "Greška pri slanju upita. Pokušajte ponovo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-200 mb-4" />
        <h1 className="font-display text-2xl font-bold text-brand-text mb-2">
          Vaša košarica je prazna
        </h1>
        <p className="text-brand-muted mb-6">Dodajte opremu i pošaljite upit.</p>
        <Link
          href="/oprema"
          className="inline-flex items-center gap-1.5 bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Pregledaj opremu <ChevronRight className="h-4 w-4" />
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-brand-muted mb-6">
        <Link href="/" className="hover:text-brand-primary">Početna</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-brand-text font-medium">Upit za iznajmljivanje</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-brand-text mb-8">
        Upit za iznajmljivanje
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-brand-text">Vaši podaci</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  Ime i prezime *
                </label>
                <input
                  {...register("name")}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Ana Anić"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  E-mail *
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="ana@example.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                Broj telefona *
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="+385 91 234 5678"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                Adresa dostave
                <span className="text-brand-muted font-normal ml-1">(opcionalno)</span>
              </label>
              <input
                {...register("delivery_address")}
                className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ilica 1, Zagreb"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                Napomena
                <span className="text-brand-muted font-normal ml-1">(opcionalno)</span>
              </label>
              <textarea
                {...register("note")}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                placeholder="Posebni zahtjevi, pitanja..."
              />
            </div>

            <label className="flex gap-2.5 items-start cursor-pointer">
              <input
                {...register("agree")}
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-primary accent-brand-primary"
              />
              <span className="text-sm text-brand-muted leading-snug">
                Prihvaćam{" "}
                <Link href="/uvjeti-koristenja" className="text-brand-primary underline">
                  uvjete korištenja
                </Link>{" "}
                i slažem se da me kontaktirate radi potvrde upita. *
              </span>
            </label>
            {errors.agree && (
              <p className="text-xs text-red-500 -mt-2">{errors.agree.message}</p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-3 px-6 rounded-lg font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Šaljem upit...
              </>
            ) : (
              "Pošalji upit"
            )}
          </button>

          <p className="text-xs text-center text-brand-muted">
            Nakon slanja kontaktirat ćemo vas u roku od 1–2 sata.
          </p>
        </form>

        {/* ORDER SUMMARY */}
        <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-display font-bold text-lg text-brand-text mb-4">
              Pregled košarice
            </h2>

            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onRemove={() => removeItem(item.productId)}
                />
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Iznajmljivanje</span>
                <span className="font-medium text-brand-text">{formatPrice(subtotal)}</span>
              </div>
              {totalDeposit > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Depozit (povratni)</span>
                  <span className="font-medium text-amber-700">{formatPrice(totalDeposit)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-bold text-brand-text">Ukupno</span>
                <span className="font-bold text-brand-text text-lg">
                  {formatPrice(subtotal + totalDeposit)}
                </span>
              </div>
            </div>
          </div>

          {/* Phone CTA */}
          <div className="bg-brand-light rounded-xl px-5 py-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-xs text-brand-muted">Nazovite nas!</p>
              <a href="tel:+385952044414" className="font-bold text-brand-text hover:text-brand-primary transition-colors">
                +385 95 204 4414
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
