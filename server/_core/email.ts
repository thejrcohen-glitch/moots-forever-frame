/**
 * Email helper using Resend.
 * Requires RESEND_API_KEY environment variable.
 * Falls back gracefully (logs warning) if key is not set.
 */

import { Resend } from "resend";

const FROM_ADDRESS = "Moots Forever Frame <hello@email.mootsframe.com>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — email sending skipped.");
    return null;
  }
  return new Resend(key);
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send a transactional email via Resend.
 * Returns true on success, false on failure or missing key.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    if (error) {
      console.error("[email] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Unexpected error:", err);
    return false;
  }
}

// ─── Email Templates ──────────────────────────────────────────────────────────

const BASE_STYLE = `
  font-family: 'IBM Plex Mono', monospace, sans-serif;
  background: #f5f0e8;
  color: #3a3028;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 32px;
`;

const HEADER_STYLE = `
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1612;
  margin: 0 0 8px 0;
`;

const LABEL_STYLE = `
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #8b4513;
  margin: 0 0 16px 0;
`;

const BODY_STYLE = `
  font-size: 13px;
  line-height: 1.8;
  color: #52463c;
  margin: 0 0 24px 0;
`;

const DIVIDER_STYLE = `
  border: none;
  border-top: 1px solid #c8b89a;
  margin: 24px 0;
`;

const FOOTER_STYLE = `
  font-size: 11px;
  color: #8a7a6a;
  margin-top: 32px;
`;

const CTA_STYLE = `
  display: inline-block;
  background: #8b4513;
  color: #f5f0e8;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 12px 24px;
  text-decoration: none;
  margin-top: 8px;
`;

export function rsvpConfirmationEmail(opts: {
  name: string;
  eventName: string;
  eventDate: string;
  territory: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <p style="${LABEL_STYLE}">Moots Forever Frame · RSVP Confirmed</p>
      <h1 style="${HEADER_STYLE}">You're on the list, ${opts.name}.</h1>
      <hr style="${DIVIDER_STYLE}" />
      <p style="${BODY_STYLE}">
        Your RSVP for <strong>${opts.eventName}</strong> on <strong>${opts.eventDate}</strong>
        in <strong>${opts.territory}</strong> has been received.
        Ian will be in touch with details as the event approaches.
      </p>
      <p style="${BODY_STYLE}">
        In the meantime, if you haven't already — take a look at the Build Configurator
        to find the right Moots for your riding style.
      </p>
      <a href="https://mootsframe.com/build" style="${CTA_STYLE}">
        Start Your Build →
      </a>
      <hr style="${DIVIDER_STYLE}" />
      <p style="${FOOTER_STYLE}">
        Moots Forever Frame · TX · OK · AR Territory<br />
        Questions? Reply to this email or contact Ian at <strong>ianzak@mac.com</strong> · <strong>917-578-7687</strong>
      </p>
    </div>
  `;
}

export function bookingConfirmationEmail(opts: {
  name: string;
  territory: string;
  date?: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <p style="${LABEL_STYLE}">Moots Forever Frame · Pop-Up Request Received</p>
      <h1 style="${HEADER_STYLE}">Got it, ${opts.name}.</h1>
      <hr style="${DIVIDER_STYLE}" />
      <p style="${BODY_STYLE}">
        Your pop-up booking request for <strong>${opts.territory}</strong>${opts.date ? ` around <strong>${opts.date}</strong>` : ""} has been received.
        Ian Zakrocki will review your request and follow up within 2 business days.
      </p>
      <p style="${BODY_STYLE}">
        Pop-up events are free to attend and open to all riders. Bring your current bike,
        your questions, and your appetite for titanium.
      </p>
      <a href="https://mootsframe.com" style="${CTA_STYLE}">
        Back to the Campaign →
      </a>
      <hr style="${DIVIDER_STYLE}" />
      <p style="${FOOTER_STYLE}">
        Moots Forever Frame · TX · OK · AR Territory<br />
        Questions? Reply to this email or contact Ian at <strong>ianzak@mac.com</strong> · <strong>917-578-7687</strong>
      </p>
    </div>
  `;
}

export function newsletterWelcomeEmail(opts: {
  territory?: "TX" | "OK" | "AR";
}): string {
  const territoryLabel = opts.territory
    ? { TX: "Texas", OK: "Oklahoma", AR: "Arkansas" }[opts.territory]
    : null;
  return `
    <div style="${BASE_STYLE}">
      <p style="${LABEL_STYLE}">Moots Forever Frame · You're on the list</p>
      <h1 style="${HEADER_STYLE}">Welcome to the campaign.</h1>
      <hr style="${DIVIDER_STYLE}" />
      <p style="${BODY_STYLE}">
        Thanks for subscribing${territoryLabel ? ` from <strong>${territoryLabel}</strong>` : ""}.
        You'll hear from us when ride calendar dates, pop-up events, dealer testimonials,
        and new Moots stories drop across TX, OK, and AR territory.
      </p>
      <p style="${BODY_STYLE}">
        No spam. No noise. Just signals worth your time.
      </p>
      <a href="https://mootsframe.com" style="${CTA_STYLE}">
        Back to the Campaign →
      </a>
      <hr style="${DIVIDER_STYLE}" />
      <p style="${FOOTER_STYLE}">
        Moots Forever Frame · TX · OK · AR Territory<br />
        Questions? Reply to this email or contact Ian at <strong>ianzak@mac.com</strong> · <strong>917-578-7687</strong>
      </p>
    </div>
  `;
}

export function communityUploadAcknowledgmentEmail(opts: {
  riderName: string;
  territory: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <p style="${LABEL_STYLE}">Moots Forever Frame · Photo Submitted</p>
      <h1 style="${HEADER_STYLE}">Photo received, ${opts.riderName}.</h1>
      <hr style="${DIVIDER_STYLE}" />
      <p style="${BODY_STYLE}">
        Your photo from <strong>${opts.territory}</strong> has been submitted to the Community Wall.
        It will appear publicly once it has been reviewed — usually within 24 hours.
      </p>
      <p style="${BODY_STYLE}">
        Thank you for sharing your ride. The wall is only as good as the riders who fill it.
      </p>
      <a href="https://mootsframe.com/community" style="${CTA_STYLE}">
        View the Community Wall →
      </a>
      <hr style="${DIVIDER_STYLE}" />
      <p style="${FOOTER_STYLE}">
        Moots Forever Frame · TX · OK · AR Territory<br />
        Questions? Reply to this email or contact Ian at <strong>ianzak@mac.com</strong> · <strong>917-578-7687</strong>
      </p>
    </div>
  `;
}
