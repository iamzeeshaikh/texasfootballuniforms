import { ExtraFaqs } from "@/components/extra-faqs";
import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { getBlogPostsNewestFirst } from "@/data/blogPosts";
import { getProductBySlug } from "@/lib/catalog";
import { createMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Football Uniform Guides | Design, Fabric, Sizing & Kits",
  description:
    "Guides for Texas coaches ordering custom football uniforms: design, fabric, names, numbers, sizing, team kits. Min 10 per design, free 24-hour mockup.",
  path: "/blog/",
});

const dateFmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function BlogIndexPage() {
  const posts = getBlogPostsNewestFirst();

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog/#blog`,
    url: `${SITE_URL}/blog/`,
    name: "Football Uniform Guides",
    description:
      "Guides for coaches and athletic directors ordering custom football uniforms in Texas.",
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}/`,
      datePublished: post.date,
      dateModified: post.dateModified,
      author: { "@id": `${SITE_URL}/#organization` },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />

      <section className="section-space">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Guides", path: "/blog/" }]} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-red-700">
            Team Uniform Guides
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Football Uniform Guides
          </h1>
          <div className="mt-4 max-w-3xl space-y-4 text-neutral-600">
            <p>
              Ordering for a roster is a different job from buying a jersey. You are working
              to a game date, a budget per player and a size run that has to fit everybody
              from a youth medium to an adult 3XL — and the decisions that cost the most to
              undo are all made before anything is printed.
            </p>
            <p>
              These {posts.length} guides cover the ones that come up every season: how to
              build a design that still reads from the stands, which jersey fabric suits
              which format, how names and numbers change a quote, what differs between youth,
              high school and college builds, and what actually belongs in a full team kit.
              Each one names the product pages it refers to, so you can go from reading to a
              quote in one click. Every price quoted is the published starting price at the
              10-piece minimum.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const product = getProductBySlug(post.primaryProduct);
              return (
                <article
                  key={post.slug}
                  className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-red-600 hover:shadow-lg"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700">
                    {post.badge}
                  </span>
                  <h2 className="mt-3 text-lg font-bold leading-snug text-neutral-900">
                    <Link href={`/blog/${post.slug}/`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">{post.excerpt}</p>
                  {product && (
                    <p className="mt-4 text-xs text-neutral-500">
                      Covers{" "}
                      <Link
                        href={`/${product.slug}/`}
                        className="font-semibold text-red-700 underline underline-offset-2"
                      >
                        {product.name}
                      </Link>
                    </p>
                  )}
                  <span className="mt-3 text-xs text-neutral-500">
                    {dateFmt.format(new Date(post.date))} · {post.readTime}
                  </span>
                </article>
              );
            })}
          </div>

          <div className="mt-12 rounded-3xl bg-neutral-900 p-8 text-center text-white">
            <p className="text-lg font-semibold">
              Done reading? Send us the roster count and the date.
            </p>
            <p className="mt-2 text-sm text-white/70">
              Written quote and a free mockup back within one business day.
            </p>
            <Link
              href="/contact-us/#quote-form"
              className="mt-5 inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
      <ExtraFaqs route="/blog/" />
    </>
  );
}
