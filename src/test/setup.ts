import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Clean up DOM after each test
afterEach(() => {
  cleanup()
})

// Mock global.fetch to support pincode checks in tests
const MOCK_PINCODES = ['380001', '380009', '380015', '380054', '382481', '380058', '380021']

global.fetch = vi.fn().mockImplementation((url: string) => {
  if (url.includes('/pincodes')) {
    // Parse URL code query parameter safely
    const codeMatch = url.match(/code=([^&]+)/)
    const code = codeMatch ? codeMatch[1] : ''
    const isServiceable = MOCK_PINCODES.includes(code)
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(isServiceable),
    })
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
})
