import type { Metadata } from "next";
import Link from "next/link";

import { SubmittedSpec } from "@/components/submitted-spec";

export const metadata: Metadata = {
  title: "Thank you — your request is with us",
  description:
    "Your custom football uniform request has been received. Our team replies with pricing, fabric options and a free design mockup within one business day.",
  robots: { index: false, follow: true },
};

const steps = [
  "We review your roster size, colors and design direction.",
  "You get a written price with fabric and decoration options.",
  "We send a free digital mockup before anything is cut or printed.",
];

export default function ThankYouPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(200, 16, 46, 0.12)" }}
        >
          <svg
            className="h-8 w-8"
            style={{ color: "var(--color-red)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl text-[var(--color-navy)] sm:text-5xl">
          Thank you — we have your request
        </h1>
        <p className="mt-4 text-[var(--color-navy-soft)]">
          Your details are with our uniform team. We reply with pricing, fabric options and a
          production timeline within one business day.
        </p>

        <ol className="surface-card mt-8 grid gap-3 p-6 text-left">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span
                className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: "var(--color-navy)" }}
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <SubmittedSpec />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-navy)] disabled:opacity-60">
            Back to home
          </Link>
          <Link href="/design-your-uniform/" className="inline-flex justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-red)]">
            Design another uniform
          </Link>
          <Link href="/all-categories/" className="inline-flex justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-red)]">
            Browse uniforms
          </Link>
        </div>
      </div>
    </section>
  );
}
