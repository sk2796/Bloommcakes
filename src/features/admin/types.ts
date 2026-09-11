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
  status: 'order_confirmed' | 'dispatched' | 'shipped' | 'delivered' | 'cancelled' | string
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

// Delivery / Shipping types
export interface ShippingProvider {
  id: string
  name: string
  description: string
  configured: boolean
}

export interface DeliveryQuote {
  provider: string
  estimated_price: number
  currency: string
  estimated_duration_minutes?: number
  vehicle_type?: string
}

export interface DeliveryInfo {
  delivery_id: string
  order_id: string
  provider: string
  provider_order_id?: string
  pickup_address: string
  delivery_address: string
  delivery_fee: number
  currency?: string
  tracking_url?: string
  rider_name?: string
  rider_phone?: string
  status: string
  created_at: string
  updated_at: string
}

export type DeliveryStatus =
  | 'pending'
  | 'accepted'
  | 'rider_assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'failed'

export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rider_assigned: 'Rider Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Failed',
}

export const DELIVERY_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-300' },
  accepted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  rider_assigned: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-300' },
  picked_up: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
  in_transit: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' },
  delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' },
  failed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
}

