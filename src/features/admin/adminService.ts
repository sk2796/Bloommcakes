import { API_BASE_URL } from '@/config/api'
import { 
  AdminProduct, 
  AdminProductPayload, 
  AdminOrder, 
  AdminCustomer, 
  AdminPincode, 
  AdminAnalytics,
  AdminUser,
  AdminUserPayload
} from './types'

export const adminService = {
  async getAnalytics(): Promise<AdminAnalytics> {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`)
    if (!res.ok) throw new Error('Failed to fetch analytics')
    return res.json()
  },

  async getProducts(): Promise<AdminProduct[]> {
    const res = await fetch(`${API_BASE_URL}/products`)
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  },

  async createProduct(payload: AdminProductPayload): Promise<AdminProduct> {
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to create product')
    }
    return res.json()
  },

  async updateProduct(id: string, payload: Partial<AdminProductPayload>): Promise<AdminProduct> {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to update product')
    }
    return res.json()
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to delete product')
  },

  async getOrders(): Promise<AdminOrder[]> {
    const res = await fetch(`${API_BASE_URL}/admin/orders`)
    if (!res.ok) throw new Error('Failed to fetch orders')
    return res.json()
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to update order status')
    }
  },

  async getCustomers(): Promise<AdminCustomer[]> {
    const res = await fetch(`${API_BASE_URL}/admin/customers`)
    if (!res.ok) throw new Error('Failed to fetch customers')
    return res.json()
  },

  async getPincodes(): Promise<AdminPincode[]> {
    const res = await fetch(`${API_BASE_URL}/admin/pincodes`)
    if (!res.ok) throw new Error('Failed to fetch pincodes')
    return res.json()
  },

  async addPincode(pincode: string, city: string, state: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/pincodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode, city, state })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to add pincode')
    }
  },

  async deletePincode(code: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/pincodes/${code}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to remove pincode')
  },

  async login(email: string, password: string): Promise<{ admin_user: AdminUser; token: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Login failed')
    }
    return res.json()
  },

  async getAdminUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE_URL}/admin/users`)
    if (!res.ok) throw new Error('Failed to fetch admin staff')
    return res.json()
  },

  async createAdminUser(payload: AdminUserPayload): Promise<AdminUser> {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to create admin staff')
    }
    const data = await res.json()
    return data.user
  },

  async updateAdminUser(adminId: string, payload: Partial<AdminUserPayload>): Promise<AdminUser> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${adminId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to update staff member')
    }
    const data = await res.json()
    return data.user
  },

  async deleteAdminUser(adminId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${adminId}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to delete staff member')
    }
  }
}
