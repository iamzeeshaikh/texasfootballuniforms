"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import { BadgeCheck, Banknote, ShoppingCart, Truck } from "lucide-react";

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
 * address and a payment preference, and the money changes hands either at the
 * door or against an invoice we email.
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
  const balanced = assigned === quantity;
  const subtotal = quantity * product.fromPrice;

  const blocker = !balanced
    ? assigned < quantity
      ? `Size the last ${quantity - assigned} before adding this to the cart.`
      : `That is ${assigned - quantity} more than the quantity — lower a size or raise the quantity.`
    : "";

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
      className="surface-card mt-8 scroll-mt-24 p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)]">
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
            Order online
          </p>
          <h2 className="mt-1 text-3xl text-[var(--color-navy)] sm:text-4xl">
            Order {product.name}
          </h2>
        </div>
      </div>

      <p className="mt-4 max-w-3xl">
        {formatMoney(product.fromPrice)} per {product.priceUnit} at the {product.minimum}-piece
        minimum, sizes {product.sizesLabel.toLowerCase()}. Set the roster count, split it across the
        sizes your players actually wear, and add it to the cart — you pay cash on delivery or by
        bank transfer after we invoice you, never on this site.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
        <QuantityStepper
          value={quantity}
          min={product.minimum}
          unit={product.priceUnit}
          onChange={setQuantity}
          describedBy={statusId}
          label={`How many ${product.priceUnit}s?`}
        />
        <SizeGrid
          sizeRun={product.sizeRun}
          sizes={sizes}
          quantity={quantity}
          onChange={setSizes}
          statusId={statusId}
        />
      </div>

      <div className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
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
          ) : (
            <p className="field-hint">Names or codes both work — PMS or hex if you have them.</p>
          )}
        </div>

        <div className="field">
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
          <p className="field-hint">
            Artwork is uploaded at checkout, and a designer draws your mockup before anything is
            printed.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-[22px] border border-[var(--color-border)] bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
              Estimated total
            </p>
            <p className="mt-1 font-display text-4xl text-[var(--color-navy)]">
              {formatMoney(subtotal)}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[var(--color-navy-soft)]">
              {quantity} × {formatMoney(product.fromPrice)} per {product.priceUnit}. Free shipping.
            </p>
          </div>
          <button
            type="submit"
            disabled={!balanced}
            className="btn-submit is-inline disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Add to cart
          </button>
        </div>
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
              Stitched decoration or a heavier fabric is priced on your invoice, so the estimate
              above can move before you approve it.
            </span>
          )}
        </p>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        {[
          { icon: Banknote, text: "Cash on delivery or bank transfer — no card, no online payment" },
          { icon: BadgeCheck, text: "Free mockup in 24 hours; nothing is printed until you approve" },
          { icon: Truck, text: "Free shipping, production 1 to 2 weeks after approval" },
        ].map(({ icon: Icon, text }) => (
          <p key={text} className="flex gap-2 text-[13px] leading-5 text-[var(--color-navy-soft)]">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
            {text}
          </p>
        ))}
      </div>

      <p className="mt-5 text-sm">
        Want a written price before you commit?{" "}
        <a
          href="#quote-form"
          className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
        >
          Ask for a quote instead
        </a>{" "}
        — the quote path has not gone anywhere.
      </p>
    </form>
  );
}
