import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { API_BASE_URL } from '@/config/api'

export interface DeliveryLocation {
  pincode: string
  city: string
  state?: string
  isServiceable: boolean
}

interface LocationStore {
  location: DeliveryLocation | null
  isChecking: boolean
  error: string | null
  checkPincode: (pincode: string) => Promise<boolean>
  setLocation: (loc: DeliveryLocation | null) => void
  clearLocation: () => void
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

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      location: null,
      isChecking: false,
      error: null,
      checkPincode: async (pincode: string) => {
        const cleanPin = pincode.trim()
        if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
          set({ error: 'Please enter a valid 6-digit pincode.' })
          return false
        }
        set({ isChecking: true, error: null })
        try {
          const response = await fetch(`${API_BASE_URL}/pincodes?code=${cleanPin}`)
          if (response.ok) {
            const data = await response.json()
            if (data.serviceable) {
              const loc: DeliveryLocation = {
                pincode: cleanPin,
                city: data.city || 'Ahmedabad',
                state: data.state || 'Gujarat',
                isServiceable: true
              }
              set({ location: loc, isChecking: false, error: null })
              return true
            } else {
              set({
                isChecking: false,
                error: `Sorry, we do not deliver to pincode ${cleanPin} yet.`
              })
              return false
            }
          } else {
            set({ isChecking: false, error: 'Unable to verify pincode. Please try again.' })
            return false
          }
        } catch (err) {
          console.error(err)
          set({ isChecking: false, error: 'Network error checking pincode.' })
          return false
        }
      },
      setLocation: (loc) => set({ location: loc, error: null }),
      clearLocation: () => set({ location: null, error: null })
    }),
    {
      name: 'bloomcakes-location-storage',
      storage: createJSONStorage(() => safeStorage)
    }
  )
)
