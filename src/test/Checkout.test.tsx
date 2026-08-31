import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CheckoutPlaceholder from '../pages/CheckoutPlaceholder'
import { useCartStore } from '@/features/cart/store/useCartStore'

describe('Checkout Details Page', () => {
  it('checks pincode eligibility and unlocks form submit', async () => {
    // Populate items for test since cart default is now empty
    useCartStore.setState({
      items: [
        {
          id: 'item-2',
          cakeId: 'c4',
          name: 'Blueberry Cheesecake',
          slug: 'blueberry-cheesecake',
          imageUrl: '',
          price: 999,
          weight: '0.5kg',
          quantity: 1
        }
      ]
    })

    render(
      <BrowserRouter>
        <CheckoutPlaceholder />
      </BrowserRouter>
    )

    // Initially form buttons must be disabled
    const submitButton = screen.getByText('PROCEED TO PAY')
    expect(submitButton).toBeDisabled()

    // Input invalid pincode
    const pinField = screen.getByPlaceholderText('Enter 6-digit Pincode (e.g. 380015)')
    fireEvent.change(pinField, { target: { value: '111111' } })
    fireEvent.click(screen.getByText('CHECK'))
    
    expect(screen.getByText(/Delivery unavailable/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Input eligible pincode
    fireEvent.change(pinField, { target: { value: '380015' } })
    fireEvent.click(screen.getByText('CHECK'))
    
    expect(screen.getByText(/We deliver to your location/i)).toBeInTheDocument()

    // Fill in rest of form configurations
    fireEvent.change(screen.getByPlaceholderText('Enter first & last name'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('E.g., +91 98765 43210'), { target: { value: '+91 87930 58057' } })
    fireEvent.change(screen.getByPlaceholderText('Flat/House no., Floor, Building, Street details'), { target: { value: '123 Bakery Lane' } })
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Ahmedabad' } })
    
    // Select date
    const dateInput = screen.getByLabelText(/Delivery Date/i)
    fireEvent.change(dateInput, { target: { value: '2026-10-31' } })

    // Mock window.Razorpay constructor function configuration using spy assertions
    const mockOpen = vi.fn()
    const mockOn = vi.fn()
    const mockAlert = vi.fn()
    window.alert = mockAlert
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockConstructor = vi.fn().mockImplementation(function (this: any) {
      this.open = mockOpen
      this.on = mockOn
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).Razorpay = mockConstructor

    // Mock window.fetch for API orders creation calls
    const mockFetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ order_id: 'order_123', amount: 99900, currency: 'INR' })
      })
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.fetch = mockFetch as any

    // Order confirmation should now be clickable
    expect(submitButton).toBeEnabled()
    
    // Call checkout flow function manually since click doesn't trigger mock actions inside jsdom directly
    const formElement = document.querySelector('form')
    if (formElement) {
      fireEvent.submit(formElement)
    }

    // Wait for the async fetch and constructor call to occur
    await vi.waitFor(() => {
      expect(mockConstructor).toHaveBeenCalled()
    })
  })
})
