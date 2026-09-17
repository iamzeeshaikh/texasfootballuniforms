import type { MetadataRoute } from "next";

import { getAllProducts, getCategoryPages } from "@/lib/catalog";
import { blogPosts } from "@/data/blogPosts";
import lastmod from "@/data/lastmod.json";
import { locationCities, cityUrl } from "@/data/locations";
import { SITE_URL } from "@/lib/site";

/**
 * lastmod comes from src/data/lastmod.json, which `npm run lastmod` fills with
 * the real git commit date of each page's source files.
 *
 * The previous frozen constant (2026-07-10) survived several content rewrites
 * and told Google nothing had changed when plenty had. `new Date()` would tell
 * it everything changed on every deploy, which Google learns to ignore just as
 * fast. Committed commit dates are the only version that stays true on Vercel,
 * where the build has no .git directory and every file's mtime is the checkout
 * time.
 */
const at = (key: keyof typeof lastmod) => new Date(lastmod[key]);

const PAGE_LASTMOD: Record<string, Date> = {
  "/": at("home"),
  "/all-categories/": at("allCategories"),
  "/blog/": at("blog"),
  "/about-us/": at("about"),
  "/contact-us/": at("contact"),
  "/size-chart/": at("products"),
  "/design-your-uniform/": at("designTool"),
  "/privacy-policy/": at("privacy"),
  "/terms-conditions/": at("terms"),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/", "/all-categories/", "/design-your-uniform/", "/blog/", "/about-us/", "/contact-us/", "/size-chart/", "/privacy-policy/", "/terms-conditions/"];

  const pageEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${SITE_URL}${page}`,
    lastModified: PAGE_LASTMOD[page] ?? at("home"),
    changeFrequency: page === "/" || page === "/design-your-uniform/" ? "weekly" : "monthly",
    priority: page === "/" ? 1 : page === "/design-your-uniform/" ? 0.9 : 0.8,
  }));

  const productEntries = getAllProducts().map((product) => ({
    url: `${SITE_URL}/${product.slug}/`,
    lastModified: at("products"),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryEntries = getCategoryPages().map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}/`,
    lastModified: at("categories"),
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
    { url: `${SITE_URL}/locations/`, lastModified: at("locations"), changeFrequency: "monthly", priority: 0.8 },
    ...locationCities.map((city) => ({
      url: `${SITE_URL}${cityUrl(city)}`,
      lastModified: at("cities"),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  return [...pageEntries, ...categoryEntries, ...productEntries, ...locationEntries, ...blogEntries];
}
