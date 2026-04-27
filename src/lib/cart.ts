import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  productName: string;
  heroImage: string;
  slug: string;
  rentalStart: string; // ISO date string (serialisable)
  rentalEnd: string;
  days: number;
  minRentalDays: 1 | 3 | 7;
  priceTierLabel: string; // "1 dan" | "3 dana" | "7 dana"
  priceForTier: number;   // price for the tier period (e.g. 80 for 3 days)
  totalPrice: number;     // priceForTier / tierDays * days
  depositAmount: number;  // 0 if none
  qty: number;
  // Bundle metadata: when an item was added as part of a bundle, every line
  // from that bundle shares the same bundleId so the cart UI can group them
  // and apply the bundle-level discount once.
  bundleId?: string | null;
  bundleName?: string | null;
  bundleDiscountAmount?: number; // amount in EUR, applied once per bundleId
}

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
  addItem: (item: CartItem) => void;
  addBundle: (items: CartItem[]) => void;
  removeItem: (productId: string) => void;
  removeBundle: (bundleId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  applyPromo: (code: string, discount: number) => void;
  clearPromo: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      promoCode: null,
      discount: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && (i.bundleId ?? null) === (item.bundleId ?? null)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && (i.bundleId ?? null) === (item.bundleId ?? null)
                  ? { ...item }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      addBundle: (newItems) =>
        set((state) => {
          if (newItems.length === 0) return state;
          const bundleId = newItems[0].bundleId;
          if (!bundleId) return state;
          // Replace any existing lines for this bundle.
          const remaining = state.items.filter((i) => i.bundleId !== bundleId);
          return { items: [...remaining, ...newItems] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && !i.bundleId)
          ),
        })),

      removeBundle: (bundleId) =>
        set((state) => ({ items: state.items.filter((i) => i.bundleId !== bundleId) })),

      updateQty: (productId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && !i.bundleId ? { ...i, qty } : i
          ),
        })),

      applyPromo: (code, discount) => set({ promoCode: code, discount }),
      clearPromo: () => set({ promoCode: null, discount: 0 }),
      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),
    }),
    { name: "rentanje-cart" }
  )
);
