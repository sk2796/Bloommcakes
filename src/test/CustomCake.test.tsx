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

    // Fill in required contact info
    const nameInput = screen.getByPlaceholderText('Your full name')
    const phoneInput = screen.getByPlaceholderText('E.g., +91 98765 43210')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(phoneInput, { target: { value: '+91 99999 88888' } })

    // Go to review step
    fireEvent.click(screen.getByText('NEXT STEP'))
    expect(screen.getByText('Review Custom Order')).toBeInTheDocument()
    
    // Form rendering uses uppercase text css, but screen content value remains lowercase "anniversary" matching type values
    expect(screen.getByText('anniversary')).toBeInTheDocument()
    expect(screen.getByText('John Doe (+91 99999 88888)')).toBeInTheDocument()

    // Submit custom order
    fireEvent.click(screen.getByText('CONFIRM CUSTOM CAKE'))
    expect(screen.getByText('Order Received!')).toBeInTheDocument()
  })
})
