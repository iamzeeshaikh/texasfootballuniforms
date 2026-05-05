import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy | Texas Football Uniforms",
  description:
    "Review the privacy policy for Texas Football Uniforms and how quote requests, contact details, and communication preferences are handled.",
  path: "/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  return (
    <section className="section-space">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-8 sm:p-10">
          <h1 className="text-5xl text-[var(--color-navy)] sm:text-6xl">Privacy Policy</h1>
          <div className="mt-8 space-y-6">
            <p>
              Texas Football Uniforms collects the information you choose to provide when you
              request a quote, call, or email us. That may include your name, organization,
              contact details, product interest, and project notes.
            </p>
            <p>
              We use that information to respond to inquiries, prepare quotes, coordinate
              custom apparel discussions, and improve how we support schools, clubs, and
              football programs in Texas.
            </p>
            <p>
              We do not publish your personal information. If you need to update, correct, or
              remove information shared with us through a quote request, contact us directly
              using the email address on this website.
            </p>
            <p>
              By using this site, you understand that web traffic and form interactions may
              generate standard analytics and browser data used for site performance,
              troubleshooting, and service improvement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
