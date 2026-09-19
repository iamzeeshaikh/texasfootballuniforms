"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Banknote, Check, Copy, Receipt } from "lucide-react";

import { useCart } from "@/components/cart-provider";
import { ORDER_STORAGE_KEY, type PaymentMethod, formatMoney, paymentMethodLabel } from "@/lib/cart";
import { company } from "@/lib/site";

type StoredOrder = {
  reference?: string;
  total?: number;
  paymentMethod?: PaymentMethod;
  email?: string;
  at?: number;
};

/** Older than this and it belongs to an earlier visit, not the order just placed. */
const MAX_AGE_MS = 30 * 60 * 1000;

/**
 * What happens next, in the order it happens — with the money step shown where
 * it really falls for the method the buyer picked, never at checkout.
 */
function stepsFor(payment?: PaymentMethod) {
  return [
    {
      title: "Free design proof within 24 hours",
      text: "A designer draws your uniform in your colors, with your names, numbers and logo, and emails it to you.",
    },
    {
      title: "You approve it",
      text: "Ask for changes as many times as you need. Nothing is cut or printed until you say yes.",
    },
    ...(payment === "paypal"
      ? [
          {
            title: "We email you a PayPal invoice",
            text: "It goes out once you have approved the proof — never before, and never from this website.",
          },
        ]
      : []),
    {
      title: "Production, 1 to 2 weeks",
      text: "The run starts the day you approve the design, not the day you ordered.",
    },
    {
      title: "Free shipping",
      text: "Every order ships free, anywhere in the US, and you get tracking when it leaves us.",
    },
    ...(payment === "cod"
      ? [
          {
            title: "Pay the driver on delivery",
            text: "Cash, when your order reaches you. Nothing is charged before then.",
          },
        ]
      : []),
  ];
}

/**
 * /order-confirmed/ — the reference, what happens next, and the moment the cart
 * is emptied.
 *
 * The cart is cleared here rather than in the checkout form on purpose: a buyer
 * whose browser dropped the redirect still has their order sitting in the cart
 * instead of an empty one and no idea what happened.
 */
export function OrderConfirmation() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [copied, setCopied] = useState(false);

  // Deferred a tick for the same reason <SubmittedSpec> defers: the page is
  // prerendered without an order in it, so this is a follow-up update.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      clearCart();
      try {
        const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
        if (!raw) return;
        window.sessionStorage.removeItem(ORDER_STORAGE_KEY);
        const parsed = JSON.parse(raw) as StoredOrder;
        if (!parsed?.reference) return;
        if (parsed.at && Date.now() - parsed.at > MAX_AGE_MS) return;
        setOrder(parsed);
      } catch {
        // Blocked storage: the generic copy below still tells the buyer what happens.
      }
    }, 0);
    return () => window.clearTimeout(timer);
    // Once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payment = order?.paymentMethod;
  const steps = stepsFor(payment);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <div className="surface-card p-6 text-center sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(15,118,60,0.12)] text-[#0f763c]">
          <Check className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-4xl text-[var(--color-navy)] sm:text-5xl">
          Order placed — thank you
        </h1>

        {order?.reference ? (
          <>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-navy-soft)]">
              Your order reference
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <p className="font-display text-4xl tracking-[0.08em] text-[var(--color-navy)] sm:text-5xl">
                {order.reference}
              </p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard
                    ?.writeText(order.reference as string)
                    .then(() => setCopied(true))
                    .catch(() => setCopied(false));
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-navy)]"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p aria-live="polite" className="mt-3 text-sm">
              A confirmation is on its way to{" "}
              <strong className="text-[var(--color-navy)]">{order.email}</strong>. Quote{" "}
              {order.reference} whenever you call or write.
            </p>
            {typeof order.total === "number" ? (
              <p className="mt-2 text-sm">
                Estimated total{" "}
                <strong className="text-[var(--color-navy)]">{formatMoney(order.total)}</strong>,
                free shipping. Your invoice confirms the final amount.
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-4">
            Your order is with our uniform team and a confirmation email is on its way with your
            reference number. If it has not arrived within the hour, call {company.phoneDisplay} and
            we will read it to you.
          </p>
        )}

        {payment ? (
          <p className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-[20px] bg-[rgba(11,31,58,0.04)] p-4 text-left text-sm leading-6">
            {payment === "cod" ? (
              <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
            ) : (
              <Receipt className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-red)]" aria-hidden="true" />
            )}
            <span>
              <strong className="text-[var(--color-navy)]">{paymentMethodLabel(payment)}.</strong>{" "}
              {payment === "cod"
                ? "You pay the driver in cash when your order arrives. Nothing has been charged, and this site never asked for a card."
                : "We email you a PayPal invoice once you approve your design proof. Nothing has been charged, and this site never asked for a card."}
            </span>
          </p>
        ) : null}
      </div>

      <ol className="mt-8 grid gap-4">
        {steps.map((step, index) => (
          <li key={step.title} className="surface-card flex gap-4 p-5 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-sm font-bold text-[var(--color-gold)]">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-base font-semibold text-[var(--color-navy)]">{step.title}</p>
              <p className="mt-1 text-sm">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex rounded-full bg-[var(--color-red)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-navy)]"
        >
          Back to home
        </Link>
        <Link
          href="/all-categories/"
          className="inline-flex rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-red)]"
        >
          Browse uniforms
        </Link>
        <a
          href={company.phoneHref}
          className="inline-flex rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-red)]"
        >
          Call {company.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
