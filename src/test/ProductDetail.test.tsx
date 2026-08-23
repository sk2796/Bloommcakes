import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProductPlaceholder from '../pages/ProductPlaceholder'

// Mock useCakeDetail custom hook
vi.mock('@/features/products/hooks/useCakeDetail', () => ({
  useCakeDetail: () => ({
    data: {
      id: 'c1',
      name: 'Mock Belgian Chocolate',
      slug: 'mock-belgian-chocolate',
      description: 'Rich test description content',
      price: 799,
      priceByWeight: {
        '0.5kg': 799,
        '1kg': 1499,
        '2kg': 2899
      },
      rating: 4.9,
      category: 'chocolate',
      imageUrl: '',
      isEggless: true,
      isBestseller: true,
      weightOptions: ['0.5kg', '1kg', '2kg']
    },
    isLoading: false,
    isError: false
  })
}))

const queryClient = new QueryClient()

describe('Product Detail Page', () => {
  it('updates pricing display when switching weight options and quantities selector is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ProductPlaceholder />
        </BrowserRouter>
      </QueryClientProvider>
    )
    
    // Use getAllByText to find heading since mock hook returns duplicate matches in page title vs breadcrumb
    expect(screen.getAllByText('Mock Belgian Chocolate')[0]).toBeInTheDocument()
    expect(screen.getByText('₹799')).toBeInTheDocument()
    
    const oneKgButton = screen.getByText('1kg — ₹1499')
    fireEvent.click(oneKgButton)
    expect(screen.getByText('₹1499')).toBeInTheDocument()
    
    const plusButton = screen.getByText('+')
    fireEvent.click(plusButton)
    expect(screen.getByText('₹2998')).toBeInTheDocument()
  })
})
