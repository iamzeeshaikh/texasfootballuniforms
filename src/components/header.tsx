import Link from "next/link";
import {
  ChevronDown,
  Package,
  Shield,
  Shirt,
  ShoppingBag,
  Trophy,
} from "lucide-react";

import { categoryGroups, getAllProducts, getCategoryGroup, getCategorySlug } from "@/lib/catalog";
import { company } from "@/lib/site";

const navItems = [
  { href: "/", label: "Home" },
];

export function Header() {
  const products = getAllProducts();
  const categoryIcons = {
    Jerseys: Shirt,
    Uniforms: Trophy,
    "Practice Gear": Shield,
    "Team Packages": Package,
    "Team Apparel": ShoppingBag,
  } as const;

  const getProductIcon = (slug: string) => {
    const category = getCategoryGroup(
      products.find((product) => product.slug === slug) ?? products[0],
    );

    switch (category) {
      case "Uniforms":
        return Trophy;
      case "Practice Gear":
        return Shield;
      case "Team Packages":
        return Package;
      case "Team Apparel":
        return ShoppingBag;
      case "Jerseys":
      default:
        return Shirt;
    }
  };

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
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-white/80 transition group-hover:text-[var(--color-gold)]"
            >
              Products
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="pointer-events-none absolute left-0 top-full pt-4 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="grid max-h-[420px] w-[380px] gap-2 overflow-y-auto rounded-[24px] border border-white/10 bg-[var(--color-navy)]/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
                {products.map((product) => {
                  const Icon = getProductIcon(product.slug);

                  return (
                    <Link
                      key={product.slug}
                      href={`/${product.slug}/`}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-[var(--color-gold)]"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[var(--color-gold)]" />
                      <span>{product.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-white/80 transition group-hover:text-[var(--color-gold)]"
            >
              Categories
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="pointer-events-none absolute left-0 top-full pt-4 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="grid w-[260px] gap-2 rounded-[24px] border border-white/10 bg-[var(--color-navy)]/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
                {categoryGroups.map((group) => {
                  const Icon = categoryIcons[group];

                  return (
                    <Link
                      key={group}
                      href={`/categories/${getCategorySlug(group)}/`}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-[var(--color-gold)]"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[var(--color-gold)]" />
                      <span>{group}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
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
