#!/usr/bin/env node
/**
 * Records the last commit date of each file that produces a page, into
 * src/data/lastmod.json, for the sitemap to read.
 *
 * Why not read the dates at build time? Vercel builds from a tarball with no
 * .git directory, and a fresh checkout stamps every file's mtime with the
 * checkout time — so both git and mtime would tell Google that all 68 URLs
 * changed on every deploy, which is the same lie as the frozen constant this
 * replaces, just in the other direction. Generating the dates here and
 * committing them means the sitemap ships the truth: a page's lastmod moves
 * when, and only when, somebody commits a change to what it renders.
 *
 * Run it before committing content changes:  npm run lastmod
 */
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/lastmod.json");

/** Every tracked path whose content ends up in a page, grouped by what it feeds. */
const SOURCES = {
  home: ["src/app/page.tsx"],
  products: ["src/lib/catalog.ts", "src/lib/product-meta.ts", "src/app/[slug]/page.tsx"],
  categories: ["src/lib/catalog.ts", "src/app/categories/[category]/page.tsx"],
  cities: ["src/data/locations.ts", "src/components/city-location.tsx"],
  locations: ["src/app/locations/page.tsx", "src/data/locations.ts"],
  allCategories: ["src/app/all-categories/page.tsx"],
  blog: ["src/app/blog/page.tsx", "src/data/blogPosts.ts"],
  about: ["src/app/about-us/page.tsx"],
  contact: ["src/app/contact-us/page.tsx", "src/components/quote-form.tsx"],
  privacy: ["src/app/privacy-policy/page.tsx"],
  terms: ["src/app/terms-conditions/page.tsx"],
};

function lastCommit(file) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

const dates = {};
for (const [key, files] of Object.entries(SOURCES)) {
  const stamps = files.map(lastCommit).filter(Boolean).sort();
  // Uncommitted work has no commit date yet; today is the honest answer for it.
  dates[key] = stamps.length ? stamps[stamps.length - 1] : new Date().toISOString();
}

fs.writeFileSync(OUT, `${JSON.stringify(dates, null, 2)}\n`);
console.log(`Wrote ${path.relative(ROOT, OUT)}`);
for (const [key, value] of Object.entries(dates)) console.log(`  ${key}: ${value}`);
