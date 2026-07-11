import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { blogPosts, getBlogPost } from "@/data/blogPosts";
import { createMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not found" };
  return createMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}/`,
  });
}

// Render inline [anchor](/path/) markdown links as internal links.
function renderRichText(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return <Fragment key={i}>{part}</Fragment>;
    const [, label, href] = m;
    return (
      <Link key={i} href={href} className="font-semibold text-red-700 underline underline-offset-2 hover:text-red-800">
        {label}
      </Link>
    );
  });
}

const dateFmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" });

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = post.related.map((s) => getBlogPost(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
    author: { "@type": "Organization", name: "Texas Football Uniforms" },
    publisher: { "@type": "Organization", name: "Texas Football Uniforms", url: SITE_URL },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="section-space">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
            <Link href="/blog/" className="hover:text-red-800">Blog</Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="text-neutral-500">{post.badge}</span>
          </nav>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-neutral-500">
            {dateFmt.format(new Date(post.date))} · {post.readTime}
          </p>
          <p className="mt-6 text-lg leading-8 text-neutral-700">{post.intro}</p>

          <div className="mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold text-neutral-900">{section.heading}</h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="mt-4 text-base leading-8 text-neutral-700">
                    {renderRichText(p)}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 text-base leading-7 text-neutral-700">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                        <span>{renderRichText(b)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="mt-14">
            <h2 className="text-2xl font-bold text-neutral-900">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {post.faq.map((f) => (
                <div key={f.q} className="rounded-2xl border border-neutral-200 p-5">
                  <h3 className="text-base font-semibold text-neutral-900">{f.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-14 rounded-3xl bg-neutral-900 p-8 text-center text-white">
            <p className="text-lg font-semibold">Ready to outfit your team?</p>
            <Link href="/contact-us/#quote-form" className="mt-5 inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700">
              Get a Free Quote
            </Link>
          </div>

          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="text-xl font-bold text-neutral-900">Keep reading</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}/`} className="rounded-2xl border border-neutral-200 p-5 transition hover:border-red-600">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700">{r.badge}</span>
                    <p className="mt-2 font-semibold text-neutral-900">{r.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
