import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validatePromoCode, type PromoValidationItem } from "@/lib/promo";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

// No categoryId here: category-scoped promos resolve product → category
// server-side in validatePromoCode; a client-supplied value is never trusted.
const itemSchema = z.object({
  productId: z.string(),
  totalPrice: z.number().min(0),
  bundleId: z.string().nullable().optional(),
});

const schema = z.object({
  code: z.string().min(1),
  rentalDays: z.number().int().min(1),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const { limited } = await checkRateLimit(ip, {
    endpoint: "promo",
    windowSeconds: 60,
    max: 12,
  });
  if (limited) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation error" }, { status: 422 });
  }

  const result = await validatePromoCode(
    parsed.data.code,
    parsed.data.items as PromoValidationItem[],
    parsed.data.rentalDays
  );

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 200 });
  }

  return NextResponse.json({
    ok: true,
    code: result.code,
    discount: result.discount,
    appliesLabel: result.appliesLabel,
  });
}
