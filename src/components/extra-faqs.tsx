import { FaqAccordion } from "@/components/faq-accordion";
import { extraFaqs, extraHeading, faqPageSchema } from "@/lib/page-faqs";

/** A FAQ block plus its FAQPage node, for pages that had no FAQs of their own. */
export function ExtraFaqs({ route }: { route: string }) {
  const faqs = extraFaqs(route);
  if (!faqs.length) return null;
  return (
    <section className="section-space">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl text-[var(--color-navy)]">{extraHeading(route)}</h2>
        <FaqAccordion faqs={faqs} className="mt-6" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }} />
    </section>
  );
}
