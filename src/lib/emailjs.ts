// Contact form transport.
//
// No EmailJS credentials live here any more. The browser posts to a Supabase
// Edge Function (supabase/functions/send-contact-email), which holds the keys
// as server-side secrets and talks to EmailJS itself.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type ContactEmailParams = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(params: ContactEmailParams) {
  if (!SUPABASE_URL) {
    throw new Error(
      "Contact form is not configured. Set VITE_SUPABASE_URL in .env.local",
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Not required while the function runs with verify_jwt disabled, but the
  // Supabase gateway expects it on some plans and it is harmless either way.
  if (SUPABASE_KEY) {
    headers.apikey = SUPABASE_KEY;
    headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  }

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/send-contact-email`,
    { method: "POST", headers, body: JSON.stringify(params) },
  );

  if (!response.ok) {
    const detail = await response
      .json()
      .then((body) => body?.error)
      .catch(() => null);

    throw new Error(detail ?? `Contact form failed (${response.status})`);
  }
}
