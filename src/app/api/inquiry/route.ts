import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CartItem } from "@/lib/cart";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { validatePromoCode, toPromoItems } from "@/lib/promo";
import { calcRentalPrice, applyBundleDiscount } from "@/lib/pricing";
import { toYmd } from "@/lib/utils";
import { DELIVERY_FEE } from "@/lib/site";
import {
  expandRentalDates,
  validateCartAvailability,
  insertAvailabilityRowsForInquiry,
} from "@/lib/availability";
import {
  buildAdminInquiryHtml,
  buildCustomerConfirmationHtml,
} from "@/lib/email/inquiry-templates";
import type { Json } from "@/types/database";

const YMD = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RENTAL_DAYS = 90;

// Prices, deposits and discounts in the payload are DISPLAY-ONLY: the server
// recomputes every money value from the DB below and discards these. Bounds
// here exist to reject junk early, not to validate money.
const cartItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string().max(200),
  heroImage: z.string().max(500),
  slug: z.string().max(200),
  rentalStart: z.string().regex(YMD, "Neispravan datum"),
  rentalEnd: z.string().regex(YMD, "Neispravan datum"),
  days: z.number().int().min(1).max(MAX_RENTAL_DAYS),
  minRentalDays: z.union([z.literal(1), z.literal(3), z.literal(7)]),
  priceTierLabel: z.string().max(50),
  priceForTier: z.number().min(0),
  totalPrice: z.number().min(0),
  depositAmount: z.number().min(0),
  qty: z.number().int().min(1).max(20),
  bundleId: z.string().nullable().optional(),
  bundleName: z.string().max(200).nullable().optional(),
  bundleDiscountAmount: z.number().min(0).optional(),
});

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(8).max(40),
  wants_delivery: z.boolean().optional(),
  delivery_type: z.enum(["pickup", "delivery"]).optional(),
  delivery_fee: z.number().min(0).optional(), // ignored — recomputed server-side
  delivery_address: z.string().max(300).optional(),
  note: z.string().max(2000).optional(),
  agree: z.literal(true),
  items: z.array(cartItemSchema).min(1).max(30),
  promo_code: z.string().max(50).optional(),
});

/** Reject malformed/abusive date ranges before touching the DB. */
function validateDateRange(start: string, end: string): string | null {
  const dates = expandRentalDates(start, end);
  if (dates.length === 0) return "Neispravan raspon datuma.";
  if (dates.length > MAX_RENTAL_DAYS)
    return `Maksimalni period najma je ${MAX_RENTAL_DAYS} dana.`;
  // Server runs in UTC: between midnight and ~2h Zagreb time "today" leans
  // a day early, which only errs in the customer's favour.
  if (start < toYmd(new Date())) return "Početni datum ne može biti u prošlosti.";
  return null;
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const { limited } = await checkRateLimit(ip, {
    endpoint: "inquiry",
    windowSeconds: 600,
    max: 8,
  });
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation error", details: parsed.error.flatten() }, { status: 422 });
  }

  const {
    name,
    email,
    phone,
    delivery_address,
    note,
    items: rawItems,
    delivery_type,
    promo_code,
  } = parsed.data;

  for (const item of rawItems) {
    const dateError = validateDateRange(item.rentalStart, item.rentalEnd);
    if (dateError) {
      return NextResponse.json({ error: dateError }, { status: 422 });
    }
  }

  const supabase = createAdminClient();

  // ---------------------------------------------------------------
  // Recompute ALL money server-side. The client's prices, deposits and
  // discounts are display-only; persisting or emailing them would let
  // anyone POST a €1 quote.
  // ---------------------------------------------------------------
  const productIds = Array.from(new Set(rawItems.map((i) => i.productId)));
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select(
      "id, name, slug, hero_image_url, price_per_day, price_per_3days, price_per_7days, min_rental_days, requires_deposit, deposit_amount, stock_qty, is_active"
    )
    .in("id", productIds);
  if (prodErr) {
    console.error("Product fetch failed:", prodErr);
    return NextResponse.json({ error: "Greška pri provjeri proizvoda." }, { status: 500 });
  }
  const productById = new Map((products ?? []).map((p) => [p.id, p]));

  const cartItems: CartItem[] = [];
  for (const item of rawItems) {
    const product = productById.get(item.productId);
    if (!product || !product.is_active) {
      return NextResponse.json(
        { error: `Proizvod "${item.productName}" više nije dostupan.` },
        { status: 422 }
      );
    }
    const days = expandRentalDates(item.rentalStart, item.rentalEnd).length;
    if (days < (product.min_rental_days ?? 1)) {
      return NextResponse.json(
        { error: `Minimalni period najma za "${product.name}" je ${product.min_rental_days} dana.` },
        { status: 422 }
      );
    }
    if (item.qty > (product.stock_qty ?? 1)) {
      return NextResponse.json(
        { error: `Za "${product.name}" je dostupno najviše ${product.stock_qty} kom.` },
        { status: 422 }
      );
    }

    const { price: unitPrice } = calcRentalPrice(days, product);
    const unitDeposit = product.requires_deposit ? (product.deposit_amount ?? 0) : 0;
    const minRental = ([1, 3, 7] as const).includes(
      product.min_rental_days as 1 | 3 | 7
    )
      ? (product.min_rental_days as 1 | 3 | 7)
      : 1;

    cartItems.push({
      productId: product.id,
      productName: product.name,
      heroImage: product.hero_image_url ?? "",
      slug: product.slug,
      rentalStart: item.rentalStart,
      rentalEnd: item.rentalEnd,
      days,
      minRentalDays: minRental,
      priceTierLabel: `${days} dana`,
      priceForTier: unitPrice,
      totalPrice: unitPrice * item.qty,
      depositAmount: unitDeposit * item.qty,
      qty: item.qty,
      bundleId: item.bundleId ?? null,
      bundleName: item.bundleName ?? null,
      bundleDiscountAmount: 0,
    });
  }

  // Bundle discounts: recompute from the bundles table over the recomputed
  // line subtotals; stamp once on the first line of each bundle (existing
  // convention the cart UI and admin views rely on).
  const bundleIds = Array.from(
    new Set(cartItems.map((i) => i.bundleId).filter((b): b is string => !!b))
  );
  if (bundleIds.length > 0) {
    const { data: bundles, error: bundleErr } = await supabase
      .from("bundles")
      .select("id, name, discount_type, discount_value, is_active")
      .in("id", bundleIds);
    if (bundleErr) {
      console.error("Bundle fetch failed:", bundleErr);
      return NextResponse.json({ error: "Greška pri provjeri paketa." }, { status: 500 });
    }
    for (const bundle of bundles ?? []) {
      if (!bundle.is_active) continue;
      const lines = cartItems.filter((i) => i.bundleId === bundle.id);
      const bundleSubtotal = lines.reduce((sum, i) => sum + i.totalPrice, 0);
      const { discount } = applyBundleDiscount(
        bundleSubtotal,
        bundle.discount_type as "percent" | "fixed" | null,
        bundle.discount_value
      );
      if (lines.length > 0) {
        lines[0].bundleDiscountAmount = discount;
        for (const line of lines) line.bundleName = bundle.name;
      }
    }
  }

  const subtotal = cartItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const bundleDiscount = cartItems.reduce(
    (sum, i) => sum + (i.bundleDiscountAmount ?? 0),
    0
  );
  const totalDeposit = cartItems.reduce((sum, i) => sum + i.depositAmount, 0);
  const deliveryType = delivery_type ?? "pickup";
  const deliveryFee = deliveryType === "delivery" ? DELIVERY_FEE : 0;

  // Re-validate the promo code server-side against the RECOMPUTED prices.
  let promoDiscount = 0;
  let promoCodeNormalised: string | null = null;
  let promotionIdToBump: string | null = null;
  if (promo_code) {
    const rentalDays = Math.max(...cartItems.map((i) => i.days));
    const promoResult = await validatePromoCode(
      promo_code,
      toPromoItems(cartItems),
      rentalDays
    );
    if (promoResult.ok) {
      promoDiscount = promoResult.discount;
      promoCodeNormalised = promoResult.code;
      promotionIdToBump = promoResult.promotionId;
    }
  }

  const totalDiscount = bundleDiscount + promoDiscount;
  const discountedSubtotal = Math.max(0, subtotal - totalDiscount);

  // Inquiry-level rental window = earliest start, latest end across items.
  // Read by the confirmation flow to auto-block availability.
  const rentalStart = cartItems.reduce(
    (min, i) => (min === null || i.rentalStart < min ? i.rentalStart : min),
    null as string | null
  );
  const rentalEnd = cartItems.reduce(
    (max, i) => (max === null || i.rentalEnd > max ? i.rentalEnd : max),
    null as string | null
  );

  // Random suffix: Date.now() alone collides for same-millisecond submissions
  // and the column is UNIQUE.
  const inquiryNumber = `RNT-${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;

  // Fast-fail pre-check (best UX for the common case). The authoritative,
  // race-free check happens inside the reservation RPC below.
  try {
    const availability = await validateCartAvailability(supabase, cartItems);
    if (!availability.ok) {
      return NextResponse.json(
        {
          error: "Odabrani datumi više nisu dostupni za neke proizvode.",
          conflicts: availability.conflicts,
        },
        { status: 422 }
      );
    }
  } catch (availErr) {
    console.error("Availability check failed:", availErr);
    return NextResponse.json(
      { error: "Greška pri provjeri dostupnosti." },
      { status: 500 }
    );
  }

  const { data: inquiry, error: dbError } = await supabase
    .from("inquiries")
    .insert({
      inquiry_number: inquiryNumber,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      delivery_type: deliveryType,
      delivery_fee: deliveryFee,
      delivery_address: delivery_address || null,
      message: note || null,
      items: cartItems as unknown as Json,
      rental_start: rentalStart,
      rental_end: rentalEnd,
      subtotal_estimate: discountedSubtotal,
      discount_amount: totalDiscount,
      promo_code: promoCodeNormalised,
      total_estimate: discountedSubtotal + totalDeposit + deliveryFee,
      accepted_liability_terms: true,
      status: "new",
    })
    .select("id")
    .single();

  if (dbError) {
    console.error("DB insert error:", dbError);
    return NextResponse.json({ error: "Greška pri pohrani upita." }, { status: 500 });
  }

  const inquiryId = inquiry.id;

  const adminEmail = process.env.ADMIN_EMAIL ?? "info@rentanje.com";
  const fromEmail = process.env.FROM_EMAIL;
  // Header-injection hygiene: user-controlled values in subject/replyTo must
  // not carry newlines.
  const safeSubjectName = name.replace(/[\r\n]+/g, " ").trim();
  const replyTo = email.replace(/[\r\n]/g, "");

  // Reserve dates atomically: the RPC locks the product rows, re-checks
  // remaining stock and inserts the availability rows in one transaction —
  // two concurrent submissions can no longer both grab the last unit.
  try {
    const conflicts = await insertAvailabilityRowsForInquiry(
      supabase,
      inquiryId,
      inquiryNumber,
      cartItems
    );
    if (conflicts.length > 0) {
      // Lost the race after the pre-check: roll back the inquiry shell.
      await supabase.from("inquiries").delete().eq("id", inquiryId);
      return NextResponse.json(
        {
          error: "Odabrani datumi više nisu dostupni za neke proizvode.",
          conflicts,
        },
        { status: 422 }
      );
    }
    // Bust the ISR cache for every reserved product so the calendar shows
    // the new booking immediately instead of waiting for the 1-hour revalidate.
    const reservedSlugs = Array.from(new Set(cartItems.map((i) => i.slug)));
    for (const slug of reservedSlugs) {
      revalidatePath(`/najam/${slug}`);
    }
  } catch (availErr) {
    // Don't fail the request — the inquiry is saved. But surface this loudly:
    // the dates are NOT blocked until an admin re-syncs the inquiry
    // ("Ponovno blokiraj termine" on the detail page).
    console.error("AVAILABILITY_SYNC_FAILED", {
      inquiryNumber,
      inquiryId,
      slugs: Array.from(new Set(cartItems.map((i) => i.slug))),
      error: availErr instanceof Error ? availErr.message : String(availErr),
    });
    if (fromEmail) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `rentanje.com <${fromEmail}>`,
          to: adminEmail,
          subject: `⚠️ Termini NISU blokirani za upit ${inquiryNumber}`,
          html: `<p>Automatsko blokiranje termina nije uspjelo za upit <strong>${inquiryNumber}</strong>.</p><p>Otvorite upit u adminu i kliknite "Ponovno blokiraj termine".</p>`,
        });
      } catch (alertErr) {
        console.error("Availability alert email failed:", alertErr);
      }
    }
  }

  // Bump promotion usage_count after the inquiry is safely persisted —
  // atomic increment so concurrent redemptions can't lose counts.
  if (promotionIdToBump) {
    const { error: bumpErr } = await supabase.rpc("increment_promo_usage", {
      p_promotion_id: promotionIdToBump,
    });
    if (bumpErr) console.error("Promo usage bump failed:", bumpErr);
  }

  if (!fromEmail) {
    console.error("FROM_EMAIL not configured — inquiry emails skipped", { inquiryNumber });
  } else {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await Promise.all([
        resend.emails.send({
          from: `rentanje.com <${fromEmail}>`,
          to: adminEmail,
          subject: `Novi upit ${inquiryNumber} — ${safeSubjectName}`,
          html: buildAdminInquiryHtml({
            name, email, phone, delivery_address, note,
            items: cartItems, subtotal, discount: totalDiscount, totalDeposit, deliveryFee,
            inquiryId, inquiryNumber,
          }),
          replyTo,
        }),
        resend.emails.send({
          from: `rentanje.com <${fromEmail}>`,
          to: email,
          subject: `Vaš upit je zaprimljen — rentanje.com`,
          html: buildCustomerConfirmationHtml({ name, items: cartItems, subtotal, discount: totalDiscount, totalDeposit }),
        }),
      ]);
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
      // Don't fail the request — inquiry is already saved.
    }
  }

  return NextResponse.json({ ok: true, inquiryId }, { status: 201 });
}
