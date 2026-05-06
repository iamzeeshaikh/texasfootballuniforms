import type { MetadataRoute } from "next";

import { getAllProducts, getCategoryPages } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/all-categories/", "/about-us/", "/contact-us/", "/privacy-policy/", "/terms-conditions/"];

  const pageEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${SITE_URL}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : 0.8,
  }));

  const productEntries = getAllProducts().map((product) => ({
    url: `${SITE_URL}/${product.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryEntries = getCategoryPages().map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...pageEntries, ...categoryEntries, ...productEntries];
}
