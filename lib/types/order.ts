// ============================================
// ORDER SYSTEM TYPES
// Based on products.json from Uber Eats menu
// ============================================

import type { LocationId } from '@/lib/data/locations';

/**
 * Product from the menu
 */
/**
 * Extra/add-on option for a product
 */
export interface ProductExtra {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
  hasSizes?: boolean;
  priceRegular?: number;
  priceLarge?: number;
  availableExtras?: ProductExtra[];
  /** Filialen waar dit product te koop is. Leeg/undefined = beide locaties. */
  availableAt?: LocationId[];
}

/**
 * Menu type: which menu a category belongs to
 * - 'schiacciata': Schiacciata Menu (made fresh to order)
 * - 'togo': Wake n' Bake Menu (ready to go)
 */
export type MenuType = 'schiacciata' | 'togo';

/**
 * Category grouping products
 */
export interface Category {
  id: string;
  name: string;
  menu?: MenuType;
  products: Product[];
  /** Filialen waar deze categorie getoond wordt. Leeg/undefined = beide locaties. */
  availableAt?: LocationId[];
}

/**
 * Raw product data from products.json
 */
export interface RawProduct {
  name: string;
  description: string;
  price: string;
}

/**
 * Raw products.json structure
 */
export interface RawProductsData {
  [categoryName: string]: RawProduct[];
}

/**
 * Cart item representing a product in the cart
 * Note: No toppings/extras as none exist in the source data
 */
export interface OrderCartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  size?: 'regular' | 'large';
}

/**
 * Cart state for the order system
 */
export interface OrderCart {
  items: OrderCartItem[];
  subtotal: number;
  total: number;
}

/**
 * Customer details for checkout
 */
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

/**
 * Order for submission
 */
export interface Order {
  id: string;
  items: OrderCartItem[];
  customer: CustomerInfo;
  subtotal: number;
  total: number;
  pickupTime: string;
  createdAt: string;
  status: OrderStatus;
}

/**
 * Order status enum
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

/**
 * API response for adding item to cart
 */
export interface AddToCartResponse {
  success: boolean;
  cart: OrderCart;
  message?: string;
}

/**
 * API response for checkout
 */
export interface CheckoutResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

/**
 * Line item for cart summary display
 */
export interface CartLineItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/**
 * Cart summary with all totals
 */
export interface CartSummary {
  lineItems: CartLineItem[];
  itemCount: number;
  subtotal: number;
  total: number;
}
