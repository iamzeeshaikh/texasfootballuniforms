import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Layers3, Shirt, Timer, Trophy, Users2 } from "lucide-react";

import { AddToCart } from "@/components/add-to-cart";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ImageCarousel } from "@/components/image-carousel";
import { MoneySections } from "@/components/money-sections";
import { FaqAccordion } from "@/components/faq-accordion";
import { PriceFacts, PriceNotes } from "@/components/price-facts";
import { ProductLeadForm } from "@/components/product-lead-form";
import { RelatedGuides } from "@/components/related-guides";
import { DesignYourUniform } from "@/components/design-your-uniform";
import {
  buildFaqSchema,
  buildMetaDescription,
  buildMetaTitle,
  buildProductSchema,
  getAllProducts,
  getCategoryGroup,
  getCategorySlug,
  getPriceFacts,
  moqCount,
  getLongSections,
  getProductBySlug,
  getRelatedProductsBySlug,
} from "@/lib/catalog";
import { getGuidesForProduct } from "@/data/blogPosts";
import { designAddOnForProduct, designGarmentForProduct, getDesignOptions } from "@/lib/design-tool";
import { getMoneyPage } from "@/lib/money-pages";
import { buildCartCatalog } from "@/lib/cart-catalog";
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
  const cartProduct = buildCartCatalog()[product.slug];
  const designOptions = getDesignOptions();
  const moneyPage = getMoneyPage(product.slug);
  const relatedProducts = getRelatedProductsBySlug(product.slug);
  const guides = getGuidesForProduct(product.slug);
  const faqSchema = buildFaqSchema(product);
  const productSchema = buildProductSchema(product);
  // The trail names the product's real category. It used to say
  // "All Categories", which told Google and the reader nothing about where
  // the page sits.
  const categoryGroup = getCategoryGroup(product);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: categoryGroup, path: `/categories/${getCategorySlug(categoryGroup)}/` },
    { name: product.name, path: `/${product.slug}/` },
  ];

  return (
    <div className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="surface-card p-8 sm:p-10">
              <Breadcrumbs items={crumbs} />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                Custom Football Apparel in Texas
              </p>
              <h1 className="mt-5 text-5xl text-[var(--color-navy)] sm:text-6xl">
                {product.name}
              </h1>
              <PriceFacts facts={getPriceFacts(product)} />
              <p className="mt-6 text-lg">{product.shortDescription}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#quote-form"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-navy)]"
                >
                  Get a Quote
                </a>
                <Link
                  href={`/design-your-uniform/?product=${designGarmentForProduct(product.slug) ?? product.slug}`}
                  className="inline-flex items-center justify-center rounded-full border-2 border-[var(--color-navy)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white"
                >
                  Design this uniform
                </Link>
                <Link
                  href="/all-categories/"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-red)]"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Ordering sits directly under the hero, ahead of the quote form
                and the long copy. The quote form is still below it: a coach who
                wants a written price first has lost nothing. */}
            {cartProduct ? <AddToCart product={cartProduct} /> : null}

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

        {/* The quote form sits directly under the hero, before the long copy.
            It used to live halfway down the page behind roughly a thousand
            words, which is the wrong order on a phone. */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <ProductLeadForm
            productName={product.name}
            heading={`Get a Quote for ${product.name}`}
            blurb={`Send your roster count, colors, and dates. Minimum 10 per design, ${product.turnaround}, and a free mockup within 24 hours.`}
          />
          <div className="surface-card p-8">
            <h2 className="text-4xl text-[var(--color-navy)]">Why Teams Request Quotes</h2>
            <div className="mt-5 space-y-4">
              {[
                `Minimum 10 per design, so a single squad can order`,
                `Free digital mockup within 24 hours of your request`,
                `${product.turnaround.charAt(0).toUpperCase()}${product.turnaround.slice(1)}`,
                "Roster personalization built into production, not added after",
                "Texas-focused delivery planned around your season",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-red)]" />
                  <p className="text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="surface-card order-2 min-w-0 p-8 sm:p-10 lg:order-none">
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

          <div className="order-1 min-w-0 space-y-8 lg:order-none">
            <div className="surface-card overflow-hidden">
              <Image
                src={product.images[1] ?? product.heroImage}
                alt={`${product.name} available sizes and materials`}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 44vw, 100vw"
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
              <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--color-border)]">
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
              <p className="mt-5 text-sm">
                Measuring a roster? Our{" "}
                <Link
                  href="/size-chart/"
                  className="font-semibold text-[var(--color-red)] underline decoration-[var(--color-gold)] underline-offset-4"
                >
                  football uniform size chart
                </Link>{" "}
                covers jerseys, pants and warm-ups from youth XS to adult 5XL, and a free loaner
                sizing kit is available before you order.
              </p>
            </div>

          </div>
        </section>

        {moneyPage ? <MoneySections page={moneyPage} /> : null}

        <PriceNotes unit={product.priceUnit} minimum={moqCount(product)} />

        <DesignYourUniform
          options={designOptions}
          productName={product.name}
          preselectGarment={designGarmentForProduct(product.slug)}
          preselectAddOn={designAddOnForProduct(product.slug)}
          heading={`Design your ${product.name.toLowerCase()}`}
        />

        {/* The questions and answers come from the same `product.faqs` array
            that builds the FAQPage schema below, so collapsing them cannot put
            the markup and the visible text out of step. */}
        <section className="mt-12 surface-card p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)]">
              <Timer className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-3xl text-[var(--color-navy)] sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="mt-3 max-w-3xl">
            Tap a question to open the answer. Everything below is written for{" "}
            {product.name.toLowerCase()}.
          </p>
          <FaqAccordion faqs={product.faqs} className="mt-6" />
        </section>

        <RelatedGuides guides={guides} productName={product.name} />

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
                  sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
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
    </div>
  );
}
