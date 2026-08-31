import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ContactPlaceholder from '../pages/ContactPlaceholder'

describe('Contact Us Page', () => {
  it('submits contact details and compiles message for WhatsApp redirect', () => {
    render(
      <BrowserRouter>
        <ContactPlaceholder />
      </BrowserRouter>
    )

    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    const submitButton = screen.getByText('Send Message via WhatsApp')
    expect(submitButton).toBeDisabled()

    // Input contact form details
    fireEvent.change(screen.getByPlaceholderText('Enter first & last name'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('E.g., +91 98765 43210'), { target: { value: '+91 84202 71983' } })
    fireEvent.change(screen.getByPlaceholderText('Tell us what you are looking for...'), { target: { value: 'Hello BloomCakes, I need custom cakes.' } })

    expect(submitButton).toBeEnabled()
    fireEvent.click(submitButton)

    expect(screen.getByText('Message Sent!')).toBeInTheDocument()
  })
})
