import { PRODUCT_REDIRECTS } from "./src/lib/legacy-redirects.mjs";

// Expand each mapping into every legacy URL shape that still appears in GSC:
//   /proizvod/:slug(/)   — Croatian WP path (both slash variants)
//   /product/:slug(/)    — English WP path
// The /?product=:slug form lives in the middleware, because redirects here would
// carry the query string onto the destination (see src/lib/legacy-redirects.mjs).
// Next matches redirects in array order, so these specific entries must be
// registered before the /product/* catch-all.
function productRedirects() {
  return PRODUCT_REDIRECTS.flatMap(([old, destination]) => [
    { source: `/proizvod/${old}/`, destination, permanent: true },
    { source: `/proizvod/${old}`, destination, permanent: true },
    { source: `/product/${old}/`, destination, permanent: true },
    { source: `/product/${old}`, destination, permanent: true },
  ]);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "rentanje.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // 'unsafe-inline' for scripts is required by the Next.js inline
          // runtime, GA bootstrap and JSON-LD blocks (no nonce infra yet).
          // Still blocks foreign script origins, plugins and frame embedding.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.analytics.google.com",
              // Google Maps embeds on / and /kontakt — without frame-src,
              // iframes fall back to default-src 'self' and get blocked.
              "frame-src https://maps.google.com https://www.google.com",
              "object-src 'none'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Link", value: '<https://rentanje.com/sitemap.xml>; rel="sitemap", <https://rentanje.com/llms.txt>; rel="llms-txt"' },
        ],
      },
    ];
  },

  // SEO 301 redirects — old WordPress/WooCommerce URLs → new site
  async redirects() {
    return [
      // One host only. www served a full copy of the site with a 200, so Google
      // could crawl and report every URL twice.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rentanje.com" }],
        destination: "https://rentanje.com/:path*",
        permanent: true,
      },

      // Pages
      { source: "/basket/",      destination: "/upit",     permanent: true },
      { source: "/checkout/",    destination: "/upit",     permanent: true },
      { source: "/my-account/",  destination: "/",         permanent: true },
      { source: "/home-2/",      destination: "/",         permanent: true },
      { source: "/iskusi/",      destination: "/",         permanent: true },
      { source: "/isprobaj-2/",  destination: "/oprema",   permanent: true },
      { source: "/rent-list/",   destination: "/oprema",   permanent: true },
      { source: "/rent-grid/",   destination: "/oprema",   permanent: true },

      // Old WP categories — semantic mapping to new structure
      { source: "/product-category/kamere/",                destination: "/najam/kamere-i-dronovi", permanent: true },
      { source: "/product-category/dozivljaji/",            destination: "/paketi",                         permanent: true },
      { source: "/product-category/kamping/",               destination: "/najam/kamp-outdoor",        permanent: true },
      { source: "/product-category/proizvodi/",             destination: "/oprema",                         permanent: true },
      { source: "/product-category/proizvodi/page/:n",      destination: "/oprema",                         permanent: true },
      { source: "/product-category/proizvodi/page/:n/",     destination: "/oprema",                         permanent: true },
      { source: "/product-category/kamere",                 destination: "/najam/kamere-i-dronovi", permanent: true },
      { source: "/product-category/dozivljaji",             destination: "/paketi",                         permanent: true },
      { source: "/product-category/kamping",                destination: "/najam/kamp-outdoor",        permanent: true },
      { source: "/product-category/proizvodi",              destination: "/oprema",                         permanent: true },

      // Also handle without trailing slash — Vercel/Next strips trailing slash
      // before redirect matching, so a no-slash variant is required for the
      // 308 to fire in a single hop instead of resolving to a 404.
      { source: "/basket",                                          destination: "/upit",                                                             permanent: true },
      { source: "/checkout",                                        destination: "/upit",                                                             permanent: true },
      { source: "/my-account",                                      destination: "/",                                                                 permanent: true },
      { source: "/home-2",                                          destination: "/",                                                                 permanent: true },
      { source: "/home",                                            destination: "/",                                                                 permanent: true },
      { source: "/iskusi",                                          destination: "/",                                                                 permanent: true },
      { source: "/isprobaj-2",                                      destination: "/oprema",                                                           permanent: true },
      { source: "/rent-list",                                       destination: "/oprema",                                                           permanent: true },
      { source: "/rent-grid",                                       destination: "/oprema",                                                           permanent: true },

      // Products — every legacy path shape (/proizvod/, /product/) for
      // each mapping in PRODUCT_REDIRECTS, generated so slash/no-slash and both
      // path languages stay in sync. Verified against the live production DB.
      ...productRedirects(),

      // Catch-alls for any legacy product URL not explicitly mapped above.
      // MUST come after productRedirects() — Next matches in order, first wins.
      { source: "/product/:slug*", destination: "/oprema", permanent: true },
    ];
  },
};

export default nextConfig;
