'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { MenuItem } from '@/lib/data/menu'

export interface CartItem extends MenuItem {
  quantity: number
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
}

export interface OrderData {
  items: CartItem[]
  total: number
  customer: CustomerInfo
  pickupTime: string
  orderNumber: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (itemId: string) => number
  totalItems: number
  totalPrice: number
  // Order state
  orderData: OrderData | null
  setOrderData: (data: OrderData) => void
  clearOrderData: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'wnb-cart'
const ORDER_STORAGE_KEY = 'wnb-last-order'

// Helper to parse price string to number
function parsePrice(priceString: string): number {
  // Remove € symbol and convert comma to dot, then parse
  return parseFloat(priceString.replace('€', '').replace(',', '.').trim())
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [orderData, setOrderDataState] = useState<OrderData | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
      const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY)
      if (savedOrder) {
        setOrderDataState(JSON.parse(savedOrder))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [items, isHydrated])

  // Save order data to localStorage
  useEffect(() => {
    if (isHydrated && orderData) {
      try {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderData))
      } catch (error) {
        console.error('Error saving order to localStorage:', error)
      }
    }
  }, [orderData, isHydrated])

  const addItem = (item: MenuItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getItemQuantity = (itemId: string): number => {
    const item = items.find((i) => i.id === itemId)
    return item ? item.quantity : 0
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = items.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity
  }, 0)

  const setOrderData = (data: OrderData) => {
    setOrderDataState(data)
  }

  const clearOrderData = () => {
    setOrderDataState(null)
    try {
      localStorage.removeItem(ORDER_STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing order from localStorage:', error)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalItems,
        totalPrice,
        orderData,
        setOrderData,
        clearOrderData,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
