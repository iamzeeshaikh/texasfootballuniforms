/**
 * Extra, query-led content for the pages Search Console says people are
 * already looking for and this site is not winning.
 *
 * Each entry adds H2s that use the real query wording, a table or a list, the
 * internal links that belong in the cluster, and FAQs that answer price,
 * minimum and turnaround — the three questions every quote email opens with.
 * The existing long-form copy on these pages stays exactly as it is; this is
 * added alongside it, never instead of it.
 *
 * GSC impressions in the comments are the 12 months to 2026-09-17.
 */

export type MoneyBlock =
  | { kind: "prose"; heading: string; paragraphs: string[] }
  | { kind: "bullets"; heading: string; intro?: string; bullets: string[] }
  | {
      kind: "table";
      heading: string;
      intro?: string;
      head: string[];
      rows: string[][];
      note?: string;
    };

export type MoneyPage = {
  /** One-line summary under the H1 block heading. */
  lead: string;
  blocks: MoneyBlock[];
  /** Cluster links, rendered as their own card row. */
  links: { href: string; label: string; note: string }[];
  /** Appended to the product's FAQ list, so they also reach the FAQ schema. */
  faqs: { question: string; answer: string }[];
};

export const moneyPages: Record<string, MoneyPage> = {
  // 162 impressions, average position 58. The best single opportunity on the
  // site: a real page already exists and ranks nowhere.
  "reversible-football-jerseys": {
    lead: "One jersey, two team colors. Reversible jerseys are how a Texas program splits a scrimmage, kits a 7v7 roster and covers both practice colors without buying two sets.",
    blocks: [
      {
        kind: "prose",
        heading: "Reversible Youth Football Jerseys",
        paragraphs: [
          "Youth programs buy reversible jerseys for one reason above all others: a single order covers both sides of every practice. A 24-player youth roster that would otherwise need 24 dark jerseys and 24 light ones needs 24 reversibles, and the coach never has to remember which bag is in the truck.",
          "Youth reversibles are cut on the youth block from YXS up, with shorter body length and a narrower shoulder so the second layer does not bunch on a smaller frame. Numbers are printed on both sides in the same digit for each player, so a boy who is 42 in white is 42 in navy and the roster sheet stays correct whichever way the jersey is worn.",
          "Weight matters more at this level than any other. A reversible is two fabric faces bonded into one garment, so it is always warmer than a single-layer jersey. For August in Texas we build youth reversibles in the lightest mesh that still blocks the reverse color from showing through, which is the whole trick of a good reversible.",
        ],
      },
      {
        kind: "prose",
        heading: "Reversible Practice Pinnies",
        paragraphs: [
          "A practice pinny is the simplest reversible there is: no sleeves or short sleeves, big numbers, two colors, nothing else. Coaches use them to split offense from defense in seconds, to mark a scout team, and to keep the ones and twos visually separate through an install period.",
          "Because pinnies live in a mesh bag and get washed daily through two-a-days, the build is different from a game jersey. We use an open mesh that dries fast, a double-needle hem that survives repeated machine drying, and sublimated numbers that are dyed into both faces rather than pressed onto them — a heat-pressed number on a pinny peels inside a season.",
          "Most programs order pinnies in the same numbers as their game jerseys so a player wears one identity all week. Some order them 1 to 30 in plain digits instead, which makes the set reusable year after year regardless of who is on the roster.",
        ],
      },
      {
        kind: "prose",
        heading: "Reversible Game-Day Sets",
        paragraphs: [
          "A reversible game-day set is a heavier build than a practice pinny: game-weight fabric on the outward face, a lighter bonded liner, and full decoration on both sides including nameplates, front numbers, sleeve numbers and the program wordmark. Teams order them when travel schedules mean a home and an away look without two shipments.",
          "The design work on a game-day reversible is genuinely two designs. Color blocking that reads well in white on navy usually needs different weights and outline treatments to read in navy on white, and we proof both faces before anything goes to production so you approve the away look and the home look separately.",
          "The honest limitation: a reversible set is heavier than two single-layer jerseys and sits differently under shoulder pads. Programs that play in September heat in South Texas usually keep reversibles for practice and 7v7 and order single-layer jerseys for Friday nights. We will tell you that on the quote call rather than after delivery.",
        ],
      },
      {
        kind: "prose",
        heading: "7v7 Reversible Jerseys",
        paragraphs: [
          "The Texas 7on7 summer circuit is where reversibles earn their keep. Pool play puts a team in four games in a day against opponents whose colors are drawn the night before, and a reversible removes the color-clash problem entirely — the official tells you which side to wear and the team flips.",
          "7v7 reversibles are built lighter than anything else in this category because there are no pads and the tournaments run through June and July heat. Compression-adjacent cuts are common: a closer body so the jersey does not get grabbed, and a shorter sleeve so the arm is free.",
          "Order for a 7v7 roster, not a varsity roster. Most state-series 7v7 teams carry 14 to 18 players, which clears our minimum of 10 comfortably and keeps the per-jersey cost where a booster club can fund it.",
        ],
      },
      {
        kind: "bullets",
        heading: "What Reversible Jerseys Cost and What Is in the Price",
        intro:
          "Reversible jerseys are the most expensive jersey we make, and the reason is simple: they are two decorated jerseys bonded into one garment.",
        bullets: [
          "The starting price is per jersey at our 10-piece minimum, and it covers both faces — fabric, bonding, and sublimated numbers and names on each side.",
          "Larger rosters pay less per jersey. The setup work for a reversible is done once for the design, not once per piece, so a 30-player order spreads it further than a 10-player order.",
          "Tackle twill numbering is available on the outward face only. Stitched numbers on a reversible face would show through the reverse side, which is why the standard build is full sublimation on both faces.",
          "Two colorways is the standard. A third color as trim on either face costs nothing extra in sublimation; it changes the artwork, not the process.",
          "Turnaround is the same as a single-layer jersey — three weeks after you approve the design — because the extra work is in the build, not the queue.",
        ],
      },
    ],
    links: [
      {
        href: "/football-practice-jerseys/",
        label: "football practice jerseys",
        note: "Single-layer practice tops when the roster only needs one color.",
      },
      {
        href: "/7-on-7-football-uniforms/",
        label: "7-on-7 football uniforms",
        note: "The full 7v7 kit the reversible jersey usually ships with.",
      },
      {
        href: "/youth-football-jerseys/",
        label: "youth football jerseys",
        note: "Youth sizing from YXS, single-layer and reversible.",
      },
      {
        href: "/flag-football-jerseys/",
        label: "flag football jerseys",
        note: "Belt-friendly cuts for flag leagues that want two colors.",
      },
    ],
    faqs: [
      {
        question: "How much do custom reversible football jerseys cost?",
        answer:
          "Reversible football jerseys start at $66.99 per jersey at our 10-piece minimum, which covers both faces fully sublimated with numbers and names. That is the price at the smallest order we produce; larger rosters pay less per jersey, and we quote your real roster count rather than the minimum.",
      },
      {
        question: "What is the minimum order for reversible jerseys?",
        answer:
          "Ten jerseys per design. Mixed sizes count toward the same ten, so a youth squad ordering four YM, four YL and two YXL clears the minimum on its own.",
      },
      {
        question: "How long do reversible football jerseys take to make?",
        answer:
          "Three weeks after you approve the artwork. Both faces are proofed before production starts, so allow a few days for that review on top — programs that send colors and roster data early usually approve within 48 hours of receiving the free mockup.",
      },
      {
        question: "Can both sides have player names and numbers?",
        answer:
          "Yes. Numbers go on both faces as standard, and each player carries the same digit on both sides so your roster sheet stays correct whichever way the jersey is worn. Nameplates on both faces are available and are sublimated in, not sewn on.",
      },
      {
        question: "Are reversible jerseys too hot for a Texas August?",
        answer:
          "A reversible is always warmer than a single-layer jersey because it is two bonded faces. For summer practice and 7v7 we build them in the lightest mesh that still stops the reverse color showing through. Programs playing September games in South Texas heat usually keep reversibles for practice and order single-layer game jerseys.",
      },
    ],
  },

  // 56 impressions, position 62.
  "sublimated-football-jerseys": {
    lead: "Full-dye sublimation prints the design into the fabric instead of onto it. No screens, no color limit, nothing to crack or peel — and it is what nearly every custom football kit we ship is made with.",
    blocks: [
      {
        kind: "prose",
        heading: "How Sublimation Football Jerseys Are Made",
        paragraphs: [
          "Sublimation is a dye process, not a print layer. The artwork is printed in reverse onto transfer paper, then heat and pressure turn the dye to gas and bond it into the polyester fibers themselves. When the panel comes off the press the design is part of the cloth: you can run a hand across a sublimated number and feel nothing.",
          "That is why sublimation football jerseys are cut and sewn after decoration rather than before. Each panel — front, back, sleeves, collar — is printed flat and then assembled, which is what lets a design run edge to edge, wrap a side seam and continue across a shoulder without a break.",
          "Screen printing and heat transfer both sit on top of the fabric. They are cheaper for a simple one-color mark on a blank, and we still do them, but they crack, peel and fade through a Texas season of washing. A sublimated jersey fades only when the polyester itself fades.",
        ],
      },
      {
        kind: "bullets",
        heading: "Sublimated Football Uniforms: The Full Kit",
        intro:
          "Sublimated football uniforms are the same process applied across the whole kit, which is the only reliable way to get one color across pieces made from different fabrics.",
        bullets: [
          "Jersey and pants printed in the same run so the team color matches between two different fabric weights — the single most common complaint about mixed-vendor kits.",
          "Unlimited colors at no extra cost. Sublimation has no per-color screen charge, so a six-color gradient costs what a one-color block costs.",
          "Player names, numbers, sleeve numbers, captain marks and sponsor panels all dyed in at once, in one production pass.",
          "Team socks printed to the same colorway — see our custom sublimated football socks for crew and knee lengths.",
          "Reorders that match. Your Pantone values and placement file are kept, so a mid-season replacement jersey comes out the same color as the originals.",
        ],
      },
      {
        kind: "table",
        heading: "Sublimation vs Screen Print vs Tackle Twill",
        intro:
          "Three ways to put a number on a football jersey, and the honest trade-offs between them.",
        head: ["", "Full sublimation", "Screen print", "Tackle twill"],
        rows: [
          ["Where the design sits", "Dyed into the fiber", "Ink layer on the surface", "Stitched fabric layer"],
          ["Color count", "Unlimited, no surcharge", "Priced per color", "Usually two layers"],
          ["Feel", "Nothing — flat to the hand", "Slight raised film", "Raised and heavy"],
          ["Wash life", "Lasts as long as the fabric", "Cracks and fades", "Edges lift over seasons"],
          ["Full-body graphics", "Yes, edge to edge", "No, panel only", "No"],
          ["Best for", "Game and practice kits", "Blanks and one-color marks", "Classic varsity look"],
        ],
        note: "Sublimation only works on polyester. Cotton and cotton blends will not take the dye, which is why sublimated hoodies and coaches uniforms use poly-face fabrics.",
      },
      {
        kind: "prose",
        heading: "What Sublimated Football Jerseys Cost in Texas",
        paragraphs: [
          "Sublimated jerseys start at $32.99 per jersey at our 10-piece minimum, and that price includes the full design — numbers front and back, sleeve numbers, player names and your logo. There is no artwork fee and no per-color charge, because there are no screens to make.",
          "The number drops as the roster grows. Design setup happens once; spreading it across 40 jerseys instead of 10 is where the volume saving comes from. A full sublimated uniform, jersey and pants together, starts at $55.99 per set on the same basis.",
          "Nothing is charged before you approve a mockup. Send your colors, logo and roster count and you get a free digital mockup within 24 hours with a written price against it.",
        ],
      },
    ],
    links: [
      {
        href: "/football-socks/",
        label: "sublimated football socks",
        note: "Crew and knee-length socks printed to the same colorway.",
      },
      {
        href: "/custom-team-jerseys/",
        label: "custom team jerseys",
        note: "The general team jersey page, sublimated or screen printed.",
      },
      {
        href: "/american-football-uniforms/",
        label: "full sublimated uniform sets",
        note: "Jersey and pants printed together so the colors match.",
      },
      {
        href: "/reversible-football-jerseys/",
        label: "reversible football jerseys",
        note: "Two sublimated faces bonded into one jersey.",
      },
    ],
    faqs: [
      {
        question: "How much do sublimated football jerseys cost?",
        answer:
          "Sublimated football jerseys start at $32.99 per jersey at the 10-piece minimum, including numbers, names, sleeve numbers and your logo. There is no artwork fee and no per-color charge. A full sublimated uniform with jersey and pants starts at $55.99 per set.",
      },
      {
        question: "What is the difference between sublimated and screen-printed football jerseys?",
        answer:
          "Sublimation dyes the design into the polyester so there is nothing on the surface to crack, peel or fade, and it allows unlimited colors and edge-to-edge graphics. Screen print lays ink on top of the fabric, is priced per color, and wears out sooner. Screen print is still the cheaper choice for a single-color mark on a blank jersey.",
      },
      {
        question: "Can you sublimate any color or gradient?",
        answer:
          "Yes. Sublimation has no per-color cost, so gradients, fades, camo, carbon patterns and photographic panels all cost the same as a solid block. The one limit is that sublimation dyes cannot print white — white areas are the base fabric showing through — and the process needs polyester, so it will not work on cotton.",
      },
      {
        question: "How long does a sublimated football order take?",
        answer:
          "Three weeks after you approve the design for jerseys, one to two weeks for a full uniform. You get a free mockup within 24 hours of sending your colors and logo, and the production clock starts when you approve it.",
      },
      {
        question: "Will sublimated names and numbers peel off?",
        answer:
          "No. There is no layer to peel because the dye is inside the fiber. A sublimated jersey fades only when the polyester itself fades, which is why we use it on practice gear that gets washed daily through two-a-days.",
      },
    ],
  },

  // 44 impressions, position 48. The page said "apparel"; coaches search
  // "coaches uniforms".
  "coaches-apparel": {
    lead: "Coaches uniforms put the staff in the same visual system as the roster: polos, quarter-zips, jackets and hoodies in the program's exact colors, with titles embroidered where they need to be readable at close range.",
    blocks: [
      {
        kind: "prose",
        heading: "Coaches Uniforms for Texas Football Staffs",
        paragraphs: [
          "A football staff is on camera as much as the team. Sideline shots, press conferences, banquet photos and recruiting visits all put the coaching staff in frame, and a sideline where the head coach, the coordinators, the trainer and the student assistants are wearing four different shades of the same color reads as disorganized before anyone says a word.",
          "Coaches uniforms solve that the same way team uniforms do: one color standard, one set of garments, ordered together. We confirm Pantone values across the whole staff order — the polo, the quarter-zip, the shell and the hoodie — so the navy on a coach's jacket is the navy on a player's jersey rather than a near miss.",
          "Sizing for a coaching staff spans further than a roster does. Our coaches uniforms run Adult S through 4XL across every garment type, and mixed sizes count toward the same 10-piece minimum, so a staff of twelve orders as one job.",
        ],
      },
      {
        kind: "bullets",
        heading: "Coaches Polos, Jackets and Hoodies",
        intro: "The four pieces that cover a Texas football season from August heat to a December playoff run.",
        bullets: [
          "Coaches polos — performance knit with a structured collar that holds its shape through a full game in the heat. Left-chest logo embroidery, optional title or initials on the right chest or sleeve.",
          "Quarter-zips — the mid-layer most staffs live in from October onward. Embroidered logo, contrast zipper and collar options in a second team color.",
          "Sideline jackets and softshells — wind and water resistant for November nights, cut long enough to layer over the quarter-zip without riding up when a coach lifts a headset.",
          "Coaches hoodies — heavier fleece for travel days, cold practices and the staff that wants one comfortable piece. Poly-face fabric so a sublimated panel is possible where embroidery is not.",
          "Titles and roles — head coach, offensive coordinator, defensive coordinator, strength staff, athletic trainer. Role identification is genuinely useful to officials and visiting programs during a game.",
        ],
      },
      {
        kind: "prose",
        heading: "What Coaches Uniforms Cost",
        paragraphs: [
          "Coaches uniforms start at $34.99 per shirt at our 10-piece minimum. That is a decorated performance polo with a left-chest embroidered logo. Hoodies start at $39.99 and full warm-up suits at $59.99 per suit, and the same minimum covers a mixed order — eight polos and four quarter-zips is twelve pieces, not two separate jobs below minimum.",
          "Embroidery is what moves the number most in this category, because it is stitched work priced by stitch count. A simple wordmark costs less than a detailed mascot crest, and adding a title on a second placement adds a second run through the machine. We quote the artwork you send rather than a generic surcharge.",
          "Order coaches uniforms in the same conversation as the team kit. Confirming color values across both at once is the only reliable way to stop the staff's navy drifting a shade away from the players' navy, and it is free to do if the orders go through together.",
        ],
      },
    ],
    links: [
      {
        href: "/football-sideline-jackets/",
        label: "custom football sideline jackets",
        note: "The outer layer for November nights and travel days.",
      },
      {
        href: "/football-hoodies/",
        label: "custom football hoodies",
        note: "Fleece for staff, players and boosters in the same colorway.",
      },
      {
        href: "/football-warm-up-suits/",
        label: "team warm-up suits",
        note: "Jacket and pant sets for staff and squad travel.",
      },
      {
        href: "/football-team-kits/",
        label: "complete team uniform kits",
        note: "Order staff and roster together so the colors match.",
      },
    ],
    faqs: [
      {
        question: "How much do custom coaches uniforms cost?",
        answer:
          "Coaches uniforms start at $34.99 per shirt at the 10-piece minimum for a decorated performance polo with an embroidered left-chest logo. Hoodies start at $39.99 and warm-up suits at $59.99 per suit. Embroidery is priced by stitch count, so a detailed mascot crest costs more than a simple wordmark.",
      },
      {
        question: "Can we mix polos, quarter-zips and jackets in one order?",
        answer:
          "Yes. The 10-piece minimum is per design, and a staff order counts across garment types, so eight polos and four quarter-zips in the same colors and logo is one twelve-piece job.",
      },
      {
        question: "Will the coaches uniforms match our team jersey colors exactly?",
        answer:
          "They will if the two orders go through together, which is what we recommend. Confirming Pantone values across the jersey fabric and the staff garments in one production conversation is the only way to stop the staff's color drifting a shade from the players'.",
      },
      {
        question: "How long do coaches uniforms take?",
        answer:
          "one to two weeks after you approve the design. Embroidered orders sit at the longer end of that range because the stitch file has to be digitized and test-stitched before the run.",
      },
      {
        question: "Can each coach have their title on the garment?",
        answer:
          "Yes. Head coach, offensive coordinator, defensive coordinator, strength staff and athletic trainer are all common. Titles usually sit on the right chest or the sleeve so the program logo keeps the left chest, and role identification genuinely helps officials and visiting staff during a game.",
      },
    ],
  },

  // The hub for the youth cluster: "youth football uniforms", "little league
  // football uniforms", "youth football team uniforms", "youth football
  // uniform packages".
  "youth-football-uniforms": {
    lead: "The full youth kit — jersey, pants, and the practice and sideline pieces around them — for Texas youth leagues, little league football, select programs and middle school teams.",
    blocks: [
      {
        kind: "prose",
        heading: "Youth Football Team Uniforms for Texas Leagues",
        paragraphs: [
          "A youth football team uniform is a different engineering problem from an adult one. The same roster can hold a 60-pound third grader and a 130-pound sixth grader, pads sit differently on a smaller frame, and the parent paying for it is usually funding the whole kit out of pocket in one go.",
          "We build youth uniforms on a true youth block from YXS up rather than shrinking an adult pattern, which is what stops the shoulder seam falling halfway down the arm and the jersey hanging below the pants. Sizes run from youth XS through adult sizes on the same order, because most youth rosters need both.",
          "Every piece is sublimated, which matters more at this level than any other: youth jerseys get worn to school, washed constantly and handed down a season later, and a heat-pressed number will not survive any of that.",
        ],
      },
      {
        kind: "prose",
        heading: "Little League Football Uniforms",
        paragraphs: [
          "Little league and community football in Texas — TYFCA affiliates, city rec leagues, church leagues, Pop Warner-style organizations — almost always order as a league rather than as single teams. Ten teams in a league means ten colorways off one template, and the template is where the saving is: the design work is done once and recolored per team.",
          "League orders also need the roster logistics handled. We take a size breakdown per team rather than per player, bag and label each team's jerseys separately, and keep the numbering ranges distinct so two teams in the same league do not both hand out a number 7 in the same shade of red.",
          "If your league is ordering for the first time, the sizing kit is worth asking for. A loaner set of sample garments passed around at sign-ups removes almost every exchange request later in the season.",
        ],
      },
      {
        kind: "table",
        heading: "Youth Football Uniform Packages",
        intro:
          "What a youth program usually orders, and what each level adds. Every package is priced per player at the 10-piece minimum and drops as the roster grows.",
        head: ["Package", "What is in it", "Typical use"],
        rows: [
          ["Jersey only", "Sublimated game jersey, numbers front and back", "Leagues that supply pants, or a second color for practice"],
          ["Jersey + pants", "Game jersey and matching integrated or slotted pants", "The standard youth league kit"],
          ["Game + practice", "Game jersey, pants, and a reversible or mesh practice top", "Programs that practice four days a week"],
          ["Full program kit", "Game set, practice top, socks, and a sideline layer", "Select and travel teams playing a full season"],
          ["League package", "Any of the above, recolored across every team in the league", "Rec and little league organizations ordering as one"],
        ],
        note: "Mixed sizes count toward the same minimum. A 22-player youth roster spanning YXS to adult M is one order, not several.",
      },
      {
        kind: "bullets",
        heading: "What Youth Football Uniforms Cost",
        intro: "Youth pieces are priced the same as adult pieces — the fabric is cut smaller, but the decoration and setup work is identical.",
        bullets: [
          "A youth uniform set — jersey and pants — starts at $55.99 per player at the 10-piece minimum.",
          "Jersey only starts at $32.99 per jersey. Most youth leagues that supply their own pants order at this tier.",
          "Reversible practice jerseys start at $66.99 and replace two single-color tops, which is usually the cheaper route once you price both.",
          "A league ordering multiple teams off one template pays the design setup once, which is the largest single saving available in this category.",
          "Turnaround is one to two weeks after you approve the design, and sign-up-to-first-game windows in Texas youth leagues are usually tight — start the mockup before your roster closes.",
        ],
      },
    ],
    links: [
      {
        href: "/youth-football-jerseys/",
        label: "youth football jerseys",
        note: "Jersey-only orders, youth XS and up, when the league supplies pants.",
      },
      {
        href: "/flag-football-uniforms/",
        label: "flag football uniforms",
        note: "For the younger, no-contact divisions in the same league.",
      },
      {
        href: "/high-school-football-uniforms/",
        label: "high school football uniforms",
        note: "Where a feeder program's players end up — worth matching the look.",
      },
      {
        href: "/reversible-football-jerseys/",
        label: "reversible practice jerseys",
        note: "Two practice colors in one jersey, on the youth block.",
      },
    ],
    faqs: [
      {
        question: "How much do youth football uniforms cost?",
        answer:
          "A youth football uniform set — jersey and pants — starts at $55.99 per player at our 10-piece minimum. Jersey only starts at $32.99. Youth pieces are priced the same as adult pieces because the decoration and setup work is identical; only the fabric is cut smaller.",
      },
      {
        question: "What is the minimum order for a youth football team?",
        answer:
          "Ten per design, and mixed sizes count toward the same ten. A 22-player youth roster spanning YXS through adult M is a single order. Most youth teams clear the minimum with room to spare, which is why the price drops from the published starting number.",
      },
      {
        question: "Can our whole league order together?",
        answer:
          "Yes, and it is the cheapest way to do it. One design template recolored across every team in the league means the design setup is paid once rather than ten times. We bag and label each team separately and keep numbering ranges distinct so two teams do not hand out the same number in the same shade.",
      },
      {
        question: "What sizes do youth football uniforms come in?",
        answer:
          "Youth XS through adult sizes on the same order. We cut on a true youth block rather than shrinking an adult pattern, so the shoulder seam sits on the shoulder and the jersey does not hang below the pants. A loaner sizing kit is available for sign-up day.",
      },
      {
        question: "How long does a youth football uniform order take?",
        answer:
          "one to two weeks after you approve the design, plus the time it takes you to approve the free mockup you get within 24 hours. Texas youth sign-up-to-first-game windows are tight, so start the mockup before your roster closes rather than after.",
      },
    ],
  },

  // Narrowed to jerseys-only wording so it stops competing with the uniforms
  // hub above.
  "youth-football-jerseys": {
    lead: "Jersey-only orders for youth football: sublimated tops from youth XS up, for leagues that supply their own pants and for programs that need a second color.",
    blocks: [
      {
        kind: "prose",
        heading: "Youth Football Jerseys, Sized on a Youth Block",
        paragraphs: [
          "This page is about the jersey by itself. If your program needs the full kit — jersey, pants and the pieces around them — our youth football uniforms page covers packages, league ordering and what each tier includes.",
          "A youth jersey is not an adult jersey made smaller. The body is shorter relative to the chest, the shoulder is narrower, the armhole is higher and the sleeve is cut to clear a youth shoulder pad rather than an adult one. Getting that block right is the difference between a jersey that looks like a team's and one that looks borrowed.",
          "Numbers are scaled to the garment. A 10-inch adult number on a YS jersey runs off the panel; we drop number height by size so a YXS and an adult L in the same order both read cleanly from the stands.",
        ],
      },
      {
        kind: "bullets",
        heading: "When to Order Youth Jerseys Only",
        bullets: [
          "Your league issues pants and helmets and leaves jerseys to the team — the most common arrangement in Texas rec football.",
          "You need a second color for practice or scrimmages and already have the game set.",
          "Mid-season replacements: a jersey has torn or a new player has joined, and you need pieces that match the original run exactly.",
          "Fan and sibling jerseys in the same design for the stands, which are jersey-only by definition.",
          "7v7 and camp squads, where there are no pads and no pants in the kit at all.",
        ],
      },
      {
        kind: "prose",
        heading: "Youth Jersey Pricing and Minimums",
        paragraphs: [
          "Youth football jerseys start at $32.99 per jersey at our 10-piece minimum, sublimated with numbers front and back, sleeve numbers and your logo. Player names are included rather than charged as an extra.",
          "Ten jerseys per design, mixed sizes counted together. A youth roster of 18 clears it easily and the per-jersey price falls from the published starting number; send the real count and we quote that tier.",
          "one to two weeks after you approve the design, with a free mockup inside 24 hours of your request. Reorders of a previous design go faster because the file is already built and color-matched.",
        ],
      },
    ],
    links: [
      {
        href: "/youth-football-uniforms/",
        label: "youth football uniforms",
        note: "The full kit: jersey, pants, packages and league ordering.",
      },
      {
        href: "/reversible-football-jerseys/",
        label: "reversible football jerseys",
        note: "One jersey, two practice colors, on the youth block.",
      },
      {
        href: "/custom-name-football-jerseys/",
        label: "custom name football jerseys",
        note: "Names printed in rather than pressed on.",
      },
      {
        href: "/flag-football-jerseys/",
        label: "flag football jerseys",
        note: "Belt-friendly cuts for the no-contact divisions.",
      },
    ],
    faqs: [
      {
        question: "How much do custom youth football jerseys cost?",
        answer:
          "Youth football jerseys start at $32.99 per jersey at the 10-piece minimum, sublimated with front and back numbers, sleeve numbers, your logo and player names included. Larger rosters pay less per jersey.",
      },
      {
        question: "Should I order youth jerseys or a full youth uniform?",
        answer:
          "Order jerseys only if your league issues pants, if you need a second practice color, or if you are replacing pieces from an earlier run. Order the full youth football uniform if you need jersey and pants together — buying them in one job is the only reliable way to get the same color across two different fabrics.",
      },
      {
        question: "What youth sizes do you make?",
        answer:
          "Youth XS and up, cut on a true youth block rather than a shrunk adult pattern, and adult sizes can sit on the same order for the bigger players on a youth roster. Number height scales down with garment size so a YXS reads as cleanly as an adult L.",
      },
      {
        question: "Can we reorder a few jerseys mid-season?",
        answer:
          "Yes. We keep your Pantone values, placement file and size data from the original run, so a replacement comes out matching rather than approximating. Reorders below the minimum are quoted case by case — tell us what happened and we will work with it.",
      },
    ],
  },

  // 159 impressions, position 36, while city pages for the same intent rank
  // 1.5. UIL structure is the content that page was missing.
  "high-school-football-uniforms": {
    lead: "Varsity and JV kits built around the UIL calendar: what a classification order actually contains, when it has to be placed, and what it costs.",
    blocks: [
      {
        kind: "prose",
        heading: "UIL Classifications and What They Change About an Order",
        paragraphs: [
          "Texas high school football runs under the University Interscholastic League, which sorts schools into six classifications by enrollment — 1A through 6A — and then into districts within each. The classification a program sits in changes the shape of a uniform order more than most vendors acknowledge.",
          "A 6A program carries a varsity roster in the sixties or seventies plus JV and freshman squads, which means three tiers of the same design and a size run that stretches from an adult S on a freshman corner to a 4XL on a senior tackle. A 2A or 1A program may dress a single varsity squad of twenty-five, and six-man programs in the smallest classifications dress even fewer. Both are one order at our minimum; they are very different orders in roster planning.",
          "District realignment lands every two years and is the moment most programs rethink the kit. A new district means new opponents, new color clashes to plan around, and often a new travel radius. If your school has just been realigned, that is the right time to confirm whether your away jersey still contrasts with everyone on the new schedule.",
          "The UIL calendar is the other constraint. Spring practice, summer strength and conditioning, the August two-a-day window and a Week 1 that lands in late August mean uniforms have to be on campus before players report. Working back from that with a three-to-four-week production window and an artwork approval stage in front of it puts the realistic order date in May or June.",
        ],
      },
      {
        kind: "table",
        heading: "What a Varsity Order Includes",
        intro:
          "The pieces a Texas high school varsity order usually covers, and what each one is for. Programs order the first two together and add the rest according to budget.",
        head: ["Piece", "Typical quantity", "Why it is in the order"],
        rows: [
          ["Home game jersey", "1 per rostered player", "School colors, worn for home fixtures"],
          ["Away game jersey", "1 per rostered player", "Must contrast with every opponent on the district schedule"],
          ["Game pants", "1–2 per player", "Integrated or slotted for pad carriers; one pair often covers both looks"],
          ["Practice jerseys", "1–2 per player", "Daily wear through two-a-days; reversibles cover both scrimmage colors"],
          ["Padded compression shirts", "1 per player", "Worn under pads; ordered in the team color for scrimmage clarity"],
          ["Team socks", "1–2 pairs per player", "The piece most often forgotten and most visible on film"],
          ["Sideline jackets or warm-ups", "Squad + staff", "October onward, and for travel days"],
          ["Coaches uniforms", "Staff count", "Polos, quarter-zips and jackets in the same color standard"],
        ],
        note: "JV and freshman squads are usually the same design in a lighter package — jersey and pants only — which keeps the program visually consistent without tripling the budget.",
      },
      {
        kind: "prose",
        heading: "Choosing the Best High School Football Uniforms for a Texas Program",
        paragraphs: [
          "\"Best\" in this category comes down to four things that are genuinely comparable between suppliers, and a lot of marketing that is not. The four: how the design is applied, what the fabric weighs, how the sizing run is handled, and what happens when you need to reorder in October.",
          "Application is the clearest line. Full sublimation dyes the design into the fabric; screen print and heat transfer sit on top and wear out. Any supplier quoting a cheaper number should be asked which one they mean, because the price difference is real and so is the difference after twelve washes.",
          "Fabric weight is the one most programs under-specify. A 220gsm game-weight knit holds its shape through contact and photographs well under lights; a 150gsm practice mesh is cooler and cheaper and will not survive a season of game use. Both have a place in the same order, and a quote that does not distinguish them is not a like-for-like comparison.",
          "Sizing and reorders are where a supplier is actually tested. Ask whether a sizing kit is available before the order, whether Pantone values and placement files are kept afterward, and what a ten-jersey mid-season reorder costs. A program is buying a four-year relationship, not one shipment.",
        ],
      },
      {
        kind: "bullets",
        heading: "High School Uniform Pricing and Order Timing",
        bullets: [
          "A high school uniform set — jersey and pants — starts at $55.99 per player at our 10-piece minimum, sublimated in your school colors with numbers, names and logo.",
          "Varsity-sized orders are well past the minimum, so the per-player number is lower than the published starting price. Send your real roster count and we quote that tier rather than the minimum.",
          "one to two weeks production after you approve the design. Add a week for the design and proof stage, which is free and does not start the production clock.",
          "Order by May or June for a late-August Week 1. Programs that order in July are betting on nothing going wrong.",
          "JV and freshman squads on the same design cost less per player than a separate order and keep the whole program in one look.",
        ],
      },
    ],
    links: [
      {
        href: "/american-football-uniforms/",
        label: "full American football uniforms",
        note: "The base game kit, jersey and pants, in any school colors.",
      },
      {
        href: "/football-team-kits/",
        label: "complete team uniform kits",
        note: "Varsity, JV and staff in one coordinated order.",
      },
      {
        href: "/7-on-7-football-uniforms/",
        label: "7-on-7 football uniforms",
        note: "The summer kit the same varsity roster plays in.",
      },
      {
        href: "/coaches-apparel/",
        label: "custom coaches uniforms",
        note: "Staff polos, quarter-zips and jackets to the same color standard.",
      },
    ],
    faqs: [
      {
        question: "How much do high school football uniforms cost in Texas?",
        answer:
          "A high school uniform set — jersey and pants — starts at $55.99 per player at our 10-piece minimum, sublimated in your school colors with numbers, names and logo. A varsity roster is well past the minimum, so the per-player number comes in lower; send your real count and we quote that tier.",
      },
      {
        question: "When should a UIL program order uniforms for the coming season?",
        answer:
          "May or June for a late-August Week 1. Production is one to two weeks after you approve the design, the free design and proof stage sits in front of that, and uniforms need to be on campus before players report for the August two-a-day window. District realignment years are the natural moment to redesign.",
      },
      {
        question: "Can JV and freshman squads have the same design as varsity?",
        answer:
          "Yes, and it is cheaper than ordering separately because the design setup is paid once. Most programs run the same design across all three tiers and give the lower squads a lighter package — jersey and pants only — so the whole program looks the same without tripling the budget.",
      },
      {
        question: "Does the away jersey have to contrast with opponents?",
        answer:
          "It has to be clearly distinguishable in play, which is why district realignment is the right time to check it. When you send your district schedule we will flag any opponent whose colors sit close to your away look before the design is approved.",
      },
      {
        question: "What sizes do you make for a high school roster?",
        answer:
          "Youth XS through adult 5XL on the same order, which covers a freshman corner and a senior tackle in one job. Mixed sizes count toward the same minimum, and a loaner sizing kit is available before you commit the run.",
      },
    ],
  },

  // Position 78-95: effectively invisible. The page needed content about the
  // sport rather than about uniforms in general.
  "7-on-7-football-uniforms": {
    lead: "7on7 is a different sport from Friday nights — no pads, no linemen, four games in a day in Texas summer heat — and the kit has to be built for it.",
    blocks: [
      {
        kind: "prose",
        heading: "Why 7v7 Uniforms Are Built Differently",
        paragraphs: [
          "Seven-on-seven football strips out the line of scrimmage. There are no pads, no helmets in most formats, no linemen and no running game to speak of — it is quarterbacks, receivers, backs and defensive backs playing a passing game in shorts. The uniform has nothing to sit over and nothing to protect.",
          "That changes the garment completely. A game jersey is cut wide through the shoulder and chest to clear pads; worn without them it hangs like a tent and gets grabbed on every route. A 7v7 jersey is cut close to the body, shorter in the sleeve, and in a fabric light enough to matter at 2pm in July.",
          "Compression-fit tops are the common choice for skill players who do not want cloth to grab. We build 7v7 kits in a 4-way stretch knit for teams that want a true compression fit, and in a lightweight birdseye for teams that want airflow over closeness. Both are sublimated, because a heat-pressed number will not survive a summer of daily washing.",
        ],
      },
      {
        kind: "prose",
        heading: "The Texas 7on7 State Series Season",
        paragraphs: [
          "Texas runs the most organized 7on7 structure in the country. Qualifying tournaments run through May and June across the state, and the teams that come through them reach the state tournament in College Station at the end of June — a format that has been the summer center of Texas high school football for decades.",
          "The season shape matters for ordering. Qualifiers start in May, which means a team deciding in April is already tight against a two-to-three-week production window plus artwork approval. Teams that plan the 7v7 kit in the same conversation as the fall uniform order — in the spring — get both on time and pay one design setup.",
          "Rosters are small. A 7on7 squad usually carries 14 to 18 players rather than a full varsity sixty, which clears our 10-piece minimum comfortably and keeps the total inside what a booster club or a group of parents can fund without a school budget line.",
          "Tournaments also draw college coaches, which is the practical reason the kit matters. A 7on7 weekend is where recruiters see players outside the season, and a squad in a coherent, readable kit with clean numbers is easier to evaluate on film than one in mismatched practice tops.",
        ],
      },
      {
        kind: "bullets",
        heading: "What a 7-on-7 Kit Usually Contains",
        bullets: [
          "Two jersey colors, or one reversible jersey covering both — tournament pool play pairs you against colors you did not know the night before.",
          "Matching shorts, since there are no game pants in this format and mismatched shorts are what makes a 7v7 team look thrown together on film.",
          "Large, high-contrast numbers front and back. College coaches are identifying players from the sideline at distance, and this is the one place number size is not a style choice.",
          "Team socks in the colorway, which photograph more than anyone expects in a shorts-and-jersey format.",
          "A lightweight sideline layer for early-morning pool play, which starts cooler than the afternoon it finishes in.",
        ],
      },
      {
        kind: "prose",
        heading: "7v7 Uniform Pricing",
        paragraphs: [
          "A 7-on-7 uniform set starts at $50.99 per player at our 10-piece minimum — jersey and shorts, fully sublimated in your colors with numbers front and back. A reversible jersey covering both tournament colors starts at $66.99 on its own.",
          "A 16-player 7v7 roster is comfortably over the minimum, so the per-player number lands below the published starting price. Send the real squad count and we quote that tier.",
          "one to two weeks after you approve the design, with a free mockup within 24 hours of your request. Working back from a May qualifier, that puts the decision in March or April.",
        ],
      },
    ],
    links: [
      {
        href: "/lightweight-football-jerseys/",
        label: "lightweight football jerseys",
        note: "The summer-weight jersey most 7v7 squads order.",
      },
      {
        href: "/reversible-football-jerseys/",
        label: "reversible football jerseys",
        note: "Both tournament colors in one jersey.",
      },
      {
        href: "/football-shorts/",
        label: "custom football shorts",
        note: "Matching shorts, since there are no game pants in this format.",
      },
      {
        href: "/high-school-football-uniforms/",
        label: "high school football uniforms",
        note: "The fall kit the same roster wears in August.",
      },
    ],
    faqs: [
      {
        question: "How much do 7-on-7 football uniforms cost?",
        answer:
          "A 7-on-7 uniform set starts at $50.99 per player at our 10-piece minimum — jersey and shorts, fully sublimated with numbers front and back. A reversible jersey covering both tournament colors starts at $66.99. A typical 16-player squad is past the minimum, so the per-player number comes in lower.",
      },
      {
        question: "How is a 7v7 jersey different from a regular football jersey?",
        answer:
          "There are no pads in 7v7, so the jersey has nothing to sit over. A game jersey cut wide for shoulder pads hangs loose and gets grabbed on routes. A 7v7 jersey is cut close to the body, shorter in the sleeve, and made in a lighter fabric — either 4-way stretch for a compression fit or lightweight birdseye for airflow.",
      },
      {
        question: "When should a Texas 7on7 team order its uniforms?",
        answer:
          "March or April. Qualifying tournaments run through May and June with the state tournament at the end of June, and production is one to two weeks after design sign-off with the free proof stage in front of it. Teams that plan the 7v7 kit alongside the fall order in spring pay one design setup for both.",
      },
      {
        question: "Do we need two jersey colors for tournament play?",
        answer:
          "Pool play pairs you against opponents drawn shortly beforehand, so yes in practice. Two jerseys per player or one reversible both solve it; price both before deciding, because a reversible is usually the cheaper route once you count two single-color jerseys.",
      },
      {
        question: "What is the minimum order for a 7v7 squad?",
        answer:
          "Ten per design, mixed sizes counted together. Most 7on7 squads carry 14 to 18 players, so the minimum is not a constraint — it just sets the highest price tier, and your real count sets a lower one.",
      },
    ],
  },

  "flag-football-uniforms": {
    lead: "Flag football is its own sport now — NFL Flag leagues, city rec divisions, girls' high school flag and an Olympic slot in 2028 — and the kit has to work around a flag belt.",
    blocks: [
      {
        kind: "prose",
        heading: "Uniforms Built Around the Flag Belt",
        paragraphs: [
          "The belt is the design constraint nobody thinks about until the first game. Flags hang from a belt at the waist, and anything that covers or interferes with them is a problem: a long jersey that hangs over the belt gets grabbed instead of a flag, and most league rules require jerseys to be tucked in or cut short for exactly that reason.",
          "We cut flag football jerseys shorter in the body than a tackle jersey and taper them so they stay tucked through a full game. Where a league requires tuck-in, the body is long enough to stay in; where a league allows an untucked cut, we shorten it so the hem sits above the belt line.",
          "There are no pads, so the jersey is cut to the body rather than over equipment, and the fabric is the lightest we make. Flag is played through Texas spring and fall in shorts and a jersey with nothing between the player and the sun.",
        ],
      },
      {
        kind: "prose",
        heading: "NFL Flag, Youth Leagues and Girls' Flag Football",
        paragraphs: [
          "NFL Flag is the largest organized flag program in the country and runs across Texas through city rec departments, YMCAs and independent operators. Those leagues typically issue an NFL-branded reversible and leave anything beyond it to the team, which is where custom team kits, coaches uniforms and sideline layers come in.",
          "Independent and church youth leagues order full custom kits more often, because they are not tied to a league-issued jersey. A youth flag order is usually jersey and shorts, sublimated, with large numbers and no nameplate — names are less useful at an age where rosters change weekly.",
          "Girls' flag football is the fastest-growing part of the sport and is now sanctioned as a UIL high school sport in Texas, which has moved it from rec-league ordering into school-program ordering: school colors, school logo, varsity and JV tiers, and the same seasonal timing pressure as any other school sport.",
        ],
      },
      {
        kind: "bullets",
        heading: "What Goes Into a Flag Football Order",
        bullets: [
          "Jersey cut to clear the belt — shorter body, tapered, in the league's required tuck or no-tuck style.",
          "Matching shorts without pockets. Pockets catch flags and fingers, and many leagues prohibit them outright.",
          "Large sublimated numbers front and back; nothing pressed on, because flag jerseys get pulled at constantly.",
          "Two colorways or a reversible for leagues that draw fixtures late, which most rec divisions do.",
          "Coaches uniforms and a sideline layer for programs that want the staff in the same look as the squad.",
        ],
      },
      {
        kind: "prose",
        heading: "Flag Football Uniform Pricing",
        paragraphs: [
          "A flag football uniform set — jersey and shorts, fully sublimated — starts at $49.99 per player at our 10-piece minimum. Jersey-only orders start at $32.99 per jersey for leagues that issue their own shorts.",
          "Flag rosters are small, often ten to fourteen players, which is exactly where our minimum sits. That is deliberate: a single flag team can order its own kit without needing the whole league to go in together.",
          "one to two weeks after you approve the design, free mockup within 24 hours. Spring flag seasons in Texas start early, so a February decision covers a March kickoff comfortably.",
        ],
      },
    ],
    links: [
      {
        href: "/flag-football-jerseys/",
        label: "custom flag football jerseys",
        note: "Jersey-only orders for leagues that issue shorts.",
      },
      {
        href: "/football-shorts/",
        label: "custom football shorts",
        note: "Pocketless shorts that will not catch a flag.",
      },
      {
        href: "/youth-football-uniforms/",
        label: "youth football uniforms",
        note: "For the tackle divisions in the same youth organization.",
      },
      {
        href: "/7-on-7-football-uniforms/",
        label: "7-on-7 football uniforms",
        note: "The other no-pads format, built on the same light fabrics.",
      },
    ],
    faqs: [
      {
        question: "How much do custom flag football uniforms cost?",
        answer:
          "A flag football uniform set — jersey and shorts, fully sublimated — starts at $49.99 per player at our 10-piece minimum. Jersey-only orders start at $32.99 per jersey for leagues that issue their own shorts.",
      },
      {
        question: "How is a flag football jersey cut differently?",
        answer:
          "Around the belt. Flags hang from a belt at the waist, so a jersey that covers them gets grabbed instead of a flag. We cut the body shorter and taper it so it stays tucked, and we match whichever tuck or no-tuck rule your league runs. There are no pads, so the jersey is cut to the body rather than over equipment.",
      },
      {
        question: "Do you make uniforms for girls' flag football?",
        answer:
          "Yes. Girls' flag is now a sanctioned UIL high school sport in Texas, and those programs order like any other school sport — school colors and logo, varsity and JV tiers, women's cuts across the size run. We build the same kit for rec and club girls' teams.",
      },
      {
        question: "Can a single flag team order, or does the whole league have to?",
        answer:
          "A single team can order. The 10-piece minimum is set where it is precisely so a ten-to-fourteen-player flag roster clears it on its own. A league ordering multiple teams off one recolored template still pays less per player, because the design setup is paid once.",
      },
      {
        question: "Should flag shorts have pockets?",
        answer:
          "No, and many leagues prohibit them. Pockets catch flags and fingers during a pull. Every set of flag shorts we make is pocketless for that reason.",
      },
    ],
  },
};

export function getMoneyPage(slug: string) {
  return moneyPages[slug];
}
