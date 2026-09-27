"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { Minus, Pencil, Plus, Receipt, ShoppingCart, Trash2, Truck } from "lucide-react";

import { QuantityStepper, SizeGrid } from "@/components/size-picker";
import { useCart } from "@/components/cart-provider";
import {
  type CartLine,
  type CartProduct,
  type SizeBreakdown,
  formatMoney,
  gaItems,
  lineSubtotal,
  sizeSummary,
  sizeTotal,
} from "@/lib/cart";
import { gaEvent } from "@/lib/ga";

function LineEditor({
  line,
  product,
  onCancel,
}: {
  line: CartLine;
  product: CartProduct;
  onCancel: () => void;
}) {
  const { updateLine } = useCart();
  const statusId = useId();
  const [quantity, setQuantity] = useState(line.quantity);
  const [sizes, setSizes] = useState<SizeBreakdown>({ ...line.sizes });
  const [colors, setColors] = useState(line.colors);
  const [notes, setNotes] = useState(line.notes);

  const assigned = sizeTotal(sizes);
  // Sizes are optional until production; a partial breakdown still blocks.
  const balanced = assigned === 0 || assigned === quantity;

  return (
    <div className="mt-4 grid gap-5 rounded-[22px] border border-[var(--color-border)] bg-[rgba(11,31,58,0.02)] p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
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

      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${statusId}-colors`} className="field-label">
            Team colors
          </label>
          <input
            id={`${statusId}-colors`}
            type="text"
            className="field-input"
            value={colors}
            placeholder="Navy, gold and white"
            onChange={(event) => setColors(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${statusId}-notes`} className="field-label">
            Names, numbers and logo notes
            <span className="field-optional">Optional</span>
          </label>
          <input
            id={`${statusId}-notes`}
            type="text"
            className="field-input"
            value={notes}
            placeholder="Player names on the back, sponsor on the sleeve"
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            disabled={!balanced}
            onClick={() => {
              updateLine(line.id, { quantity, sizes, colors, notes });
              onCancel();
            }}
            className="btn-submit is-inline"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-navy)]"
          >
            Cancel
          </button>
        </div>
        {!balanced ? (
          <p className="text-[13px] font-semibold leading-5 text-[#b00c26]">
            The sizes have to add up to {quantity} before this can be saved.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function LineCard({ line, product }: { line: CartLine; product: CartProduct }) {
  const { setLineQuantity, removeLine } = useCart();
  const [editing, setEditing] = useState(false);

  return (
    <li id={`line-${line.id}`} className="surface-card scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={480}
            height={360}
            sizes="(min-width: 640px) 160px, 100vw"
            className="h-40 w-full shrink-0 rounded-[18px] object-cover sm:h-28 sm:w-40"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={product.href}
                className="text-2xl leading-7 text-[var(--color-navy)] hover:text-[var(--color-red)]"
              >
                {product.name}
              </Link>
              <p className="mt-1 text-[13px] leading-5 text-[var(--color-navy-soft)]">
                {formatMoney(product.fromPrice)} per {product.priceUnit} · minimum{" "}
                {product.minimum} per design
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeLine(line.id)}
              aria-label={`Remove ${product.name} from the cart`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-navy-soft)] transition hover:border-[var(--color-red)] hover:text-[var(--color-red)]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <dl className="mt-3 grid gap-1.5 text-[13px] leading-5">
            <div className="flex gap-2">
              <dt className="font-semibold text-[var(--color-navy)]">Sizes</dt>
              <dd className="min-w-0 text-[var(--color-navy-soft)]">
                {sizeSummary(line.sizes, product.sizeRun)}
              </dd>
            </div>
            {line.colors ? (
              <div className="flex gap-2">
                <dt className="font-semibold text-[var(--color-navy)]">Colors</dt>
                <dd className="min-w-0 text-[var(--color-navy-soft)]">{line.colors}</dd>
              </div>
            ) : null}
            {line.notes ? (
              <div className="flex gap-2">
                <dt className="font-semibold text-[var(--color-navy)]">Decoration</dt>
                <dd className="min-w-0 text-[var(--color-navy-soft)]">{line.notes}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-[var(--color-border)] bg-white">
                <button
                  type="button"
                  onClick={() => setLineQuantity(line.id, line.quantity - 1)}
                  disabled={line.quantity <= product.minimum}
                  aria-label={`Remove one ${product.priceUnit} of ${product.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-l-full text-[var(--color-navy)] transition hover:bg-[rgba(11,31,58,0.06)] disabled:opacity-35"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-12 text-center text-sm font-semibold text-[var(--color-navy)]">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setLineQuantity(line.id, line.quantity + 1)}
                  aria-label={`Add one ${product.priceUnit} of ${product.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-r-full text-[var(--color-navy)] transition hover:bg-[rgba(11,31,58,0.06)]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setEditing((open) => !open)}
                aria-expanded={editing}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-[13px] font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-navy)]"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                {editing ? "Close editor" : "Edit sizes & details"}
              </button>
            </div>
            <p className="text-xl font-semibold text-[var(--color-navy)]">
              {formatMoney(lineSubtotal(line, product))}
            </p>
          </div>
        </div>
      </div>

      {editing ? <LineEditor line={line} product={product} onCancel={() => setEditing(false)} /> : null}
    </li>
  );
}

/**
 * /cart/ — the full cart, where a roster is actually sized.
 *
 * The quantity steppers move the breakdown with them so a stored line is never
 * out of step; the editor is where a breakdown is set by hand, and its Save
 * button stays disabled until the boxes add up to the quantity. Both paths end
 * at the same invariant, which /api/order then checks again.
 */
export function CartView() {
  const { lines, catalog, total, count, ready } = useCart();

  if (!ready) {
    return (
      <p className="surface-card p-8 text-center text-sm text-[var(--color-navy-soft)]">
        Loading your cart…
      </p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="surface-card p-8 text-center sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)]">
          <ShoppingCart className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-3xl text-[var(--color-navy)]">Your cart is empty</h2>
        <p className="mx-auto mt-3 max-w-xl">
          Pick a garment, set the roster count and split it across the sizes your players wear.
          Minimum 10 per design, and mixed sizes all count toward the same 10.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/all-categories/"
            className="inline-flex rounded-full bg-[var(--color-red)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-navy)]"
          >
            Browse uniforms
          </Link>
          <Link
            href="/design-your-uniform/"
            className="inline-flex rounded-full border-2 border-[var(--color-navy)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white"
          >
            Design your uniform
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
      <ul className="grid gap-5">
        {lines.map((line) => {
          const product = catalog[line.slug];
          if (!product) return null;
          return <LineCard key={line.id} line={line} product={product} />;
        })}
      </ul>

      <div className="grid gap-5 lg:sticky lg:top-28">
        <div className="surface-card p-6">
          <h2 className="text-2xl text-[var(--color-navy)]">Order summary</h2>
          <dl className="mt-4 grid gap-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-navy-soft)]">Designs</dt>
              <dd className="font-semibold text-[var(--color-navy)]">{lines.length}</dd>
            </div>
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
            className="mt-4 flex items-end justify-between gap-4 border-t border-[var(--color-border)] pt-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
              Estimated total
            </p>
            <p className="font-display text-4xl leading-9 text-[var(--color-navy)]">
              {formatMoney(total)}
            </p>
          </div>
          <p className="mt-2 text-[13px] leading-5 text-[var(--color-navy-soft)]">
            Prices are per piece at the 10-piece minimum. Stitched decoration or a heavier fabric is
            priced on your invoice, so this can move before you approve it.
          </p>
          <Link
            href="/checkout/"
            onClick={() =>
              gaEvent("begin_checkout", {
                currency: "USD",
                value: total,
                items: gaItems(lines, catalog),
              })
            }
            className="btn-submit mt-5"
          >
            Checkout
          </Link>
          <Link
            href="/all-categories/"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-navy)]"
          >
            Keep browsing
          </Link>
        </div>

        <div className="surface-card p-6">
          <h2 className="text-2xl text-[var(--color-navy)]">How you pay</h2>
          <div className="mt-4 grid gap-3">
            <p className="flex gap-2.5 text-[13px] leading-5 text-[var(--color-navy-soft)]">
              <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
              <span>
                <strong className="text-[var(--color-navy)]">PayPal invoice</strong> — we email it
                once you approve your design proof, and you pay it by PayPal or by card. No card
                details are collected anywhere on this site.
              </span>
            </p>
            <p className="flex gap-2.5 text-[13px] leading-5 text-[var(--color-navy-soft)]">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
              <span>
                Free mockup within 24 hours, production 1 to 2 weeks after you approve it, free
                shipping to every city in Texas.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
