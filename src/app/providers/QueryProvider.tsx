import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface QueryError {
  status?: number
  message?: string
}

// Global Query Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        const queryError = error as QueryError
        // Don't retry on client errors (4xx codes)
        if (queryError?.status && queryError.status >= 400 && queryError.status < 500) {
          return false
        }
        return failureCount < 2
      },
      staleTime: 1000 * 60 * 5, // 5 minutes cache default
    },
  },
})

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
