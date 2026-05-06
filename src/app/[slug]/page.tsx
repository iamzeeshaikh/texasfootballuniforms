import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Layers3, Shirt, Timer, Trophy, Users2 } from "lucide-react";

import { ImageCarousel } from "@/components/image-carousel";
import { ProductLeadForm } from "@/components/product-lead-form";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildMetaDescription,
  buildMetaTitle,
  buildProductSchema,
  getAllProducts,
  getLongSections,
  getProductBySlug,
  getRelatedProductsBySlug,
} from "@/lib/catalog";
import { createMetadata } from "@/lib/seo";

const featureIcons = [Shirt, Trophy, Users2, Layers3];

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return createMetadata({
    title: buildMetaTitle(product),
    description: buildMetaDescription(product),
    path: `/${product.slug}/`,
    images: [product.heroImage],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const longSections = getLongSections(product);
  const relatedProducts = getRelatedProductsBySlug(product.slug);
  const faqSchema = buildFaqSchema(product);
  const productSchema = buildProductSchema(product);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "All Categories", path: "/all-categories/" },
    { name: product.name, path: `/${product.slug}/` },
  ]);

  return (
    <div className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="surface-card p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                Custom Football Apparel in Texas
              </p>
              <h1 className="mt-5 text-5xl text-[var(--color-navy)] sm:text-6xl">
                {product.name}
              </h1>
              <p className="mt-6 text-lg">{product.shortDescription}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact-us/#quote-form"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-navy)]"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/all-categories/"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-red)]"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {product.featureFocus.map((feature, index) => {
                const Icon = featureIcons[index % featureIcons.length];
                return (
                  <div key={feature} className="surface-card p-5">
                    <Icon className="h-8 w-8 text-[var(--color-red)]" />
                    <p className="mt-4 text-base font-semibold text-[var(--color-navy)]">{feature}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <ImageCarousel images={product.images} altBase={product.name} priority />
        </div>

        <section className="mt-12 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="surface-card p-8 sm:p-10">
            {longSections.map((section) => (
              <div key={section.heading} className="mb-10 last:mb-0">
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
                          <Link href={paragraph.link.href} className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4">
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
          </article>

          <div className="space-y-8">
            <ProductLeadForm productName={product.name} />

            <div className="surface-card overflow-hidden">
              <Image
                src={product.images[1] ?? product.heroImage}
                alt={`${product.name} available sizes and materials`}
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-8">
                <h2 className="text-4xl text-[var(--color-navy)]">Available Sizes &amp; Materials</h2>
                <p className="mt-4">
                  This collection is produced in {product.sizes} using {product.material.toLowerCase()}.
                  We guide teams through fit planning, fabric selection, and personalization
                  choices before production starts.
                </p>
              </div>
            </div>

            <div className="surface-card p-8">
              <h2 className="text-4xl text-[var(--color-navy)]">Specifications</h2>
              <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--color-border)]">
                <table className="w-full border-collapse text-left">
                  <tbody>
                    {[
                      ["Material", product.material],
                      ["Sizes", product.sizes],
                      ["Printing method", product.printing],
                      ["MOQ", product.moq],
                      ["Turnaround time", product.turnaround],
                    ].map(([label, value]) => (
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
              <h2 className="text-4xl text-[var(--color-navy)]">Why Teams Request Quotes</h2>
              <div className="mt-5 space-y-4">
                {[
                  "Premium custom design support",
                  "Roster personalization built into production",
                  "Texas-focused turnaround planning",
                  "No retail pricing clutter or generic stock checkout",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-red)]" />
                    <p className="text-base">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 surface-card p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <Timer className="h-8 w-8 text-[var(--color-red)]" />
            <h2 className="text-4xl text-[var(--color-navy)]">Frequently Asked Questions</h2>
          </div>
          <div className="mt-8 grid gap-5">
            {product.faqs.map((faq) => (
              <div key={faq.question} className="rounded-[24px] border border-[var(--color-border)] bg-white p-6">
                <h3 className="text-2xl text-[var(--color-navy)]">{faq.question}</h3>
                <p className="mt-3">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                Related Categories
              </p>
              <h2 className="mt-4 text-4xl text-[var(--color-navy)] sm:text-5xl">
                Explore More Football Uniform Options
              </h2>
            </div>
            <Link
              href="/all-categories/"
              className="hidden rounded-full bg-[var(--color-navy)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)] md:inline-flex"
            >
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link key={item.slug} href={`/${item.slug}/`} className="surface-card group overflow-hidden">
                <Image
                  src={item.heroImage}
                  alt={`${item.name} custom football product gallery`}
                  width={700}
                  height={520}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="p-5">
                  <h3 className="text-2xl text-[var(--color-navy)]">{item.name}</h3>
                  <p className="mt-3">{item.shortDescription.slice(0, 120)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}
