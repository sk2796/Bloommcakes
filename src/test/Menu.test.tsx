import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ShopPlaceholder from '../pages/ShopPlaceholder'

// Mock the custom hook to isolate query testing
vi.mock('@/features/products/hooks/useCakes', () => ({
  useCakes: () => ({
    data: [
      {
        id: 'c1',
        name: 'Mock Belgian Chocolate',
        slug: 'mock-belgian-chocolate',
        description: 'Test description',
        price: 799,
        rating: 4.9,
        category: 'chocolate',
        imageUrl: '',
        isEggless: true,
        isBestseller: true,
        weightOptions: ['0.5kg']
      }
    ],
    isLoading: false,
    isError: false
  })
}))

describe('Menu Catalog page', () => {
  it('renders filter headings and filtered cake cards correctly', () => {
    render(<ShopPlaceholder />)
    expect(screen.getByText('Our Menu')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search cakes...')).toBeInTheDocument()
    expect(screen.getByText('Mock Belgian Chocolate')).toBeInTheDocument()
    expect(screen.getByText('₹799')).toBeInTheDocument()
  })
})
