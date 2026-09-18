import Link from "next/link";
import {
  ChevronDown,
  MapPin,
  Package,
  PencilRuler,
  Phone,
  Shield,
  Shirt,
  ShoppingBag,
  Trophy,
} from "lucide-react";

import { categoryGroups, getAllProducts, getCategoryGroup, getCategorySlug } from "@/lib/catalog";
import { company } from "@/lib/site";
import { locationCities, cityUrl } from "@/data/locations";
import { MobileMenu } from "./mobile-menu";

const navItems: { href: string; label: string; accent?: boolean; wide?: boolean }[] = [
  // "Home" is not here on purpose: the logo already goes home, and the row has
  // to leave space for the designer link, which is the page that turns a
  // browsing coach into a specification we can quote.
  { href: "/design-your-uniform/", label: "Design Uniform", accent: true },
  { href: "/size-chart/", label: "Size Chart", wide: true },
  // Size Chart and the guides link only from xl: the row already ran past the
  // viewport edge at 1024px before the designer link was added to it, and both
  // pages are in the drawer, the footer and the body copy.
  //
  // Label kept at "Blog" rather than "Guides" — the row has ~21px of slack at
  // 1280 and two more characters is not worth spending it on. The footer and
  // the drawer say "Guides", and /blog/ itself is titled "Football Uniform
  // Guides".
  { href: "/blog/", label: "Blog", wide: true },
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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 2xl:gap-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-gold)] font-display text-xl font-semibold text-[var(--color-navy)]">
            TF
          </div>
          <div>
            <p className="font-display text-xl uppercase tracking-[0.12em] text-white sm:whitespace-nowrap lg:text-base lg:tracking-[0.06em] 2xl:text-xl 2xl:tracking-[0.12em]">
              Texas Football Uniforms
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-ice)] sm:whitespace-nowrap lg:tracking-[0.16em] 2xl:tracking-[0.24em]">
              Premium Custom Teamwear
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex 2xl:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap text-sm font-semibold uppercase tracking-[0.06em] transition hover:text-[var(--color-gold)] 2xl:tracking-[0.14em] ${
                item.accent ? "text-[var(--color-gold)]" : "text-white/80"
              } ${item.wide ? "hidden xl:inline" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.06em] text-white/80 transition group-hover:text-[var(--color-gold)] 2xl:tracking-[0.14em]"
            >
              Products
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 top-full hidden pt-4 group-hover:block group-focus-within:block">
              <div className="grid max-h-[420px] w-[380px] gap-2 overflow-y-auto rounded-[24px] border border-white/10 bg-[var(--color-navy)]/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
                <Link
                  href="/design-your-uniform/"
                  className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-sm font-semibold text-[var(--color-gold)] transition hover:bg-white/14"
                >
                  <PencilRuler className="h-4 w-4 shrink-0" />
                  <span>Design Your Uniform</span>
                </Link>
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
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.06em] text-white/80 transition group-hover:text-[var(--color-gold)] 2xl:tracking-[0.14em]"
            >
              Categories
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 top-full hidden pt-4 group-hover:block group-focus-within:block">
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
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.06em] text-white/80 transition group-hover:text-[var(--color-gold)] 2xl:tracking-[0.14em]"
            >
              Locations
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute right-0 top-full hidden pt-4 group-hover:block group-focus-within:block">
              <div className="w-[360px] rounded-[24px] border border-white/10 bg-[var(--color-navy)]/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
                <Link
                  href="/locations/"
                  className="mb-2 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)] transition hover:bg-white/8"
                >
                  <MapPin className="h-4 w-4 shrink-0" />
                  All Texas Cities
                </Link>
                <div className="grid max-h-[360px] grid-cols-2 gap-1 overflow-y-auto">
                  {locationCities.map((city) => (
                    <Link
                      key={city.slug}
                      href={cityUrl(city)}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-[var(--color-gold)]"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {/* The number itself only fits again at 2xl; between sm and there the
              same link is the phone glyph, which keeps the tap target and the
              tel: href without pushing the row past the viewport edge. */}
          <a
            href={company.phoneHref}
            aria-label={`Call ${company.phoneDisplay}`}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] sm:inline-flex 2xl:px-4"
          >
            <Phone className="h-4 w-4 2xl:hidden" aria-hidden />
            <span className="hidden 2xl:inline">{company.phoneDisplay}</span>
          </a>
          <Link
            href="/contact-us/#quote-form"
            className="hidden whitespace-nowrap rounded-full bg-[var(--color-red)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_rgba(200,16,46,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)] sm:inline-flex"
          >
            Get a Quote
          </Link>
          <MobileMenu cities={locationCities.map((c) => ({ name: c.name, href: cityUrl(c) }))} />
        </div>
      </div>
    </header>
  );
}
