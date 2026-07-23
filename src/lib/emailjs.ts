import emailjs from "@emailjs/browser";

// EmailJS credentials. Only the PUBLIC key belongs here — it is meant to be
// visible in the bundle and is restricted by the allowed-origins list in the
// EmailJS dashboard. The private key is server-side only; putting it in a Vite
// env var would ship it to every visitor.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
// The auto-reply runs through its own service so the visitor sees a sender
// address separate from my personal inbox. Falls back to the main service when
// only one is configured.
const AUTOREPLY_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_AUTOREPLY_SERVICE_ID || SERVICE_ID;

export type ContactEmailParams = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

/**
 * Sends the contact form twice: a notification to me, then an acknowledgement
 * back to the visitor. The auto-reply is deliberately not awaited alongside the
 * notification — if the courtesy email fails, the message still reached my
 * inbox, so the form should not report an error to the visitor.
 */
export async function sendContactEmail(params: ContactEmailParams) {
  if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_ID) {
    throw new Error(
      "EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_PUBLIC_KEY and VITE_EMAILJS_TEMPLATE_ID in .env.local",
    );
  }

  const options = { publicKey: PUBLIC_KEY };

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, options);

  if (AUTOREPLY_TEMPLATE_ID) {
    try {
      await emailjs.send(
        AUTOREPLY_SERVICE_ID,
        AUTOREPLY_TEMPLATE_ID,
        params,
        options,
      );
    } catch (error) {
      console.error("Auto-reply failed to send:", error);
    }
  }
}
