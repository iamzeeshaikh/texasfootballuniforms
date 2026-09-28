/**
 * Returns guard. Runs after `next build` (npm run check:returns, and as part of
 * `npm run build`), next to scripts/check-payment.mjs and check-turnaround.mjs.
 *
 * ## Why this file exists
 *
 * Until 2026-09-28 every one of the 28 product pages published
 * `hasMerchantReturnPolicy: MerchantReturnNotPermitted` in its Product schema
 * while /return-policy/, /returns/ and /refund-policy/ were all 404. The
 * strongest claim the site made about returns existed only in markup: no buyer
 * could read it, and with the PayPal invoice now the only way an order is
 * settled, it is also the document a PayPal dispute would be judged against.
 *
 * So the thing to assert is not "the page exists". It is that the claim and the
 * page cannot come apart again:
 *
 *   1. The returns page ships, at the one path the whole site points at.
 *   2. Every schema claim about returns carries a merchantReturnLink, that link
 *      is this site's returns page, and a built file answers it. A claim
 *      pointing at a 404 is the original defect.
 *   3. One category, sitewide, and it is a category Google recognizes. Two pages
 *      declaring different return categories is the same lie in a subtler form.
 *   4. Every page that renders the footer's legal links renders the returns link
 *      too — the page has to be reachable, not merely present.
 *   5. The page states, in prose a buyer reads, the five things the schema
 *      implies and a dispute turns on: no change-of-mind returns, proof approval
 *      is the decision point, our errors are remade or refunded, 7 calendar days
 *      with photos, and a refund that goes back through PayPal.
 *   6. No page anywhere offers a consumer returns window — "30-day returns",
 *      "free returns", "money-back guarantee". Any of those contradicts
 *      MerchantReturnNotPermitted, and contradicting it on the page is how the
 *      schema becomes the lie.
 *   7. The page is in the sitemap, and it carries a table, a numbered list and a
 *      bullet list (the owner's standard for every page on the site).
 *
 * Everything is read from BUILT output — the prerendered HTML in
 * .next/server/app and the emitted sitemap — because the source is not what a
 * visitor or a crawler reads.
 *
 * Each rule was watched failing against a planted defect before it was trusted;
 * the defects are listed in the report for 2026-09-28.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const OFF = "\x1b[0m";

const SITE_URL = "https://texasfootballuniforms.com";
const RETURN_PATH = "/return-policy/";
const RETURN_URL = `${SITE_URL}${RETURN_PATH}`;

const failures = [];
function fail(rule, detail) {
  failures.push(`${rule}: ${detail}`);
}

function walk(dir, exts, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, exts, out);
    else if (exts.some((ext) => entry.endsWith(ext))) out.push(full);
  }
  return out;
}

/** Visible text, with tags and JSON-LD removed, so prose rules read prose. */
function prose(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

const APP = join(ROOT, ".next/server/app");
const htmlFiles = walk(APP, [".html"]);

if (htmlFiles.length === 0) {
  console.error(`${RED}No built HTML found. Run \`next build\` first.${OFF}`);
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 * 1. The returns page ships.
 * ------------------------------------------------------------------ */
const returnFile = join(APP, "return-policy.html");
let returnHtml = "";
let returnText = "";
if (!existsSync(returnFile)) {
  fail("returns-page-exists", `${relative(ROOT, returnFile)} was not built — ${RETURN_URL} is a 404 again`);
} else {
  returnHtml = readFileSync(returnFile, "utf8");
  returnText = prose(returnHtml);
  if (returnText.length < 3000) {
    fail(
      "returns-page-exists",
      `${RETURN_PATH} renders only ${returnText.length} characters of prose — a policy this thin is not a policy`,
    );
  }
  if (!/<h1[^>]*>[\s\S]*?Return Policy[\s\S]*?<\/h1>/i.test(returnHtml)) {
    fail("returns-page-exists", `${RETURN_PATH} has no "Return Policy" H1`);
  }
}

/* ------------------------------------------------------------------ *
 * 2 + 3. Every return claim links to that page, and there is one category.
 *
 * Read out of the JSON-LD rather than the prose: this is the claim a crawler
 * acts on, and it is the half that had nothing behind it.
 * ------------------------------------------------------------------ */
const GOOGLE_CATEGORIES = new Set([
  "https://schema.org/MerchantReturnFiniteReturnWindow",
  "https://schema.org/MerchantReturnNotPermitted",
  "https://schema.org/MerchantReturnUnlimitedWindow",
]);

const POLICY_NODE = /"hasMerchantReturnPolicy"\s*:\s*\{(.*?)\}/gs;
const categories = new Map(); // category -> [pages]
let claimPages = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const where = relative(ROOT, file);
  const nodes = [...html.matchAll(POLICY_NODE)];
  if (nodes.length === 0) continue;
  claimPages += 1;
  for (const [, body] of nodes) {
    const link = body.match(/"merchantReturnLink"\s*:\s*"([^"]+)"/);
    if (!link) {
      fail(
        "claim-has-a-page",
        `${where} declares hasMerchantReturnPolicy with no merchantReturnLink — the claim points at nothing a buyer can read`,
      );
    } else if (link[1] !== RETURN_URL) {
      fail("claim-has-a-page", `${where} merchantReturnLink is "${link[1]}", expected "${RETURN_URL}"`);
    }
    const category = body.match(/"returnPolicyCategory"\s*:\s*"([^"]+)"/);
    if (!category) {
      fail("one-return-category", `${where} declares hasMerchantReturnPolicy with no returnPolicyCategory`);
      continue;
    }
    if (!GOOGLE_CATEGORIES.has(category[1])) {
      fail(
        "one-return-category",
        `${where} returnPolicyCategory "${category[1]}" is not one of Google's three values`,
      );
    }
    const seen = categories.get(category[1]) ?? [];
    if (seen.length < 3) seen.push(where);
    categories.set(category[1], seen);
  }
}

if (claimPages < 28) {
  fail(
    "claim-has-a-page",
    `only ${claimPages} built pages declare hasMerchantReturnPolicy, expected at least 28 (the product pages) — the claim has been dropped rather than backed`,
  );
}
if (categories.size > 1) {
  const spread = [...categories.entries()]
    .map(([category, where]) => `${category} (${where.join(", ")})`)
    .join(" vs ");
  fail("one-return-category", `the site declares more than one return category — ${spread}`);
}

/* ------------------------------------------------------------------ *
 * 4. The page is reachable from every page that has a legal-links block.
 *
 * Enumerated by what SHOULD carry the link — every built page that renders the
 * footer's /privacy-policy/ link — rather than by looking for pages that happen
 * to have it. A footer link that silently stops rendering on half the site is
 * exactly the kind of absence a spot check misses.
 * ------------------------------------------------------------------ */
let footerPages = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  if (!html.includes('href="/privacy-policy/"')) continue;
  footerPages += 1;
  if (!html.includes(`href="${RETURN_PATH}"`)) {
    fail(
      "reachable-from-the-footer",
      `${relative(ROOT, file)} links to the privacy policy but not to ${RETURN_PATH}`,
    );
  }
}
if (footerPages < 60) {
  fail(
    "reachable-from-the-footer",
    `only ${footerPages} built pages render the footer legal links, expected at least 60 — the enumeration this rule depends on has broken`,
  );
}

/* ------------------------------------------------------------------ *
 * 5. The page says, in words, what the schema says in markup.
 *
 * These five are the owner's terms, published on the other two sports sites and
 * confirmed as standing: no change-of-mind returns, proof approval is the
 * decision point, our errors are remedied, 7 days with photos, refunds through
 * PayPal. They are what a PayPal dispute is decided on, so losing any of them
 * off the page has to fail the build, not go unnoticed.
 * ------------------------------------------------------------------ */
const MUST_SAY = [
  [/change[\s-]of[\s-]mind|cannot\s+be\s+returned|no\s+return\s+or\s+refund/i, "that custom goods are not returnable for change of mind"],
  [/approv\w*\s+(?:the\s+|a\s+|your\s+)?(?:design\s+)?(?:proof|mockup)|proof\s+approval/i, "that approving the proof is the decision point"],
  [/\bremake|reprint|refund\s+them|at\s+no\s+charge/i, "that our own errors are remade, corrected or refunded"],
  [/\b7\s+calendar\s+days\b/i, "the 7 calendar day claim window"],
  [/\bphoto/i, "that a claim needs photos"],
  [/refund[^.]{0,120}PayPal|PayPal[^.]{0,120}refund/i, "that a refund goes back through PayPal"],
  [/account\s+that\s+paid/i, "that the refund goes to the account that paid the invoice"],
];

if (returnText) {
  for (const [pattern, what] of MUST_SAY) {
    if (!pattern.test(returnText)) {
      fail("page-states-the-policy", `${RETURN_PATH} no longer states ${what}`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 6. No page offers a consumer returns window.
 *
 * MerchantReturnNotPermitted and "30-day returns" cannot both be true, and the
 * prose is the half a buyer believes. This runs over every built page, not just
 * the policy page, because the contradiction is likeliest to arrive in a trust
 * badge or a product FAQ written months later.
 * ------------------------------------------------------------------ */
const NO_RETURN_WINDOW = [
  [/\b\d+[\s-]*(?:calendar\s+|business\s+)?days?\s+(?:to\s+)?returns?\b/i, "a returns window"],
  [/\b\d+[\s-]*day\s+(?:money[\s-]back|returns?|refund)\b/i, "a returns window"],
  [/\bfree\s+returns?\b/i, "free returns"],
  [/\bmoney[\s-]back\s+guarantee\b/i, "a money-back guarantee"],
  [/\breturn\s+(?:it|them|any\s+item)\s+for\s+any\s+reason\b/i, "returns for any reason"],
  [/\bno[\s-]hassle\s+returns?\b/i, "no-hassle returns"],
  [/\beasy\s+returns?\b/i, "easy returns"],
  [/\breturns?\s+(?:window|period)\s+of\b/i, "a returns window"],
  [/\bsatisfaction\s+guarantee/i, "a satisfaction guarantee"],
  [/\breturn\s+(?:it|them)\s+within\b/i, "a returns window"],
];

for (const file of htmlFiles) {
  const text = prose(readFileSync(file, "utf8"));
  for (const [pattern, what] of NO_RETURN_WINDOW) {
    const hit = text.match(pattern);
    if (hit) {
      const at = text.indexOf(hit[0]);
      const context = text.slice(Math.max(0, at - 70), at + hit[0].length + 70).trim();
      fail(
        "no-consumer-return-window",
        `${relative(ROOT, file)} offers ${what} — "${hit[0]}" in "…${context}…" — which contradicts MerchantReturnNotPermitted`,
      );
    }
  }
}

/* ------------------------------------------------------------------ *
 * 7. The page is in the sitemap, and it is built the way every page on this
 *    site is built: a table, a numbered list and a bullet list.
 * ------------------------------------------------------------------ */
const sitemapFiles = walk(APP, ["sitemap.xml.body", "sitemap.xml"]);
if (sitemapFiles.length === 0) {
  fail("indexable-and-complete", "no built sitemap was found in .next/server/app — this rule cannot pass by erroring");
} else if (!sitemapFiles.some((file) => readFileSync(file, "utf8").includes(RETURN_URL))) {
  fail("indexable-and-complete", `${RETURN_URL} is missing from the built sitemap`);
}

if (returnHtml) {
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(returnHtml)) {
    fail("indexable-and-complete", `${RETURN_PATH} is noindexed`);
  }
  for (const [tag, what] of [
    ["table", "table"],
    ["ol", "numbered list"],
    ["ul", "bullet list"],
  ]) {
    if (!new RegExp(`<${tag}[\\s>]`, "i").test(returnHtml)) {
      fail("indexable-and-complete", `${RETURN_PATH} has no ${what}`);
    }
  }
}

if (failures.length) {
  console.error(`${RED}✗ returns check failed${OFF}`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}

const category = [...categories.keys()][0] ?? "none";
console.log(
  `${GREEN}✓ returns check passed${OFF} — ${RETURN_PATH} ships (${returnText.length} chars of prose, table + numbered list + bullets, in the sitemap, not noindexed) and states all ${MUST_SAY.length} of the owner's terms; ${claimPages} pages declare ${category} and every one of them links to it; ${footerPages} pages reach it from the footer; no page anywhere offers a returns window, free returns or a money-back guarantee.`,
);
