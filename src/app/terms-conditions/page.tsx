import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms and Conditions | Texas Football Uniforms",
  description:
    "Review the terms and conditions for using Texas Football Uniforms, requesting quotes, and discussing custom apparel orders.",
  path: "/terms-conditions/",
});

export default function TermsConditionsPage() {
  return (
    <section className="section-space">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-8 sm:p-10">
          <h1 className="text-5xl text-[var(--color-navy)] sm:text-6xl">Terms &amp; Conditions</h1>
          <div className="mt-8 space-y-6">
            <p>
              The information on this website is provided for general product and quote-request
              purposes. Final custom football apparel specifications, production details, and
              delivery timelines are confirmed during the quoting and approval process.
            </p>
            <p>
              Artwork, colors, names, numbers, size breakdowns, and order quantities should be
              reviewed carefully before final approval. Production timelines begin after those
              details are confirmed.
            </p>
            <p>
              Because this website is quote based, product availability, minimum order
              quantities, and decoration methods may vary depending on the exact scope of your
              project.
            </p>
            <p>
              By using this site, you agree not to misuse the content, submit misleading
              information, or rely on any generic website copy as a substitute for written
              order approval and production communication.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
