import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { buildReturnPolicySchema, RETURN_POLICY_PATH } from "@/lib/catalog";
import { createMetadata } from "@/lib/seo";
import { company, SITE_URL } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Return Policy | Texas Football Uniforms",
  description:
    "How returns, remakes and refunds work on custom football uniforms: no change-of-mind returns, proof approval is final, our errors are remade or refunded, claims within 7 days.",
  path: RETURN_POLICY_PATH,
});

/**
 * /return-policy/ — the page the Product schema had been pointing at for
 * months without it existing.
 *
 * Every product page on this site publishes
 * `hasMerchantReturnPolicy: MerchantReturnNotPermitted`, and /return-policy/,
 * /returns/ and /refund-policy/ were all 404. That is a strong claim to Google
 * with nothing behind it, and with the PayPal invoice now the only way an order
 * is settled it is also the document a PayPal dispute is judged against.
 *
 * The terms are not drafted here. They are the terms the owner already
 * publishes on floridabasketballjerseys.com/refund-policy/ and
 * thebaseballjerseys.com/return-policy/, said in this site's voice: custom work
 * is not returnable for change of mind, proof approval is the decision point,
 * our own errors are remade or refunded in full, claims come with photos inside
 * 7 days of delivery, and a refund goes back through PayPal to whatever paid the
 * invoice. Nothing was softened and nothing was hardened.
 *
 * The one number this site had not published before is the 5 to 10 business days
 * a refund takes to process, which is Florida's published figure.
 */
const LAST_UPDATED = "September 28, 2026";

/** The four things a coach needs off this page in ten seconds. */
const summary = [
  {
    title: "No change-of-mind returns",
    text: "Every jersey carries your names, numbers and colors. It cannot be resold, so it cannot be returned because the order was reconsidered.",
  },
  {
    title: "Your proof approval is the decision",
    text: "Nothing is printed until you approve the mockup. Once you approve it and production starts, the design is final.",
  },
  {
    title: "Our mistake, our cost",
    text: "Wrong item, decoration that does not match the approved artwork, wrong sizes against your own size sheet, a defect, transit damage — we remake it, correct it, or refund it.",
  },
  {
    title: "Seven days, with photos",
    text: "Tell us inside 7 calendar days of delivery and send photos. We reply within one business day.",
  },
];

/**
 * Written as a table on purpose. The same list in prose is what makes a buyer
 * guess, and a guess is what turns into a dispute.
 */
type CoverageRow = {
  situation: string;
  verdict: "Covered" | "Not covered" | "Case by case";
  outcome: string;
};

const coverage: CoverageRow[] = [
  {
    situation: "The wrong item arrived — a different garment, fabric or cut than the one you ordered",
    verdict: "Covered",
    outcome: "We remake the affected pieces at no charge, or refund them.",
  },
  {
    situation: "Names, numbers, colors or logo placement do not match the artwork you approved",
    verdict: "Covered",
    outcome: "We reprint the affected pieces against the approved proof at no charge.",
  },
  {
    situation: "The sizes shipped do not match the size sheet you submitted",
    verdict: "Covered",
    outcome: "We remake the mis-sized pieces to your submitted sheet.",
  },
  {
    situation: "A manufacturing defect — split seams, failed stitching, sublimation that cracks or peels before the gear has been worn",
    verdict: "Covered",
    outcome: "We remake the affected pieces, or refund them where a remake will not reach your date.",
  },
  {
    situation: "The shipment arrives damaged, or the carrier confirms it lost",
    verdict: "Covered",
    outcome: "We file the carrier claim and remake or refund the order once it is documented.",
  },
  {
    situation: "The order is reconsidered after approval — a color preference changed, the budget moved, the season was called off",
    verdict: "Not covered",
    outcome: "Production has already run on made-to-order goods. No return or refund.",
  },
  {
    situation: "A size was chosen that does not fit, but the gear matches the size sheet you sent",
    verdict: "Not covered",
    outcome: "We produced what was submitted. Use the size chart, or ask for the free loaner sizing kit before you order.",
  },
  {
    situation: "A misspelled name, a wrong number or a wrong color was already in the proof you approved",
    verdict: "Not covered",
    outcome: "The production is correct against the approval. A corrected run is a new order.",
  },
  {
    situation: "The roster changed after approval — a player left, a transfer arrived, numbers were reassigned",
    verdict: "Not covered",
    outcome: "Add-on pieces are quoted as a new order at the same design.",
  },
  {
    situation: "A printed color reads slightly differently than it did on a screen",
    verdict: "Not covered",
    outcome: "Screens are backlit and uncalibrated. Ask for a color reference before approval if an exact match matters.",
  },
  {
    situation: "Damage after delivery — hot machine drying, bleach, an iron on a number, normal wear across a season",
    verdict: "Not covered",
    outcome: "Not a production fault. We will still tell you how to wash and store the set.",
  },
  {
    situation: "Part of a team order is affected and the rest is correct",
    verdict: "Case by case",
    outcome: "We assess the affected pieces individually and remake or credit those, not the whole order.",
  },
];

const claimSteps = [
  {
    title: "Contact us inside 7 calendar days of delivery",
    text: `Email ${company.email} or call ${company.phoneDisplay}. The 7 days run from the date the carrier marks the order delivered, not from the date somebody opened the box.`,
  },
  {
    title: "Give us the order reference and the name on the order",
    text: "It lets us pull your approved proof and the production file for that run in one go, which is what the claim is measured against.",
  },
  {
    title: "Send photos",
    text: "One photo of the full garment and one close-up of the problem, per affected piece. For transit damage, photograph the outer box and the packaging before you throw any of it away — the carrier claim needs it.",
  },
  {
    title: "We review it against your approved proof",
    text: "We compare what arrived with the artwork you signed off and with the size sheet you submitted. You get a written answer within one business day, and we will ask for more photos if the first set is not conclusive.",
  },
  {
    title: "The remedy is applied",
    text: "A remake is usually fastest and is what we offer first, because it puts the right gear on your players. Where a remake will not reach your date, or the pieces cannot be used, we refund them.",
  },
];

const refundFacts = [
  {
    label: "One route in, one route out",
    text: "No payment is taken on this website. Every order is settled against a PayPal invoice we email after you approve the proof, so every refund is issued back through PayPal, to the account that paid that invoice. We cannot send it anywhere else.",
  },
  {
    label: "Timing",
    text: "An approved refund is processed within 5 to 10 business days. How quickly it then shows up depends on your bank, which can add a few days of its own.",
  },
  {
    label: "Partial refunds",
    text: "Where part of a team order is affected, the refund is proportional to the affected pieces.",
  },
  {
    label: "Store credit",
    text: "You can take the value as credit toward your next order instead of a refund, if that suits the program better. It does not expire.",
  },
  {
    label: "Shipping",
    text: "If the entire order is wrong because of us, everything we charged for it comes back. Where only part of an order is affected, the shipping on the original order is not refunded.",
  },
  {
    label: "Do not ship anything back until we ask",
    text: "A defect claim is a remedy, not a return. Most claims are settled from photos and the order never moves. If we do need a piece back, we arrange and pay for that shipping ourselves, and unsolicited parcels only slow the claim down.",
  },
];

const approvalChecks = [
  "Every player name, spelled the way it goes on the back",
  "Every number, and that no number is used twice",
  "Team colors, against a reference you trust rather than a screen",
  "Logo placement, size and orientation on each garment",
  "The size run — how many of each size, adding up to your roster count",
  "The shipping address, the contact phone and the date you need the gear",
];

const cancellation = [
  {
    when: "Before you approve the proof",
    text: "Cancel at any time, for any reason, at no cost. Nothing has been printed and nothing has been invoiced.",
  },
  {
    when: "After approval, before production starts",
    text: "Tell us immediately and we will stop the job if it has not been released to the floor. Your approved proof stays on file for 30 days if you want to pick it up later.",
  },
  {
    when: "Once production has started",
    text: "The order cannot be canceled or changed. Names, numbers, colors and sizes are printed into the fabric, and the invoice being due later does not extend this window.",
  },
];

const faqs = [
  {
    question: "Can I return custom football uniforms if they do not fit?",
    answer:
      "Not if the gear matches the size breakdown you submitted — each piece is made to that sheet and cannot be resold. Size from the published size chart before you order, or ask for the free loaner sizing kit and let the squad try samples on at a practice. If the sizes shipped do not match your sheet, that is our error and we remake them.",
  },
  {
    question: "What if a name is misspelled on the jerseys?",
    answer:
      "If the spelling in the proof you approved was right and the jersey is wrong, we reprint it at no charge. If the misspelling was already in the proof when you approved it, production is correct against the approval and a corrected run is a new order. That is why the proof stage exists — read every name against your roster list before you sign it off.",
  },
  {
    question: "How long do I have to report a problem?",
    answer:
      "Seven calendar days from delivery, with photos. Damaged shipments are easiest to settle if you photograph the outer box and the packaging before discarding them, because the carrier claim needs that evidence.",
  },
  {
    question: "How is a refund paid?",
    answer:
      "Through PayPal, to the account that paid the invoice. Nothing is charged on this site in the first place — an order is settled against a PayPal invoice we email once the design proof is approved — so PayPal is also the only way the money can travel back. Processing takes 5 to 10 business days.",
  },
  {
    question: "Do you take the order back if our season is canceled?",
    answer:
      "No. Once a proof is approved the garments carry your program's names, numbers and colors, so there is no resale route for them. If a season is in doubt, hold the proof rather than approving it — there is no deadline on your review and nothing is invoiced until you approve.",
  },
  {
    question: "Part of our order is fine and part is wrong. What happens?",
    answer:
      "We assess the affected pieces individually and remake or credit those. A team order is not refunded in full because some of it needs redoing, and you are not asked to wait on a complete rerun to get the correct gear.",
  },
];

const VERDICT_STYLE: Record<CoverageRow["verdict"], string> = {
  Covered: "bg-[rgba(22,101,52,0.10)] text-[#166534]",
  "Not covered": "bg-[rgba(200,16,46,0.10)] text-[var(--color-red)]",
  "Case by case": "bg-[rgba(11,31,58,0.07)] text-[var(--color-navy)]",
};

export default function ReturnPolicyPage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Return Policy",
    description:
      "Return, remake and refund terms for custom football uniforms and jerseys made to order by Texas Football Uniforms.",
    url: `${SITE_URL}${RETURN_POLICY_PATH}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    dateModified: "2026-09-28",
    // The same policy node every product Offer points at, so the page a buyer
    // reads and the claim a crawler reads cannot drift apart.
    about: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      hasMerchantReturnPolicy: buildReturnPolicySchema(),
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section className="section-space">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-6 sm:p-10">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Return Policy", path: RETURN_POLICY_PATH },
            ]}
          />
          <div className="flex items-center gap-3">
            <RotateCcw className="h-8 w-8 shrink-0 text-[var(--color-red)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
              Returns, Remakes &amp; Refunds
            </p>
          </div>
          <h1 className="mt-5 text-4xl text-[var(--color-navy)] sm:text-6xl">Return Policy</h1>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
            Last updated {LAST_UPDATED} · Applies to orders shipped within the United States
          </p>
          <p className="mt-6 text-lg">
            Everything we make is cut and printed for one program — your colors, your names, your
            numbers, your size run. There is no shelf it can go back on, so this is not a store
            return policy. It is two promises instead: you decide at the proof, and anything we get
            wrong is on us.
          </p>
          <p className="mt-4">
            Read it before you approve a mockup. Approving the proof is the point where the design
            becomes final, and it is the only point where changing your mind costs nothing.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {summary.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-[var(--color-border)] bg-white/70 p-5"
              >
                <p className="font-display text-xl uppercase tracking-[0.06em] text-[var(--color-navy)]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card mt-8 p-6 sm:p-10">
          <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">
            Why Custom Teamwear Works Differently
          </h2>
          <p className="mt-4">
            A stock jersey is returnable because the next buyer wants the same thing. A sublimated
            jersey with <span className="font-semibold text-[var(--color-navy)]">RODRIGUEZ 58</span>{" "}
            dyed into it has exactly one customer. Production starts the moment you approve the
            proof, and from that moment the garment has no second life.
          </p>
          <p className="mt-4">
            So we spend the effort earlier instead. A free digital mockup goes out before anything is
            printed, it is yours to sit on for as long as you need, and the answers you give us — the
            spelling, the numbers, the size sheet — are what we build to. That is also why the list
            below splits the way it does: what you chose is yours, and what we executed is ours.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Nothing is printed before you approve a proof in writing.",
              "Nothing is invoiced before you approve a proof either, so canceling before that stage costs nothing.",
              "After approval, the names, numbers, colors and size breakdown are locked.",
              "A production error, a defect or transit damage is ours to fix, whatever stage we are at.",
            ].map((line) => (
              <li key={line} className="flex gap-3 text-[15px] leading-7 text-[var(--color-navy-soft)]">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-red)]"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-card mt-8 p-6 sm:p-10">
          <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">What We Cover</h2>
          <p className="mt-3 text-sm text-[var(--color-navy-soft)]">
            Read down the left column to find your situation. Anything marked covered is remade or
            refunded at no cost to your program.
          </p>
          {/* One table, two shapes. From `sm` up it is a three-column table with
              the usual horizontal scroll guard. Below that the cells go to
              `display: block` so each situation stacks into a card — three
              columns inside 328px would otherwise mean a coach swiping the page
              sideways to find out whether their problem is covered. */}
          <div className="mt-6 rounded-[24px] border border-[var(--color-border)] sm:overflow-x-auto">
            <table className="w-full border-collapse text-left sm:min-w-[38rem]">
              <caption className="sr-only">
                Situations covered and not covered by the Texas Football Uniforms return policy
              </caption>
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-[var(--color-border)] bg-[rgba(11,31,58,0.03)]">
                  <th
                    scope="col"
                    className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]"
                  >
                    Situation
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]"
                  >
                    What happens
                  </th>
                </tr>
              </thead>
              <tbody>
                {coverage.map((row) => (
                  <tr
                    key={row.situation}
                    className="block border-b border-[var(--color-border)] align-top last:border-b-0 sm:table-row"
                  >
                    <th
                      scope="row"
                      className="block px-5 pt-5 text-left text-sm font-semibold text-[var(--color-navy)] sm:table-cell sm:py-4"
                    >
                      {row.situation}
                    </th>
                    <td className="block px-5 pt-3 sm:table-cell sm:py-4">
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${VERDICT_STYLE[row.verdict]}`}
                      >
                        {row.verdict}
                      </span>
                    </td>
                    <td className="block px-5 pt-2 pb-5 text-sm text-[var(--color-navy-soft)] sm:table-cell sm:py-4">
                      {row.outcome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="surface-card mt-8 p-6 sm:p-10">
          <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">How To File A Claim</h2>
          <p className="mt-4">
            Five steps, and the first one is the one with a clock on it. Claims raised after 7
            calendar days from delivery cannot be assessed, because by then we can no longer tell a
            production fault from a season of use.
          </p>
          <ol className="mt-6 space-y-5">
            {claimSteps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-sm font-semibold text-[var(--color-gold)]">
                  {index + 1}
                </span>
                <div>
                  <p className="text-base font-semibold text-[var(--color-navy)]">{step.title}</p>
                  <p className="mt-1">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="surface-card p-6 sm:p-8">
            <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">How A Refund Is Paid</h2>
            <dl className="mt-6 space-y-5">
              {refundFacts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-7 text-[var(--color-navy-soft)]">
                    {fact.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-8">
            <div className="surface-card p-6 sm:p-8">
              <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">
                Check These Before You Approve
              </h2>
              <p className="mt-3 text-sm text-[var(--color-navy-soft)]">
                Six things. Share the proof with your coaching staff and read them against your
                roster list — there is no time limit on your review.
              </p>
              <ul className="mt-5 space-y-3">
                {approvalChecks.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-[15px] leading-7 text-[var(--color-navy-soft)]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card p-6 sm:p-8">
              <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">Cancellations</h2>
              <dl className="mt-5 space-y-4">
                {cancellation.map((item) => (
                  <div key={item.when}>
                    <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]">
                      {item.when}
                    </dt>
                    <dd className="mt-1.5 text-[15px] leading-7 text-[var(--color-navy-soft)]">
                      {item.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="surface-card mt-8 p-6 sm:p-10">
          <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">Return Policy FAQs</h2>
          <div className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-xl text-[var(--color-navy)] sm:text-2xl">{faq.question}</h3>
                <p className="mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] leading-7 text-[var(--color-navy-soft)]">
            Sizing is the thing that decides most of this, so use the{" "}
            <Link
              href="/size-chart/"
              className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
            >
              football uniform size chart
            </Link>{" "}
            before you submit a size sheet. The wider ordering terms are in our{" "}
            <Link
              href="/terms-conditions/"
              className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
            >
              terms and conditions
            </Link>
            , and what we do with your details is in the{" "}
            <Link
              href="/privacy-policy/"
              className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
            >
              privacy policy
            </Link>
            .
          </p>
        </div>

        <div className="surface-card mt-8 p-6 sm:p-10">
          <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">Something Wrong? Tell Us</h2>
          <p className="mt-4">
            One person handles every claim here, and photos get it settled fastest. Email is best
            because you can attach them.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <a
              href={`mailto:${company.email}?subject=Order%20issue`}
              className="rounded-[22px] border border-[var(--color-border)] bg-white/70 p-5 transition hover:border-[var(--color-red)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
                Email
              </p>
              <p className="mt-1.5 break-words text-sm font-semibold text-[var(--color-navy)]">
                {company.email}
              </p>
            </a>
            <a
              href={company.phoneHref}
              className="rounded-[22px] border border-[var(--color-border)] bg-white/70 p-5 transition hover:border-[var(--color-red)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
                Phone
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[var(--color-navy)]">
                {company.phoneDisplay}
              </p>
            </a>
            <div className="rounded-[22px] border border-[var(--color-border)] bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
                Mailing address
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[var(--color-navy)]">
                {company.addressLines.join(", ")}
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-[var(--color-navy-soft)]">
            Please do not ship anything back before we have answered you. If a piece has to come
            back, we arrange the shipping.
          </p>
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
