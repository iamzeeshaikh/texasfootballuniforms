import Link from "next/link";

import { categoryGroups, getAllProducts, getCategorySlug } from "@/lib/catalog";
import { company } from "@/lib/site";

export function Footer() {
  const topProducts = getAllProducts().slice(0, 5);

  return (
    <footer className="border-t border-white/10 bg-[var(--color-navy)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 text-white sm:px-6 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.95fr] lg:px-8">
        <div className="space-y-5">
          <p className="font-display text-3xl uppercase tracking-[0.1em] text-[var(--color-gold)]">
            Built for Texas Programs
          </p>
          <p className="max-w-xl text-base leading-7 text-white/75">
            Premium custom football uniforms, jerseys, sideline apparel, and teamwear
            developed for youth, school, club, and tournament programs that need a
            stronger on-field identity without stock-product limitations.
          </p>
          <div className="space-y-1 text-sm text-white/70">
            <p className="text-white">{company.addressLines[0]}</p>
            <p className="text-white">{company.addressLines[1]}</p>
            <p className="text-white">{company.addressLines[2]}</p>
            <a href={company.phoneHref} className="block transition hover:text-[var(--color-gold)]">
              {company.phoneDisplay}
            </a>
            <a href={`mailto:${company.email}`} className="block transition hover:text-[var(--color-gold)]">
              {company.email}
            </a>
          </div>
        </div>

        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
            Explore
          </p>
          <div className="grid gap-3 text-sm">
            <Link href="/" className="transition hover:text-[var(--color-gold)]">
              Home
            </Link>
            <Link href="/all-categories/" className="transition hover:text-[var(--color-gold)]">
              All Categories
            </Link>
            <Link href="/about-us/" className="transition hover:text-[var(--color-gold)]">
              About Us
            </Link>
            <Link href="/contact-us/" className="transition hover:text-[var(--color-gold)]">
              Contact Us
            </Link>
            <Link href="/privacy-policy/" className="transition hover:text-[var(--color-gold)]">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions/" className="transition hover:text-[var(--color-gold)]">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
            Top Categories
          </p>
          <div className="grid gap-3 text-sm">
            {categoryGroups.map((group) => (
              <Link
                key={group}
                href={`/categories/${getCategorySlug(group)}/`}
                className="transition hover:text-[var(--color-gold)]"
              >
                {group}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
            Top Products
          </p>
          <div className="grid gap-3 text-sm">
            {topProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}/`}
                className="transition hover:text-[var(--color-gold)]"
              >
                {product.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
