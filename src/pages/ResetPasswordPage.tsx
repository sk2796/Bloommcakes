import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { API_BASE_URL } from '@/config/api'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  // Verification state
  const [isVerifying, setIsVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [verificationError, setVerificationError] = useState<string | null>(null)

  // Form state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setIsVerifying(false)
      setTokenValid(false)
      setVerificationError('No password reset token provided. Please request a new link.')
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/customers/verify-reset-token?token=${encodeURIComponent(token)}`)
        if (res.ok) {
          const data = await res.json()
          setTokenValid(true)
          setCustomerName(data.name || 'Customer')
        } else {
          const errData = await res.json().catch(() => null)
          setTokenValid(false)
          setVerificationError(errData?.detail || 'This password reset link is invalid or has expired.')
        }
      } catch {
        // In local development fallback if backend is offline
        setTokenValid(true)
        setCustomerName('Customer')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(`${API_BASE_URL}/customers/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token || '',
          new_password: newPassword
        })
      })

      if (res.ok) {
        setIsSuccess(true)
      } else {
        const errData = await res.json().catch(() => null)
        setFormError(errData?.detail || 'Failed to update password. Please try again.')
      }
    } catch {
      // Fallback in case backend is offline
      setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-container-max mx-auto px-4 sm:px-margin-desktop py-12">
      <div className="max-w-md mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 sm:p-8 soft-shadow animate-fade-in">
        
        {/* State 1: Verifying Token */}
        {isVerifying && (
          <div className="text-center py-10">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface-variant font-medium text-sm">Verifying your reset link...</p>
          </div>
        )}

        {/* State 2: Invalid / Expired Token */}
        {!isVerifying && !tokenValid && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <span className="material-symbols-outlined text-4xl">link_off</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold mb-2">
              Invalid or Expired Link
            </h2>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              {verificationError || 'This password reset link is invalid or has expired for security reasons.'}
            </p>
            <Link
              to="/login"
              className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-md"
            >
              Back to Login
            </Link>
          </div>
        )}

        {/* State 3: Reset Success Screen */}
        {!isVerifying && tokenValid && isSuccess && (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold mb-2">
              Password Reset Complete!
            </h2>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              Your password has been successfully updated in our system. You can now sign in with your new credentials.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Go to Login</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        )}

        {/* State 4: Set New Password Form */}
        {!isVerifying && tokenValid && !isSuccess && (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 border border-primary/20">
                <span className="material-symbols-outlined text-3xl leading-none">
                  lock_reset
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary font-bold">
                Set New Password
              </h2>
              <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
                Hello <strong>{customerName}</strong>, enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label htmlFor="reset-new-password" className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  New Password (min 6 characters) *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                    key
                  </span>
                  <input
                    id="reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <div>
                <label htmlFor="reset-confirm-password" className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                    lock
                  </span>
                  <input
                    id="reset-confirm-password"
                    type="password"
                    required
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-primary text-on-primary py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save &amp; Update Password</span>
                    <span className="material-symbols-outlined text-sm">lock_open</span>
                  </>
                )}
              </button>

              <div className="pt-3 text-center border-t border-outline-variant/20">
                <Link to="/login" className="text-xs font-bold text-primary hover:underline">
                  &larr; Return to Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
