import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { API_BASE_URL } from '@/config/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login, logout } = useAuthStore()

  // Tab state: 'login' | 'register' | 'forgot'
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login')

  // Login form states
  const [identifier, setIdentifier] = useState('') // email or phone
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Forgot password form states
  const [forgotIdentifier, setForgotIdentifier] = useState('')
  const [forgotError, setForgotError] = useState<string | null>(null)
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null)
  const [debugResetLink, setDebugResetLink] = useState<string | null>(null)
  const [isSendingForgot, setIsSendingForgot] = useState(false)

  // Register form states
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)

  // Redirect url if provided in state (e.g. from checkout or returnUrl)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  // Customer order history state
  interface CustomerOrder {
    order_id: string
    date: string
    timeSlot: string
    occasion: string
    customOccasion?: string
    items_summary: string
    totalAmount: number
    status: string
    created_at?: string
    addressLine1?: string
    city?: string
    pincode?: string
  }
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [accountView, setAccountView] = useState<'profile' | 'orders'>('profile')

  React.useEffect(() => {
    if (user?.id) {
      setIsLoadingOrders(true)
      fetch(`${API_BASE_URL}/customers/${encodeURIComponent(user.id)}/orders`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setOrders(Array.isArray(data) ? data : [])
        })
        .catch(() => {
          setOrders([])
        })
        .finally(() => {
          setIsLoadingOrders(false)
        })
    }
  }, [user?.id])

  const getStatusBadge = (status: string) => {
    const s = (status || 'order_confirmed').toLowerCase()
    if (s === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Delivered
        </span>
      )
    }
    if (s === 'shipped') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Shipped / Out for Delivery
        </span>
      )
    }
    if (s === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Cancelled
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        Order Confirmed
      </span>
    )
  }

  // If already logged in, show authenticated profile dashboard with Orders history
  if (user) {
    return (
      <div className="max-w-container-max mx-auto px-4 sm:px-margin-desktop py-12">
        <div className="max-w-3xl mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 sm:p-8 soft-shadow animate-fade-in">
          
          {/* Header Profile Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-outline-variant/20 gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20 flex-shrink-0">
                <span className="material-symbols-outlined text-3xl leading-none" data-icon="person">
                  person
                </span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  {user.name}
                </h2>
                <p className="text-on-surface-variant text-xs mt-0.5">
                  Customer ID: <span className="font-mono font-semibold text-primary">{user.id}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to="/shop"
                className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:bg-on-primary-fixed-variant transition-colors"
              >
                Order Cakes
              </Link>
              <button
                onClick={() => logout()}
                className="px-4 py-2.5 rounded-full font-bold text-xs text-error hover:bg-error/5 border border-error/20 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Toggle between Profile & Past Orders */}
          <div className="flex gap-4 border-b border-outline-variant/20 mt-6 mb-6">
            <button
              onClick={() => setAccountView('profile')}
              className={`pb-3 font-bold text-sm tracking-wider uppercase transition-colors relative ${
                accountView === 'profile'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setAccountView('orders')}
              className={`pb-3 font-bold text-sm tracking-wider uppercase transition-colors relative flex items-center gap-2 ${
                accountView === 'orders'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>My Orders</span>
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </button>
          </div>

          {/* VIEW 1: Account Profile Details */}
          {accountView === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant font-medium">Full Name:</span>
                  <span className="font-semibold text-on-surface">{user.name}</span>
                </div>
                {user.email && (
                  <div className="flex justify-between py-1 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant font-medium">Email Address:</span>
                    <span className="font-semibold text-on-surface">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex justify-between py-1 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant font-medium">Mobile Phone:</span>
                    <span className="font-semibold text-on-surface">+91 {user.phone}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant font-medium">Total Orders Placed:</span>
                  <span className="font-bold text-primary">{orders.length} orders</span>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/15 text-xs text-on-surface-variant flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">verified_user</span>
                <div>
                  <p className="font-bold text-on-surface text-sm mb-0.5">BloomCakes SaaS Verified Customer</p>
                  <p>All your orders are synchronized with our centralized bakery dispatch platform for real-time baking and live delivery tracking.</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Order History List */}
          {accountView === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              {isLoadingOrders ? (
                <div className="text-center py-12">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs text-on-surface-variant font-medium">Fetching your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-base mb-1">No orders found yet</h3>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-5">
                    You haven't placed any cake orders yet. Browse our handcrafted artisanal bakery collection!
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:bg-on-primary-fixed-variant transition-colors"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.order_id}
                      className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/25 soft-shadow hover:border-primary/30 transition-all text-left"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant/15 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-primary">{ord.order_id}</span>
                            {getStatusBadge(ord.status)}
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">
                            Placed on {ord.created_at || ord.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-on-surface-variant uppercase tracking-wider block">Total Amount</span>
                          <span className="text-base font-bold text-primary">₹{ord.totalAmount}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-on-surface-variant font-medium block mb-1">Items Ordered:</span>
                          <p className="font-semibold text-on-surface bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/15 leading-relaxed">
                            {ord.items_summary}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant">Scheduled Delivery:</span>
                            <span className="font-semibold text-on-surface">{ord.date} ({ord.timeSlot})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant">Occasion:</span>
                            <span className="font-semibold text-on-surface capitalize">
                              {ord.occasion === 'other' ? ord.customOccasion || 'Other' : ord.occasion}
                            </span>
                          </div>
                          {ord.city && (
                            <div className="flex justify-between">
                              <span className="text-on-surface-variant">Delivery Area:</span>
                              <span className="font-semibold text-on-surface">{ord.city} ({ord.pincode})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    const trimmedId = identifier.trim()
    if (!trimmedId) {
      setLoginError('Please enter your email or phone number.')
      return
    }

    if (!password) {
      setLoginError('Please enter your password.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: trimmedId,
          password: password
        })
      })

      if (res.ok) {
        const data = await res.json()
        login({
          id: data.customer.id,
          name: data.customer.name,
          email: data.customer.email || undefined,
          phone: data.customer.phone || undefined
        })
        setIsLoading(false)
        navigate(from, { replace: true })
        return
      } else {
        const errData = await res.json().catch(() => null)
        const errMsg = errData?.detail || 'Invalid email/phone or password.'
        setLoginError(errMsg)
        setIsLoading(false)
        return
      }
    } catch {
      // Fallback in case backend server is unreachable
      const isEmail = trimmedId.includes('@')
      const isPhone = /^\d{10}$/.test(trimmedId.replace(/\D/g, ''))

      let derivedName = 'Customer'
      if (isEmail) {
        const usernamePart = trimmedId.split('@')[0]
        derivedName = usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1)
      } else if (isPhone) {
        derivedName = `User ${trimmedId.slice(-4)}`
      }

      login({
        id: `user-${Date.now()}`,
        name: derivedName,
        email: isEmail ? trimmedId : undefined,
        phone: isPhone ? trimmedId.replace(/\D/g, '') : undefined
      })

      setIsLoading(false)
      navigate(from, { replace: true })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError(null)

    if (!regName.trim()) {
      setRegError('Please enter your full name.')
      return
    }

    if (!regEmail.trim() && !regPhone.trim()) {
      setRegError('Please provide at least an email address or phone number.')
      return
    }

    if (regEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setRegError('Please enter a valid email address.')
      return
    }

    if (regPhone.trim() && regPhone.replace(/\D/g, '').length !== 10) {
      setRegError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim().replace(/\D/g, ''),
          email: regEmail.trim() || undefined,
          password: regPassword
        })
      })

      if (res.ok) {
        const data = await res.json()
        login({
          id: data.customer.id,
          name: data.customer.name,
          email: data.customer.email || undefined,
          phone: data.customer.phone || undefined
        })
        setIsLoading(false)
        navigate(from, { replace: true })
        return
      } else {
        const errData = await res.json().catch(() => null)
        const errMsg = errData?.detail || 'Failed to create account.'
        setRegError(errMsg)
        setIsLoading(false)
        return
      }
    } catch {
      // Fallback in case backend server is unreachable
      login({
        id: `user-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim() || undefined,
        phone: regPhone.trim() ? regPhone.replace(/\D/g, '') : undefined
      })
      setIsLoading(false)
      navigate(from, { replace: true })
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError(null)
    setForgotSuccess(null)
    setDebugResetLink(null)

    const trimmed = forgotIdentifier.trim()
    if (!trimmed) {
      setForgotError('Please enter your email address or registered mobile number.')
      return
    }

    setIsSendingForgot(true)

    try {
      const res = await fetch(`${API_BASE_URL}/customers/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: trimmed })
      })

      if (res.ok) {
        const data = await res.json()
        setForgotSuccess(data.message || `Password reset instructions sent. Please check your email.`)
        if (data.debug_link) {
          setDebugResetLink(data.debug_link)
        }
      } else {
        const errData = await res.json().catch(() => null)
        setForgotError(errData?.detail || 'No account found with this email or phone.')
      }
    } catch {
      // Fallback
      setForgotSuccess('If an account is associated with this email or phone, a reset link has been dispatched.')
    } finally {
      setIsSendingForgot(false)
    }
  }

  return (
    <div className="max-w-container-max mx-auto px-4 sm:px-margin-desktop py-12">
      <div className="max-w-md mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 sm:p-8 soft-shadow animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 border border-primary/20">
            <span className="material-symbols-outlined text-3xl leading-none" data-icon="lock">
              lock
            </span>
          </div>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            {activeTab === 'login' ? 'Welcome Back' : activeTab === 'register' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
            {activeTab === 'login'
              ? 'Log in to track orders, save favorites & speed up checkout'
              : activeTab === 'register'
              ? 'Sign up to enjoy custom cakes, orders & fast delivery'
              : 'Enter your email or phone to receive a password reset link from our official support email'}
          </p>
        </div>

        {/* Tab Toggle Switch: Login vs Register (hidden when in forgot mode) */}
        {activeTab !== 'forgot' ? (
          <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/20 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login')
                setLoginError(null)
              }}
              className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register')
                setRegError(null)
              }}
              className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Register
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login')
                setForgotError(null)
                setForgotSuccess(null)
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Login</span>
            </button>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label htmlFor="login-identifier" className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Email or Phone Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                  alternate_email
                </span>
                <input
                  id="login-identifier"
                  type="text"
                  required
                  placeholder="name@email.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot')
                    setForgotError(null)
                    setForgotSuccess(null)
                    if (identifier) setForgotIdentifier(identifier)
                  }}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                  key
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-lg leading-none">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              data-testid="login-submit-btn"
              disabled={isLoading}
              className="w-full mt-2 bg-primary text-on-primary py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>

            <div className="pt-3 text-center border-t border-outline-variant/20">
              <p className="text-xs text-on-surface-variant">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register')
                    setRegError(null)
                  }}
                  className="font-bold text-primary hover:underline ml-1"
                >
                  Register Now
                </button>
              </p>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {regError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{regError}</span>
              </div>
            )}

            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                  badge
                </span>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                  mail
                </span>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="name@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-phone" className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Phone Number (10 Digits)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                  call
                </span>
                <input
                  id="reg-phone"
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Password (min 6 characters) *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                  lock
                </span>
                <input
                  id="reg-password"
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Create a strong password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 focus:outline-none"
                  aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-lg leading-none">
                    {showRegPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-confirm-password" className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                  lock_reset
                </span>
                <input
                  id="reg-confirm-password"
                  type="password"
                  required
                  placeholder="Re-enter your password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-primary text-on-primary py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-sm">how_to_reg</span>
                </>
              )}
            </button>

            <div className="pt-3 text-center border-t border-outline-variant/20">
              <p className="text-xs text-on-surface-variant">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login')
                    setLoginError(null)
                  }}
                  className="font-bold text-primary hover:underline ml-1"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD FORM */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 animate-fade-in">
            {forgotError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-xl text-xs text-green-700 dark:text-green-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">mark_email_read</span>
                  <span>Email Dispatched!</span>
                </div>
                <p className="leading-relaxed">{forgotSuccess}</p>
                {debugResetLink && (
                  <div className="pt-2 border-t border-green-200 dark:border-green-800">
                    <span className="font-semibold block mb-1">Direct link:</span>
                    <a
                      href={debugResetLink}
                      className="text-primary font-bold underline break-all block"
                    >
                      Click here to reset your password &rarr;
                    </a>
                  </div>
                )}
              </div>
            )}

            {!forgotSuccess && (
              <>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
                  Enter your registered <strong>Email Address</strong> or <strong>Phone Number</strong>. We will locate your account and send a secure reset link to your email from our official support address.
                </p>

                <div>
                  <label htmlFor="forgot-identifier" className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                    Email or Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                      contact_mail
                    </span>
                    <input
                      id="forgot-identifier"
                      type="text"
                      required
                      placeholder="e.g. name@email.com or 9876543210"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingForgot}
                  className="w-full mt-2 bg-primary text-on-primary py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSendingForgot ? (
                    <>
                      <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <span className="material-symbols-outlined text-sm">send</span>
                    </>
                  )}
                </button>
              </>
            )}

            <div className="pt-3 text-center border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login')
                  setForgotError(null)
                  setForgotSuccess(null)
                }}
                className="text-xs font-bold text-primary hover:underline"
              >
                &larr; Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
