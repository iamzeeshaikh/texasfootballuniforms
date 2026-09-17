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
