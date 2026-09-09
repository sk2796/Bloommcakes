import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LocationSelector } from '../LocationSelector'
import { useLocationStore } from '../../store/useLocationStore'

describe('LocationSelector Component', () => {
  beforeEach(() => {
    useLocationStore.setState({ location: null, error: null, isChecking: false })
  })

  it('renders default check pincode trigger button', () => {
    render(<LocationSelector />)
    expect(screen.getByText('Delivery Area')).toBeInTheDocument()
    expect(screen.getByText('Check Pincode')).toBeInTheDocument()
  })

  it('opens modal on trigger click and checks serviceable pincode', async () => {
    render(<LocationSelector />)
    
    // Click trigger to open dropdown
    const trigger = screen.getByRole('button', { name: /select delivery location/i })
    fireEvent.click(trigger)

    expect(screen.getByText('Select Delivery Location')).toBeInTheDocument()
    
    // Type valid serviceable pincode
    const input = screen.getByPlaceholderText('Enter 6-digit Pincode')
    fireEvent.change(input, { target: { value: '380015' } })

    const checkBtn = screen.getByRole('button', { name: /check/i })
    fireEvent.click(checkBtn)

    // Store should be updated and trigger should display city & pincode
    expect(await screen.findByText(/Ahmedabad \(380015\)/i)).toBeInTheDocument()
  })

  it('shows error for unserviceable pincode', async () => {
    render(<LocationSelector />)
    
    const trigger = screen.getByRole('button', { name: /select delivery location/i })
    fireEvent.click(trigger)

    const input = screen.getByPlaceholderText('Enter 6-digit Pincode')
    fireEvent.change(input, { target: { value: '999999' } })

    const checkBtn = screen.getByRole('button', { name: /check/i })
    fireEvent.click(checkBtn)

    expect(await screen.findByText(/Sorry, we do not deliver to pincode 999999 yet/i)).toBeInTheDocument()
  })
})
