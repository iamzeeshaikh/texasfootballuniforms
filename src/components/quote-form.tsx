"use client";

import { FormEvent, useState } from "react";

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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `Quote Request: ${form.product || "Custom Football Uniforms"}`,
        ...form,
      }),
    });

    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <form id="quote-form" onSubmit={handleSubmit} className="surface-card p-6 sm:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          required
          className="input-shell"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
        />
        <input
          className="input-shell"
          placeholder="School, Club, or Organization"
          value={form.organization}
          onChange={(e) => setForm((c) => ({ ...c, organization: e.target.value }))}
        />
        <input
          required
          type="email"
          className="input-shell"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
        />
        <input
          className="input-shell"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
        />
        <input
          className="input-shell md:col-span-2"
          placeholder="Product Interest"
          value={form.product}
          onChange={(e) => setForm((c) => ({ ...c, product: e.target.value }))}
        />
        <input
          className="input-shell md:col-span-2"
          placeholder="Target Delivery Timeline"
          value={form.timeline}
          onChange={(e) => setForm((c) => ({ ...c, timeline: e.target.value }))}
        />
        <textarea
          required
          rows={6}
          className="input-shell md:col-span-2"
          placeholder="Tell us about quantities, customization needs, and any design direction."
          value={form.details}
          onChange={(e) => setForm((c) => ({ ...c, details: e.target.value }))}
        />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {status === "sent" ? (
          <p className="font-semibold text-green-600">Message sent! We'll be in touch shortly.</p>
        ) : status === "error" ? (
          <p className="font-semibold text-red-600">Something went wrong. Please try again.</p>
        ) : (
          <>
            <p className="text-sm leading-6 text-[var(--color-navy-soft)]">
              We'll follow up within 1 business day.
            </p>
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-navy)] disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send Quote Request"}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
