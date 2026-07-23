import { createClient } from '@supabase/supabase-js'

// Both values are inlined into the client bundle at build time. That is fine:
// the publishable key is meant to be public and is fenced by row-level security
// on the database, not by staying secret. On Vercel these must also be set as
// project env vars, or the deployed build ships with them undefined.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  // Surfaces a clear message instead of a vague network error when the env vars
  // are missing — most often a deploy that never got them configured.
  console.error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
