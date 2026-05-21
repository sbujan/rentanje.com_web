# rentanje.com — Full Webapp Spec
> Equipment rental platform for the Croatian market  
> Stack: Next.js 14 (App Router) · Supabase · Resend · Vercel  
> Primary color: `#F05554` · Domain: rentanje.com  
> Company: **List 360 d.o.o.** · Phone: **+385 95 204 4414**  
> GA4 Measurement ID: `G-1P1FZ42KL7`  
> Last updated: all founder Q&A answers incorporated

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack & Tooling](#2-tech-stack--tooling)
3. [Design System](#3-design-system)
4. [Database Schema (Supabase)](#4-database-schema-supabase)
5. [Frontend Architecture](#5-frontend-architecture)
6. [SEO Strategy — Croatian Market](#6-seo-strategy--croatian-market)
7. [Product System](#7-product-system)
8. [Cart & Inquiry Flow](#8-cart--inquiry-flow)
9. [Availability System](#9-availability-system)
10. [Bundles & Promotions](#10-bundles--promotions)
11. [Upsell Techniques](#11-upsell-techniques)
12. [Email System (Resend)](#12-email-system-resend)
13. [Admin Panel](#13-admin-panel)
14. [Blog / SEO Pages System](#14-blog--seo-pages-system)
15. [Image Strategy](#15-image-strategy)
16. [Performance & Technical SEO](#16-performance--technical-seo)
17. [AI Visibility Strategy](#17-ai-visibility-strategy)
18. [Analytics & Event Tracking](#18-analytics--event-tracking)
19. [i18n Architecture](#19-i18n-architecture)
20. [Legal Pages](#20-legal-pages)
21. [File & Folder Structure](#21-file--folder-structure)
22. [Environment Variables](#22-environment-variables)
23. [Development Phases](#23-development-phases)

---

## 1. Project Overview

**rentanje.com** is a Croatian-language equipment rental platform operated by **List 360 d.o.o.** Customers browse, select dates, build a rental cart, and submit an inquiry via email (no payment processing in v1). The site is heavily SEO-optimised for Croatian search traffic.

### Core goals
- Maximum organic visibility on Google.hr for Croatian rental keywords
- Frictionless mobile inquiry experience
- Clean, colorful, fun UI that builds trust
- Admin panel for **multi-user team** (Supabase Auth with roles)
- Foundation for adding Stripe payments in v2
- **i18n-ready**: Croatian default; future locales via separate country domains (e.g. `rentanje.de`) — never `/en` subdirectories; translation via JSON files from day one

### Categories
| # | Croatian name | Slug |
|---|---|---|
| 1 | Audio i video oprema | `audio-video-oprema` |
| 2 | Oprema za evente i zabavu | `oprema-za-evente` |
| 3 | Oprema za roštilj i kuhanje | `rostilj-kuhanje` |
| 4 | Kamp i outdoor oprema | `kamp-outdoor` |
| 5 | Alati i oprema za čišćenje | `alati-ciscenje` |
| 6 | Ostalo | `ostalo` |

### Contact info (hardcoded in components, also in Settings)
- Phone: **+385 95 204 4414** — shown in Navbar, Footer, product sticky card, cart page
- Company: **List 360 d.o.o.**

---

## 2. Tech Stack & Tooling

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 App Router | SSG + ISR for SEO pages |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS v3 | + CSS variables for brand tokens |
| UI Components | shadcn/ui | Customised to brand |
| Database | Supabase (PostgreSQL) | RLS enabled |
| Auth | Supabase Auth | Multi-user admin; no public accounts in v1 |
| Storage | Supabase Storage | Product images, blog images |
| Email | Resend + React Email | Inquiry confirmations, admin alerts |
| Deployment | Vercel | Edge middleware for redirects |
| Image optimisation | Next.js `<Image>` + Supabase CDN | WebP auto-conversion |
| Analytics | Google Analytics 4 (`G-1P1FZ42KL7`) + Vercel Analytics | |
| SEO tooling | next-sitemap | Auto-generates sitemap.xml |
| Forms | React Hook Form + Zod | Validation |
| Dates | date-fns | Availability calendar |
| Rich text (admin) | Tiptap | Blog + product descriptions |
| i18n | `next-intl` | JSON translation files; future multi-domain |
| State (cart) | Zustand | Persisted to localStorage |

---

## 3. Design System

### Brand tokens
```css
:root {
  --brand-primary:       #F05554;
  --brand-primary-dark:  #C93F3E;
  --brand-primary-light: #FDE8E8;
  --brand-accent-1:  #FFB347; /* amber — promotions/badges */
  --brand-accent-2:  #4ECDC4; /* teal — availability/success */
  --brand-accent-3:  #A78BFA; /* purple — bundles */
  --brand-dark:      #1A1A2E;
  --brand-light:     #FAFAF8;
  --brand-text:      #2D2D2D;
  --brand-muted:     #6B7280;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 32px;
}
```

### Typography
- **Display / Headings**: `Syne` (Google Fonts) — bold, geometric, fun
- **Body**: `DM Sans` — clean, readable at small sizes
- **Prices / Numbers**: `DM Mono` — for pricing display

### Component conventions
- Cards: white background, `--radius-lg`, shadow `0 2px 12px rgba(0,0,0,0.07)`
- Badges/tags: filled pill, strong color, white text
- CTAs: `--brand-primary` fill, white text, hover darken + slight scale
- Price display: `DM Mono`, bold, `--brand-primary` for daily rate

### Category colors
| Category | Accent |
|---|---|
| Audio i video | `#6366F1` (indigo) |
| Evente i zabava | `#F05554` (brand red) |
| Roštilj i kuhanje | `#F97316` (orange) |
| Kamp i outdoor | `#22C55E` (green) |
| Alati i čišćenje | `#EAB308` (yellow) |
| Ostalo | `#8B5CF6` (purple) |

---

## 4. Database Schema (Supabase)

### `admin_users` (roles for multi-user admin)
```sql
CREATE TABLE admin_users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  text NOT NULL,
  role       text DEFAULT 'editor' CHECK (role IN ('owner', 'manager', 'editor')),
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
-- owner: full access including settings, user management
-- manager: products, blog, inquiries, promos, availability
-- editor: products and blog only
```

### `categories`
```sql
CREATE TABLE categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  icon_url        text,
  color           text,
  sort_order      integer DEFAULT 0,
  seo_title       text,
  seo_description text,
  created_at      timestamptz DEFAULT now()
);
```

### `tags`
```sql
CREATE TABLE tags (
  id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name  text NOT NULL,
  slug  text UNIQUE NOT NULL,
  color text
);
```

### `products`
```sql
CREATE TABLE products (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id      uuid REFERENCES categories(id),
  name             text NOT NULL,
  slug             text UNIQUE NOT NULL,
  short_desc       text,
  description      text,           -- rich HTML from Tiptap
  hero_image_url   text,
  images           text[],         -- Supabase storage URLs
  -- Pricing (fully manual — no auto-calculation)
  -- Conditional requirements enforced by admin Zod validation:
  --   min_rental_days = 1 → price_per_day required
  --   min_rental_days <= 3 → price_per_3days required
  --   price_per_7days always required (minimum one price must exist)
  price_per_day    numeric(10,2),   -- NULL when min_rental_days > 1
  price_per_3days  numeric(10,2),   -- NULL when min_rental_days > 3
  price_per_7days  numeric(10,2) NOT NULL,
  -- Rental duration rules
  min_rental_days  integer DEFAULT 1 CHECK (min_rental_days IN (1, 3, 7))
  requires_deposit boolean DEFAULT false,
  deposit_amount   numeric(10,2),  -- shown on frontend when requires_deposit = true
  deposit_note     text,           -- e.g. "Kaucija se vraća po povratku opreme"
  is_available     boolean DEFAULT true,
  is_featured      boolean DEFAULT false,
  is_active        boolean DEFAULT true,
  stock_qty        integer DEFAULT 1,
  weight_kg        numeric(6,2),
  dimensions_cm    text,
  seo_title        text,
  seo_description  text,
  seo_keywords     text[],
  schema_json      jsonb,          -- JSON-LD product schema + FAQs
  view_count       integer DEFAULT 0,
  inquiry_count    integer DEFAULT 0,
  sort_order       integer DEFAULT 0,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);
```

### `product_tags`
```sql
CREATE TABLE product_tags (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  tag_id     uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);
```

### `product_relations`
```sql
CREATE TABLE product_relations (
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  related_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  type        text CHECK (type IN ('connected', 'suggested')),
  sort_order  integer DEFAULT 0,
  PRIMARY KEY (product_id, related_id, type)
);
```

### `bundles`
```sql
CREATE TABLE bundles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  hero_image_url  text,
  discount_type   text CHECK (discount_type IN ('percent', 'fixed')),
  discount_value  numeric(10,2),
  is_active       boolean DEFAULT true,
  is_featured     boolean DEFAULT false,
  seo_title       text,
  seo_description text,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE bundle_products (
  bundle_id  uuid REFERENCES bundles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  qty        integer DEFAULT 1,
  PRIMARY KEY (bundle_id, product_id)
);
```

### `promotions`
```sql
CREATE TABLE promotions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  code           text UNIQUE,
  discount_type  text CHECK (discount_type IN ('percent', 'fixed', 'free_day')),
  discount_value numeric(10,2),
  applies_to     text CHECK (applies_to IN ('all', 'category', 'product', 'bundle')),
  applies_to_id  uuid,
  min_days       integer,
  starts_at      timestamptz,
  ends_at        timestamptz,
  usage_limit    integer,
  usage_count    integer DEFAULT 0,
  is_active      boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);
```

### `availability`
```sql
CREATE TABLE availability (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  date        date NOT NULL,
  qty_booked  integer DEFAULT 0,
  note        text,
  UNIQUE(product_id, date)
);
```

### `inquiries`
```sql
CREATE TABLE inquiries (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_number   text UNIQUE NOT NULL,     -- e.g. RNT-2024-001
  status           text DEFAULT 'new' CHECK (status IN ('new','read','replied','confirmed','cancelled')),
  -- Customer
  customer_name    text NOT NULL,
  customer_email   text NOT NULL,
  customer_phone   text,
  -- B2B fields
  company_name     text,
  company_oib      text,                     -- Croatian tax number
  company_address  text,
  needs_r1_invoice boolean DEFAULT false,    -- request R1 račun
  -- Delivery
  delivery_type    text DEFAULT 'pickup' CHECK (delivery_type IN ('pickup', 'delivery')),
  delivery_address text,                     -- filled if delivery_type = 'delivery'
  delivery_fee     numeric(10,2) DEFAULT 0,  -- 10.00 for Zagreb delivery
  -- Dates & message
  rental_start     date,
  rental_end       date,
  message          text,
  -- Liability
  accepted_liability_terms boolean DEFAULT false,  -- must be true to submit
  -- Promo
  promo_code       text,
  discount_amount  numeric(10,2) DEFAULT 0,
  -- Totals
  subtotal_estimate numeric(10,2),
  total_estimate   numeric(10,2),
  -- Cart snapshot
  items            jsonb NOT NULL,           -- full cart at time of inquiry
  -- Tracking
  source_url       text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  created_at       timestamptz DEFAULT now()
);
```

### `testimonials` (static, managed in admin)
```sql
CREATE TABLE testimonials (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,                -- e.g. "Organizator evenata"
  content     text NOT NULL,
  rating      integer DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active   boolean DEFAULT true,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
```

### `blog_posts`
```sql
CREATE TABLE blog_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,
  excerpt         text,
  content         text,
  hero_image_url  text,
  author          text DEFAULT 'Rentanje tim',
  category_id     uuid REFERENCES categories(id),
  tags            text[],
  is_published    boolean DEFAULT false,
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  seo_keywords    text[],
  reading_time    integer,
  view_count      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
```

### `seo_pages`
```sql
CREATE TABLE seo_pages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,
  content         text,
  hero_image_url  text,
  is_published    boolean DEFAULT false,
  seo_title       text,
  seo_description text,
  seo_keywords    text[],
  schema_json     jsonb,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
```

### `settings`
```sql
CREATE TABLE settings (
  key   text PRIMARY KEY,
  value jsonb
);
-- Keys:
-- 'site_name', 'contact_email', 'contact_phone', 'address',
-- 'oib', 'iban', 'social_links', 'announcement_bar',
-- 'delivery_fee_zagreb', 'seasonal_banner'
```

### Row Level Security
```sql
-- Public: read active products/categories/bundles/tags/blog
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read"  ON products FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all"    ON products FOR ALL   USING (auth.role() = 'authenticated');

-- Testimonials: public read
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read"  ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all"    ON testimonials FOR ALL   USING (auth.role() = 'authenticated');

-- Inquiries: admin only
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_only"   ON inquiries FOR ALL USING (auth.role() = 'authenticated');

-- Admin users: owner only can manage
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_self"   ON admin_users FOR SELECT USING (id = auth.uid());
CREATE POLICY "owner_all"    ON admin_users FOR ALL USING (
  (SELECT role FROM admin_users WHERE id = auth.uid()) = 'owner'
);
```

### Indexes
```sql
CREATE INDEX ON products(slug);
CREATE INDEX ON products(category_id);
CREATE INDEX ON products(is_active, is_featured);
CREATE INDEX ON blog_posts(slug);
CREATE INDEX ON blog_posts(is_published, published_at DESC);
CREATE INDEX ON availability(product_id, date);
CREATE INDEX ON inquiries(status, created_at DESC);
CREATE INDEX ON seo_pages(slug);
```

---

## 5. Frontend Architecture

### Key pages

| Route | Type | Purpose |
|---|---|---|
| `/` | ISR | Homepage — hero, featured, categories, testimonials |
| `/oprema` | ISR | All products — filter/sort |
| `/oprema/[category]` | ISR | Category listing |
| `/oprema/[category]/[slug]` | ISR | Product detail |
| `/paketi` | ISR | Bundles listing |
| `/paketi/[slug]` | ISR | Bundle detail |
| `/blog` | ISR | Blog listing |
| `/blog/[slug]` | ISR | Blog post |
| `/upit` | SSR | Cart + inquiry form |
| `/upit/hvala` | Static | Thank you page |
| `/kontakt` | Static | Contact page |
| `/o-nama` | Static | About page (List 360 d.o.o.) |
| `/uvjeti-odgovornosti` | Static | Liability terms page |
| `/[slug]` | ISR | Custom SEO landing pages |
| `/admin/...` | SSR | All admin routes (auth-gated) |

ISR revalidation: products/categories = 1h, blog = 24h, SEO pages = 6h.

---

## 6. SEO Strategy — Croatian Market

### URL structure
- Always Croatian words: `/oprema/kamp-outdoor/šator-za-camping`
- URL-safe slugs: strip diacritics for slug only (š→s, č→c, ž→z, ć→c, đ→d)
- Keep Croatian characters in `<title>`, H1, descriptions

### Keyword clusters

**High volume (national)**
- `iznajmljivanje opreme`, `najam audio opreme`, `iznajmljivanje šatora`
- `najam roštilja`, `oprema za najam`, `iznajmiti zvučnike`

**Mid-tail (category)**
- `iznajmljivanje zvučnika zagreb`, `najam projektora za event`
- `kamp oprema za najam hrvatska`, `alati za iznajmljivanje`

**Long-tail (product)**
- `iznajmiti profesionalni roštilj za vjenčanje`
- `najam šatora za 20 osoba cijena`
- `gdje iznajmiti PA sustav zagreb`

### On-page rules (enforced per product/category in admin)
1. `<title>`: `[Naziv] – Iznajmljivanje | rentanje.com` (≤60 chars)
2. Meta description: 145–160 chars, include CTA ("Pošaljite upit danas")
3. H1: one per page, primary keyword
4. Alt text: `[Naziv proizvoda] za iznajmljivanje — rentanje.com`
5. Structured data: Product + FAQ + Breadcrumb schema on every product page
6. LocalBusiness schema on homepage + contact page
7. Internal links: product → category + 2–3 related products

### JSON-LD — Product
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "JBL EON615 Aktivni Zvučnik",
  "description": "Profesionalni aktivni zvučnik za iznajmljivanje...",
  "image": ["https://rentanje.com/images/jbl-eon615.jpg"],
  "brand": { "@type": "Brand", "name": "JBL" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "25",
    "highPrice": "120",
    "offerCount": "3"
  }
}
```

### JSON-LD — LocalBusiness (homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "rentanje.com — List 360 d.o.o.",
  "telephone": "+385952044414",
  "url": "https://rentanje.com",
  "address": { "@type": "PostalAddress", "addressCountry": "HR" },
  "openingHours": "Mo-Fr 08:00-17:00"
}
```

### Blog SEO topics
- "Kako odabrati pravi PA sustav za vašu priredbu"
- "Oprema za savršenu vjenčanu zabavu – kompletni vodič"
- "Kad se više isplati iznajmiti alat nego kupiti"
- "Ljetovanje na moru – što iznajmiti umjesto kupiti"
- "Koliko košta iznajmljivanje ozvučenja za vjenčanje"

### SEO landing pages (create in admin)
- `/iznajmljivanje-opreme-zagreb`
- `/najam-ozvucenja-za-vjencanje`
- `/party-oprema-za-najam`
- `/kamp-oprema-hrvatska`

---

## 7. Product System

### Product page layout
```
[Hero image — large, full-width on mobile]
Left col (60%)                 Right col (40%) — sticky
──────────────────────────     ─────────────────────────
H1: Product title               📞 +385 95 204 4414
Category breadcrumb             Price: X €/dan
Tag pills                             Y €/3 dana  (save Z €)
Image gallery thumbnails              W €/7 dana  (save V €)
────────────────────────        [Availability calendar]
Description (rich text)         [Dodaj u košaricu]
────────────────────────        ─────────────────────────
Specs table                     Deposit badge (if required):
────────────────────────          "Kaucija: X €"
FAQ accordion                   Trust badges:
────────────────────────          ✓ Preuzimanje u Zagrebu
"Potrebna oprema" (connected)     ✓ Dostava 10 € (Zagreb)
"Preporučujemo i" (suggested)     ✓ Brz odgovor <24h
────────────────────────
Related blog posts (category)
```

### Deposit display
```typescript
// On product page sticky card:
{product.requires_deposit && (
  <div className="deposit-badge">
    <span>Kaucija: {product.deposit_amount} €</span>
    <Tooltip>{product.deposit_note ?? "Kaucija se vraća po povratku opreme u ispravnom stanju."}</Tooltip>
  </div>
)}
// In cart: deposit shown per line item, summed in cart total breakdown
```

### Price display logic
```typescript
// Build visible price tiers based on min_rental_days
const tiers = [
  { label: '1 dan',  days: 1, price: product.price_per_day,   show: product.min_rental_days <= 1 },
  { label: '3 dana', days: 3, price: product.price_per_3days,  show: product.min_rental_days <= 3 },
  { label: '7 dana', days: 7, price: product.price_per_7days,  show: true },
].filter(t => t.show && t.price !== null)

// Show savings vs. daily rate (only when daily rate exists)
const savingsLabel = (days: number, tierPrice: number) => {
  if (!product.price_per_day) return null
  const fullPrice = product.price_per_day * days
  const saving = fullPrice - tierPrice
  return saving > 0 ? `Uštedite ${saving} €` : null
}
```

**Admin validation (Zod):**
```typescript
// Enforced when saving a product in admin
if (data.min_rental_days === 1 && !data.price_per_day)   error('Cijena za 1 dan je obavezna')
if (data.min_rental_days <= 3 && !data.price_per_3days)  error('Cijena za 3 dana je obavezna')
// price_per_7days always required — enforced at DB level (NOT NULL)
```

**Minimum rental notice on product page:**
```typescript
// Shown below availability calendar when min > 1
{product.min_rental_days > 1 && (
  <p className="min-rental-notice">
    Minimalni period iznajmljivanja je {product.min_rental_days} dana.
  </p>
)}
```

### Product card
- Image (4:3, cover)
- Category color dot
- Product name
- Short desc (2 lines, truncated)
- "od X €/dan"
- Availability indicator (green/orange/red dot)
- "Dodaj u košaricu" (hover on desktop, always on mobile)

---

## 8. Cart & Inquiry Flow

### Cart Zustand store
```typescript
interface CartItem {
  productId:      string
  productName:    string
  heroImage:      string
  slug:           string
  rentalStart:    Date
  rentalEnd:      Date
  days:           number
  minRentalDays:  number          // 1 | 3 | 7 — for validation
  priceTierLabel: string          // '1 dan' | '3 dana' | '7 dana'
  priceForTier:   number          // the actual tier price (e.g. 200 for 3 days)
  totalPrice:     number          // priceForTier / tierDays * days
  depositAmount:  number          // 0 if no deposit required
  qty:            number
}

interface CartStore {
  items:       CartItem[]
  promoCode:   string | null
  discount:    number
  addItem:     (item: CartItem) => void
  removeItem:  (productId: string) => void
  updateDates: (productId: string, start: Date, end: Date) => void
  applyPromo:  (code: string) => Promise<void>
  clearCart:   () => void
}
```

### Cart page (`/upit`)

**Section 1 — Cart summary**
- Each item: image, name, dates, days, price, deposit (if any), remove
- Promo code field
- Price breakdown:
  - Subtotal (rental)
  - Kaucija ukupno (sum of deposits — info only, not charged online)
  - Dostava (0 or 10 €)
  - Popust (if promo applied)
  - **Ukupna procjena: X €**
  - Note: "Konačna cijena potvrđuje se po dogovoru"

**Section 2 — Delivery selection**
```
( ) Preuzimanje u Zagrebu (besplatno)
( ) Dostava u Zagreb — 10 €
    [Adresa dostave _______________]
```

**Section 3 — Customer form**
```
Ime i prezime *
Email *
Telefon *
─── Firma (opcionalno) ───────────────────────────────
[ ] Trebam R1 račun (pravna osoba)
  Naziv tvrtke *
  OIB tvrtke *
  Adresa tvrtke *
──────────────────────────────────────────────────────
Napomena / poruka (textarea)
──────────────────────────────────────────────────────
[✓] Prihvaćam uvjete o odgovornosti za štetu *
    → links to /uvjeti-odgovornosti (opens new tab)
[✓] Prihvaćam uvjete korištenja *

[Pošalji upit]
```

**On submit:**
1. Zod validate all fields
2. Check liability checkbox — hard block if not checked
3. POST to `/api/inquiry`
4. API: insert to `inquiries` table, fire Resend emails
5. Fire GA4 event `inquiry_submitted`
6. Redirect to `/upit/hvala`

### Cart drawer (desktop, slide-in from right)
- Shows items, subtotal, deposits
- "Upit za iznajmljivanje" CTA button → goes to `/upit`
- Upsell: 2 suggested add-ons for cart contents
- "Zaboravili ste?" — connected items not in cart

---

## 9. Availability System

### Public calendar widget
- `react-day-picker` with brand colors
- Green: available, Red: fully booked, Yellow: low stock (last unit)
- User picks start → end → reflects in sticky inquiry card
- Tooltip on hover: "X jedinica dostupno"

### Availability computation
```typescript
// available units for a date:
const available = product.stock_qty - (availability[date]?.qty_booked ?? 0)
// status:
if (available <= 0)                          → 'unavailable'
if (available / product.stock_qty < 0.3)     → 'low'
else                                         → 'available'
```

### Admin availability manager
- Per-product monthly grid
- Click cell → modal: set qty_booked, note
- "Blokiraj raspon" — block maintenance window
- When inquiry is confirmed → admin manually increments qty_booked for the date range (or auto-update in v2)

---

## 10. Bundles & Promotions

### Bundles
- Own SEO page `/paketi/[slug]`
- Bundle price = sum of daily rates × (1 − discount)
- Purple accent (`#A78BFA`), "PAKET" badge
- Shows savings: "Uštedite 45 €"
- Shown on: homepage, category sidebar, product pages

### Promotions
| Type | Example |
|---|---|
| Percent | 20% popust na kamp opremu |
| Fixed | 15 € popust na 7+ dana |
| Free day | Iznajmi 6 dana, plati 5 |
| Promo code | "LJETO24" → 10% |

**Auto-applied** (no code): seasonal, long-rental (7+ days), category sale.
**Announcement bar**: configured in Settings, dismissable, links to category/bundle.

---

## 11. Upsell Techniques

### On product page
1. **"Potrebna oprema"** — required accessories (connected), shown as add-on checkboxes in sticky card
2. **"Kupci iznajmili i"** — based on co-occurrence in `inquiries.items` JSON
3. **"Kompletni paket"** — bundle upsell if product is in a bundle, with savings
4. **Price anchoring** — show 7-day price first (cheapest per day), always show savings

### In cart
5. **Add-to-cart toast** — shows 2 suggested items when item is added
6. **"Zaboravili ste?"** — connected items for cart products not yet added
7. **Bundle upgrade prompt** — "Dodajte [X] i uštedite Y € uz paket"

### Email
8. **Follow-up email** (24h after inquiry, if still `new`) — includes 3 related products
9. **Confirmation email** — "Za vaš najam preporučujemo i..."

### Homepage / category
10. **"Popularno zajedno"** — pairs often rented together
11. **"Sezonski hit"** badge — high-margin seasonal items

---

## 12. Email System (Resend)

### Templates (React Email)

**1. Customer inquiry confirmation**
- Subject: `Vaš upit je primljen — rentanje.com (#RNT-XXXX)`
- Content: items list, dates, delivery type, deposit summary, estimated total, "odgovorit ćemo unutar 24h"
- If `needs_r1_invoice`: "Pripremu R1 računa obraditi ćemo po potvrdi upita"
- Footer: +385 95 204 4414, rentanje.com

**2. Admin new inquiry alert**
- Subject: `📦 Novi upit #RNT-XXXX — [Customer name]`
- Full inquiry details + link to admin panel
- Flag: R1 needed, delivery address, deposit items

**3. Follow-up (cron, 24h delay, only if status = 'new')**
- Subject: `Trebate li dodatne informacije? — rentanje.com`
- "Primili smo vaš upit, uskoro ćemo odgovoriti..."
- 3 product suggestions

### Resend config
```typescript
// lib/email.ts
import { Resend } from 'resend'
export const resend = new Resend(process.env.RESEND_API_KEY)
// from: info@rentanje.com
// reply-to: contact_email from settings
```

### Vercel Cron
```json
{
  "crons": [{ "path": "/api/cron/followup-emails", "schedule": "0 9 * * *" }]
}
```

---

## 13. Admin Panel

### Auth & Roles
- Supabase Auth (email + password)
- Multi-user: roles defined in `admin_users` table
- `owner` > `manager` > `editor`
- Middleware protects all `/admin/*` routes
- Owner can invite new admin users (Supabase invite flow)

### Role permissions matrix
| Feature | owner | manager | editor |
|---|---|---|---|
| Products CRUD | ✓ | ✓ | ✓ |
| Blog CRUD | ✓ | ✓ | ✓ |
| Inquiries | ✓ | ✓ | — |
| Availability | ✓ | ✓ | — |
| Bundles/Promos | ✓ | ✓ | — |
| SEO pages | ✓ | ✓ | — |
| Settings | ✓ | — | — |
| Admin users | ✓ | — | — |
| Testimonials | ✓ | ✓ | — |

### Dashboard
- Today's new inquiries (badge + list)
- Weekly inquiry sparkline chart
- Products low on availability (next 7 days)
- Quick links: Add product, View inquiries, Update availability

### Products CRUD
- Table: name, category, min. period, price tiers (1d/3d/7d), deposit badge, availability, inquiry count, active toggle
- Bulk: activate/deactivate, change category
- **Product editor**:
  **OSNOVNE INFORMACIJE**
  - Naziv *
  - Slug (URL) * — auto-generated, editable
  - Kategorija * — dropdown
  - Oznake (tags) — multiselect pills
  - Kratki opis * — 1–2 sentences, used on cards + inquiry email
  - Opis (rich text) * — Tiptap: H2/H3, bold, lists, images, links, tables

  **SLIKE**
  - Hero slika * — main image
  - Galerija — drag-to-reorder; alt text required per image (format: `[Naziv] za iznajmljivanje — rentanje.com`)

  **CIJENE I NAJAM**
  - Minimalni period najma: `1 dan` / `3 dana` / `7 dana` — controls which price fields appear
  - Cijena za 1 dan — shown + required when min = 1
  - Cijena za 3 dana — shown + required when min ≤ 3
  - Cijena za 7 dana — always shown, always required
  - No auto-calculation — all prices entered manually
  - Kaucija toggle → iznos kaucije + napomena o kauciji

  **DOSTUPNOST**
  - Ukupna količina (stock_qty) — how many units owned
  - Dostupno toggle — emergency on/off override

  **TEHNIČKI PODACI**
  - Težina (kg)
  - Dimenzije (cm) — L × W × H

  **POVEZANI PROIZVODI**
  - Potrebna oprema — "connected" type (required accessories)
  - Preporučujemo i — "suggested" type (upsell items)
  Both use typeahead search across all active products.

  **FAQ (SEO + AI vidljivost)**
  - Unlimited Q+A pairs stored in `schema_json.faqs`
  - Renders as `FAQPage` JSON-LD — picked up by Google and AI crawlers
  - Suggested questions shown as prompts (editable):
    - "Što je uključeno u cijenu najma?"
    - "Koliko dana unaprijed trebam rezervirati?"
    - "Dostavljate li opremu?"
    - "Koja je politika kaucije?"

  **SEO**
  - SEO naslov — custom `<title>` tag (preview: ≤60 chars counter)
  - Meta opis — 145–160 chars (live counter)
  - Ključne riječi — comma-separated tag input
  - OG slika — defaults to hero image, overridable
  - Live Google snippet preview (title + URL + description)

  **AI VIDLJIVOST**
  - Brand — e.g. "JBL", "Weber", "Coleman" (populates `schema_json.brand`)
  - Model / SKU — specific model name for structured data
  - Structured data preview — read-only JSON-LD block (auto-generated from all fields)

  **POSTAVKE**
  - Istaknuto (featured) — appears on homepage featured section
  - Aktivno — hides from public if off
  - Redosljed — sort order within category

### Inquiries inbox
- Table: #, date, customer, items count, dates, status, delivery type, R1 flag, total
- Filter by status / date / R1
- Detail view:
  - Full customer + B2B info
  - Delivery type + address
  - Cart snapshot
  - Deposit breakdown
  - Status dropdown → "Potvrdi" auto-increments availability
  - Internal notes

### Blog editor (`/admin/blog`)
- List with publish/draft toggle, scheduled date, view count
- **Post editor fields:**

  **SADRŽAJ**
  - Naslov *
  - Slug (URL) * — auto-generated from title, editable
  - Kategorija — links post to a product category
  - Oznake — freetext tag input
  - Kratki opis (excerpt) — shown on blog listing cards
  - Hero slika + alt text (required)
  - Sadržaj (rich text) * — Tiptap: H2/H3, bold, italic, lists, images, links, blockquotes, tables + `[product slug="xxx"]` shortcode to embed product cards inline
  - Autor — defaults to "Rentanje tim"

  **FAQ (SEO + AI vidljivost)**
  - Unlimited Q+A pairs — renders as `FAQPage` JSON-LD
  - Especially valuable on how-to and guide posts
  - AI tools (ChatGPT, Perplexity, Google AI) prioritise FAQ content for direct answers

  **SEO**
  - SEO naslov — custom `<title>` tag (≤60 chars live counter)
  - Meta opis — 145–160 chars (live counter)
  - Ključne riječi — comma-separated tag input
  - OG slika — defaults to hero, overridable
  - Live Google snippet preview

  **OBJAVA**
  - Status: Skica / Objavljeno
  - Datum objave — schedulable (future date supported)

### SEO stranice (`/admin/stranice`)
Custom landing pages targeting high-value local/intent queries (e.g. "Iznajmljivanje opreme Zagreb").
Identical to blog post editor **except**: no author, no category, no tags, no reading time.

  **SADRŽAJ**
  - Naslov *
  - Slug (URL) *
  - Hero slika + alt text
  - Sadržaj (rich text) * — same Tiptap editor; include H1 keyword, ~500 words, product grid shortcode `[category slug="xxx"]`

  **FAQ (SEO + AI vidljivost)**
  - Same FAQ editor as blog and product pages
  - Critical for local landing pages — e.g. "Dostavljate li opremu u Zagreb?" / "Koja je cijena najma ozvučenja?"

  **SEO**
  - SEO naslov, meta opis, ključne riječi, OG slika
  - Schema type selector: `WebPage` (default) or `LocalBusiness` overlay
  - Live Google snippet preview

  **OBJAVA**
  - Status: Skica / Objavljeno

### Kategorije editor (`/admin/kategorije`)
  **OSNOVNE INFORMACIJE**
  - Naziv kategorije *
  - Slug (URL) *
  - Opis kategorije — short text, shown on category page header
  - Ikona / banner slika — uploaded image
  - Boja kategorije — hex colour picker
  - Redosljed — sort order (drag or number input)

  **SEO**
  - SEO naslov
  - Meta opis
  - OG slika (1200×630)
  - Kanonski URL — auto-filled, editable if needed

### Testimonials (`/admin/recenzije`)
- Add/edit/delete
- Toggle active
- Drag to reorder

### Postavke (Settings)
- Site name, contact email, phone, address, OIB, IBAN
- Announcement bar (text, link, color, active dates, on/off)
- Delivery fee for Zagreb (default 10 €)
- Social links

### Admin users (owner only)
- List of admin users with roles
- Invite new user (Supabase magic link)
- Change role, deactivate

---

## 14. Blog / SEO Pages System

### Blog — public page features
- Reading time (auto-calculated from content)
- Table of contents (auto-generated from H2/H3 headings)
- Share buttons: Facebook, WhatsApp (most-used in Croatia)
- Related posts (same category, 3 cards)
- Embedded product cards via `[product slug="xxx"]` shortcode
- Sticky sidebar CTA: "Iznajmite odmah" → `/oprema`
- `FAQPage` JSON-LD rendered from FAQ pairs

### SEO landing pages — public page features
- H1 with primary keyword
- ~500 words keyword-rich content
- Product/category grid (filtered by slug from shortcode)
- `LocalBusiness` schema overlay
- Internal links to category pages
- FAQ section with `FAQPage` JSON-LD

---

## 15. Image Strategy

### Supabase Storage buckets
```
products/[product-id]/hero.webp
products/[product-id]/gallery-N.webp
blog/[post-slug]/hero.webp
categories/[slug]/banner.webp
```

### Rules
- Convert to WebP on upload (sharp or Supabase transform)
- Sizes: 400w, 800w, 1200w
- Always `next/image` with `sizes` prop
- Hero images: 1200×800 max
- Card thumbnails: 400×300 (4:3 enforced)
- Alt text required in admin (format: `[Naziv] za iznajmljivanje — rentanje.com`)
- Hero images: `priority={true}`, all others: lazy

---

## 16. Performance & Technical SEO

### Core Web Vitals targets
| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

### Techniques
- SSG + ISR for all product/category/blog pages
- `next/font/google` for zero layout shift
- No client-side fetching for SEO-critical content
- Prefetch category links on hover
- Select only needed columns from Supabase
- robots.txt: `Disallow: /admin/`, `Disallow: /upit/hvala` — plus explicit `Allow` for GPTBot, PerplexityBot, ClaudeBot (see Section 17)
- All pages: `<link rel="canonical">`
- Open Graph + Twitter card metadata on every page
- Croatian locale: `<html lang="hr">`
- `og:locale`: `hr_HR`

### next-sitemap
```javascript
module.exports = {
  siteUrl: 'https://rentanje.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/upit/hvala'],
  // priority: homepage 1.0, categories 0.9, products 0.8, blog 0.7
}
```

---

## 17. AI Visibility Strategy

Beyond traditional SEO, AI tools (ChatGPT, Perplexity, Claude, Google AI Overviews, Bing Copilot) are an increasingly important discovery channel. When someone asks *"gdje iznajmiti PA sustav u Zagrebu"* or *"koja je cijena najma šatora"*, you want rentanje.com to appear.

### How AI tools find and cite your content
AI tools index your site the same way Google does — via crawlers — but they weight content differently: they prefer **direct answers**, **structured data**, and **factual specificity** over keyword density.

### 1. `llms.txt` — the new AI crawler standard
Place a plain text file at `https://rentanje.com/llms.txt`. This is a 2024–2025 emerging standard (similar to `robots.txt`) that tells AI crawlers what your site is, what it offers, and where to find key content.

```
# rentanje.com

> Platforma za iznajmljivanje opreme u Hrvatskoj.
> Operater: List 360 d.o.o. | Kontakt: info@rentanje.com | Tel: +385 95 204 4414

## O nama
rentanje.com nudi iznajmljivanje audio i video opreme, opreme za evente,
roštilja, kamp opreme, alata i ostale opreme u Hrvatskoj.
Preuzimanje u Zagrebu. Dostava u Zagreb: 10 €. Upit putem web forme.

## Kategorije
- Audio i video oprema: https://rentanje.com/oprema/audio-video-oprema
- Oprema za evente i zabavu: https://rentanje.com/oprema/oprema-za-evente
- Oprema za roštilj i kuhanje: https://rentanje.com/oprema/rostilj-kuhanje
- Kamp i outdoor oprema: https://rentanje.com/oprema/kamp-outdoor
- Alati i oprema za čišćenje: https://rentanje.com/oprema/alati-ciscenje

## Paketi
- Svi paketi: https://rentanje.com/paketi

## Uvjeti najma
- Minimalni period: 1, 3 ili 7 dana (ovisno o proizvodu)
- Kaucija: na odabrane proizvode (navedeno na stranici proizvoda)
- Dostava: Zagreb, fiksna cijena 10 €
- Preuzimanje: Zagreb (besplatno)
- Upit: web forma, potvrda emailom unutar 24h

## Kontakt
- Email: info@rentanje.com
- Telefon: +385 95 204 4414
- Web: https://rentanje.com
```

Add this as a static file in `/public/llms.txt` — it requires no code, just a text file.

### 2. FAQ schema on every page — most impactful signal
`FAQPage` JSON-LD is the single most effective way to appear in both Google AI Overviews and Perplexity answers. Every product, blog post, and SEO landing page should have 3–6 FAQ entries. Write them as real customer questions:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Što je uključeno u cijenu najma zvučnika?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Uključeni su kabeli, postolje i tehnička podrška putem telefona. Dostava u Zagreb dostupna je po cijeni 10 €."
    }
  }, {
    "@type": "Question",
    "name": "Dostavljate li opremu?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Da, dostava je dostupna u Zagrebu po fiksnoj cijeni od 10 €. Za ostale lokacije kontaktirajte nas."
    }
  }]
}
```

### 3. Specific, factual product descriptions
AI tools ignore generic marketing copy. They prioritise specificity:

| Weak (ignored) | Strong (cited) |
|---|---|
| "Kvalitetni zvučnik za iznajmljivanje" | "JBL EON615, 15-inčni aktivni zvučnik, 1000W, do 200 osoba" |
| "Odličan šator za outdoor" | "Coleman Kobuk Valley 4, vodootpornost 3000mm, 4 osobe, 6.5 kg" |
| "Profesionalna oprema" | "Uključuje: XLR kabel 10m, postolje, torba za transport" |

Every product description should include: brand, model, key specs, capacity/use case, what's included.

### 4. Consistent NAP across the web
**Name / Address / Phone** must be identical everywhere AI tools might find it:
- Footer on every page
- Contact page
- LocalBusiness JSON-LD
- Google Business Profile (create + verify if not done)
- `llms.txt`

Consistent: **List 360 d.o.o.** · **+385 95 204 4414** · **info@rentanje.com**

### 5. Sitemap with `<lastmod>` dates
AI crawlers prioritise recently-updated content. Every `updated_at` change on a product should flow through to the sitemap. Configure `next-sitemap` to use the DB `updated_at` field as `<lastmod>`.

### 6. `robots.txt` — allow AI crawlers explicitly
Some AI crawlers respect specific `User-agent` directives. Allow all by default:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /upit/hvala

# Explicitly allow known AI crawlers
User-agent: GPTBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Googlebot
Allow: /

Sitemap: https://rentanje.com/sitemap.xml
```

### 7. Schema types used across the site
| Page type | Schema types |
|---|---|
| Homepage | `WebSite`, `LocalBusiness`, `FAQPage` |
| Category page | `BreadcrumbList`, `ItemList` |
| Product page | `Product`, `FAQPage`, `BreadcrumbList` |
| Bundle page | `Product`, `BreadcrumbList` |
| Blog post | `BlogPosting`, `FAQPage`, `BreadcrumbList` |
| SEO landing page | `WebPage`, `LocalBusiness`, `FAQPage` |
| Contact page | `LocalBusiness` |

### Implementation in Next.js
All JSON-LD generated server-side via `lib/seo/schemas.ts` and injected via `<script type="application/ld+json">` in page `<head>`. Never client-rendered — must be in initial HTML for crawlers.

```typescript
// lib/seo/schemas.ts
export function productSchema(product: Product) { ... }
export function faqSchema(faqs: FAQ[]) { ... }
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "rentanje.com",
    "legalName": "List 360 d.o.o.",
    "telephone": "+385952044414",
    "email": "info@rentanje.com",
    "url": "https://rentanje.com",
    "address": { "@type": "PostalAddress", "addressCountry": "HR" },
    "openingHours": "Mo-Fr 08:00-17:00"
  }
}
```

---

## 18. Analytics & Event Tracking

### Setup
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'
// <GoogleAnalytics gaId="G-1P1FZ42KL7" />
```

### GA4 Events to fire

| Event name | Trigger | Parameters |
|---|---|---|
| `view_item` | Product page load | item_id, item_name, item_category, price |
| `add_to_cart` | "Dodaj u košaricu" click | item_id, item_name, value, currency: 'EUR' |
| `remove_from_cart` | Remove item in cart | item_id |
| `view_cart` | Cart page / drawer open | value, items |
| `begin_checkout` | Cart page load | value, items |
| `inquiry_submitted` | Successful inquiry POST | inquiry_number, value, items_count, delivery_type, needs_r1 |
| `promo_applied` | Promo code validated | promo_code, discount_value |
| `phone_click` | Click on phone number link | phone_number |
| `availability_checked` | User picks dates on product page | item_id, rental_start, rental_end, days |
| `bundle_viewed` | Bundle detail page load | bundle_id, bundle_name |
| `blog_read` | Blog post page load | post_slug, reading_time |

### Implementation pattern
```typescript
// lib/analytics.ts
declare const gtag: (...args: unknown[]) => void

export function trackEvent(name: string, params: Record<string, unknown>) {
  if (typeof gtag !== 'undefined') {
    gtag('event', name, params)
  }
}

// Usage:
trackEvent('inquiry_submitted', {
  inquiry_number: data.inquiry_number,
  value: data.total_estimate,
  items_count: cart.items.length,
  delivery_type: formData.delivery_type,
  needs_r1: formData.needs_r1_invoice,
  currency: 'EUR',
})
```

### Conversion goal in GA4
Mark `inquiry_submitted` as a **Conversion** in GA4 dashboard. This enables Google Ads remarketing and ROAS tracking when ads are set up.

---

## 19. i18n Architecture

### Approach: JSON translation files, multi-domain future
- All user-facing strings in `/messages/hr.json` (Croatian default)
- Never hardcode Croatian text in components — always use translation keys
- Use `next-intl` for translation lookup
- Future: `rentanje.de` → `/messages/de.json`, separate Vercel deployment
- No `/en` path — each language gets its own domain

### Structure
```
messages/
  hr.json     ← all Croatian strings (default, always exists)
  en.json     ← placeholder, created when needed
```

### Example keys
```json
// messages/hr.json
{
  "nav": {
    "equipment": "Oprema",
    "bundles": "Paketi",
    "blog": "Blog",
    "contact": "Kontakt",
    "cart": "Košarica"
  },
  "product": {
    "addToCart": "Dodaj u košaricu",
    "pricePerDay": "€/dan",
    "price1day": "1 dan",
    "price3days": "3 dana",
    "price7days": "7 dana",
    "minRental3": "Minimalni period iznajmljivanja je 3 dana.",
    "minRental7": "Minimalni period iznajmljivanja je 7 dana.",
    "available": "Dostupno",
    "unavailable": "Nije dostupno",
    "deposit": "Kaucija"
  },
  "inquiry": {
    "title": "Vaša košarica upita",
    "submit": "Pošalji upit",
    "liability_label": "Prihvaćam uvjete o odgovornosti za štetu",
    "delivery_pickup": "Preuzimanje u Zagrebu (besplatno)",
    "delivery_zagreb": "Dostava u Zagreb — 10 €",
    "needs_r1": "Trebam R1 račun (pravna osoba)"
  },
  "phone": "+385 95 204 4414"
}
```

### next-intl config
```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server'
export default getRequestConfig(async () => ({
  locale: 'hr',
  messages: (await import('./messages/hr.json')).default
}))
```

---

## 20. Legal Pages

### `/uvjeti-odgovornosti` — Uvjeti o odgovornosti za štetu
Static page, content managed in codebase (not CMS). Must be linked from:
- Inquiry form checkbox (required, opens new tab)
- Footer links

**Content outline for this page (List 360 d.o.o.):**
```
1. Opće odredbe
   - Iznajmljivač: List 360 d.o.o., OIB: [xxxx]
   - Korisnik preuzima opremu u ispravnom stanju

2. Odgovornost korisnika
   - Korisnik je odgovoran za svu štetu nastalu za vrijeme iznajmljivanja
   - Oštećenje ili gubitak opreme naplaćuje se po tržišnoj vrijednosti

3. Kaucija
   - Visina kaucije navedena je na stranici proizvoda
   - Kaucija se vraća po povratku opreme u ispravnom stanju

4. Vraćanje opreme
   - Oprema se vraća na dogovorenu lokaciju u dogovorenom roku
   - Kašnjenje se naplaćuje po dnevnoj cijeni najma

5. Kontakt
   - List 360 d.o.o.
   - Tel: +385 95 204 4414
   - Email: info@rentanje.com
```

### Other legal pages (add as static pages)
- `/uvjeti-koristenja` — Terms of service
- `/privatnost` — Privacy policy (GDPR — required for Croatian market)
- `/kolacici` — Cookie policy (required for EU)

### Footer links (required)
- Uvjeti korištenja
- Uvjeti o odgovornosti za štetu
- Politika privatnosti
- Kolačići

---

## 21. File & Folder Structure

```
rentanje/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx          ← Navbar, Footer, CartProvider, AnnouncementBar, GA4
│   │   ├── page.tsx            ← Homepage
│   │   ├── oprema/
│   │   │   ├── page.tsx
│   │   │   └── [category]/
│   │   │       ├── page.tsx
│   │   │       └── [slug]/page.tsx
│   │   ├── paketi/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── upit/
│   │   │   ├── page.tsx
│   │   │   └── hvala/page.tsx
│   │   ├── kontakt/page.tsx
│   │   ├── o-nama/page.tsx
│   │   ├── uvjeti-odgovornosti/page.tsx   ← static, List 360 d.o.o.
│   │   ├── uvjeti-koristenja/page.tsx
│   │   ├── privatnost/page.tsx
│   │   ├── kolacici/page.tsx
│   │   └── [slug]/page.tsx     ← SEO landing pages
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx        ← Dashboard
│   │       ├── login/page.tsx
│   │       ├── proizvodi/
│   │       │   ├── page.tsx
│   │       │   ├── novi/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── kategorije/page.tsx
│   │       ├── oznake/page.tsx
│   │       ├── paketi/page.tsx
│   │       ├── promocije/page.tsx
│   │       ├── dostupnost/page.tsx
│   │       ├── upiti/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── blog/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── stranice/page.tsx
│   │       ├── recenzije/page.tsx     ← Testimonials
│   │       ├── korisnici/page.tsx     ← Admin users (owner only)
│   │       └── postavke/page.tsx
│   └── api/
│       ├── inquiry/route.ts
│       ├── availability/route.ts
│       ├── promo/validate/route.ts
│       └── cron/followup-emails/route.ts
├── components/
│   ├── ui/                     ← shadcn
│   ├── layout/
│   │   ├── Navbar.tsx          ← includes phone number
│   │   ├── Footer.tsx          ← phone, legal links, List 360 d.o.o.
│   │   ├── CartDrawer.tsx
│   │   └── AnnouncementBar.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── PriceDisplay.tsx
│   │   ├── DepositBadge.tsx
│   │   ├── AvailabilityCalendar.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── RelatedProducts.tsx
│   │   └── ProductSchema.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   ├── DeliverySelector.tsx
│   │   ├── B2BFields.tsx
│   │   └── InquiryForm.tsx
│   ├── bundle/
│   │   ├── BundleCard.tsx
│   │   └── BundleDetail.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   └── TableOfContents.tsx
│   ├── testimonials/
│   │   └── TestimonialsSection.tsx
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── ProductEditor.tsx
│   │   ├── DepositEditor.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── TiptapEditor.tsx
│   │   ├── SeoPreview.tsx
│   │   ├── AvailabilityGrid.tsx
│   │   └── TestimonialsManager.tsx
│   └── seo/
│       ├── JsonLd.tsx
│       └── Breadcrumbs.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── queries/
│   │       ├── products.ts
│   │       ├── availability.ts
│   │       └── inquiries.ts
│   ├── email/
│   │   ├── resend.ts
│   │   └── templates/
│   │       ├── InquiryConfirmation.tsx
│   │       ├── AdminAlert.tsx
│   │       └── FollowUp.tsx
│   ├── cart/
│   │   └── store.ts            ← Zustand
│   ├── analytics.ts            ← GA4 event helpers
│   ├── seo/
│   │   └── schemas.ts          ← JSON-LD generators
│   └── utils.ts
├── messages/
│   └── hr.json                 ← all Croatian strings
├── types/
│   └── database.ts             ← Supabase generated types
├── public/
│   ├── logo.svg
│   ├── og-default.jpg
│   ├── llms.txt                ← AI crawler manifest
│   └── icons/
├── i18n.ts
├── next.config.js
├── next-sitemap.config.js
├── vercel.json                 ← cron jobs
└── tailwind.config.ts
```

---

## 22. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only — never expose to client

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=info@rentanje.com

# App
NEXT_PUBLIC_SITE_URL=https://rentanje.com
NEXT_PUBLIC_SITE_NAME=rentanje.com
NEXT_PUBLIC_PHONE=+385952044414
NEXT_PUBLIC_GA_ID=G-1P1FZ42KL7
ADMIN_EMAIL=                      # inquiry alert destination
CRON_SECRET=                      # random string to auth Vercel cron calls

# Delivery
DELIVERY_FEE_ZAGREB=10.00
```

---

## 23. Development Phases

### Phase 1 — Foundation (Week 1–2)
- [ ] Next.js 14 project setup, Tailwind, shadcn, next-intl
- [ ] `messages/hr.json` — all string keys defined (empty values ok)
- [ ] Supabase project, run all migrations
- [ ] Design system: tokens, Syne + DM Sans fonts, base components
- [ ] Supabase Auth + Admin login (multi-user, roles)
- [ ] Admin: Categories + Tags CRUD
- [ ] Admin: Products CRUD (no image upload yet)

### Phase 2 — Public product pages (Week 2–3)
- [ ] Homepage (hero, featured products, categories grid, testimonials section)
- [ ] Category listing page with filters/sort
- [ ] Product detail page (full layout, all sections)
- [ ] Availability calendar (public view, react-day-picker)
- [ ] Deposit badge component
- [ ] Image upload (Supabase Storage, WebP)
- [ ] SEO metadata + JSON-LD (Product, Breadcrumb, FAQ) on all pages
- [ ] Phone number in Navbar, footer, sticky card
- [ ] LocalBusiness schema on homepage

### Phase 3 — Cart & Inquiry (Week 3–4)
- [ ] Zustand cart store (with deposits)
- [ ] Cart drawer (desktop) + full cart page
- [ ] Delivery selector (pickup / Zagreb delivery + address)
- [ ] B2B fields (R1 checkbox → company name, OIB, address)
- [ ] Liability checkbox → links to `/uvjeti-odgovornosti`
- [ ] Inquiry form + Zod validation
- [ ] `/api/inquiry` route → Supabase insert + Resend emails
- [ ] GA4 events (inquiry_submitted, add_to_cart, phone_click, etc.)
- [ ] Thank you page
- [ ] Admin: Inquiries inbox + detail view

### Phase 4 — Bundles, Promos & Upsell (Week 4–5)
- [ ] Bundles system (DB + admin + public pages)
- [ ] Promotions system (DB + admin + promo validation API)
- [ ] Related/connected products sections on product page
- [ ] Cart upsell drawer + "Zaboravili ste?" section
- [ ] Bundle upgrade prompt in cart

### Phase 5 — Content & SEO (Week 5–6)
- [ ] Blog system (Tiptap editor, public pages, reading time, ToC)
- [ ] SEO landing pages (admin editor + public rendering)
- [ ] Announcement bar (settings-driven)
- [ ] next-sitemap config + robots.txt (with AI crawler directives)
- [ ] `public/llms.txt` — AI crawler manifest
- [ ] OG tags, Twitter cards on all pages
- [ ] Testimonials (admin CRUD + homepage section)
- [ ] Legal pages: `/uvjeti-odgovornosti`, `/privatnost`, `/uvjeti-koristenja`, `/kolacici`
- [ ] Admin users management page (owner role)

### Phase 6 — Polish & Launch (Week 6–7)
- [ ] Admin availability calendar
- [ ] Admin dashboard stats
- [ ] Vercel cron: follow-up emails
- [ ] Core Web Vitals audit
- [ ] Mobile UX audit (especially cart + product pages)
- [ ] Add first 10–20 products via admin
- [ ] Submit sitemap to Google Search Console
- [ ] Deploy to Vercel production (rentanje.com)
- [ ] GA4: mark `inquiry_submitted` as Conversion
