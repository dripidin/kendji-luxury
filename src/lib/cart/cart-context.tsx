"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { trackEvent } from "@/lib/analytics"

export interface CartItem {
  key: string; // unique key: `${productId}__${variantId || 'standard'}`
  productId: string;
  variantId?: string;
  quantity: number;
  name: string;
  variantName?: string;
  image: string;
  unitPrice: number;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'key'>) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = "kendji_cart_v1"

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Ignore error
  }
  return []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialCart)
  const [isOpen, setIsOpen] = useState(false)

  // Persist items to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Ignore storage write error
    }
  }, [items])

  const openCart = useCallback(() => {
    setIsOpen(true)
    trackEvent('view_cart', {
      value: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
      items: items.map(i => ({
        item_id: i.productId,
        item_name: i.name,
        item_variant: i.variantName,
        price: i.unitPrice,
        quantity: i.quantity
      }))
    })
  }, [items])

  const closeCart = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const addItem = useCallback((itemData: Omit<CartItem, 'key'>) => {
    const key = `${itemData.productId}__${itemData.variantId || 'standard'}`
    const validatedQty = Math.max(1, Math.floor(itemData.quantity || 1))

    setItems(prevItems => {
      const existingIdx = prevItems.findIndex(i => i.key === key)
      if (existingIdx > -1) {
        const updated = [...prevItems]
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + validatedQty
        }
        return updated
      } else {
        return [...prevItems, { ...itemData, key, quantity: validatedQty }]
      }
    })

    trackEvent('add_to_cart', {
      value: itemData.unitPrice * validatedQty,
      items: [{
        item_id: itemData.productId,
        item_name: itemData.name,
        item_variant: itemData.variantName,
        price: itemData.unitPrice,
        quantity: validatedQty
      }]
    })

    setIsOpen(true)
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems(prev => prev.filter(i => i.key !== key))
  }, [])

  const updateQuantity = useCallback((key: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(key)
      return
    }
    const validated = Math.floor(newQty)
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: validated } : i))
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore
    }
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        subtotal,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
