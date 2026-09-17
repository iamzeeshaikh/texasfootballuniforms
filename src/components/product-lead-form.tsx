"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { ARTWORK_ACCEPT, MAX_ARTWORK_BYTES, artworkTooLargeMessage, readArtwork } from "@/lib/artwork";
import { company } from "@/lib/site";

type ProductLeadFormProps = {
  /** What the enquiry is about — the product name, or "Custom Football Uniforms" on a city page. */
  productName: string;
  /**
   * DOM id for the <form>. Defaults to "quote-form" so the sticky mobile bar,
   * the hero CTA and the /contact-us/#quote-form links all land on the form
   * that is already on the page instead of navigating away.
   */
  formId?: string;
  /** Set on city pages: prefills the organization hint and rides along in the email. */
  cityName?: string;
  eyebrow?: string;
  heading?: string;
  blurb?: string;
  /** GA4 event name for this form (see public/ga4-events.js). */
  gaEvent?: string;
};

export function ProductLeadForm({
  productName,
  formId = "quote-form",
  cityName,
  eyebrow = "Quick Quote Request",
  heading = "Start Your Project",
  blurb,
  gaEvent = "product_quote_submit",
}: ProductLeadFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
  });
  const [artwork, setArtwork] = useState<File | null>(null);
  const [artworkError, setArtworkError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (artworkError) return;

    // Honeypot: a real visitor never sees this field, so anything in it is a bot.
    const website = new FormData(event.currentTarget).get("website");
    if (typeof website === "string" && website.trim() !== "") {
      router.push("/thank-you/");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    let res: Response;
    try {
      res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: cityName
            ? `Quote Request: ${productName} — ${cityName}, TX`
            : `Quote Request: ${productName}`,
          name: form.name,
          email: form.email,
          phone: form.phone,
          organization: form.organization,
          city: cityName,
          product: productName,
          message: form.message,
          artwork: await readArtwork(artwork),
        }),
      });
    } catch {
      setStatus("error");
      setErrorMessage("Could not send. Check your connection and try again.");
      return;
    }

    if (res.ok) {
      router.push("/thank-you/");
      return;
    }

    const body = await res.json().catch(() => null);
    setStatus("error");
    setErrorMessage(
      (body && typeof body.error === "string" && body.error) ||
        "Something went wrong. Please try again.",
    );
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      data-ga-event={gaEvent}
      className="surface-card scroll-mt-24 p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl text-[var(--color-navy)]">{heading}</h2>
      <p className="mt-3">
        {blurb ??
          `Send your details for ${productName.toLowerCase()} and our team can review your request quickly. Minimum 10 per design, free mockup in 24 hours.`}
      </p>

      <div className="mt-6 grid gap-4">
        <input
          required
          name="name"
          autoComplete="name"
          className="input-shell"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
        />
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="input-shell"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
        />
        <input
          name="phone"
          autoComplete="tel"
          className="input-shell"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
        />
        <input
          name="organization"
          className="input-shell"
          placeholder={
            cityName
              ? `School, Club, or League in ${cityName}`
              : "School, Club, or Organization"
          }
          value={form.organization}
          onChange={(e) => setForm((c) => ({ ...c, organization: e.target.value }))}
        />
        {cityName ? <input type="hidden" name="city" value={cityName} /> : null}
        <textarea
          required
          rows={5}
          name="message"
          className="input-shell"
          placeholder={
            cityName
              ? `Tell us your team name, colors, roster count, and when you need the kit in ${cityName}.`
              : "Tell us about your quantity, design needs, and timeline."
          }
          value={form.message}
          onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))}
        />
        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[var(--color-navy)]">
            Upload artwork <span className="font-normal text-[var(--color-navy-soft)]">(optional, max 3 MB)</span>
          </span>
          <input
            type="file"
            name="artwork"
            accept={ARTWORK_ACCEPT}
            className="input-shell py-2.5"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (file && file.size > MAX_ARTWORK_BYTES) {
                setArtwork(null);
                setArtworkError(artworkTooLargeMessage(company.email));
                e.target.value = "";
                return;
              }
              setArtworkError("");
              setArtwork(file);
            }}
          />
          {artworkError ? (
            <span className="font-semibold text-red-600">{artworkError}</span>
          ) : null}
        </label>
        {/* Honeypot — hidden from people, irresistible to bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {status === "sent" ? (
          <p className="font-semibold text-green-600">Message sent! We&rsquo;ll be in touch shortly.</p>
        ) : (
          <>
            {status === "error" ? (
              <p className="font-semibold text-red-600">{errorMessage}</p>
            ) : null}
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-navy)] disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Submit"}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
