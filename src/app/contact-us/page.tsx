import type { Metadata } from "next";

import { QuoteForm } from "@/components/quote-form";
import { company } from "@/lib/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact Texas Football Uniforms | Request a Team Quote",
  description:
    "Contact Texas Football Uniforms for custom football jerseys, uniforms, sideline apparel, and quote-based teamwear support.",
  path: "/contact-us/",
});

export default function ContactUsPage() {
  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="surface-card p-8 sm:p-10">
            <span className="rounded-full bg-[var(--color-red)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
              Contact Us
            </span>
            <h1 className="mt-5 text-5xl text-[var(--color-navy)] sm:text-6xl">
              Request a Free Quote
            </h1>
            <p className="mt-5 text-lg">
              Reach out with your roster size, target timeline, and the product mix your team
              needs. We will help you shape a premium custom football apparel plan for your
              Texas program.
            </p>
            <div className="mt-8 space-y-4 rounded-[24px] border border-[var(--color-border)] bg-white p-6">
              <a href={`mailto:${company.email}`} className="block text-base font-semibold text-[var(--color-red)]">
                {company.email}
              </a>
              <a href={company.phoneHref} className="block text-base font-semibold text-[var(--color-red)]">
                {company.phoneDisplay}
              </a>
              {company.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
