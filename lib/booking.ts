/** Canonical scheduling link (Calendly). */
export const CALENDLY_BOOKING_URL =
  "https://calendly.com/legal-jumbohomes/30min";

export interface CalendlyPrefill {
  name?: string;
  email?: string;
  /** Application id — surfaced to the advisor as context. */
  applicationId?: string;
  /** Human-readable SKU name shown in the booking notes. */
  skuName?: string;
}

/**
 * Builds a Calendly link with prefilled invitee details and context. Calendly
 * reads `name` and `email` from the query string, and `a1` populates the first
 * custom question (we use it to carry the application id + service name so the
 * advisor walks in with full context).
 */
export function buildCalendlyUrl(prefill: CalendlyPrefill = {}): string {
  const params = new URLSearchParams();
  if (prefill.name) params.set("name", prefill.name);
  if (prefill.email) params.set("email", prefill.email);

  const context = [prefill.skuName, prefill.applicationId]
    .filter(Boolean)
    .join(" · ");
  if (context) params.set("a1", context);

  const qs = params.toString();
  return qs ? `${CALENDLY_BOOKING_URL}?${qs}` : CALENDLY_BOOKING_URL;
}
