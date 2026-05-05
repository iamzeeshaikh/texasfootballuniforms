import Link from "next/link";

import { company } from "@/lib/site";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/all-categories/", label: "All Categories" },
  { href: "/about-us/", label: "About Us" },
  { href: "/contact-us/", label: "Contact Us" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(11,31,58,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-gold)] font-display text-xl font-semibold text-[var(--color-navy)]">
            TF
          </div>
          <div>
            <p className="font-display text-xl uppercase tracking-[0.12em] text-white">
              Texas Football Uniforms
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-ice)]">
              Premium Custom Teamwear
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80 transition hover:text-[var(--color-gold)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={company.phoneHref}
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] sm:inline-flex"
          >
            {company.phoneDisplay}
          </a>
          <Link
            href="/contact-us/#quote-form"
            className="rounded-full bg-[var(--color-red)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_rgba(200,16,46,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)]"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
