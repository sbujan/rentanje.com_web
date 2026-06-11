import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

const schema = z.object({ productId: z.string().uuid() });

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const { limited } = await checkRateLimit(ip, {
    endpoint: "track-view",
    windowSeconds: 60,
    max: 30,
  });
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 422 });

  const { productId } = parsed.data;
  const supabase = createAdminClient();

  // Atomic single-statement increment via RPC — concurrent beacons can't
  // lose counts the way the old read-then-write did.
  // Fire-and-forget beacon: log failures but always 200 so the client
  // doesn't retry or surface analytics noise to the user.
  const { error } = await supabase.rpc("increment_product_view", {
    p_product_id: productId,
  });
  if (error) console.error("track-view rpc failed:", error);

  return NextResponse.json({ ok: true });
}
