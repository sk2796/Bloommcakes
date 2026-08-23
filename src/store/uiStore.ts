import { create } from 'zustand'

interface CartUIState {
  isCartOpen: boolean
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartUIStore = create<CartUIState>((set) => ({
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}))
