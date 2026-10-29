import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Vercel rejects a request body over about 4.5 MB before our code runs, and
 * base64 inflates an attachment by a third. We refuse at 4 MB so the visitor
 * gets a sentence they can act on instead of a platform error page.
 */
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const TOO_LARGE =
  "That attachment is too large to send through the form. Please email it to info@texasfootballuniforms.com and submit the form without it.";

/** Fields that must arrive, because a lead without them cannot be answered. */
function validate(fields: Record<string, unknown>, hasSpec: boolean) {
  const text = (key: string) => (typeof fields[key] === "string" ? (fields[key] as string).trim() : "");

  if (!text("name")) return "Please tell us your name.";
  const email = text("email");
  if (!email) return "Please add an email address so we can send your quote.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "That email address does not look right.";
  // Every form on the site sends its body text as "message"; the design tool
  // sends a built specification under the same key.
  if (!hasSpec && !text("message") && !text("product")) {
    return "Please tell us what you need — quantity, design, and timeline.";
  }
  return null;
}

/** Human labels for the keys the forms post, so the email never says "Organization:" twice. */
const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  organization: "School / club",
  school: "School / club",
  city: "City",
  product: "Product",
  timeline: "Timeline",
  requestType: "Request type",
  message: "Message",
};

const CONTACT_ORDER = ["name", "email", "phone", "organization", "school", "city", "product", "timeline"];

type SpecRow = { label: string; value: string };

/** The design tool posts its specification as a list so the email can render it as one. */
function readSpec(value: unknown): SpecRow[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (row): row is SpecRow =>
        !!row &&
        typeof row === "object" &&
        typeof (row as SpecRow).label === "string" &&
        typeof (row as SpecRow).value === "string" &&
        (row as SpecRow).value.trim() !== "",
    )
    .map((row) => ({ label: row.label.slice(0, 80), value: row.value.slice(0, 400) }))
    .slice(0, 40);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rowsHtml(rows: SpecRow[]) {
  return rows
    .map(
      (row) =>
        `<tr><th align="left" style="padding:6px 14px 6px 0;color:#30435d;font-weight:600;white-space:nowrap;vertical-align:top">${escapeHtml(
          row.label,
        )}</th><td style="padding:6px 0;color:#0b1f3a">${escapeHtml(row.value).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
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
      return NextResponse.json({ ok: false, error: "We could not read that request." }, { status: 400 });
    }

    // Artwork arrives as base64 so the whole request stays JSON.
    const { artwork, website, spec: rawSpec, ...fields } = data as Record<string, unknown> & {
      artwork?: { name: string; type: string; data: string };
      website?: string;
      spec?: unknown;
    };

    // Honeypot: the field is hidden from people, so a filled one is probably a
    // bot. The request still reaches the team, labelled "[Possible spam]".
    const possibleSpam = typeof website === "string" && website.trim() !== "";

    const spec = readSpec(rawSpec);

    const invalid = validate(fields, spec.length > 0);
    if (invalid) {
      return NextResponse.json({ ok: false, error: invalid }, { status: 400 });
    }

    const str = (key: string) =>
      typeof fields[key] === "string" ? (fields[key] as string).trim() : "";

    const contactRows: SpecRow[] = CONTACT_ORDER.filter((key) => str(key)).map((key) => ({
      label: FIELD_LABELS[key] ?? key,
      value: str(key),
    }));

    // Anything a form invented that is not already covered above.
    const knownKeys = new Set([...CONTACT_ORDER, "subject", "message", "requestType"]);
    const extraRows: SpecRow[] = Object.entries(fields)
      .filter(([key, value]) => !knownKeys.has(key) && typeof value === "string" && value.trim() !== "")
      .map(([key, value]) => ({
        label: FIELD_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1),
        value: (value as string).trim(),
      }));

    /**
     * The specification used to arrive as one long "Message:" blob that had to
     * be read line by line to find the roster size. When a form sends a `spec`
     * list, the mail renders it as a list — in plain text and in HTML — and
     * the flattened copy in `message` is dropped so nothing is said twice.
     */
    const message = spec.length ? "" : str("message");

    // Where this enquiry came from, written by the SITE.
    //
    // The ZeeOps Gmail intake files a lead either by a label somebody put on
    // the thread or by finding one of our own domains in the mail. This mail
    // named neither, so the label was the only thing holding it up — and on
    // 8 Sep 2026 a Kraft Box Pack enquiry with the same gap sat unfiled for
    // four hours and had to be entered by hand. "Page URL:" is the exact
    // marker the intake matches.
    //
    // Taken from the Referer, which the browser sends on the same-origin fetch
    // that posts this form, and falling back to the bare domain — never from
    // the request body, so a cached copy of an older script cannot leave it out.
    const SITE = "https://texasfootballuniforms.com";
    const referer = req.headers.get("referer") || "";
    const pageUrl = referer.startsWith(SITE) ? referer : SITE + "/";

    const requestType = str("requestType");

    const textParts = [
      requestType ? `Request type: ${requestType}` : "",
      "",
      "CONTACT",
      ...contactRows.map((row) => `  ${row.label}: ${row.value}`),
      ...(extraRows.length ? ["", "DETAILS", ...extraRows.map((row) => `  ${row.label}: ${row.value}`)] : []),
      ...(spec.length ? ["", "SPECIFICATION", ...spec.map((row) => `  • ${row.label}: ${row.value}`)] : []),
      ...(message ? ["", "MESSAGE", message] : []),
      ...(artwork ? ["", `Artwork: ${artwork.name} (attached)`] : []),
      "",
      "--- where this came from ---",
      `Page URL: ${pageUrl}`,
    ];

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#0b1f3a">
${requestType ? `<p style="margin:0 0 12px"><strong>${escapeHtml(requestType)}</strong></p>` : ""}
<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Contact</h3>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">${rowsHtml(contactRows)}</table>
${extraRows.length ? `<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Details</h3><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">${rowsHtml(extraRows)}</table>` : ""}
${spec.length ? `<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Specification</h3><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">${rowsHtml(spec)}</table>` : ""}
${message ? `<h3 style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#c8102e">Message</h3><p style="margin:0 0 18px;white-space:pre-wrap">${escapeHtml(message)}</p>` : ""}
${artwork ? `<p style="margin:0 0 18px;color:#30435d">Artwork attached: ${escapeHtml(artwork.name)}</p>` : ""}
<p style="margin:0;color:#30435d;font-size:12px">--- where this came from ---<br>Page URL: <a href="${escapeHtml(pageUrl)}">${escapeHtml(pageUrl)}</a></p>
</div>`;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO,
      replyTo: str("email") || undefined,
      subject: `${possibleSpam ? "[Possible spam] " : ""}${(fields.subject as string) || "New Quote Request – Texas Football Uniforms"}`,
      text: `${possibleSpam ? "[Possible spam] hidden field filled\n\n" : ""}${textParts.join("\n")}`,
      html,
      attachments: artwork
        ? [{ filename: artwork.name, content: Buffer.from(artwork.data, "base64"), contentType: artwork.type }]
        : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ ok: false, error: "Failed to send email." }, { status: 500 });
  }
}
