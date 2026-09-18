import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import type { BlogPost } from "@/data/blogPosts";

const dateFmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" });

/**
 * Card row pointing a product page at the guides that discuss it.
 *
 * The five posts were published, put in the sitemap and then linked from
 * nowhere except /blog/, which is why none of them are indexed. Cards, not
 * prose links: this is navigation, so it sits outside the one-link-per-section
 * prose rule rather than stuffing a link into a paragraph that did not need it.
 */
export function RelatedGuides({
  guides,
  productName,
}: {
  guides: BlogPost[];
  productName: string;
}) {
  if (guides.length === 0) return null;

  return (
    <section className="mt-12 surface-card p-8 sm:p-10">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-[var(--color-red)]" />
        <h2 className="text-4xl text-[var(--color-navy)]">Related Guides</h2>
      </div>
      <p className="mt-4 max-w-3xl">
        Longer reading on the decisions behind a {productName.toLowerCase()} order — written
        for the coach or athletic director doing the ordering.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/blog/${guide.slug}/`}
            className="group flex flex-col rounded-[22px] border border-[var(--color-border)] bg-white p-6 transition hover:border-[var(--color-red)] hover:shadow-[0_14px_34px_rgba(11,31,58,0.08)]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
              {guide.badge}
            </span>
            <h3 className="mt-3 text-2xl leading-snug text-[var(--color-navy)]">{guide.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-[var(--color-navy-soft)]">
              {guide.excerpt}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-red)]">
              {dateFmt.format(new Date(guide.date))} · {guide.readTime}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
