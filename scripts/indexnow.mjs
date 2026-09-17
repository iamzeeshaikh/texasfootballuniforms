#!/usr/bin/env node
/**
 * Pushes every URL in the sitemap to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * The site was not in Bing's index at all: Bing crawls slowly on its own and
 * nothing here ever told it a page existed. IndexNow is the one-call fix, and
 * it is cheap enough to run after every deploy.
 *
 * Usage:  node scripts/indexnow.mjs [--dry]
 * The key is read from INDEXNOW_KEY, or from the single public/<key>.txt file
 * that Bing fetches to verify ownership — so there is one place to change it.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "texasfootballuniforms.com";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function resolveKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY.trim();
  const candidates = fs
    .readdirSync(path.join(ROOT, "public"))
    .filter((name) => /^[a-f0-9]{8,128}\.txt$/i.test(name));
  if (candidates.length !== 1) {
    throw new Error(
      `Expected exactly one public/<key>.txt, found ${candidates.length}. Set INDEXNOW_KEY instead.`,
    );
  }
  return path.basename(candidates[0], ".txt");
}

async function sitemapUrls() {
  const res = await fetch(SITEMAP, { headers: { "User-Agent": "tfu-indexnow" } });
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const key = resolveKey();
const urlList = await sitemapUrls();
console.log(`IndexNow: ${urlList.length} URLs, key ${key}`);

if (process.argv.includes("--dry")) {
  console.log(urlList.slice(0, 5).join("\n"), "\n…dry run, nothing submitted.");
  process.exit(0);
}

// IndexNow takes up to 10,000 URLs per request; this site is nowhere near that.
const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList,
  }),
});

const body = await res.text();
console.log(`IndexNow responded ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`);
// 200 = accepted, 202 = accepted but key still being validated. Anything else is a failure.
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
