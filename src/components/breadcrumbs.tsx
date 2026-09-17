import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { buildBreadcrumbSchema } from "@/lib/catalog";

export type Crumb = { name: string; path: string };

/**
 * Visible breadcrumb trail plus the BreadcrumbList JSON-LD, built from one
 * array so the markup and the schema can never describe different paths.
 *
 * The site emitted breadcrumb schema on every product, category and city page
 * while showing the visitor no trail at all, and the product trail named
 * "All Categories" instead of the product's real category.
 */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const last = items.length - 1;

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em]">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 ${tone === "dark" ? "text-white/40" : "text-[var(--color-navy-soft)]/50"}`}
                />
              ) : null}
              {index === last ? (
                <span
                  aria-current="page"
                  className={tone === "dark" ? "text-white/70" : "text-[var(--color-navy-soft)]"}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={
                    tone === "dark"
                      ? "text-[var(--color-gold)] transition hover:text-white"
                      : "text-[var(--color-red)] transition hover:text-[var(--color-navy)]"
                  }
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(items)) }}
      />
    </>
  );
}
