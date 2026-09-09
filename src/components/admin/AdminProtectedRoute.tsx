import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuthStore } from '@/features/admin/store/useAdminAuthStore'

interface AdminProtectedRouteProps {
  children: React.ReactNode
  module?: 'analytics' | 'products' | 'orders' | 'customers' | 'pincodes' | 'users'
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, module }) => {
  const location = useLocation()
  const { user, token, hasPermission } = useAdminAuthStore()

  // If unauthenticated, redirect to admin login
  if (!user || !token || !user.is_active) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // If a specific module permission is required and user does not have it, show Access Restricted
  if (module && !hasPermission(module)) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center bg-white rounded-3xl border border-[#ebd8d0] shadow-sm my-12">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          🛡️
        </div>
        <h2 className="text-xl font-bold text-[#2d0e17] mb-2">Access Restricted</h2>
        <p className="text-sm text-[#735751] mb-6">
          Your assigned role (<span className="font-semibold capitalize">{user.role.replace('_', ' ')}</span>) does not have permission to view or edit this section.
        </p>
        <a
          href="/admin"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#4a1525] text-white text-xs font-semibold hover:bg-[#38101c] transition-colors"
        >
          Go to Allowed Dashboard
        </a>
      </div>
    )
  }

  return <>{children}</>
}
