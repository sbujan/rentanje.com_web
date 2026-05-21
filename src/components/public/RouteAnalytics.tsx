"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/gtag";

// Fires a GA4 `page_view` on every client-side route change. Next.js App Router
// navigates without a full reload, so `gtag('config')` only ever sends the very
// first page_view — without this, in-site navigation goes untracked.
export default function RouteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // The initial page_view is already sent by gtag('config') in layout.tsx.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPageView();
  }, [pathname, searchParams]);

  return null;
}
