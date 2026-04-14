import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const schema = z.object({ productId: z.string().uuid() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 422 });

  const { productId } = parsed.data;
  const supabase = createAdminClient();

  // Fetch current count then increment (atomic enough for analytics)
  const { data } = await supabase
    .from("products")
    .select("view_count")
    .eq("id", productId)
    .single();

  if (data) {
    await supabase
      .from("products")
      .update({ view_count: (data.view_count ?? 0) + 1 })
      .eq("id", productId);
  }

  return NextResponse.json({ ok: true });
}
