// Google Analytics 4 event helpers
// Only fires when NEXT_PUBLIC_GA_MEASUREMENT_ID is set

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function gtagEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Standard ecommerce events
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

export function trackBeginCheckout(total: number, items: { id: string; name: string; price: number }[]) {
  gtagEvent("begin_checkout", {
    currency: "EUR",
    value: total,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price })),
  });
}

export function trackPurchase(inquiryId: string, total: number, items: { id: string; name: string; price: number }[]) {
  gtagEvent("purchase", {
    transaction_id: inquiryId,
    currency: "EUR",
    value: total,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price })),
  });
}
