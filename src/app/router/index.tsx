import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

// Lazy-loaded routes for optimal code splitting
const HomePlaceholder = lazy(() => import('@/pages/HomePlaceholder'))
const AboutPlaceholder = lazy(() => import('@/pages/AboutPlaceholder'))
const ShopPlaceholder = lazy(() => import('@/pages/ShopPlaceholder'))
const ProductPlaceholder = lazy(() => import('@/pages/ProductPlaceholder'))
const CustomCakePlaceholder = lazy(() => import('@/pages/CustomCakePlaceholder'))
const CartPlaceholder = lazy(() => import('@/pages/CartPlaceholder'))
const CheckoutPlaceholder = lazy(() => import('@/pages/CheckoutPlaceholder'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))
const ContactPlaceholder = lazy(() => import('@/pages/ContactPlaceholder'))

// Admin Portal Routes
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'))
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'))
const AdminCustomersPage = lazy(() => import('@/pages/admin/AdminCustomersPage'))
const AdminPincodesPage = lazy(() => import('@/pages/admin/AdminPincodesPage'))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'))
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AboutPlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'shop',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ShopPlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'shop/:category',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ShopPlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'product/:slug',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProductPlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'custom-cake',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CustomCakePlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CartPlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CheckoutPlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ResetPasswordPage />
          </Suspense>
        ),
      },
      {
        path: 'account/*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ContactPlaceholder />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <AdminLayout />
        </Suspense>
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <AdminProtectedRoute module="analytics">
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboardPage />
            </Suspense>
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <AdminProtectedRoute module="products">
            <Suspense fallback={<LoadingSpinner />}>
              <AdminProductsPage />
            </Suspense>
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <AdminProtectedRoute module="orders">
            <Suspense fallback={<LoadingSpinner />}>
              <AdminOrdersPage />
            </Suspense>
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'customers',
        element: (
          <AdminProtectedRoute module="customers">
            <Suspense fallback={<LoadingSpinner />}>
              <AdminCustomersPage />
            </Suspense>
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'pincodes',
        element: (
          <AdminProtectedRoute module="pincodes">
            <Suspense fallback={<LoadingSpinner />}>
              <AdminPincodesPage />
            </Suspense>
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <AdminProtectedRoute module="users">
            <Suspense fallback={<LoadingSpinner />}>
              <AdminUsersPage />
            </Suspense>
          </AdminProtectedRoute>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
