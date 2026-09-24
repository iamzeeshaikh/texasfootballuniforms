/**
 * Payment guard. Run after `next build` (npm run check:payment, and as part of
 * `npm run build`).
 *
 * The owner's decision, 2026-09-24: an order is settled **online**, against a
 * **PayPal invoice emailed after the buyer approves their design proof** and
 * payable by PayPal or by card. One method, nothing charged on the site, and no
 * PayPal button, SDK, client id or redirect anywhere on it — charging up front
 * is what loses PayPal disputes on made-to-order goods. Cash on delivery was
 * withdrawn on the same day; bank transfer went earlier, because the owner has
 * never supplied bank details.
 *
 * Three things are asserted, and all three are asserted against BUILT output
 * (prerendered HTML, the client bundles, public/llms.txt) rather than the
 * source, because the source is not what a visitor or a crawler reads:
 *
 *   1. No page and no shipped script offers bank transfer, a wire, a card or
 *      payment before production.
 *   2. The checkout carries exactly one method, the PayPal invoice.
 *   3. Nothing anywhere loads PayPal's SDK or links out to paypal.com.
 *
 * Each rule was watched failing against a planted defect before it was trusted
 * (see the report for 2026-09-19).
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
const scriptFiles = walk(join(ROOT, ".next/static/chunks"), [".js"]);
const publicFiles = walk(join(ROOT, "public"), [".txt", ".html", ".js"]);

if (htmlFiles.length === 0) {
  console.error(`${RED}No built HTML found. Run \`next build\` first.${OFF}`);
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 * 1. Nothing offers a payment method that does not exist.
 * ------------------------------------------------------------------ */
const BANNED = [
  [/bank\s+transfers?/i, "bank transfer"],
  [/bank\s+(details|account)/i, "bank details"],
  [/account\s+numbers?\s+(are|is|will)/i, "bank account numbers"],
  [/wire\s+transfers?/i, "wire transfer"],
  [/pay\s+in\s+full\s+(before|up\s?front|at\s+checkout)/i, "pay in full up front"],
  [/credit\s+cards?/i, "credit card"],
  [/pay\s+(by|with|using)\s+card/i, "pay by card"],
  // "No payment is taken on this site" is the sentence we want; the same
  // sentence without the "no" is the defect.
  [/(?<!\bno\s)payment\s+is\s+taken\s+on\s+(the|this)\s+site/i, "payment taken on the site"],
  [/(?<!\bnot?\b[\s\w]{0,20})charged\s+(at|during)\s+checkout/i, "a charge at checkout"],
];

for (const file of [...htmlFiles, ...scriptFiles, ...publicFiles]) {
  const text = readFileSync(file, "utf8");
  for (const [pattern, name] of BANNED) {
    const hit = text.match(pattern);
    if (hit) fail("no-dead-payment-method", `${relative(ROOT, file)} offers ${name} — "${hit[0]}"`);
  }
}

/* ------------------------------------------------------------------ *
 * 2. The checkout carries exactly one method, the PayPal invoice.
 *
 * The checkout form is a client component that renders "Loading your order…"
 * until the cart is read from storage, so the radios are not in the prerendered
 * HTML — the array that builds them ships in the checkout's JS chunk, and that
 * is what is read here.
 * ------------------------------------------------------------------ */
// Cash on delivery was withdrawn by the owner on 2026-09-24: payment is the
// PayPal invoice sent after proof approval, payable by PayPal or by card.
const EXPECTED = [{ id: "paypal", label: "PayPal invoice" }];

const checkoutChunks = scriptFiles.filter((file) => file.includes("/app/checkout/"));
if (checkoutChunks.length === 0) {
  fail("checkout-methods", "no client chunk was emitted for /checkout/");
}

const ENTRY = /\{id:"([a-z-]+)",label:"([^"]*)",detail:"([^"]*)",ownerLine:"([^"]*)"\}/g;

for (const file of checkoutChunks) {
  const text = readFileSync(file, "utf8");
  const found = [...text.matchAll(ENTRY)].map(([, id, label, detail, ownerLine]) => ({
    id,
    label,
    detail,
    ownerLine,
  }));
  const where = relative(ROOT, file);

  if (found.length === 0) {
    // Either the array is gone or the bundler changed shape. Both need a human.
    fail("checkout-methods", `${where} carries no PAYMENT_METHODS array this check can read`);
    continue;
  }
  if (found.length !== EXPECTED.length) {
    fail(
      "checkout-methods",
      `${where} offers ${found.length} payment methods (${found.map((m) => m.id).join(", ")}), expected exactly ${EXPECTED.length}`,
    );
  }
  EXPECTED.forEach((expected, index) => {
    const actual = found[index];
    if (!actual) return;
    if (actual.id !== expected.id) {
      fail("checkout-methods", `${where} method ${index + 1} is "${actual.id}", expected "${expected.id}"`);
    }
    if (actual.label !== expected.label) {
      fail("checkout-methods", `${where} label ${index + 1} is "${actual.label}", expected "${expected.label}"`);
    }
    if (!actual.detail.trim()) {
      fail("checkout-methods", `${where} method "${actual.id}" has no explanation line`);
    }
    if (!actual.ownerLine.trim()) {
      fail("checkout-methods", `${where} method "${actual.id}" has no ownerLine for the order email`);
    }
  });
  // The default the radio group starts on. It follows the array in the bundle.
  if (!/\bDEFAULT_PAYMENT_METHOD\b/.test(text) && !/\],\s*[A-Za-z$_]+\s*=\s*"paypal"/.test(text)) {
    fail("checkout-methods", `${where} does not default the payment choice to "paypal"`);
  }
  // The PayPal explanation has to say when the invoice arrives, or the page is
  // back to implying a charge at checkout.
  const paypal = found.find((method) => method.id === "paypal");
  if (paypal && !/approve/i.test(paypal.detail)) {
    fail(
      "checkout-methods",
      `${where} PayPal option does not say the invoice follows proof approval: "${paypal.detail}"`,
    );
  }
}

/* ------------------------------------------------------------------ *
 * 3. No PayPal button, SDK, client id or redirect. The owner sends the
 *    invoice by hand from PayPal Business after the proof is approved.
 * ------------------------------------------------------------------ */
const PAYPAL_INTEGRATION = [
  [/paypal\.com/i, "a link or request to paypal.com"],
  [/paypalobjects\.com/i, "a PayPal-hosted asset"],
  [/sdk\/js\?client-id/i, "the PayPal JS SDK"],
  [/PAYPAL_CLIENT_ID/, "a PayPal client id"],
  [/paypal-button|paypal\.Buttons/i, "a PayPal button"],
];

for (const file of [...htmlFiles, ...scriptFiles, ...publicFiles]) {
  const text = readFileSync(file, "utf8");
  for (const [pattern, what] of PAYPAL_INTEGRATION) {
    if (pattern.test(text)) fail("no-paypal-integration", `${relative(ROOT, file)} carries ${what}`);
  }
}

if (failures.length) {
  console.error(`${RED}✗ payment check failed${OFF}`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `${GREEN}✓ payment check passed${OFF} — ${htmlFiles.length} pages, ${scriptFiles.length} scripts: one method (PayPal invoice after proof approval), no cash on delivery, no bank transfer, no PayPal SDK.`,
);
