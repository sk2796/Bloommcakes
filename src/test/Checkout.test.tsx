import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CheckoutPlaceholder from '../pages/CheckoutPlaceholder'

describe('Checkout Details Page', () => {
  it('checks pincode eligibility and unlocks form submit', () => {
    render(
      <BrowserRouter>
        <CheckoutPlaceholder />
      </BrowserRouter>
    )

    // Initially form buttons must be disabled
    const submitButton = screen.getByText('PLACE ORDER VIA WHATSAPP')
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
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('E.g., +91 98765 43210'), { target: { value: '+91 87930 58057' } })
    fireEvent.change(screen.getByPlaceholderText('Flat/House no., Floor, Building, Street details'), { target: { value: '123 Bakery Lane' } })
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Ahmedabad' } })
    
    // Select date
    const dateInput = screen.getByLabelText(/Delivery Date/i)
    fireEvent.change(dateInput, { target: { value: '2026-10-31' } })

    // Order confirmation should now be clickable
    expect(submitButton).toBeEnabled()
    fireEvent.click(submitButton)

    // Confirm receipt redirect renders
    expect(screen.getByText('Order Confirmed!')).toBeInTheDocument()
  })
})
