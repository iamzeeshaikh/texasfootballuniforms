import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import type { MoneyPage } from "@/lib/money-pages";

/**
 * Renders the query-led sections from src/lib/money-pages.ts: H2s that use the
 * wording people actually search, a table or list per page, and the cluster
 * links. Sits alongside the page's existing long-form copy, never instead of
 * it.
 */
export function MoneySections({ page }: { page: MoneyPage }) {
  return (
    <section className="mt-12">
      <p className="max-w-3xl text-lg text-[var(--color-navy-soft)]">{page.lead}</p>

      <div className="mt-8 space-y-8">
        {page.blocks.map((block) => (
          <article key={block.heading} className="surface-card p-8 sm:p-10">
            <h2 className="text-4xl text-[var(--color-navy)]">{block.heading}</h2>

            {block.kind === "prose" ? (
              <div className="mt-5 space-y-5">
                {block.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {block.kind === "bullets" ? (
              <>
                {block.intro ? <p className="mt-5">{block.intro}</p> : null}
                <ul className="mt-6 space-y-4">
                  {block.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-red)]" />
                      <p>{bullet}</p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {block.kind === "table" ? (
              <>
                {block.intro ? <p className="mt-5">{block.intro}</p> : null}
                <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--color-border)]">
                  <table className="w-full min-w-[34rem] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[rgba(11,31,58,0.03)]">
                        {block.head.map((cell) => (
                          <th
                            key={cell || "spacer"}
                            className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row) => (
                        <tr key={row[0]} className="border-b border-[var(--color-border)] last:border-b-0">
                          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-navy)]">{row[0]}</th>
                          {row.slice(1).map((cell, index) => (
                            <td key={index} className="px-5 py-4 text-sm text-[var(--color-navy-soft)]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.note ? (
                  <p className="mt-4 text-sm text-[var(--color-navy-soft)]">{block.note}</p>
                ) : null}
              </>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-8 surface-card p-8 sm:p-10">
        <h2 className="text-4xl text-[var(--color-navy)]">Where to Go Next</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {page.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-[22px] border border-[var(--color-border)] bg-white p-5 transition hover:border-[var(--color-red)] hover:shadow-[0_14px_34px_rgba(11,31,58,0.08)]"
            >
              <span className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-red)]">
                {link.label}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
              <p className="mt-2 text-sm text-[var(--color-navy-soft)]">{link.note}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
