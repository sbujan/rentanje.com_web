// Old WooCommerce product slug → new destination. Single source of truth for
// every legacy product URL shape (see productRedirects below). Destinations
// verified against the live production DB; active products map to /najam/:slug,
// inactive/removed ones fall back to their category listing or /paketi so they
// never 404 on /najam/[inactive-slug] (that page calls notFound()).
const PRODUCT_REDIRECTS = [
  ["gopro-hero-10", "/najam/gopro-hero-10-black-kamera-najam"],
  ["plinska-pec-za-pizzu-ooni-16", "/najam/ooni-koda-16-plinska-pec-pizza-najam"],
  ["dji-mavic-mini-2-fly-more", "/najam/dji-mini-2-dron-fly-more-najam"],
  ["jbl-charge-3-prijenosni-zvucnik", "/najam/jbl-charge-3-bluetooth-zvucnik-najam"],
  ["ledomat", "/najam/ledomat-aparat-za-led-najam"],
  ["kotao-od-lijevanog-zeljeza-10-l-sa-stalkom", "/najam/kotao-lijevani-zeljezo-10l-stalak-najam"],
  ["kotao-od-lijevanog-zeljeza-10-l-sa-stalkom-2", "/najam/kotao-lijevani-zeljezo-10l-stalak-najam"],
  ["baklja-za-rostilj", "/najam/rostilj-kuhanje"],
  ["peka-sac", "/najam/rostilj-kuhanje"],
  ["razanj-s-motorom", "/najam/razanj-s-motorom-najam"],
  ["tocionik-za-pivo-6l", "/najam/tocionik-za-pivu-5l-najam"],
  ["firepit-bonfire-2-0", "/najam/solo-stove-bonfire-firepit-najam"],
  ["velika-jenga", "/najam/oprema-za-evente"],
  ["cornhole", "/najam/oprema-za-evente"],
  ["projektor-sa-platnom", "/najam/projektor-s-platnom-najam"],
  ["paviljon-sator-3x3m", "/najam/paviljon-sator-3x3m-najam"],
  ["prenosivi-stol-i-2-klupe-za-8-osoba", "/najam/oprema-za-evente"],
  ["beerpong-stol", "/najam/oprema-za-evente"],
  ["blumfeldt-dark-wave-infrared-grijalica", "/najam/blumfeldt-dark-wave-infracrvena-grijalica-najam"],
  ["jbl-partybox-310", "/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima"],
  ["kulinarski-dozivljaj", "/paketi"],
  ["druzenje-na-otvorenom", "/paketi"],
  ["pizza-party-ooni-pizza-oven", "/paketi"],
  ["sportski-spektakl", "/paketi"],
  ["sator-za-kampiranje-najam", "/najam/sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam"],
  ["jbl-bezicni-mikrofoni", "/najam/audio-video-oprema"],
  ["dji-neo-dron", "/najam/audio-video-oprema"],
  ["stalak-za-kolace", "/najam/oprema-za-evente"],
  ["fujifilm-instax-mini-evo", "/najam/audio-video-oprema"],
];

// Expand each mapping into every legacy URL shape that still appears in GSC:
//   /proizvod/:slug(/)   — Croatian WP path (both slash variants)
//   /product/:slug(/)    — English WP path
//   /?product=:slug      — WP query permalink format
// Next matches redirects in array order, so these specific entries must be
// registered before the /product/* and /?product= catch-alls.
function productRedirects() {
  return PRODUCT_REDIRECTS.flatMap(([old, destination]) => [
    { source: `/proizvod/${old}/`, destination, permanent: true },
    { source: `/proizvod/${old}`, destination, permanent: true },
    { source: `/product/${old}/`, destination, permanent: true },
    { source: `/product/${old}`, destination, permanent: true },
    { source: "/", has: [{ type: "query", key: "product", value: old }], destination, permanent: true },
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
      // Category canonical migration: /oprema?cat=<slug> → /najam/<slug>
      // Captures the cat query string into :slug. Fires before the page function,
      // so it bypasses ISR caching that would otherwise eat in-page redirects.
      {
        source: "/oprema",
        has: [{ type: "query", key: "cat", value: "(?<slug>.+)" }],
        destination: "/najam/:slug",
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
      { source: "/product-category/kamere/",                destination: "/najam/audio-video-oprema", permanent: true },
      { source: "/product-category/dozivljaji/",            destination: "/paketi",                         permanent: true },
      { source: "/product-category/kamping/",               destination: "/najam/kamp-outdoor",        permanent: true },
      { source: "/product-category/proizvodi/",             destination: "/oprema",                         permanent: true },
      { source: "/product-category/proizvodi/page/:n",      destination: "/oprema",                         permanent: true },
      { source: "/product-category/proizvodi/page/:n/",     destination: "/oprema",                         permanent: true },
      { source: "/product-category/kamere",                 destination: "/najam/audio-video-oprema", permanent: true },
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
      { source: "/iskusi",                                          destination: "/",                                                                 permanent: true },
      { source: "/isprobaj-2",                                      destination: "/oprema",                                                           permanent: true },
      { source: "/rent-list",                                       destination: "/oprema",                                                           permanent: true },
      { source: "/rent-grid",                                       destination: "/oprema",                                                           permanent: true },

      // Products — every legacy shape (/proizvod/, /product/, /?product=) for
      // each mapping in PRODUCT_REDIRECTS, generated so slash/no-slash and both
      // path languages stay in sync. Verified against the live production DB.
      ...productRedirects(),

      // Catch-alls for any legacy product URL not explicitly mapped above.
      // MUST come after productRedirects() — Next matches in order, first wins.
      { source: "/product/:slug*", destination: "/oprema", permanent: true },
      { source: "/", has: [{ type: "query", key: "product" }], destination: "/oprema", permanent: true },
    ];
  },
};

export default nextConfig;
