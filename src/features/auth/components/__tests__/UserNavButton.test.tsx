import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { UserNavButton } from '../UserNavButton'
import { useAuthStore } from '../../store/useAuthStore'

describe('UserNavButton Component', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null })
  })

  it('renders person icon and "Login" text when user is not logged in', () => {
    render(
      <BrowserRouter>
        <UserNavButton />
      </BrowserRouter>
    )

    expect(screen.getByText('person')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /login to account/i })).toHaveAttribute('href', '/login')
  })

  it('renders person icon and customer name when user is logged in', () => {
    useAuthStore.setState({
      user: {
        id: 'cust-1',
        name: 'Shubham Kumar',
        phone: '9876543210'
      }
    })

    render(
      <BrowserRouter>
        <UserNavButton />
      </BrowserRouter>
    )

    expect(screen.getByText('person')).toBeInTheDocument()
    expect(screen.getByText('Shubham')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /user account: shubham kumar/i })).toHaveAttribute('href', '/account')
  })
})
