import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Extract the caller's IP from request headers. Falls back to "unknown"
 * so rate limiting still applies (all unknown IPs share one bucket).
 *
 * Order matters for spoof resistance:
 *  - `x-real-ip` is set by Vercel's edge and cannot be forged by the client.
 *  - In `x-forwarded-for`, the LEFTMOST entry is client-supplied (trivially
 *    spoofable to rotate rate-limit buckets); the RIGHTMOST entry is the one
 *    appended by the closest trusted proxy, so use that as the fallback.
 */
export function getRequestIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",");
    const rightmost = parts[parts.length - 1]?.trim();
    if (rightmost) return rightmost;
  }
  return "unknown";
}

export interface RateLimitOptions {
  /** Stable key for the endpoint (e.g. "contact", "inquiry"). */
  endpoint: string;
  /** Window length in seconds. */
  windowSeconds: number;
  /** Max hits permitted inside the window. */
  max: number;
}

/**
 * Atomically: count prior hits from this IP in the window, record a new
 * hit, and return whether the request is now over the limit. Durable
 * across serverless restarts and Vercel instances because the state
 * lives in Supabase.
 */
export async function checkRateLimit(
  ip: string,
  { endpoint, windowSeconds, max }: RateLimitOptions
): Promise<{ limited: boolean; priorHits: number }> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("record_rate_limit_hit", {
      p_ip: ip,
      p_endpoint: endpoint,
      p_window_s: windowSeconds,
    });
    if (error) {
      // Deliberately fail open: if the DB is unreachable, let the request
      // through rather than lock users out of the contact/inquiry forms.
      // Availability of the booking flow beats rate-limit strictness here.
      console.error("rate-limit rpc error:", error);
      return { limited: false, priorHits: 0 };
    }
    // Opportunistic housekeeping: on ~1% of successful checks, prune hits
    // older than a day. Fire-and-forget — never awaited in the hot path.
    if (Math.random() < 0.01) {
      Promise.resolve(supabase.rpc("prune_rate_limit_hits"))
        .then(({ error: pruneError }) => {
          if (pruneError) console.error("rate-limit prune error:", pruneError);
        })
        .catch((err) => console.error("rate-limit prune error:", err));
    }

    const priorHits = typeof data === "number" ? data : 0;
    return { limited: priorHits >= max, priorHits };
  } catch (err) {
    console.error("rate-limit exception:", err);
    return { limited: false, priorHits: 0 };
  }
}
