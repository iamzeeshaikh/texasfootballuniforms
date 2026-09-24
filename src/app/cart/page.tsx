import type { Metadata } from "next";
import Link from "next/link";

import { CartView } from "@/components/cart-view";

/**
 * The cart is one visitor's working document — it has no content of its own and
 * would be an empty page to a crawler, so it is noindexed and left out of the
 * sitemap. `follow` stays on so the links out of it still pass.
 */
export const metadata: Metadata = {
  title: "Your Cart | Texas Football Uniforms",
  description:
    "Review your custom football uniform order: quantities, size breakdown per design, team colors and the estimated total before checkout.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
            Your order
          </p>
          <h1 className="mt-4 text-5xl text-[var(--color-navy)] sm:text-6xl">Your Cart</h1>
          <p className="mt-5 max-w-3xl text-lg">
            Every design needs a size breakdown that adds up to its quantity — that is the roster we
            cut and print against. Minimum 10 per design, mixed sizes all count toward the same 10,
            and shipping is free. You pay online, against a PayPal invoice we email once you approve your design proof.
          </p>
          <p className="mt-4 max-w-3xl text-sm">
            Prefer a written price first?{" "}
            <Link
              href="/contact-us/#quote-form"
              className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
            >
              Ask for a quote
            </Link>{" "}
            or{" "}
            <Link
              href="/design-your-uniform/"
              className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
            >
              design your uniform
            </Link>{" "}
            — both still go to the same team.
          </p>
        </div>

        <div className="mt-8">
          <CartView />
        </div>
      </div>
    </section>
  );
}
