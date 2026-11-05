// Old WooCommerce product slug → new destination. Single source of truth for
// every legacy product URL shape: next.config.mjs handles the paths, and the
// middleware handles the query forms below. Destinations verified against the
// live production DB (2026-10-30). Active products map to /najam/:slug so the old
// URL's equity lands on the product, not a listing; removed ones fall back to
// their category or /paketi. A product deactivated later is still safe:
// /najam/[inactive-slug] 308s to its category.
//
// Plain .mjs because next.config.mjs imports it too.
export const PRODUCT_REDIRECTS = [
  ["gopro-hero-10", "/najam/gopro-hero-10-black-kamera-najam"],
  ["plinska-pec-za-pizzu-ooni-16", "/najam/ooni-koda-16-plinska-pec-pizza-najam"],
  ["dji-mavic-mini-2-fly-more", "/najam/dji-mini-2-dron-fly-more-najam"],
  ["jbl-charge-3-prijenosni-zvucnik", "/najam/jbl-charge-3-bluetooth-zvucnik-najam"],
  ["ledomat", "/najam/ledomat-aparat-za-led-najam"],
  ["kotao-od-lijevanog-zeljeza-10-l-sa-stalkom", "/najam/kotao-lijevani-zeljezo-10l-stalak-najam"],
  ["kotao-od-lijevanog-zeljeza-10-l-sa-stalkom-2", "/najam/kotao-lijevani-zeljezo-10l-stalak-najam"],
  ["baklja-za-rostilj", "/najam/rostilj-kuhanje"],
  ["peka-sac", "/najam/peka-tradicionalna-najam"],
  ["razanj-s-motorom", "/najam/razanj-s-motorom-najam"],
  ["tocionik-za-pivo-6l", "/najam/tocionik-za-pivu-5l-najam"],
  ["firepit-bonfire-2-0", "/najam/solo-stove-bonfire-firepit-najam"],
  ["velika-jenga", "/najam/velika-jenga-giant-jenga-igra-najam"],
  ["cornhole", "/najam/cornhole-igra-najam"],
  ["projektor-sa-platnom", "/najam/projektor-s-platnom-najam"],
  ["paviljon-sator-3x3m", "/najam/paviljon-sator-3x3m-najam"],
  ["prenosivi-stol-i-2-klupe-za-8-osoba", "/najam/prijenosni-ratan-stol-klupe-8-osoba-najam"],
  ["beerpong-stol", "/najam/beer-pong-stol-case-najam"],
  ["blumfeldt-dark-wave-infrared-grijalica", "/najam/blumfeldt-dark-wave-infracrvena-grijalica-najam"],
  ["jbl-partybox-310", "/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima"],
  ["kulinarski-dozivljaj", "/paketi"],
  ["druzenje-na-otvorenom", "/paketi"],
  ["pizza-party-ooni-pizza-oven", "/paketi"],
  ["sportski-spektakl", "/paketi"],
  ["sator-za-kampiranje-najam", "/najam/sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam"],
  ["jbl-bezicni-mikrofoni", "/najam/jbl-bezicni-mikrofoni-par-najam"],
  ["dji-neo-dron", "/najam/dji-neo-motion-fly-more-combo-najam"],
  ["stalak-za-kolace", "/najam/oprema-za-evente"],
  ["fujifilm-instax-mini-evo", "/najam/fujifilm-instax-mini-evo-najam"],
];

const DESTINATION_BY_OLD_SLUG = new Map(PRODUCT_REDIRECTS);
const CATEGORY_SLUG = /^[a-z0-9-]+$/;

/**
 * Where a URL using a legacy query parameter should go, or null if it is clean.
 *
 * Redirects in next.config.mjs always pass the query string through, so
 * /?product=jbl-partybox-310 used to land on the product page with
 * ?product=jbl-partybox-310 still attached, and Google reported the best-selling
 * speaker only under that address. These run in the middleware instead, where
 * the parameter can be dropped.
 *
 * @param {string} pathname
 * @param {URLSearchParams} searchParams
 * @returns {{ pathname: string, drop: string[] } | null}
 */
export function legacyQueryRedirect(pathname, searchParams) {
  const product = searchParams.get("product");
  const cat = searchParams.get("cat");

  if (pathname === "/" && product !== null) {
    return { pathname: DESTINATION_BY_OLD_SLUG.get(product) ?? "/oprema", drop: ["product"] };
  }
  if (pathname === "/oprema" && cat !== null) {
    return {
      pathname: CATEGORY_SLUG.test(cat) ? `/najam/${cat}` : "/oprema",
      drop: ["cat", "product"],
    };
  }
  // Addresses Google already learned from the old redirects.
  if (product !== null && (pathname === "/oprema" || pathname.startsWith("/najam/"))) {
    return { pathname, drop: ["product"] };
  }
  return null;
}
