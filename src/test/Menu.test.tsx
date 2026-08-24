import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ShopPlaceholder from '../pages/ShopPlaceholder'

// Mock useCakes hook
vi.mock('@/features/products/hooks/useCakes', () => ({
  useCakes: () => ({
    data: [
      {
        id: 'c1',
        name: 'Mock Belgian Chocolate',
        slug: 'mock-belgian-chocolate',
        description: 'Test description',
        price: 799,
        priceByWeight: {
          '0.5kg': 799
        },
        rating: 4.9,
        category: 'cakes',
        imageUrl: '',
        isBestseller: true,
        weightOptions: ['0.5kg']
      }
    ],
    isLoading: false,
    isError: false
  })
}))

const queryClient = new QueryClient()

describe('Menu Catalog page', () => {
  it('renders filter headings and filtered cake cards correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ShopPlaceholder />
        </BrowserRouter>
      </QueryClientProvider>
    )
    expect(screen.getByText('Our Menu')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search cakes...')).toBeInTheDocument()
    expect(screen.getByText('Mock Belgian Chocolate')).toBeInTheDocument()
    expect(screen.getByText('₹799')).toBeInTheDocument()
  })
})
