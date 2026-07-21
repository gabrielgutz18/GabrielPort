export type FeedbackEntry = {
  id: string
  name: string
  /* The person's website, company, or the work they do — e.g. "nqstv.net" or "Freelance Designer". */
  source: string
  rating: number
  comment: string
  /* ISO date string; kept as a plain string so it maps cleanly to a DB column later. */
  date: string
}

/*
 * Hardcoded seed feedback. Later this can be replaced by a fetch from a database
 * (same shape as FeedbackEntry), and the form submit can POST instead of only
 * updating local state.
 */
export const feedbackSeed: FeedbackEntry[] = [
  {
    id: 'seed-1',
    name: 'Neil Q.',
    source: 'nqstv.net',
    rating: 5,
    comment:
      'Gabriel delivered our company site fast and it loads incredibly well. Clear communication the whole way through.',
    date: '2026-03-12',
  },
  {
    id: 'seed-2',
    name: 'Maria S.',
    source: 'Camp Ba-long',
    rating: 5,
    comment:
      'The booking page is clean and easy for our guests. Exactly what we needed and looks great on phones.',
    date: '2026-01-28',
  },
  {
    id: 'seed-3',
    name: 'Josh D.',
    source: 'Freelance Designer',
    rating: 4,
    comment:
      'Solid front-end work and a good eye for layout. Happy to collaborate again on the next project.',
    date: '2025-12-05',
  },
  {
    id: 'seed-4',
    name: 'Henry Sy',
    source: 'SM CEO',
    rating: 5,
    comment:
      'Solid front-end work and a good eye for layout. Happy to collaborate again on the next project.',
    date: '2026-12-05',
  }
]
