"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export type Faq = { question: string; answer: string };

type Props = {
  faqs: Faq[];
  /**
   * Index that starts open. The first question is open by default so the
   * section never reads as an empty list of buttons.
   */
  defaultOpen?: number;
  /** Two columns look wrong for an accordion; kept single-column on purpose. */
  className?: string;
};

/**
 * Accessible FAQ accordion.
 *
 * The questions and answers are rendered verbatim from the same array that
 * feeds the page's FAQPage schema, so the two cannot drift — Google requires
 * the schema text to match what a visitor can read, and collapsed-but-present
 * answers are explicitly allowed.
 *
 * Keyboard: each question is a real <button> inside its heading, so Tab reaches
 * it and Enter/Space toggle it. `aria-expanded` and `aria-controls` point at the
 * answer region, which is labelled by the question. One panel is open at a time;
 * the panel animates with a grid-row transition (no fixed max-height guess) and
 * is dropped entirely under `prefers-reduced-motion`.
 */
export function FaqAccordion({ faqs, defaultOpen = 0, className }: Props) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  if (!faqs.length) return null;

  return (
    <div className={`grid gap-3 ${className ?? ""}`}>
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-trigger-${index}`;
        return (
          <div key={index} className="faq-item" data-open={isOpen}>
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="faq-trigger"
              >
                <span className="faq-question">{faq.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} className="faq-panel">
              <div>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
