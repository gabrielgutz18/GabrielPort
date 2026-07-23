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

/** Approved-or-not is not modelled on this table, so every row is returned. */
export async function fetchFeedback(): Promise<FeedbackEntry[]> {
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
 * Inserts one review and returns it as a FeedbackEntry. `select().single()`
 * hands back the stored row — including the DB-generated id and created_at —
 * so the caller can drop it straight into the list without a refetch.
 */
export async function submitFeedback(input: NewFeedback): Promise<FeedbackEntry> {
  const { data, error } = await supabase
    .from('feedback')
    .insert(input)
    .select('id, name, source, rating, comment, created_at')
    .single()

  if (error) {
    throw error
  }

  return toEntry(data)
}
