import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/checkout-form";

/**
 * Noindexed and out of the sitemap: a checkout is one visitor's form, not a
 * page with anything to rank for. `follow` stays on.
 */
export const metadata: Metadata = {
  title: "Checkout | Texas Football Uniforms",
  description:
    "Place your custom football uniform order: shipping address, needed-by date and payment by the PayPal invoice we email after proof approval. No card details are collected.",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
            Checkout
          </p>
          <h1 className="mt-4 text-5xl text-[var(--color-navy)] sm:text-6xl">Place Your Order</h1>
          <p className="mt-5 max-w-3xl text-lg">
            One way to pay, and no card fields on this site. You approve your free design proof
            first, then we email you a PayPal invoice you can pay by PayPal or by card — so nothing
            is charged before then. Shipping is free, and production runs 1 to 2 weeks after you
            approve the design.
          </p>
          <p className="mt-4 max-w-3xl text-sm">
            Would rather talk it through first?{" "}
            <Link
              href="/contact-us/#quote-form"
              className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
            >
              Ask for a written quote
            </Link>{" "}
            — placing an order here does not replace that, it just skips the wait.
          </p>
        </div>

        <div className="mt-8">
          <CheckoutForm />
        </div>
      </div>
    </section>
  );
}
