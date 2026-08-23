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
  items: [
    // Pre-populate with typical premium selection for checkout flows preview
    {
      id: 'item-1',
      cakeId: 'c1',
      name: 'Belgian Chocolate Cake',
      slug: 'belgian-chocolate',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApZkJY6QschRPOB3x6-l8poxgy8aQmmu6tGSdCweuEr9GNxx80MjOyL-V6aPDgzTXkEnt9bEzdyvHM3ga5_WHNlz99MLqqUyBTHztAdF_idQhxFek4LpY-SmLqxAfqyqVxVny-1zqHSV2-gzfj4fTrvflbGADllc3ezN69kDBRlwKBGK0zMgF6JYbTMKgXCd5-z5NpSN_aixjKyGNho7lOOpf1I9w80b4lx0UvbJtdmE8ScIVfKKtY',
      price: 1499,
      weight: '1kg',
      isEggless: true,
      quantity: 1
    },
    {
      id: 'item-2',
      cakeId: 'c4',
      name: 'Blueberry Cheesecake',
      slug: 'blueberry-cheesecake',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdx960xx5hnckATCpxOit7JMiNmp3wfnsQCXlJK3sCQDEdDETTHq7li5kRsBZwgyE7xa0TNAGJFZTehhmbUVjEySFFC6lmT6nxjwpNxoGrRaTAnx4j9PJLIhvyiIPVpOGUdTtLUF7yFFCDH_4-V8AETSibCU4NLfEUbPRI7ls0Z8T_9FTeeXtHuUhivZDLAWikMSltarpEgZApbhwkjhuUA1499xI1Wz4PjgaVyDEsPB6Wd81lC_Mh',
      price: 999,
      weight: '0.5kg',
      isEggless: false,
      quantity: 2
    }
  ],
  addItem: (newItem) => {
    const existing = get().items.find(
      (item) =>
        item.cakeId === newItem.cakeId &&
        item.weight === newItem.weight &&
        item.isEggless === newItem.isEggless
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
