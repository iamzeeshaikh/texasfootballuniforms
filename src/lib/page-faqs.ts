import data from "@/data/page-faqs.json";

/**
 * Extra FAQs keyed by route (with trailing slash; "/" for home) so every
 * indexable page carries at least ten. This site renders FAQ answers as plain
 * text (the same string feeds FAQPage), so any authored link is reduced to its
 * anchor text.
 */
type Faq = { question: string; answer: string; body?: never };
type Entry = { h2: string; faqs: { q: string; a: string }[] };
const DATA = data as Record<string, Entry>;
const plain = (s: string) => s.replace(/<[^>]+>/g, "");

export const extraFaqs = (route: string): Faq[] =>
  (DATA[route]?.faqs ?? []).map((f) => ({ question: f.q, answer: plain(f.a) }));
export const extraHeading = (route: string) => DATA[route]?.h2 ?? "Frequently asked questions";

export function withExtras<T extends { question: string; answer: string }>(route: string, faqs: T[]): T[] {
  const seen = new Set(faqs.map((f) => f.question.trim().toLowerCase()));
  return [...faqs, ...(extraFaqs(route).filter((f) => !seen.has(f.question.trim().toLowerCase())) as unknown as T[])];
}

export const faqPageSchema = (faqs: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
});
