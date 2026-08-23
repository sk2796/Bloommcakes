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
const AccountPlaceholder = lazy(() => import('@/pages/AccountPlaceholder'))

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
        path: 'account/*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AccountPlaceholder />
          </Suspense>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
