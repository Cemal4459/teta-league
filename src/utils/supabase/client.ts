import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!url || !key || url.includes('your_supabase')) {
    console.warn('⚠️ Supabase environment variables are missing or default! Check your .env.local file.')
  }

  return createBrowserClient(url, key)
}
