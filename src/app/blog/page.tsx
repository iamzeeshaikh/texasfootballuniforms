import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/data/blogPosts";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Football Uniform Blog: Design, Fabric & Team Kit Guides | Texas Football Uniforms",
  description:
    "Guides for coaches and teams on custom football uniforms — designing uniforms, choosing jersey fabric, personalization, buying by level, and building a team kit.",
  path: "/blog/",
});

const dateFmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Team Uniform Guides</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Texas Football Uniforms Blog
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Practical guides for coaches and teams — designing custom uniforms, choosing fabric, personalizing jerseys,
          and building a complete team kit.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-red-600 hover:shadow-lg"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700">{post.badge}</span>
              <h2 className="mt-3 text-lg font-bold leading-snug text-neutral-900">{post.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">{post.excerpt}</p>
              <span className="mt-5 text-xs text-neutral-500">
                {dateFmt.format(new Date(post.date))} · {post.readTime}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
