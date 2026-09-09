export interface AdminProduct {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  category: string
  imageUrl: string
  isBestseller?: boolean
  rating?: number
}

export interface AdminProductPayload {
  name: string
  category: string
  price: number
  description?: string
  imageUrl: string
  isBestseller?: boolean
  rating?: number
}

export interface AdminOrder {
  order_id: string
  customer_id?: string
  name: string
  phone: string
  email?: string
  addressLine1: string
  landmark?: string
  city: string
  pincode: string
  date: string
  timeSlot: string
  occasion: string
  customOccasion?: string
  items_summary: string
  activePromo?: string
  discountAmount?: number
  totalAmount: number
  status: 'order_confirmed' | 'shipped' | 'delivered' | 'cancelled' | string
  created_at: string
}

export interface AdminCustomer {
  customer_id: string
  name: string
  phone: string
  email?: string
  city?: string
  state?: string
  pincode?: string
  updated_at?: string
}

export interface AdminPincode {
  pincode: string
  city: string
  state: string
}

export interface AdminAnalytics {
  total_revenue: number
  total_orders: number
  total_customers: number
  total_products: number
  status_counts: Record<string, number>
  recent_orders: Array<{
    order_id: string
    name: string
    phone: string
    totalAmount: number
    status: string
    created_at: string
  }>
}

export type AdminRole = 'super_admin' | 'manager' | 'delivery_staff' | 'catalog_editor'

export interface AdminUser {
  id?: number
  admin_id: string
  name: string
  email: string
  role: AdminRole
  is_active: boolean
  created_at?: string
}

export interface AdminUserPayload {
  name: string
  email: string
  password: string
  role: AdminRole
  is_active?: boolean
}
