/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "rentanje.com" },
    ],
  },

  // SEO 301 redirects — old WordPress/WooCommerce URLs → new site
  async redirects() {
    return [
      // Pages
      { source: "/basket/",      destination: "/upit",     permanent: true },
      { source: "/checkout/",    destination: "/upit",     permanent: true },
      { source: "/my-account/",  destination: "/",         permanent: true },
      { source: "/home-2/",      destination: "/",         permanent: true },
      { source: "/iskusi/",      destination: "/",         permanent: true },
      { source: "/isprobaj-2/",  destination: "/oprema",   permanent: true },
      { source: "/rent-list/",   destination: "/oprema",   permanent: true },
      { source: "/rent-grid/",   destination: "/oprema",   permanent: true },

      // Products — /proizvod/:slug → /najam/:slug
      {
        source: "/proizvod/gopro-hero-10/",
        destination: "/najam/akcijska-kamera-gopro-hero-10",
        permanent: true,
      },
      {
        source: "/proizvod/plinska-pec-za-pizzu-ooni-16/",
        destination: "/najam/plinska-pec-za-pizzu-ooni-16",
        permanent: true,
      },
      {
        source: "/proizvod/dji-mavic-mini-2-fly-more/",
        destination: "/najam/dji-mavic-mini-2-fly-more",
        permanent: true,
      },
      {
        source: "/proizvod/jbl-charge-3-prijenosni-zvucnik/",
        destination: "/najam/jbl-charge-3-prijenosni-zvucnik",
        permanent: true,
      },
      {
        source: "/proizvod/ledomat/",
        destination: "/najam/ledomat",
        permanent: true,
      },
      {
        source: "/proizvod/kotao-od-lijevanog-zeljeza-10-l-sa-stalkom/",
        destination: "/najam/kotlovina-735cm",
        permanent: true,
      },
      {
        source: "/proizvod/kotao-od-lijevanog-zeljeza-10-l-sa-stalkom-2/",
        destination: "/najam/kotao-od-lijevanog-zeljeza-10-l-sa-stalkom",
        permanent: true,
      },
      {
        source: "/proizvod/baklja-za-rostilj/",
        destination: "/najam/baklja-za-rostilj",
        permanent: true,
      },
      {
        source: "/proizvod/peka-sac/",
        destination: "/najam/pekasac",
        permanent: true,
      },
      {
        source: "/proizvod/razanj-s-motorom/",
        destination: "/najam/prenosivi-razanj-s-motorom",
        permanent: true,
      },
      {
        source: "/proizvod/tocionik-za-pivo-6l/",
        destination: "/najam/tocionik-za-pivo-6l",
        permanent: true,
      },
      {
        source: "/proizvod/firepit-bonfire-2-0/",
        destination: "/najam/firepit-bonfire-20",
        permanent: true,
      },
      {
        source: "/proizvod/velika-jenga/",
        destination: "/najam/velika-jenga",
        permanent: true,
      },
      {
        source: "/proizvod/cornhole/",
        destination: "/najam/cornhole",
        permanent: true,
      },
      {
        source: "/proizvod/projektor-sa-platnom/",
        destination: "/najam/projektor-sa-platnom",
        permanent: true,
      },
      {
        source: "/proizvod/paviljon-sator-3x3m/",
        destination: "/najam/paviljon-sator-3x3m",
        permanent: true,
      },
      {
        source: "/proizvod/prenosivi-stol-i-2-klupe-za-8-osoba/",
        destination: "/najam/prenosivi-stol-i-2-klupe-za-8-osoba",
        permanent: true,
      },
      {
        source: "/proizvod/beerpong-stol/",
        destination: "/najam/beerpong-stol",
        permanent: true,
      },
      {
        source: "/proizvod/blumfeldt-dark-wave-infrared-grijalica/",
        destination: "/najam/blumfeldt-dark-wave-infrared-grijalica",
        permanent: true,
      },
      {
        source: "/proizvod/jbl-partybox-310/",
        destination: "/najam/jbl-partybox-310-box-bluetooth-zvucnik-na-bateriju",
        permanent: true,
      },
      {
        source: "/proizvod/kulinarski-dozivljaj/",
        destination: "/najam/kulinarski-dozivljaj",
        permanent: true,
      },
      {
        source: "/proizvod/druzenje-na-otvorenom/",
        destination: "/najam/druzenje-na-otvorenom",
        permanent: true,
      },
      {
        source: "/proizvod/pizza-party-ooni-pizza-oven/",
        destination: "/najam/pizza-party-ooni-pizza-oven",
        permanent: true,
      },
      {
        source: "/proizvod/sportski-spektakl/",
        destination: "/najam/sportski-spektakl",
        permanent: true,
      },
      {
        source: "/proizvod/sator-za-kampiranje-najam/",
        destination: "/najam/sator-2-zracna-madraca-elektricna-pumpa-najam",
        permanent: true,
      },
      {
        source: "/proizvod/jbl-bezicni-mikrofoni/",
        destination: "/najam/jbl-mikrofoni-bezicni",
        permanent: true,
      },
      {
        source: "/proizvod/dji-neo-dron/",
        destination: "/najam/dji-neo-dron",
        permanent: true,
      },
      {
        source: "/proizvod/stalak-za-kolace/",
        destination: "/najam/stalak-za-kolace",
        permanent: true,
      },
      {
        source: "/proizvod/fujifilm-instax-mini-evo/",
        destination: "/najam/fujifilm-instax-mini-evo",
        permanent: true,
      },

      // Also handle without trailing slash
      { source: "/basket",     destination: "/upit",   permanent: true },
      { source: "/checkout",   destination: "/upit",   permanent: true },
      { source: "/my-account", destination: "/",       permanent: true },
      { source: "/rent-list",  destination: "/oprema", permanent: true },
      { source: "/rent-grid",  destination: "/oprema", permanent: true },
    ];
  },
};

export default nextConfig;
