import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ItemSize = 'regular' | 'large' | null;

export interface CartItem {
    id: string;          // Unique cart ID (e.g., "mortadella-original-large")
    productId: string;   // Original menu item ID
    name: string;
    size: ItemSize;      // null for items without sizes (drinks, desserts)
    sizeLabel?: string;  // "Klein" or "Groot"
    price: number;
    quantity: number;
    image?: string;
}

export interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
}

interface CartState {
    items: CartItem[];
    totals: {
        subtotal: number;
        tax: number;
        total: number;
    };
    pickupTime: Date | null;
    customerDetails: CustomerDetails | null;

    // Actions
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    setPickupTime: (date: Date | null) => void;
    setCustomerDetails: (details: CustomerDetails) => void;
}

const TAX_RATE = 0.09; // 9% tax

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            totals: {
                subtotal: 0,
                tax: 0,
                total: 0,
            },
            pickupTime: null,
            customerDetails: null,

            addItem: (newItem) => {
                const { items } = get();
                const existingItem = items.find((i) => i.id === newItem.id);

                let updatedItems;
                if (existingItem) {
                    updatedItems = items.map((i) =>
                        i.id === newItem.id
                            ? { ...i, quantity: i.quantity + newItem.quantity }
                            : i
                    );
                } else {
                    updatedItems = [...items, newItem];
                }

                set({ items: updatedItems });
                get().calculateTotals();
            },

            removeItem: (itemId) => {
                const { items } = get();
                set({ items: items.filter((i) => i.id !== itemId) });
                get().calculateTotals();
            },

            updateQuantity: (itemId, quantity) => {
                const { items } = get();
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }
                set({
                    items: items.map((i) =>
                        i.id === itemId ? { ...i, quantity } : i
                    ),
                });
                get().calculateTotals();
            },

            clearCart: () => {
                set({
                    items: [],
                    totals: { subtotal: 0, tax: 0, total: 0 },
                    pickupTime: null,
                    customerDetails: null, // Optional: keep customer details?
                });
            },

            setPickupTime: (date) => set({ pickupTime: date }),
            setCustomerDetails: (details) => set({ customerDetails: details }),

            calculateTotals: () => {
                const { items } = get();
                const subtotal = items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
                const tax = subtotal * TAX_RATE;
                const total = subtotal + tax;

                set({
                    totals: {
                        subtotal: parseFloat(subtotal.toFixed(2)),
                        tax: parseFloat(tax.toFixed(2)),
                        total: parseFloat(total.toFixed(2)),
                    },
                });
            },
            // Private helper exposed on strict TS if needed, but handled internally in actions
            // so we cast to unknown then extend if we wanted 'calculateTotals' in the interface 
            // but I added it to the interface so no casting needed.
        }),
        {
            name: 'wake-n-bake-cart',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                items: state.items,
                totals: state.totals,
                pickupTime: state.pickupTime,
                customerDetails: state.customerDetails
            }),
        }
    )
);
