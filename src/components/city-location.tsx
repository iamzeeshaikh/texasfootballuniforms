import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductLeadForm } from "@/components/product-lead-form";
import { getPriceFacts, getProductBySlug } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";
import {
  getNearbyCities,
  cityUrl,
  fbLinkTargets,
  fbAnchor,
  fbPick,
  type LocationCity,
} from "@/data/locations";

export function CityLocation({ loc }: { loc: LocationCity }) {
  const basePath = cityUrl(loc);
  // A city page sells the full uniform set, so it quotes the uniform-set
  // starting price — the same number the American football uniforms page and
  // its Product schema publish.
  const priceAnchor = getProductBySlug("american-football-uniforms");
  const nearby = getNearbyCities(loc.nearbyCities);

  // Varied internal links — unique target, anchor, and sentence per page.
  const lt = fbLinkTargets(loc.slug, 4);
  const L = lt.map((s, i) => ({ href: `/${s}/`, text: fbAnchor(s, loc.slug, i) }));
  const styleGrid = fbLinkTargets("style-" + loc.slug, 4)
    .map((s) => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const answerLine = fbPick([
    { pre: `A staple for ${loc.name} programs is our `, post: `, built for the Texas season and printed in your exact colors.` },
    { pre: `${loc.name} teams most often start with our `, post: `.` },
    { pre: `One of the most-ordered picks for ${loc.name} coaches is our `, post: `, made to hold up under the Friday-night lights.` },
  ], loc.slug, 0);
  const sceneLine = fbPick([
    { pre: `Whatever level your program plays at in ${loc.name}, our `, post: ` keep your team looking varsity-sharp.` },
    { pre: `To match the intensity of ${loc.name} football, coaches turn to our `, post: `.` },
    { pre: `Our `, post: ` fit the way ${loc.name} teams compete and win.` },
  ], loc.slug, 1);
  const whoLine = fbPick([
    { pre: `From varsity down to the youngest feeder squads, ${loc.name} programs order it all — including our `, post: `.` },
    { pre: `Whatever the roster, our `, post: ` outfit ${loc.name} teams at every level.` },
    { pre: `Popular across ${loc.name} programs are our `, post: `.` },
  ], loc.slug, 2);
  const whyLine = fbPick([
    { pre: `Ready to build your team's look? Explore our `, post: ` or start a ${loc.name} team quote today.` },
    { pre: `Weighing fabrics and cuts? Our `, post: ` are a great place to begin.` },
    { pre: `Not sure where to start? Our `, post: ` are a solid first stop for ${loc.name} coaches.` },
  ], loc.slug, 3);

  const levels = [
    "Varsity and JV high school teams",
    "Youth and middle school programs",
    "Select and club football teams",
    "7-on-7 tournament squads",
    "Flag football leagues",
    "Coaches, sideline, and booster gear",
  ];

  const faqs: Array<{ question: string; answer: string }> = [
    { question: `Do you make custom football uniforms for ${loc.name} teams?`, answer: loc.faqCityAnswer },
    { question: `What is the minimum order for a ${loc.name} team?`, answer: `The minimum is 10 pieces per design, which a single ${loc.name} squad clears on its own — youth or varsity. Mixed sizes count toward the same 10. Send your roster count and we will confirm pricing and per-uniform cost.` },
    { question: `Can you match our exact ${loc.name} school or club colors?`, answer: `Yes. Every uniform is printed to your exact colors, logo, and design with full sublimation, so your ${loc.name} team's identity is reproduced precisely on every jersey, every reorder.` },
    { question: `Are your football uniforms sublimated or screen printed?`, answer: `We specialize in full-sublimation football uniforms, where the design is dyed into the fabric so names, numbers, and logos never crack or peel — ideal for the wear a Texas season puts on a jersey.` },
    { question: `Can you print custom names and numbers?`, answer: `Absolutely. We handle custom names, numbers, patches, and captain designations as part of your team order, so every ${loc.name} player's jersey is game-ready out of the box.` },
    { question: `Do you offer full team kits, not just jerseys?`, answer: `Yes. We outfit ${loc.name} teams head to toe — jerseys, pants, practice gear, warm-ups, sideline layers, and coaches uniforms — so your whole program looks unified.` },
    { question: `How fast can you deliver before our season?`, answer: `We plan production around your season and event dates. Order early for the best turnaround, and if you have a jamboree or opening-week deadline in ${loc.name}, tell us and we'll confirm timing up front.` },
    { question: `Do you send a design proof before production?`, answer: `Always. You'll approve a design proof showing your colors, logo, and layout before anything is produced, so your ${loc.name} uniforms come out exactly as intended.` },
    { question: `Can you handle both youth leagues and high school programs?`, answer: `Yes. We outfit every level in ${loc.name}, from youth and select teams to varsity high school and college club programs, with sizing and pricing built for each.` },
    { question: `How do we get a quote for our ${loc.name} team?`, answer: `Send your team name, colors, roster count, and any design ideas through our quote form. We'll come back with pricing, fabric options, and a timeline for your ${loc.name} program.` },
  ];

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations/" },
    { name: loc.name, path: basePath },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Custom Football Uniforms — ${loc.name}, TX`,
      serviceType: "Custom football uniform and team kit manufacturing",
      description: loc.metaDescription,
      areaServed: { "@type": "City", name: loc.name, containedInPlace: { "@type": "State", name: "Texas, USA" } },
      provider: { "@type": "Organization", name: "Texas Football Uniforms", url: SITE_URL },
      url: `${SITE_URL}${basePath}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
  ];

  return (
    <>
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Hero */}
      <section className="bg-[var(--color-navy)] py-16 text-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Breadcrumbs items={crumbs} tone="dark" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">{loc.region} · Texas</span>
            <h1 className="mt-3 font-display text-4xl uppercase leading-[1.05] sm:text-5xl">{loc.h1}</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">{loc.intro}</p>
            {priceAnchor ? (
              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-sm font-semibold text-white/85">
                {getPriceFacts(priceAnchor).map((fact, i) => (
                  <span key={fact} className="flex items-center gap-3">
                    {i > 0 ? <span aria-hidden="true" className="text-white/30">·</span> : null}
                    <span className={i === 0 ? "text-[var(--color-gold)]" : undefined}>{fact}</span>
                  </span>
                ))}
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#quote-form" className="rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)]">Get a Team Quote</a>
              <Link href="/locations/" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-[var(--color-gold)]">All Texas Cities</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/12 bg-white/5 p-6">
            <p className="border-b border-white/12 pb-3 font-display text-lg uppercase tracking-wide text-[var(--color-gold)]">🏈 {loc.stat}</p>
            <ul className="mt-3 space-y-2.5 text-sm text-white/85">
              {["Full-sublimation, printed in your colors", "Built for Texas heat & a long season", "Complete team kits, head to toe", "Free design proof · team pricing"].map((t) => (
                <li key={t} className="flex items-start gap-2"><span className="text-[var(--color-gold)]">✓</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Answer */}
      <section className="py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <h2 className="font-display text-3xl uppercase text-[var(--color-navy)]">Custom Football Uniforms in {loc.name}</h2>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">
            Texas Football Uniforms designs and builds custom, fully sublimated football uniforms and team kits for programs across {loc.name} and {loc.region}. Every uniform is printed to your exact colors, logo, and roster — the fastest way to get {loc.signatureSector} looking varsity-sharp. {answerLine.pre}
            <Link href={L[0].href} className="font-semibold text-[var(--color-red)] underline">{L[0].text}</Link>{answerLine.post}
          </p>
        </div>
      </section>

      {/* Local scene */}
      <section className="bg-[var(--color-shell)] py-14">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">On the Ground in {loc.name}</span>
            <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">{loc.sceneHeading}</h2>
            <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">{loc.localScene}</p>
            <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">
              {sceneLine.pre}<Link href={L[1].href} className="font-semibold text-[var(--color-red)] underline">{L[1].text}</Link>{sceneLine.post}
            </p>
            <h3 className="mt-6 font-display text-xl uppercase text-[var(--color-navy)]">Programs &amp; Areas We Serve Near {loc.name}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {loc.areas.map((a) => (
                <span key={a} className="rounded-full border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-sm text-[var(--color-navy)]">{a}</span>
              ))}
            </div>
          </div>
          {/* The quote form lives on the page with the city already attached.
              Sending coaches to /contact-us/ lost them a click and the lead
              arrived without saying which city it came from. */}
          <div className="self-start">
            <ProductLeadForm
              productName="Custom Football Uniforms"
              cityName={loc.name}
              eyebrow={`${loc.name}, Texas`}
              heading={`Get a ${loc.name} Team Quote`}
              blurb={`Send your team name, colors, and roster count. Minimum 10 per design, free mockup within 24 hours, and we plan delivery around your ${loc.name} season.`}
              gaEvent="quote_form_submit"
            />
          </div>
        </div>
      </section>

      {/* Style grid */}
      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Uniform Styles</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">Styles {loc.name} Teams Order</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {styleGrid.map((p) => (
              <Link key={p.slug} href={`/${p.slug}/`} className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white transition-shadow hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-shell)]">
                  <Image src={p.heroImage} alt={`${p.name} for ${loc.name} teams`} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg uppercase text-[var(--color-navy)]">{p.name}</h3>
                  <p className="mt-1 text-sm text-[var(--color-navy-soft)]">{p.shortDescription.slice(0, 80)}…</p>
                  <span className="mt-2 inline-block text-sm font-semibold text-[var(--color-red)]">View {p.name} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Texas football (football-specific) */}
      <section className="bg-[var(--color-navy)] py-14 text-white">
        <div className="mx-auto w-full max-w-6xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">Built for Texas</span>
          <h2 className="mt-2 font-display text-3xl uppercase">Made for {loc.name} Friday Nights</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              { t: "Sublimated to last", d: `Names, numbers, and logos are dyed into the fabric, so they never crack or peel through a full ${loc.name} season and playoff run.` },
              { t: "Beats the Texas heat", d: "Lightweight, moisture-wicking performance fabric keeps players cool and dry from August two-a-days through November." },
              { t: "Complete team kits", d: "Jerseys, pants, practice gear, warm-ups, and sideline layers — outfit your whole program in one unified, coordinated look." },
            ].map((x) => (
              <div key={x.t} className="rounded-3xl border border-white/12 bg-white/5 p-6">
                <h3 className="font-display text-xl uppercase text-[var(--color-gold)]">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we outfit */}
      <section className="py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Every Level</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">Who We Outfit in {loc.name}</h2>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">
            {whoLine.pre}<Link href={L[2].href} className="font-semibold text-[var(--color-red)] underline">{L[2].text}</Link>{whoLine.post}
          </p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {levels.map((x) => (
              <li key={x} className="flex items-start gap-2 text-[var(--color-navy)]"><span className="text-[var(--color-red)]">🏈</span>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Two fixed cluster links every city page carries. The randomized pool
          above varies by city, which is right for variety but means the two
          pages that most need city-page authority — high school uniforms
          (ranks 36 while city pages rank 1.5) and reversible jerseys (162
          impressions at position 58) — were linked from only some of them.
          One link per heading section, per the internal-linking rule. */}
      <section className="py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Most Ordered</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">What {loc.name} Teams Order Most</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-xl uppercase text-[var(--color-navy)]">Varsity and JV Game Kits</h3>
              <p className="mt-2 leading-relaxed text-[var(--color-navy-soft)]">
                The biggest orders out of {loc.name} are full game sets for {loc.signatureSector}, placed in
                the spring so they land before August reporting. Our{" "}
                <Link href="/high-school-football-uniforms/" className="font-semibold text-[var(--color-red)] underline">high school football uniforms</Link>{" "}
                page covers what a varsity order contains and when a UIL program needs to place it.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl uppercase text-[var(--color-navy)]">Two-Color Practice Jerseys</h3>
              <p className="mt-2 leading-relaxed text-[var(--color-navy-soft)]">
                Coaches in {loc.name} split a scrimmage every day of two-a-days, and one garment covers both
                sides of it. Our{" "}
                <Link href="/reversible-football-jerseys/" className="font-semibold text-[var(--color-red)] underline">reversible football jerseys</Link>{" "}
                are built for that, on the youth block as well as the adult one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-[var(--color-shell)] py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Why Us</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">Why {loc.name} Coaches Order From Us</h2>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">{loc.deliveryNote}</p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {["Full-sublimation, printed in your exact colors", "Performance fabric built for Texas heat", "Complete head-to-toe team kits", "Free design proof on every order", "Team pricing, minimum 10 per design", "Turnaround planned around your season"].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[var(--color-navy)]"><span className="text-[var(--color-red)]">✓</span>{t}</li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">
            {whyLine.pre}<Link href={L[3].href} className="font-semibold text-[var(--color-red)] underline">{L[3].text}</Link>{whyLine.post}
          </p>
        </div>
      </section>

      {/* Nearby */}
      {nearby.length > 0 && (
        <section className="py-14">
          <div className="mx-auto w-full max-w-6xl px-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Also Serving</span>
            <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">Other Texas Cities We Outfit</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {nearby.map((c) => (
                <Link key={c.slug} href={cityUrl(c)} className="rounded-3xl border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-lg">
                  <h3 className="font-display text-xl uppercase text-[var(--color-navy)]">{c.name}, TX</h3>
                  <p className="mt-1 text-sm text-[var(--color-navy-soft)]">{c.intro.slice(0, 95)}…</p>
                  <span className="mt-2 inline-block text-sm font-semibold text-[var(--color-red)]">Football uniforms in {c.name} →</span>
                </Link>
              ))}
            </div>
            <p className="mt-5"><Link href="/locations/" className="font-semibold text-[var(--color-red)] underline">View all Texas football uniform locations →</Link></p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-[var(--color-shell)] py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">FAQs</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">{loc.name} Football Uniforms — FAQs</h2>
          <div className="mt-5 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
            {faqs.map((f) => (
              <details key={f.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--color-navy)]">
                  {f.question}<span className="text-xl text-[var(--color-red)] group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-navy-soft)]">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-red)] py-16 text-center text-white">
        <div className="mx-auto w-full max-w-2xl px-5">
          <h2 className="font-display text-4xl uppercase">Kit Out Your {loc.name} Team</h2>
          <p className="mt-3 leading-relaxed text-white/85">Send your team name, colors, and roster for a free quote. We&rsquo;ll proof your design and deliver in time for the season.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#quote-form" className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold)]">Get a Team Quote</a>
            <Link href="/contact-us/" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
