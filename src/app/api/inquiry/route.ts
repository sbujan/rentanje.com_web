import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CartItem } from "@/lib/cart";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { validatePromoCode, toPromoItems } from "@/lib/promo";
import {
  validateCartAvailability,
  insertAvailabilityRowsForInquiry,
} from "@/lib/availability";
import {
  buildAdminInquiryHtml,
  buildCustomerConfirmationHtml,
} from "@/lib/email/inquiry-templates";
import type { Json } from "@/types/database";

const cartItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  heroImage: z.string(),
  slug: z.string(),
  rentalStart: z.string(),
  rentalEnd: z.string(),
  days: z.number(),
  minRentalDays: z.union([z.literal(1), z.literal(3), z.literal(7)]),
  priceTierLabel: z.string(),
  priceForTier: z.number(),
  totalPrice: z.number(),
  depositAmount: z.number(),
  qty: z.number(),
  bundleId: z.string().nullable().optional(),
  bundleName: z.string().nullable().optional(),
  bundleDiscountAmount: z.number().optional(),
});

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  wants_delivery: z.boolean().optional(),
  delivery_type: z.enum(["pickup", "delivery"]).optional(),
  delivery_fee: z.number().min(0).optional(),
  delivery_address: z.string().optional(),
  note: z.string().optional(),
  agree: z.literal(true),
  items: z.array(cartItemSchema).min(1),
  promo_code: z.string().optional(),
});

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
    items,
    delivery_type,
    delivery_fee,
    promo_code,
  } = parsed.data;
  const cartItems = items as CartItem[];

  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const bundleDiscount = items.reduce(
    (sum, i) => sum + (i.bundleDiscountAmount ?? 0),
    0
  );
  const totalDeposit = items.reduce((sum, i) => sum + i.depositAmount, 0);
  const deliveryFee = delivery_fee ?? 0;
  const deliveryType = delivery_type ?? "pickup";

  // Re-validate the promo code server-side and recompute the discount.
  // The client-displayed amount is informational; this is what gets persisted.
  let promoDiscount = 0;
  let promoCodeNormalised: string | null = null;
  let promotionIdToBump: string | null = null;
  if (promo_code) {
    const rentalDays = items[0]?.days ?? 0;
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
  const rentalStart = items.reduce(
    (min, i) => (min === null || i.rentalStart < min ? i.rentalStart : min),
    null as string | null
  );
  const rentalEnd = items.reduce(
    (max, i) => (max === null || i.rentalEnd > max ? i.rentalEnd : max),
    null as string | null
  );

  const inquiryNumber = `RNT-${Date.now().toString(36).toUpperCase()}`;

  const supabase = createAdminClient();

  // Block double-booking: every (product, date) in the cart must have
  // remaining stock after summing existing availability rows (manual blocks
  // + rows from already-submitted inquiries).
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
      items: items as unknown as Json,
      rental_start: rentalStart,
      rental_end: rentalEnd,
      subtotal_estimate: discountedSubtotal,
      discount_amount: totalDiscount,
      promo_code: promoCodeNormalised,
      total_estimate: discountedSubtotal + totalDeposit + deliveryFee,
      status: "new",
    })
    .select("id")
    .single();

  if (dbError) {
    console.error("DB insert error:", dbError);
    return NextResponse.json({ error: "Greška pri pohrani upita." }, { status: 500 });
  }

  const inquiryId = inquiry.id;

  // Soft-reserve dates: write availability rows tied to this inquiry so
  // subsequent public submissions and the calendar both see them as taken.
  // Admin can release them by cancelling the inquiry.
  try {
    await insertAvailabilityRowsForInquiry(
      supabase,
      inquiryId,
      inquiryNumber,
      cartItems
    );
    // Bust the ISR cache for every reserved product so the calendar shows
    // the new booking immediately instead of waiting for the 1-hour revalidate.
    const reservedSlugs = Array.from(new Set(cartItems.map((i) => i.slug)));
    for (const slug of reservedSlugs) {
      revalidatePath(`/najam/${slug}`);
    }
  } catch (availErr) {
    // Don't fail the request — the inquiry is saved. But surface this loudly and
    // traceably: the dates are NOT blocked until an admin re-syncs the inquiry
    // ("Ponovno blokiraj termine" on the detail page). Greppable marker + context.
    console.error("AVAILABILITY_SYNC_FAILED", {
      inquiryNumber,
      inquiryId,
      slugs: Array.from(new Set(cartItems.map((i) => i.slug))),
      error: availErr instanceof Error ? availErr.message : String(availErr),
    });
  }

  // Bump promotion usage_count after the inquiry is safely persisted, so we
  // don't increment for failed submissions.
  if (promotionIdToBump) {
    const { data: current } = await supabase
      .from("promotions")
      .select("usage_count")
      .eq("id", promotionIdToBump)
      .single();
    if (current) {
      await supabase
        .from("promotions")
        .update({ usage_count: (current.usage_count ?? 0) + 1 })
        .eq("id", promotionIdToBump);
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "info@rentanje.com";
  const fromEmail = process.env.FROM_EMAIL ?? "mail@list360.agency";
  const replyTo = email.replace(/[\r\n]/g, "");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await Promise.all([
      resend.emails.send({
        from: `rentanje.com <${fromEmail}>`,
        to: adminEmail,
        subject: `Novi upit ${inquiryNumber} — ${name}`,
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

  return NextResponse.json({ ok: true, inquiryId }, { status: 201 });
}
