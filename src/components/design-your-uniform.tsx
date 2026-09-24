"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";

import { ARTWORK_ACCEPT, MAX_ARTWORK_BYTES, artworkTooLargeMessage, readArtwork } from "@/lib/artwork";
import {
  FieldErrors,
  FileField,
  FormAlert,
  SubmitButton,
  TextAreaField,
  TextField,
  isEmail,
  isPhone,
  leavingForSubmit,
} from "@/components/form-fields";
import type { DesignOption, DesignOptions } from "@/lib/design-tool";
import { company } from "@/lib/site";

export const DESIGN_SPEC_STORAGE_KEY = "tfu:last-spec";

type Props = {
  options: DesignOptions;
  /** Product this instance sits on; blank on the standalone page. */
  productName?: string;
  /** Garment card to open with — set from the product page it is embedded on. */
  preselectGarment?: string;
  /** Add-on to switch on — set when the product page itself is an add-on. */
  preselectAddOn?: string;
  heading?: string;
  intro?: string;
  /** "page" drops the section heading block, which the route renders itself. */
  variant?: "inline" | "page";
};

type Contact = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  timeline: string;
  notes: string;
};

const STEP_TITLES = [
  "Pick your garment",
  "Pick your team colors",
  "Choose decoration",
  "Choose fabric",
  "Choose the fit",
  "Roster size",
  "Add to the order",
  "Where do we send it",
];

function money(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function roundedMoney(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function validateContact(next: Contact): FieldErrors {
  const errors: FieldErrors = {};
  if (!next.name.trim()) errors.name = "Tell us who to reply to.";
  if (!next.email.trim()) errors.email = "We send the mockup by email, so we need one.";
  else if (!isEmail(next.email)) errors.email = "That email address looks incomplete.";
  if (next.phone.trim() && !isPhone(next.phone))
    errors.phone = "Check the number — that is too short to dial.";
  return errors;
}

function byId(list: DesignOption[], id: string) {
  return list.find((option) => option.id === id);
}

function labelsOf(list: DesignOption[], ids: string[]) {
  return ids
    .map((id) => byId(list, id)?.label)
    .filter(Boolean)
    .join(", ");
}

/**
 * "Design Your Uniform" — the visitor picks a garment, colors, decoration,
 * fabric, fit, roster and extras from the site's own product photography, and
 * sends the specification to the uniform team.
 *
 * Two deliberate constraints:
 * - Every number it shows is a published product price at the 10-piece
 *   minimum (see src/lib/design-tool.ts). Nothing here invents a surcharge.
 * - The preview shows the real photo of the garment that was picked plus the
 *   colors as labelled chips. It does not recolor the jersey, because a
 *   rendered fake would promise a mockup we have not made yet — the free
 *   mockup, drawn by a human, is what the form asks for.
 */
export function DesignYourUniform({
  options,
  productName,
  preselectGarment,
  preselectAddOn,
  heading,
  intro,
  variant = "inline",
}: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const intentRef = useRef<"spec" | "mockup">("spec");

  const [garment, setGarment] = useState(preselectGarment ?? "");
  const [colors, setColors] = useState<string[]>([]);
  const [otherColors, setOtherColors] = useState("");
  const [decoration, setDecoration] = useState<string[]>([]);
  const [fabric, setFabric] = useState("");
  const [fit, setFit] = useState("");
  const [roster, setRoster] = useState<number>(0);
  const [customRoster, setCustomRoster] = useState("");
  const [addOns, setAddOns] = useState<string[]>(preselectAddOn ? [preselectAddOn] : []);
  const [contact, setContact] = useState<Contact>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    timeline: "",
    notes: "",
  });
  const [artwork, setArtwork] = useState<File | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [contactErrors, setContactErrors] = useState<FieldErrors>({});
  /**
   * Once the tool is on screen every garment photo is rendered into the summary
   * frame at its final size, stacked and faded out. Picking a garment then only
   * flips which one is opaque — no new request, no decode, no layout shift.
   */
  const [warmPreviews, setWarmPreviews] = useState(Boolean(preselectGarment));

  function blurContact(
    key: "name" | "email" | "phone",
    event: React.FocusEvent<HTMLInputElement>,
  ) {
    // Never raise an error on the way to the submit button: the new line of
    // text would push the button out from under the pointer.
    if (leavingForSubmit(event)) return;
    setContactErrors((prev) => ({ ...prev, [key]: validateContact(contact)[key] ?? "" }));
  }

  /** Update one contact field and clear its error the moment it is fixed. */
  function updateContact(key: keyof Contact, value: string) {
    const next = { ...contact, [key]: value };
    setContact(next);
    setContactErrors((prev) => {
      const flagged = Object.keys(prev).filter((name) => prev[name]);
      if (!flagged.length) return prev;
      const fresh = validateContact(next);
      const out = { ...prev };
      for (const name of flagged) out[name] = fresh[name] ?? "";
      return out;
    });
  }

  const players = customRoster ? Number(customRoster) || 0 : roster;

  /**
   * "Design this uniform" links arrive as /design-your-uniform/?product=<slug>.
   * Read at run time rather than through useSearchParams so the route stays
   * statically rendered and the page still has content with JavaScript off.
   */
  useEffect(() => {
    if (preselectGarment) return;
    const wanted = new URLSearchParams(window.location.search).get("product");
    if (!wanted) return;
    // Deferred by a tick so the first paint is the server-rendered markup and
    // the preselection is a plain update rather than a cascading render.
    const timer = window.setTimeout(() => {
      if (options.garments.some((option) => option.id === wanted)) {
        setGarment(wanted);
      } else if (options.addOns.some((option) => option.id === wanted)) {
        setAddOns((current) => (current.includes(wanted) ? current : [...current, wanted]));
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [options.garments, options.addOns, preselectGarment]);

  /**
   * Warm the preview images.
   *
   * The summary photo used to be a single <Image> whose `src` changed on every
   * pick, and because it asked for a different rendition than the option card
   * did, each pick started a fresh /_next/image request — a visible blank while
   * the new file came down. Instead, once the tool is within a screen of the
   * viewport, every garment photo is rendered into the summary frame at the
   * summary's own size. Selection then changes nothing but which one is opaque.
   */
  useEffect(() => {
    if (warmPreviews) return;
    const section = sectionRef.current;
    if (!section) return;
    let idle = 0;
    if (typeof IntersectionObserver === "undefined") {
      idle = window.setTimeout(() => setWarmPreviews(true), 0);
      return () => window.clearTimeout(idle);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // Wait for a quiet moment so the warm-up never competes with the
        // page's own LCP image.
        const start = () => setWarmPreviews(true);
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
          .requestIdleCallback;
        idle = ric ? ric(start, { timeout: 1500 }) : window.setTimeout(start, 300);
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      if (idle) window.clearTimeout(idle);
    };
  }, [warmPreviews]);

  // On phones the summary is a bar pinned above the Call/WhatsApp bar; show it
  // only while the tool itself is on screen.
  useEffect(() => {
    const section = sectionRef.current;
    const panel = section?.querySelector<HTMLElement>("[data-summary-panel]");
    if (!section || !panel || !window.matchMedia("(max-width: 1023px)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        panel.setAttribute("data-visible", String(entry.isIntersecting));
        // The floating WhatsApp bubble sits bottom-left; globals.css hides it
        // while this bar is up so the two do not overlap. WhatsApp is still one
        // tap away in the sticky Call / WhatsApp / Quote bar underneath.
        document.documentElement.dataset.designBar = String(entry.isIntersecting);
      },
      { rootMargin: "-5% 0px -10% 0px" },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.designBar;
    };
  }, []);

  function toggle(list: string[], setList: (next: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  const chosenGarment = garment ? byId(options.garments, garment) : undefined;

  /**
   * Per player = the garment's published starting price plus each add-on's
   * published starting price. Fabric, decoration and fit change the quote, and
   * the panel says so, but they carry no number here because the site does not
   * publish one.
   */
  const estimate = useMemo(() => {
    if (!chosenGarment?.price) return null;
    const addOnTotal = addOns.reduce((sum, id) => sum + (byId(options.addOns, id)?.price ?? 0), 0);
    const perPlayer = chosenGarment.price + addOnTotal;
    return {
      perPlayer,
      roster: players,
      total: players ? perPlayer * players : null,
    };
  }, [chosenGarment, addOns, options.addOns, players]);

  const colorList = [...colors, ...(otherColors.trim() ? [otherColors.trim()] : [])];

  const specRows: { label: string; value: string }[] = [
    { label: "Garment", value: chosenGarment?.label ?? "" },
    { label: "Team colors", value: colorList.join(", ") },
    { label: "Decoration", value: labelsOf(options.decorations, decoration) },
    { label: "Fabric", value: labelsOf(options.fabrics, fabric ? [fabric] : []) },
    { label: "Fit", value: labelsOf(options.fits, fit ? [fit] : []) },
    { label: "Roster size", value: players ? `${players} players` : "" },
    { label: "Add-ons", value: labelsOf(options.addOns, addOns) },
    { label: "Needed by", value: contact.timeline },
  ];

  const chosenCount = specRows.filter((row) => row.value).length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const intent = intentRef.current;
    intentRef.current = "spec";

    // Honeypot: hidden from people, so anything in it came from a bot.
    const website = new FormData(event.currentTarget).get("website");
    if (typeof website === "string" && website.trim() !== "") {
      router.push("/thank-you/");
      return;
    }

    const found = validateContact(contact);
    if (Object.keys(found).length) {
      // Focus first: on macOS a button does not take focus on click, so this
      // fires the blur handler of the field the visitor was still in, and that
      // handler's setContactErrors must not land after the one below.
      // The DOM has not re-rendered with aria-invalid yet, so go by field name.
      const first = event.currentTarget.querySelector<HTMLElement>(
        `[name="design-${Object.keys(found)[0]}"]`,
      );
      first?.focus({ preventScroll: true });
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      setError("Add your name and email so we can send the quote back.");
      setContactErrors(found);
      return;
    }

    setError("");
    setSending(true);

    const requestType = intent === "mockup" ? "Free mockup request" : "Price check / specification";
    const rows = specRows.filter((row) => row.value);
    const priceLine = estimate
      ? `${money(estimate.perPlayer)} per player at the ${options.minimumPieces}-piece minimum${
          estimate.total ? `, about ${roundedMoney(estimate.total)} for ${estimate.roster} players` : ""
        }`
      : "Not calculated — garment not chosen";

    const spec = [
      ...rows,
      { label: "Estimate shown on site", value: priceLine },
      { label: "Request type", value: requestType },
      ...(contact.notes ? [{ label: "Notes", value: contact.notes }] : []),
    ];

    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject:
            intent === "mockup"
              ? `Free mockup request: ${chosenGarment?.label ?? productName ?? "Custom football uniform"}`
              : `Design Your Uniform spec: ${chosenGarment?.label ?? productName ?? "Custom football uniform"}`,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          organization: contact.organization,
          product: chosenGarment?.label ?? productName ?? "Custom football uniform",
          requestType,
          spec,
          // Every form on the site sends its body text as "message"; the API
          // requires it, and it is the plain-text fallback for the spec list.
          message: spec.map((row) => `${row.label}: ${row.value}`).join("\n"),
          artwork: await readArtwork(artwork),
        }),
      });

      if (res.ok) {
        // The thank-you page reads this back. sessionStorage rather than the
        // URL, so a long specification does not end up in a shareable link or
        // in analytics.
        try {
          window.sessionStorage.setItem(
            DESIGN_SPEC_STORAGE_KEY,
            JSON.stringify({ requestType, rows: spec, at: Date.now() }),
          );
        } catch {
          // Private mode or blocked storage: the thank-you page copes.
        }
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

  /**
   * The GA4 snippet reads `data-ga-event` off the form at submit time, so the
   * mockup button rewrites the attribute on the way through. React state would
   * not have re-rendered before the submit event fires.
   */
  function markMockupIntent() {
    intentRef.current = "mockup";
    formRef.current?.setAttribute("data-ga-event", "mockup_request");
    window.setTimeout(() => formRef.current?.setAttribute("data-ga-event", "design_tool_submit"), 0);
  }

  const cardBase =
    "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-white text-left transition hover:border-[var(--color-navy-soft)] has-[:checked]:border-[var(--color-red)] has-[:checked]:bg-[rgba(200,16,46,0.04)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-navy)]";

  function imageCard(
    option: DesignOption,
    inputType: "radio" | "checkbox",
    group: string,
    checked: boolean,
    onChange: () => void,
    showPrice = true,
  ) {
    return (
      <label key={option.id} className={cardBase}>
        <input
          type={inputType}
          name={group}
          value={option.id}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <span className="relative block aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(180deg,#f8fafc,#eef3f8)]">
          {option.image ? (
            <Image
              src={option.image}
              alt={option.imageAlt ?? option.label}
              width={480}
              height={360}
              sizes="(min-width: 1024px) 220px, 45vw"
              className="h-full w-full object-cover"
            />
          ) : null}
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[var(--color-red)] text-white opacity-0 shadow transition group-has-[:checked]:opacity-100"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        </span>
        <span className="flex flex-1 flex-col gap-1 p-3">
          <span className="text-sm font-semibold leading-5 text-[var(--color-navy)]">{option.label}</span>
          <span className="text-xs leading-4 text-[var(--color-navy-soft)]">{option.hint}</span>
          {showPrice && option.price ? (
            <span className="mt-auto pt-1 text-xs font-semibold text-[var(--color-red)]">
              from {money(option.price)} / {option.unit}
            </span>
          ) : null}
        </span>
      </label>
    );
  }

  function plainCard(
    option: DesignOption,
    group: string,
    checked: boolean,
    onChange: () => void,
    swatch?: string,
  ) {
    return (
      <label key={option.id} className={`${cardBase} min-h-[4.5rem] flex-row items-center gap-3 p-3`}>
        <input
          type="radio"
          name={group}
          value={option.id}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        {swatch ? (
          <span
            aria-hidden="true"
            className="h-10 w-10 shrink-0 rounded-xl border border-[var(--color-border)] shadow-inner"
            style={{ background: `linear-gradient(135deg, ${swatch} 0%, ${swatch} 55%, rgba(255,255,255,0.35) 100%)` }}
          />
        ) : null}
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-semibold text-[var(--color-navy)]">{option.label}</span>
          <span className="text-xs text-[var(--color-navy-soft)]">{option.hint}</span>
        </span>
      </label>
    );
  }

  const stepHead = (index: number, extra?: string) => (
    <legend className="flex flex-wrap items-center gap-3 text-lg font-semibold text-[var(--color-navy)]">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">
        {index + 1}
      </span>
      {STEP_TITLES[index]}
      {extra ? (
        <span className="rounded-full bg-[var(--color-shell)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-navy-soft)]">
          {extra}
        </span>
      ) : null}
    </legend>
  );

  return (
    <section
      id="design-your-uniform"
      ref={sectionRef}
      className={variant === "page" ? "scroll-mt-24" : "scroll-mt-24 py-12"}
    >
      <div className={variant === "page" ? "" : "mx-auto max-w-6xl px-4"}>
        {variant === "inline" ? (
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
              Design Your Uniform
            </p>
            <h2 className="mt-3 text-4xl text-[var(--color-navy)] sm:text-5xl">
              {heading ?? `Design your ${(productName ?? "football uniform").toLowerCase()}`}
            </h2>
            <p className="mt-3 text-[var(--color-navy-soft)]">
              {intro ??
                "Pick the garment, colors, decoration and roster size from our own uniform photography, see what it costs at the 10-piece minimum, and send the specification to our team."}{" "}
              Sizes run youth XS to adult 5XL —{" "}
              <Link href="/size-chart/" className="font-semibold text-[var(--color-red)] underline">
                check the size chart
              </Link>{" "}
              before you send a roster, or{" "}
              <Link href="/design-your-uniform/" className="font-semibold text-[var(--color-red)] underline">
                open the full uniform designer
              </Link>
              .
            </p>
          </div>
        ) : null}

        <form
          id="design-your-uniform-form"
          ref={formRef}
          onSubmit={handleSubmit}
          data-ga-event="design_tool_submit"
          // The form validates itself so the messages match the rest of the
          // site; without this the browser's own bubble fires first and the
          // submit handler never runs.
          noValidate
          className={`${variant === "inline" ? "mt-8" : ""} grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start`}
        >
          {/* Honeypot — hidden from people, irresistible to bots. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <div className="grid min-w-0 gap-4">
            <fieldset className="surface-card p-4 sm:p-5">
              {stepHead(0)}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {options.garments.map((option) =>
                  imageCard(option, "radio", "design-garment", garment === option.id, () =>
                    setGarment(option.id),
                  ),
                )}
              </div>
              <p className="mt-3 text-xs text-[var(--color-navy-soft)]">
                Prices are the published starting price per piece at our {options.minimumPieces}-piece
                minimum — the smallest order we make, and therefore the highest tier. Larger rosters
                pay less per piece.
              </p>
            </fieldset>

            <fieldset className="surface-card p-4 sm:p-5">
              {stepHead(1, "Pick up to three")}
              <div className="mt-4 flex flex-wrap gap-2">
                {options.colors.map((chip) => {
                  const checked = colors.includes(chip.name);
                  return (
                    <label
                      key={chip.name}
                      className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-[var(--color-border)] bg-white py-1.5 pl-1.5 pr-3.5 text-sm font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-navy-soft)] has-[:checked]:border-[var(--color-red)] has-[:checked]:bg-[rgba(200,16,46,0.05)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-navy)]"
                    >
                      <input
                        type="checkbox"
                        name="design-colors"
                        value={chip.name}
                        checked={checked}
                        onChange={() => toggle(colors, setColors, chip.name)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="h-6 w-6 rounded-full border border-[rgba(11,31,58,0.18)]"
                        style={{ backgroundColor: chip.hex }}
                      />
                      {chip.name}
                    </label>
                  );
                })}
              </div>
              <label className="mt-4 grid gap-2 text-sm text-[var(--color-navy-soft)]">
                <span>Other colors, or a Pantone reference</span>
                <input
                  className="input-shell"
                  name="design-other-colors"
                  placeholder="e.g. PMS 288 C, school gold"
                  value={otherColors}
                  onChange={(event) => setOtherColors(event.target.value)}
                />
              </label>
            </fieldset>

            <fieldset className="surface-card p-4 sm:p-5">
              {stepHead(2, "Select all that apply")}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {options.decorations.map((option) =>
                  imageCard(
                    option,
                    "checkbox",
                    "design-decoration",
                    decoration.includes(option.id),
                    () => toggle(decoration, setDecoration, option.id),
                    false,
                  ),
                )}
              </div>
              <p className="mt-3 text-xs text-[var(--color-navy-soft)]">
                Full sublimation is included in the starting price. Stitched work — tackle twill
                numbers, embroidery, sewn nameplates — is priced in your written quote.
              </p>
            </fieldset>

            <fieldset className="surface-card p-4 sm:p-5">
              {stepHead(3)}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {options.fabrics.map((option) =>
                  plainCard(option, "design-fabric", fabric === option.id, () => setFabric(option.id), option.swatch),
                )}
              </div>
            </fieldset>

            <fieldset className="surface-card p-4 sm:p-5">
              {stepHead(4)}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {options.fits.map((option) =>
                  plainCard(option, "design-fit", fit === option.id, () => setFit(option.id)),
                )}
              </div>
            </fieldset>

            <fieldset className="surface-card p-4 sm:p-5">
              {stepHead(5)}
              <div className="mt-4 flex flex-wrap gap-2.5">
                {options.rosters.map((value) => (
                  <label
                    key={value}
                    className="cursor-pointer rounded-full border-2 border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-red)] has-[:checked]:border-[var(--color-navy)] has-[:checked]:bg-[var(--color-navy)] has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-navy)]"
                  >
                    <input
                      type="radio"
                      name="design-roster"
                      value={value}
                      checked={roster === value && !customRoster}
                      onChange={() => {
                        setRoster(value);
                        setCustomRoster("");
                      }}
                      className="sr-only"
                    />
                    {value}
                  </label>
                ))}
              </div>
              <label className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-navy-soft)]">
                Or enter your roster
                <input
                  className="input-shell max-w-[160px]"
                  inputMode="numeric"
                  name="design-roster-custom"
                  placeholder="e.g. 42"
                  value={customRoster}
                  onChange={(event) => setCustomRoster(event.target.value.replace(/[^0-9]/g, ""))}
                />
              </label>
            </fieldset>

            <fieldset className="surface-card p-4 sm:p-5">
              {stepHead(6, "Optional")}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {options.addOns.map((option) =>
                  imageCard(option, "checkbox", "design-add-ons", addOns.includes(option.id), () =>
                    toggle(addOns, setAddOns, option.id),
                  ),
                )}
              </div>
            </fieldset>

            <fieldset className="surface-card p-4 sm:p-5">
              {stepHead(7)}
              <div className="mt-4 grid gap-x-5 gap-y-4 sm:grid-cols-2">
                <TextField
                  label="Your name"
                  name="design-name"
                  required
                  autoComplete="name"
                  placeholder="Coach Ramirez"
                  value={contact.name}
                  onChange={(value) => updateContact("name", value)}
                  onBlur={(event) => blurContact("name", event)}
                  error={contactErrors.name || undefined}
                />
                <TextField
                  label="Email address"
                  name="design-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="coach@school.org"
                  value={contact.email}
                  onChange={(value) => updateContact("email", value)}
                  onBlur={(event) => blurContact("email", event)}
                  error={contactErrors.email || undefined}
                />
                <TextField
                  label="Phone number"
                  name="design-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(555) 123-4567"
                  value={contact.phone}
                  onChange={(value) => updateContact("phone", value)}
                  onBlur={(event) => blurContact("phone", event)}
                  error={contactErrors.phone || undefined}
                />
                <TextField
                  label="School or club"
                  name="design-organization"
                  autoComplete="organization"
                  placeholder="Lubbock Cooper HS"
                  value={contact.organization}
                  onChange={(value) => updateContact("organization", value)}
                />
                <TextField
                  label="When do you need them?"
                  name="design-timeline"
                  wide
                  autoComplete="off"
                  placeholder="e.g. first game 22 August, media day 15 August"
                  value={contact.timeline}
                  onChange={(value) => updateContact("timeline", value)}
                />
                <TextAreaField
                  label="Anything else we should know?"
                  name="design-notes"
                  wide
                  rows={4}
                  placeholder="A uniform you want matched, number font, sponsor logos…"
                  hint="Number font, sponsor logos, a jersey you want matched — anything the mockup should show."
                  value={contact.notes}
                  onChange={(value) => updateContact("notes", value)}
                />
                <FileField
                  label="Upload artwork or logo"
                  name="artwork"
                  wide
                  accept={ARTWORK_ACCEPT}
                  fileName={artwork?.name}
                  hint="Logo, crest or a photo of last season's jersey. PNG, JPG, PDF, AI or SVG up to 3 MB."
                  onSelect={(input) => {
                    const file = input.files?.[0] ?? null;
                    if (file && file.size > MAX_ARTWORK_BYTES) {
                      setArtwork(null);
                      setError(artworkTooLargeMessage(company.email));
                      input.value = "";
                      return;
                    }
                    setError("");
                    setArtwork(file);
                  }}
                />
              </div>
            </fieldset>
          </div>

          <aside
            data-summary-panel
            data-open={summaryOpen}
            className="design-summary min-w-0 lg:sticky lg:top-24"
          >
            <div className="design-summary-card surface-card overflow-hidden">
              <button
                type="button"
                onClick={() => setSummaryOpen((open) => !open)}
                aria-expanded={summaryOpen}
                aria-controls="design-summary-body"
                className="flex w-full items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3 text-left lg:pointer-events-none"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-navy-soft)]">
                  Your specification
                </span>
                <span className="text-xs font-semibold text-[var(--color-red)] lg:hidden">
                  {chosenCount ? `${chosenCount} chosen · ` : ""}
                  {summaryOpen ? "Hide" : "Show"}
                </span>
              </button>

              <div id="design-summary-body" className="design-summary-body" data-open={summaryOpen}>
                <div
                  data-summary-preview
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(180deg,#f8fafc,#eef3f8)]"
                >
                  {/* Every garment photo is in the DOM at the summary's own
                      size, so picking one is a class change, not a fetch. The
                      frame keeps a fixed 4:3 box either way, so nothing on the
                      page moves when the picture appears. */}
                  {options.garments
                    .filter(
                      (option) =>
                        option.image && (warmPreviews || option.id === chosenGarment?.id),
                    )
                    .map((option) => {
                      const active = option.id === chosenGarment?.id;
                      return (
                        <Image
                          key={option.id}
                          src={option.image as string}
                          alt={active ? `${option.label} — the uniform you are designing` : ""}
                          aria-hidden={active ? undefined : true}
                          width={640}
                          height={480}
                          sizes="(min-width: 1024px) 340px, 100vw"
                          data-active={active}
                          // The 11 that are not on screen queue behind
                          // everything the page actually needs to paint.
                          fetchPriority={active ? "auto" : "low"}
                          className={`absolute inset-0 h-full w-full object-cover ${
                            active ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      );
                    })}
                  {chosenGarment?.image ? null : (
                    <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-[var(--color-navy-soft)]">
                      Pick a garment above and its photo appears here.
                    </span>
                  )}
                  {chosenGarment ? (
                    <span className="absolute bottom-0 left-0 right-0 bg-[rgba(11,31,58,0.82)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                      {chosenGarment.label}
                    </span>
                  ) : null}
                </div>

                {colorList.length ? (
                  <div className="border-b border-[var(--color-border)] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
                      Colors you picked
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {colors.map((name) => {
                        const chip = options.colors.find((item) => item.name === name);
                        return (
                          <span key={name} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-navy)]">
                            <span
                              aria-hidden="true"
                              className="h-5 w-5 rounded-full border border-[rgba(11,31,58,0.18)]"
                              style={{ backgroundColor: chip?.hex ?? "#ffffff" }}
                            />
                            {name}
                          </span>
                        );
                      })}
                      {otherColors.trim() ? (
                        <span className="text-xs font-semibold text-[var(--color-navy)]">{otherColors.trim()}</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-[11px] leading-4 text-[var(--color-navy-soft)]">
                      The photo is the real garment, not a recolor. Your free mockup is drawn in these
                      colors and sent within 24 hours.
                    </p>
                  </div>
                ) : null}

                <dl className="px-4">
                  {specRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] py-2.5 last:border-0"
                    >
                      <dt className="text-sm text-[var(--color-navy-soft)]">{row.label}</dt>
                      <dd
                        className={`max-w-[62%] text-right text-sm ${
                          row.value ? "font-semibold text-[var(--color-navy)]" : "italic text-[var(--color-navy-soft)]"
                        }`}
                      >
                        {row.value || "Not chosen"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="design-summary-foot">
                {/* Contrast note: the amount, the sub-line and the fine print
                    all carry an explicit color. Without one the base `p` rule
                    in globals.css paints them navy-soft (#30435d), which on
                    this navy panel measured 1.64:1 — the price was the dimmest
                    thing in its own box. White on #0b1f3a is 16.5:1. */}
                <div
                  aria-live="polite"
                  className="design-summary-price m-4 overflow-hidden rounded-2xl bg-[var(--color-navy)] bg-[linear-gradient(160deg,#0b1f3a_0%,#14345f_100%)] px-4 py-4 text-center text-white ring-1 ring-inset ring-white/10"
                >
                  <p className="design-summary-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                    {/* The collapsed bar has room for one line, and dropping the
                        qualifier altogether would leave a bare price on screen. */}
                    <span className="design-summary-label-short">
                      Est. at {options.minimumPieces}-piece min.
                    </span>
                    <span className="design-summary-label-full">
                      Estimate at the {options.minimumPieces}-piece minimum
                    </span>
                  </p>
                  <p className="design-summary-amount mt-1.5 text-[30px] font-extrabold leading-none tracking-tight text-white">
                    {estimate ? (
                      <>
                        {money(estimate.perPlayer)}
                        <span className="ml-1.5 align-baseline text-[0.46em] font-semibold uppercase tracking-[0.12em] text-white">
                          per player
                        </span>
                      </>
                    ) : (
                      <span className="text-[0.66em] font-bold uppercase tracking-[0.06em] text-white">
                        Choose a garment
                      </span>
                    )}
                  </p>
                  {estimate?.total ? (
                    <p className="design-summary-sub mt-1.5 text-sm font-semibold text-white">
                      about {roundedMoney(estimate.total)} for {estimate.roster} players
                    </p>
                  ) : null}
                  <p className="design-summary-fineprint mt-2.5 border-t border-white/15 pt-2.5 text-[11px] leading-5 text-white/75">
                    Published starting prices, so this is the top of the range: a bigger roster pays
                    less per piece, and stitched decoration or heavier fabric is priced in your
                    written quote. Payment is online: a PayPal invoice we email
                    after you approve your design proof.
                  </p>
                </div>

                <div className="design-summary-actions px-4 pb-4">
                  {error ? <FormAlert message={error} /> : null}
                  <div className={error ? "mt-3" : undefined}>
                    <SubmitButton sending={sending} label="Send my spec" />
                  </div>
                  <div className="design-summary-mockup mt-2">
                    <SubmitButton
                      sending={sending}
                      variant="outline"
                      label="Request a free mockup"
                      onClick={markMockupIntent}
                    >
                      <Sparkles className="h-4 w-4" aria-hidden />
                    </SubmitButton>
                  </div>
                  <p className="design-summary-note mt-3 text-center text-[11px] leading-4 text-[var(--color-navy-soft)]">
                    Free mockup within 24 hours. Nothing is produced until you approve the design.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}
