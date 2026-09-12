import { useEffect, useState, useMemo } from 'react'
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  RefreshCw
} from 'lucide-react'
import { adminService } from '@/features/admin/adminService'
import { AdminCustomer, AdminOrder } from '@/features/admin/types'
import { AdminFilterBar } from '@/components/admin/AdminFilterBar'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activityFilter, setActivityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('spend-desc')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [custData, ordData] = await Promise.all([
        adminService.getCustomers(),
        adminService.getOrders()
      ])
      setCustomers(custData)
      setOrders(ordData)
    } catch (err) {
      console.error('Failed to load customers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Calculate customer spending & order count metrics
  const getCustomerMetrics = (customerId: string, phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    const matched = orders.filter(
      o => o.customer_id === customerId || o.phone.replace(/\D/g, '').slice(-10) === cleanPhone
    )
    const totalSpend = matched.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    return {
      orderCount: matched.length,
      totalSpend,
      orders: matched
    }
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = search.toLowerCase().trim()
      const matchesSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        c.customer_id.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q))

      const metrics = getCustomerMetrics(c.customer_id, c.phone)
      let matchesActivity = true
      if (activityFilter === 'buyers') matchesActivity = metrics.orderCount > 0
      else if (activityFilter === 'new') matchesActivity = metrics.orderCount === 0

      return matchesSearch && matchesActivity
    }).sort((a, b) => {
      const metA = getCustomerMetrics(a.customer_id, a.phone)
      const metB = getCustomerMetrics(b.customer_id, b.phone)
      if (sortBy === 'spend-desc') return metB.totalSpend - metA.totalSpend
      if (sortBy === 'orders-desc') return metB.orderCount - metA.orderCount
      return a.name.localeCompare(b.name)
    })
  }, [customers, orders, search, activityFilter, sortBy])

  const selectedCustomer = customers.find(c => c.customer_id === selectedCustomerId)
  const selectedMetrics = selectedCustomer ? getCustomerMetrics(selectedCustomer.customer_id, selectedCustomer.phone) : null

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d0e17] tracking-tight">
            Customer Directory
          </h1>
          <p className="text-sm text-[#735751] mt-1">
            Registered customer accounts, contact details, total orders placed, and lifetime spend.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5d5cf] text-[#2d0e17] text-sm font-medium hover:bg-[#faeee8] transition-colors shadow-sm disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Common Filter Toolbar */}
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search directory by customer name, phone, email, city, or ID..."
        totalCount={customers.length}
        filteredCount={filteredCustomers.length}
        dropdownFilters={[
          {
            id: 'activity',
            label: 'Customer Activity',
            value: activityFilter,
            onChange: setActivityFilter,
            options: [
              { label: 'All Customers', value: 'all' },
              { label: 'Active Buyers (≥1 order)', value: 'buyers' },
              { label: 'New Accounts (0 orders)', value: 'new' }
            ]
          }
        ]}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Highest Lifetime Spend', value: 'spend-desc' },
          { label: 'Most Orders Placed', value: 'orders-desc' },
          { label: 'Name (A - Z)', value: 'name-asc' }
        ]}
        onResetAll={() => {
          setSearch('')
          setActivityFilter('all')
          setSortBy('spend-desc')
        }}
      />

      {/* Customers List & Profile Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table / List View */}
        <div className={`space-y-3 ${selectedCustomerId ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {loading ? (
            <div className="p-16 text-center text-[#916b61] bg-white rounded-2xl border border-[#ebd8d0]">
              <div className="w-8 h-8 border-4 border-[#e76f51] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading customer profiles...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#ebd8d0] p-12 text-center">
              <Users size={40} className="mx-auto text-[#e5d5cf] mb-3" />
              <h3 className="text-base font-bold text-[#2d0e17]">No customers found</h3>
              <p className="text-xs text-[#735751] mt-1">Customers will appear here when they register or place orders.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#ebd8d0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#fdf8f5] text-[11px] uppercase tracking-wider font-semibold text-[#916b61] border-b border-[#ebd8d0]">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Phone & Email</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Orders Placed</th>
                      <th className="p-4">Lifetime Spend</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebd8d0]/60">
                    {filteredCustomers.map((c) => {
                      const metrics = getCustomerMetrics(c.customer_id, c.phone)
                      const isSelected = selectedCustomerId === c.customer_id

                      return (
                        <tr
                          key={c.customer_id}
                          className={`hover:bg-[#fffcfb] transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#fef4ee]' : ''
                          }`}
                          onClick={() => setSelectedCustomerId(isSelected ? null : c.customer_id)}
                        >
                          <td className="p-4">
                            <div className="font-bold text-[#2d0e17]">{c.name}</div>
                            <div className="font-mono text-xs text-[#916b61] bg-[#fdf2ee] px-2 py-0.5 rounded border border-[#ebd8d0] inline-block mt-0.5">
                              {c.customer_id}
                            </div>
                          </td>

                          <td className="p-4 space-y-0.5 text-xs">
                            <div className="font-medium text-[#2d0e17]">📞 {c.phone}</div>
                            {c.email && <div className="text-[#735751]">✉️ {c.email}</div>}
                          </td>

                          <td className="p-4 text-xs">
                            {c.city || c.pincode ? (
                              <span className="text-[#735751]">{c.city || ''} {c.pincode ? `(${c.pincode})` : ''}</span>
                            ) : (
                              <span className="text-[#916b61] italic">Not set</span>
                            )}
                          </td>

                          <td className="p-4 font-semibold text-[#2d0e17]">
                            {metrics.orderCount} orders
                          </td>

                          <td className="p-4 font-bold text-emerald-700">
                            ₹{metrics.totalSpend}
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedCustomerId(isSelected ? null : c.customer_id)
                              }}
                              className="text-xs font-semibold text-[#e76f51] hover:underline"
                            >
                              {isSelected ? 'Close' : 'View History'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Selected Customer Drawer */}
        {selectedCustomer && selectedMetrics && (
          <div className="bg-white rounded-2xl border border-[#ebd8d0] shadow-sm p-6 space-y-6 h-fit">
            <div className="flex items-center justify-between border-b border-[#ebd8d0] pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#2d0e17]">{selectedCustomer.name}</h3>
                <span className="font-mono text-xs text-[#916b61]">{selectedCustomer.customer_id}</span>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="text-xs font-semibold text-[#735751] hover:text-[#2d0e17]"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[#735751]">
                <Phone size={14} className="text-[#916b61]" />
                <span className="font-medium text-[#2d0e17]">{selectedCustomer.phone}</span>
              </div>
              {selectedCustomer.email && (
                <div className="flex items-center gap-2 text-[#735751]">
                  <Mail size={14} className="text-[#916b61]" />
                  <span>{selectedCustomer.email}</span>
                </div>
              )}
              {(selectedCustomer.city || selectedCustomer.pincode) && (
                <div className="flex items-center gap-2 text-[#735751]">
                  <MapPin size={14} className="text-[#916b61]" />
                  <span>{selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.pincode}</span>
                </div>
              )}
            </div>

            {/* Metrics pills */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#faeee8] border border-[#ebd8d0] text-center">
                <div className="text-xs text-[#735751] font-medium">Orders Count</div>
                <div className="text-xl font-bold text-[#4a1525] mt-1">{selectedMetrics.orderCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-xs text-emerald-700 font-medium">Lifetime Spend</div>
                <div className="text-xl font-bold text-emerald-800 mt-1">₹{selectedMetrics.totalSpend}</div>
              </div>
            </div>

            {/* Customer Past Orders list */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#916b61] mb-3">
                Order History ({selectedMetrics.orders.length})
              </h4>
              {selectedMetrics.orders.length === 0 ? (
                <div className="text-xs text-[#916b61] italic">No orders linked yet.</div>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {selectedMetrics.orders.map(ord => (
                    <div key={ord.order_id} className="p-3 rounded-xl bg-[#fdf8f5] border border-[#ebd8d0] text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#2d0e17]">
                        <span>{ord.order_id}</span>
                        <span className="text-emerald-700">₹{ord.totalAmount}</span>
                      </div>
                      <div className="text-[11px] text-[#735751]">{ord.items_summary}</div>
                      <div className="flex items-center justify-between text-[10px] text-[#916b61] pt-1">
                        <span>{ord.date} ({ord.timeSlot})</span>
                        <span className="capitalize font-semibold text-[#4a1525]">{ord.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
