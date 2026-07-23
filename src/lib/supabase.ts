import { createClient } from '@supabase/supabase-js'

// Both values are inlined into the client bundle at build time. That is fine:
// the publishable key is meant to be public and is fenced by row-level security
// on the database, not by staying secret. On Vercel these must also be set as
// project env vars, or the deployed build ships with them undefined.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// createClient throws synchronously on a missing URL/key. This module is pulled
// in through the feedback section, which is imported at the top of the app — so
// a throw here would crash the entire render into a blank page rather than just
// disabling one section. Guard instead: export null when unconfigured and let
// callers degrade gracefully (the feedback list falls back to its seed data).
export const supabase =
  SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null

if (!supabase) {
  console.error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (locally in .env.local, and in the Vercel project env vars).',
  )
}
