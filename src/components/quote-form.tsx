"use client";

import { FormEvent, useState } from "react";

import { company } from "@/lib/site";

export function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    product: "",
    timeline: "",
    details: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(`Quote Request: ${form.product || "Custom Football Uniforms"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nOrganization: ${form.organization}\nEmail: ${form.email}\nPhone: ${form.phone}\nProduct: ${form.product}\nTimeline: ${form.timeline}\n\nProject Details:\n${form.details}`,
    );

    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form id="quote-form" onSubmit={handleSubmit} className="surface-card p-6 sm:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          required
          className="input-shell"
          placeholder="Your Name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <input
          className="input-shell"
          placeholder="School, Club, or Organization"
          value={form.organization}
          onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))}
        />
        <input
          required
          type="email"
          className="input-shell"
          placeholder="Email Address"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
        <input
          className="input-shell"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
        />
        <input
          className="input-shell md:col-span-2"
          placeholder="Product Interest"
          value={form.product}
          onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))}
        />
        <input
          className="input-shell md:col-span-2"
          placeholder="Target Delivery Timeline"
          value={form.timeline}
          onChange={(event) => setForm((current) => ({ ...current, timeline: event.target.value }))}
        />
        <textarea
          required
          rows={6}
          className="input-shell md:col-span-2"
          placeholder="Tell us about quantities, customization needs, and any design direction."
          value={form.details}
          onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))}
        />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[var(--color-navy-soft)]">
          This opens your email client with the quote details pre-filled for faster follow-up.
        </p>
        <button
          type="submit"
          className="inline-flex justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-navy)]"
        >
          Send Quote Request
        </button>
      </div>
    </form>
  );
}
