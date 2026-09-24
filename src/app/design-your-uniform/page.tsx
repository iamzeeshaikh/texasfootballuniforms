import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Palette, Rocket, Ruler, Send } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { DesignYourUniform } from "@/components/design-your-uniform";
import { FaqAccordion } from "@/components/faq-accordion";
import { getDesignOptions } from "@/lib/design-tool";
import { createMetadata } from "@/lib/seo";
import { company, SITE_URL } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Design Your Football Uniform Online | Free 24-Hour Mockup",
  description:
    "Design custom football uniforms online: pick the garment, colors, decoration and roster, see the price at our 10-piece minimum, get a free 24-hour mockup.",
  path: "/design-your-uniform/",
  images: ["/assets/american football uniforms/1.jpg"],
});

const steps = [
  {
    icon: Palette,
    title: "Pick it on screen",
    text: "Choose the garment, your colors, decoration, fabric, fit and roster size. Every card is a photo of a uniform we actually produce.",
  },
  {
    icon: ClipboardCheck,
    title: "See the price as you go",
    text: "The running estimate is our published starting price at the 10-piece minimum, the same number the product page shows and the same number you see at checkout. Nothing is held back for later.",
  },
  {
    icon: Send,
    title: "Send the specification",
    text: "One tap sends what you picked, with your artwork attached if you have it. We reply with a written quote within one business day.",
  },
  {
    icon: Rocket,
    title: "Free mockup, then production",
    text: "A designer draws your uniform in your colors within 24 hours. Nothing is cut or printed until you approve it; production runs 1 to 2 weeks.",
  },
];

const faqs = [
  {
    question: "Is the price in the uniform designer the real price?",
    answer:
      "Yes. Each garment card carries the same published starting price as its product page, quoted per piece at our 10-piece minimum — the smallest order we produce and therefore the highest per-piece tier. A larger roster pays less per piece, and stitched decoration or a heavier fabric is priced in your written quote. No payment is taken on this site: orders are settled against a PayPal invoice we email after you approve your design proof, payable by PayPal or by card.",
  },
  {
    question: "What is the minimum order?",
    answer:
      "Ten pieces per design. That is one squad, not a whole program, so a 7-on-7 team or a coaching staff can order without padding the run.",
  },
  {
    question: "Do I get to see the uniform before I commit?",
    answer:
      "Yes. Send the specification and a designer draws a free digital mockup in your team colors within 24 hours. The photos in the designer are real garments we produce, not recolored renders — the mockup is where your colors and logo get drawn onto the design.",
  },
  {
    question: "How long does production take?",
    answer:
      "one to two weeks after you approve the artwork, with delivery across Texas. Tell us your first game or media day date in the form and we plan the run backwards from it.",
  },
  {
    question: "Can you match our school colors exactly?",
    answer:
      "Yes. Pick the closest color chips in the designer and add a Pantone reference or a description in the box underneath. We match to your published school colors at the artwork stage.",
  },
  {
    question: "What sizes can I order?",
    answer:
      "Youth XS to adult 5XL, and a mixed roster of youth and adult sizes in one order. Our football uniform size chart lists body measurements for jerseys, pants and warm-ups, and a free loaner sizing kit is available before you order.",
  },
  {
    question: "Can I upload our logo?",
    answer:
      "Yes — the form takes a PDF, AI, EPS, SVG, PNG, JPG or ZIP up to 3 MB. Anything bigger can be emailed to " +
      company.email +
      " after you send the form.",
  },
];

export default function DesignYourUniformPage() {
  const options = getDesignOptions();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Design Your Football Uniform",
    url: `${SITE_URL}/design-your-uniform/`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description:
      "Choose a football uniform garment, team colors, decoration, fabric, fit and roster size, see the starting price at a 10-piece minimum, and send the specification for a free mockup.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: company.name, url: SITE_URL },
  };

  return (
    <div className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-6 sm:p-10">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Design Your Uniform", path: "/design-your-uniform/" },
            ]}
          />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
            Design Your Jerseys
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl text-[var(--color-navy)] sm:text-6xl">
            Design Your Football Uniform Online
          </h1>
          <p className="mt-5 max-w-3xl text-lg">
            Build your team&rsquo;s uniform on screen from our own product photography — garment,
            team colors, decoration, fabric, fit and roster — and watch the price update as you go.
            Minimum 10 per design, free mockup within 24 hours, production in 1 to 2 weeks after
            artwork approval across Texas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#design-your-uniform"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-navy)]"
            >
              Start designing
            </a>
            <Link
              href="/size-chart/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-red)] hover:text-[var(--color-red)]"
            >
              <Ruler className="h-4 w-4" aria-hidden />
              Size chart
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-red)] hover:text-[var(--color-red)]"
            >
              {company.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="mt-10">
          <DesignYourUniform options={options} variant="page" />
        </div>

        <section className="mt-14">
          <h2 className="text-4xl text-[var(--color-navy)] sm:text-5xl">How Ordering Works</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="surface-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)]">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl text-[var(--color-navy)]">{step.title}</h3>
                <p className="mt-3">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 surface-card p-6 sm:p-10">
          <h2 className="text-4xl text-[var(--color-navy)]">What the Starting Price Covers</h2>
          <p className="mt-4 max-w-3xl">
            Every price in the designer is the published starting price on that garment&rsquo;s own
            page, quoted per piece at the {options.minimumPieces}-piece minimum. This table is the
            whole list, so you can check the number in the designer against the page it came from.
          </p>
          <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--color-border)]">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[rgba(11,31,58,0.04)]">
                  <th className="px-5 py-3 font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]">
                    Option in the designer
                  </th>
                  <th className="px-5 py-3 font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]">
                    Starting price
                  </th>
                  <th className="px-5 py-3 font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]">
                    Product page
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...options.garments, ...options.addOns].map((option) => (
                  <tr key={option.id} className="border-t border-[var(--color-border)]">
                    <td className="px-5 py-3 font-semibold text-[var(--color-navy)]">{option.label}</td>
                    <td className="px-5 py-3 text-[var(--color-navy-soft)]">
                      ${option.price?.toFixed(2)} per {option.unit}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={option.href ?? "/all-categories/"}
                        className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
                      >
                        View page
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-sm text-[var(--color-navy-soft)]">
            Prices are in USD, per piece, before shipping and tax, at the{" "}
            {options.minimumPieces}-piece minimum. Larger rosters pay less per piece. Fabric
            upgrades and stitched decoration — tackle twill, embroidery, sewn nameplates — are
            priced in your written quote rather than guessed at here.
          </p>
        </section>

        <section className="mt-14 surface-card p-6 sm:p-10">
          <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">
            Uniform Designer Questions
          </h2>
          <p className="mt-3 max-w-3xl">Tap a question to open the answer.</p>
          <FaqAccordion faqs={faqs} className="mt-6" />
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
    </div>
  );
}
