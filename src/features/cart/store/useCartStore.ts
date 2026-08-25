import { create } from 'zustand'
import { CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

// Global cart Zustand store with state handlers
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (newItem) => {
    const existing = get().items.find(
      (item) =>
        item.cakeId === newItem.cakeId &&
        item.weight === newItem.weight
    )

    if (existing) {
      set({
        items: get().items.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        )
      })
    } else {
      const generatedId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      set({
        items: [...get().items, { ...newItem, id: generatedId, quantity: newItem.quantity || 1 }]
      })
    }
  },
  removeItem: (id) => {
    set({ items: get().items.filter((item) => item.id !== id) })
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id)
      return
    }
    set({
      items: get().items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    })
  },
  clearCart: () => set({ items: [] }),
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
  }
}))
