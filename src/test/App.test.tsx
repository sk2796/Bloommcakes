import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('Bloomcakes Foundation App', () => {
  it('renders standard layout structure and header text', () => {
    render(<App />)
    expect(screen.getAllByText('BloomCakes')[0]).toBeInTheDocument()
    // Decoupled home page layout renders dynamic elements inside Outlet. Wait for fallback spinner structures.
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
  })
})
