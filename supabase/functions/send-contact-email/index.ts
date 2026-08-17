// @ts-nocheck — Runs on Supabase's Deno runtime, not the app's Node/Vite build.
// Editors assuming a browser/Node context flag Deno.* as undefined; the app's
// own typecheck (tsconfig only includes src/) never touches this file.
// Supabase Edge Function — contact form relay.
//
// Keeps every EmailJS credential server-side. The browser posts the form here;
// this function calls the EmailJS REST API with the private key, which never
// reaches the client bundle.
//
// Required secrets (supabase secrets set ...):
//   EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY,
//   EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
//   EMAILJS_AUTOREPLY_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID
// Optional:
//   ALLOWED_ORIGINS — comma-separated; overrides the defaults below.

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

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
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
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

type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

const LIMITS: Record<keyof ContactPayload, number> = {
  firstName: 80,
  lastName: 80,
  email: 254,
  subject: 200,
  message: 5000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(input: unknown): { data: ContactPayload } | { error: string } {
  if (typeof input !== "object" || input === null) {
    return { error: "Expected a JSON object." };
  }

  const raw = input as Record<string, unknown>;
  const clean = {} as ContactPayload;

  for (const key of Object.keys(LIMITS) as (keyof ContactPayload)[]) {
    const value = raw[key];

    if (typeof value !== "string" || !value.trim()) {
      return { error: `Missing required field: ${key}.` };
    }
    if (value.length > LIMITS[key]) {
      return { error: `Field ${key} exceeds ${LIMITS[key]} characters.` };
    }

    clean[key] = value.trim();
  }

  if (!EMAIL_PATTERN.test(clean.email)) {
    return { error: "Please provide a valid email address." };
  }

  return { data: clean };
}

function requiredSecret(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing secret: ${name}`);
  }
  return value;
}

const REQUIRED_SECRETS = [
  "EMAILJS_PUBLIC_KEY",
  "EMAILJS_PRIVATE_KEY",
  "EMAILJS_SERVICE_ID",
  "EMAILJS_TEMPLATE_ID",
];

function missingSecrets(): string[] {
  return REQUIRED_SECRETS.filter((name) => !Deno.env.get(name));
}

// EmailJS rejections are configuration problems almost every time — a disabled
// non-browser toggle, a stale private key, a renamed template. Carrying the
// upstream status and text on the error means the relay can pass it on instead
// of collapsing every cause into one opaque "could not send".
class EmailJSError extends Error {
  constructor(readonly status: number, readonly detail: string) {
    super(`EmailJS ${status}: ${detail}`);
  }
}

async function sendViaEmailJS(
  serviceId: string,
  templateId: string,
  params: ContactPayload,
) {
  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: requiredSecret("EMAILJS_PUBLIC_KEY"),
      accessToken: requiredSecret("EMAILJS_PRIVATE_KEY"),
      template_params: params,
    }),
  });

  if (!response.ok) {
    // EmailJS returns plain text on failure, not JSON.
    throw new EmailJSError(response.status, await response.text());
  }
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

  // A missing secret is a deploy-time mistake, not a transient send failure.
  // Reporting both as "could not send" hides the difference, so a form that was
  // never configured looks identical to EmailJS being down. Check up front and
  // name the missing secrets in the logs.
  const missing = missingSecrets();
  if (missing.length) {
    console.error(`Not configured — missing secrets: ${missing.join(", ")}`);
    return json({ error: "Contact form is not configured." }, 500, origin);
  }

  // The notification is the one that matters — if it fails, the visitor is told
  // the send failed so they can retry.
  try {
    await sendViaEmailJS(
      requiredSecret("EMAILJS_SERVICE_ID"),
      requiredSecret("EMAILJS_TEMPLATE_ID"),
      result.data,
    );
  } catch (error) {
    console.error("Notification failed:", error);

    // EmailJS's rejection text names the actual misconfiguration and never
    // echoes the credentials themselves, so it is safe to hand back. The
    // browser keeps showing its own generic wording; this rides along in
    // `detail` purely so the cause is visible from the console.
    const detail =
      error instanceof EmailJSError
        ? `EmailJS ${error.status}: ${error.detail}`
        : undefined;

    return json({ error: "Could not send your message.", detail }, 502, origin);
  }

  // The auto-reply is a courtesy; a failure here must not tell the visitor
  // their message was lost, because it wasn't.
  try {
    const autoreplyService =
      Deno.env.get("EMAILJS_AUTOREPLY_SERVICE_ID") ??
      requiredSecret("EMAILJS_SERVICE_ID");
    const autoreplyTemplate = Deno.env.get("EMAILJS_AUTOREPLY_TEMPLATE_ID");

    if (autoreplyTemplate) {
      await sendViaEmailJS(autoreplyService, autoreplyTemplate, result.data);
    }
  } catch (error) {
    console.error("Auto-reply failed:", error);
  }

  return json({ ok: true }, 200, origin);
});
