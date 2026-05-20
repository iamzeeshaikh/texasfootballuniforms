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

    const lines = Object.entries(data)
      .filter(([, v]) => v !== "" && v !== undefined)
      .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
      .join("\n");

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO,
      subject: data.subject || "New Quote Request – Texas Football Uniforms",
      text: lines,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ ok: false, error: "Failed to send email." }, { status: 500 });
  }
}
