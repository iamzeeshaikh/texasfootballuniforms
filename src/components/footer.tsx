import Link from "next/link";

import { categoryGroups, getCategorySlug, getProductBySlug } from "@/lib/catalog";
import { company } from "@/lib/site";

/**
 * Chosen rather than sliced off the front of the catalog. The 7v7 and flag
 * pages had no navigation link anywhere on the site and sat at position 78-95;
 * the first five blueprints happened to be the ones the footer promoted.
 */
const FOOTER_PRODUCTS = [
  "high-school-football-uniforms",
  "youth-football-uniforms",
  "reversible-football-jerseys",
  "sublimated-football-jerseys",
  "7-on-7-football-uniforms",
  "flag-football-uniforms",
  "football-team-kits",
  "coaches-apparel",
];

export function Footer() {
  const topProducts = FOOTER_PRODUCTS.map((slug) => getProductBySlug(slug)).filter(
    (product): product is NonNullable<typeof product> => Boolean(product),
  );

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
            <Link href="/design-your-uniform/" className="transition hover:text-[var(--color-gold)]">
              Design Your Uniform
            </Link>
            <Link href="/size-chart/" className="transition hover:text-[var(--color-gold)]">
              Size Chart
            </Link>
            <Link href="/about-us/" className="transition hover:text-[var(--color-gold)]">
              About Us
            </Link>
            <Link href="/blog/" className="transition hover:text-[var(--color-gold)]">
              Guides
            </Link>
            <Link href="/contact-us/" className="transition hover:text-[var(--color-gold)]">
              Contact Us
            </Link>
            <Link href="/return-policy/" className="transition hover:text-[var(--color-gold)]">
              Return Policy
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
            Popular Pages
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
