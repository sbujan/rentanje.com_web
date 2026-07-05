import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Legacy WooCommerce/WordPress spam URLs still indexed in GSC (uppercase-leading,
// long, digit-suffixed slugs such as /Troy-Bilt-...-1048298) plus the old /shop/*
// tree. They currently 404; returning 410 Gone tells Google the resources are
// permanently removed and speeds up deindexing. Live routes are lowercase and
// live under /najam, /oprema, /blog etc., so this never matches a real page.
const SPAM_SLUG = /^\/[A-Z][A-Za-z0-9-]*-\d{5,}$/;

function isGone(pathname: string): boolean {
  return pathname.startsWith("/shop/") || pathname === "/shop" || SPAM_SLUG.test(pathname);
}

export async function middleware(request: NextRequest) {
  // Early-return BEFORE creating the Supabase client so no auth/cookie work
  // runs for these junk paths.
  if (isGone(request.nextUrl.pathname)) {
    return new Response("Gone", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return copyCookies(supabaseResponse, NextResponse.redirect(url));
  }

  // Redirect logged-in users away from /admin/login
  if (pathname === "/admin/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return copyCookies(supabaseResponse, NextResponse.redirect(url));
  }

  return supabaseResponse;
}

// Required by @supabase/ssr: any NextResponse you return must carry the
// auth cookies that getUser() may have refreshed, otherwise the session is lost.
function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value, cookie);
  });
  return to;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/shop/:path*",
    // Uppercase-leading slug ending in 5+ digits (spam). Uses explicit \d\d\d\d\d+
    // instead of \d{5,} to avoid path-to-regexp's brace parsing; the precise
    // \d{5,} check lives in isGone(). Middleware still early-returns for these.
    "/:slug([A-Z][A-Za-z0-9\\-]*\\-\\d\\d\\d\\d\\d+)",
  ],
};
