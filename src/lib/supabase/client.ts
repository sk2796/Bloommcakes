import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Graceful warning in non-production, ensuring app runs even without credentials during initial setup
  console.warn(
    'Supabase environment variables are missing. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local environment.'
  )
}

// typed supabase client init placeholder
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)

// Base API error custom type
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}
