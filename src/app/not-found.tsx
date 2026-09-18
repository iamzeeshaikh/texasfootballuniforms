import type { Metadata } from "next";
import Link from "next/link";

import { categoryGroups, getCategorySlug } from "@/lib/catalog";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found | Texas Football Uniforms",
  description:
    "That page has moved or never existed. Browse our custom football uniform categories or call for a team quote. Min 10 per design, free 24-hour mockup.",
  robots: { index: false, follow: true },
};

/**
 * A 404 that is worth landing on.
 *
 * The old one rendered a headline and two buttons, which on a site with 75
 * pages is a dead end: somebody arriving from a stale link or a mistyped URL
 * had nothing to click toward. This one lists every category, the popular
 * pages, and the two ways to reach a person.
 */
const popular = [
  { href: "/reversible-football-jerseys/", label: "Reversible Football Jerseys" },
  { href: "/sublimated-football-jerseys/", label: "Sublimated Football Jerseys" },
  { href: "/high-school-football-uniforms/", label: "High School Football Uniforms" },
  { href: "/youth-football-uniforms/", label: "Youth Football Uniforms" },
  { href: "/coaches-apparel/", label: "Coaches Uniforms & Sideline Apparel" },
  { href: "/football-team-kits/", label: "Full Football Team Kits" },
];

export default function NotFound() {
  return (
    <section className="section-space">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
            Error 404
          </p>
          <h1 className="mt-4 text-5xl text-[var(--color-navy)] sm:text-6xl">Page Not Found</h1>
          <p className="mt-5 text-lg">
            That page has moved or never existed. Everything we make is one click below —
            custom football uniforms, jerseys, practice gear and sideline apparel for Texas
            programs, minimum 10 per design with a free mockup within 24 hours.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact-us/#quote-form"
              className="rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-navy)]"
            >
              Get a Quote
            </Link>
            <a
              href={company.phoneHref}
              className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-red)]"
            >
              Call {company.phoneDisplay}
            </a>
          </div>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl text-[var(--color-navy)]">Browse by Category</h2>
              <ul className="mt-4 grid gap-2.5">
                {categoryGroups.map((group) => (
                  <li key={group}>
                    <Link
                      href={`/categories/${getCategorySlug(group)}/`}
                      className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
                    >
                      {group}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/all-categories/"
                    className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
                  >
                    All Categories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[var(--color-navy)]">Most Requested Pages</h2>
              <ul className="mt-4 grid gap-2.5">
                {popular.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/locations/"
                    className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
                  >
                    Texas Cities We Serve
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
