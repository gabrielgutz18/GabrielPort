-- Route every feedback submission through the submit-feedback Edge Function.
--
-- The form now carries a reCAPTCHA token, but that only means something if the
-- token is checked server-side. As long as anon could insert into the table
-- directly, a script could skip the form (and the captcha) with nothing more
-- than the publishable key from the bundle. So anon loses insert entirely; the
-- Edge Function verifies the captcha and writes with the service role, which
-- bypasses both RLS and these grants.
--
-- Apply this only AFTER the function is deployed and the site build that calls
-- it is live — until then, the old build still inserts directly and this would
-- break the form.
--
-- Revoking at the table level also drops the column-level insert grants from
-- 20260929000000_restrict_feedback_insert_columns.sql. Reads are untouched:
-- visitors still see approved reviews through the select policy.

drop policy if exists "Anyone can submit feedback" on public.feedback;

revoke insert on public.feedback from anon, authenticated;
