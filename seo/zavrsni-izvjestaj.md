# Tehnički SEO plan — završni izvještaj

Provedeni radni paketi iz `public/rentanje-tech-seo-plan.md`. Branch: `seo/tech-plan`.
Build, typecheck, lint i testovi (42) prolaze.

## Što je promijenjeno (kod)

### WP1 — Redirect rupe (`next.config.mjs`)
- Sve mapiranje starih proizvoda izvučeno u konstantu `PRODUCT_REDIRECTS` (29 unosa, single source of truth); `productRedirects()` generira **5 varijanti** po unosu:
  `/proizvod/:slug` i `/proizvod/:slug/`, **novo** `/product/:slug` i `/product/:slug/`, **novo** `/?product=:slug`.
- **Novi catch-all** (nakon specifičnih): `/product/:slug*` → `/oprema` i `/?product=<bilo što>` → `/oprema`.
- Pokriva GSC promet koji je dosad padao na 404/naslovnicu: `/?product=plinska-pec-za-pizzu-ooni-16` (24 klika), `/?product=paviljon-sator-3x3m`, `/?product=jbl-partybox-310`, `/product/gopro-hero-10/`, `/product/stalak-za-kolace/`.
- Ukupno 174 redirecta (89 novih product/query unosa). Destinacije provjerene protiv žive baze.
- **Napomena:** za `/?product=` Next prosljeđuje query na odredište (npr. `/najam/...?product=...`). Redirect je i dalje jedan hop na 200 stranicu, a canonical konsolidira URL — funkcionalno ispravno, samo kozmetički.
- **WP1c (`/najam/:slug?cat=`) SVJESNO PRESKOČEN:** `CategoryPage.tsx` ne koristi `cat` param, canonical već dedupe-a te URL-ove, a redirect koji skida query u Next-u riskira petlju (Next re-append-a nepotrošeni query). Higijena bez dodane vrijednosti.

### WP2 — 410 Gone za spam (`src/middleware.ts`)
- Early-return **410** za `/shop/*` i uzorak `^/[A-Z][A-Za-z0-9-]*-\d{5,}$` (npr. `/Troy-Bilt-...-1048298`), **prije** kreiranja Supabase klijenta → nema auth troška.
- Matcher proširen s `/shop/:path*` i regex rutom (koristi `\d\d\d\d\d+` umjesto `\d{5,}` da izbjegne path-to-regexp brace parsing; precizna `\d{5,}` provjera je u `isGone()`). Žive rute su lowercase → nikad se ne poklapaju.

### WP3 — Title/meta CTR
- **Naslovnica** (`page.tsx`): title → `Najam opreme u Zagrebu — kamere, kamp, event | rentanje.com` (+ og/twitter).
- **/paketi** (`paketi/page.tsx`): title → `Paketi opreme za najam — event, roštilj, kamp` (template dodaje brand).
- **Product fallback** (`najam/[slug]/page.tsx` `generateMetadata`): dohvaća cjenovna polja i gradi `Najam {name} — od {rate} €/dan` (živa cijena preko `effectiveDailyRate`) + description s cijenom/dostavom/CTA. Ekstrahirano u testabilni `productTitleField()` (`src/lib/seo.ts`).
- **Dupli brend riješen:** template dodaje `| rentanje.com` točno jednom; fallback je brand-free, `cleanSeoTitle` skida brand s DB `seo_title`. Pokriveno testovima u `src/lib/__tests__/seo.test.ts` (invarijanta "brend točno jednom").
- **H1 provjereno:** jedan H1 po stranici (ProductPage direktno, CategoryPage/paketi preko `PageHero`).
- DB `seo_title` izmjene → `seo/wp3-seo-title-update.sql` (vlasnik pokreće, vidi dolje).

### WP4 — Interno linkanje
- **Orphan fix:** 26 od 49 aktivnih proizvoda nije imalo nijednu ručnu `product_relations` vezu → stranica bez "Povezani proizvodi". Dodano popunjavanje iz **iste kategorije** (isključuje sebe i već povezane, do 4 stavke) u `najam/[slug]/page.tsx`. Sad svaka stranica linka na sličnu opremu.
- Blog "Povezana oprema": tekst članaka je u Supabase (`blog_posts`), ne u repou — nije dio ovog PR-a; kandidat za zaseban zadatak (tag-based mapiranje).

### WP5 — Verifikacija
- `seo/verify.mjs` — pokreni nakon deploya: `node seo/verify.mjs https://rentanje.com`. Provjerava 15 redirecta (jedan hop), 3 × 410, sitemap, te title+canonical 5 ključnih stranica (i hvata dupli brend). Exit 1 na bilo koji fail.

---

## RUČNE RADNJE ZA VLASNIKA

1. **Supabase SQL editor:** pregledaj i pokreni `seo/wp3-seo-title-update.sql` (3 proizvoda + 1 kategorija). ⚠ Cijene su hardkodirane u title — vidi napomenu u datoteci (alternativa: `seo_title = NULL` za uvijek-svježu cijenu).
2. **Nakon deploya:** `node seo/verify.mjs https://rentanje.com` — sve mora proći.
3. **GSC → Removals:** privremeno ukloni prefiks `/shop/`. Pojedinačne spam URL-ove ne treba ručno — 410 ih čisti kroz par tjedana.
4. **GSC → URL Inspection → Request indexing** za 6 stranica iz WP3 (naslovnica, /paketi, projektor, jbl-charge-3, paviljon-šator, kategorija oprema-za-evente).
5. **GSC → Sitemaps:** ponovno pošalji `sitemap.xml`.
6. **Praćenje (4–8 tjedana, tjedno):** upiti "najam drona", "najam ledomata", "jbl charge 3", "paviljon šator", "najam projektora", "točionik za pivo" — prati poziciju i CTR za 6 WP3 stranica.

## Preskočeno / svjesne odluke
- WP1c self-referential `?cat=` redirect (petlja rizik; canonical pokriva).
- Blog → proizvodi interno linkanje (sadržaj je u DB-u, ne u repou).
- Stare `/wp-content/uploads/*` slike (404 prihvatljivo, plan tako kaže).
