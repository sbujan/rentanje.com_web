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
  const { data, error } = await supabase
    .from("products")
    .select("view_count")
    .eq("id", productId)
    .single();

  // Fire-and-forget beacon: log failures but always 200 so the client
  // doesn't retry or surface analytics noise to the user.
  if (error) {
    if (error.code !== "PGRST116") {
      console.error("track-view select failed:", error);
    }
  } else if (data) {
    const { error: updateErr } = await supabase
      .from("products")
      .update({ view_count: (data.view_count ?? 0) + 1 })
      .eq("id", productId);
    if (updateErr) console.error("track-view update failed:", updateErr);
  }

  return NextResponse.json({ ok: true });
}
