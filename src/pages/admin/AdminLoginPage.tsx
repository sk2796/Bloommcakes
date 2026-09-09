import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import { adminService } from '@/features/admin/adminService'
import { useAdminAuthStore } from '@/features/admin/store/useAdminAuthStore'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAdminAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await adminService.login(email.trim(), password)
      login(data.admin_user, data.token)

      // Navigate to allowed start route based on role
      if (data.admin_user.role === 'delivery_staff') {
        navigate('/admin/orders')
      } else if (data.admin_user.role === 'catalog_editor') {
        navigate('/admin/products')
      } else {
        navigate('/admin')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  // Quick fill demo accounts for testing ease
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d0e17] via-[#3d1420] to-[#1a080d] text-white flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#f4a261] to-[#e76f51] text-[#2d0e17] font-black text-2xl shadow-xl shadow-[#e76f51]/30 mb-4 border border-white/20">
            BC
          </div>
          <h1 className="font-serif font-bold text-3xl tracking-tight text-white">
            BloomCakes Admin
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#f4a261] font-semibold mt-1 flex items-center justify-center gap-1">
            <Sparkles size={12} /> Merchant Portal & Access Gateway
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0 text-rose-300" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder="admin@bloomcakes.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#f4a261] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                Staff Password
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#f4a261] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e76f51] to-[#f4a261] text-white font-bold text-sm shadow-lg shadow-[#e76f51]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="mt-8 pt-6 border-t border-white/10 text-xs">
            <div className="text-white/50 text-center font-medium mb-3 flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} className="text-[#f4a261]" /> Initial Setup Super Admin
            </div>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@bloomcakes.co', 'Admin@Bloom123')}
              className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left border border-white/10 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white/90">admin@bloomcakes.co</div>
                <div className="text-[11px] text-white/40">Role: Super Admin (Full Access)</div>
              </div>
              <span className="text-[11px] font-bold text-[#f4a261] uppercase tracking-wider bg-[#f4a261]/20 px-2 py-0.5 rounded border border-[#f4a261]/40">
                Auto-fill
              </span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            ← Back to Customer Storefront
          </a>
        </div>
      </div>
    </div>
  )
}
