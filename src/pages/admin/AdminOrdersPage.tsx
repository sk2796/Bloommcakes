import { useEffect, useState } from 'react'
import { 
  Search, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  Phone, 
  ChevronDown, 
  RefreshCw,
  Tag
} from 'lucide-react'
import { adminService } from '@/features/admin/adminService'
import { AdminOrder } from '@/features/admin/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await adminService.getOrders()
      setOrders(data)
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      await adminService.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o))
    } catch (err: any) {
      alert(err.message || 'Failed to update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_id.toLowerCase().includes(search.toLowerCase()) ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      (o.customer_id && o.customer_id.toLowerCase().includes(search.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || (o.status || 'order_confirmed') === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d0e17] tracking-tight">
            Order Fulfillment Pipeline
          </h1>
          <p className="text-sm text-[#735751] mt-1">
            Track customer deliveries, update order statuses, and view delivery details.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5d5cf] text-[#2d0e17] text-sm font-medium hover:bg-[#faeee8] transition-colors shadow-sm disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ebd8d0] shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#916b61]" />
          <input
            type="text"
            placeholder="Search by Order ID, name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] bg-[#fdfaf8]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'order_confirmed', label: 'Confirmed' },
            { id: 'shipped', label: 'Out for Delivery' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? 'bg-[#4a1525] text-white'
                  : 'bg-[#fdfaf8] text-[#735751] hover:bg-[#faeee8] border border-[#e5d5cf]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Order Cards / Roster */}
      {loading ? (
        <div className="p-16 text-center text-[#916b61]">
          <div className="w-8 h-8 border-4 border-[#e76f51] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading orders list...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ebd8d0] p-12 text-center">
          <ShoppingBag size={40} className="mx-auto text-[#e5d5cf] mb-3" />
          <h3 className="text-base font-bold text-[#2d0e17]">No orders matching your criteria</h3>
          <p className="text-xs text-[#735751] mt-1">Orders placed on the storefront will appear here instantly.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.order_id
            const currentStatus = ord.status || 'order_confirmed'
            const isUpdating = updatingId === ord.order_id

            return (
              <div
                key={ord.order_id}
                className="bg-white rounded-2xl border border-[#ebd8d0] shadow-sm overflow-hidden transition-all hover:border-[#e76f51]/40"
              >
                {/* Main Summary Header Row */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#faeee8] border border-[#ebd8d0] flex items-center justify-center text-[#4a1525] shrink-0 font-bold">
                      📦
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#2d0e17] bg-[#fdf2ee] px-2.5 py-1 rounded-lg border border-[#ebd8d0]">
                          {ord.order_id}
                        </span>
                        <span className="font-bold text-base text-[#2d0e17]">{ord.name}</span>
                        {ord.customer_id && (
                          <span className="font-mono text-[11px] text-[#916b61] bg-gray-100 px-2 py-0.5 rounded border">
                            {ord.customer_id}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#735751] mt-2">
                        <span className="flex items-center gap-1 font-medium">
                          <Phone size={13} className="text-[#916b61]" /> {ord.phone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-[#916b61]" /> Delivery: {ord.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-[#916b61]" /> Slot: {ord.timeSlot}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Action Controls */}
                  <div className="flex items-center gap-4 self-end lg:self-auto flex-wrap">
                    <div className="text-right mr-2">
                      <div className="text-xs text-[#916b61] uppercase tracking-wider font-semibold">Total Paid</div>
                      <div className="text-lg font-bold text-[#2d0e17]">₹{ord.totalAmount}</div>
                    </div>

                    {/* Status Select dropdown */}
                    <div className="relative">
                      <select
                        disabled={isUpdating}
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(ord.order_id, e.target.value)}
                        className={`
                          text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl border appearance-none pr-8 cursor-pointer transition-all
                          ${currentStatus === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            currentStatus === 'shipped' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            currentStatus === 'cancelled' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                            'bg-blue-50 text-blue-800 border-blue-300'}
                          disabled:opacity-50
                        `}
                      >
                        <option value="order_confirmed">Confirmed</option>
                        <option value="shipped">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-70" />
                    </div>

                    {/* Expand Details button */}
                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : ord.order_id)}
                      className="px-3 py-2 rounded-xl border border-[#e5d5cf] hover:bg-[#faeee8] text-xs font-semibold text-[#735751] transition-colors"
                    >
                      {isExpanded ? 'Hide Details' : 'View Full Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="p-6 bg-[#fdf8f5] border-t border-[#ebd8d0] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    {/* Items Ordered */}
                    <div className="space-y-2 md:col-span-1">
                      <span className="font-bold text-[#2d0e17] uppercase tracking-wider text-[11px] block">
                        Cakes & Items Ordered
                      </span>
                      <div className="bg-white p-3.5 rounded-xl border border-[#ebd8d0] text-sm text-[#2d0e17] leading-relaxed font-medium">
                        {ord.items_summary}
                      </div>
                      {ord.activePromo && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Tag size={13} /> Promo Applied: {ord.activePromo} (-₹{ord.discountAmount || 0})
                        </div>
                      )}
                    </div>

                    {/* Delivery Destination */}
                    <div className="space-y-2 md:col-span-1">
                      <span className="font-bold text-[#2d0e17] uppercase tracking-wider text-[11px] block">
                        Delivery Address
                      </span>
                      <div className="bg-white p-3.5 rounded-xl border border-[#ebd8d0] space-y-1 text-[#2d0e17]">
                        <div className="font-medium">{ord.addressLine1}</div>
                        {ord.landmark && <div className="text-[#735751]">Landmark: {ord.landmark}</div>}
                        <div className="font-semibold text-xs text-[#4a1525]">
                          {ord.city} — {ord.pincode}
                        </div>
                      </div>
                    </div>

                    {/* Occasion & Meta */}
                    <div className="space-y-2 md:col-span-1">
                      <span className="font-bold text-[#2d0e17] uppercase tracking-wider text-[11px] block">
                        Occasion & Special Request
                      </span>
                      <div className="bg-white p-3.5 rounded-xl border border-[#ebd8d0] space-y-1 text-[#2d0e17]">
                        <div><span className="text-[#735751]">Occasion:</span> <span className="font-semibold">{ord.occasion}</span></div>
                        {ord.customOccasion && (
                          <div><span className="text-[#735751]">Message:</span> "{ord.customOccasion}"</div>
                        )}
                        {ord.email && (
                          <div><span className="text-[#735751]">Email:</span> {ord.email}</div>
                        )}
                        <div className="text-[11px] text-[#916b61] pt-1">
                          Placed on: {ord.created_at || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
