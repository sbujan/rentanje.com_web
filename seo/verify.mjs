// WP5 — post-deploy SEO verification. Checks redirects (one hop), 410s, the
// sitemap, and titles/canonicals of key pages. Redirects + 410 come from
// next.config.mjs / middleware, so run this against a DEPLOYED build:
//
//   node seo/verify.mjs                       # against https://rentanje.com
//   node seo/verify.mjs http://localhost:3000 # after: npm run build && npm start
//
// Exits 1 if any check fails.

const BASE = (process.argv[2] || "https://rentanje.com").replace(/\/$/, "");
let pass = 0, fail = 0;
const ok = (m) => { pass++; console.log(`  ✓ ${m}`); };
const no = (m) => { fail++; console.log(`  ✗ ${m}`); };

const path = (loc) => { try { return new URL(loc, BASE).pathname; } catch { return loc?.split("?")[0]; } };

// Follow the full redirect chain manually (max ~6 hops). Assert: every hop is a
// permanent redirect (301/308), the chain ends 200 at `dest`'s path. Pass on
// ≤2 hops; fail on 3+ so the report flags avoidable extra hops. Trailing-slash
// legacy URLs are inherently 2-hop — Next strips the slash before our redirect.
async function redirect(from, dest) {
  try {
    let url = BASE + from, hops = 0, permanent = true;
    const seen = [];
    while (hops < 6) {
      const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "rentanje-seo-verify" } });
      if (res.status >= 300 && res.status < 400) {
        if (res.status !== 301 && res.status !== 308) permanent = false;
        const loc = res.headers.get("location") ?? "";
        seen.push(`${res.status}→${loc}`);
        url = new URL(loc, url).toString();
        hops++;
        continue;
      }
      const finalPathOk = path(url) === dest.split("?")[0];
      if (res.status === 200 && finalPathOk && permanent && hops <= 2) {
        ok(`${from} → ${path(url)} [${hops} hop${hops === 1 ? "" : "s"}]`);
      } else if (!finalPathOk) {
        no(`${from} → ended at ${path(url)} (HTTP ${res.status}), expected ${dest.split("?")[0]}`);
      } else if (!permanent) {
        no(`${from} → reached ${path(url)} via a non-permanent redirect: ${seen.join("  ")}`);
      } else if (hops > 2) {
        no(`${from} → reaches ${path(url)} but in ${hops} hops (>2): ${seen.join("  ")}`);
      } else {
        no(`${from} → HTTP ${res.status} at ${path(url)}`);
      }
      return;
    }
    no(`${from} → too many redirects: ${seen.join("  ")}`);
  } catch (e) { no(`${from} → error ${e.message}`); }
}

async function gone(from) {
  try {
    const res = await fetch(BASE + from, { redirect: "manual", headers: { "user-agent": "rentanje-seo-verify" } });
    if (res.status === 410) ok(`410 ${from}`);
    else no(`${from} → got ${res.status}, expected 410`);
  } catch (e) { no(`${from} → error ${e.message}`); }
}

async function page(p, { titleIncludes, canonical } = {}) {
  try {
    const res = await fetch(BASE + p, { headers: { "user-agent": "rentanje-seo-verify" } });
    const html = await res.text();
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] ?? "";
    const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1] ?? "";
    if (res.status !== 200) return no(`${p} → HTTP ${res.status}`);
    let good = true;
    if (titleIncludes && !title.includes(titleIncludes)) { good = false; no(`${p} title "${title}" missing "${titleIncludes}"`); }
    const brandCount = (title.match(/rentanje\.com/gi) || []).length;
    if (brandCount > 1) { good = false; no(`${p} title has brand ${brandCount}× (double-suffix): "${title}"`); }
    // Compare canonicals ignoring a trailing slash — Next renders the homepage
    // canonical as https://rentanje.com (no slash), which Google treats as "/".
    const norm = (u) => u.replace(/\/$/, "");
    if (canonical && norm(canon) !== norm(canonical)) { good = false; no(`${p} canonical "${canon}" ≠ "${canonical}"`); }
    if (good) ok(`${p} · title "${title}" · canonical ${canon || "(none)"}`);
  } catch (e) { no(`${p} → error ${e.message}`); }
}

console.log(`\nBASE = ${BASE}\n\n== Redirects (full chain, ≤2 hops) ==`);
await redirect("/proizvod/gopro-hero-10", "/najam/gopro-hero-10-black-kamera-najam");
await redirect("/product/gopro-hero-10/", "/najam/gopro-hero-10-black-kamera-najam");
await redirect("/?product=plinska-pec-za-pizzu-ooni-16", "/najam/ooni-koda-16-plinska-pec-pizza-najam");
await redirect("/?product=paviljon-sator-3x3m", "/najam/paviljon-sator-3x3m-najam");
await redirect("/proizvod/jbl-partybox-310", "/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima");
await redirect("/product/stalak-za-kolace/", "/najam/oprema-za-evente");
await redirect("/proizvod/ledomat/", "/najam/ledomat-aparat-za-led-najam");
await redirect("/proizvod/dji-mavic-mini-2-fly-more", "/najam/dji-mini-2-dron-fly-more-najam");
await redirect("/proizvod/cornhole", "/najam/oprema-za-evente");
await redirect("/product-category/kamere/", "/najam/audio-video-oprema");
await redirect("/oprema?cat=rostilj-kuhanje", "/najam/rostilj-kuhanje");
await redirect("/basket", "/upit");
await redirect("/home-2", "/");
await redirect("/product/nepostojeci-slug-xyz", "/oprema");   // catch-all
await redirect("/?product=nepostojeci-slug-xyz", "/oprema");  // catch-all

console.log("\n== 410 Gone (spam) ==");
await gone("/shop/brands/ricardo?id=40107");
await gone("/Troy-Bilt-Tiller-Parts-Troybilt-Tiller-Parts-946-04626-Forward-1048298");
await gone("/Ramp-Kalolary-Litter-Box-Ramp-Cat-Steps-Stair-For-Litter-Box-1262321");

console.log("\n== Sitemap ==");
try {
  const res = await fetch(BASE + "/sitemap.xml", { headers: { "user-agent": "rentanje-seo-verify" } });
  const body = await res.text();
  if (res.status === 200 && body.includes("<urlset")) ok(`/sitemap.xml 200, ${(body.match(/<url>/g) || []).length} urls`);
  else no(`/sitemap.xml → ${res.status}`);
} catch (e) { no(`/sitemap.xml → ${e.message}`); }

console.log("\n== Key pages (title + canonical) ==");
await page("/", { titleIncludes: "Najam opreme u Zagrebu", canonical: "https://rentanje.com/" });
await page("/oprema", { canonical: "https://rentanje.com/oprema" });
await page("/paketi", { titleIncludes: "Paketi opreme za najam" });
await page("/najam/gopro-hero-10-black-kamera-najam", { canonical: "https://rentanje.com/najam/gopro-hero-10-black-kamera-najam" });
await page("/najam/oprema-za-evente", { canonical: "https://rentanje.com/najam/oprema-za-evente" });

console.log(`\n${fail === 0 ? "ALL PASSED" : "FAILURES PRESENT"} — ${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
