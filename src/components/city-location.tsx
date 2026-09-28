import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductLeadForm } from "@/components/product-lead-form";
import { getPriceFacts, getProductBySlug, rushOrders } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";
import {
  getNearbyCities,
  cityUrl,
  fbLinkTargets,
  fbAnchor,
  fbPick,
  levelMixPage,
  type LocationCity,
} from "@/data/locations";

/**
 * City page.
 *
 * Phase 3 (2026-09-18) rebuilt this around the per-city facts in
 * `src/data/locations.ts` — districts, real UIL classifications, named youth
 * and flag leagues, stadiums, transit days and per-city FAQs. Before that the
 * 23 pages shared 55–64% of their 5-gram shingles and 13 of them were sitting
 * in Search Console as "Discovered — currently not indexed".
 *
 * The rule for anything added here: shared copy is chrome only (form, price
 * strip, spec chips, CTA). Every block that carries an argument for buying is
 * built from city data, so the page cannot go back to being a template with
 * the city name swapped in.
 */
export function CityLocation({ loc }: { loc: LocationCity }) {
  const basePath = cityUrl(loc);
  // A city page sells the full uniform set, so it quotes the uniform-set
  // starting price — the same number the American football uniforms page and
  // its Product schema publish.
  const priceAnchor = getProductBySlug("american-football-uniforms");
  const nearby = getNearbyCities(loc.nearbyCities);
  const mix = levelMixPage(loc.levelMix, loc.slug);
  const districts = loc.districts ?? [];
  const schools = loc.schools ?? [];
  const youthLeagues = loc.youthLeagues ?? [];
  const stadiums = loc.stadiums ?? [];
  const orderStory = loc.orderStory ?? [];

  // Varied internal links — unique target, anchor, and sentence per page.
  const lt = fbLinkTargets(loc.slug, 3);
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

  const faqs = [
    { question: `Do you make custom football uniforms for ${loc.name} teams?`, answer: loc.faqCityAnswer },
    ...(loc.faqs ?? []).map((f) => ({ question: f.q, answer: f.a })),
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
      // The real districts and towns this page is written for, not just the
      // city polygon, so the served area matches the copy underneath it.
      areaServed: [
        { "@type": "City", name: loc.name, containedInPlace: { "@type": "State", name: "Texas, USA" } },
        ...districts.map((d) => ({ "@type": "AdministrativeArea", name: d })),
        ...loc.areas.map((a) => ({ "@type": "Place", name: `${a}, Texas` })),
      ],
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
            {/* Rush orders, on the dark hero, right under the turnaround fact —
                a city page is where a coach checks the date against a schedule.
                Same sentence as every other page (`rushOrders` in catalog.ts);
                only the colors change because this block sits on navy. */}
            <p data-rush-note className="mt-3 max-w-xl text-sm leading-6 text-white/75">
              <strong className="font-semibold text-[var(--color-gold)]">{rushOrders.heading}</strong>{" "}
              {rushOrders.line}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#quote-form" className="rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)]">Get a Team Quote</a>
              <Link href="/locations/" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-[var(--color-gold)]">All Texas Cities</Link>
            </div>
          </div>
          {/* The side card carries city facts, not slogans: the districts this
              page is written for and the honest transit time to them. */}
          <div className="rounded-3xl border border-white/12 bg-white/5 p-6">
            <p className="border-b border-white/12 pb-3 font-display text-lg uppercase tracking-wide text-[var(--color-gold)]">🏈 {loc.stat}</p>
            {districts.length > 0 ? (
              <>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Districts we ship to</p>
                <ul className="mt-2 space-y-2 text-sm text-white/85">
                  {districts.map((d) => (
                    <li key={d} className="flex items-start gap-2"><span className="text-[var(--color-gold)]">✓</span>{d}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {loc.deliveryDays ? (
              <p className="mt-4 border-t border-white/12 pt-3 text-sm text-white/75">{loc.deliveryDays}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Answer */}
      <section className="py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <h2 className="font-display text-3xl uppercase text-[var(--color-navy)]">Custom Football Uniforms in {loc.name}</h2>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">
            Texas Football Uniforms builds fully sublimated football uniforms and team kits for {loc.signatureSector} in {loc.name} and the rest of {loc.region}. {answerLine.pre}
            <Link href={L[0].href} className="font-semibold text-[var(--color-red)] underline">{L[0].text}</Link>{answerLine.post}
          </p>
          {/* The spec claims that used to be spread over three shared sections,
              kept in one compact row so the page keeps them without paying for
              them in duplicate prose. */}
          <ul className="mt-5 flex flex-wrap gap-2 text-sm">
            {["Full sublimation, your exact colors", "Minimum 10 per design", "Free design proof in 24 hours", "Performance fabric for Texas heat", "Head-to-toe team kits", "Names, numbers and patches included"].map((t) => (
              <li key={t} className="rounded-full border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-[var(--color-navy)]">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Local scene + form */}
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

      {/* Schools table — the page's city-specific spine */}
      {schools.length > 0 && (
      <section className="py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Who Plays Here</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">{loc.name} High School Programs and Their UIL Conference</h2>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">{loc.schoolsNote}</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--color-navy)] text-[var(--color-navy)]">
                  <th className="py-2 pr-4 font-display text-base uppercase">School</th>
                  <th className="py-2 pr-4 font-display text-base uppercase">District</th>
                  <th className="py-2 font-display text-base uppercase">UIL Conference</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={s.school} className="border-b border-[var(--color-border)] text-[var(--color-navy-soft)]">
                    <td className="py-2.5 pr-4 font-semibold text-[var(--color-navy)]">{s.school}</td>
                    <td className="py-2.5 pr-4">{s.district}</td>
                    <td className="py-2.5">{s.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-navy-soft)]">
            Conferences follow the UIL 2026–2028 realignment. Roster sizes move with the conference, and so does the
            order — our{" "}
            <Link href="/size-chart/" className="font-semibold text-[var(--color-red)] underline">football uniform size chart</Link>{" "}
            shows what a varsity block and a youth block actually measure before you count the roster.
          </p>
        </div>
      </section>
      )}

      {/* Youth, flag and select */}
      {youthLeagues.length > 0 && (
      <section className="bg-[var(--color-shell)] py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Below Varsity</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">Youth, Flag and Select Football in {loc.name}</h2>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">
            {loc.youthNote}{" "}
            <Link href={mix.href} className="font-semibold text-[var(--color-red)] underline">{mix.anchor}</Link>{" "}
            {mix.tail}
          </p>
          <ul className="mt-4 space-y-2.5">
            {youthLeagues.map((l) => (
              <li key={l.name} className="flex items-start gap-2 text-[var(--color-navy-soft)]">
                <span className="text-[var(--color-red)]">🏈</span>
                <span><strong className="text-[var(--color-navy)]">{l.name}</strong> — {l.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* How an order runs here */}
      {orderStory.length > 0 && (
      <section className="py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Order Timeline</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">How a {loc.name} Uniform Order Runs</h2>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">{loc.orderIntro}</p>
          <ol className="mt-5 space-y-3">
            {orderStory.map((step, i) => (
              <li key={step} className="flex gap-3 leading-relaxed text-[var(--color-navy-soft)]">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-sm font-semibold text-white">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 leading-relaxed text-[var(--color-navy-soft)]">{loc.seasonNote}</p>
        </div>
      </section>
      )}

      {/* Style grid */}
      <section className="bg-[var(--color-navy)] py-14 text-white">
        <div className="mx-auto w-full max-w-6xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">Uniform Styles</span>
          <h2 className="mt-2 font-display text-3xl uppercase">Styles {loc.name} Teams Order</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {styleGrid.map((p) => (
              <Link key={p.slug} href={`/${p.slug}/`} className="group overflow-hidden rounded-3xl border border-white/12 bg-white/5 transition hover:border-[var(--color-gold)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-white/10">
                  <Image src={p.heroImage} alt={`${p.name} for ${loc.name} teams`} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg uppercase text-[var(--color-gold)]">{p.name}</h3>
                  <p className="mt-1 text-sm text-white/75">From ${p.fromPrice.toFixed(2)} {p.priceUnit}</p>
                  <span className="mt-2 inline-block text-sm font-semibold text-white">View {p.name} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stadiums + what the city orders most (keeps the two Phase 2 money links) */}
      <section className="py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Most Ordered</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">What {loc.name} Teams Order Most</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-xl uppercase text-[var(--color-navy)]">Varsity and JV Game Kits</h3>
              <p className="mt-2 leading-relaxed text-[var(--color-navy-soft)]">
                {loc.mostOrderedVarsity ?? `The biggest orders out of ${loc.name} are full game sets for ${loc.signatureSector}, placed in the spring so they land before August reporting. Our`}{" "}
                <Link href="/high-school-football-uniforms/" className="font-semibold text-[var(--color-red)] underline">high school football uniforms</Link>{" "}
                page covers what a varsity order contains and when a UIL program needs to place it.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl uppercase text-[var(--color-navy)]">Two-Color Practice Jerseys</h3>
              <p className="mt-2 leading-relaxed text-[var(--color-navy-soft)]">
                {loc.mostOrderedPractice ?? `Coaches in ${loc.name} split a scrimmage every day of two-a-days, and one garment covers both sides of it. Our`}{" "}
                <Link href="/reversible-football-jerseys/" className="font-semibold text-[var(--color-red)] underline">reversible football jerseys</Link>{" "}
                cover both, on the youth block as well as the adult one.
              </p>
            </div>
          </div>
          {stadiums.length > 0 && (
            <>
              <h3 className="mt-8 font-display text-xl uppercase text-[var(--color-navy)]">Where {loc.name} Plays</h3>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {stadiums.map((s) => (
                  <li key={s.name} className="rounded-2xl border border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-navy-soft)]">
                    <strong className="block font-display text-base uppercase text-[var(--color-navy)]">{s.name}</strong>
                    {s.note}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* Why us — city-written */}
      <section className="bg-[var(--color-shell)] py-14">
        <div className="mx-auto w-full max-w-4xl px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Delivery</span>
          <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">Getting Uniforms to {loc.name} on Time</h2>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">{loc.deliveryNote}</p>
          <p className="mt-4 leading-relaxed text-[var(--color-navy-soft)]">
            {loc.deliveryDetail ?? `We plan every ${loc.name} delivery around the date your season actually starts.`} You can also start from the{" "}
            <Link href={L[2].href} className="font-semibold text-[var(--color-red)] underline">{L[2].text}</Link>{" "}
            if you already know the garment you need.
          </p>
        </div>
      </section>

      {/* Nearby */}
      {nearby.length > 0 && (
        <section className="py-14">
          <div className="mx-auto w-full max-w-6xl px-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-red)]">Also Serving</span>
            <h2 className="mt-2 font-display text-3xl uppercase text-[var(--color-navy)]">Cities Near {loc.name} We Also Outfit</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {nearby.map((c) => (
                <Link key={c.slug} href={cityUrl(c)} className="rounded-3xl border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-lg">
                  <h3 className="font-display text-xl uppercase text-[var(--color-navy)]">{c.name}, TX</h3>
                  <p className="mt-1 text-sm text-[var(--color-navy-soft)]">{c.stat}.</p>
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
