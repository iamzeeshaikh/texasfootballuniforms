import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileBadge2,
  Palette,
  Send,
  Shirt,
  Truck,
} from "lucide-react";

import { ProductLeadForm } from "@/components/product-lead-form";
import {
  buildBreadcrumbSchema,
  buildCategoryCollectionSchema,
  buildCategoryFaqSchema,
  getCategoryBySlug,
  getCategoryBulletSections,
  getCategoryClosingContent,
  getCategoryComparison,
  getCategoryFaqs,
  getCategoryLongSections,
  getCategoryMetaDescription,
  getCategoryMetaTitle,
  getCategoryOrderSteps,
  getCategoryPages,
  getCategorySlug,
  getCategorySpecs,
  getProductsByCategoryGroup,
} from "@/lib/catalog";
import { createMetadata } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return getCategoryPages().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryPage = getCategoryBySlug(category);

  if (!categoryPage) {
    return {};
  }

  const products = getProductsByCategoryGroup().find(
    (item) => getCategorySlug(item.group) === categoryPage.slug,
  )?.products;

  return createMetadata({
    title: getCategoryMetaTitle(categoryPage),
    description: getCategoryMetaDescription(categoryPage),
    path: `/categories/${categoryPage.slug}/`,
    images: products?.[0]?.heroImage ? [products[0].heroImage] : undefined,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryPage = getCategoryBySlug(category);

  if (!categoryPage) {
    notFound();
  }

  const grouped = getProductsByCategoryGroup().find(
    (item) => getCategorySlug(item.group) === categoryPage.slug,
  );

  if (!grouped) {
    notFound();
  }

  const longSections = getCategoryLongSections(categoryPage);
  const closingContent = getCategoryClosingContent(categoryPage);
  const bulletSections = getCategoryBulletSections(categoryPage);
  const comparison = getCategoryComparison(categoryPage);
  const specs = getCategorySpecs(categoryPage);
  const orderSteps = getCategoryOrderSteps(categoryPage);
  const faqs = getCategoryFaqs(categoryPage);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "All Categories", path: "/all-categories/" },
    { name: categoryPage.group, path: `/categories/${categoryPage.slug}/` },
  ]);
  const collectionSchema = buildCategoryCollectionSchema(categoryPage, grouped.products);
  const faqSchema = buildCategoryFaqSchema(categoryPage);

  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="surface-card p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
              Football Category
            </p>
            <h1 className="mt-5 text-5xl text-[var(--color-navy)] sm:text-6xl">
              {categoryPage.title}
            </h1>
            <p className="mt-6 text-lg">{categoryPage.intro}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                `${grouped.products.length} relevant product pages`,
                "Texas-focused buyer guidance",
                "Quote-based customization support",
                "Category-to-product navigation built for discovery",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-[22px] border border-[var(--color-border)] bg-white p-4 shadow-[0_10px_24px_rgba(11,31,58,0.04)]"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-red)]" />
                  <p className="text-base">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact-us/#quote-form"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-navy)]"
              >
                Get a Quote
              </Link>
              <Link
                href="#category-products"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-red)]"
              >
                View Products
              </Link>
            </div>
          </div>

          <div className="surface-card overflow-hidden">
            <Image
              src={grouped.products[0].heroImage}
              alt={`${categoryPage.title} for Texas football teams`}
              width={1400}
              height={1050}
              className="aspect-[4/3] w-full object-contain bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-8"
            />
          </div>
        </div>

        <div className="mt-12" id="category-products">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-8 flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                    Category Collection
                  </p>
                  <h2 className="mt-4 text-4xl text-[var(--color-navy)] sm:text-5xl">
                    Explore {categoryPage.group}
                  </h2>
                </div>
                <p className="hidden rounded-full bg-[var(--color-navy)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)] md:inline-flex">
                  {grouped.products.length} pages
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {grouped.products.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/${product.slug}/`}
                    className="surface-card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,31,58,0.12)]"
                  >
                    <Image
                      src={product.heroImage}
                      alt={`${product.name} custom football collection`}
                      width={900}
                      height={720}
                      className="aspect-[5/4] w-full object-contain bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-4 transition duration-500 group-hover:scale-[1.04] sm:p-5"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                        {categoryPage.group}
                      </p>
                      <h2 className="mt-3 text-3xl text-[var(--color-navy)]">{product.name}</h2>
                      <p className="mt-3 flex-1">{product.shortDescription.slice(0, 150)}...</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-red)]">
                        View Product
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <ProductLeadForm productName={categoryPage.title} />
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="surface-card p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
              Category Buying Guide
            </p>
            {longSections.map((section) => (
              <div key={section.heading} className="mt-10 first:mt-6">
                <h2 className="text-4xl text-[var(--color-navy)]">{section.heading}</h2>
                {section.subheading ? (
                  <h3 className="mt-3 text-xl text-[var(--color-red)]">{section.subheading}</h3>
                ) : null}
                <div className="mt-5 space-y-5">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.heading}-${index}`}>
                      {paragraph.lead}
                      {paragraph.link ? (
                        <>
                          {" "}
                          <Link
                            href={paragraph.link.href}
                            className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
                          >
                            {paragraph.link.label}
                          </Link>
                        </>
                      ) : null}
                      {paragraph.tail ? ` ${paragraph.tail}` : null}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-10 rounded-[26px] border border-[var(--color-border)] bg-white p-6 shadow-[0_10px_24px_rgba(11,31,58,0.04)]">
              <h2 className="text-4xl text-[var(--color-navy)]">{comparison.heading}</h2>
              <div className="mt-6 overflow-hidden rounded-[22px] border border-[var(--color-border)]">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[rgba(11,31,58,0.03)]">
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)]">
                        Feature
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)]">
                        Option A
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)]">
                        Option B
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.rows.map(([feature, a, b]) => (
                      <tr key={feature} className="border-b border-[var(--color-border)] last:border-b-0">
                        <th className="px-5 py-4 text-sm font-semibold text-[var(--color-navy)]">{feature}</th>
                        <td className="px-5 py-4 text-sm text-[var(--color-navy-soft)]">{a}</td>
                        <td className="px-5 py-4 text-sm text-[var(--color-navy-soft)]">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {bulletSections.map((section) => (
              <div
                key={section.heading}
                className="mt-10 rounded-[26px] border border-[var(--color-border)] bg-white p-6 shadow-[0_10px_24px_rgba(11,31,58,0.04)]"
              >
                <h2 className="text-4xl text-[var(--color-navy)]">{section.heading}</h2>
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-red)]" />
                      <p>{bullet}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-10 rounded-[26px] border border-[var(--color-border)] bg-white p-6 shadow-[0_10px_24px_rgba(11,31,58,0.04)]">
              <h2 className="text-4xl text-[var(--color-navy)]">{closingContent.heading}</h2>
              {closingContent.subheading ? (
                <h3 className="mt-3 text-xl text-[var(--color-red)]">{closingContent.subheading}</h3>
              ) : null}
              <div className="mt-5 space-y-5">
                {closingContent.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>

          <div className="space-y-8">
            <div className="surface-card p-8">
              <div className="flex items-center gap-3">
                <FileBadge2 className="h-7 w-7 text-[var(--color-red)]" />
                <h2 className="text-4xl text-[var(--color-navy)]">Specifications</h2>
              </div>
              <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--color-border)]">
                <table className="w-full border-collapse text-left">
                  <tbody>
                    {specs.map(([label, value]) => (
                      <tr key={label} className="border-b border-[var(--color-border)] last:border-b-0">
                        <th className="w-1/3 bg-[rgba(11,31,58,0.03)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)]">
                          {label}
                        </th>
                        <td className="px-5 py-4 text-sm text-[var(--color-navy-soft)]">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="surface-card p-8">
              <div className="flex items-center gap-3">
                <Send className="h-7 w-7 text-[var(--color-red)]" />
                <h2 className="text-4xl text-[var(--color-navy)]">How to Order</h2>
              </div>
              <div className="mt-6 space-y-4">
                {orderSteps.map((step, index) => {
                  const icons = [Shirt, Palette, ClipboardCheck, CheckCircle2, Truck];
                  const Icon = icons[index];

                  return (
                    <div
                      key={step.title}
                      className="rounded-[22px] border border-[var(--color-border)] bg-white p-5 shadow-[0_10px_24px_rgba(11,31,58,0.04)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
                            Step {index + 1}
                          </p>
                          <h3 className="text-2xl text-[var(--color-navy)]">{step.title}</h3>
                        </div>
                      </div>
                      <p className="mt-3">{step.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 surface-card p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-[var(--color-red)]" />
            <h2 className="text-4xl text-[var(--color-navy)]">Frequently Asked Questions</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-[24px] border border-[var(--color-border)] bg-white p-6">
                <h3 className="text-2xl text-[var(--color-navy)]">{faq.question}</h3>
                <p className="mt-3">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[34px] bg-[linear-gradient(135deg,#08172c_0%,#0b1f3a_42%,#12305e_100%)] p-8 shadow-[0_24px_60px_rgba(11,31,58,0.22)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Ready to Start
          </p>
          <h2 className="mt-5 text-4xl text-white sm:text-5xl">
            Ready to Build {categoryPage.title} for Your Texas Team?
          </h2>
          <p className="mt-4 max-w-3xl text-white/74">
            Share your team colors, logo, roster details, and preferred style. Our team will
            help create a quote-based solution for your Texas program using the right products
            from this category.
          </p>
          <div className="mt-8">
            <Link
              href="/contact-us/#quote-form"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-[var(--color-navy)]"
            >
              Request a Free Quote
            </Link>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
