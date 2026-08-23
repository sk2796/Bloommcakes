import React from 'react'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { AppRouter } from '@/app/router'
import '@/index.css'

export default function App() {
  return (
    <React.StrictMode>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </React.StrictMode>
  )
}
