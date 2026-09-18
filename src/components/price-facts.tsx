import { BadgeDollarSign, CalendarClock, Layers, PencilRuler, ShieldCheck, Sparkles, Users2 } from "lucide-react";

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
 * "What changes the price".
 *
 * A single "from" number is only honest if the page says what moves it, and
 * says which quantity the number belongs to — ours is the price at the
 * minimum, which is the most expensive tier, not the least.
 *
 * This was one block of prose with three sub-headings and nobody read it. It
 * is now three cards, one per driver, with the same facts split into scannable
 * lines. Nothing was removed and no new claim was added: every line below is
 * the sentence that was already there.
 */
export function PriceNotes({ unit, minimum }: PriceNotesProps) {
  const drivers = [
    {
      title: "Quantity",
      icon: Users2,
      summary: `Bigger roster, lower price per ${unit}.`,
      points: [
        `Per-${unit} cost falls as the run grows.`,
        `A ${minimum}-piece order and a 50-piece order are printed the same way, but setup is spread across more pieces, so the larger roster pays less per ${unit}.`,
        "Tell us your real roster count and we quote that tier, not the minimum.",
      ],
    },
    {
      title: "Decoration",
      icon: Sparkles,
      summary: "Printed is included. Stitched is added.",
      points: [
        "Full sublimation is included in the starting price.",
        "Tackle twill numbering, embroidery, applique, sewn nameplates and captain patches are stitched work on top of it, and each one adds labor per piece.",
      ],
    },
    {
      title: "Fabric",
      icon: Layers,
      summary: "Standard knit is the baseline.",
      points: [
        "The starting price is our standard performance polyester.",
        "Heavier game-weight knits, 4-way stretch compression fabric, dazzle finishes and integrated pad panels cost more per yard and change the number.",
      ],
    },
  ];

  return (
    <section className="surface-card mt-8 p-6 sm:p-8" id="what-changes-the-price">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)]">
          <BadgeDollarSign className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">What Changes the Price</h2>
      </div>
      <p className="mt-4 max-w-3xl">
        The price shown is the starting price per {unit} at our {minimum}-piece minimum, which is
        the smallest order we produce and therefore the highest per-{unit} tier. Three things move
        it from there, and a quote prices all three together.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {drivers.map((driver) => {
          const Icon = driver.icon;
          return (
            <div key={driver.title} className="price-driver">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(200,16,46,0.08)] text-[var(--color-red)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-2xl text-[var(--color-navy)]">{driver.title}</h3>
              <p className="mt-1 text-sm font-semibold text-[var(--color-red)]">{driver.summary}</p>
              <ul className="mt-3 grid gap-2.5">
                {driver.points.map((point, index) => (
                  <li key={index} className="flex gap-2 text-sm leading-6 text-[var(--color-navy-soft)]">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-6 flex items-start gap-2.5 rounded-2xl bg-[rgba(11,31,58,0.04)] px-4 py-3.5 text-sm leading-6 text-[var(--color-navy-soft)]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-navy)]" aria-hidden="true" />
        <span>
          Prices are in USD and quoted per piece before tax, and shipping is free on every order.
          Production is 1 to 2 weeks after you approve the design. No online payment: you pay cash
          on delivery or by bank transfer after we invoice you, and nothing is produced until you
          approve a free mockup.
        </span>
      </p>
    </section>
  );
}
