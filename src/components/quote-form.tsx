"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { ArrowRight, Clock3 } from "lucide-react";

import {
  FieldErrors,
  FormAlert,
  SubmitButton,
  TextAreaField,
  TextField,
  isEmail,
  isPhone,
  leavingForSubmit,
} from "@/components/form-fields";

type FormState = {
  name: string;
  organization: string;
  email: string;
  phone: string;
  product: string;
  timeline: string;
  details: string;
};

const EMPTY: FormState = {
  name: "",
  organization: "",
  email: "",
  phone: "",
  product: "",
  timeline: "",
  details: "",
};

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Tell us who to reply to.";
  if (!form.email.trim()) errors.email = "We send the quote by email, so we need one.";
  else if (!isEmail(form.email)) errors.email = "That email address looks incomplete.";
  if (form.phone.trim() && !isPhone(form.phone)) errors.phone = "Check the number — that is too short to dial.";
  if (!form.details.trim()) errors.details = "A line about quantity and colors is enough to start.";
  else if (form.details.trim().length < 12) errors.details = "Add a little more so we can price it properly.";
  return errors;
}

/**
 * The quick quote form (home page and /contact-us/).
 *
 * The POST body, the honeypot and `data-ga-event="quote_form_submit"` are
 * unchanged — only the shape of the form is new: visible labels, two columns
 * from `sm` up, real `email`/`tel` types with autocomplete, a focus ring, and
 * errors shown inline next to the field that caused them.
 */
export function QuoteForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
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

    // Honeypot: hidden from people, so anything in it came from a bot.
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
      setTouched({ name: true, email: true, phone: true, details: true });
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
          subject: `Quote Request: ${form.product || "Custom Football Uniforms"}`,
          name: form.name,
          organization: form.organization,
          email: form.email,
          phone: form.phone,
          product: form.product,
          timeline: form.timeline,
          // Named "message" so /api/lead's required-field check sees the body
          // text under the same key every form on the site uses.
          message: form.details,
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
      id="quote-form"
      onSubmit={handleSubmit}
      data-ga-event="quote_form_submit"
      noValidate
      className="surface-card min-w-0 scroll-mt-24 p-6 sm:p-8"
    >
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
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
          label="School or club"
          name="organization"
          autoComplete="organization"
          placeholder="Lubbock Cooper HS"
          value={form.organization}
          onChange={set("organization")}
          onBlur={blur("organization")}
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
          label="Product interest"
          name="product"
          autoComplete="off"
          placeholder="Full uniform sets, reversible jerseys…"
          value={form.product}
          onChange={set("product")}
        />
        <TextField
          label="Delivery timeline"
          name="timeline"
          autoComplete="off"
          placeholder="In hand by 15 August"
          hint="Production is 1 to 2 weeks after you approve the design, and we do take rush orders — put your real date here and we'll confirm what's possible."
          value={form.timeline}
          onChange={set("timeline")}
        />

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <TextAreaField
          label="Project details"
          name="details"
          required
          wide
          rows={6}
          placeholder="Tell us about quantities, customization needs, and any design direction."
          hint="The more you give us — roster count, team colors, decoration, the date you need them — the closer the first quote lands."
          value={form.details}
          onChange={set("details")}
          onBlur={blur("details")}
          error={errorFor("details")}
        />
      </div>

      <div className="mt-6 grid gap-3">
        <FormAlert message={status === "error" ? errorMessage : ""} />
        <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
          <SubmitButton sending={status === "sending"} label="Send quote request" inline>
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
