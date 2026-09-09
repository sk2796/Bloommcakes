import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../LoginPage'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

describe('LoginPage Component', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null })
  })

  it('renders login form with identifier (email/phone) and password by default', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email or phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument()
  })

  it('switches to register form when Register tab is clicked', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const registerTab = screen.getByRole('button', { name: /^register$/i })
    fireEvent.click(registerTab)

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('logs in a user with valid email and password', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Home Page Content</div>} />
        </Routes>
      </MemoryRouter>
    )

    const identifierInput = screen.getByLabelText(/email or phone number/i)
    const passwordInput = screen.getByLabelText(/^password/i)
    const submitBtn = screen.getByTestId('login-submit-btn')

    fireEvent.change(identifierInput, { target: { value: 'shubham@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'secret123' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      const state = useAuthStore.getState()
      expect(state.user).not.toBeNull()
      expect(state.user?.email).toBe('shubham@example.com')
      expect(state.user?.name).toBe('Shubham')
    })
  })

  it('registers a new user and updates auth state', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Home Page Content</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Switch to register
    fireEvent.click(screen.getByRole('button', { name: /^register$/i }))

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Aditi Roy' } })
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '9876543210' } })
    fireEvent.change(screen.getByLabelText(/password \(min 6 characters\)/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      const state = useAuthStore.getState()
      expect(state.user).not.toBeNull()
      expect(state.user?.name).toBe('Aditi Roy')
      expect(state.user?.phone).toBe('9876543210')
    })
  })

  it('shows logged in profile screen when user is already logged in and allows logout', () => {
    useAuthStore.setState({
      user: {
        id: 'cust-99',
        name: 'Rahul Verma',
        email: 'rahul@test.com'
      }
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Rahul Verma' })).toBeInTheDocument()
    expect(screen.getByText('rahul@test.com')).toBeInTheDocument()

    const logoutBtn = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutBtn)

    expect(useAuthStore.getState().user).toBeNull()
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
  })

  it('switches to forgot password tab and handles reset link request', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const forgotBtn = screen.getByRole('button', { name: /forgot password\?/i })
    fireEvent.click(forgotBtn)

    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email or mobile number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })
})
