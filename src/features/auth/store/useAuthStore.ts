import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface UserProfile {
  id: string
  name: string
  phone?: string
  email?: string
}

interface AuthStore {
  user: UserProfile | null
  login: (user: UserProfile) => void
  logout: () => void
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

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null })
    }),
    {
      name: 'bloomcakes-auth-storage',
      storage: createJSONStorage(() => safeStorage)
    }
  )
)
