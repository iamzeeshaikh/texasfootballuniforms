"use client";

import { FormEvent, useState } from "react";

import { company } from "@/lib/site";

type ProductLeadFormProps = {
  productName: string;
};

export function ProductLeadForm({ productName }: ProductLeadFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [files, setFiles] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(`Quote Request: ${productName}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nProduct: ${productName}\nSelected Files: ${
        files.length ? files.join(", ") : "None"
      }\n\nMessage:\n${form.message}`,
    );

    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`;
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
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
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
        <textarea
          required
          rows={5}
          className="input-shell"
          placeholder="Tell us about your quantity, design needs, and timeline."
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        />
        <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-navy)]">
            Choose File
          </label>
          <input
            type="file"
            multiple
            className="block w-full text-sm text-[var(--color-navy-soft)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--color-navy)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--color-red)]"
            onChange={(event) =>
              setFiles(Array.from(event.target.files ?? []).map((file) => file.name))
            }
          />
          {files.length ? (
            <p className="mt-3 text-sm text-[var(--color-navy-soft)]">
              Selected: {files.join(", ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <button
          type="submit"
          className="inline-flex justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-navy)]"
        >
          Submit
        </button>
        <p className="text-sm leading-6 text-[var(--color-navy-soft)]">
          This opens your email client with the request pre-filled. Selected file names are
          included in the message.
        </p>
      </div>
    </form>
  );
}
