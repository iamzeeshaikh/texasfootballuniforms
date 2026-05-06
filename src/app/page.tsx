import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BrushCleaning,
  Building2,
  Check,
  ClipboardCheck,
  Flag,
  Layers3,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Trophy,
  Truck,
} from "lucide-react";

import { ImageCarousel } from "@/components/image-carousel";
import { QuoteForm } from "@/components/quote-form";
import { getAllProducts } from "@/lib/catalog";
import { company } from "@/lib/site";

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Elite Fabric Standards",
    text: "Performance-driven materials, durable stitching, and color stability built for long Texas seasons.",
  },
  {
    icon: Palette,
    title: "Design-Led Customization",
    text: "Every order is shaped around logos, trim placement, roster details, and cleaner program identity.",
  },
  {
    icon: Layers3,
    title: "Full Program Coverage",
    text: "Uniforms, warmups, coaches apparel, fanwear, and accessories aligned under one premium visual system.",
  },
  {
    icon: Trophy,
    title: "Built for Competitive Programs",
    text: "Trusted for youth leagues, high school teams, clubs, camps, and serious 7-on-7 organizations.",
  },
];

const conversionStrip = [
  { icon: BrushCleaning, text: "Free Mockup in 24 Hours" },
  { icon: BadgeCheck, text: "Bulk Discounts Available" },
  { icon: Truck, text: "Delivery Across Texas" },
  { icon: Sparkles, text: "Premium Fabric Quality" },
];

const processSteps = [
  {
    icon: ClipboardCheck,
    title: "Submit Quote",
    text: "Share quantities, timing, and the product mix your team needs.",
  },
  {
    icon: Palette,
    title: "Get Design Mockup",
    text: "We translate your colors, logos, names, and numbers into a cleaner visual direction.",
  },
  {
    icon: Check,
    title: "Approve Design",
    text: "Review the final layout, fit direction, and roster details before production starts.",
  },
  {
    icon: Rocket,
    title: "Production & Delivery",
    text: "Your order moves into premium production with a clear turnaround plan.",
  },
];

const industries = [
  "Youth football leagues",
  "Middle school and high school programs",
  "Club and 7-on-7 teams",
  "College camps and development programs",
  "Booster clubs and fanwear groups",
  "Coaching staffs and athletic departments",
];

const testimonials = [
  {
    quote:
      "The gear looked far more polished than the stock options we had been using. Our players noticed the difference right away.",
    name: "High School Equipment Manager",
  },
  {
    quote:
      "The quote process was clear, the roster personalization stayed organized, and the final presentation looked premium on media day.",
    name: "Texas 7-on-7 Program Director",
  },
  {
    quote:
      "We needed youth sizing support and matching sideline layers. The finished collection gave the entire program a more unified look.",
    name: "Youth League Coordinator",
  },
];

export default function HomePage() {
  const products = getAllProducts();
  const featured = products.slice(0, 6);
  const heroImages = [products[0], products[20], products[1], products[7]].map(
    (product) => product.heroImage,
  );
  const featuredBadges = [
    "Best Seller",
    "Popular",
    "New",
    "Best Seller",
    "Popular",
    "New",
  ] as const;

  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#071426_0%,#0b1f3a_45%,#132d56_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,209,102,0.18),transparent_22%),radial-gradient(circle_at_78%_28%,rgba(200,16,46,0.22),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_38%)]" />
        <div className="absolute -left-16 top-20 h-44 w-44 rounded-full bg-[var(--color-gold)]/18 blur-3xl" />
        <div className="absolute right-0 top-16 h-56 w-56 rounded-full bg-[var(--color-red)]/18 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="eyebrow w-fit">Texas Custom Football Teamwear</span>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
                <Building2 className="h-4 w-4 text-[var(--color-gold)]" />
                Trusted by Texas High Schools, Colleges &amp; Teams
              </span>
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl leading-[0.9] text-white sm:text-6xl lg:text-7xl">
              Custom Texas Football Uniforms Built for Performance
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              High-quality custom football uniforms designed for Texas teams, schools,
              and clubs. Built to elevate team identity, improve presentation, and keep
              ordering simple through a quote-first process.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact-us/#quote-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#c8102e_0%,#ef3155_100%)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_24px_50px_rgba(200,16,46,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_30px_60px_rgba(200,16,46,0.42)]"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/all-categories/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/6 px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:border-[var(--color-gold)] hover:bg-white/10 hover:text-[var(--color-gold)]"
              >
                View Collections
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Free Design Support",
                "Fast Turnaround",
                "No Minimum Order",
              ].map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.14)] backdrop-blur"
                >
                  <Check className="h-4 w-4 shrink-0 text-[var(--color-gold)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-12 top-16 h-[72%] rounded-full bg-[radial-gradient(circle,rgba(255,209,102,0.28),rgba(255,209,102,0.08)_40%,transparent_70%)] blur-3xl" />
            <div className="absolute inset-y-10 right-12 w-36 rounded-full bg-[rgba(200,16,46,0.16)] blur-3xl" />
            <div className="relative rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_36px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-5">
              <div className="absolute left-6 top-6 z-10 rounded-full border border-white/12 bg-[rgba(8,18,35,0.72)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur">
                Featured Uniform Range
              </div>
              <ImageCarousel
                images={heroImages}
                altBase="Texas football uniforms hero"
                priority
                frameClassName="rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] min-h-[440px] sm:min-h-[560px]"
                imageClassName="aspect-[5/4] object-contain p-8 sm:p-12"
                thumbnailsClassName="mt-4"
                thumbnailImageClassName="object-contain bg-[rgba(255,255,255,0.03)] p-2"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-[28px] border border-[rgba(11,31,58,0.08)] bg-white/92 p-5 shadow-[0_20px_60px_rgba(11,31,58,0.10)] backdrop-blur md:grid-cols-2 xl:grid-cols-4">
          {conversionStrip.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-4 rounded-[22px] bg-[linear-gradient(180deg,rgba(11,31,58,0.03),rgba(11,31,58,0.00))] px-4 py-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)] shadow-[0_12px_28px_rgba(11,31,58,0.16)]">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-navy)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space pt-14 sm:pt-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="rounded-full bg-[var(--color-gold)]/18 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                Featured Collections
              </span>
              <h2 className="mt-5 max-w-3xl text-4xl text-[var(--color-navy)] sm:text-5xl">
                Discover Premium Football Uniform Collections
              </h2>
            </div>
            <Link
              href="/all-categories/"
              className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)] shadow-[0_14px_30px_rgba(11,31,58,0.06)] transition hover:border-[var(--color-red)] hover:text-[var(--color-red)] lg:inline-flex"
            >
              View all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((product, index) => (
              <Link
                key={product.slug}
                href={`/${product.slug}/`}
                className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_18px_50px_rgba(11,31,58,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(11,31,58,0.14)]"
              >
                <div className="absolute left-5 top-5 z-20 rounded-full bg-[var(--color-gold)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-navy)] shadow-[0_10px_24px_rgba(255,209,102,0.28)]">
                  {featuredBadges[index]}
                </div>
                <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-8">
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(11,31,58,0.20)_100%)] opacity-60 transition group-hover:opacity-90" />
                  <Image
                    src={product.heroImage}
                    alt={`${product.name} custom football apparel`}
                    width={900}
                    height={720}
                    className="relative z-10 max-h-[240px] w-full object-contain transition duration-500 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-4 justify-center opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-red)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_16px_32px_rgba(200,16,46,0.28)]">
                      Get a Quote
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                    {product.shortNiche}
                  </p>
                  <h3 className="mt-3 text-3xl text-[var(--color-navy)]">{product.name}</h3>
                  <p className="mt-3">{product.shortDescription.slice(0, 165)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-[linear-gradient(180deg,#0b1f3a_0%,#102749_100%)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Why Choose Us</span>
              <h2 className="mt-5 text-4xl text-white sm:text-5xl">
                Premium Teamwear With a Stronger Buying Experience
              </h2>
            </div>
            <p className="hidden max-w-sm text-right text-white/64 lg:block">
              Cleaner execution, better fabric decisions, and a quote-first workflow made
              for programs that care how they look on and off the field.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="group rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)]/35 hover:shadow-[0_26px_70px_rgba(0,0,0,0.24)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8 text-[var(--color-gold)] transition group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-navy)]">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-3xl text-white">{item.title}</h3>
                <p className="mt-4 text-white/72">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="surface-card overflow-hidden p-8 sm:p-10">
              <span className="rounded-full bg-[var(--color-red)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                Customization Process
              </span>
              <h2 className="mt-5 text-4xl text-[var(--color-navy)] sm:text-5xl">
                Designed for Faster Decisions and Cleaner Delivery
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {processSteps.map((step, index) => (
                  <div key={step.title} className="relative rounded-[26px] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_34px_rgba(11,31,58,0.05)]">
                    {index < processSteps.length - 1 ? (
                      <div className="pointer-events-none absolute -right-3 top-12 hidden h-px w-6 bg-[linear-gradient(90deg,var(--color-red),transparent)] lg:block" />
                    ) : null}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)] shadow-[0_16px_28px_rgba(11,31,58,0.12)]">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-3xl text-[var(--color-navy)]">{step.title}</h3>
                    <p className="mt-3">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="surface-card p-8 sm:p-10">
                <span className="rounded-full bg-[var(--color-gold)]/18 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                  Industries We Serve
                </span>
                <h2 className="mt-5 text-4xl text-[var(--color-navy)] sm:text-5xl">
                  Football Programs Across Texas
                </h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {industries.map((industry) => (
                    <div
                      key={industry}
                      className="rounded-[22px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)] p-5 shadow-[0_10px_24px_rgba(11,31,58,0.04)]"
                    >
                      <Flag className="h-8 w-8 text-[var(--color-red)]" />
                      <p className="mt-3 text-base font-semibold text-[var(--color-navy)]">{industry}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(11,31,58,0.18)_100%)]" />
                <Image
                  src={products[7].heroImage}
                  alt="Custom football uniforms for Texas teams"
                  width={1400}
                  height={900}
                  className="aspect-[16/9] w-full object-contain bg-[linear-gradient(180deg,#f8fafc_0%,#eff4f9_100%)] p-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-[linear-gradient(180deg,rgba(11,31,58,0.02),rgba(11,31,58,0.08))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="rounded-full bg-[var(--color-red)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                Testimonials
              </span>
              <h2 className="mt-5 text-4xl text-[var(--color-navy)] sm:text-5xl">
                Programs Choose a Premium Quote-First Partner
              </h2>
            </div>
            <div className="hidden rounded-full bg-[var(--color-navy)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)] md:inline-flex">
              No Pricing Tables. Just Better Teamwear.
            </div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="surface-card p-8">
                <Award className="h-10 w-10 text-[var(--color-gold)]" />
                <p className="mt-6 text-lg leading-8 text-[var(--color-navy)]">“{item.quote}”</p>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-red)]">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="rounded-[36px] bg-[linear-gradient(135deg,#08172c_0%,#0b1f3a_42%,#12305e_100%)] p-8 shadow-[0_28px_70px_rgba(11,31,58,0.26)] sm:p-10">
              <span className="eyebrow">Get a Free Quote</span>
              <h2 className="mt-6 text-4xl text-white sm:text-5xl">
                Request Custom Football Uniforms for Your Texas Team
              </h2>
              <p className="mt-5 max-w-2xl text-white/75">
                Tell us what your program needs and we will help you build the right mix of
                uniforms, jerseys, sideline apparel, or fan gear around your colors, roster,
                and delivery target.
              </p>
              <div className="mt-8">
                <QuoteForm />
              </div>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <div className="surface-card p-8">
                <h2 className="text-3xl text-[var(--color-navy)]">Contact the Team</h2>
                <div className="mt-5 space-y-3">
                  <a href={`mailto:${company.email}`} className="block text-base font-semibold text-[var(--color-red)]">
                    {company.email}
                  </a>
                  <a href={company.phoneHref} className="block text-base font-semibold text-[var(--color-red)]">
                    {company.phoneDisplay}
                  </a>
                  <div className="space-y-1">
                    {company.addressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="surface-card overflow-hidden">
                <Image
                  src={products[10].heroImage}
                  alt="Texas football warm up suits and sideline apparel"
                  width={900}
                  height={900}
                  className="aspect-square w-full object-contain bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
