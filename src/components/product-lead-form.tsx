"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { ArrowRight, Clock3 } from "lucide-react";

import { ARTWORK_ACCEPT, MAX_ARTWORK_BYTES, artworkTooLargeMessage, readArtwork } from "@/lib/artwork";
import {
  FieldErrors,
  FileField,
  FormAlert,
  SubmitButton,
  TextAreaField,
  TextField,
  isEmail,
  isPhone,
  leavingForSubmit,
} from "@/components/form-fields";
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

type FormState = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  message: string;
};

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Tell us who to reply to.";
  if (!form.email.trim()) errors.email = "We send the quote by email, so we need one.";
  else if (!isEmail(form.email)) errors.email = "That email address looks incomplete.";
  if (form.phone.trim() && !isPhone(form.phone)) errors.phone = "Check the number — that is too short to dial.";
  if (!form.message.trim()) errors.message = "A line about roster count and colors is enough to start.";
  else if (form.message.trim().length < 12) errors.message = "Add a little more so we can price it properly.";
  return errors;
}

/**
 * The lead form that sits under the hero on product, category, size-chart and
 * city pages.
 *
 * The POST body, the honeypot, the artwork upload and the `data-ga-event`
 * attribute are unchanged. What is new is the shape: visible labels, two
 * columns from `sm` up, `email`/`tel` types with autocomplete so a phone fills
 * them in one tap, a real focus ring, inline errors and a helper line under the
 * message box.
 */
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
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
  });
  const [artwork, setArtwork] = useState<File | null>(null);
  const [artworkError, setArtworkError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set = (key: keyof FormState) => (value: string) => {
    // Plain object, not a setForm updater: the updater has to stay pure, and
    // React re-runs queued updaters on a later render — a setErrors() call
    // inside one replayed itself after submit and wiped a field's error.
    const next = { ...form, [key]: value };
    setForm(next);
    // Once a field has been flagged, re-check it on every keystroke so the
    // message disappears the moment it is fixed.
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validate(next)[key] ?? "" }));
  };

  const blur =
    (key: keyof FormState) => (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Never raise an error on the way to the submit button: the new line of
      // text would push the button out from under the pointer.
      if (leavingForSubmit(event)) return;
      setTouched((current) => ({ ...current, [key]: true }));
      setErrors((prev) => ({ ...prev, [key]: validate(form)[key] ?? "" }));
    };

  const errorFor = (key: keyof FormState) => errors[key] || undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (artworkError) return;

    // Honeypot: a real visitor never sees this field, so anything in it is a bot.
    const website = new FormData(event.currentTarget).get("website");
    if (typeof website === "string" && website.trim() !== "") {
      router.push("/thank-you/");
      return;
    }

    const found = validate(form);
    if (Object.keys(found).length) {
      // Move focus BEFORE writing the errors. On macOS a button does not take
      // focus on click, so focus() here fires the blur handler of whatever
      // field the visitor was still in — and that handler's own setErrors
      // landed after this one and dropped the other fields' messages.
      // The DOM has not re-rendered with aria-invalid yet, so go by field name.
      const firstKey = Object.keys(found)[0];
      const first = event.currentTarget.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      first?.focus({ preventScroll: true });
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      setTouched({ name: true, email: true, phone: true, message: true });
      setErrors(found);
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
      noValidate
      className="surface-card min-w-0 scroll-mt-24 p-6 sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl text-[var(--color-navy)] sm:text-4xl">{heading}</h2>
      <p className="mt-3">
        {blurb ??
          `Send your details for ${productName.toLowerCase()} and our team can review your request quickly. Minimum 10 per design, free mockup in 24 hours.`}
      </p>

      <div className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <TextField
          label="Your name"
          name="name"
          required
          autoComplete="name"
          placeholder="Coach Ramirez"
          value={form.name}
          onChange={set("name")}
          onBlur={blur("name")}
          error={errorFor("name")}
        />
        <TextField
          label="Email address"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="coach@school.org"
          value={form.email}
          onChange={set("email")}
          onBlur={blur("email")}
          error={errorFor("email")}
        />
        <TextField
          label="Phone number"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(555) 123-4567"
          value={form.phone}
          onChange={set("phone")}
          onBlur={blur("phone")}
          error={errorFor("phone")}
        />
        <TextField
          label={cityName ? `School or club in ${cityName}` : "School or club"}
          name="organization"
          autoComplete="organization"
          placeholder={cityName ? `${cityName} ISD, select or rec league` : "Lubbock Cooper HS"}
          value={form.organization}
          onChange={set("organization")}
          onBlur={blur("organization")}
        />
        {cityName ? <input type="hidden" name="city" value={cityName} /> : null}

        <TextAreaField
          label="What do you need?"
          name="message"
          required
          wide
          rows={5}
          placeholder={
            cityName
              ? `Tell us your team name, colors, roster count, and when you need the kit in ${cityName}.`
              : "Tell us about your quantity, design needs, and timeline."
          }
          hint={
            cityName
              ? `Roster count, team colors, decoration and the date you need them in ${cityName} — that is enough for a firm quote.`
              : "Roster count, team colors, decoration and the date you need them — that is enough for a firm quote."
          }
          value={form.message}
          onChange={set("message")}
          onBlur={blur("message")}
          error={errorFor("message")}
        />

        <FileField
          label="Upload artwork"
          name="artwork"
          wide
          accept={ARTWORK_ACCEPT}
          fileName={artwork?.name}
          error={artworkError || undefined}
          hint="Logo, crest or a photo of last season's jersey. PNG, JPG, PDF, AI or SVG up to 3 MB."
          onSelect={(input) => {
            const file = input.files?.[0] ?? null;
            if (file && file.size > MAX_ARTWORK_BYTES) {
              setArtwork(null);
              setArtworkError(artworkTooLargeMessage(company.email));
              input.value = "";
              return;
            }
            setArtworkError("");
            setArtwork(file);
          }}
        />

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

      <div className="mt-6 grid gap-3">
        <FormAlert message={status === "error" ? errorMessage : ""} />
        <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
          <SubmitButton sending={status === "sending"} label="Send my quote request" inline>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </SubmitButton>
          <p className="flex items-center gap-2 text-sm leading-6 text-[var(--color-navy-soft)]">
            <Clock3 className="h-4 w-4 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
            We&rsquo;ll follow up within 1 business day.
          </p>
        </div>
      </div>
    </form>
  );
}
