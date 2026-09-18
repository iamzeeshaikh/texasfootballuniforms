/**
 * Verified per-city facts for the 23 city pages.
 *
 * Phase 3 (2026-09-18). The city pages used to share 55–64% of their 5-gram
 * shingles and 13 of the 23 were sitting in Search Console as "Discovered —
 * currently not indexed". This file is the fix: every page is now built from
 * facts that are true of that city and nowhere else.
 *
 * RULES FOR EDITING THIS FILE
 * 1. Every district, school, UIL conference, league, stadium and distance here
 *    was checked against a real source before it was written. If you cannot
 *    verify a fact, leave it out — a shorter page beats an invented school.
 * 2. UIL conferences come from the **official 2026-28 district alignment PDFs**
 *    on realignment.uiltexas.org / uiltexas.org/alignments (6A: /files/alignments/6abb.pdf;
 *    5A-DI, 5A-DII, 4A-DI, 4A-DII, 3A, 2A, 1A: realignment.uiltexas.org/alignments/2026/*.pdf).
 *    Secondary reporting was wrong on several schools (Katy Freeman, Waco High,
 *    Laredo Cigarroa, Tolar, Glen Rose, McAllen High), so check the PDF, not a news list.
 * 3. Season dates come from UIL's tentative 2026 football dates
 *    (realignment.uiltexas.org/alignments/2026/2026_Tentative-Football-Dates.pdf):
 *    conditioning Aug 3 for 4A-and-below and for 5A/6A schools without spring
 *    training, full contact Aug 8, first scrimmage Aug 13; 5A/6A schools with
 *    spring training start Aug 10 / Aug 15 / Aug 20; week-one games Aug 27–29;
 *    district certification Nov 7.
 * 4. No customer names, order counts or testimonials. We have none to publish.
 * 5. US spelling.
 */

export type CitySchool = { school: string; district: string; level: string };
export type CityLeague = { name: string; note: string };
export type CityStadium = { name: string; note: string };
/** Which money page this city's level mix should send authority to. */
export type LevelMix = "high-school" | "youth" | "7-on-7" | "flag";

export interface CityFacts {
  /** Real districts serving the city. Also feeds Service.areaServed. */
  districts: string[];
  /** Table rows: school, district, UIL 2026-28 conference. */
  schools: CitySchool[];
  schoolsNote: string;
  youthLeagues: CityLeague[];
  youthNote: string;
  levelMix: LevelMix;
  stadiums: CityStadium[];
  seasonNote: string;
  /** Short transit line for the hero card. */
  deliveryDays: string;
  deliveryDetail: string;
  orderIntro: string;
  orderStory: string[];
  mostOrderedVarsity: string;
  mostOrderedPractice: string;
  /** 8–10 questions written for this city. */
  faqs: { q: string; a: string }[];
}

export const cityFacts: Record<string, CityFacts> = {
  // ─────────────────────────────────────────────────────────── DFW ──
  dallas: {
    districts: ["Dallas ISD", "Richardson ISD", "Garland ISD", "Mesquite ISD", "Duncanville ISD"],
    schools: [
      { school: "Skyline", district: "Dallas ISD", level: "6A" },
      { school: "South Oak Cliff", district: "Dallas ISD", level: "5A Division II" },
      { school: "Bryan Adams", district: "Dallas ISD", level: "5A Division I" },
      { school: "Sunset", district: "Dallas ISD", level: "5A Division I" },
      { school: "W.T. White", district: "Dallas ISD", level: "5A Division I" },
      { school: "Woodrow Wilson", district: "Dallas ISD", level: "5A Division II" },
      { school: "Highland Park", district: "Highland Park ISD", level: "5A Division I" },
      { school: "Justin F. Kimball", district: "Dallas ISD", level: "4A Division I" },
      { school: "James Madison", district: "Dallas ISD", level: "3A Division II" },
    ],
    schoolsNote:
      "No other Texas city spreads its public football over this many conferences. Dallas ISD alone fields programs from 6A at Skyline down to 3A Division II at Madison, with most of the district sitting in the two 5A divisions. That matters for a uniform order more than it looks: a 6A roster and a 3A roster are different sizes of order, different size runs and different reorder patterns, and we quote them differently.",
    youthLeagues: [
      { name: "Dallas Park & Recreation NFL Flag Football", note: "the city's own flag program, run in 8U, 10U and 12U divisions out of neighborhood rec centers, with registration through August and September and play starting in the third week of September." },
      { name: "YMCA of Metropolitan Dallas", note: "runs both flag and tackle youth football across its Dallas branches, which is where a lot of first-time coaches place their first uniform order." },
    ],
    youthNote:
      "Under the high schools sits a city flag program that starts at six years old and a YMCA tackle program that feeds the same neighborhoods. Those orders arrive in September, not in spring, and they are small, mixed-size and usually paid for by parents rather than a district. Our",
    levelMix: "high-school",
    stadiums: [
      { name: "John Kincaide Stadium", note: "Dallas ISD's biggest venue at roughly 15,000 seats, opened in 2005 and used by several district programs." },
      { name: "Forester Field", note: "a 9,706-seat Dallas ISD stadium in Oak Cliff." },
      { name: "Sprague Athletic Complex", note: "8,499 seats, another of the shared Dallas ISD sites where a jersey gets photographed all season." },
    ],
    seasonNote:
      "UIL's 2026 calendar starts the year on August 3 for schools without spring training and on August 10 for the 5A and 6A programs that held it, with week-one games on August 27–29. A Dallas order placed in May is comfortable; one placed in the first week of August is not.",
    deliveryDays: "Dallas is our home metro — no freight leg at all, so the schedule is production time plus a local delivery.",
    deliveryDetail:
      "Because production and the city are in the same metroplex, a Dallas order has nothing between approval and delivery except the print and sew time itself. That is why we can take a Dallas rush closer to the deadline than one going to El Paso or the Valley, and why we ask for a firm roster before, not after, the proof is approved.",
    orderIntro:
      "A Dallas order almost always starts with a roster that is still moving. Transfers, a late 9th-grade class and a coaching change in the spring all shift the numbers, so we build the quote around a size run rather than a fixed count.",
    orderStory: [
      "Send the team name, the school or club, the colors and a roster count. If the roster is not final, send the count you have and the number of extras you would want held back.",
      "We come back with per-piece pricing at your quantity and a free mockup inside 24 hours, in your colors, with a real number on a real jersey rather than a stock template.",
      "You mark up the proof. Most Dallas changes at this stage are the number font and where the school mark sits on the chest — both are free to move before production.",
      "Once the proof is signed we cut and print. Names, numbers and patches are all part of the same run, so nothing gets pressed on afterwards.",
      "Delivery is local. We hold the extras from your size run so the two or three players who arrive in August get the same jersey, not a substitute.",
    ],
    mostOrderedVarsity:
      "The biggest Dallas orders are full game sets for the 5A programs, placed in spring so they land before August reporting dates. Our",
    mostOrderedPractice:
      "A Dallas coach splitting scout team from ones and twos every afternoon needs two colors in one garment, and needs it in both a youth and an adult block because the feeder squads practice on the same fields. Our",
    faqs: [
      { q: "Do you outfit Dallas ISD schools as well as private and select teams?", a: "Yes. We build for any Dallas program that can hit 10 pieces of a design — a Dallas ISD varsity roster, a select 7-on-7 team, a rec-league flag squad or a private school. The order is the same process; only the size run and the quantity change." },
      { q: "How fast can you deliver a uniform order inside Dallas?", a: "Dallas is in the same metroplex as our production, so there is no freight leg — the schedule is print and sew time plus a local delivery. Standard turnaround is two to four weeks from proof approval, and a Dallas order can usually be taken closer to a deadline than one shipping to West Texas." },
      { q: "Can you match a specific Dallas school's colors exactly?", a: "Yes. Send us the hex or Pantone values if the school has them, or a photo of the current jersey if it does not. We proof the color on screen before production and sublimate to that value, so a reorder two seasons later still matches the first set." },
      { q: "What is the minimum order for a Dallas team?", a: "Ten pieces per design. A single Dallas ISD varsity roster clears that several times over, and a youth flag squad clears it on its own. Mixed sizes count toward the same 10, so a roster with two 3XL linemen and a set of youth smalls is still one order." },
      { q: "Do you make uniforms for Dallas youth and rec flag leagues?", a: "Yes. The city's own NFL Flag program runs 8U, 10U and 12U divisions out of the rec centers, and those teams order in late summer with mixed sizes and parent-paid budgets. We quote flag sets at the same 10-piece minimum as varsity kits." },
      { q: "Our program plays 5A Division II — do you build differently for that?", a: "The garment is the same; the order shape is not. A 5A Division II roster like South Oak Cliff's carries fewer players than a 6A roster such as Skyline's, so the size run is narrower and we usually hold more extras in the middle sizes rather than at the ends." },
      { q: "Can you print names and numbers for a Dallas roster that is not final yet?", a: "Yes, and it is the normal case here. Send the names you have and we hold blank-backed extras from the same dye lot for the late additions, so the player who enrolls in August is not wearing a different white." },
      { q: "When should a Dallas program place its order for the fall?", a: "Work back from UIL's 2026 dates: conditioning opens August 3 for schools without spring training and August 10 for 5A and 6A programs that held it, with week-one games August 27–29. Ordering in April or May puts the uniforms in the field house before anyone reports." },
      { q: "Do you supply coaches and sideline gear for Dallas staffs?", a: "Yes. Coaches polos, quarter-zips, sideline jackets and staff shirts can be printed in the same colors and marks as the team kit, so the sideline at a stadium like John Kincaide reads as one program." },
      { q: "Can you handle a Dallas program that needs a home and an away set?", a: "Yes, and it is cheaper to do it together. Two colorways of the same design in one production run share the setup, and the numbers, names and patches are printed identically on both so the two sets match a year later." },
    ],
  },

  // ──────────────────────────────────────────────── Collin County ──
  plano: {
    districts: ["Plano ISD", "Frisco ISD", "Lewisville ISD", "Allen ISD"],
    schools: [
      { school: "Plano Senior High", district: "Plano ISD", level: "6A" },
      { school: "Plano East Senior High", district: "Plano ISD", level: "6A" },
      { school: "Plano West Senior High", district: "Plano ISD", level: "6A" },
      { school: "Prestonwood Christian Academy", district: "Private (TAPPS)", level: "TAPPS 6A, 11-man Division I" },
      { school: "Shepton, Jasper, Clark, Williams, Vines, McMillen", district: "Plano ISD", level: "9th/10th-grade campuses feeding the three senior highs" },
    ],
    schoolsNote:
      "Plano runs football on a structure almost no other Texas city uses. The three senior highs take students in 11th and 12th grade only, and six 9th/10th-grade campuses — Shepton, Jasper, Clark, Williams, Vines and McMillen — carry the sub-varsity teams that feed them. One program can therefore need a varsity block, a JV block and two junior-high-sized blocks that never share a building. For 2026-28 the three senior highs left the Allen and Prosper grouping for District 7-6A with Coppell and the Richardson ISD schools.",
    youthLeagues: [
      { name: "Plano Sports Authority", note: "the nonprofit that runs the city's youth flag and tackle football from age five through twelfth grade, across several Plano facilities." },
      { name: "Neighborhood Sports NFL Flag", note: "runs an NFL Flag league in Plano from pre-K to twelfth grade." },
      { name: "City of Plano Parks and Recreation", note: "allocates and maintains the fields the youth football organizations play on." },
    ],
    youthNote:
      "Plano Sports Authority alone spans age five to twelfth grade, which is the widest single-organization size range on this list — one league order can run from a 5-year-old's flag jersey to a high-school-sized shirt. Our",
    levelMix: "youth",
    stadiums: [
      { name: "John Clark Stadium", note: "Plano ISD's 14,224-seat stadium, home to Plano Senior High and Plano West." },
      { name: "Tom Kimbrough Stadium", note: "Plano ISD's second stadium at 9,603 seats — 5,833 on the home side and 3,770 for visitors — home to Plano East." },
    ],
    seasonNote:
      "The split-campus structure changes the ordering calendar as much as the UIL one does. Conditioning opens August 3 or August 10 depending on spring training and week one falls on August 27–29, but a Plano program has to have the 9th/10th-grade sets on the right campuses by then, not just at the senior high.",
    deliveryDays: "Plano is about 27 miles from DFW Airport — inside our home metro, so no freight leg.",
    deliveryDetail:
      "Plano deliveries can be split across campuses without a second shipping charge, which matters when a single program's jerseys have to reach a senior high and two 9th/10th-grade schools. Tell us the split when you order and we box it that way rather than leaving a coach to sort it out.",
    orderIntro:
      "Because the senior highs only hold two grades, a Plano order is usually four blocks at once: varsity, JV and the two feeder campuses. Ordering them together is what keeps the color identical between a sophomore's jersey and a senior's.",
    orderStory: [
      "Give us the count per campus, not one total. That is the only way the boxes can be labeled for the right building.",
      "Send colors and the school mark. We return per-piece pricing at the combined quantity, which is lower than quoting each campus separately.",
      "Free mockup inside 24 hours, proofed in the sizes at both ends — a 9th-grade small and a senior 3XL — because the same mark sits differently on each.",
      "On approval the whole order prints in one run and one dye lot, so a player moving up a campus in August is not visibly in a different shade.",
      "We deliver locally and split the boxes by campus at no extra cost.",
    ],
    mostOrderedVarsity:
      "A Plano order usually covers the varsity block at one of the three senior highs plus the sub-varsity blocks sitting on the feeder campuses. Our",
    mostOrderedPractice:
      "With sub-varsity football on separate campuses, Plano coaches run split-squad work constantly and need one jersey that covers both sides of it. Our",
    faqs: [
      { q: "Do you supply Plano ISD schools?", a: "Yes — Plano Senior High, Plano East and Plano West at 6A, plus the 9th/10th-grade campuses at Shepton, Jasper, Clark, Williams, Vines and McMillen that carry their sub-varsity teams. A Plano order is usually several blocks quoted together." },
      { q: "Can one order cover the senior high and the feeder campuses?", a: "Yes, and it should. Sending one combined quantity lowers the per-piece price and, more importantly, puts every block in one dye lot so a player who moves up a campus is not wearing a different white. Give us the count per campus and we box the order that way." },
      { q: "How fast is delivery to Plano?", a: "Plano is about 27 miles from DFW Airport and inside our home metro, so there is no freight leg — two to four weeks of production from proof approval, then a local delivery that we can split across campuses at no extra charge." },
      { q: "Do you make uniforms for Plano Sports Authority teams?", a: "Yes. PSA runs flag and tackle football from age five through twelfth grade, so a league order can span a tiny youth jersey and a high-school-sized one. We print the whole range in one run at the 10-piece minimum per design." },
      { q: "What is the minimum order for a Plano team?", a: "Ten pieces per design, mixed sizes counted together. A single 9th/10th-grade block clears it, and a PSA division clears it comfortably." },
      { q: "Can you match Plano ISD school colors and marks?", a: "Yes. Send the color values or a daylight photo of the current jersey, and any artwork the school has. We proof the color before production and store it against your order so a reorder for the next class matches the current set." },
      { q: "Our school is 6A — how big is a typical jersey order?", a: "Plano's three senior highs carry 6A rosters, so a varsity and JV order together is usually a large run, and the feeder campuses add more. We price from the actual counts you send rather than a conference average." },
      { q: "Do you print names on sub-varsity jerseys as well as varsity?", a: "Yes. Names, numbers and patches are sublimated in the same pass, so a 9th-grade set can carry names without the peeling a heat-pressed name gets after one season of washing." },
      { q: "When should a Plano program place its fall order?", a: "In spring. Conditioning opens August 3 or August 10 under UIL's 2026 calendar depending on spring training, and a Plano program has to have sets on three or four campuses by then rather than in one field house." },
    ],
  },

  // ────────────────────────────────────────────────── West Texas ──
  "el-paso": {
    districts: ["El Paso ISD", "Ysleta ISD", "Socorro ISD", "Canutillo ISD"],
    schools: [
      { school: "Coronado, Franklin", district: "El Paso ISD", level: "6A" },
      { school: "Eastwood", district: "Ysleta ISD", level: "6A" },
      { school: "Eastlake, Montwood, Pebble Hills, Socorro", district: "Socorro ISD", level: "6A" },
      { school: "Americas, El Dorado", district: "Socorro ISD", level: "5A Division I" },
      { school: "Bel Air, Hanks, Parkland", district: "Ysleta ISD", level: "5A Division I" },
      { school: "El Paso High, Burges, Chapin, Jefferson", district: "El Paso ISD", level: "5A Division II" },
      { school: "Del Valle", district: "Ysleta ISD", level: "5A Division II" },
      { school: "Canutillo", district: "Canutillo ISD", level: "5A Division II" },
      { school: "Andress, Austin", district: "El Paso ISD", level: "4A Division I" },
      { school: "Ysleta, Riverside", district: "Ysleta ISD", level: "4A Division I" },
      { school: "Bowie, Irvin", district: "El Paso ISD", level: "4A Division II" },
    ],
    schoolsNote:
      "District 1-6A is seven El Paso schools drawn from three different ISDs — Coronado and Franklin from El Paso ISD, Eastwood from Ysleta, and Eastlake, Montwood, Pebble Hills and Socorro from Socorro ISD. They play each other because there is nobody else within six hundred miles. That isolation is the single most important fact about buying anything for an El Paso program: everything comes a long way, so it has to arrive right the first time.",
    youthLeagues: [
      { name: "El Paso Flag Football League", note: "founded in 1999 as the Sun City Flag Football League and still running as an NFL Flag affiliate." },
      { name: "El Paso NFL Flag Football", note: "run through Neighborhood Sports for boys and girls aged five to fourteen, with a separate all-girls league." },
      { name: "N Zone Sports El Paso", note: "runs flag leagues and camps for ages three to fourteen." },
    ],
    youthNote:
      "El Paso's youth game is flag from top to bottom, including a dedicated all-girls league, and the oldest of the leagues has been running since 1999. Those orders are small and size-dense, and they suffer most from a supplier who treats the city as an afterthought. Our",
    levelMix: "flag",
    stadiums: [
      { name: "SISD Student Activities Complex", note: "Socorro ISD's 11,000-seat stadium, built in 1992." },
      { name: "Student Activities Complex II", note: "Socorro ISD's second stadium, a $58.9 million, 6,500-seat venue opened for the 2024 season." },
    ],
    seasonNote:
      "El Paso is on Mountain Time and six hundred miles from the rest of its own state, so a set that has to be reordered is effectively a fortnight lost. UIL's calendar is the same here as everywhere — conditioning from August 3 or August 10, week one on August 27–29 — but the margin for a mistake is not.",
    deliveryDays: "El Paso is about 635 miles from our DFW production, roughly nine hours by road — plan on a two- to three-day freight leg.",
    deliveryDetail:
      "Nine hours of highway is why we push El Paso programs to approve proofs earlier than anyone else and why we check the size breakdown twice before printing. A missing size in Amarillo is a phone call; in El Paso it is another two to three days on a truck, which is the whole point of getting the roster right before production rather than after.",
    orderIntro:
      "Distance shapes every El Paso order. We over-communicate on sizing, hold more extras than we would for a metroplex order, and build the schedule backwards from the freight leg rather than from the print date.",
    orderStory: [
      "Send the roster with the size breakdown, not just the count. On a 600-mile delivery the breakdown is the part that saves you a reorder.",
      "Send colors and the school mark. Seven El Paso schools play in one 6A district, so we proof the shade carefully — these teams are on each other's field every year.",
      "We return pricing and a free mockup within 24 hours, and we ask about extras explicitly rather than waiting for you to raise it.",
      "After approval we print the whole order at once and check the size count against your breakdown before it is boxed.",
      "Freight runs two to three days west. We confirm dispatch so you know the date rather than the window.",
    ],
    mostOrderedVarsity:
      "El Paso's 6A district is seven schools deep and orders full varsity and sub-varsity sets in spring, with extras built in because a reorder is a long way away. Our",
    mostOrderedPractice:
      "Seven schools in one district scrimmage each other constantly, and a two-color jersey means one garment travels instead of two. Our",
    faqs: [
      { q: "Do you deliver to El Paso?", a: "Yes. El Paso is about 635 miles from our DFW production, so freight is a two- to three-day leg rather than an overnight. We plan the schedule backwards from that and confirm the dispatch date so you are not guessing." },
      { q: "What happens if a size is wrong on an El Paso order?", a: "That is exactly why we push harder on the size breakdown here than anywhere else. We ask for the breakdown rather than a count, recommend extras in the sizes most likely to move, and check the boxed order against your list before it ships." },
      { q: "Which El Paso schools do you build for?", a: "All four districts — El Paso ISD, Ysleta ISD, Socorro ISD and Canutillo ISD — from the seven-school 6A district down to the 4A programs, plus the city's flag leagues and club teams." },
      { q: "Do you make uniforms for El Paso flag leagues?", a: "Yes, including girls' leagues. The El Paso Flag Football League has been running since 1999, and the NFL Flag programs here cover ages five to fourteen with a separate all-girls division." },
      { q: "What is the minimum order for an El Paso team?", a: "Ten pieces of a design, sizes mixed. A single flag roster clears it, and for a city this far out we usually suggest adding a few extras to the same run rather than reordering later." },
      { q: "Can you match the colors of a set bought years ago?", a: "Yes. Send a daylight photo and any color values you have; we proof the match before printing and keep the value on file so the next order does not have to be matched again by eye." },
      { q: "Is the fabric different for El Paso's dry heat?", a: "The build is the same performance knit, but the dry heat here is actually kinder to a jersey than Gulf humidity. What matters more is the sun — sublimated color is dyed into the fiber, so it does not lift or crack the way a pressed print can after a season of high-altitude sun." },
      { q: "Can you ship a partial order ahead of the rest?", a: "Yes, though on a two- to three-day lane it is usually better to ship once. If a jamboree date forces it, we can send the varsity block first and the sub-varsity blocks behind it." },
      { q: "How early should an El Paso program order?", a: "Earlier than the rest of the state. Add the freight leg to a two-to-four-week production window and work back from your first scrimmage — August 13 or August 20 depending on spring training — and a spring order is the only comfortable one." },
    ],
  },

  midland: {
    districts: ["Midland ISD", "Greenwood ISD"],
    schools: [
      { school: "Midland High", district: "Midland ISD", level: "6A" },
      { school: "Lee", district: "Midland ISD", level: "6A" },
      { school: "Greenwood", district: "Greenwood ISD", level: "4A Division I" },
      { school: "Midland Christian", district: "Private (TAPPS)", level: "TAPPS 5A" },
    ],
    schoolsNote:
      "District 2-6A is five schools across three cities: Midland High and Lee, Odessa and Odessa Permian, and San Angelo Central. That is the whole district — Permian Basin football in its purest form, where the shortest district road trip is a city away and the rivalry between the two Midland ISD schools carries the rest of the calendar. Greenwood, just outside town, plays 4A Division I.",
    youthLeagues: [
      { name: "Midland Rec Division", note: "a school-based youth flag football and cheer program running in Midland elementary schools for grades one through six." },
      { name: "i9 Sports Odessa and Midland", note: "runs flag football leagues for ages three and up across the two cities." },
    ],
    youthNote:
      "Midland's youth football runs inside the elementary schools themselves — the Rec Division is organized by campus rather than by club, grades one through six — so an order here is a set of small, campus-sized teams rather than one big league purchase. Our",
    levelMix: "youth",
    stadiums: [
      { name: "Astound Broadband Stadium", note: "the 18,000-capacity stadium at the Scharbauer Sports Complex, renamed in 2022 and used by Midland ISD football." },
    ],
    seasonNote:
      "A five-school district spread across Midland, Odessa and San Angelo means the longest regular district travel in Class 6A outside El Paso, and it starts the week of August 27–29. Uniforms that arrive during that first travel week arrive too late to be photographed in.",
    deliveryDays: "Midland is roughly 300 to 320 miles from our DFW production — a one- to two-day freight leg west.",
    deliveryDetail:
      "The run out I-20 to the Permian Basin is a day or two depending on the carrier's schedule, which is short enough for a normal spring order and long enough that an August rush is a real risk. We recommend building a week of slack into a Midland delivery rather than the two days the map suggests.",
    orderIntro:
      "A Midland order is a two-school town's order: two 6A rosters that play each other, a 4A program on the edge of it, and a campus-based youth program underneath.",
    orderStory: [
      "Tell us the school and whether the order covers sub-varsity. The two Midland ISD programs carry full blocks below varsity.",
      "Send the colors. In a city where the rivalry is between two schools in the same district, getting the shade exactly right matters more than usual.",
      "Pricing and a free mockup come back within 24 hours, proofed in your colors rather than a generic template.",
      "On approval the order prints in one pass, so a varsity set and a freshman set do not photograph as two different colors at Astound Broadband Stadium.",
      "Freight runs west on I-20 in a day or two; we confirm the dispatch date rather than leaving it open.",
    ],
    mostOrderedVarsity:
      "Two 6A programs in one district make full varsity and sub-varsity sets the standard Midland order each spring. Our",
    mostOrderedPractice:
      "With only five schools in the district, most of the work is internal — ones against twos, every afternoon, in two colors. Our",
    faqs: [
      { q: "Do you supply Midland ISD schools?", a: "Yes — Midland High and Lee at 6A, Greenwood at 4A Division I just outside the city, Midland Christian in TAPPS 5A, and the youth programs running in the elementary schools." },
      { q: "How long does delivery to Midland take?", a: "Midland is roughly 300 to 320 miles from our DFW production, a one- to two-day freight leg out I-20, on top of two to four weeks of production from proof approval." },
      { q: "Our district travel is huge — does that change the order?", a: "It changes what you should carry. District 2-6A spans Midland, Odessa and San Angelo, so teams here travel more than most and benefit from an extra set of practice tops and a properly counted run of extras rather than a tight order." },
      { q: "Do you make uniforms for Midland youth flag teams?", a: "Yes. The Midland Rec Division runs flag football by elementary campus for grades one through six, which means several small teams rather than one large league order — and ten pieces per design covers a campus team." },
      { q: "What is the minimum order in Midland?", a: "Ten pieces per design, sizes mixed. One campus flag team or one JV block clears it." },
      { q: "Can you match our school's exact colors?", a: "Yes. Send the values or a daylight photo of the current set and we proof the shade before printing, then keep the value on file so reorders line up with the original." },
      { q: "Do you outfit TAPPS schools in Midland?", a: "Yes. Midland Christian plays TAPPS 5A football and orders exactly as a UIL program does — same minimum, same process, same turnaround." },
      { q: "Can one order cover varsity, JV and freshman teams?", a: "Yes, and it is the better way to buy. One production run keeps all three blocks in the same dye lot and the combined quantity lowers the per-piece price." },
      { q: "When should a Midland program order?", a: "In spring. Week one falls on August 27–29 and this district's travel starts immediately, so a set arriving in late August misses the first road trip and the photos that go with it." },
    ],
  },

  lubbock: {
    districts: ["Lubbock ISD", "Lubbock-Cooper ISD", "Frenship ISD"],
    schools: [
      { school: "Lubbock High", district: "Lubbock ISD", level: "5A Division I" },
      { school: "Monterey", district: "Lubbock ISD", level: "5A Division I" },
      { school: "Frenship", district: "Frenship ISD", level: "5A Division I" },
      { school: "Frenship Memorial", district: "Frenship ISD", level: "5A Division I" },
      { school: "Coronado", district: "Lubbock ISD", level: "5A Division II" },
      { school: "Lubbock-Cooper", district: "Lubbock-Cooper ISD", level: "5A Division II" },
      { school: "Estacado", district: "Lubbock ISD", level: "4A Division II" },
      { school: "Lubbock-Cooper Liberty", district: "Lubbock-Cooper ISD", level: "4A Division II" },
    ],
    schoolsNote:
      "For 2026-28 there is no 6A football anywhere on the South Plains. Frenship dropped out of Class 6A for the first time since the conference was created in 2014, which leaves every program in and around Lubbock at 5A or below: four schools in 5A Division I, two in 5A Division II and two in 4A Division II. It is one of the cleanest single-conference markets in Texas, and it makes a Lubbock order easy to size.",
    youthLeagues: [
      { name: "City of Lubbock Parks and Recreation", note: "runs youth flag football as part of its youth recreation leagues." },
      { name: "Lubbock NFL Flag Football League", note: "the city's NFL Flag affiliate, running its own season for local youth teams." },
    ],
    youthNote:
      "Lubbock's youth football is run by the city and by one flag league rather than by a scatter of franchises, so the orders are fewer and larger and they arrive on a predictable schedule. Our",
    levelMix: "high-school",
    stadiums: [
      { name: "Lowrey Field at PlainsCapital Park", note: "Lubbock ISD's 8,500-seat stadium, reopened after renovation in August 2012 and home to all the district's high school football." },
    ],
    seasonNote:
      "Every Lubbock-area program is 5A or 4A now, so the city's schools mostly follow the earlier end of UIL's 2026 calendar — conditioning from August 3 and full contact from August 8 for anyone who did not hold spring training. That is a week earlier than the big-metro 6A schools, and the delivery date has to match it.",
    deliveryDays: "Lubbock is about 340 miles from our DFW production, roughly five hours — a one- to two-day freight leg.",
    deliveryDetail:
      "Five hours up US-84 puts Lubbock inside a comfortable freight window, but the early conference start dates here mean the deadline is a week sooner than a metroplex coach would assume. We work Lubbock schedules from an August 8 full-contact date rather than from week one.",
    orderIntro:
      "Lubbock is a 5A city with two 4A programs, which makes orders here unusually consistent in size — a predictable roster, a predictable size run, and one flag league underneath.",
    orderStory: [
      "Give us the school and the roster count; in a market with no 6A, we can size an order accurately from very little information.",
      "Send colors and any mark. The schools here share one stadium, so we proof for how a shade reads under Lowrey Field's lights.",
      "Pricing and a free mockup return inside a day at the 5A or 4A block you actually field.",
      "One production run covers the whole order, keeping the varsity set and the sub-varsity blocks matched.",
      "Freight runs a day or two up US-84, and we build the schedule from the August 8 contact date rather than from week one.",
    ],
    mostOrderedVarsity:
      "With every local program at 5A or 4A, Lubbock orders full game sets sized to a mid-size roster rather than a sprawling 6A one. Our",
    mostOrderedPractice:
      "One stadium and a small number of programs means a lot of intra-squad work, and two colors in one jersey is the cheapest way to run it. Our",
    faqs: [
      { q: "Which Lubbock schools do you build uniforms for?", a: "All of them — Lubbock High, Monterey, Coronado and Estacado in Lubbock ISD, Frenship and Frenship Memorial in Frenship ISD, and Lubbock-Cooper and Cooper Liberty in Lubbock-Cooper ISD." },
      { q: "Is there 6A football in Lubbock?", a: "Not for 2026-28. Frenship's move down leaves the South Plains without a 6A program for the first time since the conference was created in 2014, so every order here is sized to a 5A or 4A roster." },
      { q: "How long does shipping to Lubbock take?", a: "About 340 miles and five hours from our DFW production, so a one- to two-day freight leg after two to four weeks of production from proof approval." },
      { q: "When do Lubbock programs need their uniforms?", a: "Earlier than the big-metro schools. Most local programs can start conditioning on August 3 and full contact on August 8, so we work Lubbock delivery dates from that rather than from the first game." },
      { q: "Do you make uniforms for Lubbock youth leagues?", a: "Yes. The city parks department runs youth flag through its recreation leagues and the Lubbock NFL Flag league runs its own season, and both order at ten pieces per design." },
      { q: "What is the minimum order for a Lubbock team?", a: "Ten pieces per design with mixed sizes counted together — a single youth division or one sub-varsity block clears it." },
      { q: "Our program is 4A Division II — do you still build for us?", a: "Yes. Estacado and Cooper Liberty are exactly the size of order we handle every week; a 4A roster is a shorter run, not a harder one." },
      { q: "Can you match a set bought a few seasons ago?", a: "Yes. Send a daylight photo and any color value on file, and we proof the match before production so a partial reorder blends with the jerseys already in the locker room." },
      { q: "Do you supply coaches and sideline gear?", a: "Yes. Staff polos, quarter-zips and sideline jackets print in the same colors as the team kit, which reads clearly on a shared stadium sideline like Lowrey Field's." },
    ],
  },

  amarillo: {
    districts: ["Amarillo ISD", "Canyon ISD"],
    schools: [
      { school: "Amarillo High", district: "Amarillo ISD", level: "5A Division I" },
      { school: "Tascosa", district: "Amarillo ISD", level: "5A Division I" },
      { school: "Caprock", district: "Amarillo ISD", level: "5A Division I" },
      { school: "Palo Duro", district: "Amarillo ISD", level: "5A Division II" },
      { school: "Randall", district: "Canyon ISD", level: "4A Division I" },
      { school: "Canyon", district: "Canyon ISD", level: "4A Division I" },
      { school: "West Plains", district: "Canyon ISD", level: "4A Division I" },
      { school: "River Road", district: "River Road ISD", level: "3A Division II" },
      { school: "Highland Park", district: "Highland Park ISD", level: "2A Division I" },
    ],
    schoolsNote:
      "All four Amarillo ISD high schools — Amarillo, Tascosa, Caprock and Palo Duro — play their home games in the same building, Dick Bivins Stadium. Almost no other Texas city of this size runs football that way. Canyon ISD's three schools sit at 4A Division I just south of town, and the Panhandle drops away quickly from there: River Road at 3A Division II and Highland Park at 2A Division I are both inside the same metro.",
    youthLeagues: [
      { name: "Kids Inc.", note: "the long-running Amarillo youth sports organization, with NFL Flag Football Rec for kindergarten through sixth grade and a separate Flag Football Select program." },
      { name: "West Texas Flag Football", note: "an NFL Flag affiliate covering the Panhandle for ages four to twelve." },
      { name: "Amarillo Flag Football League", note: "a local flag league running its own seasons in the city." },
    ],
    youthNote:
      "Amarillo's youth scene splits neatly into rec and select — Kids Inc. runs both, and the select side orders like a club team while the rec side orders like a school. The two need different sets, and buying them together is how a program keeps one identity. Our",
    levelMix: "flag",
    stadiums: [
      { name: "Dick Bivins Stadium", note: "a 15,000-seat Amarillo ISD stadium opened in 1950 and shared by all four district high schools — the first stadium in the world to install FieldTurf, in 1998." },
    ],
    seasonNote:
      "Four programs in one stadium means the district's August is scheduled to the hour, and with most Amarillo schools at 5A the first scrimmage can fall on August 13. A set that lands the week before that is comfortable; one that lands during it is not.",
    deliveryDays: "Amarillo is roughly 345 to 365 miles north-west of our DFW production — a one- to two-day freight leg.",
    deliveryDetail:
      "The run up US-287 to the Panhandle is a day or two. What is worth knowing is that everything in Amarillo funnels through one stadium and one district office, so deliveries and fittings queue behind each other in a way they do not in a multi-venue city.",
    orderIntro:
      "An Amarillo order is a 5A or 4A order with a shared-stadium calendar around it, plus a youth scene that runs rec and select programs side by side.",
    orderStory: [
      "Tell us the school or the program and whether it is rec or select; the two order different quantities on different dates.",
      "Send colors and the mark. Four schools share Dick Bivins, so we proof the palettes to stay clearly separate under the same lights.",
      "Pricing and a free mockup come back within a day, cut for the block you field.",
      "The order prints in one run, which keeps a rec set and a select set in one color family rather than two.",
      "Freight runs a day or two up US-287; we confirm dispatch so the fitting date can be set.",
    ],
    mostOrderedVarsity:
      "Amarillo ISD's three 5A Division I programs and Palo Duro at 5A Division II order full game sets in spring, ahead of a shared-stadium August. Our",
    mostOrderedPractice:
      "Four schools sharing one stadium do their live work on their own practice fields, split two ways every afternoon. Our",
    faqs: [
      { q: "Which Amarillo schools do you supply?", a: "All four Amarillo ISD high schools — Amarillo, Tascosa, Caprock and Palo Duro — plus Canyon ISD's Randall, Canyon and West Plains at 4A Division I, and smaller Panhandle programs such as River Road and Highland Park." },
      { q: "How long does delivery to Amarillo take?", a: "Roughly 345 to 365 miles from our DFW production, a one- to two-day freight leg up US-287, added to two to four weeks of production from proof approval." },
      { q: "Four schools share one stadium — does that affect the uniforms?", a: "It affects the color proofing. Dick Bivins Stadium hosts all four Amarillo ISD programs under the same lights, so we check that a new shade reads clearly against the other three rather than only against a swatch." },
      { q: "Do you make uniforms for Kids Inc. teams?", a: "Yes. Kids Inc. runs both NFL Flag rec for kindergarten to sixth grade and a select flag program, and the two order differently — the select teams behave like club teams, the rec teams like school squads." },
      { q: "What is the minimum order in Amarillo?", a: "Ten pieces per design, mixed sizes counted together. One rec division or one select roster clears it." },
      { q: "Our school is 4A — can you still price it well?", a: "Yes. Canyon ISD's 4A Division I programs are a normal order for us; a shorter roster changes the run length, not the per-piece build or the process." },
      { q: "Can you match colors on a reorder?", a: "Yes. The color values are stored with your order, so a mid-season reorder for new players comes off the same spec rather than being eyeballed against an old jersey." },
      { q: "Do you supply six-man and small-school programs in the Panhandle?", a: "Yes. A 2A or 3A roster is well inside our ten-piece minimum, and small-school orders get the same free mockup and proofing as a 5A one." },
      { q: "When should an Amarillo program order for the fall?", a: "In spring. With most local schools at 5A, first scrimmages can fall on August 13, and four programs fitting out through one stadium calendar makes late deliveries hard to absorb." },
    ],
  },

  frisco: {
    districts: ["Frisco ISD", "Prosper ISD", "Little Elm ISD", "Lewisville ISD", "Plano ISD"],
    schools: [
      { school: "Wakeland", district: "Frisco ISD", level: "6A" },
      { school: "Lone Star", district: "Frisco ISD", level: "5A Division I" },
      { school: "Centennial", district: "Frisco ISD", level: "5A Division I" },
      { school: "Heritage", district: "Frisco ISD", level: "5A Division I" },
      { school: "Liberty", district: "Frisco ISD", level: "5A Division I" },
      { school: "Reedy", district: "Frisco ISD", level: "5A Division I" },
      { school: "Lebanon Trail", district: "Frisco ISD", level: "5A Division I" },
      { school: "Frisco High, Emerson, Independence, Memorial, Panther Creek", district: "Frisco ISD", level: "5A Division II" },
      { school: "Rock Hill", district: "Prosper ISD", level: "6A" },
      { school: "Legacy Christian Academy", district: "Private (TAPPS)", level: "TAPPS 5A" },
    ],
    schoolsNote:
      "Twelve high schools in one district, and the UIL split them down the middle for 2026-28: six Frisco ISD schools in District 5-5A Division I, five in 4-5A Division II, and Wakeland up in 6A on its own. Rock Hill sits inside Frisco's city limits but belongs to Prosper ISD. Lone Star reached the 5A Division I state final in 2025 after starting the season 15-0. A city with that many programs orders uniforms in a way nowhere else does — several schools, same colors family, same delivery week.",
    youthLeagues: [
      { name: "i9 Sports South Frisco", note: "runs flag football leagues at the Shawnee Trail Sports Complex." },
      { name: "Neighborhood Sports Frisco North", note: "an NFL Flag league playing its games on the fields at Legacy Christian Academy." },
      { name: "Frisco Football League", note: "a local youth football organization running its own seasons in the city." },
    ],
    youthNote:
      "Frisco's youth flag leagues run on complexes rather than school fields — Shawnee Trail for the south side, Legacy Christian's fields for the north — and both run multiple divisions at once. That means a league order arrives as several small sets with one deadline. Our",
    levelMix: "flag",
    stadiums: [
      { name: "Toyota Stadium", note: "the MLS ground Frisco ISD has used as a tenant since 2005, seating roughly 11,000 during the current redevelopment." },
      { name: "Ford Center at The Star", note: "a 12,000-seat indoor stadium built as a partnership between the Dallas Cowboys, the City of Frisco and Frisco ISD — the rare Texas high school venue with a roof." },
      { name: "David Kuykendall Stadium", note: "one of Frisco ISD's own football stadiums." },
    ],
    seasonNote:
      "An indoor venue does not change the UIL calendar — conditioning on August 3 or August 10 depending on spring training, week one on August 27–29 — but it does change what a Frisco uniform has to photograph well under, because a set that looks right under stadium lights can read differently under the Ford Center's roof.",
    deliveryDays: "Frisco is about 25 miles from DFW Airport, the shortest delivery run of any city on our list outside Dallas itself.",
    deliveryDetail:
      "Twelve high schools in one district means twelve programs wanting delivery in the same two weeks of August, so a Frisco order is really competing for production time rather than transit time. The delivery leg is short; the press time in early August is what runs out.",
    orderIntro:
      "Frisco orders are rarely for one team. A district this dense often orders across programs, and a youth league here is several divisions on one purchase order.",
    orderStory: [
      "Tell us whether it is one program or several, and give a count per team. Combined counts across programs still get one combined price.",
      "Send each team's colors. Where a family of schools shares a palette, we proof them side by side so two Frisco schools do not end up a shade apart.",
      "Free mockup in 24 hours per design. A league ordering four divisions gets four mockups, not one with a note.",
      "On approval everything prints in one run. That is the only reliable way to keep several teams' sets matching if they will share a field.",
      "Delivery is short — around 25 miles — but the early-August production slot is the constraint, so book it rather than assume it.",
    ],
    mostOrderedVarsity:
      "With six schools in 5A Division I and five in 5A Division II, the common Frisco order is a full game set for a 5A roster placed in spring. Our",
    mostOrderedPractice:
      "Twelve schools in one district scrimmage each other constantly, and a two-color jersey means a team can host or travel without packing a second set. Our",
    faqs: [
      { q: "Which Frisco schools do you build for?", a: "All of them — Wakeland at 6A, the six Frisco ISD schools in 5A Division I including Lone Star, the five in 5A Division II, Prosper ISD's Rock Hill inside the city limits, and Legacy Christian Academy in TAPPS 5A." },
      { q: "Can you quote several Frisco programs on one order?", a: "Yes, and it is worth doing. A combined quantity across programs gets one price break, and printing them in one run is the only way to guarantee that two schools sharing a color come out identical." },
      { q: "How quickly can you deliver to Frisco?", a: "Frisco is about 25 miles from DFW Airport, so transit is negligible. The real constraint is production time in early August, when a district with twelve high schools all wants delivery in the same fortnight — book the slot in spring." },
      { q: "Do you make flag football uniforms for Frisco leagues?", a: "Yes. The i9 Sports league at Shawnee Trail, the Neighborhood Sports NFL Flag divisions playing at Legacy Christian and the Frisco Football League all order at the 10-piece minimum per design, and we mock up each division separately." },
      { q: "What is the minimum order in Frisco?", a: "Ten pieces per design. A single flag division clears it; a 5A varsity roster clears it several times over. Mixed sizes count toward the same 10." },
      { q: "Will our uniforms look right under the Ford Center's roof?", a: "We proof for it. Indoor lighting reads color differently from stadium floodlights, so if your program plays at the Ford Center or Toyota Stadium, tell us and we proof the shade with that in mind rather than only for daylight." },
      { q: "Our school is 5A Division II — is the order different from a 5A Division I school?", a: "Only in size. The garment and the process are identical; the Division II rosters in Frisco ISD are generally smaller, so the size run is narrower and we hold fewer extras at the extremes." },
      { q: "Can you print home and away sets for a Frisco program together?", a: "Yes. Two colorways of one design in a single production run share the setup cost and keep names and numbers identical across both sets." },
      { q: "When should a Frisco team order for the fall?", a: "As early in spring as the roster allows. UIL's 2026 calendar opens conditioning on August 3 or August 10 depending on spring training, and Frisco's twelve programs all want their sets before that." },
    ],
  },

  mckinney: {
    districts: ["McKinney ISD", "Prosper ISD", "Frisco ISD", "Melissa ISD", "Celina ISD", "Lovejoy ISD"],
    schools: [
      { school: "McKinney", district: "McKinney ISD", level: "6A" },
      { school: "McKinney Boyd", district: "McKinney ISD", level: "6A" },
      { school: "McKinney North", district: "McKinney ISD", level: "5A Division I" },
    ],
    schoolsNote:
      "Three high schools, one stadium, and a classification line that just moved. McKinney and McKinney Boyd went up to 6A for 2026-28 into District 6-6A with Allen, Prosper's three schools, Princeton and Dallas Jesuit, while McKinney North stayed in 5A Division I — a rezoning finalized after the UIL submission deadline is why. The city's edges are zoned to six other districts, so a club team pulling from north McKinney can carry players from three of them.",
    youthLeagues: [
      { name: "Plano Sports Authority McKinney", note: "runs flag and tackle football at Gabe Nesbitt Community Park in McKinney." },
      { name: "Texas Youth Football & Cheer Association", note: "runs flag and tackle from 5U to 13U plus 7-on-7 teams across the McKinney and North Texas area." },
      { name: "City of McKinney Athletics", note: "handles the city's youth sports registration and the fields those leagues play on." },
    ],
    youthNote:
      "McKinney is a 7-on-7 town as much as a tackle one — TYFA runs 7-on-7 alongside its 5U-to-13U flag and tackle divisions, and those summer rosters order separately from the fall ones. Our",
    levelMix: "7-on-7",
    stadiums: [
      { name: "McKinney ISD Stadium & Community Events Center", note: "a roughly 12,000-seat purpose-built stadium on South Hardin Boulevard shared by all three McKinney ISD high schools." },
    ],
    seasonNote:
      "One stadium for three programs compresses everything: photo days, jamborees and the first home games all queue through the same building in the last week of August, with week one on August 27–29.",
    deliveryDays: "McKinney is about 36 miles from DFW Airport — a local delivery on our normal metro schedule.",
    deliveryDetail:
      "The drive north is short enough that McKinney orders never see a freight carrier. What is worth planning around is the shared stadium: three programs with one venue means the set has to be in hand before the building's August schedule starts, not during it.",
    orderIntro:
      "A McKinney order now spans two conferences inside one district, and often a summer 7-on-7 roster as well. Those are different garments on different calendars.",
    orderStory: [
      "Say which season the order is for. A 7-on-7 set is ordered in spring for summer play; a fall game set is ordered in spring for August.",
      "Send the roster count and the colors. For a club team drawing from several districts, send the club's own colors rather than a school's.",
      "We quote and mock up within 24 hours, at the right block — the 7-on-7 cut is lighter than the game jersey it sits next to in the same bag.",
      "Approve the proof and the whole order prints together, which keeps a summer set and a fall set in the same color family rather than two versions of the same navy.",
      "Delivery runs 36 miles down the tollway on the standard metro schedule.",
    ],
    mostOrderedVarsity:
      "With two schools newly at 6A, McKinney's varsity orders got bigger this cycle, and they are still placed in the spring window. Our",
    mostOrderedPractice:
      "Three programs sharing one stadium do most of their live work on their own practice fields, split into two colors every afternoon. Our",
    faqs: [
      { q: "Do you make uniforms for McKinney ISD teams?", a: "Yes — McKinney and McKinney Boyd at 6A and McKinney North at 5A Division I, plus the club, youth and 7-on-7 teams in the city and the districts around its edges." },
      { q: "Do you build 7-on-7 uniforms for McKinney summer teams?", a: "Yes. TYFA runs 7-on-7 alongside its tackle and flag divisions here, and those rosters order in spring for summer play. The 7-on-7 cut is lighter than a fall game jersey, so we quote it as its own garment rather than reusing the game set." },
      { q: "How long does delivery to McKinney take?", a: "McKinney is about 36 miles from DFW Airport, so it is a local delivery — two to four weeks of production from proof approval and then the drive up, with no freight carrier involved." },
      { q: "Our club draws players from several districts — can the uniform be club-branded?", a: "Yes, and for a McKinney club it usually should be. The city's edges are zoned to six districts, so a club identity travels better than a school mark on a roster pulled from three of them." },
      { q: "What is the minimum order for a McKinney team?", a: "Ten pieces per design. A 7-on-7 roster clears it, a youth division clears it, and a high school block clears it several times over." },
      { q: "Can you print the same design on a summer and a fall set?", a: "Yes, and printing them together is what keeps them matching. Ordered months apart, two sets of the same navy can drift; ordered in one run they come out of the same dye lot." },
      { q: "How big is a 6A order for a McKinney school?", a: "Larger than it used to be — both McKinney and McKinney Boyd moved up to 6A for 2026-28, which means longer rosters and wider size runs. We price from your actual counts." },
      { q: "Can you match McKinney ISD school colors?", a: "Yes. Send the color values or a daylight photo of the existing jersey. We proof the match before production and keep the values on file so a partial reorder lines up with the sets already in the locker room." },
      { q: "When should a McKinney program order?", a: "Spring, for both seasons. Three programs share one stadium here, so the last week of August is already full of photo days and jamborees before anyone plays week one on August 27–29." },
    ],
  },

  allen: {
    districts: ["Allen ISD", "Plano ISD", "Lovejoy ISD"],
    schools: [
      { school: "Allen", district: "Allen ISD", level: "6A" },
      { school: "Lovejoy", district: "Lovejoy ISD", level: "5A Division II" },
    ],
    schoolsNote:
      "Allen is a one-high-school city, and that one school is among the most decorated programs in Texas — state champions in 2008, 2012, 2013, 2014 and 2017, with 16-0 seasons in 2013 and 2014 and an 84-game regular-season winning streak between 2012 and 2021. Everything in the city's football pipeline points at a single varsity roster, which makes the uniform order here unusually large and unusually consistent year to year.",
    youthLeagues: [
      { name: "Allen Sports Association", note: "has run youth football in the city since 1976 — spring flag for kindergarten and first grade, spring 7-on-7 from second grade through high school, and tackle football in the fall." },
      { name: "N Zone Sports Lonestar", note: "runs youth flag football leagues serving Allen." },
    ],
    youthNote:
      "The Allen Sports Association runs 7-on-7 from second grade all the way to high school in the spring, which is unusual — most cities start 7-on-7 in middle school. It means a spring uniform season here that is almost as large as the fall one. Our",
    levelMix: "7-on-7",
    stadiums: [
      { name: "Eagle Stadium", note: "an 18,000-seat, $60 million Allen ISD stadium opened in 2012 and used by one high school — the largest single-tenant high school stadium in the country." },
    ],
    seasonNote:
      "Allen's calendar runs twice: spring 7-on-7 from second grade up through the ASA, then the UIL fall season with conditioning from August 3 or August 10 depending on spring training and week one on August 27–29. A supplier that only plans for August misses half the city's orders.",
    deliveryDays: "Allen is roughly 31 miles from DFW Airport, a local delivery with no freight leg.",
    deliveryDetail:
      "Because everything here funnels through one school and one association, Allen orders tend to be large and predictable, and we keep the color values on file between seasons so a spring 7-on-7 set and a fall tackle set come out of the same spec rather than two separate guesses at the same red.",
    orderIntro:
      "An Allen order is either a very large single-program order or an association order covering several spring divisions. Both are planned around a single set of school colors that the whole city already knows.",
    orderStory: [
      "Tell us the level and the count — a 7-on-7 roster, a youth tackle division, or a school block.",
      "Send the colors once. We store the values against your account so the spring and fall orders match without re-proofing the shade each time.",
      "Free mockup inside 24 hours. Spring 7-on-7 sets are mocked on the lighter block, because they are worn without pads.",
      "On approval we print. Association orders covering several divisions print together so the second-graders and the middle-schoolers are visibly the same team.",
      "Delivery is local, 31 miles, on the normal metro schedule.",
    ],
    mostOrderedVarsity:
      "A single 6A program that carries the whole city's attention orders a large varsity and sub-varsity set in one spring pass. Our",
    mostOrderedPractice:
      "One school, several practice squads, and a scout team that changes color every period — a two-sided jersey does the work of two sets here. Our",
    faqs: [
      { q: "Do you make uniforms for Allen teams?", a: "Yes — Allen High School's 6A program, the Allen Sports Association's flag, 7-on-7 and tackle divisions, and the club teams in the city, plus Lovejoy at 5A Division II just outside it." },
      { q: "Do you build spring 7-on-7 uniforms?", a: "Yes, and in Allen that is a real season. The ASA runs 7-on-7 from second grade through high school in the spring, so those sets are ordered months before the fall tackle order and are cut lighter, because they are worn without pads." },
      { q: "How fast can you deliver to Allen?", a: "Allen is about 31 miles from DFW Airport, so it is a local delivery — two to four weeks of production from proof approval and no freight carrier in between." },
      { q: "Can a spring set and a fall set match exactly?", a: "Yes. We keep the color values on file against your order, so a 7-on-7 set printed in March and a tackle set printed in June come off the same spec rather than two separate attempts at the same red." },
      { q: "What is the minimum order for an Allen team?", a: "Ten pieces per design, with mixed sizes counted together. A single 7-on-7 roster or one youth division clears it." },
      { q: "How large is a typical order for a 6A program like Allen's?", a: "Large. A single 6A roster plus sub-varsity blocks can run into the hundreds of pieces across a season, which is why we quote per-piece at your combined quantity rather than per block." },
      { q: "Do you supply youth tackle uniforms as well as flag?", a: "Yes. The ASA has run youth tackle here since 1976, and a tackle set has to sit over shoulder pads — a different cut from the flag jersey the same child wore in the spring." },
      { q: "Can you print names and numbers on youth sets?", a: "Yes. Names, numbers and patches are sublimated into the fabric in the same run, which is what keeps a youth jersey legible after a season of weekly washing." },
      { q: "When should an Allen team order?", a: "Twice a year, and both times early: spring sets need ordering in late winter, and fall sets in spring, ahead of an August 3 or August 10 conditioning start and week-one games on August 27–29." },
    ],
  },

  "fort-worth": {
    districts: ["Fort Worth ISD", "Crowley ISD", "Keller ISD", "Eagle Mountain-Saginaw ISD"],
    schools: [
      { school: "Paschal", district: "Fort Worth ISD", level: "5A Division I" },
      { school: "Trimble Tech", district: "Fort Worth ISD", level: "5A Division I" },
      { school: "Arlington Heights", district: "Fort Worth ISD", level: "5A Division I" },
      { school: "O.D. Wyatt", district: "Fort Worth ISD", level: "5A Division I" },
      { school: "North Side", district: "Fort Worth ISD", level: "5A Division I" },
      { school: "Polytechnic", district: "Fort Worth ISD", level: "5A Division I" },
      { school: "Dunbar", district: "Fort Worth ISD", level: "4A Division I" },
      { school: "North Crowley", district: "Crowley ISD", level: "6A" },
      { school: "Timber Creek", district: "Keller ISD", level: "6A" },
      { school: "Boswell", district: "Eagle Mountain-Saginaw ISD", level: "6A" },
    ],
    schoolsNote:
      "Fort Worth is unusual: the district that carries the city's name has no 6A football program, while three districts that serve the city's edges do. Fort Worth ISD's comprehensive high schools sit in 5A Division I and 4A Division I, and the 6A football inside the city limits belongs to Crowley ISD's North Crowley, Keller ISD's Timber Creek and Central, and Eagle Mountain-Saginaw's Boswell out by the lake.",
    youthLeagues: [
      { name: "YMCA of Fort Worth flag football", note: "runs youth flag for ages 5 to 14 in four grade bands — kinder to first, second to third, fourth to fifth, and a middle school division — which is the size grid most of our Fort Worth youth orders follow." },
    ],
    youthNote:
      "Fort Worth's youth football sits in grade bands rather than age brackets, and the YMCA's four-band structure is the one most local coaches quote when they ask for sizes. That means a single order often spans a kinder small to a middle-school adult medium. Our",
    levelMix: "youth",
    stadiums: [
      { name: "Farrington Field", note: "an 18,500-seat Fort Worth ISD stadium opened in 1939 and still the district's showcase venue — one of the oldest and largest true district-owned stadiums in Texas." },
    ],
    seasonNote:
      "Fort Worth ISD's 5A programs that held spring training can start conditioning on August 10 under UIL's 2026 calendar, full contact on August 15 and their first scrimmage on August 20. A set that arrives during that scrimmage window has already missed the first team photos.",
    deliveryDays: "Fort Worth sits on the west side of our home metroplex — a local delivery, no freight carrier involved.",
    deliveryDetail:
      "Nothing about a Fort Worth delivery depends on a truck leaving the metroplex, so the only real deadline is the proof approval. Programs out toward Eagle Mountain Lake and the Crowley side are on the same schedule as the ones near downtown; the mileage difference inside the city does not change the date.",
    orderIntro:
      "Fort Worth orders divide cleanly. The Fort Worth ISD programs order like 5A schools — full game sets, spring placement, tight sizing. The youth associations order like leagues — mixed grade bands, late-summer placement and a lot of small sizes.",
    orderStory: [
      "Tell us which of the two you are: a school program with a roster, or a league with divisions. The quote is structured differently for each.",
      "Send colors and any existing mark. Several Fort Worth ISD schools carry a mark older than any digital file, so a clean photo of a helmet or a letter jacket is enough for us to redraw it.",
      "We return per-piece pricing and a free mockup within 24 hours. League orders get one mockup per division so the 8U set and the middle-school set can be compared side by side.",
      "After approval we print the whole order in one run, which keeps the color identical across divisions that will stand next to each other at a jamboree.",
      "Delivery is local, so a Fort Worth order can be split into two drops — the coaches' gear first, the player kits when the roster closes — without a second freight charge.",
    ],
    mostOrderedVarsity:
      "Fort Worth ISD's 5A Division I schools order full varsity and JV sets together, because the two rosters share a size run and one production pass is cheaper than two. Our",
    mostOrderedPractice:
      "With most of the city's programs in one conference, Fort Worth scrimmages are inter-district as often as they are internal, and a two-color jersey saves carrying two sets to another school's field. Our",
    faqs: [
      { q: "Do you make uniforms for Fort Worth ISD schools?", a: "Yes. Fort Worth ISD's comprehensive high schools — Paschal, Trimble Tech, Arlington Heights, O.D. Wyatt, North Side, Polytechnic, Dunbar and the rest — are all inside our normal quoting range, and the district's 5A Division I rosters clear the 10-piece minimum on the varsity list alone." },
      { q: "Is there 6A football inside Fort Worth?", a: "Yes, but not in Fort Worth ISD. The 6A programs serving the city belong to neighboring districts — North Crowley in Crowley ISD, Timber Creek and Central in Keller ISD, and Boswell in Eagle Mountain-Saginaw ISD. We build for all of them." },
      { q: "How long does delivery to Fort Worth take?", a: "Fort Worth is in our home metroplex, so there is no freight leg. Plan on two to four weeks of production from the day you approve the proof, then a local delivery — the same schedule whether the school is downtown or out by Eagle Mountain Lake." },
      { q: "Can you build a youth league order that spans several grade bands?", a: "Yes, and it is the common Fort Worth request. The YMCA's flag program runs kinder-to-first, second-to-third, fourth-to-fifth and a middle school band, so one league order can run from a youth small to an adult medium. We print the whole order together so the colors match across divisions." },
      { q: "We have no digital file for our school's logo — can you still print it?", a: "Yes. Send a photograph of a helmet, a letter jacket or an old jersey and we redraw the mark as vector art before proofing. Several Fort Worth programs carry a crest that predates any file the school still has." },
      { q: "What is the minimum order for a Fort Worth team?", a: "Ten pieces per design, with mixed sizes counting toward the same 10. A single youth flag division clears it, and a high school varsity roster clears it several times over." },
      { q: "Can you split the delivery between coaches' gear and player kits?", a: "Yes. Because Fort Worth is a local delivery rather than a freight shipment, we can drop coaches' and staff apparel first and the player kits when the roster closes, without charging a second shipment." },
      { q: "When do Fort Worth programs need to order for the fall?", a: "UIL's 2026 calendar lets 5A and 6A schools that held spring training start conditioning on August 10, with full contact on August 15 and a first scrimmage on August 20. Ordering by late spring puts the set in the field house before that window opens." },
      { q: "Do you print practice and game jerseys in the same colors?", a: "Yes. The dye values are stored with your order, so a practice set printed in June and a game set printed in August come out of the same color spec rather than drifting a shade apart." },
    ],
  },

  // ────────────────────────────────────────────── Greater Houston ──
  houston: {
    districts: ["Houston ISD", "Cypress-Fairbanks ISD", "Spring Branch ISD", "Alief ISD", "Aldine ISD", "Klein ISD"],
    schools: [
      { school: "Bellaire", district: "Houston ISD", level: "6A" },
      { school: "Heights", district: "Houston ISD", level: "6A" },
      { school: "Lamar", district: "Houston ISD", level: "6A" },
      { school: "North Shore", district: "Galena Park ISD", level: "6A" },
      { school: "Cy-Fair", district: "Cypress-Fairbanks ISD", level: "6A" },
      { school: "Elsik, Hastings and Taylor", district: "Alief ISD", level: "6A" },
      { school: "Milby", district: "Houston ISD", level: "5A Division I" },
      { school: "Westbury", district: "Houston ISD", level: "5A Division I" },
      { school: "Waltrip", district: "Houston ISD", level: "5A Division I" },
      { school: "Wisdom", district: "Houston ISD", level: "5A Division I" },
      { school: "Yates", district: "Houston ISD", level: "4A Division II" },
      { school: "Strake Jesuit", district: "Private (UIL member)", level: "6A" },
    ],
    schoolsNote:
      "A city this size does not have one football market; it has eight or nine. Houston ISD runs 6A programs at Bellaire, Heights and Lamar while most of the rest of the district plays 5A Division I and Yates plays 4A Division II. Around it, Galena Park's North Shore, Cypress-Fairbanks and Alief's three schools all field 6A programs, and Strake Jesuit plays 6A as a private UIL member. Six districts touch the city, which is why a Houston quote starts with which side of town you are on.",
    youthLeagues: [
      { name: "Houston Texans Youth Football (NFL FLAG Houston)", note: "the NFL's flag league in the city, running from age four to fifteen." },
      { name: "YMCA of Greater Houston youth flag football", note: "runs flag in partnership with the Texans across the association's Houston branches." },
      { name: "i9 Sports Houston", note: "runs flag football and multi-sport leagues at venues across the metro." },
      { name: "Texas Youth Football & Cheer Association", note: "carries spring and fall flag and tackle teams in the Houston area through its team finder." },
    ],
    youthNote:
      "The youth side of Houston is enormous and it is mostly flag — the Texans' own league takes players from four years old, and the YMCA runs alongside it. Tackle programs through TYFA run spring as well as fall, so Houston is one of the few places where uniform orders never really stop. Our",
    levelMix: "youth",
    stadiums: [
      { name: "Delmar Stadium", note: "Houston ISD's 12,000-seat stadium, shared by district programs across the west side." },
      { name: "Joe K. Butler Stadium", note: "an 8,000-seat Houston ISD venue in southwest Houston." },
      { name: "Herman A. Barnett Stadium", note: "another shared Houston ISD football, soccer and track complex." },
    ],
    seasonNote:
      "Houston's August is the hardest test a jersey gets anywhere in Texas. Conditioning opens on August 3 for schools without spring training and August 10 for the 5A and 6A programs that held it, which in this climate means a month of two-a-days in heat and humidity before week one on August 27–29.",
    deliveryDays: "Houston is about 239 miles from our DFW production down I-45 — a one-day freight lane, not an overnight courier run.",
    deliveryDetail:
      "The I-45 run from the metroplex to Houston is a standard one-day freight lane, so the schedule here is production plus a day, not production plus a week. Where Houston costs you time is the roster: a 6A program on this side of the state can still be adding players in the second week of August.",
    orderIntro:
      "Houston orders are shaped by heat and by scale. Fabric weight matters more here than anywhere else on our list, and the orders themselves are big — 6A rosters, multi-school districts, and youth leagues that run four-year-olds through fifteen-year-olds.",
    orderStory: [
      "Tell us the district and the level. Houston ISD, Cy-Fair, Alief, Aldine, Klein and Spring Branch all quote the same way, but the size runs differ by program.",
      "Say whether the set is for August or for a spring season. Houston's tackle and flag programs run both, and the fabric choice is different for a summer set.",
      "We return per-piece pricing and a free mockup within 24 hours, proofed in your colors rather than a stock layout.",
      "After approval the order prints in one run. For a Gulf-coast program we default to the lighter, faster-drying knit unless you tell us otherwise.",
      "Freight runs down I-45 and lands the next day, so the delivery date is set by the proof date, not by the distance.",
    ],
    mostOrderedVarsity:
      "The largest Houston orders are full 6A game sets, ordered in spring so they beat the August heat rather than arrive in the middle of it. Our",
    mostOrderedPractice:
      "In a Houston August a practice jersey is wet by the second period, and carrying two colors in one garment halves what a coach has to wash and haul. Our",
    faqs: [
      { q: "Which Houston-area districts do you supply?", a: "Houston ISD and the districts that serve the rest of the city — Cypress-Fairbanks, Spring Branch, Alief, Aldine and Klein — along with Galena Park's North Shore, private UIL members such as Strake Jesuit, and the club and youth programs across the metro." },
      { q: "What fabric holds up best in Houston's humidity?", a: "A lighter, open-knit performance fabric with full sublimation. Because the color is dyed into the fiber rather than printed on top, a jersey that is soaked through by the second period of an August practice dries without the print stiffening or lifting." },
      { q: "How long does shipping to Houston take?", a: "Houston is about 239 miles down I-45 from our DFW production, which is a standard one-day freight lane. The schedule is two to four weeks of production from proof approval plus that day in transit." },
      { q: "Do you outfit Houston youth flag leagues?", a: "Yes. The Texans' NFL FLAG program starts at four years old, the YMCA runs flag alongside it and i9 Sports runs leagues across the metro — all of them order at ten pieces per design, in the small youth sizes those divisions need." },
      { q: "Can you handle a 6A order for a Houston program?", a: "Yes. A 6A roster here plus JV and freshman blocks is a large order, and quoting the blocks together gets a better per-piece price than splitting them and keeps every jersey in one dye lot." },
      { q: "Do you make spring as well as fall uniforms?", a: "Yes, and Houston is the city where that matters most — TYFA runs spring tackle and flag alongside the fall season, so we quote spring sets as their own order rather than treating them as leftovers from August." },
      { q: "What is the minimum order for a Houston team?", a: "Ten pieces of a design. A single youth flag division clears that, and mixed sizes within a design count toward the same ten." },
      { q: "Our school is 5A Division I — do you build for us as well as the 6A schools?", a: "Yes. Most of Houston ISD sits in 5A Division I, and those rosters are a normal order for us. Only the size run changes against a 6A order, not the garment or the process." },
      { q: "Can you print a school mark we only have on an old jersey?", a: "Yes. Send a daylight photograph and we redraw the mark as vector art before proofing, which is common for Houston ISD programs carrying a crest older than any file the campus still holds." },
      { q: "When should a Houston program order for the fall?", a: "By late spring. With conditioning opening August 3 or August 10 depending on spring training, a set that ships in mid-August arrives in the middle of the hardest two weeks of the year for a Houston coach." },
    ],
  },

  katy: {
    districts: ["Katy ISD"],
    schools: [
      { school: "Katy", district: "Katy ISD", level: "6A" },
      { school: "Cinco Ranch", district: "Katy ISD", level: "6A" },
      { school: "Seven Lakes", district: "Katy ISD", level: "6A" },
      { school: "Tompkins", district: "Katy ISD", level: "6A" },
      { school: "Taylor", district: "Katy ISD", level: "6A" },
      { school: "Morton Ranch", district: "Katy ISD", level: "6A" },
      { school: "Mayde Creek", district: "Katy ISD", level: "6A" },
      { school: "Paetow", district: "Katy ISD", level: "6A" },
      { school: "Jordan", district: "Katy ISD", level: "6A" },
      { school: "Freeman", district: "Katy ISD", level: "5A Division I" },
      { school: "Harmony School of Excellence", district: "Charter", level: "4A Division II" },
    ],
    schoolsNote:
      "Nine 6A football programs in one school district, and everyone in town is zoned to that district. Nothing else in Texas looks quite like Katy ISD: the 2026-28 alignment leaves Freeman as the only district school outside 6A, at 5A Division I. For a uniform supplier that means nine large rosters ordering in the same weeks, all wanting the same delivery window before August.",
    youthLeagues: [
      { name: "Katy Youth Football", note: "runs the city's fall flag league, including a girls-only division." },
      { name: "i9 Sports Greater Katy", note: "runs flag football at Creech Elementary, McMeans Junior High and the Memorial Hermann Sports Park." },
      { name: "Fulshear Sports Association", note: "runs an NFL Flag league from 6U to 12U serving the Fulshear and west Katy side." },
      { name: "N Zone Sports Katy", note: "runs flag leagues and camps for ages three to thirteen." },
    ],
    youthNote:
      "Katy's youth football is almost entirely flag, spread over four organizations and several complexes, and one of them runs a girls-only division. Those rosters are small, the sizes are small, and the orders come in clusters right before the season. Our",
    levelMix: "flag",
    stadiums: [
      { name: "Legacy Stadium", note: "a 12,000-seat Katy ISD stadium opened in 2017 at a cost of $70.3 million, with Mike Johnston Field inside it." },
      { name: "Rhodes Stadium", note: "Katy ISD's original 9,840-seat stadium, opened in 1981 and still in weekly use." },
    ],
    seasonNote:
      "Two district stadiums on one complex can hold something like 20,000 people on a Friday, and nine 6A programs have to share those two buildings across a season. That schedule, plus a first-scrimmage date of August 13 or August 20 depending on spring training, is what a Katy delivery date has to beat.",
    deliveryDays: "Katy is about 30 miles west of Houston and 258 miles from our DFW production — a one-day freight run.",
    deliveryDetail:
      "Katy is a single-district city, which means nine programs with one athletics calendar and one set of purchasing rhythms. Freight from the metroplex is a day; the part worth planning is that all nine want their sets in the same two weeks.",
    orderIntro:
      "A Katy order is almost always a 6A order — long rosters, wide size runs, and a set that has to be ready for a stadium schedule shared with eight other schools.",
    orderStory: [
      "Send the school, the roster count and whether JV and freshman blocks are included in the same design.",
      "Send colors. Katy ISD schools sit close together in palette terms, so we proof the exact shade rather than working from a color name.",
      "You get pricing and a free mockup within a day, proofed at both ends of the size run because a 6A roster carries a genuinely wide spread.",
      "One production run covers the whole order, so varsity and sub-varsity stand together at Legacy Stadium without a visible color difference.",
      "Freight runs I-10 through Houston and lands the next day.",
    ],
    mostOrderedVarsity:
      "With nine 6A programs inside one district, the standard Katy order is a large varsity-plus-sub-varsity game set placed in the spring. Our",
    mostOrderedPractice:
      "Nine schools in one district scrimmage each other more than they scrimmage anyone else, and two colors in one jersey is how a Katy coach runs both sides of that. Our",
    faqs: [
      { q: "Do you supply Katy ISD schools?", a: "Yes, all of them. Katy ISD fields nine 6A football programs — Katy, Cinco Ranch, Seven Lakes, Tompkins, Taylor, Morton Ranch, Mayde Creek, Paetow and Jordan — plus Freeman at 5A Division I. Everyone in the city is zoned to the district." },
      { q: "How large is a typical Katy uniform order?", a: "Large. Nine of the district's ten programs carry 6A rosters, so a game set covering varsity, JV and freshman blocks runs into a wide size spread. We price per piece at the combined quantity rather than per block." },
      { q: "How long does delivery to Katy take?", a: "Katy is roughly 30 miles west of Houston and 258 miles from our DFW production, so freight is a single day. Add that to two to four weeks of production from the day the proof is approved." },
      { q: "Do you make flag football uniforms for Katy leagues?", a: "Yes. Katy Youth Football runs the fall flag league including a girls-only division, and i9 Sports, N Zone and the Fulshear Sports Association run flag across the west side. Those orders are mostly small sizes, and ten pieces of a design is enough to place one." },
      { q: "Can you match a Katy ISD school's colors exactly?", a: "Yes, and here it is worth insisting on. Several Katy ISD schools sit close together in the same color families, so we proof the exact shade against your value or a daylight photo before anything is printed." },
      { q: "What is the minimum order in Katy?", a: "Ten pieces per design, mixed sizes included. A youth flag roster clears it on its own." },
      { q: "Can a Katy order cover home and away sets?", a: "Yes. Running both colorways in one production pass shares the setup and guarantees the numbers and names are identical between the two sets." },
      { q: "Do you supply girls' flag football teams?", a: "Yes. Katy Youth Football's girls division orders the same way as any other — the cut differs, the minimum and the process do not." },
      { q: "When should a Katy program place its order?", a: "In spring. First scrimmages fall on August 13 or August 20 depending on spring training, and nine 6A programs sharing two district stadiums all want their sets before that." },
    ],
  },

  "sugar-land": {
    districts: ["Fort Bend ISD", "Lamar Consolidated ISD"],
    schools: [
      { school: "Travis", district: "Fort Bend ISD", level: "6A" },
      { school: "Clements", district: "Fort Bend ISD", level: "6A" },
      { school: "Austin", district: "Fort Bend ISD", level: "6A" },
      { school: "Elkins", district: "Fort Bend ISD", level: "6A" },
      { school: "Bush", district: "Fort Bend ISD", level: "6A" },
      { school: "Hightower", district: "Fort Bend ISD", level: "6A" },
      { school: "Ridge Point", district: "Fort Bend ISD", level: "6A" },
      { school: "Dulles", district: "Fort Bend ISD", level: "5A Division I" },
      { school: "Kempner", district: "Fort Bend ISD", level: "5A Division II" },
      { school: "Marshall", district: "Fort Bend ISD", level: "5A Division II" },
      { school: "Crawford", district: "Fort Bend ISD", level: "5A Division II" },
      { school: "Fort Bend Christian Academy", district: "Private (TAPPS)", level: "TAPPS 5A" },
    ],
    schoolsNote:
      "Fort Bend ISD is one district carrying seven 6A programs, one 5A Division I and three 5A Division II — a wider classification spread inside a single district than almost anywhere in Texas, with the campuses spread across Sugar Land, Missouri City and Richmond. Fort Bend Christian Academy plays TAPPS 5A in Sugar Land itself and won the TAPPS Division II state title in 2022. A quote here starts with the campus, because two schools ten minutes apart can be two conferences apart.",
    youthLeagues: [
      { name: "i9 Sports Sugar Land, Missouri City and Richmond", note: "runs flag football at venues including Sugar Land Middle School." },
      { name: "N Zone Sports Missouri City", note: "runs youth flag leagues covering Sugar Land." },
    ],
    youthNote:
      "The youth game here is flag first, run by franchises rather than by one city-wide association, so a Sugar Land league order is usually one division at a time rather than a whole program in one purchase. Our",
    levelMix: "flag",
    stadiums: [
      { name: "Edward Mercer Stadium", note: "Fort Bend ISD's main Sugar Land venue, seating 9,768 and built in 1975." },
      { name: "Hall Stadium", note: "the district's Missouri City stadium, which recent reporting has had closed for renovation." },
    ],
    seasonNote:
      "Fort Bend's 6A programs that held spring training open conditioning on August 10, go to full contact on August 15 and scrimmage from August 20, which in Gulf-coast humidity is the stretch that shows up any fabric that holds water.",
    deliveryDays: "Sugar Land is about 24 miles southwest of Houston and 259 miles from our DFW production — next-day freight.",
    deliveryDetail:
      "Freight to Sugar Land runs with the Houston lane and arrives the next day. What takes the planning is the district itself: eleven programs across three cities, several of them ordering in the same spring window, so a campus that books early gets the early delivery date.",
    orderIntro:
      "A Sugar Land order is defined by which campus it is for. Seven 6A rosters, one 5A Division I and three 5A Division II programs all order out of the same district office calendar but at very different sizes.",
    orderStory: [
      "Name the campus and the conference. That pair tells us the likely size run before you have counted a single jersey.",
      "Send colors and any existing artwork; if the school has none on file, a photo of the current set is enough to redraw from.",
      "Pricing and a free mockup come back within a day, sized for the block you are ordering rather than a generic template.",
      "On approval we print the order in a single run, so a 6A varsity set and its sub-varsity blocks match through the season.",
      "Delivery lands with the Houston freight the next day after dispatch.",
    ],
    mostOrderedVarsity:
      "Seven 6A campuses in one district make full game sets the standard Sugar Land order, placed in spring for August delivery. Our",
    mostOrderedPractice:
      "Gulf-coast practices are wet by the second period, and a two-color jersey is one garment to wash instead of two. Our",
    faqs: [
      { q: "Which Sugar Land schools do you build uniforms for?", a: "Fort Bend ISD's campuses across Sugar Land, Missouri City and Richmond — Travis, Clements, Austin, Elkins, Bush, Hightower and Ridge Point at 6A, Dulles at 5A Division I, and Kempner, Marshall and Crawford at 5A Division II — plus Fort Bend Christian Academy in TAPPS 5A." },
      { q: "Two Sugar Land schools are in different conferences — does that change the uniform?", a: "Not the garment, only the order shape. A 6A roster carries more players and a wider size run than a 5A Division II roster, so the extras and the block sizes differ even when the design is identical." },
      { q: "How fast is delivery to Sugar Land?", a: "Sugar Land is about 24 miles from Houston and 259 miles from our DFW production, so freight arrives the next day after dispatch. Production itself is two to four weeks from proof approval." },
      { q: "Do you make flag football uniforms for Sugar Land leagues?", a: "Yes. The i9 Sports and N Zone flag leagues covering Sugar Land and Missouri City order division by division, and ten pieces of a design is enough to place an order." },
      { q: "Can you work with a school that has no digital logo file?", a: "Yes. Send a clear daylight photo of a helmet or an existing jersey and we redraw the mark as vector art, then proof it before printing." },
      { q: "What is the minimum order for a Sugar Land team?", a: "Ten pieces per design, with mixed sizes counting together — a single division or a JV block clears it." },
      { q: "Does the Gulf humidity affect which fabric we should choose?", a: "It should. For Fort Bend programs we default to the lighter, faster-drying knit, because August here means full-contact practices from the 15th in heat that keeps a heavier jersey wet all afternoon." },
      { q: "Can you outfit a private school as well as a Fort Bend ISD campus?", a: "Yes. Fort Bend Christian Academy plays TAPPS 5A in Sugar Land, and a TAPPS roster orders exactly the same way a UIL roster does." },
      { q: "When should a Sugar Land program order for the fall?", a: "In spring. Conditioning for the district's 6A programs that held spring training opens on August 10 with contact from the 15th, and eleven programs from one district are all trying to land deliveries in the same window." },
    ],
  },

  // ──────────────────────────────────────────────── Central Texas ──
  austin: {
    districts: ["Austin ISD", "Del Valle ISD", "Manor ISD", "Pflugerville ISD", "Eanes ISD"],
    schools: [
      { school: "Austin High", district: "Austin ISD", level: "6A" },
      { school: "Akins", district: "Austin ISD", level: "6A" },
      { school: "Bowie", district: "Austin ISD", level: "6A" },
      { school: "Westlake", district: "Eanes ISD", level: "6A" },
      { school: "Del Valle", district: "Del Valle ISD", level: "6A" },
      { school: "Anderson", district: "Austin ISD", level: "5A Division I" },
      { school: "McCallum", district: "Austin ISD", level: "5A Division I" },
      { school: "Crockett", district: "Austin ISD", level: "5A Division II" },
      { school: "LASA", district: "Austin ISD", level: "5A Division II" },
      { school: "Navarro", district: "Austin ISD", level: "5A Division II" },
      { school: "LBJ (Johnson)", district: "Austin ISD", level: "4A Division I" },
      { school: "Travis", district: "Austin ISD", level: "4A Division I" },
      { school: "Eastside", district: "Austin ISD", level: "4A Division II" },
    ],
    schoolsNote:
      "Austin ISD is the widest single district on this list, running from 6A at Austin High, Akins and Bowie down to 4A Division II at Eastside, and five separate districts serve the city around it. The program everyone measures against is Westlake in Eanes ISD, which won its first state title in 1996 with Drew Brees at quarterback and took three in a row from 2019 through 2021. A uniform order in Austin can therefore be a 6A powerhouse set or a 4A Division II set placed the same week.",
    youthLeagues: [
      { name: "Trojans Pop Warner", note: "youth tackle football in northwest Austin, practicing at Murchison Middle School." },
      { name: "Neighborhood Sports NFL Flag", note: "runs flag football for ages five to seventeen in north and south Austin." },
      { name: "T&C Sports Austin", note: "runs coed NFL Flag for grades one through six." },
      { name: "Austin Parks and Recreation", note: "runs youth sports including football through the city's community recreation centers." },
    ],
    youthNote:
      "Austin still has a genuine Pop Warner tackle program alongside its flag leagues, which is less common than it used to be, and the flag side runs up to seventeen years old. Those two order very differently: tackle sets have to fit over pads, flag sets do not. Our",
    levelMix: "youth",
    stadiums: [
      { name: "House Park", note: "Austin ISD's downtown stadium, seating around 6,000 and shared by Austin High, Anderson, LASA, McCallum and Navarro." },
    ],
    seasonNote:
      "The 4A programs in Austin ISD can start conditioning on August 3 and hit full contact on August 8, a week before the 6A schools that held spring training, so two Austin teams in the same city can need their uniforms seven days apart.",
    deliveryDays: "Austin is about 195 miles down I-35 from our DFW production — a same-day-to-next-day freight lane.",
    deliveryDetail:
      "I-35 between the metroplex and Austin is the busiest freight corridor we ship on, and it is short enough that delivery is measured in a day. The scheduling problem in Austin is not the drive; it is that five districts with different conference start dates all want sets in the same fortnight.",
    orderIntro:
      "An Austin order can be anything from a 6A game set to a 4A Division II one, and the city's youth scene adds Pop Warner tackle blocks and flag sets that run all the way to seventeen-year-olds.",
    orderStory: [
      "Tell us the school or the league and the conference. In Austin the conference is the single most useful thing you can put in the first message.",
      "Send colors and any mark. House Park is a shared stadium, so the schools that play there care more than most about looking distinct from each other.",
      "Pricing and a free mockup come back inside a day, cut for the block you need — pads or no pads changes the pattern, not just the size.",
      "One production run covers every block in the order so the varsity and the feeder teams stay the same shade all season.",
      "Freight runs straight down I-35 and lands inside a day of dispatch.",
    ],
    mostOrderedVarsity:
      "Austin's 6A programs order full game sets in the spring, and the 5A and 4A schools in the same district follow a week or two behind. Our",
    mostOrderedPractice:
      "Five Austin ISD schools share House Park and most of the city's programs share practice fields, so two-color jerseys do a lot of work here. Our",
    faqs: [
      { q: "Which Austin schools and districts do you supply?", a: "Austin ISD from 6A down to 4A Division II, plus Eanes, Del Valle, Manor and Pflugerville ISDs around it, and the club, Pop Warner and flag programs across the city." },
      { q: "Do the different conferences in Austin ISD change how an order is quoted?", a: "Yes, because the rosters differ. A 6A block at Austin High or Bowie is far larger than a 4A Division II block at Eastside, so the size spread, the extras and the per-piece price all move with the conference." },
      { q: "How quickly can uniforms reach Austin?", a: "Austin is about 195 miles down I-35 from our DFW production, so freight is a day. The production itself is two to four weeks from the day you approve the proof." },
      { q: "Do you make uniforms for Austin youth tackle programs?", a: "Yes. Trojans Pop Warner in northwest Austin is a tackle program, and a tackle jersey has to sit over shoulder pads — a different cut from the flag jersey the same player wears in the spring." },
      { q: "Do you build flag uniforms for older age groups?", a: "Yes. The Neighborhood Sports NFL Flag divisions in Austin run to seventeen, so those orders use adult blocks rather than youth ones even though the garment is a flag jersey." },
      { q: "What is the minimum order for an Austin team?", a: "Ten pieces of a design, sizes mixed. One flag division or one JV block is enough on its own." },
      { q: "Can several Austin schools that share a stadium order at once?", a: "They can, and printing them together is the safest way to keep them looking distinct — we proof the sets side by side so two schools sharing House Park do not end up in near-identical shades." },
      { q: "Can you print a mark we only have on an old letter jacket?", a: "Yes. Send a daylight photo and we rebuild it as vector art, then proof it before printing so the reproduction is the mark the school actually uses." },
      { q: "When should an Austin program order for the fall?", a: "By late spring. Austin ISD's 4A programs can be in full contact by August 8 and the 6A schools a week later, so a July order is already fighting the calendar." },
    ],
  },

  "round-rock": {
    districts: ["Round Rock ISD"],
    schools: [
      { school: "Round Rock", district: "Round Rock ISD", level: "6A" },
      { school: "McNeil", district: "Round Rock ISD", level: "6A" },
      { school: "Stony Point", district: "Round Rock ISD", level: "6A" },
      { school: "Westwood", district: "Round Rock ISD", level: "6A" },
      { school: "Cedar Ridge", district: "Round Rock ISD", level: "6A" },
    ],
    schoolsNote:
      "Five high schools, one district, and every one of them at 6A. UIL's 2026-28 alignment put all five Round Rock ISD schools into District 25-6A with Austin's Lake Travis and Westlake — which means a Round Rock program's district schedule includes two of the most successful 6A programs in the state, every year, without a soft week.",
    youthLeagues: [
      { name: "i9 Sports Round Rock and Pflugerville", note: "runs flag football for ages three and up, with a venue at Cedar Ridge High School on Gattis School Road." },
      { name: "Neighborhood Sports NFL Flag", note: "runs pre-K to ninth grade flag football serving Round Rock, with games at local sports park facilities." },
    ],
    youthNote:
      "Round Rock's flag leagues play partly on the high school campuses themselves, so the youth sets are seen next to the varsity ones. Sizes start at three years old here, which is the smallest block we cut. Our",
    levelMix: "flag",
    stadiums: [
      { name: "Kelly Reeves Athletic Complex", note: "Round Rock ISD's 11,000-seat stadium, opened in 2003 and shared by all five district high schools." },
    ],
    seasonNote:
      "One stadium for five 6A programs makes the August calendar tight before a single game is played, and week one falls on August 27–29. Uniform delivery has to beat the photo-day queue, not just the first kickoff.",
    deliveryDays: "Round Rock sits about 15 miles north of Austin on I-35, so it rides the same one-day freight lane from DFW.",
    deliveryDetail:
      "Round Rock is a single-district city with five 6A programs, so everything queues: one stadium, one athletics office, one purchasing calendar. Freight is quick — it is the internal calendar that rewards ordering early.",
    orderIntro:
      "A Round Rock order is a 6A order, every time. The rosters are long, the size runs are wide, and the district schedule offers no week where a shabby set goes unnoticed.",
    orderStory: [
      "Send the school and the total count including sub-varsity, since all five programs here carry full blocks below varsity.",
      "Send the colors. Five schools in one district means five palettes that have to stay clearly apart on a shared field.",
      "Pricing and a free 24-hour mockup come back proofed at the widest and narrowest sizes in your run.",
      "The whole order prints in one pass so varsity and sub-varsity match under the lights at Kelly Reeves.",
      "Freight is a day down I-35, and we work the schedule back from your first scrimmage rather than week one.",
    ],
    mostOrderedVarsity:
      "Five 6A programs in one district make full varsity and sub-varsity game sets the normal Round Rock order, placed in spring. Our",
    mostOrderedPractice:
      "A district schedule with Lake Travis and Westlake in it means a lot of scout-team work, and a scout team needs to be visibly the other color. Our",
    faqs: [
      { q: "Do you supply Round Rock ISD schools?", a: "Yes — Round Rock, McNeil, Stony Point, Westwood and Cedar Ridge, all five of them at 6A for 2026-28, plus the youth and flag programs in the city." },
      { q: "How big is a 6A order in Round Rock?", a: "Larger than most. All five district programs carry full sub-varsity blocks, so a single school's order can cover varsity, JV and freshman sets in one design and one production run." },
      { q: "How long does delivery to Round Rock take?", a: "Round Rock is about 15 miles north of Austin on I-35, so it rides the same one-day freight lane from our DFW production, on top of two to four weeks of production from proof approval." },
      { q: "Do you make flag football uniforms for Round Rock leagues?", a: "Yes. The i9 Sports league plays at Cedar Ridge High School and the Neighborhood Sports NFL Flag divisions run from pre-K up, with sizes starting at three years old — the smallest block we cut." },
      { q: "What is the minimum order for a Round Rock team?", a: "Ten pieces per design, with mixed sizes counted together. One flag division clears it." },
      { q: "Our district includes Westlake and Lake Travis — does that affect anything?", a: "It affects the calendar rather than the garment. A district with no easy week means more film, more scout-team work and more demand for reversible practice jerseys alongside the game set." },
      { q: "Can five schools in one district order together?", a: "Yes, and a combined quantity earns a better per-piece price. We proof the five palettes side by side so nobody ends up in a shade too close to a district rival." },
      { q: "Do you print names and numbers for a whole 6A roster?", a: "Yes. Names, numbers, patches and captain marks are sublimated in the same pass as the design, so nothing is heat-pressed on afterwards and nothing peels." },
      { q: "When should a Round Rock program order?", a: "In spring. Five 6A programs share Kelly Reeves Athletic Complex, so photo days and jamborees queue through one building before week one on August 27–29." },
    ],
  },

  "san-antonio": {
    districts: ["Northside ISD", "North East ISD", "San Antonio ISD", "Judson ISD", "East Central ISD", "Harlandale ISD", "South San Antonio ISD", "Southside ISD", "Edgewood ISD"],
    schools: [
      { school: "Brandeis, Brennan, Clark, Harlan, Holmes, Marshall, O'Connor, Sotomayor, Stevens, Taft, Warren", district: "Northside ISD", level: "6A" },
      { school: "Churchill, Johnson, LEE, Madison, Reagan, Roosevelt", district: "North East ISD", level: "6A" },
      { school: "Judson and Wagner", district: "Judson ISD", level: "6A" },
      { school: "East Central", district: "East Central ISD", level: "6A" },
      { school: "Jay", district: "Northside ISD", level: "5A Division I" },
      { school: "Southside", district: "Southside ISD", level: "5A Division I" },
      { school: "Brackenridge, Burbank, Edison, Houston, Jefferson, Lanier", district: "San Antonio ISD", level: "5A Division II" },
      { school: "Harlandale", district: "Harlandale ISD", level: "5A Division II" },
      { school: "Kennedy", district: "San Antonio ISD", level: "4A Division I" },
      { school: "Antonian College Prep and Central Catholic", district: "Private (TAPPS)", level: "TAPPS Division I" },
    ],
    schoolsNote:
      "Northside ISD alone fields eleven 6A football programs — more 6A football than most entire Texas cities — and North East ISD adds six more. San Antonio ISD, by contrast, sits almost entirely in 5A Division II. Nine districts serve the city, and the TAPPS rivalry between Antonian and Central Catholic runs alongside all of it. Brackenridge holds a piece of history no other school can claim: the 1947 state championship, the last one awarded before UIL split football by enrollment.",
    youthLeagues: [
      { name: "Alamo City Youth Flag Football", note: "a winter flag league for ages five to fourteen, played at two northwest San Antonio locations in January and February." },
      { name: "Neighborhood Sports NFL Flag", note: "the official NFL FLAG program in San Antonio for ages five to seventeen." },
      { name: "i9 Sports San Antonio", note: "runs flag football leagues for ages three and up across the metro." },
    ],
    youthNote:
      "San Antonio is the one city on this list with a serious winter flag season — Alamo City's league plays in January and February, months after everyone else has packed away. That is a completely separate production window from the fall order. Our",
    levelMix: "flag",
    stadiums: [
      { name: "Alamo Stadium", note: "San Antonio ISD's 18,500-seat stadium, opened in 1940, renovated in 2011 and known locally as the Rock Pile." },
      { name: "Dub Farris Athletic Complex", note: "Northside ISD's 10,568-seat stadium, one of the venues carrying the district's eleven 6A programs." },
    ],
    seasonNote:
      "With eleven 6A programs in one district and six in another, San Antonio's August is a logistics exercise: the 6A schools that held spring training start conditioning on August 10 and scrimmage from August 20, and every one of them wants a stadium slot in the same fortnight.",
    deliveryDays: "San Antonio is about 275 miles from our DFW production and 197 from Houston — a one-day freight lane.",
    deliveryDetail:
      "Freight to San Antonio is a single day from the metroplex. The scale is what needs planning: Northside ISD by itself can put more 6A jersey orders into one spring than some entire metros, so a program that waits until July is queueing behind its own district.",
    orderIntro:
      "San Antonio orders divide by district more sharply than anywhere else. A Northside or North East 6A order is a long roster; a San Antonio ISD order is a 5A Division II roster; and the winter flag leagues order in a different season entirely.",
    orderStory: [
      "Name the district and the campus. With nine districts in the city that is the fastest way to a correct quote.",
      "Send colors and marks. Many San Antonio schools carry long-standing identities — Brackenridge's goes back to the 1940s — so we reproduce rather than reinterpret them.",
      "Pricing and a free mockup land within a day, at the block size the conference actually implies.",
      "The order prints in one pass, which matters most for a district ordering several schools into the same August.",
      "Freight is a day from the metroplex, so the proof date is the date that really sets delivery.",
    ],
    mostOrderedVarsity:
      "With seventeen 6A programs between two districts, full varsity game sets dominate the San Antonio order book every spring. Our",
    mostOrderedPractice:
      "Eleven 6A programs in one district means constant inter-squad and inter-school scrimmage work, and a jersey that flips color saves carrying two sets. Our",
    faqs: [
      { q: "Which San Antonio districts do you build for?", a: "All of the city's main districts — Northside, North East, San Antonio ISD, Judson, East Central, Harlandale, South San Antonio, Southside and Edgewood — plus TAPPS schools such as Antonian and Central Catholic." },
      { q: "How much 6A football is there in San Antonio?", a: "A great deal. Northside ISD fields eleven 6A programs and North East ISD six, along with Judson ISD's two and East Central — which is why San Antonio orders cluster into one spring window and production slots go early." },
      { q: "How long does shipping to San Antonio take?", a: "About 275 miles from our DFW production or 197 from Houston, so freight is a day. Production runs two to four weeks from proof approval." },
      { q: "Do you supply winter flag leagues?", a: "Yes, and San Antonio is where that matters — Alamo City Youth Flag Football plays in January and February for ages five to fourteen, which is a separate ordering season from the fall one and easier to book because production is quieter then." },
      { q: "Our school is 5A Division II — how does that change the order?", a: "It changes the count, not the build. Most San Antonio ISD programs sit in 5A Division II, and those rosters are smaller than a Northside 6A roster, so the size run is tighter and we hold fewer extreme sizes." },
      { q: "What is the minimum order for a San Antonio team?", a: "Ten pieces per design, mixed sizes together. A youth flag roster or a JV block clears it." },
      { q: "Can you reproduce a school identity that goes back decades?", a: "Yes. Send whatever you have — a photo of an old jersey, a helmet, a program cover — and we redraw the mark as vector art and proof it against the original before printing." },
      { q: "Do you outfit TAPPS schools in San Antonio?", a: "Yes. Antonian College Preparatory and Central Catholic both play TAPPS Division I football, and a TAPPS order runs exactly as a UIL one does." },
      { q: "When should a San Antonio program place its order?", a: "Spring, and early in it. The 6A schools that held spring training start conditioning on August 10 and scrimmage from August 20, and seventeen 6A programs across two districts are all aiming at the same delivery fortnight." },
    ],
  },

  waco: {
    districts: ["Waco ISD", "Midway ISD", "La Vega ISD", "Connally ISD"],
    schools: [
      { school: "Midway", district: "Midway ISD", level: "6A" },
      { school: "Waco High", district: "Waco ISD", level: "5A Division II" },
      { school: "University", district: "Waco ISD", level: "5A Division II" },
      { school: "La Vega", district: "La Vega ISD", level: "4A Division II" },
      { school: "Connally", district: "Connally ISD", level: "4A Division II" },
    ],
    schoolsNote:
      "One 6A program, two 5A Division II programs and two 4A Division II programs inside a single small city. The one everyone knows is La Vega, on Waco's east side, which won state championships in 2015 and 2018 and went back to the final in 2024 — a 4A program with a trophy case that bigger schools in this state do not have.",
    youthLeagues: [
      { name: "Waco Parks and Recreation youth flag football", note: "the city-run flag league, registered through the parks department's league system." },
      { name: "YMCA of Central Texas", note: "runs a spring youth flag football season covering the Waco area." },
      { name: "CenTex Sports", note: "runs youth tackle and flag football from its Waco location." },
    ],
    youthNote:
      "Waco is small enough that the city parks department, the YMCA and a private club all run football without stepping on each other, and between them they cover spring flag and fall tackle. Those are two orders a year from what looks like one town. Our",
    levelMix: "youth",
    stadiums: [
      { name: "Waco ISD Stadium", note: "a 10,520-seat stadium on South New Road, opened in 2000 and shared by Waco High and University." },
    ],
    seasonNote:
      "La Vega and Connally at 4A can be in full contact by August 8, while Midway's 6A program may not start conditioning until August 10 if it held spring training — a two-week spread across a city you can drive across in fifteen minutes.",
    deliveryDays: "Waco is 97 miles from Dallas and 185 from Houston — comfortably inside a one-day freight run from our DFW production.",
    deliveryDetail:
      "Waco is the closest city on our list outside the metroplex itself, which makes it the easiest late order we take: a set approved with a fortnight to spare still lands on time. That does not make August ordering a good idea, but it does mean a genuine emergency here is recoverable.",
    orderIntro:
      "A Waco order is usually a mid-sized one — a 5A Division II or 4A Division II roster rather than a sprawling 6A block — and the difference between conferences in this city is a difference of about twenty jerseys.",
    orderStory: [
      "Tell us the school and the conference; in a city with five programs across three conferences, that pair defines the whole order.",
      "Send colors and any mark. For a program with a title history like La Vega's, we reproduce the identity exactly rather than modernizing it.",
      "Free mockup and per-piece pricing within a day, sized for the block you actually field.",
      "One production run covers the order, which is how a varsity set and a JV set stay matched through a playoff run.",
      "Delivery is a short freight leg — 97 miles from Dallas — so Waco has the shortest gap between dispatch and the field of anywhere outside DFW.",
    ],
    mostOrderedVarsity:
      "Waco's 5A and 4A programs order full game sets in the spring, in blocks noticeably smaller than a big-metro 6A order. Our",
    mostOrderedPractice:
      "Two Waco ISD programs share a stadium and most of a practice calendar, so two-color jerseys carry a lot of the week's work. Our",
    faqs: [
      { q: "Which Waco schools do you build uniforms for?", a: "Midway at 6A, Waco High and University at 5A Division II, and La Vega and Connally at 4A Division II — plus the city's youth flag and tackle programs." },
      { q: "How quickly can you get uniforms to Waco?", a: "Waco is 97 miles from Dallas, the shortest freight leg on our list outside the metroplex, so dispatch to delivery is quick. Production is still two to four weeks from proof approval." },
      { q: "Can you take a late order in Waco?", a: "More easily than most places, because the transit leg is so short. A set approved with a fortnight in hand can still make a first game — though the 4A programs here can be in full contact by August 8, so late is still risky." },
      { q: "Do you make youth football uniforms in Waco?", a: "Yes. The city parks department runs flag, the YMCA runs a spring season and CenTex Sports runs tackle and flag, which between them means two ordering seasons a year in one town." },
      { q: "What is the minimum order for a Waco team?", a: "Ten pieces per design. A 4A JV block or a single youth division clears it, with mixed sizes counting together." },
      { q: "Our program is 4A — is a 4A order treated differently?", a: "Only in scale. La Vega and Connally field 4A Division II rosters, so the run is roughly twenty jerseys shorter than a 5A one; the fabric, the printing and the proofing are identical." },
      { q: "Can you reproduce a program's existing look exactly?", a: "Yes, and for a program with a title history we do exactly that — send a current jersey photo and the color values and we match rather than redesign." },
      { q: "Do you supply both game and practice sets?", a: "Yes, and ordering them together keeps the colors aligned; printed months apart, two batches of the same color can drift a shade." },
      { q: "When should a Waco program order for the fall?", a: "In spring. The 4A schools here start full contact on August 8 and the 6A program a week later, so a spring order covers both ends of a two-week spread in one delivery." },
    ],
  },

  // ──────────────────────────────────────────────── South Texas ──
  laredo: {
    districts: ["United ISD", "Laredo ISD"],
    schools: [
      { school: "United", district: "United ISD", level: "6A" },
      { school: "United South", district: "United ISD", level: "6A" },
      { school: "Alexander", district: "United ISD", level: "6A" },
      { school: "LBJ (Johnson)", district: "United ISD", level: "6A" },
      { school: "Martin", district: "Laredo ISD", level: "5A Division I" },
      { school: "Nixon", district: "Laredo ISD", level: "5A Division I" },
      { school: "Cigarroa", district: "Laredo ISD", level: "5A Division II" },
      { school: "St. Augustine", district: "Private (TAPPS)", level: "TAPPS six-man" },
    ],
    schoolsNote:
      "Two districts, seven public high school programs, and a split that runs cleanly between them: all four United ISD schools play 6A, while Laredo ISD's three sit at 5A Division I and 5A Division II. St. Augustine plays TAPPS six-man, which is a different sport in uniform terms — fewer players, faster substitution, lighter kit. The city is far enough from everywhere else that district road trips can run past 150 miles one way.",
    youthLeagues: [
      { name: "Laredo Prodigy Sports", note: "an NFL FLAG youth league for boys and girls aged four to fourteen." },
      { name: "Football 'N' America Laredo", note: "the local chapter of the non-contact coed flag league, running from first through twelfth grade." },
    ],
    youthNote:
      "Laredo's youth football is flag and coed, and one of the two leagues runs all the way to twelfth grade, which is unusual — most flag programs stop at middle school. It means an order can span a four-year-old's jersey and a high-school senior's in the same league. Our",
    levelMix: "flag",
    stadiums: [
      { name: "Shirley Field", note: "Laredo ISD's home ground, rebuilt in 2011 with artificial turf and used by Martin, Nixon and Cigarroa." },
      { name: "United ISD Student Activity Complex", note: "an 8,500-seat stadium on St. Claudia Lane, opened in 2004 and shared by United ISD's four high schools." },
    ],
    seasonNote:
      "Laredo's 6A schools that held spring training open conditioning on August 10 and scrimmage from August 20, and with district travel measured in hours rather than minutes, a set that arrives mid-August is already behind the team's first bus ride.",
    deliveryDays: "Laredo is roughly 430 to 450 miles from our DFW production and around 320 to 350 from Houston — a two-day freight leg.",
    deliveryDetail:
      "Laredo is a long haul from either production corridor, so we treat it the way we treat El Paso: size breakdown confirmed in writing, extras built into the run, and dispatch confirmed rather than estimated. Nothing about the garment changes for the border; the planning around it does.",
    orderIntro:
      "A Laredo order is shaped by two facts — four 6A rosters in one district, and a two-day freight leg that makes a reorder expensive in time rather than money.",
    orderStory: [
      "Send the school and a full size breakdown. On a two-day lane the breakdown matters more than the headline count.",
      "Send the colors. Seven programs in one city play each other regularly, so we proof shades that sit close together with extra care.",
      "Pricing and a free mockup come back within 24 hours, at the 6A or 5A block you actually field.",
      "We print the whole order in one run and reconcile the boxed sizes against your breakdown before dispatch.",
      "Freight takes about two days south; we confirm the dispatch date so the fitting can be scheduled around it.",
    ],
    mostOrderedVarsity:
      "United ISD's four 6A programs order long varsity and sub-varsity sets in spring, with extras built in because the nearest reorder is two days away. Our",
    mostOrderedPractice:
      "Seven local programs and long road trips mean a lot of controlled scrimmage work at home, in two colors. Our",
    faqs: [
      { q: "Do you deliver uniforms to Laredo?", a: "Yes. Laredo is roughly 430 to 450 miles from our DFW production and around 320 to 350 from Houston, so freight is about a two-day leg. We confirm the dispatch date rather than leaving it as a window." },
      { q: "Which Laredo schools do you build for?", a: "United ISD's four 6A programs — United, United South, Alexander and LBJ — and Laredo ISD's Martin, Nixon and Cigarroa, plus the city's youth flag leagues and club teams." },
      { q: "Do you make six-man uniforms?", a: "Yes. St. Augustine plays TAPPS six-man in Laredo, and a six-man roster is a smaller order with faster substitution patterns — the ten-piece minimum still covers it comfortably." },
      { q: "Do you supply coed flag leagues?", a: "Yes. Laredo Prodigy Sports runs NFL FLAG from four to fourteen and Football 'N' America runs coed flag from first through twelfth grade, so an order here can genuinely span a child's jersey and an adult-sized one." },
      { q: "What is the minimum order for a Laredo team?", a: "Ten pieces of a design with sizes mixed. A flag division or a six-man roster clears it." },
      { q: "How do we avoid a reorder on a long shipping lane?", a: "Send the size breakdown rather than a count and add extras to the original run. On a two-day lane, two or three spare jerseys in the sizes most likely to move cost far less than the time a second shipment takes." },
      { q: "Can you match the colors our school has used for years?", a: "Yes. Send a daylight photo and any values on file; we proof the shade before printing and store it so subsequent orders come off the same spec." },
      { q: "Is the fabric suitable for Laredo's heat?", a: "The same lightweight performance knit we use on the Gulf coast works here, and full sublimation means there is no printed layer to lift when a jersey is soaked through in August." },
      { q: "When should a Laredo program order?", a: "In spring. The 6A schools here can be scrimmaging by August 20, and with a two-day freight leg and long district travel, a mid-August delivery is already late." },
    ],
  },

  mcallen: {
    districts: ["McAllen ISD", "Mission CISD", "Sharyland ISD", "Edinburg CISD", "Pharr-San Juan-Alamo ISD", "Hidalgo ISD", "Valley View ISD"],
    schools: [
      { school: "McAllen High", district: "McAllen ISD", level: "5A Division I" },
      { school: "McAllen Memorial", district: "McAllen ISD", level: "5A Division I" },
      { school: "McAllen Rowe", district: "McAllen ISD", level: "5A Division I" },
      { school: "Mission", district: "Mission CISD", level: "5A Division I" },
      { school: "Mission Veterans", district: "Mission CISD", level: "5A Division II" },
      { school: "Sharyland", district: "Sharyland ISD", level: "5A Division II" },
      { school: "Sharyland Pioneer", district: "Sharyland ISD", level: "5A Division II" },
      { school: "Edinburg, Edinburg North, Edinburg Vela, Economedes", district: "Edinburg CISD", level: "6A" },
    ],
    schoolsNote:
      "All three McAllen ISD high schools play 5A Division I and all three play their home games in the same stadium. The 6A football in this part of the Valley belongs to Edinburg CISD's four programs a few miles north, while Sharyland and Mission Veterans sit at 5A Division II. Seven districts serve the McAllen area, which for a supplier means seven purchasing calendars inside one metro.",
    youthLeagues: [
      { name: "Gridiron Football McAllen", note: "runs flag football and 7-on-7 for ages four to seventeen, with coed and girls divisions." },
      { name: "RGV Seahawks", note: "a McAllen-based youth flag club fielding coed and all-girls teams across the youth age groups." },
      { name: "Youth Sports Nation RGV", note: "runs flag football alongside other sports across McAllen, Mission and the mid-Valley." },
    ],
    youthNote:
      "The Valley runs a real 7-on-7 scene as well as flag — Gridiron's McAllen league covers both, for ages four to seventeen, with girls divisions alongside the coed ones. Those summer rosters buy separately from the fall ones and want a lighter garment. Our",
    levelMix: "7-on-7",
    stadiums: [
      { name: "McAllen Veterans Memorial Stadium", note: "McAllen ISD's 13,500-seat stadium, opened in 1976 and the largest football venue in the Rio Grande Valley, shared by McAllen High, Memorial and Rowe." },
    ],
    seasonNote:
      "McAllen's schools sit at 5A, so most can open conditioning on August 3 and go to full contact on August 8 if they held no spring training — the early end of UIL's 2026 calendar, and a week before a big-metro 6A program starts.",
    deliveryDays: "McAllen is around 500 miles from our DFW production and roughly 300 to 360 from Houston — a two-day freight leg.",
    deliveryDetail:
      "The Valley is the furthest south we ship, and the freight leg is about two days from either production corridor. We plan McAllen deliveries against the August 8 contact date rather than week one, because the local schools start at the early end of the calendar and the shipping leg is long.",
    orderIntro:
      "A McAllen order is a 5A order with a summer 7-on-7 order attached. The two seasons are months apart, and the garments are not the same.",
    orderStory: [
      "Tell us which season the set is for — summer 7-on-7 or the fall game set — and give the roster with sizes.",
      "Send colors. With three McAllen ISD schools sharing one stadium, we proof the shades so the three sets stay clearly distinct under the same lights.",
      "Pricing and a free 24-hour mockup come back on the right block: the 7-on-7 cut is lighter than the fall jersey it sits beside.",
      "On approval the whole order prints together, so a summer set and a fall set stay in one color family instead of drifting apart.",
      "Freight runs about two days south, and we build the schedule from the August 8 contact date rather than from week one.",
    ],
    mostOrderedVarsity:
      "The standard McAllen order is a 5A Division I game set for one of the three district schools, placed in spring. Our",
    mostOrderedPractice:
      "Three schools sharing one stadium do their competitive work at practice, split two ways, which is what a reversible is for. Our",
    faqs: [
      { q: "Which McAllen-area schools do you supply?", a: "McAllen ISD's McAllen High, Memorial and Rowe at 5A Division I, Mission CISD, Sharyland ISD and the Edinburg CISD 6A programs north of the city, along with the flag and 7-on-7 clubs across the Valley." },
      { q: "Do you make 7-on-7 uniforms for Valley teams?", a: "Yes. Gridiron's McAllen league runs 7-on-7 and flag for ages four to seventeen, and a 7-on-7 set is cut lighter than a fall game jersey because it is worn without pads through a summer tournament day." },
      { q: "How long does shipping to McAllen take?", a: "Around 500 miles from our DFW production and roughly 300 to 360 from Houston, so freight is about two days, added to two to four weeks of production from proof approval." },
      { q: "When do McAllen schools need their uniforms?", a: "Earlier than you would think. Most local programs sit at 5A and can be in full contact by August 8, so we work McAllen delivery dates from that rather than from the first game." },
      { q: "Do you supply girls' flag teams in the Valley?", a: "Yes. Both Gridiron's McAllen league and the RGV Seahawks field girls divisions, and those sets order at the same ten-piece minimum as any other." },
      { q: "Is there 6A football in McAllen?", a: "Not inside McAllen ISD. The three McAllen high schools all play 5A Division I; the nearest 6A programs are Edinburg CISD's four schools just north of the city, and we build for those too." },
      { q: "What is the minimum order for a McAllen team?", a: "Ten pieces per design, mixed sizes counted together — a flag roster or a 7-on-7 squad clears it." },
      { q: "Can a summer set and a fall set match?", a: "Yes, if they are ordered together. Printed in one run they share a dye lot; ordered months apart, two batches of the same color can end up a shade different." },
      { q: "How should we handle sizing on a two-day shipping lane?", a: "Send a full size breakdown rather than a count and add a few extras to the run. It costs less than a second shipment and saves a fortnight if a player arrives late." },
    ],
  },

  "corpus-christi": {
    districts: ["Corpus Christi ISD", "Flour Bluff ISD", "Calallen ISD", "Tuloso-Midway ISD", "West Oso ISD", "London ISD"],
    schools: [
      { school: "Veterans Memorial", district: "Corpus Christi ISD", level: "5A Division I" },
      { school: "Carroll", district: "Corpus Christi ISD", level: "5A Division I" },
      { school: "Flour Bluff", district: "Flour Bluff ISD", level: "5A Division I" },
      { school: "Ray", district: "Corpus Christi ISD", level: "5A Division II" },
      { school: "King", district: "Corpus Christi ISD", level: "4A Division I" },
      { school: "Miller", district: "Corpus Christi ISD", level: "4A Division I" },
      { school: "Moody", district: "Corpus Christi ISD", level: "4A Division I" },
      { school: "Calallen", district: "Calallen ISD", level: "4A Division I" },
      { school: "Tuloso-Midway", district: "Tuloso-Midway ISD", level: "4A Division I" },
      { school: "London", district: "London ISD", level: "4A Division II" },
      { school: "West Oso", district: "West Oso ISD", level: "3A Division I" },
    ],
    schoolsNote:
      "There is no 6A football in Corpus Christi. The city's biggest programs — Veterans Memorial, Carroll and Flour Bluff — play 5A Division I, and three Corpus Christi ISD schools dropped to 4A Division I in the 2026-28 realignment, which puts King, Miller and Moody in the same conference as Calallen and Tuloso-Midway. Six separate districts serve one coastal city, and West Oso plays all the way down at 3A Division I.",
    youthLeagues: [
      { name: "Corpus Christi Youth Football League", note: "in its 65th season, running flag, pee-wee, JV and varsity tackle divisions for ages four to twelve at the Kasper and Lamont fields." },
      { name: "i9 Sports Corpus Christi", note: "runs flag football at Bill Witt Park and other venues, also covering Calallen, Gregory-Portland and Kingsville." },
      { name: "N Zone Sports Corpus Christi", note: "runs youth flag football leagues in the city." },
    ],
    youthNote:
      "Sixty-five seasons of one youth league is rare anywhere. The Corpus Christi Youth Football League still runs the full ladder from flag to varsity tackle for four- to twelve-year-olds on the same two fields, which means one organization ordering every size we make. Our",
    levelMix: "youth",
    stadiums: [
      { name: "Buccaneer Stadium", note: "Corpus Christi ISD's main venue and the largest football stadium in the area." },
      { name: "Cabaniss Multipurpose Field", note: "part of the Cabaniss Athletic Complex, seating 8,000 on the football field itself." },
    ],
    seasonNote:
      "Most Corpus Christi programs are 4A or 5A, and the 4A schools open conditioning on August 3 with full contact from August 8 — a week ahead of the 5A and 6A schools that held spring training. In a coastal city that means the earliest practices of the year happen in the stickiest fortnight of it.",
    deliveryDays: "Corpus Christi is about 211 miles from Houston and 390 miles from our DFW production — a one- to two-day freight run.",
    deliveryDetail:
      "Corpus Christi is far enough south that freight is a one- to two-day run rather than an overnight, so a coastal order needs its proof signed a little earlier than a metroplex one. Salt air is the other local factor: sublimated color is dyed into the fiber, so there is no printed layer for coastal humidity to lift.",
    orderIntro:
      "Corpus Christi orders are mid-sized and spread across six districts, and they skew toward 4A and 5A rosters rather than the 6A blocks the big metros order.",
    orderStory: [
      "Tell us the school or league and the count. With six districts in one city, the district name is what tells us who we are quoting.",
      "Send the colors. If you are matching a set bought two or three seasons ago, a daylight photo is more reliable than the original color name.",
      "Pricing and a free mockup come back inside 24 hours, at 4A and 5A block sizes if that is what you are ordering.",
      "On approval the run is printed in one pass, which for a youth league covering flag through varsity tackle is the only way every division matches.",
      "Freight south takes a day or two, so we work back from your first scrimmage rather than from week one.",
    ],
    mostOrderedVarsity:
      "The city's 5A Division I and 4A Division I programs order full game sets in the spring, sized smaller than a big-metro 6A order. Our",
    mostOrderedPractice:
      "A coastal August makes two-a-days a laundry problem as much as a football one, and one jersey covering both practice colors halves it. Our",
    faqs: [
      { q: "Do you build uniforms for Corpus Christi schools?", a: "Yes, across all six districts in the city — Corpus Christi ISD, Flour Bluff, Calallen, Tuloso-Midway, West Oso and London — from 5A Division I down to 3A Division I, plus the youth leagues and club teams." },
      { q: "Is there 6A football in Corpus Christi?", a: "No. The 2026-28 alignment leaves the city's largest programs at 5A Division I — Veterans Memorial, Carroll and Flour Bluff — with King, Miller and Moody now in 4A Division I. Orders here are sized accordingly rather than to a 6A roster." },
      { q: "How long does shipping to Corpus Christi take?", a: "About 211 miles from Houston and 390 from our DFW production, which is a one- to two-day freight run. Allow two to four weeks of production from proof approval on top of that." },
      { q: "Does coastal air damage printed jerseys?", a: "Not a sublimated one. The color is dyed into the fiber rather than layered on top, so there is no print film for salt air and humidity to lift the way they can with a heat-pressed number." },
      { q: "Can one order cover a youth league's flag and tackle divisions?", a: "Yes. The Corpus Christi Youth Football League runs flag, pee-wee, JV and varsity tackle for ages four to twelve, and printing every division in one run keeps the colors identical from the smallest flag jersey to the twelve-year-olds' set." },
      { q: "What is the minimum order for a Corpus Christi team?", a: "Ten pieces per design, mixed sizes included — a single youth division clears it comfortably." },
      { q: "Our program is 4A — is the order handled differently?", a: "Same garment, smaller run. A 4A roster is a narrower size spread than a 5A or 6A one, so we hold fewer extras and concentrate them in the middle sizes." },
      { q: "Can you match colors on a reorder two seasons later?", a: "Yes. We keep the color values on file with the order, so a partial reorder for new players comes off the same spec as the original set rather than being matched by eye." },
      { q: "When should a Corpus Christi program order for the fall?", a: "Earlier than a metroplex program. The 4A schools here open conditioning on August 3 with contact from August 8, and freight south adds a day or two to the schedule." },
    ],
  },

  arlington: {
    districts: ["Arlington ISD", "Mansfield ISD"],
    schools: [
      { school: "Arlington", district: "Arlington ISD", level: "6A" },
      { school: "Bowie", district: "Arlington ISD", level: "6A" },
      { school: "Sam Houston", district: "Arlington ISD", level: "6A" },
      { school: "Lamar", district: "Arlington ISD", level: "6A" },
      { school: "Martin", district: "Arlington ISD", level: "6A" },
      { school: "Seguin", district: "Arlington ISD", level: "5A Division II" },
    ],
    schoolsNote:
      "Arlington ISD is a five-school 6A district with one 5A Division II program, and for 2026-28 UIL put those five in District 3-6A alongside Aledo, Granbury and Weatherford. Aledo has won twelve state titles since 1998, eleven of them in the last fifteen years, so an Arlington team now photographs its uniform against the best-known program in the state several times a season.",
    youthLeagues: [
      { name: "Arlington-Mansfield Area YMCA flag football", note: "runs recreational divisions for ages 5 and 6 and recreational plus competitive divisions from age 7 up, with fall practices starting in late October." },
    ],
    youthNote:
      "Arlington's youth flag season runs later than the school season — the YMCA's fall practices do not start until late October, so those uniform orders land when the high school sets have been in the field for two months. That is a separate production window, and it is worth booking it separately. Our",
    levelMix: "flag",
    stadiums: [
      { name: "Choctaw Stadium", note: "the former major-league ballpark, used by Arlington ISD for marquee varsity games." },
      { name: "Michael Glaspie Field", note: "the district's newest stadium at roughly 10,000 seats, built at Martin High School and shared with Seguin." },
      { name: "C.H. Wilemon Field", note: "an 8,800-seat Arlington ISD stadium at Sam Houston High School, opened in 1972." },
    ],
    seasonNote:
      "Arlington's 6A programs run the later of UIL's two 2026 start dates if they held spring training — conditioning from August 10, contact from August 15 — and play week one on August 27–29. The flag season then starts after them, which is why we quote the two separately.",
    deliveryDays: "Arlington sits between Dallas and Fort Worth, roughly 15 to 18 miles from DFW Airport — a same-metro delivery.",
    deliveryDetail:
      "Sitting in the middle of the metroplex, Arlington gets the shortest delivery leg of any city we serve. What actually sets the date here is the number of sets: a five-school district ordering in the same spring window fills production faster than a single program does, so an Arlington order placed early in the season is the one that lands early.",
    orderIntro:
      "An Arlington order is usually a 6A order, which means a long roster, a wide size run and a real need for extras. Sixty to ninety jerseys in one design is normal here and changes how we price it.",
    orderStory: [
      "Send the roster count including the freshman and JV blocks if they are being outfitted in the same design — the per-piece price moves with the total, not with the varsity number alone.",
      "We quote and mock up inside 24 hours. On a 6A order we proof the largest and smallest sizes together, because a mark that looks right on a medium can crowd the panel on a 3XL.",
      "You approve the proof and confirm the size breakdown. This is the step that takes longest on a 6A order and the one worth spending an afternoon on.",
      "Production runs the whole order in a single pass, so varsity, JV and freshman jerseys come from the same dye lot and stand together on a sideline at Choctaw Stadium without a visible color break.",
      "Delivery is local, and extras from the size run are held so a late roster addition is not wearing a different shade of the school color.",
    ],
    mostOrderedVarsity:
      "With five 6A programs in one district, the Arlington orders we see most are large varsity-and-JV sets ordered together in the spring. Our",
    mostOrderedPractice:
      "Arlington's district schedule now includes Aledo, Granbury and Weatherford, and preparing for teams that different means a lot of scout-team work in two colors. Our",
    faqs: [
      { q: "Do you outfit Arlington ISD high schools?", a: "Yes. Arlington ISD's five 6A programs — Arlington, Bowie, Sam Houston, Lamar and Martin — and Seguin at 5A Division II are all inside our normal range, and a 6A roster order here typically runs 60 to 90 jerseys in one design." },
      { q: "How large an order can you handle for a 6A Arlington roster?", a: "A single design can cover varsity, JV and freshman blocks in one production run, which is how most Arlington programs order. Running them together keeps every jersey in the same dye lot and lowers the per-piece price against ordering the blocks separately." },
      { q: "How quickly do uniforms reach Arlington?", a: "Arlington is about 15 to 18 miles from DFW Airport and inside our home metroplex, so there is no freight leg at all — the timeline is two to four weeks of production from proof approval, then a local delivery." },
      { q: "Do you make uniforms for Arlington youth flag teams?", a: "Yes. The Arlington-Mansfield Area YMCA runs recreational flag for ages 5 and 6 and recreational plus competitive divisions from 7 up, with fall practices starting in late October — a later window than the school season, so we book those orders separately." },
      { q: "What is the minimum order in Arlington?", a: "Ten pieces per design. A single flag division clears it; a 6A varsity roster clears it many times over. Mixed sizes count toward the same 10." },
      { q: "Can you print a 3XL and a youth small from the same design?", a: "Yes, and on a 6A order we proof both before production. Sublimation places the artwork on each pattern piece at the right scale, so a chest mark that reads correctly on a medium does not crowd the panel on a 3XL." },
      { q: "Our district now plays Aledo and Granbury — does that change anything about the order?", a: "Only the calendar. A tougher district means more film, more scout-team work and more demand for two-color practice jerseys, which is why Arlington orders often add reversibles to the game-set order rather than buying them later." },
      { q: "Can you supply sideline and staff apparel to match the game kit?", a: "Yes. Coaches polos, quarter-zips and sideline jackets print in the same colors and marks, which matters at a venue like Choctaw Stadium where the sideline is as visible as the field." },
      { q: "When should an Arlington program order for the fall season?", a: "Spring. The city's 6A programs all order into the same production window, so the Arlington team that places its order in April gets the earliest delivery date; one placed in August is competing with four other districts for the same press time." },
    ],
  },

  denton: {
    districts: ["Denton ISD", "Argyle ISD", "Krum ISD", "Sanger ISD"],
    schools: [
      { school: "Guyer", district: "Denton ISD", level: "6A" },
      { school: "Braswell", district: "Denton ISD", level: "6A" },
      { school: "Denton", district: "Denton ISD", level: "5A Division I" },
      { school: "Ryan", district: "Denton ISD", level: "5A Division I" },
    ],
    schoolsNote:
      "Denton ISD's four open high schools split two and two: Guyer and Braswell in 6A, Denton High and Ryan in 5A Division I. Ryan is a three-time UIL state champion, and for 2026-28 it moved into a district that no longer includes Aledo. Denton's own growth is what drives the split — Braswell opened because the district's north end filled in, and the classification line now runs straight through Denton ISD.",
    youthLeagues: [
      { name: "Denton County Youth Football League", note: "a nonprofit youth football and cheer league listed by the City of Denton among its official youth associations." },
      { name: "Denton Parks and Recreation youth flag football", note: "the city-run flag program, registered through the parks department's own league system." },
      { name: "Neighborhood Sports NFL Flag", note: "runs Denton North and Denton South divisions with games played at Denton High School and Guyer." },
    ],
    youthNote:
      "Denton is one of the few cities on this list where the youth flag games are played on the high school fields themselves — the Neighborhood Sports divisions use Denton High and Guyer. Parents see the varsity uniform and the flag uniform on the same turf a few hours apart, which is a good reason for the youth set to look like the varsity set. Our",
    levelMix: "flag",
    stadiums: [
      { name: "C.H. Collins Athletic Complex", note: "Denton ISD's 12,000-seat stadium, opened in 2004 and split evenly between home and visitor sides, used by Denton High, Guyer, Braswell and Ryan." },
    ],
    seasonNote:
      "All four Denton ISD programs work to the same UIL 2026 window — an August 3 or August 10 conditioning start depending on spring training, and week-one games on August 27–29 — and all four share one stadium, so the photo day and jamboree dates stack up quickly.",
    deliveryDays: "Denton is about 39 miles north of Dallas on I-35E, still inside our delivery radius rather than a freight lane.",
    deliveryDetail:
      "The drive from our metroplex production up I-35E to Denton is under an hour, so orders here run on the same schedule as Dallas and Fort Worth. Where Denton differs is the concentration: four high schools sharing one stadium means four programs wanting delivery in the same fortnight before the season opens.",
    orderIntro:
      "A Denton order tends to be for one of two things — a high school set in a district where the classification line splits the city, or a youth flag set for teams playing on those same high school fields.",
    orderStory: [
      "Tell us the program and the level. A 6A set for Guyer or Braswell and a 5A Division I set for Denton High or Ryan are sized differently even when the design is identical.",
      "Send the colors. If you are matching a Denton ISD school's existing set rather than starting fresh, a photo of the current jersey in daylight gets us closer than a color name.",
      "We return pricing and a free 24-hour mockup. Youth flag orders get the same mockup treatment, at the smaller block.",
      "Approve, and we print. One run covers every size in the order, which keeps the varsity and the feeder squads visibly the same color under the lights at C.H. Collins.",
      "We deliver up I-35E. Because four programs here share one stadium and one calendar, ordering early is worth more in Denton than the calendar alone suggests.",
    ],
    mostOrderedVarsity:
      "Denton ISD programs order full varsity sets in the spring, and the two 6A schools order larger blocks than the two 5A Division I schools in the same city. Our",
    mostOrderedPractice:
      "Four programs on one stadium means shared practice fields and a lot of mixed scrimmage work, which is exactly the job a two-sided jersey does. Our",
    faqs: [
      { q: "Which Denton schools do you build uniforms for?", a: "All four Denton ISD high schools — Guyer and Braswell at 6A, Denton High and Ryan at 5A Division I — plus the youth and flag programs in the city and the smaller districts around it, such as Argyle, Krum and Sanger." },
      { q: "How long does an order take to reach Denton?", a: "Denton is roughly 39 miles north of Dallas on I-35E, inside our delivery radius rather than a freight lane. Plan on two to four weeks of production from proof approval plus the drive up." },
      { q: "Can you match the set a Denton ISD school already owns?", a: "Usually, yes. Send a daylight photo of the current jersey along with any color values the school has on file. We proof the match before production so a partial reorder does not arrive a shade off the jerseys already in the locker room." },
      { q: "Do you make uniforms for Denton youth flag leagues?", a: "Yes. Denton County Youth Football League, the city parks department's flag program and the Neighborhood Sports NFL Flag divisions all order at the 10-piece minimum, and the flag divisions play on Denton High and Guyer's fields, so the sets get seen next to the varsity kits." },
      { q: "What is the minimum order for a Denton team?", a: "Ten pieces per design, mixed sizes included. A single flag roster or one JV block clears it without needing to combine teams." },
      { q: "Our program is 5A Division I — how many jerseys is a typical order?", a: "A 5A Division I varsity block is usually smaller than a 6A block, so the size run is narrower and the extras concentrate in the middle sizes. We quote from your actual roster count rather than a conference average." },
      { q: "Can you do home and away sets for a Denton program in one order?", a: "Yes, and running both colorways in one production pass shares the setup and keeps the numbers and names identical between the two sets." },
      { q: "When should a Denton program order for the fall?", a: "Before the end of spring. Four Denton ISD programs share C.H. Collins Athletic Complex and the same UIL calendar — conditioning opens August 3 or August 10 depending on spring training — so they all want delivery in the same fortnight." },
      { q: "Do you supply youth sizes and adult sizes in one order?", a: "Yes. A Denton youth program that runs from elementary flag up to a middle school division can order the whole thing as one design, printed in one run, in both youth and adult blocks." },
    ],
  },

  granbury: {
    districts: ["Granbury ISD", "Tolar ISD", "Glen Rose ISD", "Lipan ISD"],
    schools: [
      { school: "Granbury", district: "Granbury ISD", level: "6A" },
      { school: "Glen Rose", district: "Glen Rose ISD", level: "4A Division II" },
      { school: "Tolar", district: "Tolar ISD", level: "3A Division II" },
    ],
    schoolsNote:
      "Granbury moved up to 6A in the 2026-28 realignment and now plays in District 3-6A with Arlington ISD's five schools, Aledo and Weatherford. Nothing else in Hood County is close to that size: Glen Rose plays 4A Division II and Tolar 3A Division II, a drop of three conferences within a twenty-minute drive. One town, three different sizes of football program, and three very different uniform orders.",
    youthLeagues: [
      { name: "Granbury Youth Football Association", note: "the local nonprofit running flag football at 5U and 6U and tackle from 7U through 12U — the pipeline that feeds the Pirates." },
      { name: "City of Granbury Parks and Recreation", note: "lists youth football among its youth sports programs, which is where the youngest players in town usually start." },
    ],
    youthNote:
      "Granbury's youth association covers the whole pipeline itself — flag at five and six years old, tackle from seven to twelve — so a single organization often orders every size we make in one go. Our",
    levelMix: "youth",
    stadiums: [
      { name: "Pirate Stadium (Johnny Perkins Field)", note: "Granbury ISD's home ground on West Pearl Street, opened in 1973, seating about 5,135 — now hosting 6A football." },
    ],
    seasonNote:
      "Moving up to 6A does not change the UIL calendar, but it changes what a Granbury team runs into: conditioning opens August 3 or August 10 depending on spring training, and week one on August 27–29 now starts a season against 6A opposition.",
    deliveryDays: "Granbury is about 40 miles southwest of Fort Worth on Highway 377 — the same delivery day as the rest of the metroplex.",
    deliveryDetail:
      "Most uniform suppliers treat Hood County as out of area. It is 40 minutes from Fort Worth, so our Granbury deliveries run on exactly the same schedule as Arlington or Denton, and a Granbury program does not pay a rural freight charge to get a set proofed and printed.",
    orderIntro:
      "Granbury orders come in two very different shapes. A 6A high school set is a long roster with a wide size run, and a youth association order covers five-year-olds in flag through twelve-year-olds in pads in one purchase.",
    orderStory: [
      "Tell us which you are ordering for — the high school program or the youth association — and give the count. The youth order needs division counts rather than one number.",
      "Send the purple and white values if you are matching the Pirates, or your own colors if you are a club. We proof the exact shade before anything is cut.",
      "Free mockup inside 24 hours, and for a youth association we mock up each division so parents can see the 7U set next to the 12U set.",
      "On approval we print every division in one run, which is how the flag squad and the twelve-year-olds end up in genuinely the same purple.",
      "Delivery runs down 377 on the metroplex schedule. Hood County is not a freight surcharge on our pricing.",
    ],
    mostOrderedVarsity:
      "Granbury's move up to 6A means a longer roster to outfit than the town has been used to, ordered in the spring against a district that now includes Aledo and Weatherford. Our",
    mostOrderedPractice:
      "A youth association running flag and four tackle divisions splits practice constantly, and one two-color jersey per player is cheaper than two sets per division. Our",
    faqs: [
      { q: "Do you make uniforms for Granbury ISD teams?", a: "Yes — Granbury ISD programs, the Granbury Youth Football Association, select and 7-on-7 teams around Lake Granbury, and the small-school programs nearby in Tolar, Glen Rose and Lipan. Send a roster count and colors for a quote and a free mockup." },
      { q: "Granbury is 6A now — does that change the order?", a: "It changes the size of it. The 2026-28 realignment put Granbury in District 3-6A with Arlington ISD's five schools, Aledo and Weatherford, and a 6A schedule means a longer roster, more sub-varsity players to outfit and more demand for extras." },
      { q: "Do you charge extra to deliver to Hood County?", a: "No. Granbury is about 40 miles southwest of Fort Worth on Highway 377, so it runs on the same delivery schedule as the rest of the metroplex — there is no rural surcharge in our pricing." },
      { q: "Can one order cover a youth league's flag and tackle divisions?", a: "Yes, and that is how the Granbury Youth Football Association's sizing works — flag at 5U and 6U, tackle from 7U to 12U. We print every division in one run so the purple is identical from the smallest flag jersey to the 12U set." },
      { q: "Can you match the Pirates' purple exactly?", a: "Yes. Send the color value the school uses or a daylight photo of a current jersey, and we proof the shade before production. The value is stored with the order so next season's reorder matches this season's set." },
      { q: "What is the minimum order for a Granbury team?", a: "Ten pieces per design. A single youth division clears it, and a high school roster clears it several times over. Mixed sizes count toward the same 10." },
      { q: "Do you outfit the small-school programs around Granbury?", a: "Yes. Glen Rose plays 4A Division II and Tolar 3A Division II, and both are well inside our minimum — a 3A roster is a smaller order, not an order we turn down." },
      { q: "When should a Granbury program order for the fall?", a: "In spring. UIL's 2026 calendar opens conditioning on August 3 or August 10 depending on spring training and week-one games fall on August 27–29, so a spring order has the set on hand well before the first 6A opponent." },
      { q: "Can you print names and numbers for a Granbury roster?", a: "Yes. Names, numbers, patches and captain marks are sublimated into the fabric as part of the same run, so nothing is pressed on afterwards and nothing peels in a Texas August." },
    ],
  },
};
