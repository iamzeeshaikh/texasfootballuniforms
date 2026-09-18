/**
 * One place that talks to gtag.
 *
 * public/ga4-events.js already fires the portfolio events (phone_call,
 * whatsapp_click, email_click, lead_form_submit and whatever a form names in
 * `data-ga-event`). The ecommerce events need a `value` and a `currency` that a
 * generic submit listener cannot know, so the cart fires them itself and marks
 * its forms `data-ga-managed` to stop the generic listener firing a second,
 * value-less copy of the same thing.
 */
type GtagParams = Record<string, unknown>;

export function gaEvent(name: string, params: GtagParams = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, params);
}
