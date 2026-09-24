"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import { ShoppingCart } from "lucide-react";

import { QuantityStepper, SizeGrid } from "@/components/size-picker";
import { useCart } from "@/components/cart-provider";
import {
  type CartProduct,
  type SizeBreakdown,
  formatMoney,
  sizeTotal,
} from "@/lib/cart";
import { gaEvent } from "@/lib/ga";

/**
 * "Order this design" — the panel under the hero on every product page.
 *
 * This is an addition, not a replacement: the quote form and the uniform
 * designer are both still on the page and still linked from here, because a
 * coach who wants a price before committing is the same coach who orders three
 * weeks later.
 *
 * Nothing about payment happens in this component or anywhere else on the site.
 * The line goes into a cart, the cart goes to a checkout that collects an
 * address, and the money changes hands online against a PayPal invoice sent
 * after the design proof is approved.
 */
export function AddToCart({ product }: { product: CartProduct }) {
  const { addLine } = useCart();
  const statusId = useId();
  const [quantity, setQuantity] = useState(product.minimum);
  const [sizes, setSizes] = useState<SizeBreakdown>({});
  const [colors, setColors] = useState("");
  const [notes, setNotes] = useState("");
  const [colorsError, setColorsError] = useState("");
  const [added, setAdded] = useState(false);

  const assigned = sizeTotal(sizes);
  // Sizes are optional here and confirmed with the roster before production;
  // a half-finished breakdown is still held back, because that is a slip.
  const balanced = assigned === 0 || assigned === quantity;
  const subtotal = quantity * product.fromPrice;

  const blocker = balanced
    ? ""
    : assigned < quantity
      ? `Size the last ${quantity - assigned}, or clear the breakdown and send sizes with your roster.`
      : `That is ${assigned - quantity} more than the quantity — lower a size or raise the quantity.`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdded(false);

    if (!colors.trim()) {
      setColorsError("We print in your colors, so we need them before the mockup.");
      const field = event.currentTarget.querySelector<HTMLInputElement>('[name="colors"]');
      field?.focus({ preventScroll: true });
      field?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    if (!balanced || quantity < product.minimum) return;

    const ok = addLine({ slug: product.slug, quantity, sizes, colors, notes });
    if (!ok) return;

    gaEvent("add_to_cart", {
      currency: "USD",
      value: Math.round(subtotal * 100) / 100,
      items: [
        {
          item_id: product.slug,
          item_name: product.name,
          price: product.fromPrice,
          quantity,
        },
      ],
    });

    setAdded(true);
    setQuantity(product.minimum);
    setSizes({});
    setNotes("");
  }

  return (
    <form
      id="order"
      onSubmit={handleSubmit}
      data-ga-managed=""
      noValidate
      className="surface-card mt-8 scroll-mt-24 p-5 sm:p-6"
    >
      {/* One compact row — quantity, colors, price, button. The size
          breakdown moved into a disclosure below it: the grid of eleven boxes
          was the first thing a coach met on the page and it read as a form to
          fill in before anything could happen (owner, 2026-09-24). Sizes are
          still collected, and still add up before the line can be added. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)]">
            <ShoppingCart className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl text-[var(--color-navy)] sm:text-3xl">Order this uniform</h2>
            <p className="text-[13px] text-[var(--color-navy-soft)]">
              {formatMoney(product.fromPrice)} per {product.priceUnit} · minimum {product.minimum} ·{" "}
              {product.sizesLabel.toLowerCase()} · free shipping
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
            Estimated total
          </p>
          <p className="font-display text-3xl leading-none text-[var(--color-navy)]">
            {formatMoney(subtotal)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_auto] md:items-end">
        <QuantityStepper
          value={quantity}
          min={product.minimum}
          unit={product.priceUnit}
          onChange={setQuantity}
          describedBy={statusId}
          label="How many?"
        />

        <div className="field" data-invalid={colorsError ? "true" : undefined}>
          <label htmlFor={`${statusId}-colors`} className="field-label">
            Team colors
            <span className="field-required" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id={`${statusId}-colors`}
            name="colors"
            type="text"
            className="field-input"
            placeholder="Navy, gold and white"
            value={colors}
            aria-invalid={colorsError ? true : undefined}
            onChange={(event) => {
              setColors(event.target.value);
              if (colorsError && event.target.value.trim()) setColorsError("");
            }}
          />
          {colorsError ? (
            <p role="alert" className="field-error">
              {colorsError}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={!balanced}
          className="btn-submit is-inline h-[52px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Add to cart
        </button>
      </div>

      <details className="tfu-sizes mt-4 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3">
        <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-navy)]">
          Size breakdown and notes
          <span className="ml-2 font-normal text-[var(--color-navy-soft)]">
            {assigned === 0 ? "optional — send sizes with your roster" : `${assigned} of ${quantity} sized`}
          </span>
        </summary>
        <div className="mt-4">
          <SizeGrid
            sizeRun={product.sizeRun}
            sizes={sizes}
            quantity={quantity}
            onChange={setSizes}
            statusId={statusId}
          />
          <div className="field mt-4">
            <label htmlFor={`${statusId}-notes`} className="field-label">
              Names, numbers and logo notes
              <span className="field-optional">Optional</span>
            </label>
            <input
              id={`${statusId}-notes`}
              name="notes"
              type="text"
              className="field-input"
              placeholder="Player names on the back, sponsor on the sleeve"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>
      </details>

      <p aria-live="polite" className="mt-3 text-[13px] font-semibold leading-5">
        {blocker ? (
          <span className="text-[#b00c26]">{blocker}</span>
        ) : added ? (
          <span className="text-[#0f763c]">
            Added to your cart.{" "}
            <Link href="/cart/" className="underline underline-offset-2">
              Review the cart
            </Link>{" "}
            or{" "}
            <Link href="/checkout/" className="underline underline-offset-2">
              go to checkout
            </Link>
            .
          </span>
        ) : (
          <span className="text-[var(--color-navy-soft)]">
            You pay online against the invoice we email after you approve your mockup — nothing is
            charged on this site.{" "}
            <a
              href="#quote-form"
              className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
            >
              Or ask for a written quote
            </a>
            .
          </span>
        )}
      </p>
    </form>
  );
}
