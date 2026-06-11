// Google Analytics 4 event helpers
// Only fires when NEXT_PUBLIC_GA_MEASUREMENT_ID is set

type GtagEventParams = Record<string, unknown>;
type GtagArg = string | number | boolean | Date | GtagEventParams | undefined;

declare global {
  interface Window {
    gtag?: (...args: GtagArg[]) => void;
    dataLayer?: unknown[];
  }
}

export function gtagEvent(eventName: string, params?: GtagEventParams) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Shared shape for a cart/order line in ecommerce events.
type EventItem = { id: string; name: string; price: number };

function toGaItems(items: EventItem[]) {
  return items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price }));
}

// --- Page views (SPA route changes) -----------------------------------------

export function trackPageView() {
  if (typeof window === "undefined") return;
  gtagEvent("page_view", {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: document.title,
  });
}

// --- Standard ecommerce events ----------------------------------------------

export function trackViewItem(product: { id: string; name: string; price: number; category?: string }) {
  gtagEvent("view_item", {
    currency: "EUR",
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, item_category: product.category, price: product.price }],
  });
}

export function trackAddToCart(product: { id: string; name: string; price: number; category?: string }) {
  gtagEvent("add_to_cart", {
    currency: "EUR",
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, item_category: product.category, price: product.price }],
  });
}

export function trackRemoveFromCart(item: EventItem) {
  gtagEvent("remove_from_cart", {
    currency: "EUR",
    value: item.price,
    items: toGaItems([item]),
  });
}

export function trackViewCart(total: number, items: EventItem[]) {
  gtagEvent("view_cart", {
    currency: "EUR",
    value: total,
    items: toGaItems(items),
  });
}

export function trackBeginCheckout(total: number, items: EventItem[]) {
  gtagEvent("begin_checkout", {
    currency: "EUR",
    value: total,
    items: toGaItems(items),
  });
}

// Inquiry submission. Rentals are quote-style inquiries, not paid bookings,
// so this fires `generate_lead` (not `purchase`) to keep GA4 revenue clean.
export function trackGenerateLead(
  inquiryId: string,
  total: number,
  meta: { itemsCount: number; deliveryType: string; needsR1?: boolean }
) {
  gtagEvent("generate_lead", {
    transaction_id: inquiryId,
    currency: "EUR",
    value: total,
    items_count: meta.itemsCount,
    delivery_type: meta.deliveryType,
    needs_r1: meta.needsR1 ?? false,
  });
}

// --- Custom events ----------------------------------------------------------

export function trackPromoApplied(promoCode: string, discountValue: number) {
  gtagEvent("promo_applied", {
    promo_code: promoCode,
    discount_value: discountValue,
  });
}

export function trackAvailabilityChecked(
  itemId: string,
  rentalStart: string,
  rentalEnd: string,
  days: number
) {
  gtagEvent("availability_checked", {
    item_id: itemId,
    rental_start: rentalStart,
    rental_end: rentalEnd,
    days,
  });
}

export function trackBundleViewed(bundleId: string, bundleName: string) {
  gtagEvent("bundle_viewed", {
    bundle_id: bundleId,
    bundle_name: bundleName,
  });
}

export function trackBlogRead(postSlug: string, readingTime?: number | null) {
  gtagEvent("blog_read", {
    post_slug: postSlug,
    ...(readingTime != null ? { reading_time: readingTime } : {}),
  });
}

export function trackPhoneClick() {
  gtagEvent("phone_click", { event_category: "engagement" });
}

// Simple contact-form submissions (no cart/value attached). Inquiries with a
// cart go through trackGenerateLead instead.
export function trackContactForm(source: "homepage" | "kontakt") {
  gtagEvent("generate_lead", { method: "contact_form", source });
}
