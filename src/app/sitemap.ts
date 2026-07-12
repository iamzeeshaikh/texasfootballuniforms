import type { MetadataRoute } from "next";

import { getAllProducts, getCategoryPages } from "@/lib/catalog";
import { blogPosts } from "@/data/blogPosts";
import { locationCities } from "@/data/locations";
import { SITE_URL } from "@/lib/site";

// Stable last-modified date. Bump this on real content updates. Using a fixed
// date instead of new Date() stops every URL's lastmod resetting on each build,
// which Google learns to distrust.
const LASTMOD = new Date("2026-07-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/", "/all-categories/", "/blog/", "/about-us/", "/contact-us/", "/privacy-policy/", "/terms-conditions/"];

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

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const locationEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/locations/`, lastModified: LASTMOD, changeFrequency: "monthly", priority: 0.8 },
    ...locationCities.map((city) => ({
      url: `${SITE_URL}/locations/${city.slug}/`,
      lastModified: LASTMOD,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  return [...pageEntries, ...categoryEntries, ...productEntries, ...locationEntries, ...blogEntries];
}
