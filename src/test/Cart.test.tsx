import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CartPlaceholder from '../pages/CartPlaceholder'
import { useCartStore } from '@/features/cart/store/useCartStore'

describe('Shopping Cart Page', () => {
  it('renders pre-populated cart items, subtotal counters, and reacts to quantity changes', () => {
    // Populate items for test since cart default is now empty
    useCartStore.setState({
      items: [
        {
          id: 'item-1',
          cakeId: 'c1',
          name: 'Belgian Chocolate Cake',
          slug: 'belgian-chocolate',
          imageUrl: '',
          price: 1499,
          weight: '1kg',
          quantity: 1
        },
        {
          id: 'item-2',
          cakeId: 'c4',
          name: 'Blueberry Cheesecake',
          slug: 'blueberry-cheesecake',
          imageUrl: '',
          price: 999,
          weight: '0.5kg',
          quantity: 2
        }
      ]
    })

    render(
      <BrowserRouter>
        <CartPlaceholder />
      </BrowserRouter>
    )

    // Check pre-populated item cards exist
    expect(screen.getByText('Belgian Chocolate Cake')).toBeInTheDocument()
    expect(screen.getByText('Blueberry Cheesecake')).toBeInTheDocument()
    
    // Use getAllByText as ₹3497 matches multiple elements (Bag Subtotal value and Total amount value)
    expect(screen.getAllByText('₹3497')[0]).toBeInTheDocument()

    // Locate the first item decrease button (Belgian Chocolate qty 1 -> 0 should remove it)
    const minusButtons = screen.getAllByText('-')
    fireEvent.click(minusButtons[0]) // Dec Belgian Chocolate

    expect(screen.queryByText('Belgian Chocolate Cake')).not.toBeInTheDocument()
    expect(screen.getAllByText('₹1998')[0]).toBeInTheDocument()
  })
})
