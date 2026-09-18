"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, MessageCircle, Phone, X } from "lucide-react";

import { company } from "@/lib/site";
import { whatsAppHref } from "./whatsapp-button";

type City = { name: string; href: string };

export function MobileMenu({ cities }: { cities: City[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="inline-flex items-center justify-center rounded-lg p-2 text-white transition hover:text-[var(--color-gold)] lg:hidden"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full max-h-[80vh] overflow-y-auto border-t border-white/10 bg-[var(--color-navy)] lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6" aria-label="Mobile navigation">
            <Link href="/" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-[var(--color-gold)]">Home</Link>
            <Link href="/design-your-uniform/" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--color-gold)] hover:bg-white/10">Design Your Uniform</Link>
            <Link href="/size-chart/" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-[var(--color-gold)]">Size Chart</Link>
            <Link href="/all-categories/" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-[var(--color-gold)]">Products</Link>
            <Link href="/blog/" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-[var(--color-gold)]">Guides</Link>
            <Link href="/contact-us/" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-[var(--color-gold)]">Contact</Link>

            <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">Locations</p>
            <Link href="/locations/" onClick={close} className="block rounded-lg px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-[var(--color-gold)]">All Texas Cities</Link>
            <div className="grid grid-cols-2 gap-x-2">
              {cities.map((c) => (
                <Link key={c.href} href={c.href} onClick={close} className="block rounded-lg px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-[var(--color-gold)]">{c.name}</Link>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={company.phoneHref} onClick={close} className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]">
                <Phone className="h-4 w-4" aria-hidden />
                {company.phoneDisplay}
              </a>
              <a href={whatsAppHref()} target="_blank" rel="noopener" onClick={close} aria-label="WhatsApp us" className="flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </div>
            <Link href="/design-your-uniform/" onClick={close} className="mt-3 block rounded-full border-2 border-[var(--color-gold)] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">Design Your Uniform</Link>
            <Link href="/contact-us/#quote-form" onClick={close} className="mt-2 block rounded-full bg-[var(--color-red)] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white">Get a Quote</Link>
          </nav>
        </div>
      )}
    </>
  );
}
