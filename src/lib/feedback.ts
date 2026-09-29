import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { FeedbackEntry } from '../components/data/feedbackData'

// The DB column is created_at (timestamptz); the component works in terms of a
// `date` string. Keep the translation in one place so neither side leaks into
// the other.
type FeedbackRow = {
  id: string
  name: string
  source: string
  rating: number
  comment: string
  created_at: string
}

const toEntry = (row: FeedbackRow): FeedbackEntry => ({
  id: row.id,
  name: row.name,
  source: row.source,
  rating: row.rating,
  comment: row.comment,
  date: row.created_at,
})

/** No `approved` filter needed: the table's select policy only exposes approved rows. */
export async function fetchFeedback(): Promise<FeedbackEntry[]> {
  // Unconfigured Supabase: return nothing so the section falls back to its seed
  // entries instead of surfacing an error.
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('feedback')
    .select('id, name, source, rating, comment, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map(toEntry)
}

export type NewFeedback = {
  name: string
  source: string
  rating: number
  comment: string
}

/**
 * Sends one review to the submit-feedback Edge Function, which verifies the
 * reCAPTCHA token with Google before inserting — the table itself no longer
 * accepts inserts from the browser. The function returns the stored row,
 * including the DB-generated id and created_at, so the caller can drop it
 * straight into the list without a refetch.
 */
export async function submitFeedback(
  input: NewFeedback,
  captchaToken: string,
): Promise<FeedbackEntry> {
  if (!supabase) {
    throw new Error('Feedback is unavailable right now. Please try again later.')
  }

  const { data, error } = await supabase.functions.invoke<FeedbackRow>(
    'submit-feedback',
    { body: { ...input, captchaToken } },
  )

  if (error) {
    // A non-2xx reply surfaces as a generic "non-2xx status code" error; the
    // function's own `{ error }` message (bad captcha, missing secret, ...) is
    // on the response body, so pull it out to make the console log useful.
    const detail =
      error instanceof FunctionsHttpError
        ? await error.context
            .json()
            .then((body: { error?: string }) => body?.error)
            .catch(() => null)
        : null
    throw new Error(detail ?? error.message)
  }

  if (!data) {
    throw new Error('Feedback was not saved. Please try again.')
  }

  return toEntry(data)
}
