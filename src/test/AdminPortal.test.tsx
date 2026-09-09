import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminProductsPage from '../pages/admin/AdminProductsPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'

vi.mock('../features/admin/adminService', () => ({
  adminService: {
    getAnalytics: vi.fn().mockResolvedValue({
      total_revenue: 15450,
      total_orders: 8,
      total_customers: 5,
      total_products: 11,
      status_counts: {
        order_confirmed: 3,
        shipped: 2,
        delivered: 3,
        cancelled: 0
      },
      recent_orders: []
    }),
    getProducts: vi.fn().mockResolvedValue([
      {
        id: 'BC-CAKE-BELGIAN-CHOC',
        name: 'Belgian Chocolate Cake',
        slug: 'belgian-chocolate',
        price: 799,
        category: 'cakes',
        imageUrl: '',
        isBestseller: true,
        rating: 4.9
      }
    ]),
    createProduct: vi.fn().mockImplementation((payload) => Promise.resolve({
      id: 'BC-CAKE-NEW-TEST',
      slug: 'new-test-cake',
      ...payload
    }))
  }
}))

describe('SaaS Admin Portal', () => {
  it('renders executive dashboard metrics correctly', async () => {
    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Store Performance Overview')).toBeInTheDocument()
      expect(screen.getByText('₹15,450')).toBeInTheDocument()
      expect(screen.getByText('Registered Customers')).toBeInTheDocument()
    })
  })

  it('renders products catalog and auto-generates ID & slug in the add modal', async () => {
    render(
      <BrowserRouter>
        <AdminProductsPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Belgian Chocolate Cake')).toBeInTheDocument()
      expect(screen.getByText('BC-CAKE-BELGIAN-CHOC')).toBeInTheDocument()
    })

    // Click "Add New Product"
    const addButton = screen.getByText('Add New Product')
    fireEvent.click(addButton)

    // Verify modal opened
    expect(screen.getByText('Add New Cake / Product')).toBeInTheDocument()

    // Type a product name and check auto-generation
    const titleInput = screen.getByPlaceholderText('e.g. Belgian Truffle Delight')
    fireEvent.change(titleInput, { target: { value: 'Strawberry Velvet Bliss' } })

    // Verify live preview generated IDs
    expect(screen.getByText('BC-CAKE-STRAWBERRY-VELVET-BLISS')).toBeInTheDocument()
    expect(screen.getByText('/strawberry-velvet-bliss')).toBeInTheDocument()
  })
})
