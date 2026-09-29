-- Limit what visitors can write when submitting feedback.
--
-- The publishable key ships in the client bundle, so anyone can POST to
-- /rest/v1/feedback directly and skip the form. Supabase's default grants let
-- anon write every column, which meant a direct request could set `approved`,
-- backdate or future-date `created_at` to pin a review on top, or pick its own
-- `id`. Swapping the table-wide grant for a column list closes that: those
-- columns now always take their defaults, and a request naming them is rejected
-- with "permission denied".
--
-- The four columns granted here are exactly what submitFeedback() sends, so the
-- form keeps working unchanged. Both statements are idempotent — this was first
-- applied by hand in the SQL editor, and re-running it is a no-op.

revoke insert on public.feedback from anon, authenticated;
grant insert (name, source, rating, comment) on public.feedback to anon, authenticated;
