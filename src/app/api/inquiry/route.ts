import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CartItem } from "@/lib/cart";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
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

  const { name, email, phone, delivery_address, note, items, delivery_type, delivery_fee } = parsed.data;
  const cartItems = items as CartItem[];

  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const totalDeposit = items.reduce((sum, i) => sum + i.depositAmount, 0);
  const deliveryFee = delivery_fee ?? 0;
  const deliveryType = delivery_type ?? "pickup";

  const inquiryNumber = `RNT-${Date.now().toString(36).toUpperCase()}`;

  const supabase = createAdminClient();
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
      subtotal_estimate: subtotal,
      total_estimate: subtotal + totalDeposit + deliveryFee,
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
          items: cartItems, subtotal, totalDeposit, deliveryFee,
          inquiryId, inquiryNumber,
        }),
        replyTo,
      }),
      resend.emails.send({
        from: `rentanje.com <${fromEmail}>`,
        to: email,
        subject: `Vaš upit je zaprimljen — rentanje.com`,
        html: buildCustomerConfirmationHtml({ name, items: cartItems, subtotal, totalDeposit }),
      }),
    ]);
  } catch (emailErr) {
    console.error("Email send error:", emailErr);
    // Don't fail the request — inquiry is already saved.
  }

  return NextResponse.json({ ok: true, inquiryId }, { status: 201 });
}
