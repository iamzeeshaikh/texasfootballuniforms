import type { Metadata } from "next";
import Link from "next/link";
import { Ruler } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductLeadForm } from "@/components/product-lead-form";
import { createMetadata } from "@/lib/seo";
import { assertSizeChartRows } from "@/lib/sizes";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Football Uniform Size Chart | Youth XS to Adult 5XL | Texas",
  description:
    "Size charts for custom football jerseys, pants and warm-ups, youth XS to adult 5XL, plus a free loaner sizing kit. Min 10 per design, free 24-hour mockup.",
  path: "/size-chart/",
});

/**
 * Every competitor publishes a size chart and this URL was a 404. It is also
 * the page a coach looks for between the mockup and the order, which is
 * exactly where orders stall.
 *
 * The numbers are body measurements, not garment measurements: a coach
 * measures a player and reads across. Garment specs vary by cut, which is why
 * the page says so and offers the loaner sizing kit rather than pretending one
 * table settles it.
 */
const jerseySizes: [string, string, string, string][] = [
  ["Youth XS", "26–28", "20", "6–8"],
  ["Youth S", "28–30", "21", "8–10"],
  ["Youth M", "30–32", "22", "10–12"],
  ["Youth L", "32–34", "23", "12–14"],
  ["Youth XL", "34–36", "24", "14–16"],
  ["Adult S", "34–36", "27", "—"],
  ["Adult M", "38–40", "28", "—"],
  ["Adult L", "42–44", "29", "—"],
  ["Adult XL", "46–48", "30", "—"],
  ["Adult 2XL", "50–52", "31", "—"],
  ["Adult 3XL", "54–56", "32", "—"],
  ["Adult 4XL", "58–60", "33", "—"],
  ["Adult 5XL", "62–64", "34", "—"],
];

const pantSizes: [string, string, string, string][] = [
  ["Youth XS", "20–22", "26–28", "11"],
  ["Youth S", "22–24", "28–30", "12"],
  ["Youth M", "24–26", "30–32", "13"],
  ["Youth L", "26–28", "32–34", "14"],
  ["Youth XL", "28–30", "34–36", "15"],
  ["Adult S", "28–30", "34–36", "16"],
  ["Adult M", "32–34", "38–40", "17"],
  ["Adult L", "36–38", "42–44", "18"],
  ["Adult XL", "40–42", "46–48", "18"],
  ["Adult 2XL", "44–46", "50–52", "19"],
  ["Adult 3XL", "48–50", "54–56", "19"],
  ["Adult 4XL", "52–54", "58–60", "20"],
  ["Adult 5XL", "56–58", "62–64", "20"],
];

const warmUpSizes: [string, string, string, string][] = [
  ["Youth XS", "26–28", "22", "28"],
  ["Youth S", "28–30", "23", "30"],
  ["Youth M", "30–32", "24", "32"],
  ["Youth L", "32–34", "25", "34"],
  ["Youth XL", "34–36", "26", "36"],
  ["Adult S", "34–36", "28", "38"],
  ["Adult M", "38–40", "29", "39"],
  ["Adult L", "42–44", "30", "40"],
  ["Adult XL", "46–48", "31", "41"],
  ["Adult 2XL", "50–52", "32", "42"],
  ["Adult 3XL", "54–56", "33", "43"],
  ["Adult 4XL", "58–60", "34", "44"],
  ["Adult 5XL", "62–64", "35", "45"],
];

/**
 * The cart's size grid offers exactly the sizes in `SIZE_RUN`, and the only
 * reason a buyer can trust that grid is that this page describes the same
 * sizes. These three calls run at build time, so adding a row here without
 * adding it to src/lib/sizes.ts fails the build rather than shipping a cart
 * that offers a size the chart never measured.
 */
assertSizeChartRows("Jersey Size Chart", jerseySizes.map((row) => row[0]));
assertSizeChartRows("Football Pants Size Chart", pantSizes.map((row) => row[0]));
assertSizeChartRows("Warm-Up and Jacket Size Chart", warmUpSizes.map((row) => row[0]));

const howToMeasure = [
  {
    title: "Chest",
    text: "Measure around the fullest part of the chest, under the arms, with the tape level and the player's arms down. Do not pull it tight. For a player who will wear shoulder pads under the jersey, add two inches to the reading before you size.",
  },
  {
    title: "Body length",
    text: "From the high point of the shoulder, next to the collar, straight down to where the player wants the hem to sit. This is the measurement that decides whether a jersey tucks comfortably or rides up.",
  },
  {
    title: "Waist",
    text: "Around the natural waist where the pants will sit, not around the hips and not over the belt line of the shorts they are wearing. Football pants sit higher than casual trousers.",
  },
  {
    title: "Hip",
    text: "The fullest point around the seat, standing with feet together. It matters more than waist on integrated pants because the pad pockets sit across the hip.",
  },
  {
    title: "Inseam",
    text: "From the crotch seam down the inside of the leg to just above the knee for game pants, or to the ankle for warm-up pants. Game pants are meant to end above the knee pad.",
  },
  {
    title: "Sleeve",
    text: "From the center back of the neck, across the shoulder and down the outside of the arm to the wrist, with the arm slightly bent. Only needed for warm-up jackets and coaches uniforms.",
  },
];

const faqs = [
  {
    question: "What sizes do you make football uniforms in?",
    answer:
      "Youth XS through adult 5XL across jerseys, pants and warm-ups. Mixed sizes count toward the same 10-piece minimum, so one order can cover a roster spanning a Youth S and an Adult 4XL.",
  },
  {
    question: "Should I size up for shoulder pads?",
    answer:
      "Add two inches to the chest measurement before you read the jersey chart if the jersey goes over pads. Practice jerseys and 7v7 tops are worn without pads and are sized to the measured chest.",
  },
  {
    question: "Can we try sizes before we order?",
    answer:
      "Yes. We send a loaner sizing kit — sample garments in a spread of sizes — for teams to pass around at a practice or a sign-up night. It goes back to us afterward, and it removes almost every exchange request later in the season.",
  },
  {
    question: "What if a player is between sizes?",
    answer:
      "Size up for game jerseys worn over pads and for youth players who will grow into the garment across a season. Size down for compression and 7v7 tops, which are meant to fit close. If you are unsure on a specific player, put both measurements on the size sheet and we will advise.",
  },
  {
    question: "Are these garment measurements or body measurements?",
    answer:
      "Body measurements. Measure the player and read across to the size. Finished garment dimensions vary by cut — a pro-cut jersey is tapered where a standard cut is not — so we confirm the garment spec for your chosen style during the mockup stage.",
  },
  {
    question: "Can we mix youth and adult sizes in one order?",
    answer:
      "Yes, and most youth and high school orders do. The minimum is 10 per design, not 10 per size, so a 22-player roster spanning Youth M to Adult XL is one job.",
  },
];

function SizeTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: [string, string, string, string][];
}) {
  return (
    <div className="surface-card p-8">
      <h2 className="text-4xl text-[var(--color-navy)]">{caption}</h2>
      <p className="mt-3 text-sm text-[var(--color-navy-soft)]">
        All measurements in inches. Measure the player, not an existing garment.
      </p>
      <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--color-border)]">
        <table className="w-full min-w-[30rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[rgba(11,31,58,0.03)]">
              {head.map((cell) => (
                <th
                  key={cell}
                  className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-[var(--color-border)] last:border-b-0">
                <th className="px-5 py-3 text-sm font-semibold text-[var(--color-navy)]">{row[0]}</th>
                {row.slice(1).map((cell, index) => (
                  <td key={index} className="px-5 py-3 text-sm text-[var(--color-navy-soft)]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SizeChartPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Football Uniform Size Chart",
    description:
      "Jersey, pants and warm-up size charts for custom football uniforms, youth XS to adult 5XL, with measuring instructions.",
    url: `${SITE_URL}/size-chart/`,
  };

  return (
    <section className="section-space">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-8 sm:p-10">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Size Chart", path: "/size-chart/" },
            ]}
          />
          <div className="flex items-center gap-3">
            <Ruler className="h-8 w-8 text-[var(--color-red)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
              Sizing
            </p>
          </div>
          <h1 className="mt-5 text-5xl text-[var(--color-navy)] sm:text-6xl">
            Football Uniform Size Chart
          </h1>
          <p className="mt-6 text-lg">
            Youth XS through adult 5XL on every garment we make. Measure the player, read across,
            and put the size on the roster sheet — mixed sizes all count toward the same 10-piece
            minimum, so a roster that spans a Youth S and an Adult 4XL is still one order.
          </p>
          <p className="mt-4">
            If you would rather not measure 30 players, ask for the free loaner sizing kit. We send
            sample garments in a spread of sizes, your squad tries them on at a practice, and the
            kit comes back to us. It is the single most reliable way to avoid exchanges once the
            season has started.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <SizeTable
            caption="Jersey Size Chart"
            head={["Size", "Chest", "Body length", "Approx. age"]}
            rows={jerseySizes}
          />
          <SizeTable
            caption="Football Pants Size Chart"
            head={["Size", "Waist", "Hip", "Inseam"]}
            rows={pantSizes}
          />
          <SizeTable
            caption="Warm-Up and Jacket Size Chart"
            head={["Size", "Chest", "Body length", "Sleeve"]}
            rows={warmUpSizes}
          />
        </div>

        <div className="surface-card mt-8 p-8 sm:p-10">
          <h2 className="text-4xl text-[var(--color-navy)]">How to Measure</h2>
          <p className="mt-4">
            A cloth tape and five minutes per player. Measure over a t-shirt, not over pads, and
            write the number down rather than the size you think it is — the size comes from the
            chart.
          </p>
          <ol className="mt-6 space-y-4">
            {howToMeasure.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-sm font-semibold text-[var(--color-gold)]">
                  {index + 1}
                </span>
                <div>
                  <p className="text-base font-semibold text-[var(--color-navy)]">{item.title}</p>
                  <p className="mt-1">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-[var(--color-navy-soft)]">
            Sizing for a specific style is confirmed at the mockup stage. Pro-cut and compression
            garments run closer to the body than a standard cut, and we will tell you which way to
            move before the order is placed rather than after it ships.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-card p-8">
            <h2 className="text-4xl text-[var(--color-navy)]">Sizing FAQs</h2>
            <div className="mt-6 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-2xl text-[var(--color-navy)]">{faq.question}</h3>
                  <p className="mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
            <p className="mt-6">
              Ready to size a roster? Start from{" "}
              <Link
                href="/high-school-football-uniforms/"
                className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
              >
                high school football uniforms
              </Link>{" "}
              or{" "}
              <Link
                href="/youth-football-uniforms/"
                className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
              >
                youth football uniforms
              </Link>
              , or{" "}
              <Link
                href="/design-your-uniform/"
                className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
              >
                design your uniform online
              </Link>{" "}
              and send us the roster with the spec.
            </p>
          </div>
          <div>
            <ProductLeadForm
              productName="Sizing Kit / Size Chart"
              heading="Request a Free Sizing Kit"
              blurb="Tell us your roster count and when you practice. We send sample garments in a spread of sizes, you try them on, and the kit comes back to us. Minimum 10 per design on the order itself."
            />
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
