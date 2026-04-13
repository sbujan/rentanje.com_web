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
}

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
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
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...item } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      updateQty: (productId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, qty } : i
          ),
        })),

      applyPromo: (code, discount) => set({ promoCode: code, discount }),
      clearPromo: () => set({ promoCode: null, discount: 0 }),
      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),
    }),
    { name: "rentanje-cart" }
  )
);
