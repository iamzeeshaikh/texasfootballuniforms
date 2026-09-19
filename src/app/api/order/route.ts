import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { getOrderableProducts } from "@/lib/catalog";
import {
  formatMoney,
  isPaymentMethod,
  paymentMethodLabel,
  paymentOwnerLine,
  type PaymentMethod,
} from "@/lib/cart";
import { company } from "@/lib/site";
import { isUsState } from "@/lib/us-states";

/**
 * Order intake.
 *
 * What this endpoint does NOT do is take money. There is no gateway, no card
 * field, no PayPal SDK and no stored payment instrument anywhere on the site:
 * an order is settled in cash when it is delivered, or against a PayPal invoice
 * the owner sends by hand once the buyer has approved their design proof.
 * Charging before the proof is approved is what loses disputes on made-to-order
 * goods, which is why the money comes after it and never from this route.
 *
 * Prices are never read from the request. The browser posts a slug, a quantity
 * and a size breakdown; every dollar in the mail below is looked up from the
 * catalog on this side, so a tampered or simply stale cart cannot invent a
 * price the site does not publish.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

/** Same ceiling as /api/lead: Vercel rejects a body over ~4.5 MB before we run. */
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const TOO_LARGE = `That attachment is too large to send through the form. Please email it to ${company.email} and place the order without it.`;

const MAX_LINES = 40;

type IncomingLine = {
  slug: string;
  quantity: number;
  sizes: Record<string, number>;
  colors?: string;
  notes?: string;
};

type PricedLine = {
  name: string;
  slug: string;
  quantity: number;
  unitPrice: number;
  priceUnit: string;
  subtotal: number;
  sizes: string;
  colors: string;
  notes: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function str(value: unknown, limit = 200) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

/**
 * TFU-260918-7QK4. Short enough to read down a phone, dated so an old
 * reference is obviously old, and random enough that two orders in the same
 * minute cannot collide.
 */
function orderReference(now = new Date()) {
  const stamp = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  // No I, O, 0 or 1: these get read aloud over the phone.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 4; i += 1) {
    tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `TFU-${stamp}-${tail}`;
}

/** Turns the posted lines into priced lines, or explains why it cannot. */
function priceLines(raw: unknown): { lines: PricedLine[]; total: number } | { error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: "Your cart is empty — add a design before placing the order." };
  }
  if (raw.length > MAX_LINES) {
    return { error: "That is more designs than one order can carry. Please call us instead." };
  }

  const catalog = new Map(getOrderableProducts().map((product) => [product.slug, product]));
  const lines: PricedLine[] = [];

  for (const entry of raw as IncomingLine[]) {
    const product = catalog.get(str(entry?.slug, 120));
    if (!product) {
      return { error: "One of the items in your cart is no longer available. Please remove it." };
    }

    const quantity = Math.floor(Number(entry?.quantity));
    if (!Number.isFinite(quantity) || quantity < product.minimum) {
      return { error: `${product.name} needs at least ${product.minimum} per design.` };
    }

    const sizes = entry?.sizes && typeof entry.sizes === "object" ? entry.sizes : {};
    let assigned = 0;
    const parts: string[] = [];
    for (const size of product.sizeRun) {
      const count = Math.floor(Number((sizes as Record<string, unknown>)[size]));
      if (!Number.isFinite(count) || count <= 0) continue;
      assigned += count;
      parts.push(`${size} ×${count}`);
    }
    // A size the product does not publish is a broken cart, not a rounding error.
    const offered = new Set<string>(product.sizeRun);
    const unknown = Object.keys(sizes).filter(
      (size) => !offered.has(size) && Number((sizes as Record<string, unknown>)[size]) > 0,
    );
    if (unknown.length) {
      return { error: `${product.name} is not made in ${unknown[0]}. Please re-check the sizes.` };
    }
    if (assigned !== quantity) {
      return {
        error: `The size breakdown for ${product.name} adds up to ${assigned}, not ${quantity}.`,
      };
    }

    lines.push({
      name: product.name,
      slug: product.slug,
      quantity,
      unitPrice: product.fromPrice,
      priceUnit: product.priceUnit,
      subtotal: Math.round(quantity * product.fromPrice * 100) / 100,
      sizes: parts.join(", "),
      colors: str(entry?.colors, 200),
      notes: str(entry?.notes, 600),
    });
  }

  const total = Math.round(lines.reduce((sum, line) => sum + line.subtotal, 0) * 100) / 100;
  return { lines, total };
}

function linesTextBlock(lines: PricedLine[]) {
  return lines
    .map((line) =>
      [
        `  • ${line.name} — ${line.quantity} × ${formatMoney(line.unitPrice)} per ${line.priceUnit} = ${formatMoney(line.subtotal)}`,
        `      Sizes: ${line.sizes}`,
        line.colors ? `      Colors: ${line.colors}` : "",
        line.notes ? `      Decoration: ${line.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");
}

function linesHtmlBlock(lines: PricedLine[], total: number) {
  const rows = lines
    .map(
      (line) => `<tr>
<td style="padding:10px 12px;border-bottom:1px solid #e4e9f0;vertical-align:top">
  <strong style="color:#0b1f3a">${escapeHtml(line.name)}</strong><br>
  <span style="color:#30435d;font-size:13px">Sizes: ${escapeHtml(line.sizes)}</span>
  ${line.colors ? `<br><span style="color:#30435d;font-size:13px">Colors: ${escapeHtml(line.colors)}</span>` : ""}
  ${line.notes ? `<br><span style="color:#30435d;font-size:13px">Decoration: ${escapeHtml(line.notes)}</span>` : ""}
</td>
<td align="right" style="padding:10px 12px;border-bottom:1px solid #e4e9f0;white-space:nowrap;vertical-align:top;color:#0b1f3a">
  ${line.quantity} × ${formatMoney(line.unitPrice)}<br>
  <strong>${formatMoney(line.subtotal)}</strong>
</td>
</tr>`,
    )
    .join("");

  return `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px;border:1px solid #e4e9f0;border-radius:8px">
${rows}
<tr>
<td style="padding:10px 12px;color:#30435d">Shipping</td>
<td align="right" style="padding:10px 12px;color:#0f763c;font-weight:600">Free</td>
</tr>
<tr>
<td style="padding:10px 12px;color:#0b1f3a;font-weight:700">Estimated total</td>
<td align="right" style="padding:10px 12px;color:#0b1f3a;font-weight:700">${formatMoney(total)}</td>
</tr>
</table>`;
}

/**
 * The buyer's sequence, in the order it actually happens — including where the
 * money is asked for, which is different for each method and is never at
 * checkout.
 */
function nextSteps(paymentMethod: PaymentMethod) {
  return [
    "A designer draws your free design proof and emails it, normally within 24 hours.",
    "You approve the proof, or ask for changes — nothing is cut or printed before you do.",
    ...(paymentMethod === "paypal"
      ? ["We email you a PayPal invoice once you have approved the proof."]
      : []),
    "Production runs 1 to 2 weeks after you approve the design.",
    "Shipping is free, anywhere in the US.",
    ...(paymentMethod === "cod" ? ["You pay the driver in cash when your order is delivered."] : []),
  ];
}

export async function POST(req: NextRequest) {
  try {
    const declared = Number(req.headers.get("content-length") || 0);
    if (declared > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: TOO_LARGE }, { status: 413 });
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: TOO_LARGE }, { status: 413 });
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ ok: false, error: "We could not read that order." }, { status: 400 });
    }

    // Honeypot: hidden from people, so a filled one is a bot. Answer 200 with a
    // reference-shaped nothing so the bot learns nothing from the response.
    const website = data.website;
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ ok: true, reference: orderReference() });
    }

    const contact = (data.contact ?? {}) as Record<string, unknown>;
    const shipping = (data.shipping ?? {}) as Record<string, unknown>;

    const name = str(contact.name, 120);
    const email = str(contact.email, 160);
    const phone = str(contact.phone, 40);
    const organization = str(contact.organization, 160);

    if (!name) return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "We send the order confirmation by email, so we need a working address." },
        { status: 400 },
      );
    }
    if (phone.replace(/\D/g, "").length < 7) {
      return NextResponse.json(
        { ok: false, error: "A phone number is how the driver reaches you on delivery day." },
        { status: 400 },
      );
    }

    const address1 = str(shipping.address1, 200);
    const address2 = str(shipping.address2, 200);
    const city = str(shipping.city, 120);
    const state = str(shipping.state, 2).toUpperCase();
    const zip = str(shipping.zip, 10);

    if (!address1 || !city || !isUsState(state) || !/^\d{5}(-\d{4})?$/.test(zip)) {
      return NextResponse.json(
        { ok: false, error: "Please check the shipping address — street, city, state and a 5-digit ZIP." },
        { status: 400 },
      );
    }

    // Exactly two methods are accepted. Anything else — an old cached bundle
    // still posting "bank-transfer", or someone posting "card" by hand — is
    // rejected rather than defaulted, because the method decides what the team
    // does next with the order.
    const posted = str(data.paymentMethod, 20);
    if (!isPaymentMethod(posted)) {
      return NextResponse.json(
        { ok: false, error: "Please choose cash on delivery or PayPal." },
        { status: 400 },
      );
    }
    const paymentMethod: PaymentMethod = posted;

    const priced = priceLines(data.lines);
    if ("error" in priced) {
      return NextResponse.json({ ok: false, error: priced.error }, { status: 400 });
    }

    const neededBy = str(data.neededBy, 40);
    const orderNotes = str(data.notes, 1200);
    const artwork = data.artwork as { name: string; type: string; data: string } | undefined;

    const reference = orderReference();
    const paymentLabel = paymentMethodLabel(paymentMethod);
    const addressBlock = [address1, address2, `${city}, ${state} ${zip}`].filter(Boolean).join("\n");

    const ownerText = [
      `NEW ORDER ${reference}`,
      `PAYMENT: ${paymentOwnerLine(paymentMethod)}`,
      `Estimated total: ${formatMoney(priced.total)} (free shipping)`,
      "",
      "CONTACT",
      `  Name: ${name}`,
      `  Email: ${email}`,
      `  Phone: ${phone}`,
      ...(organization ? [`  School / club: ${organization}`] : []),
      "",
      "SHIP TO",
      ...addressBlock.split("\n").map((row) => `  ${row}`),
      ...(neededBy ? [`  Needed by: ${neededBy}`] : []),
      "",
      "ORDER",
      linesTextBlock(priced.lines),
      "",
      `  Estimated total: ${formatMoney(priced.total)} (free shipping)`,
      ...(orderNotes ? ["", "NOTES", `  ${orderNotes}`] : []),
      ...(artwork ? ["", `Artwork: ${artwork.name} (attached)`] : []),
      "",
      "--- where this came from ---",
      "Page URL: https://texasfootballuniforms.com/checkout/",
      "No payment was taken on the site. Collect on delivery, or send the PayPal",
      "invoice by hand once the design proof is approved.",
    ].join("\n");

    const ownerHtml = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#0b1f3a">
<p style="margin:0 0 4px;font-size:18px"><strong>New order ${escapeHtml(reference)}</strong></p>
<p style="margin:0 0 12px;padding:10px 12px;background:#0b1f3a;border-radius:6px;color:#ffffff;font-size:15px"><strong>PAYMENT: ${escapeHtml(paymentOwnerLine(paymentMethod))}</strong></p>
<p style="margin:0 0 16px;color:#30435d">Estimated total <strong>${formatMoney(priced.total)}</strong> · free shipping</p>
<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Contact</h3>
<p style="margin:0 0 16px;color:#0b1f3a">${escapeHtml(name)}<br>${escapeHtml(email)}<br>${escapeHtml(phone)}${organization ? `<br>${escapeHtml(organization)}` : ""}</p>
<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Ship to</h3>
<p style="margin:0 0 16px;color:#0b1f3a">${escapeHtml(addressBlock).replace(/\n/g, "<br>")}${neededBy ? `<br><strong>Needed by:</strong> ${escapeHtml(neededBy)}` : ""}</p>
<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Order</h3>
${linesHtmlBlock(priced.lines, priced.total)}
${orderNotes ? `<h3 style="margin:18px 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Notes</h3><p style="margin:0 0 16px;white-space:pre-wrap;color:#0b1f3a">${escapeHtml(orderNotes)}</p>` : ""}
${artwork ? `<p style="margin:16px 0 0;color:#30435d">Artwork attached: ${escapeHtml(artwork.name)}</p>` : ""}
<p style="margin:18px 0 0;color:#30435d;font-size:12px">--- where this came from ---<br>Page URL: <a href="https://texasfootballuniforms.com/checkout/">https://texasfootballuniforms.com/checkout/</a><br>No payment was taken on the site. Collect on delivery, or send the PayPal invoice by hand once the design proof is approved.</p>
</div>`;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO,
      replyTo: email,
      subject: `New Order ${reference} – ${formatMoney(priced.total)} – Texas Football Uniforms`,
      text: ownerText,
      html: ownerHtml,
      attachments: artwork
        ? [{ filename: artwork.name, content: Buffer.from(artwork.data, "base64"), contentType: artwork.type }]
        : undefined,
    });

    // The buyer's copy. Sent after the one that matters, and its failure never
    // fails the order: the order is already with the team by this point.
    const payLine =
      paymentMethod === "cod"
        ? "You pay the driver in cash when your order arrives — nothing is charged before then."
        : "We email you a PayPal invoice once you have approved your design proof. Nothing was charged on the website and nothing is charged before that approval.";

    const steps = nextSteps(paymentMethod);

    const buyerText = [
      `Thank you — we have your order, ${reference}.`,
      "",
      `Payment method: ${paymentLabel}`,
      payLine,
      "",
      "WHAT HAPPENS NEXT",
      ...steps.map((step, index) => `  ${index + 1}. ${step}`),
      "",
      "YOUR ORDER",
      linesTextBlock(priced.lines),
      "",
      `  Estimated total: ${formatMoney(priced.total)} (free shipping)`,
      "  The final amount is confirmed on your invoice: stitched decoration or a heavier fabric is",
      "  priced there, and a larger roster lowers the price per piece.",
      "",
      "SHIP TO",
      ...addressBlock.split("\n").map((row) => `  ${row}`),
      ...(neededBy ? [`  Needed by: ${neededBy}`] : []),
      "",
      `Questions? Call ${company.phoneDisplay} or reply to this email and quote ${reference}.`,
      company.name,
    ].join("\n");

    const buyerHtml = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#0b1f3a">
<p style="margin:0 0 6px;font-size:20px"><strong>Thank you — we have your order</strong></p>
<p style="margin:0 0 18px;color:#30435d">Your reference is <strong style="color:#0b1f3a">${escapeHtml(reference)}</strong>. Quote it when you call or write to us.</p>
<p style="margin:0 0 18px;padding:12px 14px;background:#f6f8fb;border-radius:8px;color:#0b1f3a"><strong>${escapeHtml(paymentLabel)}.</strong> ${escapeHtml(payLine)}</p>
<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">What happens next</h3>
<ol style="margin:0 0 18px;padding-left:20px;color:#0b1f3a">${steps.map((step) => `<li style="margin-bottom:4px">${escapeHtml(step)}</li>`).join("")}</ol>
<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Your order</h3>
${linesHtmlBlock(priced.lines, priced.total)}
<p style="margin:10px 0 18px;color:#30435d;font-size:13px">The final amount is confirmed on your invoice — stitched decoration or a heavier fabric is priced there, and a larger roster lowers the price per piece.</p>
<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Ship to</h3>
<p style="margin:0 0 18px;color:#0b1f3a">${escapeHtml(addressBlock).replace(/\n/g, "<br>")}${neededBy ? `<br><strong>Needed by:</strong> ${escapeHtml(neededBy)}` : ""}</p>
<p style="margin:0;color:#30435d">Questions? Call <a href="${company.phoneHref}">${escapeHtml(company.phoneDisplay)}</a> or reply to this email.<br>${escapeHtml(company.name)}</p>
</div>`;

    try {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        replyTo: process.env.SMTP_TO,
        subject: `Order ${reference} received – Texas Football Uniforms`,
        text: buyerText,
        html: buyerHtml,
      });
    } catch (err) {
      console.error("Buyer confirmation failed:", err);
    }

    return NextResponse.json({ ok: true, reference, total: priced.total });
  } catch (err) {
    console.error("Order send error:", err);
    return NextResponse.json(
      { ok: false, error: "We could not place that order. Please try again or call us." },
      { status: 500 },
    );
  }
}
