import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AdminUser, AdminRole } from '../types'

interface AdminAuthState {
  user: AdminUser | null
  token: string | null
  login: (user: AdminUser, token: string) => void
  logout: () => void
  hasPermission: (module: 'analytics' | 'products' | 'orders' | 'customers' | 'pincodes' | 'users') => boolean
}

// In-memory mock storage fallback for testing environment
const memoryStorage: Record<string, string> = {}
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key)
      } catch {
        // Fallback
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
        // Fallback
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
        // Fallback
      }
    }
    delete memoryStorage[key]
  }
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      hasPermission: (module) => {
        const { user } = get()
        if (!user || !user.is_active) return false

        const role = user.role as AdminRole

        // Super Admin has access to everything
        if (role === 'super_admin') return true

        // Store Manager has access to everything except admin staff user management
        if (role === 'manager') {
          return module !== 'users'
        }

        // Delivery Staff only has access to Orders & Fulfillment
        if (role === 'delivery_staff') {
          return module === 'orders'
        }

        // Catalog Editor only has access to Products & Menu
        if (role === 'catalog_editor') {
          return module === 'products'
        }

        return false
      }
    }),
    {
      name: 'bloomcakes-admin-auth',
      storage: createJSONStorage(() => safeStorage)
    }
  )
)
