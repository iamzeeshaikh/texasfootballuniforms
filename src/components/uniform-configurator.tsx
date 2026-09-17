"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ARTWORK_ACCEPT, MAX_ARTWORK_BYTES, artworkTooLargeMessage, readArtwork } from "@/lib/artwork";
import { company } from "@/lib/site";

type Option = {
  id: string;
  label: string;
  hint?: string;
  /** Indicative per-player price adjustment in USD. */
  price?: number;
};

// Base prices are the same published starting prices the product pages and
// the Product schema carry (src/lib/catalog.ts `fromPrice`). The tool used to
// invent its own numbers (38 / 74 / 92), so a coach could read "$32.99 per
// jersey" at the top of the page and "$38 per player" halfway down it.
const GARMENTS: Option[] = [
  { id: "jersey", label: "Game jersey", hint: "Sublimated or cut & sew", price: 32.99 },
  { id: "jersey-pants", label: "Jersey + pants", hint: "Full game set", price: 55.99 },
  { id: "practice", label: "Practice jersey", hint: "Lightweight training top", price: 32.99 },
  { id: "full-kit", label: "Full uniform kit", hint: "Jersey, pants, socks", price: 55.99 },
  { id: "warmup", label: "Warm-up / shell", hint: "Sideline layer", price: 59.99 },
  { id: "7v7", label: "7v7 / flag set", hint: "Reversible or single", price: 49.99 },
  { id: "reversible", label: "Reversible jersey", hint: "Two colors, one jersey", price: 66.99 },
];

const FABRICS: Option[] = [
  { id: "mesh", label: "Poly mesh", hint: "Breathable, classic", price: 0 },
  { id: "mock-mesh", label: "Mock mesh", hint: "Smooth print surface", price: 3 },
  { id: "dazzle", label: "Dazzle", hint: "Shine finish, durable", price: 5 },
  { id: "stretch", label: "4-way stretch", hint: "Compression fit", price: 8 },
  { id: "wicking", label: "Moisture-wicking knit", hint: "Cool-touch training", price: 4 },
];

const FITS: Option[] = [
  { id: "adult", label: "Adult standard", hint: "S–4XL" },
  { id: "adult-slim", label: "Adult slim / pro cut", hint: "Tapered fit" },
  { id: "youth", label: "Youth", hint: "YS–YXL" },
  { id: "mixed", label: "Mixed roster", hint: "Adult and youth sizes" },
];

const DECORATION: Option[] = [
  { id: "sublimation", label: "Full sublimation", hint: "Edge-to-edge print", price: 9 },
  { id: "screen", label: "Screen print", hint: "Bold, cost-effective", price: 4 },
  { id: "twill", label: "Tackle twill", hint: "Stitched numbers", price: 14 },
  { id: "embroidery", label: "Embroidery", hint: "Logos and crests", price: 8 },
  { id: "heat", label: "Heat transfer", hint: "Fast turnaround", price: 5 },
];

const MARKINGS: Option[] = [
  { id: "front-number", label: "Front numbers", hint: "Chest numbering", price: 3 },
  { id: "back-number", label: "Back numbers", hint: "Large rear numbers", price: 3 },
  { id: "sleeve-number", label: "Sleeve numbers", hint: "Both sleeves", price: 2 },
  { id: "player-name", label: "Player names", hint: "Nameplate per player", price: 6 },
  { id: "team-name", label: "Team name / wordmark", hint: "Front script", price: 4 },
  { id: "captain", label: "Captain patch", hint: "Leadership mark", price: 3 },
];

const ADD_ONS: Option[] = [
  { id: "pants", label: "Matching pants", hint: "Integrated or slotted", price: 29.99 },
  { id: "socks", label: "Team socks", hint: "Custom stripe or color", price: 13.99 },
  { id: "gloves", label: "Team gloves", hint: "Printed palm and back", price: 32.99 },
  { id: "jacket", label: "Sideline jacket", hint: "Travel and warm-up layer", price: 39.99 },
  { id: "bag", label: "Player bags", hint: "Named kit bags", price: 24 },
  { id: "sample", label: "Pre-production sample", hint: "One stitched sample", price: 12 },
  { id: "sizing-kit", label: "Sizing kit loan", hint: "Try-on set before order", price: 6 },
  { id: "rush", label: "Rush production", hint: "Priority queue", price: 11 },
];

const ROSTERS = [10, 15, 20, 25, 35, 50, 75];

const ASSURANCES = [
  "Free design mockup before production",
  "Team colors matched to your school",
  "Roster names and numbers included in setup",
  "Made-to-order, shipped across Texas",
];

const QTY_SCALE: Array<[number, number]> = [
  [75, 0.82],
  [50, 0.88],
  [35, 0.93],
  [25, 1],
  [15, 1.08],
  [10, 1.16],
  [1, 1.3],
];

const LABELS: Record<string, string> = {
  garment: "Garment",
  fabric: "Fabric",
  fit: "Fit",
  decoration: "Decoration",
  markings: "Names & numbers",
  roster: "Roster size",
  addOn: "Add-ons",
};

function labelsOf(options: Option[], ids: string[]) {
  return ids.map((id) => options.find((option) => option.id === id)?.label ?? id).join(", ");
}

function priceOf(options: Option[], ids: string[]) {
  return ids.reduce((total, id) => total + (options.find((o) => o.id === id)?.price ?? 0), 0);
}

/**
 * "Design Your Uniform" tool: roster-based pricing rather than per-box, with
 * the decoration and marking choices a coach actually specifies.
 */
export function UniformConfigurator({ productName }: { productName: string }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);

  const [garment, setGarment] = useState("");
  const [fabric, setFabric] = useState("");
  const [fit, setFit] = useState("");
  const [decoration, setDecoration] = useState<string[]>([]);
  const [markings, setMarkings] = useState<string[]>([]);
  const [roster, setRoster] = useState(0);
  const [customRoster, setCustomRoster] = useState("");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [colors, setColors] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "", school: "", notes: "" });
  const [artwork, setArtwork] = useState<File | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const players = customRoster ? Number(customRoster) || 0 : roster;

  // On phones the summary is a fixed bar; show it while the tool is on screen.
  useEffect(() => {
    const section = sectionRef.current;
    const panel = section?.querySelector<HTMLElement>("[data-summary-panel]");
    if (!section || !panel || !window.matchMedia("(max-width: 1023px)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => panel.setAttribute("data-visible", String(entry.isIntersecting)),
      { rootMargin: "-10% 0px -20% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function toggle(list: string[], setList: (next: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  const estimate = useMemo(() => {
    const base = GARMENTS.find((option) => option.id === garment)?.price ?? 0;
    if (!base || !players) return null;
    const scale = QTY_SCALE.find(([threshold]) => players >= threshold)?.[1] ?? 1.3;
    const perPlayer =
      (base +
        priceOf(FABRICS, fabric ? [fabric] : []) +
        priceOf(DECORATION, decoration) +
        priceOf(MARKINGS, markings) +
        priceOf(ADD_ONS, addOns)) *
      scale;
    const total = perPlayer * players;
    return { low: Math.round(total * 0.9), high: Math.round(total * 1.15), perPlayer: Math.round(perPlayer) };
  }, [garment, fabric, decoration, markings, addOns, players]);

  const values: Record<string, string> = {
    garment: labelsOf(GARMENTS, garment ? [garment] : []),
    fabric: labelsOf(FABRICS, fabric ? [fabric] : []),
    fit: labelsOf(FITS, fit ? [fit] : []),
    decoration: labelsOf(DECORATION, decoration),
    markings: labelsOf(MARKINGS, markings),
    roster: players ? `${players} players` : "",
    addOn: labelsOf(ADD_ONS, addOns),
  };

  const selectedCount = Object.values(values).filter(Boolean).length;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Honeypot: hidden from people, so anything in it came from a bot.
    const website = new FormData(event.currentTarget).get("website");
    if (typeof website === "string" && website.trim() !== "") {
      router.push("/thank-you/");
      return;
    }

    setError("");
    setSending(true);

    const spec = Object.keys(LABELS)
      .map((key) => `${LABELS[key]}: ${values[key] || "Not selected"}`)
      .concat(
        colors ? `Team colors: ${colors}` : "",
        estimate
          ? `Indicative budget: $${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()} (about $${estimate.perPlayer} per player)`
          : "Indicative budget: pending review",
        contact.notes ? `Notes: ${contact.notes}` : "",
      )
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Design Your Uniform Spec: ${productName}`,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          school: contact.school,
          product: `${productName} (design tool)`,
          message: spec,
          artwork: await readArtwork(artwork),
        }),
      });
      if (res.ok) {
        router.push("/thank-you/");
        return;
      }
      const body = await res.json().catch(() => null);
      setError(
        (body && typeof body.error === "string" && body.error) ||
          "That did not send. Please try again or call us directly.",
      );
    } catch {
      setError("Could not send. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  const optionButton = (
    option: Option,
    selected: boolean,
    onClick: () => void,
  ) => (
    <button
      key={option.id}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-16 rounded-xl border px-4 py-3 text-left transition ${
        selected
          ? "border-[var(--color-red)] bg-[rgba(200,16,46,0.06)] shadow-[0_0_0_3px_rgba(200,16,46,0.12)]"
          : "border-[var(--color-border)] bg-white hover:border-[var(--color-navy-soft)]"
      }`}
    >
      <span className="block text-sm font-semibold text-[var(--color-navy)]">{option.label}</span>
      {option.hint ? (
        <span className="mt-1 block text-xs text-[var(--color-navy-soft)]">{option.hint}</span>
      ) : null}
    </button>
  );

  return (
    <section id="design-your-uniform" ref={sectionRef} className="scroll-mt-24 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
            Design Your Uniform
          </p>
          <h2 className="mt-3 text-4xl text-[var(--color-navy)] sm:text-5xl">
            Design your {productName.toLowerCase()}
          </h2>
          <p className="mt-3 text-[var(--color-navy-soft)]">
            Pick the garment, fabric, decoration and roster size to see an indicative price per
            player, then send the specification to our uniform team. Sizes run youth XS to adult
            5XL —{" "}
            <Link href="/size-chart/" className="font-semibold text-[var(--color-red)] underline">
              check the size chart
            </Link>{" "}
            before you send the roster.
          </p>
        </div>

        <form
          id="design-your-uniform-form"
          onSubmit={handleSubmit}
          data-ga-event="design_tool_submit"
          className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-start"
        >
          {/* Honeypot — hidden from people, irresistible to bots. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="grid min-w-0 gap-4">
            <fieldset className="surface-card p-5">
              <legend className="flex items-center gap-3 text-lg font-semibold text-[var(--color-navy)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">1</span>
                Garment
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {GARMENTS.map((option) => optionButton(option, garment === option.id, () => setGarment(option.id)))}
              </div>
            </fieldset>

            <fieldset className="surface-card p-5">
              <legend className="flex items-center gap-3 text-lg font-semibold text-[var(--color-navy)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">2</span>
                Fabric
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {FABRICS.map((option) => optionButton(option, fabric === option.id, () => setFabric(option.id)))}
              </div>
            </fieldset>

            <fieldset className="surface-card p-5">
              <legend className="flex items-center gap-3 text-lg font-semibold text-[var(--color-navy)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">3</span>
                Fit
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {FITS.map((option) => optionButton(option, fit === option.id, () => setFit(option.id)))}
              </div>
            </fieldset>

            <fieldset className="surface-card p-5">
              <legend className="flex items-center gap-3 text-lg font-semibold text-[var(--color-navy)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">4</span>
                Decoration
                <span className="rounded-full bg-[var(--color-shell)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-navy-soft)]">
                  Select all that apply
                </span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DECORATION.map((option) =>
                  optionButton(option, decoration.includes(option.id), () => toggle(decoration, setDecoration, option.id)),
                )}
              </div>
            </fieldset>

            <fieldset className="surface-card p-5">
              <legend className="flex items-center gap-3 text-lg font-semibold text-[var(--color-navy)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">5</span>
                Names &amp; numbers
                <span className="rounded-full bg-[var(--color-shell)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-navy-soft)]">
                  Select all that apply
                </span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {MARKINGS.map((option) =>
                  optionButton(option, markings.includes(option.id), () => toggle(markings, setMarkings, option.id)),
                )}
              </div>
            </fieldset>

            <fieldset className="surface-card p-5">
              <legend className="flex items-center gap-3 text-lg font-semibold text-[var(--color-navy)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">6</span>
                Roster size
              </legend>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {ROSTERS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setRoster(value);
                      setCustomRoster("");
                    }}
                    aria-pressed={roster === value && !customRoster}
                    className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition ${
                      roster === value && !customRoster
                        ? "border-[var(--color-navy)] bg-[var(--color-navy)] text-white"
                        : "border-[var(--color-border)] bg-white text-[var(--color-navy)] hover:border-[var(--color-red)]"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <label className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-navy-soft)]">
                Or enter your roster
                <input
                  className="input-shell max-w-[160px]"
                  inputMode="numeric"
                  placeholder="e.g. 42"
                  value={customRoster}
                  onChange={(event) => setCustomRoster(event.target.value.replace(/[^0-9]/g, ""))}
                />
              </label>
            </fieldset>

            <fieldset className="surface-card p-5">
              <legend className="flex items-center gap-3 text-lg font-semibold text-[var(--color-navy)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">7</span>
                Add-ons
                <span className="rounded-full bg-[var(--color-shell)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-navy-soft)]">
                  Optional
                </span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ADD_ONS.map((option) =>
                  optionButton(option, addOns.includes(option.id), () => toggle(addOns, setAddOns, option.id)),
                )}
              </div>
            </fieldset>

            <fieldset className="surface-card p-5">
              <legend className="flex items-center gap-3 text-lg font-semibold text-[var(--color-navy)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">8</span>
                Team details
              </legend>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  className="input-shell"
                  placeholder="Your name *"
                  required
                  value={contact.name}
                  onChange={(event) => setContact((c) => ({ ...c, name: event.target.value }))}
                />
                <input
                  className="input-shell"
                  type="email"
                  placeholder="Email address *"
                  required
                  value={contact.email}
                  onChange={(event) => setContact((c) => ({ ...c, email: event.target.value }))}
                />
                <input
                  className="input-shell"
                  type="tel"
                  placeholder="Phone number"
                  value={contact.phone}
                  onChange={(event) => setContact((c) => ({ ...c, phone: event.target.value }))}
                />
                <input
                  className="input-shell"
                  placeholder="School / club"
                  value={contact.school}
                  onChange={(event) => setContact((c) => ({ ...c, school: event.target.value }))}
                />
              </div>

              <input
                className="input-shell mt-3"
                placeholder="Team colors (e.g. navy, white, gold)"
                value={colors}
                onChange={(event) => setColors(event.target.value)}
              />

              <textarea
                className="input-shell mt-3 min-h-24"
                placeholder="Season start, delivery date, or a design you want matched…"
                value={contact.notes}
                onChange={(event) => setContact((c) => ({ ...c, notes: event.target.value }))}
              />

              <label className="mt-3 grid gap-2 text-sm">
                <span className="font-semibold text-[var(--color-navy)]">
                  Upload artwork or logo{" "}
                  <span className="font-normal text-[var(--color-navy-soft)]">(optional, max 3 MB)</span>
                </span>
                <input
                  type="file"
                  name="artwork"
                  accept={ARTWORK_ACCEPT}
                  className="input-shell py-2.5"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (file && file.size > MAX_ARTWORK_BYTES) {
                      setArtwork(null);
                      setError(artworkTooLargeMessage(company.email));
                      event.target.value = "";
                      return;
                    }
                    setError("");
                    setArtwork(file);
                  }}
                />
              </label>
            </fieldset>
          </div>

          <aside
            data-summary-panel
            className="cfg-summary min-w-0 lg:sticky lg:top-24"
          >
            <div className="cfg-summary-card surface-card overflow-hidden">
              <button
                type="button"
                onClick={() => setSummaryOpen((open) => !open)}
                aria-expanded={summaryOpen}
                className="flex w-full items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-3 text-left lg:pointer-events-none"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-navy-soft)]">
                  Your specification
                </span>
                <span className="text-xs font-semibold text-[var(--color-red)] lg:hidden">
                  {selectedCount ? `${selectedCount} selected · ` : ""}
                  {summaryOpen ? "Hide" : "Show"}
                </span>
              </button>

              <dl className="cfg-summary-list px-5"
                data-open={summaryOpen}>
                {Object.keys(LABELS).map((key) => (
                  <div key={key} className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] py-2.5 last:border-0">
                    <dt className="text-sm text-[var(--color-navy-soft)]">{LABELS[key]}</dt>
                    <dd
                      className={`max-w-[60%] text-right text-sm ${
                        values[key] ? "font-semibold text-[var(--color-navy)]" : "italic text-[var(--color-navy-soft)]"
                      }`}
                    >
                      {values[key] || "Not selected"}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="m-5 rounded-xl bg-[var(--color-navy)] px-4 py-4 text-center text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  Indicative price range
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {estimate
                    ? `$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}`
                    : "Choose a garment and roster"}
                </p>
                {estimate ? (
                  <p className="mt-1 text-xs text-white/70">about ${estimate.perPlayer} per player</p>
                ) : null}
                <p className="mt-2 text-[11px] leading-5 text-white/60">
                  Indicative only. Final pricing depends on artwork, fabric availability and
                  delivery date.
                </p>
              </div>

              <ul className="grid gap-2 px-5 pb-5">
                {ASSURANCES.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-[var(--color-navy)]">
                    <svg className="mt-1 h-3.5 w-3.5 flex-none" style={{ color: "var(--color-red)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {error ? (
              <p className="mt-3 rounded-xl bg-[rgba(200,16,46,0.08)] px-4 py-3 text-sm text-[var(--color-red)]">
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={sending} className="inline-flex justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-navy)] disabled:opacity-60 mt-4 w-full">
              {sending ? "Sending…" : "Send my specification"}
            </button>
          </aside>
        </form>
      </div>
    </section>
  );
}
