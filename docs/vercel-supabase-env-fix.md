# Fix: Feedback & Contact Email Broke After Vercel Deploy

**Date:** 2026-07-24
**Area:** Deployment / Environment configuration
**Status:** Resolved

---

## Symptom

Right after deploying to Vercel, two features stopped working on the live site:

- **Feedback** — the reviews section showed only seed data; submitting a review failed.
- **Contact email** — the contact form reported the form was not configured / failed to send.

Everything worked fine locally (`npm run dev` and `npm run build`).

---

## Root cause

Both features depend on two environment variables:

| Variable | Used by |
|---|---|
| `VITE_SUPABASE_URL` | Supabase client (feedback) **and** the contact form, which posts to a Supabase Edge Function |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase client (feedback) |

Code paths:

- `src/lib/supabase.ts` reads both vars. If either is missing it exports `supabase = null` (a deliberate guard so the whole app doesn't crash), which makes feedback silently fall back to seed data.
- `src/lib/emailjs.ts` reads `VITE_SUPABASE_URL` to reach the Edge Function; if it's missing it throws "Contact form is not configured."

These variables live **only** in `.env.local`, which is intentionally **gitignored** (`*.local` in `.gitignore`) so secrets never enter version control.

**The problem:** Vite inlines `import.meta.env.VITE_*` values into the JS bundle *at build time*.

- **Locally**, the build reads `.env.local` → values are present. ✅
- **On Vercel**, the repo is cloned **without** `.env.local`, and no matching env vars were set in the Vercel project. So at build time both values were `undefined`, and the deployed bundle shipped with `supabase = null` and the contact form disabled. ❌

The failure was invisible because the code degrades gracefully instead of erroring loudly — the only signal was a `console.error` on the live site:
`Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY...`

This exact scenario was even predicted in the code comments of `src/lib/supabase.ts`.

---

## The fix

No code changes were needed. The fix was **configuration on Vercel**.

### 1. Add the environment variables in Vercel

Vercel dashboard → Project → **Settings → Environments → Production** → **Add Environment Variable**:

| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://qejildomfttpjximkxid.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` (the publishable key) |

- Applied to **Production, Preview, and Development** environments.
- `Key` = the variable name.
- These values are *not* secret — the publishable key is meant to be public and is protected by Supabase Row-Level Security, so the "Sensitive" toggle is optional.

### 2. Redeploy

Env vars are only baked in on a **new build**, so an existing deployment won't pick them up:

**Deployments → latest → ⋯ → Redeploy.**

### 3. Verify

On `https://gabriel-port-zeta.vercel.app`:

- Feedback section loads real entries and accepts submissions.
- Contact form sends successfully.
- Browser console (F12) no longer shows the "Supabase is not configured" error.

---

## Notes on the contact-email path

Email is a two-part system, so it has a second failure point beyond the Vercel vars:

1. **Browser → Vercel build** needs `VITE_SUPABASE_URL` (fixed above).
2. **Supabase Edge Function `send-contact-email`** must be deployed and have its own server-side secrets set:
   ```bash
   supabase functions deploy send-contact-email
   supabase secrets set EMAILJS_PUBLIC_KEY=... EMAILJS_PRIVATE_KEY=... \
     EMAILJS_SERVICE_ID=... EMAILJS_TEMPLATE_ID=... \
     EMAILJS_AUTOREPLY_SERVICE_ID=... EMAILJS_AUTOREPLY_TEMPLATE_ID=...
   ```
   The EmailJS **private** key lives here, never in the browser bundle (never give it a `VITE_` prefix).
3. The function's CORS allowlist already permits any `*.vercel.app` domain. **If a custom domain is added later**, register it:
   ```bash
   supabase secrets set ALLOWED_ORIGINS=https://yourdomain.com
   ```

> The `VITE_EMAILJS_*` entries in `.env.local` are legacy — the client no longer uses them (email goes through the Edge Function). They do **not** need to be set on Vercel.

---

## Lessons learned

1. **`.env.local` is never deployed.** Anything the app needs at build time must be duplicated in the host's env-var settings (Vercel, Netlify, etc.). Gitignoring secrets is correct — but it means the deploy target needs them configured separately.
2. **`VITE_` vars are inlined at build time, not read at runtime.** Changing them requires a **rebuild/redeploy**, not just a restart.
3. **Graceful degradation can hide misconfiguration.** The null-guard kept the app from crashing, which is good UX — but it also made the failure silent. When "it works locally but not deployed," check the deploy environment's variables first, and read the browser console for the guard's warning.
4. **Only `VITE_`-prefixed vars reach the browser.** This is a security feature: server-only secrets (like the EmailJS private key) must *not* have the prefix, so they stay out of the public bundle. That's why email is split into a public front (Vercel) and a secret back (Edge Function).
5. **Keep a deployment checklist.** For any new environment variable added to `.env.local`, add a step to also set it in Vercel and redeploy.

---

## Quick reference: where each secret lives

| Secret | Location | Public? |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env.local` + Vercel env vars | Yes (in bundle) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env.local` + Vercel env vars | Yes (RLS-protected) |
| `EMAILJS_PRIVATE_KEY` and other EmailJS secrets | Supabase Edge Function secrets | **No — server only** |
