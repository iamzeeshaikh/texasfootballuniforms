"use client";

import { FormEvent, useState } from "react";

type ProductLeadFormProps = {
  productName: string;
};

export function ProductLeadForm({ productName }: ProductLeadFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `Quote Request: ${productName}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        product: productName,
        message: form.message,
      }),
    });

    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
        Quick Quote Request
      </p>
      <h2 className="mt-3 text-4xl text-[var(--color-navy)]">Start Your Project</h2>
      <p className="mt-3">
        Send your details for {productName.toLowerCase()} and our team can review your request
        quickly.
      </p>

      <div className="mt-6 grid gap-4">
        <input
          required
          className="input-shell"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
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
        <textarea
          required
          rows={5}
          className="input-shell"
          placeholder="Tell us about your quantity, design needs, and timeline."
          value={form.message}
          onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {status === "sent" ? (
          <p className="font-semibold text-green-600">Message sent! We'll be in touch shortly.</p>
        ) : status === "error" ? (
          <p className="font-semibold text-red-600">Something went wrong. Please try again.</p>
        ) : (
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-navy)] disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Submit"}
          </button>
        )}
      </div>
    </form>
  );
}
