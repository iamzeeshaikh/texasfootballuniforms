"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { Banknote, Receipt, ShieldCheck, ShoppingCart, Truck } from "lucide-react";

import { useCart } from "@/components/cart-provider";
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
import { ARTWORK_ACCEPT, MAX_ARTWORK_BYTES, artworkTooLargeMessage, readArtwork } from "@/lib/artwork";
import {
  DEFAULT_PAYMENT_METHOD,
  ORDER_STORAGE_KEY,
  PAYMENT_METHODS,
  type PaymentMethod,
  formatMoney,
  gaItems,
  lineSubtotal,
  paymentMethodLabel,
  sizeSummary,
} from "@/lib/cart";
import { gaEvent } from "@/lib/ga";
import { company } from "@/lib/site";
import { US_STATES } from "@/lib/us-states";

type Form = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  neededBy: string;
  notes: string;
};

const EMPTY: Form = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  address1: "",
  address2: "",
  city: "",
  state: "TX",
  zip: "",
  neededBy: "",
  notes: "",
};

function validate(form: Form): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Tell us who to reply to.";
  if (!form.email.trim()) errors.email = "The order confirmation goes here.";
  else if (!isEmail(form.email)) errors.email = "That email address looks incomplete.";
  if (!form.phone.trim()) errors.phone = "The driver needs a number on delivery day.";
  else if (!isPhone(form.phone)) errors.phone = "Check the number — that is too short to dial.";
  if (!form.address1.trim()) errors.address1 = "Street address, please.";
  if (!form.city.trim()) errors.city = "Which city?";
  if (!form.state.trim()) errors.state = "Pick a state.";
  if (!form.zip.trim()) errors.zip = "ZIP code, please.";
  else if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) errors.zip = "A US ZIP is five digits.";
  return errors;
}

/**
 * /checkout/ — an address, a delivery date and how the order gets paid for.
 *
 * There is no card field on this page and no payment gateway behind it, by the
 * owner's decision: an order is settled in cash on delivery, or against a
 * PayPal invoice the owner emails once the buyer has approved their design
 * proof. That is deliberate — charging before the proof is signed off is what
 * loses PayPal disputes on made-to-order goods — so there is no PayPal button
 * and no redirect to PayPal here.
 */
export function CheckoutForm() {
  const router = useRouter();
  const { lines, catalog, total, count, ready } = useCart();

  const [form, setForm] = useState<Form>(EMPTY);
  const [payment, setPayment] = useState<PaymentMethod>(DEFAULT_PAYMENT_METHOD);
  const [paymentError, setPaymentError] = useState("");
  const [artwork, setArtwork] = useState<File | null>(null);
  const [artworkError, setArtworkError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set = (key: keyof Form) => (value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validate(next)[key] ?? "" }));
  };

  const blur =
    (key: keyof Form) => (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (leavingForSubmit(event)) return;
      setTouched((current) => ({ ...current, [key]: true }));
      setErrors((prev) => ({ ...prev, [key]: validate(form)[key] ?? "" }));
    };

  const errorFor = (key: keyof Form) => errors[key] || undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (artworkError) return;

    const formEl = event.currentTarget;
    const website = new FormData(formEl).get("website");
    if (typeof website === "string" && website.trim() !== "") {
      router.push("/order-confirmed/");
      return;
    }

    const found = validate(form);
    // A radio is preselected, so this only fires if something cleared it.
    const missingPayment = !PAYMENT_METHODS.some((option) => option.id === payment);
    if (Object.keys(found).length || missingPayment) {
      if (Object.keys(found).length) {
        const firstKey = Object.keys(found)[0];
        const first = formEl.querySelector<HTMLElement>(`[name="${firstKey}"]`);
        first?.focus({ preventScroll: true });
        first?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      setTouched(Object.fromEntries(Object.keys(EMPTY).map((key) => [key, true])));
      setErrors(found);
      setPaymentError(missingPayment ? "Choose how you would like to pay." : "");
      if (missingPayment && !Object.keys(found).length) {
        document.getElementById("payment-method")?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    let res: Response;
    try {
      res = await fetch("/api/order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            organization: form.organization,
          },
          shipping: {
            address1: form.address1,
            address2: form.address2,
            city: form.city,
            state: form.state,
            zip: form.zip,
          },
          neededBy: form.neededBy,
          paymentMethod: payment,
          notes: form.notes,
          // Slug, quantity and sizes only: every price in the order email is
          // looked up on the server from the catalog.
          lines: lines.map((line) => ({
            slug: line.slug,
            quantity: line.quantity,
            sizes: line.sizes,
            colors: line.colors,
            notes: line.notes,
          })),
          artwork: await readArtwork(artwork),
        }),
      });
    } catch {
      setStatus("error");
      setErrorMessage("Could not send the order. Check your connection and try again.");
      return;
    }

    const body = (await res.json().catch(() => null)) as
      | { ok?: boolean; reference?: string; error?: string }
      | null;

    if (!res.ok || !body?.ok) {
      setStatus("error");
      setErrorMessage(body?.error || "Something went wrong. Please try again or call us.");
      return;
    }

    gaEvent("place_order", {
      currency: "USD",
      value: total,
      transaction_id: body.reference,
      payment_type: paymentMethodLabel(payment),
      items: gaItems(lines, catalog),
    });

    // The confirmation page reads this and empties the cart there, so a buyer
    // who never reaches it still has their order intact in the cart.
    try {
      window.sessionStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify({
          reference: body.reference,
          total,
          paymentMethod: payment,
          email: form.email,
          at: Date.now(),
        }),
      );
    } catch {
      // Blocked storage: the confirmation page falls back to generic copy.
    }

    router.push("/order-confirmed/");
  }

  if (!ready) {
    return (
      <p className="surface-card p-8 text-center text-sm text-[var(--color-navy-soft)]">
        Loading your order…
      </p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="surface-card p-8 text-center sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)]">
          <ShoppingCart className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-3xl text-[var(--color-navy)]">There is nothing to check out</h2>
        <p className="mx-auto mt-3 max-w-xl">
          Add a design to the cart first — minimum 10 per design, with a size breakdown that adds up
          to the quantity.
        </p>
        <Link
          href="/all-categories/"
          className="mt-6 inline-flex rounded-full bg-[var(--color-red)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-navy)]"
        >
          Browse uniforms
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-ga-managed=""
      noValidate
      className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start"
    >
      <div className="grid min-w-0 gap-6">
        <section className="surface-card p-6 sm:p-8">
          <h2 className="text-3xl text-[var(--color-navy)]">Who is ordering</h2>
          <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <TextField
              label="Your name"
              name="name"
              required
              autoComplete="name"
              placeholder="Coach Ramirez"
              value={form.name}
              onChange={set("name")}
              onBlur={blur("name")}
              error={errorFor("name")}
            />
            <TextField
              label="Email address"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="coach@school.org"
              value={form.email}
              onChange={set("email")}
              onBlur={blur("email")}
              error={errorFor("email")}
            />
            <TextField
              label="Phone number"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="(555) 123-4567"
              value={form.phone}
              onChange={set("phone")}
              onBlur={blur("phone")}
              error={errorFor("phone")}
            />
            <TextField
              label="School or club"
              name="organization"
              autoComplete="organization"
              placeholder="Lubbock Cooper HS"
              value={form.organization}
              onChange={set("organization")}
              onBlur={blur("organization")}
            />
          </div>
        </section>

        <section className="surface-card p-6 sm:p-8">
          <h2 className="text-3xl text-[var(--color-navy)]">Where it ships</h2>
          <p className="mt-2 text-sm">Shipping is free on every order, anywhere in the US.</p>
          <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <TextField
              label="Street address"
              name="address1"
              required
              wide
              autoComplete="address-line1"
              placeholder="1200 Main Street"
              value={form.address1}
              onChange={set("address1")}
              onBlur={blur("address1")}
              error={errorFor("address1")}
            />
            <TextField
              label="Suite, building or field house"
              name="address2"
              wide
              autoComplete="address-line2"
              placeholder="Athletic office, Building C"
              value={form.address2}
              onChange={set("address2")}
              onBlur={blur("address2")}
            />
            <TextField
              label="City"
              name="city"
              required
              autoComplete="address-level2"
              placeholder="Lubbock"
              value={form.city}
              onChange={set("city")}
              onBlur={blur("city")}
              error={errorFor("city")}
            />
            <div className="field" data-invalid={errorFor("state") ? "true" : undefined}>
              <label htmlFor="checkout-state" className="field-label">
                State
                <span className="field-required" aria-hidden="true">
                  *
                </span>
              </label>
              <select
                id="checkout-state"
                name="state"
                required
                autoComplete="address-level1"
                className="field-input"
                value={form.state}
                onChange={(event) => set("state")(event.target.value)}
              >
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label="ZIP code"
              name="zip"
              required
              autoComplete="postal-code"
              inputMode="text"
              placeholder="79424"
              value={form.zip}
              onChange={set("zip")}
              onBlur={blur("zip")}
              error={errorFor("zip")}
            />
            <div className="field">
              <label htmlFor="checkout-needed-by" className="field-label">
                Needed by
                <span className="field-optional">Optional</span>
              </label>
              <input
                id="checkout-needed-by"
                name="neededBy"
                type="date"
                className="field-input"
                value={form.neededBy}
                onChange={(event) => set("neededBy")(event.target.value)}
              />
              <p className="field-hint">
                Production is 1 to 2 weeks after you approve the mockup. Tell us the game date and we
                will say straight away whether it works.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-card p-6 sm:p-8" id="payment-method">
          <h2 className="text-3xl text-[var(--color-navy)]">How you pay</h2>
          <p className="mt-2 text-sm">
            Nothing is charged on this site and no card details are asked for. You are never billed
            before you have approved your design proof — pick the option that suits your program.
          </p>
          <fieldset className="mt-5 grid gap-3">
            <legend className="sr-only">Payment method</legend>
            {PAYMENT_METHODS.map((option) => {
              const selected = payment === option.id;
              return (
                <label
                  key={option.id}
                  className={`payment-option flex min-h-[44px] cursor-pointer gap-3 rounded-[20px] border p-4 transition ${
                    selected
                      ? "border-[var(--color-navy)] bg-[rgba(11,31,58,0.04)] shadow-[0_10px_24px_rgba(11,31,58,0.08)]"
                      : "border-[var(--color-border)] bg-white hover:border-[rgba(11,31,58,0.3)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={selected}
                    onChange={() => {
                      setPayment(option.id);
                      setPaymentError("");
                    }}
                    className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-red)]"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-base font-semibold text-[var(--color-navy)]">
                      {option.id === "cod" ? (
                        <Banknote className="h-4 w-4 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
                      ) : (
                        <Receipt className="h-4 w-4 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
                      )}
                      {option.label}
                    </span>
                    <span className="mt-1 block text-[13px] leading-5 text-[var(--color-navy-soft)]">
                      {option.detail}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>
          {paymentError ? (
            <p role="alert" className="field-error mt-3">
              {paymentError}
            </p>
          ) : null}
        </section>

        <section className="surface-card p-6 sm:p-8">
          <h2 className="text-3xl text-[var(--color-navy)]">Artwork and notes</h2>
          <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <FileField
              label="Upload artwork"
              name="artwork"
              wide
              accept={ARTWORK_ACCEPT}
              fileName={artwork?.name}
              error={artworkError || undefined}
              hint="Logo, crest or a photo of last season's jersey. PNG, JPG, PDF, AI or SVG up to 3 MB."
              onSelect={(input) => {
                const file = input.files?.[0] ?? null;
                if (file && file.size > MAX_ARTWORK_BYTES) {
                  setArtwork(null);
                  setArtworkError(artworkTooLargeMessage(company.email));
                  input.value = "";
                  return;
                }
                setArtworkError("");
                setArtwork(file);
              }}
            />
            <TextAreaField
              label="Order notes"
              name="notes"
              wide
              rows={4}
              placeholder="Roster sheet is coming by email, home jersey navy with gold numbers, sponsor logo on the left sleeve."
              hint="Anything the designer or the driver should know — a delivery window, a purchase order number, a second color for the away set."
              value={form.notes}
              onChange={set("notes")}
              onBlur={blur("notes")}
            />
          </div>

          {/* Honeypot — hidden from people, irresistible to bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
        </section>
      </div>

      <aside className="grid min-w-0 gap-5 lg:sticky lg:top-28">
        <section className="surface-card p-6">
          <h2 className="text-2xl text-[var(--color-navy)]">Your order</h2>
          <ul className="mt-4 grid gap-4">
            {lines.map((line) => {
              const product = catalog[line.slug];
              if (!product) return null;
              return (
                <li key={line.id} className="border-b border-[var(--color-border)] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-semibold leading-5 text-[var(--color-navy)]">
                      {product.name}
                    </p>
                    <p className="shrink-0 text-base font-semibold text-[var(--color-navy)]">
                      {formatMoney(lineSubtotal(line, product))}
                    </p>
                  </div>
                  <p className="mt-1 text-[13px] leading-5 text-[var(--color-navy-soft)]">
                    {line.quantity} × {formatMoney(product.fromPrice)} per {product.priceUnit}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-[var(--color-navy-soft)]">
                    {sizeSummary(line.sizes, product.sizeRun)}
                  </p>
                  {line.colors ? (
                    <p className="mt-1 text-[13px] leading-5 text-[var(--color-navy-soft)]">
                      Colors: {line.colors}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <dl className="mt-4 grid gap-2 border-t border-[var(--color-border)] pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-navy-soft)]">Pieces</dt>
              <dd className="font-semibold text-[var(--color-navy)]">{count}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-navy-soft)]">Shipping</dt>
              <dd className="font-semibold text-[#0f763c]">Free</dd>
            </div>
          </dl>
          <div
            aria-live="polite"
            className="mt-3 flex items-end justify-between gap-4 border-t border-[var(--color-border)] pt-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
              Estimated total
            </p>
            <p className="font-display text-4xl leading-9 text-[var(--color-navy)]">
              {formatMoney(total)}
            </p>
          </div>
          <p className="mt-2 text-[13px] leading-5 text-[var(--color-navy-soft)]">
            Your invoice confirms the final amount. Stitched decoration or a heavier fabric is priced
            there, and a larger roster lowers the price per piece.
          </p>
          <Link
            href="/cart/"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-navy)]"
          >
            Edit the cart
          </Link>
        </section>

        <section className="surface-card p-6">
          <div className="grid gap-3">
            <FormAlert message={status === "error" ? errorMessage : ""} />
            <SubmitButton sending={status === "sending"} label="Place order" sendingLabel="Placing your order…" />
            <p className="flex gap-2 text-[13px] leading-5 text-[var(--color-navy-soft)]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
              Placing the order costs nothing and charges nothing. You approve a free mockup before
              anything is printed.
            </p>
            <p className="flex gap-2 text-[13px] leading-5 text-[var(--color-navy-soft)]">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
              Free shipping, production 1 to 2 weeks after approval.
            </p>
          </div>
        </section>
      </aside>
    </form>
  );
}
