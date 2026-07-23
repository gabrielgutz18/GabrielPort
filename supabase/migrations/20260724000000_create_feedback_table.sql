-- Visitor ratings for the "Rate my work" section.
--
-- Mirrors the FeedbackEntry type in src/components/data/feedbackData.ts so rows
-- render through the same card list as the hardcoded seed entries.

create table if not exists public.feedback (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  -- The person's website, company, or the work they do — "nqstv.net",
  -- "Freelance Designer". The form defaults this to "Visitor" when left blank.
  source      text        not null default 'Visitor',
  rating      smallint    not null,
  comment     text        not null,
  created_at  timestamptz not null default now(),
  -- Flip the default to false to hold new submissions for review; the read
  -- policy below already filters on it, so nothing else has to change.
  approved    boolean     not null default true,

  -- Length limits match the maxLength attributes on the form inputs, so a
  -- submission that passes client validation can never be rejected here.
  constraint feedback_rating_range  check (rating between 1 and 5),
  constraint feedback_name_len      check (char_length(name) between 1 and 60),
  constraint feedback_source_len    check (char_length(source) between 1 and 80),
  constraint feedback_comment_len   check (char_length(comment) between 1 and 400)
);

-- The list is always "approved, newest first" — a partial index keeps that
-- query off a sequential scan as the table grows.
create index if not exists feedback_approved_created_at_idx
  on public.feedback (created_at desc)
  where approved;

alter table public.feedback enable row level security;

-- Visitors may read approved entries and add their own. No update or delete
-- policy exists, so the publishable key cannot edit or remove a review —
-- moderation happens in the Supabase dashboard (service role).
drop policy if exists "Anyone can read approved feedback" on public.feedback;
create policy "Anyone can read approved feedback"
  on public.feedback
  for select
  to anon, authenticated
  using (approved);

drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
  on public.feedback
  for insert
  to anon, authenticated
  with check (true);

-- The current hardcoded seed entries, so the section reads from one source
-- instead of merging an array with a query result. Guarded on the table being
-- empty rather than "on conflict", since nothing here is unique — re-running
-- the migration would otherwise stack up another four copies.
insert into public.feedback (name, source, rating, comment, created_at)
select seed.name, seed.source, seed.rating, seed.comment, seed.created_at
from (values
  ('Neil Q.',  'nqstv.net',          5::smallint, 'Gabriel delivered our company site fast and it loads incredibly well. Clear communication the whole way through.', '2026-03-12'::timestamptz),
  ('Maria S.', 'Camp Ba-long',       5::smallint, 'The booking page is clean and easy for our guests. Exactly what we needed and looks great on phones.',            '2026-01-28'::timestamptz),
  ('Josh D.',  'Freelance Designer', 4::smallint, 'Solid front-end work and a good eye for layout. Happy to collaborate again on the next project.',                  '2025-12-05'::timestamptz),
  ('Henry Sy', 'SM CEO',             5::smallint, 'Solid front-end work and a good eye for layout. Happy to collaborate again on the next project.',                  '2026-12-05'::timestamptz)
) as seed(name, source, rating, comment, created_at)
where not exists (select 1 from public.feedback);
