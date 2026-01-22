import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
  stock: number;
  subscriptionInterval?: string; // e.g., 'monthly', 'quarterly'
  isSubscription?: boolean;
}

export interface CartStore {
  items: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string | null, amount: number) => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      discountAmount: 0,

      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }

          return { items: [...state.items, item] };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }));
      },

      clearCart: () => set({ items: [], discountCode: null, discountAmount: 0 }),

      applyCoupon: (code, amount) => set({ discountCode: code, discountAmount: amount }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = subtotal >= 600 ? 0 : 50;
        const discount = get().discountAmount;
        return Math.max(0, subtotal + shipping - discount);
      },
    }),
    {
      name: 'tattva_cart_store',
    }
  )
);

export default useCartStore;
