import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getAllProducts } from "@/lib/catalog";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "All Football Uniform Categories | Texas Teamwear Collection",
  description:
    "Browse custom football uniforms, jerseys, sideline layers, and team apparel categories built for Texas programs and quote-based ordering.",
  path: "/all-categories/",
});

export default function AllCategoriesPage() {
  const products = getAllProducts();

  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-8 sm:p-10">
          <span className="rounded-full bg-[var(--color-red)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
            All Categories
          </span>
          <h1 className="mt-5 text-5xl text-[var(--color-navy)] sm:text-6xl">
            Explore Premium Football Uniform Options
          </h1>
          <p className="mt-5 max-w-3xl text-lg">
            Every collection below is mapped to its own SEO landing page with full galleries,
            long-form product content, technical specifications, FAQs, and quote-focused calls
            to action for Texas football programs.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link key={product.slug} href={`/${product.slug}/`} className="surface-card group overflow-hidden">
              <Image
                src={product.heroImage}
                alt={`${product.name} collection for custom football uniforms`}
                width={900}
                height={720}
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                  {product.shortNiche}
                </p>
                <h2 className="mt-3 text-3xl text-[var(--color-navy)]">{product.name}</h2>
                <p className="mt-3">{product.shortDescription.slice(0, 150)}...</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-red)]">
                  View category
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
