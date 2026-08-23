import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CartPlaceholder from '../pages/CartPlaceholder'

describe('Shopping Cart Page', () => {
  it('renders pre-populated cart items, subtotal counters, and reacts to quantity changes', () => {
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
