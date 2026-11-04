/**
 * URLs that answer 410 Gone. None of them ever existed on this site: they are
 * spam URLs Google learned about, in the shapes reported by Search Console.
 *
 *  - /<words>-<5+ digits>: doorway product pages at the root, such as
 *    /For-Beagle-Lovers-Flannel-Blanket-1318349 or /8-quot-Drop-Rise-1394655.
 *  - /shop, /s, /p, /ce, /wishlist, /account, /purchases: paths of a cloned
 *    department store, such as /shop/product/x?ID=1 or /p/credit-service.
 *  - /feed and /proizvod/<slug>/feed: leftovers of the old WordPress feeds.
 *
 * 410 is deliberate. It tells Google the page is permanently gone, so it stops
 * crawling sooner than with a 404. Do not redirect these to the homepage, which
 * Google treats as a soft 404, and do not block them in robots.txt, which would
 * stop Google from ever seeing the 410.
 *
 * Keep in sync with `config.matcher` in src/middleware.ts: Next requires that
 * list to be a literal, so it cannot be built from this module.
 */

const GONE_TREES = ["shop", "s", "p", "ce", "wishlist", "account", "purchases"];

const SPAM_SLUG = /^\/[A-Za-z0-9][A-Za-z0-9-]*-\d{5,}$/;
const WP_PRODUCT_FEED = /^\/proizvod\/[^/]+\/feed$/;

export function isGone(pathname: string): boolean {
  if (GONE_TREES.some((tree) => pathname === `/${tree}` || pathname.startsWith(`/${tree}/`))) {
    return true;
  }
  if (pathname === "/feed" || WP_PRODUCT_FEED.test(pathname)) return true;
  return SPAM_SLUG.test(pathname);
}
