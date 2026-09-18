import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAllProducts, getProductBySlug } from "@/lib/catalog";
import { company, SITE_URL } from "@/lib/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About Texas Football Uniforms | How We Build Team Kits",
  description:
    "What we make, how an order runs, the 10-piece minimum, fabrics, decoration and sizing — a plain account of how Texas Football Uniforms outfits Texas programs.",
  path: "/about-us/",
});

/**
 * Everything on this page has to be checkable against something the site
 * already publishes: a product blueprint in catalog.ts, a city in
 * locations.ts, or the quote flow in /api/lead. There is deliberately no
 * founding year, no staff roster, no factory address, no order volume and no
 * client name, because none of those exist in the owner's data. Where one
 * would help, the gap is left rather than filled.
 */

const familyLabels: Record<string, string> = {
  uniform: "Full uniforms and kits",
  jersey: "Jerseys",
  outerwear: "Sideline and off-field layers",
  accessory: "Practice gear and accessories",
};

const familyOrder = ["uniform", "jersey", "outerwear", "accessory"] as const;

const orderSteps = [
  {
    title: "You send the brief",
    text: "Roster count, team colors, the garments you want and the date you need them on the field. Artwork helps but is not required — a photo of last year's jersey is enough to work from.",
  },
  {
    title: "We send a written quote and a free mockup",
    text: "Normally within 24 hours. The quote prices your actual roster; the mockup shows your colors, numbers and logo placement on the garment you picked. Neither costs anything.",
  },
  {
    title: "You approve the proof",
    text: "Nothing is printed before you sign off. Revisions happen at this stage, which is the cheap place for them — color values, number size, nameplate spacing and logo position are all still editable.",
  },
  {
    title: "Production runs and the order ships",
    text: "Most jerseys are 2 to 3 weeks after approval. Full uniform programs, warm-up suits and college builds run 3 to 4 weeks. The quote states which window applies to your order.",
  },
];

const decoration = [
  ["Dye sublimation", "The default on jerseys and uniform sets. Dye is gassed into the polyester, so the graphic is part of the fabric and has no edge to crack, peel or lift in a wash cycle. Unlimited colors, full-bleed designs, no per-color charge."],
  ["Tackle twill", "Stitched fabric letters and numbers, available on American football jerseys, team kits, high school uniforms and college uniforms. Chosen for weight and a traditional varsity look rather than for cost."],
  ["Heat transfer", "Used where sublimation cannot go — glove backhands, padded shirts, shorts and fan jerseys. Also the practical option for a late roster change on an otherwise finished order."],
  ["Embroidery", "Standard on coaches polos, quarter-zips and sideline jackets, where dimensional stitching reads as staff apparel rather than as a printed tee."],
  ["Knit-in patterns", "Socks only. Color and logo detail are knitted into the sock rather than applied to it, because nothing printed survives a cleat and a pad strap."],
];

const fabrics = [
  ["220gsm performance polyester with stretch mesh panels", "Game uniforms, team kits, high school and college builds"],
  ["Heavyweight polyester knit with mesh ventilation zones", "Adult jerseys built for contact and repeated washing"],
  ["Lightweight birdseye and ultralight mesh polyester", "7-on-7, summer camp and lightweight jerseys for Texas heat"],
  ["Double-layer breathable polyester", "Reversible jerseys, where the second face has to block the first color"],
  ["Durable mesh practice polyester", "Practice jerseys and pinnies washed daily through two-a-days"],
  ["Brushed tricot, performance fleece and softshell", "Warm-up suits, hoodies and sideline jackets"],
  ["Compression polyester-spandex with EVA pad zones", "Padded shirts worn under the game jersey"],
];

const notDone = [
  "We do not sell single pieces at retail. Everything is made to order against a roster, and the smallest order is 10 of one design.",
  "We do not sell licensed fan merchandise. There is no NFL, no college licensing and no reselling of another brand's gear — every garment carries your program's own identity.",
  "We do not take payment on this website. There is no cart and no checkout. Quotes are issued in writing and settled with you directly, which is also why no card details are ever collected here.",
  "We do not print artwork we have no right to print. If a logo belongs to a school district, a league or a third party, we need the program's confirmation that it may be reproduced.",
];

export default function AboutUsPage() {
  const products = getAllProducts();
  const heroProduct = getProductBySlug("high-school-football-uniforms") ?? products[0];

  const grouped = familyOrder.map((family) => ({
    family,
    label: familyLabels[family],
    items: products.filter((product) => product.productFamily === family),
  }));

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about-us/#aboutpage`,
    url: `${SITE_URL}/about-us/`,
    name: "About Texas Football Uniforms",
    description:
      "How Texas Football Uniforms makes custom football uniforms for Texas programs: product range, order process, minimum order, fabrics, decoration methods, sizing and service area.",
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: encodeURI(`${SITE_URL}${heroProduct.heroImage}`),
    },
    mainEntity: { "@id": `${SITE_URL}/#organization` },
    about: { "@id": `${SITE_URL}/#organization` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "About Us", item: `${SITE_URL}/about-us/` },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <section className="section-space">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About Us", path: "/about-us/" }]} />

          <div className="mt-6 grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="surface-card overflow-hidden">
              <Image
                src={heroProduct.heroImage}
                alt="Custom high school football uniforms made for a Texas program"
                width={1200}
                height={1400}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/5] w-full object-cover"
                priority
              />
            </div>

            <div className="surface-card p-8 sm:p-10">
              <span className="rounded-full bg-[var(--color-red)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                About Us
              </span>
              <h1 className="mt-5 text-5xl text-[var(--color-navy)] sm:text-6xl">
                We Make Football Uniforms to Order for Texas Programs
              </h1>
              <p className="mt-6 text-lg">
                Texas Football Uniforms is a custom teamwear operation working out of Dallas
                and serving football programs across the state. Nothing here is stock. Every
                garment is cut, printed and sewn against a specific roster, in that program&rsquo;s
                colors, with that program&rsquo;s names and numbers on it.
              </p>
              <p className="mt-5">
                The way we work is quote-first. You tell us what the team needs, we price it
                and draw it, you approve it, and then it is made. There is no cart on this
                site and no checkout, which is a deliberate choice rather than a missing
                feature: a 34-player varsity order with a mixed size run and a district logo
                is not a thing anybody should be buying through a shopping basket.
              </p>
              <div className="mt-8 rounded-[24px] border border-[var(--color-border)] bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
                  Reach us
                </p>
                <p className="mt-3">{company.addressLines.join(", ")}</p>
                <p className="mt-1">
                  <a href={company.phoneHref} className="font-semibold text-[var(--color-red)]">
                    {company.phoneDisplay}
                  </a>
                </p>
                <p className="mt-1">
                  <a href={`mailto:${company.email}`} className="font-semibold text-[var(--color-red)]">
                    {company.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">What We Make</h2>
              <p className="mt-5">
                The catalog runs to {products.length} product families, and they divide into
                four jobs a program needs filled: what the team plays in, what it practices
                in, what the staff and the stands wear, and the small pieces that finish the
                look. Each family has its own page with its own fabric, sizing, minimum and
                starting price, and every one of them can be seen together on the{" "}
                <Link href="/all-categories/" className="font-semibold text-[var(--color-red)]">
                  full football uniform catalog
                </Link>
                .
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {grouped.map((group) => (
                  <div key={group.family} className="rounded-[22px] border border-[var(--color-border)] bg-white p-6">
                    <h3 className="text-2xl text-[var(--color-navy)]">{group.label}</h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-red)]">
                      {group.items.length} product families
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-[var(--color-navy-soft)]">
                      {group.items.map((item) => (
                        <li key={item.slug}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">How an Order Actually Runs</h2>
              <p className="mt-5">
                Four stages, and only one of them needs anything from you after the brief.
                Coaches usually want to know where the decision points are, so here they are
                in order. If you would rather show us than describe it, you can pick the
                garment, colors and decoration yourself in{" "}
                <Link href="/design-your-uniform/" className="font-semibold text-[var(--color-red)]">
                  the online uniform designer
                </Link>{" "}
                and send that through as your brief.
              </p>
              <ol className="mt-8 space-y-5">
                {orderSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] font-display text-2xl text-[var(--color-gold)]">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-2xl text-[var(--color-navy)]">{step.title}</h3>
                      <p className="mt-2">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>

            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">The Minimum Is 10 Per Design</h2>
              <p className="mt-5">
                Ten pieces of one design is the floor on every product on this site — ten
                jerseys, ten sets, ten pairs, ten hoodies. It is a production minimum, not a
                sales target: a sublimation run has to be laid out, printed and pressed once
                whether it produces four jerseys or forty, and below ten the setup costs more
                than the garments.
              </p>
              <p className="mt-5">
                Mixed sizes count toward the same ten. A youth squad ordering three YM, four
                YL and three YXL has met the minimum with a single design, and so has a
                varsity roster spreading ten jerseys across adult M to 3XL. What does not
                combine is two different designs — a home jersey and an away jersey are two
                designs, and each needs its own ten.
              </p>
              <p className="mt-5">
                The starting price published on every product page is the price at that
                ten-piece minimum, which is the highest tier there is. Larger rosters pay less
                per piece, and the written quote is where that lands for your actual numbers.
              </p>
            </article>

            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">How the Graphics Go On</h2>
              <p className="mt-5">
                Five decoration methods, chosen per garment rather than per order, because
                what works on a game jersey fails on a glove and what works on a jacket looks
                wrong on a pinny. Most Texas programs end up with full-dye work on the field
                gear, which is what{" "}
                <Link href="/sublimated-football-jerseys/" className="font-semibold text-[var(--color-red)]">
                  our sublimated football jerseys
                </Link>{" "}
                are built around, and embroidery on the staff layers.
              </p>
              <dl className="mt-8 space-y-5">
                {decoration.map(([method, text]) => (
                  <div key={method} className="rounded-[22px] border border-[var(--color-border)] bg-white p-6">
                    <dt className="text-2xl text-[var(--color-navy)]">{method}</dt>
                    <dd className="mt-2">{text}</dd>
                  </div>
                ))}
              </dl>
            </article>

            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">The Fabrics We Build In</h2>
              <p className="mt-5">
                Fabric is decided before design, not after, because weight changes how a
                garment behaves in August in Texas more than any graphic decision does. These
                are the builds the catalog runs on, and the product page for each item states
                which one it uses. Programs that practice in one weight and play in another
                often order{" "}
                <Link href="/football-practice-jerseys/" className="font-semibold text-[var(--color-red)]">
                  a separate practice jersey run
                </Link>{" "}
                rather than putting game gear through two-a-days.
              </p>
              <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--color-border)]">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[rgba(11,31,58,0.03)]">
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]">
                        Build
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]">
                        Where it is used
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fabrics.map(([build, use]) => (
                      <tr key={build} className="border-b border-[var(--color-border)] last:border-b-0">
                        <th className="px-5 py-4 text-sm font-semibold text-[var(--color-navy)]">{build}</th>
                        <td className="px-5 py-4 text-sm text-[var(--color-navy-soft)]">{use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">Sizing Across a Whole Roster</h2>
              <p className="mt-5">
                The size run reaches from youth XS to adult 5XL, and the exact ceiling varies
                by garment — jerseys and team kits go the full distance, while 7-on-7 and flag
                builds stop at adult 4XL and youth-block products stop at youth XL. Body
                measurements for every size sit on{" "}
                <Link href="/size-chart/" className="font-semibold text-[var(--color-red)]">
                  the football uniform size chart
                </Link>
                , which is the page to send to parents before you collect a size sheet.
              </p>
              <p className="mt-5">
                Two things catch programs out. The first is pads: a game jersey worn over
                shoulder pads needs more room through the chest than the same player&rsquo;s
                street size, and the chart notes where to allow for it. The second is growth —
                youth rosters change shape between the size sheet and the first game, so a
                small buffer of common sizes saves a rush reorder in week three.
              </p>
            </article>

            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">Who We Outfit</h2>
              <p className="mt-5">
                The work splits fairly evenly across six kinds of buyer. High school programs
                ordering varsity and JV against the UIL calendar are the largest single group,
                and the{" "}
                <Link href="/high-school-football-uniforms/" className="font-semibold text-[var(--color-red)]">
                  high school football uniform range
                </Link>{" "}
                is built around that calendar. The rest are youth and rec leagues on the youth
                block, 7-on-7 clubs running the summer circuit, flag programs from NFL Flag
                through UIL girls&rsquo; flag, college club and camp teams, and coaching staffs
                who want the sideline to match the field.
              </p>
              <p className="mt-5">
                What those groups have in common is that they order for a roster, not for a
                person, and they order against a date. That is the shape of every process on
                this site — the minimum, the mockup, the approval step and the production
                windows are all designed for somebody buying on behalf of a team.
              </p>
            </article>

            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">Where We Deliver</h2>
              <p className="mt-5">
                The whole state, with a dedicated page for 23 Texas cities covering the DFW
                Metroplex, Greater Houston, San Antonio, Central Texas, the Panhandle, West
                Texas, the Gulf Coast and the Rio Grande Valley. Each one carries the local
                districts, leagues and transit days that apply there, and they are all listed
                on{" "}
                <Link href="/locations/" className="font-semibold text-[var(--color-red)]">
                  the Texas cities we serve
                </Link>
                . If your town is not one of the 23, it does not change anything about the
                order — the pages exist because delivery timing differs across a state this
                size, not because service does.
              </p>
            </article>

            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">What We Do Not Do</h2>
              <p className="mt-5">
                Being clear about the boundaries saves everybody a phone call. Four things
                fall outside what this business does, and they come up often enough to be
                worth stating plainly.
              </p>
              <ul className="mt-6 space-y-4">
                {notDone.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-red)]" />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-card p-8 sm:p-10">
              <h2 className="text-4xl text-[var(--color-navy)]">Start a Conversation</h2>
              <p className="mt-5">
                A first message does not need to be complete. A rough roster count, your
                colors and the date you need the kit is enough to get a quote and a mockup
                moving, and the rest can be settled while the artwork is being drawn. Phone,
                WhatsApp, email and the quote form all reach the same desk, and{" "}
                <Link href="/contact-us/" className="font-semibold text-[var(--color-red)]">
                  the contact page
                </Link>{" "}
                lists what to include so the first reply can carry real numbers.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
