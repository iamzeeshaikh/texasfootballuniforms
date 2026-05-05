import type { Metadata } from "next";
import Image from "next/image";

import { getAllProducts } from "@/lib/catalog";
import { company } from "@/lib/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About Texas Football Uniforms | Premium Custom Teamwear",
  description:
    "Learn how Texas Football Uniforms supports schools, clubs, and leagues with premium custom football apparel and quote-first service.",
  path: "/about-us/",
});

export default function AboutUsPage() {
  const products = getAllProducts();

  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="surface-card overflow-hidden">
            <Image
              src={products[20].heroImage}
              alt="High school football uniforms for Texas programs"
              width={1200}
              height={1400}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="surface-card p-8 sm:p-10">
            <span className="rounded-full bg-[var(--color-red)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
              About Us
            </span>
            <h1 className="mt-5 text-5xl text-[var(--color-navy)] sm:text-6xl">
              Premium Football Apparel for Texas Teams That Expect More
            </h1>
            <p className="mt-6 text-lg">
              Texas Football Uniforms was built around one idea: football programs should be
              able to source premium custom teamwear without settling for generic stock gear,
              confusing catalog pricing, or disconnected service. We focus on quote-based
              custom production so teams can build the right mix of uniforms, practice apparel,
              sideline layers, and personalized roster details around actual needs.
            </p>
            <p className="mt-5">
              Our collection supports youth leagues, middle school and high school programs,
              7-on-7 organizations, college camps, booster groups, and coaching staffs across
              Texas. We care about performance fabrics, clean graphics, and operational clarity
              because a custom order needs to look premium and feel manageable from approval
              through reorders.
            </p>
            <p className="mt-5">
              If your program needs game uniforms, roster-specific jerseys, outerwear, or
              branded accessories, we keep the process centered on communication, artwork
              control, and a stronger final presentation.
            </p>
            <div className="mt-8 rounded-[24px] border border-[var(--color-border)] bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
                Contact
              </p>
              <p className="mt-3">{company.addressLines.join(", ")}</p>
              <p className="mt-1">{company.phoneDisplay}</p>
              <p className="mt-1">{company.email}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
