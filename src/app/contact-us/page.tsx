import { ExtraFaqs } from "@/components/extra-faqs";
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { QuoteForm } from "@/components/quote-form";
import { whatsAppHref } from "@/components/whatsapp-button";
import { company, SITE_URL } from "@/lib/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact Texas Football Uniforms | Free Quote in 24 Hours",
  description:
    "Call (213) 449-3746, WhatsApp, email or send the quote form. Free mockup in 24 hours, minimum 10 per design, written reply within one business day.",
  path: "/contact-us/",
});

/**
 * No opening hours here on purpose: the site states a reply window ("within
 * one business day", on the quote form and the thank-you page) but has never
 * published an opening time anywhere, and schema.org openingHours is exactly
 * the kind of field that turns an invented number into a promise on a search
 * result. Add `openingHoursSpecification` when the owner confirms real hours.
 */

const channels = [
  {
    icon: Phone,
    label: "Phone",
    value: company.phoneDisplay,
    href: company.phoneHref,
    note: "Fastest for a date-driven order — a coach with a deadline gets further in five minutes on the phone than in an email chain.",
    external: false,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+1 213-449-3746",
    href: whatsAppHref(),
    note: "Best for sending a photo of last season's jersey or a screenshot of a logo. The message arrives pre-filled so we know it is a football uniform inquiry.",
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: company.email,
    href: `mailto:${company.email}`,
    note: "Use this when you already have artwork files, a size sheet or a district purchase process that needs everything in writing.",
    external: false,
  },
];

const include = [
  ["Roster count", "How many pieces of each design. Ten of one design is the minimum, and mixed sizes all count toward the same ten."],
  ["What you want made", "Game jerseys, a full uniform set, practice gear, warm-ups, coaches apparel — or the mix, if it is a whole program refresh."],
  ["Your colors", "School or club colors by name is fine to start with; exact color values get locked at the artwork stage."],
  ["Names and numbers", "Whether jerseys carry player names, numbers only, or nothing. It changes the quote."],
  ["The date you need them", "Work back from the first game, not from today. Most jerseys run 1 to 2 weeks after you approve the design and full uniform programs run 3 to 4."],
  ["Artwork, if you have it", "A logo file, last year's jersey photo or a rough sketch. None of it is required — we can draw from a description."],
];

export default function ContactUsPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact-us/#contactpage`,
    url: `${SITE_URL}/contact-us/`,
    name: "Contact Texas Football Uniforms",
    description:
      "Phone, WhatsApp, email and quote form for custom football uniform orders in Texas, with what to include in a first message and the expected reply time.",
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@id": `${SITE_URL}/#organization`,
      "@type": "Organization",
      name: company.name,
      url: SITE_URL,
      email: company.email,
      telephone: company.phoneDisplay,
      address: {
        "@type": "PostalAddress",
        streetAddress: company.addressLines[0],
        addressLocality: company.city,
        addressRegion: company.state,
        postalCode: company.postalCode,
        addressCountry: "US",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: company.phoneDisplay,
          email: company.email,
          areaServed: "US-TX",
          availableLanguage: "English",
        },
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: whatsAppHref(),
          areaServed: "US-TX",
          availableLanguage: "English",
        },
      ],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Contact Us", item: `${SITE_URL}/contact-us/` },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <section className="section-space">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact-us/" }]} />

          <div className="mt-6 grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="min-w-0 space-y-6">
              <div className="surface-card p-8 sm:p-10">
                <span className="rounded-full bg-[var(--color-red)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                  Contact Us
                </span>
                <h1 className="mt-5 text-5xl text-[var(--color-navy)] sm:text-6xl">
                  Talk to Us About Your Team&rsquo;s Kit
                </h1>
                <p className="mt-5 text-lg">
                  You can order straight from the site and pay online, against a
                  PayPal invoice we email once you approve your design proof — but plenty of
                  programs would rather talk first, and this is where that starts. Tell us the roster count, your colors
                  and the date you need the uniforms on the field, and the reply comes back
                  with a written quote and a free design mockup — normally within 24 hours,
                  and always within one business day.
                </p>

                <div className="mt-8 space-y-4">
                  {channels.map((channel) => (
                    <a
                      key={channel.label}
                      href={channel.href}
                      {...(channel.external ? { target: "_blank", rel: "noopener" } : {})}
                      className="flex gap-4 rounded-[22px] border border-[var(--color-border)] bg-white p-5 transition hover:border-[var(--color-red)] hover:shadow-[0_14px_34px_rgba(11,31,58,0.08)]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-[var(--color-gold)]">
                        <channel.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
                          {channel.label}
                        </span>
                        <span className="mt-1 block break-words text-lg font-semibold text-[var(--color-navy)]">
                          {channel.value}
                        </span>
                        <span className="mt-2 block text-sm text-[var(--color-navy-soft)]">
                          {channel.note}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>

                <div className="mt-8 rounded-[22px] border border-[var(--color-border)] bg-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
                    Mailing address
                  </p>
                  <address className="mt-3 not-italic">
                    {company.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>

              <article className="surface-card p-8 sm:p-10">
                <h2 className="text-3xl text-[var(--color-navy)]">What to Put in a First Message</h2>
                <p className="mt-4">
                  None of this is required to get a reply, but the more of it you send, the
                  more the first response can be an actual quote instead of a list of
                  questions. If you would rather build the spec visually, the{" "}
                  <Link href="/design-your-uniform/" className="font-semibold text-[var(--color-red)]">
                    online football uniform designer
                  </Link>{" "}
                  collects all six of these and sends them through in one tap.
                </p>
                <dl className="mt-6 space-y-4">
                  {include.map(([label, text]) => (
                    <div key={label} className="rounded-[20px] border border-[var(--color-border)] bg-white p-5">
                      <dt className="font-semibold text-[var(--color-navy)]">{label}</dt>
                      <dd className="mt-1 text-sm text-[var(--color-navy-soft)]">{text}</dd>
                    </div>
                  ))}
                </dl>
              </article>

              <article className="surface-card p-8 sm:p-10">
                <h2 className="text-3xl text-[var(--color-navy)]">When You Will Hear Back</h2>
                <p className="mt-4">
                  Quote requests are answered within one business day, and the free mockup
                  normally lands within 24 hours of the brief. Nothing is charged for either,
                  and nothing goes into production until you have approved the proof. Before
                  you collect sizes from the roster, it is worth sending parents{" "}
                  <Link href="/size-chart/" className="font-semibold text-[var(--color-red)]">
                    the youth and adult size chart
                  </Link>{" "}
                  so the size sheet comes back once rather than three times.
                </p>
              </article>
            </div>

            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[36px] bg-[linear-gradient(135deg,#08172c_0%,#0b1f3a_42%,#12305e_100%)] p-6 shadow-[0_28px_70px_rgba(11,31,58,0.26)] sm:p-8">
                <span className="eyebrow">Free Quote</span>
                <h2 className="mt-5 text-4xl text-white">Request a Quote and a Free Mockup</h2>
                <p className="mt-4 text-white/75">
                  Ten pieces per design is the minimum. The mockup and the quote are both
                  free, and neither commits you to anything.
                </p>
                <div className="mt-6">
                  <QuoteForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ExtraFaqs route="/contact-us/" />
    </>
  );
}
