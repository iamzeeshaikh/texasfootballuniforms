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
 * Five things are asserted, and all five are asserted against BUILT output
 * (prerendered HTML, the client bundles, public/llms.txt) rather than the
 * source, because the source is not what a visitor or a crawler reads:
 *
 *   1. No page and no shipped script offers bank transfer, a wire, a card or
 *      payment before production.
 *   2. No page, llms.txt included, OFFERS cash on delivery — in prose or in
 *      `acceptedPaymentMethod`. A sentence that denies it ("we do not take cash
 *      on delivery", "cash on delivery is not offered") is allowed and must
 *      pass, because models and buyers who saw the old copy need the denial.
 *   3. Nothing presents payment as a choice. With one method there is no choice
 *      to offer, so "payment methods", "choose how you would like to pay" and
 *      the radio group that used to render it are all defects. The reverse
 *      contradiction — "we do not take payment online", when payment IS online
 *      and simply not on this website — is a defect too.
 *   4. The checkout carries exactly one method, the PayPal invoice, and states
 *      it rather than offering it: no radio named paymentMethod.
 *   5. Nothing anywhere loads PayPal's SDK or links out to paypal.com.
 *
 * Each rule was watched failing against a planted defect before it was trusted
 * (rules 1, 4 and 5: the report for 2026-09-19; rules 2 and 3, and the radio
 * half of rule 4: the report for 2026-09-28).
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
 * 2. Cash on delivery is not offered anywhere — but saying so is allowed.
 *
 * The owner withdrew cash on delivery on 2026-09-24. The checkout moved the
 * same day; the prose did not, and four days later llms.txt, the product fact
 * strip on 33 pages, the About page, the order emails and the Product schema on
 * all 28 product pages were still offering it. Hence a rule over the built
 * output rather than a promise to remember.
 *
 * A DENIAL has to pass, or the site cannot correct an answer engine that
 * cached the old page. So a hit is only a failure when nothing next to it
 * negates it, and "next to it" is deliberately tight: the denial has to bind to
 * the phrase itself. "…check out with cash on delivery or PayPal — no card is
 * asked for…" must still fail, and it does, because the only negation in it
 * belongs to the card, not to the cash.
 * ------------------------------------------------------------------ */
const CASH_OFFER = [
  [/cash[\s-]?on[\s-]?delivery/i, "cash on delivery"],
  [/\bcollect(?:ed|ing)?\s+on\s+delivery\b/i, "collection on delivery"],
  [/\bpay(?:s|ing)?\s+(?:the\s+)?(?:delivery\s+)?(?:driver|courier)\b/i, "paying the driver"],
  [/\bpay(?:s|ing)?\s+in\s+cash\b/i, "paying in cash"],
  [/\b(?:settled|paid)\s+in\s+cash\b/i, "settlement in cash"],
  [/\bin\s+cash\s+(?:when|on|at)\b/i, "cash on arrival"],
  [/\bpay\b[^.!?]{0,24}\bon\s+delivery\b/i, "payment on delivery"],
  // Schema, not prose: no negation is possible in a JSON-LD value, so any hit
  // is a claim the site accepts cash.
  [/goodrelations\/v1#(?:COD|Cash)\b/, "cash in acceptedPaymentMethod"],
];

/**
 * True when the text around a hit negates it. The denial must sit against the
 * phrase: a negating word in the 34 characters before it ("no cash on
 * delivery", "we do not take cash on delivery"), or one of a much shorter list
 * immediately after it ("cash on delivery is not offered", "…was withdrawn").
 * A stray "no" later in the sentence does not count, which is what keeps the
 * old offer copy failing.
 */
const DENIED_BEFORE = /\b(?:no|not|never|nor|neither|without|dropped|withdrew|withdrawn|instead\s+of|rather\s+than)\b[^.!?;]{0,34}$/i;
const DENIED_AFTER = /^[^.!?;]{0,40}?\b(?:not|no\s+longer|never|withdrawn|unavailable|gone|ended)\b/i;

function denied(text, start, end) {
  const before = text.slice(Math.max(0, start - 120), start);
  const after = text.slice(end, end + 80);
  return DENIED_BEFORE.test(before) || DENIED_AFTER.test(after);
}

for (const file of [...htmlFiles, ...scriptFiles, ...publicFiles]) {
  const text = readFileSync(file, "utf8");
  for (const [pattern, name] of CASH_OFFER) {
    const global = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
    for (const hit of text.matchAll(global)) {
      if (denied(text, hit.index, hit.index + hit[0].length)) continue;
      const context = text.slice(Math.max(0, hit.index - 70), hit.index + hit[0].length + 70).replace(/\s+/g, " ");
      fail("no-cash-on-delivery", `${relative(ROOT, file)} offers ${name} — "…${context.trim()}…"`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 3. Payment is not a choice, and it is not "off" either.
 *
 * With one method there is nothing to choose, so every sentence that frames it
 * as a decision is false — and this site had three of them left over: "pick the
 * option that suits your program", "Choose how you would like to pay.", and a
 * `payment method:` list in llms.txt with two entries in it.
 *
 * The opposite error is in the list for the same reason. "We do not take
 * payment online" was written when the alternative was cash in hand; now that
 * the invoice IS paid online, the true sentence is that no payment happens on
 * THIS WEBSITE. The two read almost the same and mean opposite things, so the
 * false one is asserted against.
 *
 * "How you pay" as a heading is fine and must stay legal — it names the
 * section, it does not promise options.
 * ------------------------------------------------------------------ */
/**
 * A third element means the phrase is only a defect when money is what is being
 * chosen: "both methods" is a defect next to an invoice and correct next to
 * embroidery and heat transfer, which is exactly what one product FAQ says.
 */
const MONEY_NEARBY = /\b(?:pay|paid|pays|paying|payment|invoice|cash|paypal|card|billed?)\b/i;
const CHOICE = [
  [/payment\s+(?:methods|options)\b/i, "a list of payment methods"],
  [/(?:choose|choice\s+of|pick|select)\s+(?:\w+\s+){0,3}?(?:payment\s+(?:method|option)|way\s+to\s+pay)/i, "a payment choice"],
  [/(?:choose|pick|select)\s+how\s+(?:you|to)\b[^.!?]{0,24}\bpay/i, "choosing how to pay"],
  [/\b(?:either|both)\s+(?:methods?|options?)\b/i, "two payment methods", MONEY_NEARBY],
  [/\b(?:either|both)\s+ways\s+to\s+pay\b/i, "two payment methods"],
  [/\bwhichever\s+(?:method|option)\b/i, "a payment choice", MONEY_NEARBY],
  [/\bpick\s+the\s+option\b/i, "an option to pick", MONEY_NEARBY],
  [/\bno\s+online\s+payment\b/i, "the false claim that payment is not online"],
  [/\b(?:do\s+not|don't|does\s+not|doesn't)\s+(?:take|accept)\s+payment\s+online\b/i, "the false claim that payment is not online"],
  [/\b(?:do\s+not|don't|does\s+not|doesn't)\s+(?:take|accept)\s+online\s+payments?\b/i, "the false claim that payment is not online"],
];

for (const file of [...htmlFiles, ...scriptFiles, ...publicFiles]) {
  const text = readFileSync(file, "utf8");
  for (const [pattern, name, near] of CHOICE) {
    const global = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
    for (const hit of text.matchAll(global)) {
      const context = text
        .slice(Math.max(0, hit.index - 90), hit.index + hit[0].length + 90)
        .replace(/\s+/g, " ");
      if (near && !near.test(context)) continue;
      fail("one-method-no-choice", `${relative(ROOT, file)} presents ${name} — "${hit[0]}" in "…${context.trim()}…"`);
      break;
    }
  }
}

/* ------------------------------------------------------------------ *
 * 4. The checkout carries exactly one method, the PayPal invoice.
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
  // One method is a statement, not a question: the radio group that used to
  // render the choice has to be gone, or the page is offering a decision the
  // business no longer has.
  if (/name:\s*"paymentMethod"/.test(text)) {
    fail("checkout-methods", `${where} still renders a radio group named paymentMethod — one method is a statement, not a choice`);
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
 * 5. No PayPal button, SDK, client id or redirect. The owner sends the
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
  `${GREEN}✓ payment check passed${OFF} — ${htmlFiles.length} pages, ${scriptFiles.length} scripts, ${publicFiles.length} public files: one method stated not offered (PayPal invoice after proof approval), no cash on delivery, no payment choice, no bank transfer, no PayPal SDK.`,
);
