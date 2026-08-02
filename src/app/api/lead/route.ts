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

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Artwork arrives as base64 so the whole request stays JSON.
    const { artwork, ...fields } = data as Record<string, unknown> & {
      artwork?: { name: string; type: string; data: string };
    };

    const lines = Object.entries(fields)
      .filter(([, v]) => v !== "" && v !== undefined)
      .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
      .join("\n");

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO,
      subject: (fields.subject as string) || "New Quote Request – Texas Football Uniforms",
      text: artwork ? `${lines}\nArtwork: ${artwork.name} (attached)` : lines,
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
