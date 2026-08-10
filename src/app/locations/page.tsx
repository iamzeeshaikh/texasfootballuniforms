import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbSchema } from "@/lib/catalog";
import { createMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { locationCities, cityUrl } from "@/data/locations";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Custom Football Uniforms Across Texas | City Locations | Texas Football Uniforms",
    description:
      "Custom football uniforms and team kits for programs across Texas — Houston, Dallas, San Antonio, Austin and every city in between.",
    path: "/locations/",
  });
}

const REGION_ORDER = [
  "DFW Metroplex",
  "Greater Houston",
  "Central Texas",
  "Greater San Antonio",
  "South Texas",
  "Rio Grande Valley",
  "West Texas",
  "Texas Panhandle",
];

export default function LocationsHubPage() {
  const byRegion = REGION_ORDER.map((region) => ({
    region,
    cities: locationCities.filter((c) => c.region === region),
  })).filter((g) => g.cities.length > 0);

  const schema = [
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Locations", path: "/locations/" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Texas Football Uniform City Locations",
      itemListElement: locationCities.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Custom Football Uniforms in ${c.name}`,
        url: `${SITE_URL}${cityUrl(c)}`,
      })),
    },
  ];

  return (
    <>
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <section className="bg-[var(--color-navy)] py-16 text-white">
        <div className="mx-auto w-full max-w-6xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">Statewide · Texas</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl uppercase leading-[1.05] sm:text-5xl">Custom Football Uniforms Across Texas</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            From the Friday-night lights of the Permian Basin to the powerhouse programs of DFW and the Houston metro, we build custom football uniforms and full team kits for programs in every corner of Texas. Find your city below, or{" "}
            <Link href="/contact-us/#quote-form" className="font-semibold text-[var(--color-gold)] underline">get a free team quote</Link>.
          </p>
        </div>
      </section>

      {byRegion.map((group) => (
        <section key={group.region} className="border-b border-[var(--color-border)] py-12 last:border-0">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="font-display text-2xl uppercase text-[var(--color-red)]">{group.region}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.cities.map((c) => (
                <Link key={c.slug} href={cityUrl(c)} className="rounded-3xl border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-lg">
                  <h3 className="font-display text-xl uppercase text-[var(--color-navy)]">{c.name}, TX</h3>
                  <p className="mt-1 text-sm text-[var(--color-navy-soft)]">{c.stat}.</p>
                  <span className="mt-2 inline-block text-sm font-semibold text-[var(--color-red)]">Football uniforms in {c.name} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-[var(--color-red)] py-16 text-center text-white">
        <div className="mx-auto w-full max-w-2xl px-5">
          <h2 className="font-display text-4xl uppercase">Don&apos;t See Your Town?</h2>
          <p className="mt-3 leading-relaxed text-white/85">We outfit football programs in every corner of Texas, not just the cities listed here. Tell us your team and colors, and we&apos;ll get you a free quote.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact-us/#quote-form" className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold)]">Get a Team Quote</Link>
            <Link href="/all-categories/" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white">Browse Uniforms</Link>
          </div>
        </div>
      </section>
    </>
  );
}
