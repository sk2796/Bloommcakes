import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CustomCakePlaceholder from '../pages/CustomCakePlaceholder'

describe('Custom Cake Builder Page', () => {
  it('navigates through steps and retains configurations', () => {
    render(
      <BrowserRouter>
        <CustomCakePlaceholder />
      </BrowserRouter>
    )

    // Verify step 1 renders
    expect(screen.getByText('Select Occasion')).toBeInTheDocument()
    expect(screen.getAllByText('Birthday')[0]).toBeInTheDocument()

    // Switch occasion to Anniversary
    fireEvent.click(screen.getAllByText('Anniversary')[0])

    // Go to step 2
    fireEvent.click(screen.getByText('NEXT STEP'))
    expect(screen.getAllByText('Cake Details')[0]).toBeInTheDocument()
    expect(screen.getByText('Select Flavor')).toBeInTheDocument()

    // Go to step 3
    fireEvent.click(screen.getByText('NEXT STEP'))
    expect(screen.getAllByText('Personalization')[0]).toBeInTheDocument()

    // Go to step 4
    fireEvent.click(screen.getByText('NEXT STEP'))
    expect(screen.getAllByText('Delivery Details')[0]).toBeInTheDocument()

    // Check pincode
    const pinField = screen.getByPlaceholderText('Enter 6-digit Pincode')
    fireEvent.change(pinField, { target: { value: '380015' } })
    fireEvent.click(screen.getByText('Check'))

    // Fill in required contact info
    const addressInput = screen.getByPlaceholderText('Street address, Appt, Area, Ahmedabad')
    const nameInput = screen.getByPlaceholderText('Your full name')
    const phoneInput = screen.getByPlaceholderText('E.g., +91 98765 43210')
    
    fireEvent.change(addressInput, { target: { value: '123 Bakers Street' } })
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(phoneInput, { target: { value: '9999988888' } })

    // Select date (Set delivery date)
    const dateInput = screen.getByLabelText(/Delivery Date/i)
    fireEvent.change(dateInput, { target: { value: '2026-12-31' } })

    // Go to review step
    fireEvent.click(screen.getByText('NEXT STEP'))
    expect(screen.getByText('Review Custom Order')).toBeInTheDocument()
    
    expect(screen.getByText('anniversary')).toBeInTheDocument()
    expect(screen.getByText('John Doe (9999988888)')).toBeInTheDocument()

    // Submit custom order
    fireEvent.click(screen.getByText('CONFIRM CUSTOM CAKE'))
    expect(screen.getByText('Order Received!')).toBeInTheDocument()
  })
})
