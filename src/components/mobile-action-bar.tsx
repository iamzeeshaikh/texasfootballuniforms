"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import { MessageCircle, Phone, Send } from "lucide-react";

import { company } from "@/lib/site";
import { whatsAppHref } from "./whatsapp-button";

/**
 * Sticky Call / WhatsApp / Quote bar for phones (< 640px).
 *
 * The header hides the phone number and the "Get a Quote" button below the
 * sm breakpoint, so on a phone the only way to reach us was to open the
 * drawer or scroll to the footer. This bar keeps all three actions one tap
 * away on every route. "Get a Quote" scrolls to the on-page form when the
 * page has one (#quote-form) and otherwise goes to the contact page; the
 * href is the fallback so the link works without JavaScript.
 */
export function MobileActionBar() {
  function handleQuote(event: MouseEvent<HTMLAnchorElement>) {
    const form = document.getElementById("quote-form");
    if (!form) return;
    event.preventDefault();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    const first = form.querySelector<HTMLInputElement>("input:not([type=hidden]):not([tabindex='-1'])");
    window.setTimeout(() => first?.focus({ preventScroll: true }), 450);
  }

  const item =
    "flex flex-1 items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-[0.12em]";

  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-[rgba(11,31,58,0.96)] text-white backdrop-blur-xl sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={company.phoneHref} className={item}>
        <Phone className="h-4 w-4 text-[var(--color-gold)]" aria-hidden />
        Call
      </a>
      <a
        href={whatsAppHref()}
        target="_blank"
        rel="noopener"
        className={`${item} border-x border-white/10`}
        aria-label="WhatsApp us"
      >
        <MessageCircle className="h-4 w-4 text-[#25d366]" aria-hidden />
        WhatsApp
      </a>
      <Link href="/contact-us/#quote-form" onClick={handleQuote} className={`${item} bg-[var(--color-red)]`}>
        <Send className="h-4 w-4" aria-hidden />
        Get a Quote
      </Link>
    </nav>
  );
}
