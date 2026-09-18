"use client";

import Link from "next/link";
import { useId } from "react";
import { Check, Minus, Plus, Scale, TriangleAlert } from "lucide-react";

import { type SizeBreakdown, balanceSizes, sizeTotal } from "@/lib/cart";

/**
 * Quantity stepper. Starts at the product's minimum, never goes below it, and
 * steps by one — a roster is 23 players, not 20 or 25.
 */
export function QuantityStepper({
  value,
  min,
  unit,
  onChange,
  label = "Quantity",
  describedBy,
}: {
  value: number;
  min: number;
  unit: string;
  onChange: (next: number) => void;
  label?: string;
  describedBy?: string;
}) {
  const id = useId();
  const atMin = value <= min;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
        <span className="field-optional">
          min {min} per design
        </span>
      </label>
      <div className="flex w-full max-w-[16rem] items-center rounded-xl border border-[rgba(11,31,58,0.16)] bg-white shadow-[inset_0_1px_2px_rgba(11,31,58,0.05)]">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={atMin}
          aria-label={`Remove one ${unit}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-l-xl text-[var(--color-navy)] transition hover:bg-[rgba(11,31,58,0.06)] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          step={1}
          value={value}
          aria-describedby={describedBy}
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10);
            onChange(Number.isFinite(next) ? next : min);
          }}
          onBlur={(event) => {
            const next = Number.parseInt(event.target.value, 10);
            if (!Number.isFinite(next) || next < min) onChange(min);
          }}
          className="h-12 w-full min-w-0 border-x border-[rgba(11,31,58,0.12)] bg-transparent text-center text-base font-semibold text-[var(--color-navy)] outline-none [appearance:textfield] focus:bg-[rgba(11,31,58,0.03)] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Add one ${unit}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-r-xl text-[var(--color-navy)] transition hover:bg-[rgba(11,31,58,0.06)]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {atMin ? (
        <p className="field-hint">
          {min} is the minimum per design. Mixed sizes all count toward the same {min}.
        </p>
      ) : null}
    </div>
  );
}

/**
 * The size breakdown: one box per published size, and a running count of what
 * is still unassigned.
 *
 * The sizes offered are the product's own published range out of the site's
 * size chart — nothing is invented here, and a product that stops at Youth XL
 * shows five boxes, not thirteen. The line cannot be added or saved while the
 * boxes do not add up to the quantity, which is why the remaining count is an
 * aria-live region rather than an error that appears only on submit.
 */
export function SizeGrid({
  sizeRun,
  sizes,
  quantity,
  onChange,
  statusId,
}: {
  sizeRun: string[];
  sizes: SizeBreakdown;
  quantity: number;
  onChange: (next: SizeBreakdown) => void;
  statusId?: string;
}) {
  const assigned = sizeTotal(sizes);
  const remaining = quantity - assigned;
  const balanced = remaining === 0;

  function setSize(size: string, raw: string) {
    const parsed = Number.parseInt(raw, 10);
    const count = Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 9999) : 0;
    const next = { ...sizes };
    if (count > 0) next[size] = count;
    else delete next[size];
    onChange(next);
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="field-label">Size breakdown</p>
        <p className="text-[13px] leading-5 text-[var(--color-navy-soft)]">
          Body measurements on the{" "}
          <Link
            href="/size-chart/"
            className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-2"
          >
            size chart
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {sizeRun.map((size) => {
          const count = Number(sizes[size]) || 0;
          return (
            <label
              key={size}
              className={`grid gap-1 rounded-xl border px-2 py-2 transition ${
                count > 0
                  ? "border-[var(--color-navy)] bg-[rgba(11,31,58,0.04)]"
                  : "border-[rgba(11,31,58,0.16)] bg-white"
              }`}
            >
              <span className="text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-[var(--color-navy-soft)]">
                {size}
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={count === 0 ? "" : count}
                placeholder="0"
                aria-label={`${size} quantity`}
                onChange={(event) => setSize(size, event.target.value)}
                className="w-full min-w-0 border-0 bg-transparent p-0 text-center text-lg font-semibold text-[var(--color-navy)] outline-none [appearance:textfield] placeholder:text-[rgba(48,67,93,0.4)] focus:text-[var(--color-red)] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p
          id={statusId}
          aria-live="polite"
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold leading-5 ${
            balanced
              ? "bg-[rgba(15,118,60,0.1)] text-[#0f763c]"
              : "bg-[rgba(200,16,46,0.08)] text-[#b00c26]"
          }`}
        >
          {balanced ? (
            <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          {balanced
            ? `All ${quantity} sizes assigned`
            : remaining > 0
              ? `${assigned} of ${quantity} assigned — ${remaining} still to size`
              : `${assigned} of ${quantity} assigned — ${Math.abs(remaining)} too many`}
        </p>
        {balanced ? null : (
          <button
            type="button"
            onClick={() => onChange(balanceSizes(sizes, quantity, sizeRun))}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3.5 py-2 text-[13px] font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-navy)]"
          >
            <Scale className="h-4 w-4 shrink-0" aria-hidden="true" />
            Match quantity
          </button>
        )}
      </div>
    </div>
  );
}
