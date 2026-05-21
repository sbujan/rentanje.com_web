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
      { source: "/product-category/kamere/",                destination: "/oprema?cat=audio-video-oprema", permanent: true },
      { source: "/product-category/dozivljaji/",            destination: "/paketi",                         permanent: true },
      { source: "/product-category/kamping/",               destination: "/oprema?cat=kamp-outdoor",        permanent: true },
      { source: "/product-category/proizvodi/",             destination: "/oprema",                         permanent: true },
      { source: "/product-category/proizvodi/page/:n",      destination: "/oprema",                         permanent: true },
      { source: "/product-category/proizvodi/page/:n/",     destination: "/oprema",                         permanent: true },
      { source: "/product-category/kamere",                 destination: "/oprema?cat=audio-video-oprema", permanent: true },
      { source: "/product-category/dozivljaji",             destination: "/paketi",                         permanent: true },
      { source: "/product-category/kamping",                destination: "/oprema?cat=kamp-outdoor",        permanent: true },
      { source: "/product-category/proizvodi",              destination: "/oprema",                         permanent: true },

      // Products — /proizvod/:old → /najam/:new (or /oprema?cat=... when product is inactive)
      // Destinations verified against live production DB on 2026-05-08.
      // Active products map directly; inactive products send users to their category
      // listing instead of 404-ing on /najam/[inactive-slug] (page calls notFound()).
      { source: "/proizvod/gopro-hero-10/",                          destination: "/najam/gopro-hero-10-black-kamera-najam",                           permanent: true },
      { source: "/proizvod/plinska-pec-za-pizzu-ooni-16/",           destination: "/najam/ooni-koda-16-plinska-pec-pizza-najam",                       permanent: true },
      { source: "/proizvod/dji-mavic-mini-2-fly-more/",              destination: "/najam/dji-mini-2-dron-fly-more-najam",                             permanent: true },
      { source: "/proizvod/jbl-charge-3-prijenosni-zvucnik/",        destination: "/najam/jbl-charge-3-bluetooth-zvucnik-najam",                       permanent: true },
      { source: "/proizvod/ledomat/",                                destination: "/najam/ledomat-aparat-za-led-najam",                                permanent: true },
      { source: "/proizvod/kotao-od-lijevanog-zeljeza-10-l-sa-stalkom/",   destination: "/najam/kotao-lijevani-zeljezo-10l-stalak-najam",              permanent: true },
      { source: "/proizvod/kotao-od-lijevanog-zeljeza-10-l-sa-stalkom-2/", destination: "/najam/kotao-lijevani-zeljezo-10l-stalak-najam",              permanent: true },
      // baklja-za-rostilj — DB ima inactive plamenik-torch-za-hranu-najam, šaljemo na kategoriju
      { source: "/proizvod/baklja-za-rostilj/",                      destination: "/oprema?cat=rostilj-kuhanje",                                       permanent: true },
      // peka-sac — DB ima inactive peka-tradicionalna-najam
      { source: "/proizvod/peka-sac/",                               destination: "/oprema?cat=rostilj-kuhanje",                                       permanent: true },
      { source: "/proizvod/razanj-s-motorom/",                       destination: "/najam/razanj-s-motorom-najam",                                     permanent: true },
      // CSV ima 6L, DB ima samo 5L variantu — najbliži match
      { source: "/proizvod/tocionik-za-pivo-6l/",                    destination: "/najam/tocionik-za-pivu-5l-najam",                                  permanent: true },
      { source: "/proizvod/firepit-bonfire-2-0/",                    destination: "/najam/solo-stove-bonfire-firepit-najam",                           permanent: true },
      // velika-jenga — DB inactive velika-jenga-giant-jenga-igra-najam
      { source: "/proizvod/velika-jenga/",                           destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      // cornhole — DB inactive cornhole-igra-najam
      { source: "/proizvod/cornhole/",                               destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      { source: "/proizvod/projektor-sa-platnom/",                   destination: "/najam/projektor-s-platnom-najam",                                  permanent: true },
      { source: "/proizvod/paviljon-sator-3x3m/",                    destination: "/najam/paviljon-sator-3x3m-najam",                                  permanent: true },
      // prenosivi-stol — DB inactive prijenosni-ratan-stol-klupe-8-osoba-najam
      { source: "/proizvod/prenosivi-stol-i-2-klupe-za-8-osoba/",    destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      // beerpong — DB inactive beer-pong-stol-case-najam
      { source: "/proizvod/beerpong-stol/",                          destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      { source: "/proizvod/blumfeldt-dark-wave-infrared-grijalica/", destination: "/najam/blumfeldt-dark-wave-infracrvena-grijalica-najam",            permanent: true },
      // 310 više ne postoji, DB ima Stage 320 model
      { source: "/proizvod/jbl-partybox-310/",                       destination: "/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima", permanent: true },
      // Stari WP landing pages → /paketi (bundles)
      { source: "/proizvod/kulinarski-dozivljaj/",                   destination: "/paketi",                                                           permanent: true },
      { source: "/proizvod/druzenje-na-otvorenom/",                  destination: "/paketi",                                                           permanent: true },
      { source: "/proizvod/pizza-party-ooni-pizza-oven/",            destination: "/paketi",                                                           permanent: true },
      { source: "/proizvod/sportski-spektakl/",                      destination: "/paketi",                                                           permanent: true },
      { source: "/proizvod/sator-za-kampiranje-najam/",              destination: "/najam/sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam",         permanent: true },
      // jbl-bezicni-mikrofoni — DB inactive jbl-bezicni-mikrofoni-par-najam
      { source: "/proizvod/jbl-bezicni-mikrofoni/",                  destination: "/oprema?cat=audio-video-oprema",                                    permanent: true },
      // dji-neo-dron — DB inactive dji-neo-motion-fly-more-combo-najam (bez category u DB-u, semantički)
      { source: "/proizvod/dji-neo-dron/",                           destination: "/oprema?cat=audio-video-oprema",                                    permanent: true },
      // stalak-za-kolace — nema u DB-u uopće, najbliža semantička kategorija
      { source: "/proizvod/stalak-za-kolace/",                       destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      // fujifilm — DB inactive fujifilm-instax-mini-evo-najam (bez category u DB-u, semantički)
      { source: "/proizvod/fujifilm-instax-mini-evo/",               destination: "/oprema?cat=audio-video-oprema",                                    permanent: true },

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
      { source: "/proizvod/gopro-hero-10",                          destination: "/najam/gopro-hero-10-black-kamera-najam",                           permanent: true },
      { source: "/proizvod/plinska-pec-za-pizzu-ooni-16",           destination: "/najam/ooni-koda-16-plinska-pec-pizza-najam",                       permanent: true },
      { source: "/proizvod/dji-mavic-mini-2-fly-more",              destination: "/najam/dji-mini-2-dron-fly-more-najam",                             permanent: true },
      { source: "/proizvod/jbl-charge-3-prijenosni-zvucnik",        destination: "/najam/jbl-charge-3-bluetooth-zvucnik-najam",                       permanent: true },
      { source: "/proizvod/ledomat",                                destination: "/najam/ledomat-aparat-za-led-najam",                                permanent: true },
      { source: "/proizvod/kotao-od-lijevanog-zeljeza-10-l-sa-stalkom",   destination: "/najam/kotao-lijevani-zeljezo-10l-stalak-najam",              permanent: true },
      { source: "/proizvod/kotao-od-lijevanog-zeljeza-10-l-sa-stalkom-2", destination: "/najam/kotao-lijevani-zeljezo-10l-stalak-najam",              permanent: true },
      { source: "/proizvod/baklja-za-rostilj",                      destination: "/oprema?cat=rostilj-kuhanje",                                       permanent: true },
      { source: "/proizvod/peka-sac",                               destination: "/oprema?cat=rostilj-kuhanje",                                       permanent: true },
      { source: "/proizvod/razanj-s-motorom",                       destination: "/najam/razanj-s-motorom-najam",                                     permanent: true },
      { source: "/proizvod/tocionik-za-pivo-6l",                    destination: "/najam/tocionik-za-pivu-5l-najam",                                  permanent: true },
      { source: "/proizvod/firepit-bonfire-2-0",                    destination: "/najam/solo-stove-bonfire-firepit-najam",                           permanent: true },
      { source: "/proizvod/velika-jenga",                           destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      { source: "/proizvod/cornhole",                               destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      { source: "/proizvod/projektor-sa-platnom",                   destination: "/najam/projektor-s-platnom-najam",                                  permanent: true },
      { source: "/proizvod/paviljon-sator-3x3m",                    destination: "/najam/paviljon-sator-3x3m-najam",                                  permanent: true },
      { source: "/proizvod/prenosivi-stol-i-2-klupe-za-8-osoba",    destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      { source: "/proizvod/beerpong-stol",                          destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      { source: "/proizvod/blumfeldt-dark-wave-infrared-grijalica", destination: "/najam/blumfeldt-dark-wave-infracrvena-grijalica-najam",            permanent: true },
      { source: "/proizvod/jbl-partybox-310",                       destination: "/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima", permanent: true },
      { source: "/proizvod/kulinarski-dozivljaj",                   destination: "/paketi",                                                           permanent: true },
      { source: "/proizvod/druzenje-na-otvorenom",                  destination: "/paketi",                                                           permanent: true },
      { source: "/proizvod/pizza-party-ooni-pizza-oven",            destination: "/paketi",                                                           permanent: true },
      { source: "/proizvod/sportski-spektakl",                      destination: "/paketi",                                                           permanent: true },
      { source: "/proizvod/sator-za-kampiranje-najam",              destination: "/najam/sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam",         permanent: true },
      { source: "/proizvod/jbl-bezicni-mikrofoni",                  destination: "/oprema?cat=audio-video-oprema",                                    permanent: true },
      { source: "/proizvod/dji-neo-dron",                           destination: "/oprema?cat=audio-video-oprema",                                    permanent: true },
      { source: "/proizvod/stalak-za-kolace",                       destination: "/oprema?cat=oprema-za-evente",                                      permanent: true },
      { source: "/proizvod/fujifilm-instax-mini-evo",               destination: "/oprema?cat=audio-video-oprema",                                    permanent: true },
    ];
  },
};

export default nextConfig;
