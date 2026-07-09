import type { MetadataRoute } from "next";

import { getAllProducts, getCategoryPages } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

// Stable last-modified date. Bump this on real content updates. Using a fixed
// date instead of new Date() stops every URL's lastmod resetting on each build,
// which Google learns to distrust.
const LASTMOD = new Date("2026-07-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/", "/all-categories/", "/about-us/", "/contact-us/", "/privacy-policy/", "/terms-conditions/"];

  const pageEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${SITE_URL}${page}`,
    lastModified: LASTMOD,
    changeFrequency: page === "/" ? "weekly" : "monthly",
    priority: page === "/" ? 1 : 0.8,
  }));

  const productEntries = getAllProducts().map((product) => ({
    url: `${SITE_URL}/${product.slug}/`,
    lastModified: LASTMOD,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryEntries = getCategoryPages().map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}/`,
    lastModified: LASTMOD,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...pageEntries, ...categoryEntries, ...productEntries];
}
