import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isGone } from "@/lib/gone-urls";
import { legacyQueryRedirect } from "@/lib/legacy-redirects.mjs";

export async function middleware(request: NextRequest) {
  // Early-return BEFORE creating the Supabase client so no auth/cookie work
  // runs for these junk paths.
  if (isGone(request.nextUrl.pathname)) {
    return new Response("Gone", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const legacy = legacyQueryRedirect(request.nextUrl.pathname, request.nextUrl.searchParams);
  if (legacy) {
    const url = request.nextUrl.clone();
    url.pathname = legacy.pathname;
    legacy.drop.forEach((key) => url.searchParams.delete(key));
    return NextResponse.redirect(url, 308);
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
    // Spam paths answered with 410 by isGone() in src/lib/gone-urls.ts. Keep in
    // sync with that module: Next requires this list to be a literal.
    "/shop/:path*",
    "/s/:path*",
    "/p/:path*",
    "/ce/:path*",
    "/wishlist/:path*",
    "/account/:path*",
    "/purchases/:path*",
    "/feed",
    "/proizvod/:slug/feed",
    // Root-level slug ending in 5+ digits. Uses explicit \d\d\d\d\d+ instead of
    // \d{5,} to avoid path-to-regexp's brace parsing.
    "/:slug([A-Za-z0-9][A-Za-z0-9\\-]*\\-\\d\\d\\d\\d\\d+)",
    // Legacy query URLs, handled by legacyQueryRedirect(). The `has` condition
    // keeps the homepage and catalogue out of the middleware otherwise.
    { source: "/", has: [{ type: "query", key: "product" }] },
    { source: "/oprema", has: [{ type: "query", key: "product" }] },
    { source: "/oprema", has: [{ type: "query", key: "cat" }] },
    // Explicit pattern: a bare :slug combined with `has` compiles to a regexp that
    // never matches a slug.
    { source: "/najam/:slug([a-zA-Z0-9\\-]+)", has: [{ type: "query", key: "product" }] },
  ],
};
