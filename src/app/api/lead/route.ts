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
function validate(fields: Record<string, unknown>) {
  const text = (key: string) => (typeof fields[key] === "string" ? (fields[key] as string).trim() : "");

  if (!text("name")) return "Please tell us your name.";
  const email = text("email");
  if (!email) return "Please add an email address so we can send your quote.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "That email address does not look right.";
  // Every form on the site sends its body text as "message"; the design tool
  // sends a built specification under the same key.
  if (!text("message") && !text("spec") && !text("product")) {
    return "Please tell us what you need — quantity, design, and timeline.";
  }
  return null;
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
    const { artwork, website, ...fields } = data as Record<string, unknown> & {
      artwork?: { name: string; type: string; data: string };
      website?: string;
    };

    // Honeypot: the field is hidden from people, so a filled one is a bot.
    // Answer 200 so the bot has nothing to learn from the response.
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const invalid = validate(fields);
    if (invalid) {
      return NextResponse.json({ ok: false, error: invalid }, { status: 400 });
    }

    const lines = Object.entries(fields)
      .filter(([, v]) => v !== "" && v !== undefined && v !== null)
      .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
      .join("\n");

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
    const footer = `\n\n--- where this came from ---\nPage URL: ${pageUrl}`;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO,
      subject: (fields.subject as string) || "New Quote Request – Texas Football Uniforms",
      text: (artwork ? `${lines}\nArtwork: ${artwork.name} (attached)` : lines) + footer,
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
