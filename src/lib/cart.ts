import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";

export interface CartItem {
  productId: string;
  productName: string;
  heroImage: string;
  slug: string;
  rentalStart: string; // local calendar day, "YYYY-MM-DD" (matches DB `date` columns)
  rentalEnd: string;   // local calendar day, "YYYY-MM-DD"
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

/** Runtime validator mirroring the CartItem interface, for JSONB boundaries. */
export const cartItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  heroImage: z.string(),
  slug: z.string(),
  rentalStart: z.string(),
  rentalEnd: z.string(),
  days: z.number(),
  minRentalDays: z.union([z.literal(1), z.literal(3), z.literal(7)]),
  priceTierLabel: z.string(),
  priceForTier: z.number(),
  totalPrice: z.number(),
  depositAmount: z.number(),
  qty: z.number(),
  bundleId: z.string().nullable().optional(),
  bundleName: z.string().nullable().optional(),
  bundleDiscountAmount: z.number().optional(),
});

/**
 * Parse untrusted data (e.g. the inquiries.items JSONB column) into CartItems.
 * Invalid elements are skipped rather than failing the whole list.
 */
export function parseCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const items: CartItem[] = [];
  for (const element of raw) {
    const parsed = cartItemSchema.safeParse(element);
    if (parsed.success) items.push(parsed.data);
  }
  return items;
}

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
  addItem: (item: CartItem) => void;
  addBundle: (items: CartItem[]) => void;
  removeItem: (productId: string) => void;
  removeBundle: (bundleId: string) => void;
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

      applyPromo: (code, discount) => set({ promoCode: code, discount }),
      clearPromo: () => set({ promoCode: null, discount: 0 }),
      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),
    }),
    { name: "rentanje-cart" }
  )
);
