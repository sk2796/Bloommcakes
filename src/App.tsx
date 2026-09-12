import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { AppRouter } from '@/app/router'
import '@/index.css'

export default function App() {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <QueryProvider>
          <AppRouter />
        </QueryProvider>
      </HelmetProvider>
    </React.StrictMode>
  )
}
