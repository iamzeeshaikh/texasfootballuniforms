"use client";

import { useEffect, useState } from "react";

import { DESIGN_SPEC_STORAGE_KEY } from "./design-your-uniform";

type Stored = {
  requestType?: string;
  rows?: { label: string; value: string }[];
  at?: number;
};

/** Older than this and it belongs to an earlier visit, not the submit we just made. */
const MAX_AGE_MS = 30 * 60 * 1000;

/**
 * Shows the visitor, on the thank-you page, the specification they just sent.
 *
 * The design tool stores it in sessionStorage on a successful submit: a long
 * specification in the URL would leak into analytics, browser history and any
 * link the coach shares, and would break the moment a spec grew past the URL
 * limit. Storage can be unavailable (private mode, blocked site data), in
 * which case this renders nothing and the thank-you page stands on its own.
 */
export function SubmittedSpec() {
  const [spec, setSpec] = useState<Stored | null>(null);

  useEffect(() => {
    // Deferred a tick: the server-rendered thank-you page has no specification
    // in it, so reading storage is a follow-up update, not a first render.
    const timer = window.setTimeout(() => {
      try {
        const raw = window.sessionStorage.getItem(DESIGN_SPEC_STORAGE_KEY);
        if (!raw) return;
        window.sessionStorage.removeItem(DESIGN_SPEC_STORAGE_KEY);
        const parsed = JSON.parse(raw) as Stored;
        if (!parsed?.rows?.length) return;
        if (parsed.at && Date.now() - parsed.at > MAX_AGE_MS) return;
        setSpec(parsed);
      } catch {
        // Unreadable or blocked storage: nothing to show.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!spec?.rows?.length) return null;

  return (
    <section className="surface-card mt-8 p-6 text-left sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
        {spec.requestType === "Free mockup request" ? "Your mockup request" : "What you sent us"}
      </p>
      <h2 className="mt-3 text-3xl text-[var(--color-navy)]">Your uniform specification</h2>
      <dl className="mt-5">
        {spec.rows.map((row) => (
          <div
            key={`${row.label}-${row.value}`}
            className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] py-2.5 last:border-0"
          >
            <dt className="text-sm text-[var(--color-navy-soft)]">{row.label}</dt>
            <dd className="max-w-[62%] text-right text-sm font-semibold text-[var(--color-navy)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-sm text-[var(--color-navy-soft)]">
        A copy is already with our uniform team. If something above is wrong, reply to our email or
        call us and we will change it before the mockup is drawn.
      </p>
    </section>
  );
}
