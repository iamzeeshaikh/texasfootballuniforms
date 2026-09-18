import { BadgeDollarSign, CalendarClock, PencilRuler, Users2 } from "lucide-react";

const factIcons = [BadgeDollarSign, Users2, CalendarClock, PencilRuler];

/**
 * The four buying facts that sit directly under an H1: starting price,
 * minimum, turnaround, free mockup.
 *
 * Every competitor (Wooter, Boombah, GameBreaker, BSN, Garb) publishes a unit
 * price above the fold. This site published none, while its Product schema
 * carried numbers that appeared nowhere on the page — 35 product-snippet
 * impressions and no clicks. The strip and the schema now read the same
 * number from `product.fromPrice`.
 */
export function PriceFacts({ facts }: { facts: string[] }) {
  return (
    <div
      data-price-facts
      className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3 rounded-[22px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)] px-5 py-4 shadow-[0_10px_24px_rgba(11,31,58,0.05)]"
    >
      {facts.map((fact, index) => {
        const Icon = factIcons[index % factIcons.length];
        return (
          <span key={fact} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden="true" className="hidden pr-1 text-[var(--color-border)] sm:inline">
                ·
              </span>
            ) : null}
            <Icon className="h-4 w-4 shrink-0 text-[var(--color-red)]" />
            <span
              className={
                index === 0
                  ? "text-base font-semibold text-[var(--color-navy)]"
                  : "text-sm font-semibold text-[var(--color-navy-soft)]"
              }
            >
              {fact}
            </span>
          </span>
        );
      })}
    </div>
  );
}

type PriceNotesProps = {
  /** "jersey", "set", "pair" — the unit the starting price is quoted in. */
  unit: string;
  minimum: number;
};

/**
 * "What changes the price". A single "from" number is only honest if the page
 * says what moves it, and says which quantity the number belongs to — ours is
 * the price at the minimum, which is the most expensive tier, not the least.
 */
export function PriceNotes({ unit, minimum }: PriceNotesProps) {
  return (
    <section className="surface-card mt-8 p-8" id="what-changes-the-price">
      <h2 className="text-4xl text-[var(--color-navy)]">What Changes the Price</h2>
      <p className="mt-4">
        The price shown is the starting price per {unit} at our {minimum}-piece minimum, which is
        the smallest order we produce and therefore the highest per-{unit} tier. Three things move
        it from there, and a quote prices all three together.
      </p>
      <ul className="mt-6 space-y-4">
        {[
          {
            title: "Quantity",
            text: `Per-${unit} cost falls as the run grows. A ${minimum}-piece order and a 50-piece order are printed the same way, but setup is spread across more pieces, so the larger roster pays less per ${unit}. Tell us your real roster count and we quote that tier, not the minimum.`,
          },
          {
            title: "Decoration",
            text: "Full sublimation is included in the starting price. Tackle twill numbering, embroidery, applique, sewn nameplates and captain patches are stitched work on top of it, and each one adds labor per piece.",
          },
          {
            title: "Fabric",
            text: "The starting price is our standard performance polyester. Heavier game-weight knits, 4-way stretch compression fabric, dazzle finishes and integrated pad panels cost more per yard and change the number.",
          },
        ].map((item) => (
          <li key={item.title}>
            <p className="text-base font-semibold text-[var(--color-navy)]">{item.title}</p>
            <p className="mt-1">{item.text}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-[var(--color-navy-soft)]">
        Prices are in USD and quoted per piece before tax, and shipping is free on every order.
        Production is 1 to 2 weeks after you approve the design. We take no payment on this site: you get a written
        quote and a free mockup first, and nothing is produced until you approve the design.
      </p>
    </section>
  );
}
