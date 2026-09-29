// @ts-nocheck — Runs on Supabase's Deno runtime, not the app's Node/Vite build.
// Editors assuming a browser/Node context flag Deno.* as undefined; the app's
// own typecheck (tsconfig only includes src/) never touches this file.
// Supabase Edge Function — feedback submission behind reCAPTCHA.
//
// A captcha checked only in the browser is decorative: the publishable key is
// in the bundle, so a script could insert into public.feedback directly and
// never see the widget. Instead, anon has no insert rights on the table at all
// (see the 20260930 migration). Reviews come in here, the reCAPTCHA token is
// verified with Google using the secret key, and only then is the row written
// with the service role.
//
// Required secrets (supabase secrets set ...):
//   RECAPTCHA_SECRET_KEY — the v2 checkbox secret, paired with the site key in
//                          VITE_RECAPTCHA_SITE_KEY.
// Provided by Supabase automatically:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Optional:
//   ALLOWED_ORIGINS — comma-separated; overrides the defaults below.

import { createClient } from "npm:@supabase/supabase-js@2";

const RECAPTCHA_VERIFY_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://gabriel-port-zeta.vercel.app",
  "http://localhost:5173",
  "http://localhost:5199",
];

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const ORIGINS = allowedOrigins.length ? allowedOrigins : DEFAULT_ALLOWED_ORIGINS;

// Vercel preview deployments get a fresh subdomain per push, so match the
// project's preview pattern rather than pinning every URL.
const PREVIEW_ORIGIN = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

function corsHeaders(origin: string | null): Record<string, string> {
  const permitted =
    origin && (ORIGINS.includes(origin) || PREVIEW_ORIGIN.test(origin));

  return {
    "Access-Control-Allow-Origin": permitted ? origin : ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, apikey, content-type, x-client-info",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

type FeedbackPayload = {
  name: string;
  source: string;
  rating: number;
  comment: string;
  captchaToken: string;
};

// Same limits as the table's check constraints and the form's maxLength
// attributes, so a rejection here says which field instead of a raw DB error.
function validate(input: unknown): { data: FeedbackPayload } | { error: string } {
  if (typeof input !== "object" || input === null) {
    return { error: "Expected a JSON object." };
  }

  const raw = input as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

  const name = text(raw.name);
  const source = text(raw.source) || "Visitor";
  const comment = text(raw.comment);
  const captchaToken = text(raw.captchaToken);
  const rating = raw.rating;

  if (!captchaToken) {
    return { error: "Missing captcha token." };
  }
  if (!name || name.length > 60) {
    return { error: "Name must be 1–60 characters." };
  }
  if (source.length > 80) {
    return { error: "Website or work must be at most 80 characters." };
  }
  if (!comment || comment.length > 400) {
    return { error: "Comment must be 1–400 characters." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be a whole number from 1 to 5." };
  }

  return { data: { name, source, rating, comment, captchaToken } };
}

async function verifyCaptcha(token: string, secret: string): Promise<boolean> {
  const response = await fetch(RECAPTCHA_VERIFY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  if (!response.ok) {
    throw new Error(`reCAPTCHA verify ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) {
    // error-codes separates a bad/expired token from a misconfigured secret
    // (invalid-input-secret), which otherwise look the same to the visitor.
    console.warn("reCAPTCHA rejected:", result["error-codes"]);
  }
  return result.success === true;
}

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405, origin);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400, origin);
  }

  const result = validate(body);
  if ("error" in result) {
    return json({ error: result.error }, 400, origin);
  }

  const secret = Deno.env.get("RECAPTCHA_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret || !supabaseUrl || !serviceKey) {
    console.error(
      "Not configured — need RECAPTCHA_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
    );
    return json({ error: "Feedback is not configured." }, 500, origin);
  }

  const { captchaToken, ...review } = result.data;

  try {
    if (!(await verifyCaptcha(captchaToken, secret))) {
      return json({ error: "Captcha verification failed. Please try again." }, 400, origin);
    }
  } catch (error) {
    console.error("reCAPTCHA verify failed:", error);
    return json({ error: "Could not verify captcha. Please try again." }, 502, origin);
  }

  // The service role bypasses RLS and the revoked anon grants — safe here only
  // because the columns written are fixed to the validated four above.
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await admin
    .from("feedback")
    .insert(review)
    .select("id, name, source, rating, comment, created_at")
    .single();

  if (error) {
    console.error("Insert failed:", error);
    return json({ error: "Could not save your feedback." }, 500, origin);
  }

  return json(data, 200, origin);
});
