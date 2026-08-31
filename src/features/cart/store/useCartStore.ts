import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

// In-memory mock storage fallback for test environment
const memoryStorage: Record<string, string> = {}
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key)
      } catch {
        // Fallback to memory
      }
    }
    return memoryStorage[key] || null
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value)
        return
      } catch {
        // Fallback to memory
      }
    }
    memoryStorage[key] = value
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key)
        return
      } catch {
        // Fallback to memory
      }
    }
    delete memoryStorage[key]
  }
}

// Global cart Zustand store with state handlers and localStorage persistence
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'bloomcakes-cart-storage',
      storage: createJSONStorage(() => safeStorage)
    }
  )
)
