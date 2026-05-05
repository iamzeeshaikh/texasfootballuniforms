import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Flag, Layers3, ShieldCheck, Sparkles, Trophy } from "lucide-react";

import { ImageCarousel } from "@/components/image-carousel";
import { QuoteForm } from "@/components/quote-form";
import { getAllProducts } from "@/lib/catalog";
import { company } from "@/lib/site";

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Premium Build Quality",
    text: "Custom football uniforms produced with durable materials, clean finishing, and roster-ready personalization.",
  },
  {
    icon: Sparkles,
    title: "Custom Design Support",
    text: "Programs can shape colors, names, numbers, trim, and logo placement around a stronger team identity.",
  },
  {
    icon: Layers3,
    title: "Complete Teamwear Range",
    text: "From game jerseys to warm-up suits and sideline apparel, the collection supports a full brand system.",
  },
  {
    icon: Trophy,
    title: "Built for Texas Competition",
    text: "Designed for youth leagues, high school programs, 7-on-7 organizations, and serious club teams.",
  },
];

const processSteps = [
  "Share your roster, quantity target, and product mix.",
  "Approve artwork, colors, sizing, and player personalization.",
  "Move into production with a quote-based turnaround plan.",
  "Receive premium teamwear ready for game day, travel, and reorders.",
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
  const heroProduct = products[0];

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--color-navy)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,209,102,0.18),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(200,16,46,0.24),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="eyebrow w-fit">Texas Custom Football Teamwear</span>
            <h1 className="mt-6 max-w-3xl text-5xl leading-[0.92] text-white sm:text-6xl lg:text-7xl">
              Custom Texas Football Uniforms Built for Performance
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              Premium football uniforms, jerseys, sideline apparel, and custom teamwear
              designed for Texas programs that want stronger presentation, cleaner
              personalization, and quote-based support instead of generic stock gear.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact-us/#quote-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-red)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_40px_rgba(200,16,46,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)]"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={company.phoneHref}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              >
                Call {company.phoneDisplay}
              </a>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["28", "SEO landing pages"],
                ["5x", "images on every product page"],
                ["100%", "quote-based conversion flow"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="font-display text-3xl text-[var(--color-gold)]">{value}</p>
                  <p className="mt-1 text-sm uppercase tracking-[0.16em] text-white/65">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-[var(--color-gold)]/35 blur-3xl" />
            <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-[var(--color-red)]/30 blur-3xl" />
            <ImageCarousel images={heroProduct.images} altBase={heroProduct.name} priority />
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="rounded-full bg-[var(--color-gold)]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                Featured Categories
              </span>
              <h2 className="mt-5 text-4xl text-[var(--color-navy)] sm:text-5xl">
                Premium Football Apparel Collections
              </h2>
            </div>
            <Link
              href="/all-categories/"
              className="hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-red)] lg:inline-flex"
            >
              View all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((product) => (
              <Link key={product.slug} href={`/${product.slug}/`} className="surface-card group overflow-hidden">
                <div className="overflow-hidden">
                  <Image
                    src={product.heroImage}
                    alt={`${product.name} custom football apparel`}
                    width={900}
                    height={720}
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                    {product.shortNiche}
                  </p>
                  <h3 className="mt-3 text-3xl text-[var(--color-navy)]">{product.name}</h3>
                  <p className="mt-3">{product.shortDescription.slice(0, 170)}...</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-red)]">
                    Get a Quote
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-[var(--color-navy)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <item.icon className="h-10 w-10 text-[var(--color-gold)]" />
                <h2 className="mt-5 text-3xl text-white">{item.title}</h2>
                <p className="mt-3 text-white/72">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div className="surface-card p-8">
            <span className="rounded-full bg-[var(--color-red)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
              Customization Process
            </span>
            <h2 className="mt-5 text-4xl text-[var(--color-navy)] sm:text-5xl">
              From Quote Request to Delivered Teamwear
            </h2>
            <div className="mt-8 space-y-5">
              {processSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-[24px] border border-[var(--color-border)] bg-white p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] font-display text-2xl text-[var(--color-gold)]">
                    {index + 1}
                  </div>
                  <p className="text-base">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="surface-card p-8 sm:col-span-2">
              <span className="rounded-full bg-[var(--color-gold)]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">
                Industries We Serve
              </span>
              <h2 className="mt-5 text-4xl text-[var(--color-navy)] sm:text-5xl">
                Football Programs Across Texas
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {industries.map((industry) => (
                  <div key={industry} className="rounded-[22px] border border-[var(--color-border)] bg-white p-5">
                    <Flag className="h-8 w-8 text-[var(--color-red)]" />
                    <p className="mt-3 text-base font-semibold text-[var(--color-navy)]">{industry}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card overflow-hidden sm:col-span-2">
              <Image
                src={products[7].heroImage}
                alt="Custom football uniforms for Texas teams"
                width={1400}
                height={900}
                className="aspect-[16/8] w-full object-cover"
              />
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
            <div className="rounded-[36px] bg-[var(--color-navy)] p-8 sm:p-10">
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
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
