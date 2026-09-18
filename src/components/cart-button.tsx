"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/cart-provider";

/**
 * Header cart button with a live piece count.
 *
 * The badge counts pieces rather than lines because that is the number a coach
 * is actually tracking against a roster. It stays out of the DOM until the
 * stored cart has been read, so the first paint never shows a zero that then
 * jumps to 34.
 */
export function CartButton() {
  const { count, openCart, ready } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      aria-label={count > 0 ? `Open cart, ${count} pieces` : "Open cart, empty"}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      {ready && count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-red)] px-1 text-[11px] font-bold leading-none text-white"
        >
          {count > 999 ? "999+" : count}
        </span>
      ) : null}
      <span aria-live="polite" className="sr-only">
        {ready ? `${count} pieces in your cart` : ""}
      </span>
    </button>
  );
}
