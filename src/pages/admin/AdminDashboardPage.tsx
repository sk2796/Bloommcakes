import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Cake, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react'
import { adminService } from '@/features/admin/adminService'
import { AdminAnalytics } from '@/features/admin/types'

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getAnalytics()
      setAnalytics(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d0e17] tracking-tight">
            Store Performance Overview
          </h1>
          <p className="text-sm text-[#735751] mt-1">
            Real-time analytics for orders, active customers, catalog inventory, and revenue.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5d5cf] text-[#2d0e17] text-sm font-medium hover:bg-[#faeee8] transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#ebd8d0] shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#916b61]">Total Revenue</span>
            <div className="text-2xl sm:text-3xl font-bold text-[#2d0e17] mt-2">
              ₹{(analytics?.total_revenue || 0).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2">
              <TrendingUp size={14} />
              <span>Net realized sales</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <span className="font-bold text-lg">₹</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebd8d0] shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#916b61]">Total Orders</span>
            <div className="text-2xl sm:text-3xl font-bold text-[#2d0e17] mt-2">
              {analytics?.total_orders || 0}
            </div>
            <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs text-[#e76f51] font-medium mt-2 hover:underline">
              Manage fulfillment <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <ShoppingBag size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebd8d0] shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#916b61]">Registered Customers</span>
            <div className="text-2xl sm:text-3xl font-bold text-[#2d0e17] mt-2">
              {analytics?.total_customers || 0}
            </div>
            <Link to="/admin/customers" className="inline-flex items-center gap-1 text-xs text-[#e76f51] font-medium mt-2 hover:underline">
              View directory <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebd8d0] shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#916b61]">Active Menu Items</span>
            <div className="text-2xl sm:text-3xl font-bold text-[#2d0e17] mt-2">
              {analytics?.total_products || 0}
            </div>
            <Link to="/admin/products" className="inline-flex items-center gap-1 text-xs text-[#e76f51] font-medium mt-2 hover:underline">
              Update catalog <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Cake size={22} />
          </div>
        </div>
      </div>

      {/* Order Status Pipeline Breakdown */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#ebd8d0] shadow-sm">
        <h2 className="text-lg font-bold text-[#2d0e17] mb-4">Order Pipeline Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-blue-900">
                {analytics?.status_counts?.order_confirmed || 0}
              </div>
              <div className="text-xs text-blue-700 font-medium">Confirmed / Queued</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
              <Truck size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-amber-900">
                {analytics?.status_counts?.shipped || 0}
              </div>
              <div className="text-xs text-amber-700 font-medium">Out for Delivery</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-900">
                {analytics?.status_counts?.delivered || 0}
              </div>
              <div className="text-xs text-emerald-700 font-medium">Delivered</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-gray-200 text-gray-700">
              <span className="font-bold text-sm">✕</span>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">
                {analytics?.status_counts?.cancelled || 0}
              </div>
              <div className="text-xs text-gray-600 font-medium">Cancelled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-[#ebd8d0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#ebd8d0] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#2d0e17]">Recent Customer Orders</h2>
            <p className="text-xs text-[#735751] mt-0.5">Latest transactions awaiting fulfillment</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#e76f51] hover:text-[#d35b3d] flex items-center gap-1"
          >
            All Orders <ArrowUpRight size={14} />
          </Link>
        </div>

        {analytics?.recent_orders && analytics.recent_orders.length > 0 ? (
          <div className="divide-y divide-[#ebd8d0]/60">
            {analytics.recent_orders.map((ord) => (
              <div key={ord.order_id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#fffcfb] transition-colors">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#2d0e17] bg-[#fdf2ee] px-2.5 py-1 rounded-md border border-[#ebd8d0]">
                      {ord.order_id}
                    </span>
                    <span className="font-semibold text-sm text-[#2d0e17]">{ord.name}</span>
                  </div>
                  <div className="text-xs text-[#735751] mt-1.5 flex items-center gap-3">
                    <span>📞 {ord.phone}</span>
                    <span>•</span>
                    <span>{ord.created_at || 'Just now'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#2d0e17]">
                      ₹{ord.totalAmount}
                    </div>
                  </div>
                  <span className={`
                    text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider
                    ${ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'shipped' ? 'bg-amber-100 text-amber-800' :
                      ord.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-blue-100 text-blue-800'}
                  `}>
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-[#916b61]">
            No recent orders recorded yet. They will appear here as customers place orders.
          </div>
        )}
      </div>
    </div>
  )
}
