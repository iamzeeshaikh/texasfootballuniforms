/**
 * Turnaround guard. Runs after `next build` (npm run check:turnaround, and as
 * part of `npm run build`), next to scripts/check-payment.mjs.
 *
 * ## Why this file exists
 *
 * Two owner decisions, six days apart, and a sweep in between that got one of
 * them wrong:
 *
 *  - Standard production is **1 to 2 weeks after you approve the design**, and
 *    that is the only production window this business publishes. The site used
 *    to carry a 7–14 / 10–16 / 12–18 business-day ladder and a scatter of
 *    "three weeks" / "four weeks" FAQ answers that disagreed with the fact strip
 *    on the very same page. Those are gone and must not come back.
 *  - **Rush orders are real, and the owner will not commit to a number of days**
 *    (2026-09-28). A September sweep deleted rush from the site entirely on the
 *    assumption that the service did not exist. It does. What does not exist is
 *    a published rush window, or a published rush fee.
 *
 * So the thing to forbid is not the word "rush" — deleting the word was the
 * original mistake. The thing to forbid is a rush claim that carries **a number
 * of days or a price**, and a rush claim that reads as a guarantee instead of an
 * invitation to ask. That is what the four rules below assert.
 *
 * ## What is read
 *
 * The built output, not the source, because the source is not what a visitor or
 * a crawler reads: the prerendered HTML in .next/server/app, the string
 * literals inside the client chunks (the checkout's "Needed by" hint is a client
 * component and never appears in HTML), and public/llms.txt.
 *
 * Each rule was watched failing against a planted defect before it was trusted:
 * "Rush orders ship in 5 days." (rule 1), "A rush fee of $50 applies."
 * (rule 2), a bare "We do take rush orders." with the hedge deleted (rule 3),
 * and a reinstated "three weeks after you approve the design" (rule 4).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const OFF = "\x1b[0m";

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

const htmlFiles = walk(join(ROOT, ".next/server/app"), [".html"]);
const chunkFiles = walk(join(ROOT, ".next/static/chunks"), [".js"]);
const llmsPath = join(ROOT, "public/llms.txt");

if (htmlFiles.length === 0) {
  console.error(`${RED}No built HTML found. Run \`next build\` first.${OFF}`);
  process.exit(1);
}

/**
 * Visible prose for one built page: scripts and styles dropped (the RSC flight
 * payload in <script> is the same copy again, and JSON-LD is checked separately
 * by rule 5), tags replaced by a space so two sentences never fuse, entities
 * decoded so "we&rsquo;ll" reads as "we'll", whitespace collapsed.
 */
function prose(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:rsquo|lsquo|#8217|#x2019);/gi, "'")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&(?:mdash|#8212);/gi, "—")
    .replace(/&#x27;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The same page cut into element-sized pieces: every tag becomes a boundary, so
 * two things that only look adjacent because they render next to each other are
 * not read as one sentence. This is what the "no number near a rush word" rule
 * needs. Without it the fact strip's own "Free mockup in 24 hours", which sits
 * in the chip immediately above the rush note, reads as the rush window.
 */
const BOUNDARY = "\u0000";
function segments(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, BOUNDARY)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, BOUNDARY)
    .replace(/<[^>]+>/g, BOUNDARY)
    .replace(/&(?:rsquo|lsquo|#8217|#x2019);/gi, "'")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&(?:mdash|#8212);/gi, "\u2014")
    .replace(/&#x27;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .split(BOUNDARY)
    .map((piece) => piece.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/**
 * Copy shipped inside a client chunk. Only string literals of some length are
 * read: a minified bundle is full of digits ("6e4", "1e3", chunk hashes) and
 * short identifiers, and scanning them for "a rush word near a number" produces
 * noise, not defects. A sentence of copy is always a long literal.
 */
function chunkCopy(js) {
  const literals = [];
  for (const re of [/"((?:[^"\\\n]|\\.){24,}?)"/g, /'((?:[^'\\\n]|\\.){24,}?)'/g]) {
    for (const match of js.matchAll(re)) literals.push(match[1].replace(/\\'/g, "'").replace(/\\"/g, '"'));
  }
  return literals.join("\n").replace(/[\u2018\u2019]/g, "'");
}

/**
 * Every surface that carries buyer-facing copy: `text` is the page as a reader
 * sees it (one string, for the rules that need context either side of a
 * sentence) and `pieces` is the same copy cut at element boundaries (for the
 * rules that must not read two adjacent chips as one claim). Plain text and
 * chunk literals have no elements, so each line is its own piece.
 */
const surfaces = [
  ...htmlFiles.map((file) => {
    const html = readFileSync(file, "utf8");
    return { where: relative(ROOT, file), text: prose(html), pieces: segments(html) };
  }),
  ...chunkFiles.map((file) => {
    const copy = chunkCopy(readFileSync(file, "utf8"));
    return { where: relative(ROOT, file), text: copy, pieces: copy.split("\n") };
  }),
  (() => {
    const raw = readFileSync(llmsPath, "utf8");
    // One piece, deliberately: llms.txt is hard-wrapped, so splitting it by line
    // would let a defect hide across a line break.
    return { where: "public/llms.txt", text: raw.replace(/\s+/g, " "), pieces: [raw.replace(/\s+/g, " ")] };
  })(),
];

/* ------------------------------------------------------------------ *
 * 1. A rush claim never carries a number.
 *
 * "Rush" and a duration may legitimately sit in the same sentence — "start the
 * conversation four to six weeks before the first game rather than ordering on
 * a rush timeline" is planning advice, not a promise — so the test is
 * proximity, not co-occurrence: a duration within WINDOW characters of a rush
 * word is a rush window being published. 45 characters is wide enough to catch
 * "rush orders ship in 5 days" and "we can take two weeks off with a rush
 * order", and narrow enough that the advisory sentences above pass.
 * ------------------------------------------------------------------ */
const WINDOW = 45;
const RUSH_WORD = /rush(?:es|ed|ing)?\b|expedit(?:e|ed|es|ing|ion|ed)?\b/gi;
const NUMBER = String.raw`(?:\d+(?:[.,]\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|couple|few|several|half)`;
const DURATION = new RegExp(
  String.raw`\b${NUMBER}(?:\s*(?:-|–|to|or|\+)\s*${NUMBER})?[\s-]*(?:business[\s-]*)?(?:hour|hr|day|week|wk|month)s?\b`,
  "i",
);
const COMPARATIVE = new RegExp(
  String.raw`\b${NUMBER}[\s-]*(?:business[\s-]*)?(?:hour|hr|day|week|wk|month)s?\s*(?:faster|sooner|quicker|earlier|off)\b|\b\d+\s*%\s*(?:faster|sooner|quicker)\b`,
  "i",
);

for (const { where, pieces } of surfaces) {
  for (const piece of pieces) {
    for (const hit of piece.matchAll(RUSH_WORD)) {
      const from = Math.max(0, hit.index - WINDOW);
      const near = piece.slice(from, hit.index + hit[0].length + WINDOW);
      const duration = near.match(DURATION);
      if (duration) {
        fail("no-rush-window", `${where} publishes a rush turnaround — "…${near.trim()}…" (the number: "${duration[0]}")`);
      }
    }
    const comparative = piece.match(COMPARATIVE);
    if (comparative) {
      fail("no-rush-window", `${where} quantifies how much faster something is — "${comparative[0]}"`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 2. A rush claim never carries a price.
 *
 * The owner said nothing about money when they said rush orders are real, so
 * the site says nothing about money. No fee, no surcharge, no "charges may
 * apply", in either word order.
 *
 * This rule does not read negation, on purpose: "no rush fee" fails it too.
 * That is the correct outcome rather than a gap to patch, because a page that
 * denies a rush fee has still put a rush fee in the reader's head, and the
 * denial is one careless edit away from "no rush fee under two weeks". Copy
 * that needs to reassure should say the site publishes no rush pricing, which
 * is what public/llms.txt does.
 * ------------------------------------------------------------------ */
const MONEY = String.raw`fees?|charges?|surcharges?|upcharges?|premiums?|costs?\s+(?:more|extra)|extra\s+costs?|additional\s+(?:costs?|charges?)|\$\s?\d`;
const RUSH_FEE = [
  new RegExp(String.raw`\b(?:rush|expedited?)\b[^.!?]{0,40}?\b(?:${MONEY})`, "i"),
  new RegExp(String.raw`\b(?:${MONEY})\b[^.!?]{0,40}?\b(?:rush|expedited?)\b`, "i"),
];

for (const { where, pieces } of surfaces) {
  for (const piece of pieces) {
    for (const pattern of RUSH_FEE) {
      const hit = piece.match(pattern);
      if (hit) fail("no-rush-fee", `${where} prices a rush order — "${hit[0]}"`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 3. The rush line is an invitation, not a guarantee.
 *
 * "We do take rush orders" on its own over-promises: it reads as a yes before
 * anyone has looked at the date. The hedge is the whole point of the sentence,
 * so wherever the offer appears the hedge has to appear with it.
 * ------------------------------------------------------------------ */
const OFFER = /we do take rush orders/gi;
const HEDGE = /confirm what's possible/i;

let offerSurfaces = 0;
for (const { where, text } of surfaces) {
  const offers = [...text.matchAll(OFFER)];
  if (offers.length === 0) continue;
  offerSurfaces += 1;
  for (const offer of offers) {
    const near = text.slice(offer.index, offer.index + 420);
    if (!HEDGE.test(near)) {
      fail("rush-is-an-invitation", `${where} offers rush orders with no "confirm what's possible" — "…${near.slice(0, 200).trim()}…"`);
    }
  }
}
if (offerSurfaces === 0) {
  fail("rush-is-an-invitation", "no built page offers rush orders at all — the service has been swept off the site again");
}

/* ------------------------------------------------------------------ *
 * 4. The standard window is the only window, and it is still there.
 *
 * The withdrawn ladder, and the "three weeks" answers that used to argue with
 * the fact strip above them, are both spelled out here so reinstating either
 * one fails the build.
 * ------------------------------------------------------------------ */
const WITHDRAWN = [
  [/\b(?:three|four|five|3|4|5)\s+weeks?\s+after\s+(?:you\s+approve|final\s+approval|design\s+approval|artwork)/i, "a three-or-more-week production window"],
  [/\b(?:7\s*[-–]\s*14|10\s*[-–]\s*16|12\s*[-–]\s*18)\s*business\s*days\b/i, "the withdrawn business-day ladder"],
];

for (const { where, text } of surfaces) {
  for (const [pattern, what] of WITHDRAWN) {
    const hit = text.match(pattern);
    if (hit) fail("one-standard-window", `${where} reintroduces ${what} — "${hit[0]}"`);
  }
}

const STANDARD = /1\s*(?:to|[-–])\s*2\s+weeks\s+after\s+you\s+approve\s+the\s+design/i;
// A product page is defined by what it publishes and where it lives: a Product
// node in its JSON-LD, at the root of the route tree. The Product node alone is
// not enough — each blog post carries one too, for the "product this guide
// covers" card — and the filename alone is not enough either, because that list
// needs maintaining every time a page is added. Both together also keep
// _global-error.html and the other framework pages out.
const productPages = htmlFiles.filter((file) => {
  const rel = relative(ROOT, file).replace(/^\.next\/server\/app\//, "");
  if (rel.includes("/")) return false;
  return /<script[^>]*application\/ld\+json[^>]*>[^<]*"@type"\s*:\s*"Product"/.test(readFileSync(file, "utf8"));
});

if (productPages.length < 28) {
  fail("one-standard-window", `only ${productPages.length} product pages were found, expected at least 28`);
}
for (const file of productPages) {
  const text = prose(readFileSync(file, "utf8"));
  if (!STANDARD.test(text)) {
    fail("one-standard-window", `${relative(ROOT, file)} no longer states the standard 1 to 2 week window`);
  }
}

/* ------------------------------------------------------------------ *
 * 5. Rush is body copy, never a promise in the head or in schema.
 *
 * It must not reach the title, the meta description, the H1, or any schema
 * field a search engine reads as a delivery commitment.
 * ------------------------------------------------------------------ */
const HEAD_SLOTS = [
  [/<title>([\s\S]*?)<\/title>/gi, "the page title"],
  [/<meta\s+name="description"\s+content="([^"]*)"/gi, "the meta description"],
  [/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "the H1"],
];
const SCHEMA_PROMISE = /"(deliveryTime|shippingDetails|handlingTime|transitTime|availability|priceValidUntil)"\s*:\s*("[^"]*rush[^"]*"|"[^"]*expedit[^"]*")/i;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const where = relative(ROOT, file);
  for (const [pattern, slot] of HEAD_SLOTS) {
    for (const hit of html.matchAll(pattern)) {
      if (/rush|expedit/i.test(hit[1])) fail("rush-is-body-copy", `${where} puts rush in ${slot} — "${hit[1].trim()}"`);
    }
  }
  for (const block of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    const hit = block[1].match(SCHEMA_PROMISE);
    if (hit) fail("rush-is-body-copy", `${where} puts rush in schema ${hit[1]} — "${hit[2]}"`);
  }
}

/* ------------------------------------------------------------------ *
 * 6. Coverage: the places a buyer actually weighs a date.
 *
 * Product pages carry the note under the turnaround fact AND the FAQ pair in
 * the FAQPage schema, where the structured answer has to be the visible answer
 * word for word. The home Q&A, the category and city pages, the checkout's
 * "Needed by" hint and llms.txt carry it too.
 * ------------------------------------------------------------------ */
const RUSH_Q = "Can you make them faster?";

for (const file of productPages) {
  const html = readFileSync(file, "utf8");
  const where = relative(ROOT, file);
  const text = prose(html);
  if (!OFFER.test(text)) fail("rush-coverage", `${where} does not mention rush orders`);
  OFFER.lastIndex = 0;

  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const faqBlock = blocks.find((block) => block.includes('"FAQPage"'));
  if (!faqBlock) {
    fail("rush-coverage", `${where} has no FAQPage schema`);
    continue;
  }
  let parsed;
  try {
    parsed = JSON.parse(faqBlock);
  } catch (error) {
    fail("rush-coverage", `${where} FAQPage schema is not valid JSON (${error.message})`);
    continue;
  }
  const question = (parsed.mainEntity ?? []).find((entry) => entry.name === RUSH_Q);
  if (!question) {
    fail("rush-coverage", `${where} FAQPage schema is missing "${RUSH_Q}"`);
    continue;
  }
  // The structured answer has to be on the page, word for word, or the schema
  // is answering a question the visitor cannot see answered.
  const schemaAnswer = question.acceptedAnswer?.text ?? "";
  if (!schemaAnswer.trim()) {
    fail("rush-coverage", `${where} rush question has no acceptedAnswer text`);
  } else if (!text.includes(schemaAnswer)) {
    fail("rush-coverage", `${where} rush answer in schema is not the visible answer word for word`);
  }
}

const REQUIRED_SURFACES = [
  ["home Q&A", (rel) => rel === ".next/server/app/index.html"],
  ["category pages", (rel) => rel.startsWith(".next/server/app/categories/")],
  ["city pages", (rel) => rel.startsWith(".next/server/app/locations/") && rel !== ".next/server/app/locations.html"],
];

for (const [label, matches] of REQUIRED_SURFACES) {
  const files = htmlFiles.filter((file) => matches(relative(ROOT, file)));
  if (files.length === 0) {
    fail("rush-coverage", `no built pages matched ${label}`);
    continue;
  }
  for (const file of files) {
    const text = prose(readFileSync(file, "utf8"));
    if (!OFFER.test(text)) fail("rush-coverage", `${relative(ROOT, file)} (${label}) does not mention rush orders`);
    OFFER.lastIndex = 0;
  }
}

const checkoutChunks = chunkFiles.filter((file) => file.includes("/app/checkout/"));
if (checkoutChunks.length === 0) {
  fail("rush-coverage", "no client chunk was emitted for /checkout/");
} else if (!checkoutChunks.some((file) => /we do take rush orders/i.test(readFileSync(file, "utf8")))) {
  fail("rush-coverage", "the checkout's Needed by hint does not mention rush orders");
}

if (!OFFER.test(readFileSync(llmsPath, "utf8"))) {
  fail("rush-coverage", "public/llms.txt does not mention rush orders");
}
OFFER.lastIndex = 0;

if (failures.length) {
  console.error(`${RED}✗ turnaround check failed${OFF}`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `${GREEN}✓ turnaround check passed${OFF} — ${htmlFiles.length} pages, ${chunkFiles.length} chunks: one standard window (1 to 2 weeks after you approve the design) on all ${productPages.length} product pages, rush orders offered with no day count and no fee, and the FAQPage answer identical to the visible one.`,
);
