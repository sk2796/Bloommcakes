import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Cake, 
  ShoppingBag, 
  Users, 
  MapPin, 
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  LogOut
} from 'lucide-react'
import { useAdminAuthStore } from '@/features/admin/store/useAdminAuthStore'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout, hasPermission } = useAdminAuthStore()

  const allNavItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true, module: 'analytics' as const },
    { name: 'Products & Menu', path: '/admin/products', icon: Cake, module: 'products' as const },
    { name: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingBag, module: 'orders' as const },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users, module: 'customers' as const },
    { name: 'Delivery Zones', path: '/admin/pincodes', icon: MapPin, module: 'pincodes' as const },
    { name: 'Staff & Roles (RBAC)', path: '/admin/users', icon: ShieldCheck, module: 'users' as const },
  ]

  // Filter navigation items dynamically based on current staff role permissions
  const navItems = allNavItems.filter(item => hasPermission(item.module))

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2d1b18] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-[#4a1525] text-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#f4a261] flex items-center justify-center font-bold text-[#4a1525] text-sm">
            BC
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg">BloomCakes</span>
            <span className="ml-2 text-xs uppercase tracking-wider bg-[#f4a261]/20 text-[#f4a261] px-2 py-0.5 rounded-full border border-[#f4a261]/40">Admin</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-72 bg-[#2d0e17] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Top Bar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f4a261] to-[#e76f51] flex items-center justify-center font-black text-[#2d0e17] text-lg shadow-lg">
              BC
            </div>
            <div>
              <div className="font-serif font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                BloomCakes
              </div>
              <p className="text-[11px] uppercase tracking-widest text-[#f4a261] font-semibold flex items-center gap-1">
                <Sparkles size={11} /> Merchant SaaS
              </p>
            </div>
          </Link>
        </div>

        {/* Current Logged in User Card */}
        {user && (
          <div className="px-4 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="overflow-hidden">
                <div className="font-semibold text-xs text-white truncate">{user.name}</div>
                <div className="text-[10px] text-[#f4a261] capitalize font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {user.role.replace('_', ' ')}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-white/50 hover:text-rose-400 hover:bg-white/10 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Available Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setMobileOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                  ${active 
                    ? 'bg-gradient-to-r from-[#e76f51] to-[#f4a261] text-white font-semibold shadow-lg shadow-[#e76f51]/30' 
                    : 'text-white/75 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon size={19} className={active ? 'text-white' : 'text-white/60'} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom Storefront Link */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 text-sm font-medium transition-all group border border-white/10"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Storefront
            </span>
            <ExternalLink size={16} className="text-white/50 group-hover:text-white transition-colors" />
          </Link>
          <div className="mt-3 px-2 text-[11px] text-white/40 text-center">
            Role-Based Access Guard Active
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-5 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
