// ============================================
// ORDER CART STORE
// Zustand store for order system
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { trackAddToCart } from '@/lib/analytics';
import type {
  OrderCartItem,
  CustomerInfo,
  CartSummary,
  CartLineItem,
} from '@/lib/types/order';

interface OrderStoreState {
  items: OrderCartItem[];
  customerInfo: CustomerInfo | null;
  pickupTime: string | null;

  // Computed values
  getCartSummary: () => CartSummary;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;

  // Actions
  addItem: (item: Omit<OrderCartItem, 'id' | 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  setPickupTime: (time: string | null) => void;
}

/**
 * Generate unique cart item ID
 */
function generateCartItemId(productId: string): string {
  return `${productId}-${Date.now()}`;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      customerInfo: null,
      pickupTime: null,

      /**
       * Get full cart summary with line items
       */
      getCartSummary: (): CartSummary => {
        const { items } = get();

        const lineItems: CartLineItem[] = items.map((item) => ({
          id: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          lineTotal: item.price * item.quantity,
        }));

        const subtotal = lineItems.reduce((acc, item) => acc + item.lineTotal, 0);
        const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

        return {
          lineItems,
          itemCount,
          subtotal: parseFloat(subtotal.toFixed(2)),
          total: parseFloat(subtotal.toFixed(2)),
        };
      },

      /**
       * Get total item count
       */
      getItemCount: (): number => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.quantity, 0);
      },

      /**
       * Get subtotal
       */
      getSubtotal: (): number => {
        const { items } = get();
        const subtotal = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        return parseFloat(subtotal.toFixed(2));
      },

      /**
       * Get total (same as subtotal, no additional fees)
       */
      getTotal: (): number => {
        return get().getSubtotal();
      },

      /**
       * Add item to cart
       * If same product already exists, increment quantity
       */
      addItem: (newItem) => {
        const { items } = get();

        // Check if product already in cart
        const existingItemIndex = items.findIndex(
          (item) => item.productId === newItem.productId
        );

        if (existingItemIndex !== -1) {
          // Increment quantity of existing item
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1,
          };
          set({ items: updatedItems });
        } else {
          // Add new item
          const cartItem: OrderCartItem = {
            ...newItem,
            id: generateCartItemId(newItem.productId),
            quantity: 1,
          };
          set({ items: [...items, cartItem] });
        }

        trackAddToCart({
          item_id: newItem.productId,
          item_name: newItem.name,
          price: newItem.price,
          quantity: 1,
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (itemId) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== itemId) });
      },

      /**
       * Update item quantity
       * Removes item if quantity is 0 or less
       */
      updateQuantity: (itemId, quantity) => {
        const { items } = get();

        if (quantity <= 0) {
          set({ items: items.filter((item) => item.id !== itemId) });
          return;
        }

        set({
          items: items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => {
        set({
          items: [],
          pickupTime: null,
        });
      },

      /**
       * Set customer information
       */
      setCustomerInfo: (info) => {
        set({ customerInfo: info });
      },

      /**
       * Set pickup time
       */
      setPickupTime: (time) => {
        set({ pickupTime: time });
      },
    }),
    {
      name: 'wake-n-bake-order-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        customerInfo: state.customerInfo,
        pickupTime: state.pickupTime,
      }),
    }
  )
);
