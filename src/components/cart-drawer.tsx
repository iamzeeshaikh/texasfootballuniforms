"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Banknote, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";

import { useCart } from "@/components/cart-provider";
import { formatMoney, gaItems, lineSubtotal, sizeSummary } from "@/lib/cart";
import { gaEvent } from "@/lib/ga";

/**
 * The cart drawer: opens when a line is added, and from the header button.
 *
 * Quantity is editable here, and every change runs through the provider's
 * `setLineQuantity`, which moves the size breakdown with it — the stored line
 * is never left with sizes that miss its quantity. Re-sizing a roster by hand
 * belongs on /cart/, which this links to.
 */
export function CartDrawer() {
  const { lines, catalog, total, count, isOpen, closeCart, setLineQuantity, removeLine } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeCart, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 h-full w-full cursor-default bg-[rgba(11,31,58,0.55)] backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[var(--color-shell)] shadow-[-20px_0_60px_rgba(11,31,58,0.28)]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)]">
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl leading-6 text-[var(--color-navy)]">Your cart</h2>
              <p className="text-[13px] leading-5 text-[var(--color-navy-soft)]">
                {count} {count === 1 ? "piece" : "pieces"} · {lines.length}{" "}
                {lines.length === 1 ? "design" : "designs"}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-navy)] transition hover:border-[var(--color-navy)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {lines.length === 0 ? (
            <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 text-center">
              <p className="text-base font-semibold text-[var(--color-navy)]">Your cart is empty</p>
              <p className="mt-2 text-sm text-[var(--color-navy-soft)]">
                Pick a garment, set the roster count and split it across sizes. Minimum 10 per
                design.
              </p>
              <Link
                href="/all-categories/"
                onClick={closeCart}
                className="mt-5 inline-flex rounded-full bg-[var(--color-red)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
              >
                Browse uniforms
              </Link>
            </div>
          ) : (
            <ul className="grid gap-4">
              {lines.map((line) => {
                const product = catalog[line.slug];
                if (!product) return null;
                return (
                  <li
                    key={line.id}
                    className="rounded-[22px] border border-[var(--color-border)] bg-white p-4"
                  >
                    <div className="flex gap-3">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={160}
                          height={160}
                          sizes="72px"
                          className="h-18 w-18 shrink-0 rounded-xl object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={product.href}
                          onClick={closeCart}
                          className="text-base font-semibold leading-5 text-[var(--color-navy)] hover:text-[var(--color-red)]"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-[13px] leading-5 text-[var(--color-navy-soft)]">
                          {formatMoney(product.fromPrice)} per {product.priceUnit}
                        </p>
                        {line.colors ? (
                          <p className="mt-1 text-[13px] leading-5 text-[var(--color-navy-soft)]">
                            Colors: {line.colors}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        aria-label={`Remove ${product.name} from the cart`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-full border border-[var(--color-border)] text-[var(--color-navy-soft)] transition hover:border-[var(--color-red)] hover:text-[var(--color-red)]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <p className="mt-3 text-[13px] leading-5 text-[var(--color-navy-soft)]">
                      <span className="font-semibold text-[var(--color-navy)]">Sizes:</span>{" "}
                      {sizeSummary(line.sizes, product.sizeRun)}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-[var(--color-border)] bg-white">
                        <button
                          type="button"
                          onClick={() => setLineQuantity(line.id, line.quantity - 1)}
                          disabled={line.quantity <= product.minimum}
                          aria-label={`Remove one ${product.priceUnit} of ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-l-full text-[var(--color-navy)] transition hover:bg-[rgba(11,31,58,0.06)] disabled:opacity-35"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="min-w-10 text-center text-sm font-semibold text-[var(--color-navy)]">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setLineQuantity(line.id, line.quantity + 1)}
                          aria-label={`Add one ${product.priceUnit} of ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-r-full text-[var(--color-navy)] transition hover:bg-[rgba(11,31,58,0.06)]"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-base font-semibold text-[var(--color-navy)]">
                        {formatMoney(lineSubtotal(line, product))}
                      </p>
                    </div>

                    <p className="mt-2 text-[12px] leading-5 text-[var(--color-navy-soft)]">
                      Changing the quantity moves the breakdown with it.{" "}
                      <Link
                        href={`/cart/#line-${line.id}`}
                        onClick={closeCart}
                        className="font-semibold text-[var(--color-red)] underline underline-offset-2"
                      >
                        Edit sizes
                      </Link>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 ? (
          <footer className="border-t border-[var(--color-border)] bg-white px-5 py-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
                  Estimated total
                </p>
                <p className="font-display text-3xl leading-8 text-[var(--color-navy)]">
                  {formatMoney(total)}
                </p>
              </div>
              <p className="text-right text-[12px] leading-4 text-[var(--color-navy-soft)]">
                Free shipping
                <br />
                on every order
              </p>
            </div>
            <p className="mt-3 flex gap-2 text-[12px] leading-4 text-[var(--color-navy-soft)]">
              <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
              Cash on delivery or bank transfer after we invoice you. No payment is taken on this
              site.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link
                href="/cart/"
                onClick={closeCart}
                className="inline-flex items-center justify-center rounded-full border-2 border-[var(--color-navy)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white"
              >
                View cart
              </Link>
              <Link
                href="/checkout/"
                onClick={() => {
                  gaEvent("begin_checkout", {
                    currency: "USD",
                    value: total,
                    items: gaItems(lines, catalog),
                  });
                  closeCart();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-red)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-navy)]"
              >
                Checkout
              </Link>
            </div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
