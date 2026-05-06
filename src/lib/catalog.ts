import fs from "fs";
import path from "path";

import { company, SITE_URL } from "@/lib/site";

type ProductBlueprint = {
  slug: string;
  folder: string;
  name: string;
  shortNiche: string;
  productFamily: "uniform" | "jersey" | "outerwear" | "accessory";
  featureFocus: [string, string, string, string];
  material: string;
  printing: string;
  sizes: string;
  moq: string;
  turnaround: string;
};

export type Product = ProductBlueprint & {
  images: string[];
  heroImage: string;
  shortDescription: string;
  faqs: { question: string; answer: string }[];
};

export const categoryGroups = [
  "Jerseys",
  "Uniforms",
  "Practice Gear",
  "Team Packages",
  "Team Apparel",
] as const;

export type CategoryGroup = (typeof categoryGroups)[number];

export type CategoryPage = {
  group: CategoryGroup;
  slug: string;
  title: string;
  description: string;
  intro: string;
};

export type CategoryLongSection = {
  heading: string;
  subheading?: string;
  paragraphs: {
    lead: string;
    link?: { href: string; label: string };
    tail?: string;
  }[];
};

export type CategoryFaq = {
  question: string;
  answer: string;
};

export type CategoryClosingContent = {
  heading: string;
  subheading?: string;
  paragraphs: string[];
};

export type CategoryBulletSection = {
  heading: string;
  bullets: string[];
};

export type CategoryComparison = {
  heading: string;
  rows: [string, string, string][];
};

const blueprints: ProductBlueprint[] = [
  {
    slug: "football-team-kits",
    folder: "football team kits",
    name: "Football Team Kits",
    shortNiche: "full roster packages",
    productFamily: "uniform",
    featureFocus: ["Full roster coordination", "Game-day durability", "Texas-ready color depth", "Coach-approved fit blocks"],
    material: "220gsm moisture-control polyester with stretch mesh panels",
    printing: "Full sublimation with tackle twill and heat-pressed options",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 sets",
    turnaround: "3 to 4 weeks after artwork approval",
  },
  {
    slug: "7-on-7-football-uniforms",
    folder: "7 on 7 football uniforms",
    name: "7 on 7 Football Uniforms",
    shortNiche: "speed-focused tournament uniforms",
    productFamily: "uniform",
    featureFocus: ["Lightweight airflow", "Fast-cut mobility", "Elite event branding", "Quick-turn production"],
    material: "Lightweight birdseye polyester with breathable side inserts",
    printing: "High-definition sublimation",
    sizes: "Youth XS to Adult 4XL",
    moq: "10 sets",
    turnaround: "2 to 3 weeks after final design sign-off",
  },
  {
    slug: "adult-football-jerseys",
    folder: "adult football jerseys",
    name: "Adult Football Jerseys",
    shortNiche: "adult program uniforms",
    productFamily: "jersey",
    featureFocus: ["Structured adult fit", "Bold number readability", "Practice-to-game versatility", "Premium stitch quality"],
    material: "Heavyweight polyester knit with mesh ventilation zones",
    printing: "Sublimation, screen print, or heat transfer",
    sizes: "Adult S to 5XL",
    moq: "10 jerseys",
    turnaround: "3 weeks after design approval",
  },
  {
    slug: "american-football-jerseys",
    folder: "american football jerseys",
    name: "American Football Jerseys",
    shortNiche: "program-ready football tops",
    productFamily: "jersey",
    featureFocus: ["Broadcast-clean graphics", "Flexible shoulder movement", "Multi-level team branding", "High wash resistance"],
    material: "Performance polyester with reinforced yoke panels",
    printing: "Sublimation with optional twill numbering",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 jerseys",
    turnaround: "3 to 4 weeks",
  },
  {
    slug: "american-football-uniforms",
    folder: "american football uniforms",
    name: "American Football Uniforms",
    shortNiche: "complete football uniform systems",
    productFamily: "uniform",
    featureFocus: ["End-to-end kit consistency", "High-contact durability", "Premium sideline presence", "Custom artwork support"],
    material: "220gsm polyester body with stretch mesh and double-needle seams",
    printing: "Full sublimation and embellishment-ready panels",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 sets",
    turnaround: "3 to 4 weeks",
  },
  {
    slug: "blank-football-jerseys",
    folder: "blank football jerseys",
    name: "Blank Football Jerseys",
    shortNiche: "stock-ready team bases",
    productFamily: "jersey",
    featureFocus: ["Clean blanks for custom branding", "Consistent color matching", "Bulk team readiness", "Comfortable game fit"],
    material: "Durable mesh polyester",
    printing: "Left blank or prepared for add-on decoration",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 jerseys",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "coaches-apparel",
    folder: "coaches apparel",
    name: "Coaches Apparel",
    shortNiche: "sideline staff gear",
    productFamily: "outerwear",
    featureFocus: ["Polished sideline identity", "Layer-friendly cuts", "Embroidery-ready placements", "Travel-day comfort"],
    material: "Performance knit and softshell blends",
    printing: "Embroidery, heat transfer, or sublimation",
    sizes: "Adult S to 4XL",
    moq: "10 pieces",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "college-football-uniforms",
    folder: "college football uniforms",
    name: "College Football Uniforms",
    shortNiche: "higher-level team sets",
    productFamily: "uniform",
    featureFocus: ["Recruiting-grade presentation", "Sharp typography", "Pro-style cut options", "Deep program customization"],
    material: "Premium 220gsm performance polyester with stretch paneling",
    printing: "Sublimation, tackle twill, and applique options",
    sizes: "Adult S to 5XL",
    moq: "15 sets",
    turnaround: "4 weeks",
  },
  {
    slug: "custom-name-football-jerseys",
    folder: "custom name football jerseys",
    name: "Custom Name Football Jerseys",
    shortNiche: "name-personalized team jerseys",
    productFamily: "jersey",
    featureFocus: ["Personalized roster names", "Balanced nameplate spacing", "Consistent numbering", "Tournament-ready finish"],
    material: "Breathable polyester mesh",
    printing: "Full sublimation with variable data names and numbers",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 jerseys",
    turnaround: "3 weeks",
  },
  {
    slug: "custom-number-football-jerseys",
    folder: "custom number football jerseys",
    name: "Custom Number Football Jerseys",
    shortNiche: "number-specific team jerseys",
    productFamily: "jersey",
    featureFocus: ["Large readable numbers", "Consistent front-back placement", "Durable print hold", "Fast re-order support"],
    material: "Performance mesh polyester",
    printing: "Sublimation and twill number options",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 jerseys",
    turnaround: "3 weeks",
  },
  {
    slug: "football-warm-up-suits",
    folder: "football warm up suits",
    name: "Football Warm Up Suits",
    shortNiche: "travel and pregame sets",
    productFamily: "outerwear",
    featureFocus: ["Travel-day polish", "Sideline warmth", "Stretch comfort", "Cohesive team presentation"],
    material: "Brushed tricot and performance fleece blends",
    printing: "Sublimation, embroidery, and heat transfer",
    sizes: "Youth XS to Adult 4XL",
    moq: "10 sets",
    turnaround: "3 weeks",
  },
  {
    slug: "custom-team-jerseys",
    folder: "custom team jerseys",
    name: "Custom Team Jerseys",
    shortNiche: "fully branded team jerseys",
    productFamily: "jersey",
    featureFocus: ["Unlimited color builds", "Team identity detail", "Player-specific customization", "Competition-ready fit"],
    material: "Moisture-wicking performance polyester",
    printing: "High-resolution sublimation",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 jerseys",
    turnaround: "3 weeks",
  },
  {
    slug: "fan-football-jerseys",
    folder: "fan football jerseys",
    name: "Fan Football Jerseys",
    shortNiche: "supporter and booster apparel",
    productFamily: "jersey",
    featureFocus: ["Retail-style finish", "Booster club personalization", "Comfort-first fit", "Event-ready graphics"],
    material: "Soft performance polyester",
    printing: "Sublimation and heat transfer",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 jerseys",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "flag-football-jerseys",
    folder: "flag football jerseys",
    name: "Flag Football Jerseys",
    shortNiche: "non-contact performance jerseys",
    productFamily: "jersey",
    featureFocus: ["Freedom of movement", "Light game weight", "Tournament personalization", "Breathable construction"],
    material: "Lightweight interlock polyester",
    printing: "Sublimation",
    sizes: "Youth XS to Adult 4XL",
    moq: "10 jerseys",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "flag-football-uniforms",
    folder: "flag football uniforms",
    name: "Flag Football Uniforms",
    shortNiche: "complete non-contact team kits",
    productFamily: "uniform",
    featureFocus: ["Speed-built silhouettes", "League-compliant styling", "Consistent team branding", "Comfort under heat"],
    material: "Breathable polyester with stretch side zones",
    printing: "Sublimation",
    sizes: "Youth XS to Adult 4XL",
    moq: "10 sets",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "football-gloves",
    folder: "football gloves",
    name: "Football Gloves",
    shortNiche: "team-branded grip accessories",
    productFamily: "accessory",
    featureFocus: ["Grip-focused performance", "Team color matching", "Flexible hand feel", "Practice and game use"],
    material: "Synthetic grip palm with stretch backhand",
    printing: "Heat transfer logos and color-matched accents",
    sizes: "Youth S to Adult XL",
    moq: "20 pairs",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "football-hoodies",
    folder: "football hoodies",
    name: "Football Hoodies",
    shortNiche: "team hoodie layering",
    productFamily: "outerwear",
    featureFocus: ["Off-field comfort", "Travel-day branding", "Layered warmth", "Premium retail finish"],
    material: "Midweight fleece and performance cotton blend",
    printing: "Screen print, embroidery, or sublimation panels",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 hoodies",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "football-practice-jerseys",
    folder: "football practice jerseys",
    name: "Football Practice Jerseys",
    shortNiche: "training and camp jerseys",
    productFamily: "jersey",
    featureFocus: ["Scrimmage-ready toughness", "Simple unit differentiation", "Comfort for repeated reps", "Easy roster management"],
    material: "Durable mesh practice polyester",
    printing: "Sublimation or heat transfer numbering",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 jerseys",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "football-shorts",
    folder: "football shorts",
    name: "Football Shorts",
    shortNiche: "training and travel bottoms",
    productFamily: "accessory",
    featureFocus: ["Lightweight mobility", "Coordinated team branding", "Elastic comfort", "Training-day durability"],
    material: "Breathable polyester with stretch waistband",
    printing: "Sublimation or heat transfer",
    sizes: "Youth XS to Adult 4XL",
    moq: "10 shorts",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "football-sideline-jackets",
    folder: "football sideline jackets",
    name: "Football Sideline Jackets",
    shortNiche: "weather-ready sideline layers",
    productFamily: "outerwear",
    featureFocus: ["Weather protection", "Commanding sideline look", "Travel-ready polish", "Program branding"],
    material: "Softshell outer with breathable lining",
    printing: "Embroidery and heat transfer",
    sizes: "Adult S to 5XL",
    moq: "10 jackets",
    turnaround: "3 weeks",
  },
  {
    slug: "high-school-football-uniforms",
    folder: "high school football uniforms",
    name: "High School Football Uniforms",
    shortNiche: "varsity and JV uniform programs",
    productFamily: "uniform",
    featureFocus: ["Friday-night presentation", "Roster-wide consistency", "District-ready durability", "Custom trim options"],
    material: "220gsm polyester with ventilated mesh zones",
    printing: "Sublimation with optional tackle twill",
    sizes: "Youth XS to Adult 5XL",
    moq: "15 sets",
    turnaround: "3 to 4 weeks",
  },
  {
    slug: "football-socks",
    folder: "football socks",
    name: "Football Socks",
    shortNiche: "uniform-matching legwear",
    productFamily: "accessory",
    featureFocus: ["Color-coordinated finish", "Compression support", "Comfort under pads", "Uniform-ready detail"],
    material: "Performance knit blend with compression zones",
    printing: "Knit-in color pattern and logo options",
    sizes: "Youth to Adult XL",
    moq: "20 pairs",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "lightweight-football-jerseys",
    folder: "lightweight football jerseys",
    name: "Lightweight Football Jerseys",
    shortNiche: "heat-conscious football jerseys",
    productFamily: "jersey",
    featureFocus: ["Breathability in heat", "Reduced bulk", "Fast-dry performance", "Tournament-ready style"],
    material: "Ultralight polyester mesh",
    printing: "Sublimation",
    sizes: "Youth XS to Adult 4XL",
    moq: "10 jerseys",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "padded-football-shirts",
    folder: "padded football shirts",
    name: "Padded Football Shirts",
    shortNiche: "integrated protection tops",
    productFamily: "accessory",
    featureFocus: ["Integrated padding support", "Compression fit", "Under-uniform comfort", "Practice and camp utility"],
    material: "Compression polyester-spandex with EVA pad zones",
    printing: "Heat transfer branding",
    sizes: "Youth XS to Adult 3XL",
    moq: "10 shirts",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "reversible-football-jerseys",
    folder: "reversible football jerseys",
    name: "Reversible Football Jerseys",
    shortNiche: "dual-color training jerseys",
    productFamily: "jersey",
    featureFocus: ["Two looks in one", "Scrimmage flexibility", "Distinct side colors", "Reliable print clarity"],
    material: "Double-layer breathable polyester",
    printing: "Sublimation on both sides",
    sizes: "Youth XS to Adult 4XL",
    moq: "10 jerseys",
    turnaround: "3 weeks",
  },
  {
    slug: "sublimated-football-jerseys",
    folder: "sublimated football jerseys",
    name: "Sublimated Football Jerseys",
    shortNiche: "full-color custom jerseys",
    productFamily: "jersey",
    featureFocus: ["Unlimited artwork detail", "Fade-resistant color", "No cracking graphics", "Premium finish quality"],
    material: "Performance polyester with mesh ventilation",
    printing: "All-over dye sublimation",
    sizes: "Youth XS to Adult 5XL",
    moq: "10 jerseys",
    turnaround: "3 weeks",
  },
  {
    slug: "youth-football-jerseys",
    folder: "youth football jerseys",
    name: "Youth Football Jerseys",
    shortNiche: "youth league jerseys",
    productFamily: "jersey",
    featureFocus: ["Age-appropriate fit", "Easy sizing guidance", "Bright readable graphics", "Parent-friendly durability"],
    material: "Soft performance polyester mesh",
    printing: "Sublimation and heat transfer",
    sizes: "Youth XS to Youth XL",
    moq: "10 jerseys",
    turnaround: "2 to 3 weeks",
  },
  {
    slug: "youth-football-uniforms",
    folder: "youth football uniforms",
    name: "Youth Football Uniforms",
    shortNiche: "full youth team packages",
    productFamily: "uniform",
    featureFocus: ["League-ready construction", "Comfort for young athletes", "Coach-friendly ordering", "Bright team identity"],
    material: "Performance polyester with soft hand and stretch inserts",
    printing: "Sublimation with roster personalization",
    sizes: "Youth XS to Youth XL",
    moq: "10 sets",
    turnaround: "2 to 3 weeks",
  },
];

function getImagePaths(folder: string) {
  const assetDir = path.join(process.cwd(), "public", "assets", folder);
  return fs
    .readdirSync(assetDir)
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10))
    .map((file) => `/assets/${folder}/${file}`);
}

function truncateAtWord(input: string, limit: number, min = limit - 4) {
  if (input.length <= limit) {
    return input;
  }

  let cut = input.lastIndexOf(" ", limit);
  if (cut < min) {
    cut = limit;
  }

  return `${input.slice(0, cut).trimEnd()}`;
}

function buildShortDescription(product: ProductBlueprint) {
  return `Our custom ${product.name.toLowerCase()} are built for Texas programs that need premium presentation, dependable fit, and fast coordination across the roster. Each order is produced around your colors, logos, numbers, and player details so coaches can outfit athletes with a polished look that feels game ready from the first fitting. We focus on durable fabrics, breathable construction, and production support that keeps high school, youth, club, and tournament teams moving without the confusion of off-the-shelf sizing or generic stock gear. If your staff needs ${product.shortNiche} that look sharp under stadium lights and hold up through a full season, this collection is designed to make quoting, artwork approval, and reorders far easier.`;
}

function getRelatedProducts(slug: string) {
  const index = blueprints.findIndex((item) => item.slug === slug);
  return blueprints
    .filter((item) => item.slug !== slug)
    .slice(index % (blueprints.length - 4), (index % (blueprints.length - 4)) + 4);
}

function getLinkTarget(product: ProductBlueprint, offset: number) {
  const related = getRelatedProducts(product.slug);
  const item = related[offset % related.length];
  return { href: `/${item.slug}/`, label: item.name.toLowerCase() };
}

export type LongSection = {
  heading: string;
  subheading?: string;
  paragraphs: {
    lead: string;
    link?: { href: string; label: string };
    tail?: string;
  }[];
};

export function getLongSections(product: ProductBlueprint): LongSection[] {
  const linkA = getLinkTarget(product, 0);
  const linkB = getLinkTarget(product, 1);
  const linkC = getLinkTarget(product, 2);
  const linkD = getLinkTarget(product, 3);

  return [
    {
      heading: `Why ${product.name} Matter for Competitive Texas Programs`,
      paragraphs: [
        {
          lead: `Texas football programs are judged before kickoff, and the first signal a team sends is the quality of its gear. Premium ${product.name.toLowerCase()} tell athletes, parents, and boosters that the staff values preparation, consistency, and performance standards. That matters whether you are organizing a youth league, a Friday-night varsity roster, or a high-travel 7-on-7 group. Our production process focuses on the details that separate polished uniforms from commodity apparel: clean seam work, stable color reproduction, dependable roster personalization, and silhouettes that look sharp in photos, on the sideline, and under stadium lights. Coaches also need ordering support that fits the rhythm of a season, because replacing a missing number or adding a late transfer cannot turn into a long operational headache.`,
          link: linkA,
          tail: `help programs build that continuity without sacrificing the premium look athletes expect.`,
        },
      ],
    },
    {
      heading: "Built Around Fit, Movement, and Climate",
      subheading: "Performance comes from pattern work as much as fabric selection.",
      paragraphs: [
        {
          lead: `A football uniform has to move correctly long before it has to look good in photos. That is why our builds start with the way athletes cut, sprint, rotate, and absorb contact across Texas conditions. Breathability, stretch placement, and fabric weight all affect whether a jersey feels balanced through four quarters or starts to drag once temperatures climb. Programs ordering ${product.name.toLowerCase()} usually need a fit profile that works across multiple body types while still creating a cohesive team silhouette. We emphasize moisture management, reliable recovery after washing, and graphics that stay locked into the fabric instead of cracking or peeling. When a staff also wants a broader package that includes matching tops, warmups, or backups,`,
          link: linkB,
          tail: `show how a coordinated system can preserve the same visual standards across every unit.`,
        },
        {
          lead: `Fit is also a communication issue for coaches because sizing confusion slows approvals and creates avoidable rework. Clear measurements, usable size ranges, and construction choices that make sense for youth, school, and club programs reduce those problems early. The result is a product that feels easier to order and easier to re-order, not just one that photographs well on launch day.`,
        },
      ],
    },
    {
      heading: "Design Customization That Supports Team Identity",
      subheading: "Premium does not mean loud. It means intentional.",
      paragraphs: [
        {
          lead: `The best custom football apparel carries a strong identity without looking cluttered. We help programs organize color placement, number hierarchy, shoulder details, sleeve treatments, and logo positioning so the final result feels disciplined and premium rather than overloaded. That is especially important when a team wants sponsor marks, booster branding, memorial patches, or multi-level roster personalization. Our approach is to keep every decision tied to readability, distance visibility, and how the kit presents as a full unit from sideline to huddle. Because these details must hold up across every jersey in the order, our artwork process is built around repeatability and approval clarity instead of guesswork.`,
          link: linkC,
          tail: `are a useful benchmark when a program wants saturated graphics and fade-resistant color across the entire garment.`,
        },
        {
          lead: `We also keep the sales process quote focused. Staffs can specify colors, trim ideas, numbers, names, and volume targets without being forced into generic retail pricing tables that ignore roster complexity. That makes premium customization far more realistic for schools and clubs planning around season timelines rather than impulse online checkout behavior.`,
        },
      ],
    },
    {
      heading: "Operational Value for Coaches, Athletic Directors, and Program Managers",
      paragraphs: [
        {
          lead: `Uniform buying is rarely a one-time event. Rosters change, youth programs add age divisions, and booster-driven fan demand creates follow-on requests after the main order is already in motion. A premium supplier needs to make those realities manageable. We structure ${product.name.toLowerCase()} for repeatability, which means the original art files, approved placements, and production notes are organized with reorders in mind. That discipline helps reduce color drift, number inconsistency, and mismatched trims that can show up when programs bounce between vendors. It also makes communication easier when an equipment manager needs to explain what changed between the first run and the add-on order.`,
          link: linkD,
          tail: `can be valuable for programs that also want branded sideline layers and travel presentation to match their on-field gear.`,
        },
        {
          lead: `For athletic departments, the larger value is predictability. Knowing the likely material, production method, minimums, and turnaround window gives decision-makers a cleaner way to plan calendars, collect player information, and keep boosters informed. Premium service is not only about the finished look; it is about reducing friction in the ordering cycle.`,
        },
      ],
    },
    {
      heading: `How ${product.name} Elevate Recruiting, Branding, and Team Confidence`,
      paragraphs: [
        {
          lead: `Athletes notice uniform quality immediately. Clean numbering, well-balanced color blocking, and fabrics that feel intentionally chosen all shape how players view the program behind the order. That psychological value matters in recruiting environments, booster presentations, media day photography, and sponsor outreach because strong visuals reinforce the idea that the program is organized and ambitious. Premium ${product.name.toLowerCase()} also help coaches create consistency across varsity, JV, youth feeders, and offseason events, which strengthens brand recognition throughout the year. When the gear reflects a deliberate system instead of a collection of unrelated items, the program looks more stable and more investable to families and supporters.`,
        },
        {
          lead: `That same consistency improves digital performance. Teams now live on social media, livestreams, and recruiting graphics, so uniforms have to read well on screens as much as in person. Thoughtful contrast, crisp decoration, and stable material performance keep the visual identity strong across every channel where athletes are being seen.`,
        },
      ],
    },
    {
      heading: "Ordering Strategy and Turnaround Planning",
      subheading: "Better results come from better timing.",
      paragraphs: [
        {
          lead: `The fastest way to create avoidable stress is to start a custom apparel order after final roster pressure has already arrived. Premium programs usually move earlier: they define their look, confirm player counts, map position-group sizing, and leave enough time for approval revisions before production. We encourage teams ordering ${product.name.toLowerCase()} to treat the quote stage as a planning tool rather than just a price check. Once artwork, quantities, and fit requirements are clarified, the production window becomes far more dependable. That matters when coaches are balancing summer camps, preseason travel, picture day, and booster expectations all at once.`,
        },
        {
          lead: `A smart ordering strategy also leaves room for complementary pieces. Many programs want practice options, sideline layers, and alternate looks that extend the same visual language without forcing a complete redesign later. By building those possibilities into the original conversation, teams avoid fragmented apparel decisions and keep their brand cleaner over time.`,
        },
      ],
    },
    {
      heading: `Why Teams Request Quotes for ${product.name} From a Texas-Focused Supplier`,
      paragraphs: [
        {
          lead: `Programs searching for custom football gear in Texas are not just buying apparel; they are buying confidence in the process. They need a supplier that understands local urgency, climate realities, competitive presentation, and the importance of looking premium at every touchpoint from tryouts to championship photos. Our quote-first model keeps the conversation focused on roster needs, customization scope, timelines, and support instead of generic ecommerce pricing logic. That is how schools, clubs, and organizers can compare options based on real production value. If your team needs ${product.name.toLowerCase()} that balance performance, polish, and operational clarity, this collection is built to support that standard from concept through delivery.`,
        },
      ],
    },
  ];
}

function buildFaqs(product: ProductBlueprint) {
  return [
    {
      question: `Can I fully customize ${product.name.toLowerCase()} with our team colors and logo?`,
      answer: `Yes. Every quote is built around your color palette, logo placement, numbers, and player details so the final ${product.name.toLowerCase()} match your program identity instead of a stock template.`,
    },
    {
      question: `What is the minimum order for ${product.name.toLowerCase()}?`,
      answer: `The standard minimum is ${product.moq}. If your order structure is unusual, we can review it during the quote process and recommend the cleanest production path.`,
    },
    {
      question: `What sizes are available?`,
      answer: `This product is available in ${product.sizes}. We help teams align roster measurements with the right size breakdown before production begins.`,
    },
    {
      question: `How long does production take?`,
      answer: `Typical turnaround is ${product.turnaround}. Final timing depends on artwork approval, roster complexity, and whether names or alternate versions are included.`,
    },
    {
      question: `Can you match existing team branding?`,
      answer: `Yes. If you already have team colors, previous artwork, or an established uniform direction, we can build the new order around those standards to keep your branding consistent.`,
    },
    {
      question: `Are player names and numbers included in the customization process?`,
      answer: `Yes. We can personalize player names and numbers as part of the artwork and approval workflow so the entire roster is organized before production starts.`,
    },
    {
      question: `What decoration method is used for this product?`,
      answer: `The recommended method for this product is ${product.printing}. We will confirm the best option based on your design complexity and intended use.`,
    },
    {
      question: `Do you work with youth, school, and club football programs in Texas?`,
      answer: `Yes. We support youth leagues, school teams, club programs, booster groups, and event organizers looking for premium custom football apparel across Texas.`,
    },
    {
      question: `Can I reorder later for new players or replacements?`,
      answer: `Yes. Keeping your approved artwork and production details organized makes future add-on orders much easier, especially when late roster changes happen during the season.`,
    },
    {
      question: `How do I get a quote for ${product.name.toLowerCase()}?`,
      answer: `Use any Get a Quote call to action on the site, call ${company.phoneDisplay}, or email ${company.email}. We will review your quantities, timeline, and customization needs.`,
    },
  ];
}

export function getAllProducts(): Product[] {
  return blueprints.map((blueprint) => {
    const images = getImagePaths(blueprint.folder);

    return {
      ...blueprint,
      images,
      heroImage: images[0],
      shortDescription: buildShortDescription(blueprint),
      faqs: buildFaqs(blueprint),
    };
  });
}

export function getCategoryGroup(product: Pick<Product, "slug" | "productFamily" | "name">): CategoryGroup {
  if (product.slug === "football-team-kits") {
    return "Team Packages";
  }

  if (
    [
      "football-practice-jerseys",
      "padded-football-shirts",
      "football-gloves",
      "football-socks",
      "football-shorts",
    ].includes(product.slug)
  ) {
    return "Practice Gear";
  }

  if (
    [
      "football-hoodies",
      "football-warm-up-suits",
      "football-sideline-jackets",
      "coaches-apparel",
    ].includes(product.slug)
  ) {
    return "Team Apparel";
  }

  if (product.productFamily === "uniform") {
    return "Uniforms";
  }

  return "Jerseys";
}

export function getProductsByCategoryGroup() {
  const products = getAllProducts();

  return categoryGroups.map((group) => ({
    group,
    products: products.filter((product) => getCategoryGroup(product) === group),
  }));
}

export function getCategorySlug(group: CategoryGroup) {
  return group.toLowerCase().replace(/\s+/g, "-");
}

export function getCategoryBySlug(slug: string): CategoryPage | undefined {
  return getCategoryPages().find((category) => category.slug === slug);
}

export function getCategoryPages(): CategoryPage[] {
  return categoryGroups.map((group) => {
    const slug = getCategorySlug(group);

    const categoryContent: Record<CategoryGroup, Omit<CategoryPage, "group" | "slug">> = {
      Jerseys: {
        title: "Custom Football Jerseys",
        description:
          "Explore custom football jerseys in Texas, including youth, adult, reversible, sublimated, fan, and personalized team jersey options.",
        intro:
          "Custom football jerseys in Texas help teams build identity, improve player recognition, and create a more consistent look across the season. This category brings together premium jersey styles for Texas schools, clubs, and football programs that want sharper branding, better personalization, and roster-ready ordering support.",
      },
      Uniforms: {
        title: "Custom Football Uniforms",
        description:
          "Browse custom football uniforms in Texas for youth leagues, high schools, clubs, and 7-on-7 teams with quote-based ordering.",
        intro:
          "Custom football uniforms in Texas do more than outfit a roster. They shape how Texas teams, schools, and clubs present themselves on game day, in photos, and across the season. This category focuses on full game-ready systems built for performance, coordinated branding, and premium presentation across the roster.",
      },
      "Practice Gear": {
        title: "Football Practice Gear",
        description:
          "Shop football practice gear in Texas, including practice jerseys, padded shirts, gloves, socks, and shorts for training-day performance.",
        intro:
          "Football practice gear in Texas needs to support long sessions, hot weather, and repeated use without losing comfort or team identity. This category is designed for Texas football teams that need training-day apparel and accessories to match the same standards as their game gear.",
      },
      "Team Packages": {
        title: "Football Team Packages",
        description:
          "Discover football team packages in Texas with coordinated custom kit solutions for programs that need a complete roster-ready setup.",
        intro:
          "Football team packages in Texas give programs a cleaner way to organize large apparel orders without piecing products together one at a time. This category is built for Texas schools, clubs, and football programs that want one coordinated solution instead of multiple disconnected vendor decisions.",
      },
      "Team Apparel": {
        title: "Football Team Apparel",
        description:
          "Browse football team apparel in Texas, including hoodies, coaches apparel, warm-up suits, and sideline jackets for complete program branding.",
        intro:
          "Football team apparel in Texas helps programs extend their identity beyond the field. This category covers off-field and sideline essentials for Texas teams that want travel, coaching, and support apparel to look as premium as the uniforms themselves.",
      },
    };

    return {
      group,
      slug,
      ...categoryContent[group],
    };
  });
}

export function getCategoryMetaTitle(category: CategoryPage) {
  const titles: Record<CategoryGroup, string> = {
    Jerseys: "Custom Football Jerseys Texas | Premium Team Quote Support",
    Uniforms: "Custom Football Uniforms Texas | Premium Team Quote Help",
    "Practice Gear": "Football Practice Gear Texas | Premium Team Quote Help",
    "Team Packages": "Football Team Packages Texas | Premium Quote Support",
    "Team Apparel": "Football Team Apparel Texas | Premium Quote Support",
  };

  return titles[category.group];
}

export function getCategoryMetaDescription(category: CategoryPage) {
  const descriptions: Record<CategoryGroup, string> = {
    Jerseys:
      "Shop custom football jerseys in Texas with premium fabrics, roster personalization, and quote-based support for schools, clubs, and teams.",
    Uniforms:
      "Explore custom football uniforms in Texas with premium builds, full team personalization, and quote-based ordering for schools and clubs.",
    "Practice Gear":
      "Browse football practice gear in Texas with premium training apparel, team branding options, and quote-based support for organized programs.",
    "Team Packages":
      "Discover football team packages in Texas with coordinated uniforms, roster-ready planning, and premium quote support for competitive programs.",
    "Team Apparel":
      "Shop football team apparel in Texas with premium sideline layers, travel gear, and quote-based customization for schools and clubs.",
  };

  return descriptions[category.group];
}

export function getCategorySpecs(category: CategoryPage) {
  const specs: Record<CategoryGroup, [string, string][]> = {
    Jerseys: [
      ["Fabric options", "Birdseye mesh, lightweight interlock, and premium performance polyester"],
      ["Size range", "Youth XS through Adult 5XL depending on jersey style"],
      ["Customization method", "Sublimation, variable names and numbers, and optional twill details"],
      ["Design support", "Free layout guidance for colors, names, number hierarchy, and logo placement"],
      ["Order type", "Single-style team runs, player-specific roster orders, and repeat add-on orders"],
      ["Turnaround", "Usually 2 to 4 weeks after final artwork approval"],
      ["Shipping coverage", "Delivered across Texas for school, club, and event programs"],
    ],
    Uniforms: [
      ["Fabric options", "220gsm game-weight polyester, stretch mesh, and ventilated panel builds"],
      ["Size range", "Youth XS through Adult 5XL depending on the uniform package"],
      ["Customization method", "Full sublimation, player personalization, and optional tackle twill upgrades"],
      ["Design support", "Uniform layout help for numbers, trim, shoulder details, and team identity systems"],
      ["Order type", "Full roster sets, school-issued team programs, and seasonal replacement runs"],
      ["Turnaround", "Usually 3 to 4 weeks after final design sign-off"],
      ["Shipping coverage", "Texas-wide delivery coordination for schools, clubs, and camps"],
    ],
    "Practice Gear": [
      ["Fabric options", "Breathable mesh, compression blends, grip materials, and knit accessory fabrics"],
      ["Size range", "Youth XS through Adult XL or 5XL depending on the product type"],
      ["Customization method", "Sublimation, heat transfer, knit-in detailing, and training-use personalization"],
      ["Design support", "Guidance for matching practice items to your program’s primary team identity"],
      ["Order type", "Training packs, coach-issued gear runs, and roster-sized repeat orders"],
      ["Turnaround", "Usually 2 to 3 weeks after approval"],
      ["Shipping coverage", "Delivery support for football programs across Texas"],
    ],
    "Team Packages": [
      ["Fabric options", "Game-weight performance polyester with coordinated matching fabric programs"],
      ["Size range", "Youth XS through Adult 5XL across full roster package builds"],
      ["Customization method", "Full package design alignment with names, numbers, and coordinated graphics"],
      ["Design support", "Program-level planning for uniforms, supporting pieces, and roster consistency"],
      ["Order type", "Complete roster packages and multi-item team ordering"],
      ["Turnaround", "Usually 3 to 4 weeks after final package approval"],
      ["Shipping coverage", "Texas delivery scheduling for team, school, and club orders"],
    ],
    "Team Apparel": [
      ["Fabric options", "Fleece, tricot, softshell, and performance knit apparel options"],
      ["Size range", "Youth XS through Adult 5XL depending on outerwear style"],
      ["Customization method", "Embroidery, sublimation panels, heat transfer, and coordinated apparel branding"],
      ["Design support", "Sideline and travel gear planning that aligns with your on-field look"],
      ["Order type", "Staff apparel runs, team travel sets, and booster-supported add-on orders"],
      ["Turnaround", "Usually 2 to 3 weeks after final approval"],
      ["Shipping coverage", "Delivered across Texas for programs needing full apparel coordination"],
    ],
  };

  return specs[category.group];
}

export function getCategoryOrderSteps(category: CategoryPage) {
  return [
    {
      title: "Choose your uniform style",
      text: `Select the ${category.group.toLowerCase()} products that best match your team goals, roster structure, and season timeline.`,
    },
    {
      title: "Share logo, colors, and player details",
      text: "Send your branding direction, personalization needs, and any sizing notes so the project is organized correctly from the start.",
    },
    {
      title: "Review digital mockup",
      text: "We help shape the visual layout into a premium presentation that feels clear, readable, and consistent for the whole program.",
    },
    {
      title: "Approve production",
      text: "Once the design and roster information are locked, the order moves forward with cleaner production coordination.",
    },
    {
      title: "Receive delivery in Texas",
      text: "Finished apparel is prepared for Texas delivery with the goal of making season launch, reorders, and replacements easier to manage.",
    },
  ];
}

function getCategoryLinkMap() {
  return {
    Jerseys: [
      { slug: "adult-football-jerseys", label: "adult football jerseys" },
      { slug: "american-football-jerseys", label: "american football jerseys" },
      { slug: "blank-football-jerseys", label: "blank football jerseys" },
      { slug: "custom-name-football-jerseys", label: "custom name football jerseys for team branding" },
      { slug: "custom-number-football-jerseys", label: "custom number football jerseys for roster consistency" },
      { slug: "fan-football-jerseys", label: "fan football jerseys for booster support" },
      { slug: "flag-football-jerseys", label: "flag football jerseys for lighter play formats" },
      { slug: "lightweight-football-jerseys", label: "lightweight football jerseys for practice sessions" },
      { slug: "reversible-football-jerseys", label: "reversible football jerseys for scrimmage flexibility" },
      { slug: "sublimated-football-jerseys", label: "sublimated football jerseys for full-color designs" },
      { slug: "youth-football-jerseys", label: "youth football jerseys for developing programs" },
    ],
    Uniforms: [
      { slug: "7-on-7-football-uniforms", label: "7 on 7 football uniforms for speed-focused events" },
      { slug: "american-football-uniforms", label: "american football uniforms for complete team presentation" },
      { slug: "college-football-uniforms", label: "college football uniforms for higher-level program image" },
      { slug: "flag-football-uniforms", label: "flag football uniforms for non-contact leagues" },
      { slug: "high-school-football-uniforms", label: "high school football uniforms for Friday night programs" },
      { slug: "youth-football-uniforms", label: "youth football uniforms for feeder systems" },
    ],
    "Practice Gear": [
      { slug: "football-practice-jerseys", label: "football practice jerseys for repeated reps" },
      { slug: "padded-football-shirts", label: "padded football shirts for integrated protection" },
      { slug: "football-gloves", label: "football gloves for training grip support" },
      { slug: "football-socks", label: "football socks for matched uniform detail" },
      { slug: "football-shorts", label: "football shorts for off-pad movement sessions" },
    ],
    "Team Packages": [
      { slug: "football-team-kits", label: "football team kits for roster-wide coordination" },
      { slug: "custom-team-jerseys", label: "custom team jerseys for coordinated identity" },
      { slug: "american-football-uniforms", label: "american football uniforms for full package structure" },
      { slug: "high-school-football-uniforms", label: "high school football uniforms for complete season programs" },
    ],
    "Team Apparel": [
      { slug: "football-hoodies", label: "football hoodies for team travel comfort" },
      { slug: "football-warm-up-suits", label: "football warm up suits for coordinated pregame style" },
      { slug: "football-sideline-jackets", label: "football sideline jackets for weather-ready layering" },
      { slug: "coaches-apparel", label: "coaches apparel for sideline staff identity" },
      { slug: "fan-football-jerseys", label: "fan football jerseys for supporter apparel programs" },
    ],
  } as const;
}

function makeHref(slug: string) {
  return `/${slug}/`;
}

function getCategoryLink(
  links: ReadonlyArray<{ slug: string; label: string }>,
  index: number,
) {
  const item = links[index];

  if (!item) {
    throw new Error(`Missing category link at index ${index}`);
  }

  return item;
}

export function getCategoryLongSections(category: CategoryPage): CategoryLongSection[] {
  const links = getCategoryLinkMap()[category.group];
  const link = (index: number) => getCategoryLink(links, index);

  const content: Record<CategoryGroup, () => CategoryLongSection[]> = {
    Jerseys: () => [
      {
        heading: "Why Custom Football Jerseys Matter for Texas Programs",
        paragraphs: [
          {
            lead: "Jerseys often carry the strongest visual weight in a football program because they are the item athletes, families, and supporters notice first. In Texas, where football presentation is tied closely to school pride, recruiting energy, and booster perception, a well-built jersey can shape how organized a program feels long before kickoff. The right category choice depends on whether your team needs game-day polish, camp flexibility, fan support, or youth sizing clarity. A stronger jersey program should improve color consistency, number readability, roster personalization, and long-term reordering. Teams that want a structured adult look often begin with",
            link: { href: makeHref(link(0).slug), label: link(0).label },
            tail: "because they create a stable baseline for varsity, club, and travel programs that need a more mature silhouette.",
          },
          {
            lead: "Jersey buying also affects operations. Coaches need apparel that is easy to size, easy to approve, and easy to reorder when late roster updates happen. A premium category page should help buyers compare jersey directions based on how they will actually be used, not just how they look in a grid.",
          },
        ],
      },
      {
        heading: "Choosing the Right Jersey Construction",
        subheading: "Different formats demand different fabric behavior.",
        paragraphs: [
          {
            lead: "Not every football jersey solves the same problem. Some teams want the classic visual authority of heavier game tops, while others need lighter fabric for camps, hot-weather training, or speed-driven events. Breathability, recovery after washing, and how numbers hold their shape over time matter as much as color and artwork. Programs searching for broader traditional styling often compare",
            link: { href: makeHref(link(1).slug), label: link(1).label },
            tail: "against lighter builds so they can decide whether the priority is visual presence, movement, or a balance of both.",
          },
          {
            lead: "Buyer decisions also shift when the jersey must support multiple uses. Teams sometimes need one style for game presentation and a second style for practice, media day, or summer competition. When that happens, the category becomes less about one garment and more about building a practical jersey system.",
          },
        ],
      },
      {
        heading: "Branding, Personalization, and Roster Clarity",
        paragraphs: [
          {
            lead: "Personalization is usually where average jersey projects break down. Names, numbers, captain identifiers, and logo placements all need to stay balanced across the full roster, especially when sizes vary widely. Programs that want to strengthen player identity without losing layout discipline often move toward",
            link: { href: makeHref(link(3).slug), label: link(3).label },
            tail: "because those builds make naming structure part of the design process instead of an afterthought added at the end.",
          },
          {
            lead: "For teams prioritizing clean roster tracking, number management can matter even more than names. Large, readable numerals on the front, back, and sleeves help coaches, officials, and media teams work faster during fast-moving seasons. That is why many programs evaluate",
            link: { href: makeHref(link(4).slug), label: link(4).label },
            tail: "when they need consistency across every athlete in the order.",
          },
        ],
      },
      {
        heading: "Jersey Categories for Game Day, Practice, and Fanwear",
        paragraphs: [
          {
            lead: "A strong jersey plan usually includes more than one audience. Athletes need performance-focused gear, while booster groups and families may want a branded retail-style option that still feels connected to the team. When a program wants to extend its identity beyond the roster,",
            link: { href: makeHref(link(5).slug), label: link(5).label },
            tail: "can give supporters a cleaner way to participate without relying on unrelated off-the-shelf apparel.",
          },
          {
            lead: "The same logic applies to format-specific play. Teams and leagues operating in lighter, faster environments may benefit from",
            link: { href: makeHref(link(6).slug), label: link(6).label },
            tail: "because non-contact formats often need freer movement and simplified construction compared with traditional game jerseys.",
          },
          {
            lead: "Category planning works best when the buyer separates game inventory from support inventory. That usually means deciding which jerseys need maximum visual authority, which ones need lighter movement, and which pieces should be easier to reorder later without slowing the season down.",
          },
        ],
      },
      {
        heading: "How Texas Buyers Compare Modern Jersey Options",
        paragraphs: [
          {
            lead: "Texas programs increasingly compare jerseys based on climate, artwork, and repeat-use performance. Heat-conscious buyers often look at",
            link: { href: makeHref(link(7).slug), label: link(7).label },
            tail: "to reduce bulk during practice blocks and early-season sessions where comfort directly affects athlete focus.",
          },
          {
            lead: "If the priority is saturated artwork, cleaner fade resistance, and no cracking graphics over time, many buyers move toward",
            link: { href: makeHref(link(9).slug), label: link(9).label },
            tail: "to support a more premium finish and stronger visual control.",
          },
          {
            lead: "Some teams also compare reversible builds during planning because scrimmage efficiency can matter just as much as final appearance when the coaching staff is trying to simplify unit separation throughout the week.",
          },
        ],
      },
      {
        heading: "Planning for Youth and Program Growth",
        paragraphs: [
          {
            lead: "Category planning becomes even more important when a program includes feeder teams, younger divisions, or long-term growth targets. Sizing clarity, durability, and parent-friendly presentation all matter when multiple age groups are involved. Programs building those systems often review",
            link: { href: makeHref(link(10).slug), label: link(10).label },
            tail: "so the jersey direction still feels elevated while remaining practical for developing rosters and future add-on orders.",
          },
          {
            lead: "A better jersey category page should help buyers think beyond a single purchase. It should show how the product supports image, logistics, and repeatability across an entire football calendar in Texas.",
          },
        ],
      },
    ],
    Uniforms: () => [
      {
        heading: "Custom Football Uniforms as a Program-Level Decision",
        paragraphs: [
          {
            lead: "Uniforms shape the most complete version of a football program’s public identity. In Texas, where game-day atmosphere, school pride, and recruiting visuals matter at every level, the full uniform carries more weight than almost any other apparel decision. Buyers are not just choosing colors and cuts; they are choosing how the team will present under lights, in media graphics, and across a full season of roster changes. That is why a good category page needs to help schools and clubs compare full systems instead of isolated garments. Teams that need fast, movement-oriented builds for event play often begin by evaluating",
            link: { href: makeHref(link(0).slug), label: link(0).label },
            tail: "to see how a lighter, more agile structure performs when speed and heat management are top priorities.",
          },
          {
            lead: "The best uniform decisions also account for consistency across home, away, and alternate looks. A premium order should feel structured enough that future add-ons and replacement orders remain visually aligned.",
          },
        ],
      },
      {
        heading: "Balancing Performance, Durability, and Presentation",
        paragraphs: [
          {
            lead: "A Texas football uniform has to survive more than one visual test. It has to move correctly on the athlete, carry decoration cleanly, and stay reliable through repeated use, travel, and washing. When buyers compare options, they are really balancing game-day presence with practical durability. Programs wanting a classic full-kit direction often compare",
            link: { href: makeHref(link(1).slug), label: link(1).label },
            tail: "because those builds present a complete, traditional team image while still leaving room for customization and roster coordination.",
          },
          {
            lead: "Fabric weight, ventilation placement, and number visibility all matter here. Uniforms should feel intentional from sideline distance and still be comfortable enough to support performance through four quarters in Texas conditions.",
          },
        ],
      },
      {
        heading: "Uniform Buying for High School and College-Level Image",
        paragraphs: [
          {
            lead: "Some programs approach uniforms primarily through reputation and image. They need the final look to support recruiting visits, school branding, photography, and booster expectations just as much as athlete performance. Buyers in that position often examine",
            link: { href: makeHref(link(2).slug), label: link(2).label },
            tail: "to understand how a higher-level presentation can be translated into a custom build that still works for the actual roster and budget structure.",
          },
          {
            lead: "At the scholastic level, that same attention often drives interest in",
            link: { href: makeHref(link(4).slug), label: link(4).label },
            tail: "because Friday-night programs usually need a polished look that reinforces school identity across varsity, junior varsity, and future reorders.",
          },
        ],
      },
      {
        heading: "League Format and Athlete Age Matter",
        paragraphs: [
          {
            lead: "Uniform structure changes when the format changes. Non-contact leagues, youth divisions, and offseason tournament programs do not all need the same construction. For example, many organizers compare",
            link: { href: makeHref(link(3).slug), label: link(3).label },
            tail: "when they want lighter systems built around flexibility, league comfort, and easier movement without the demands of traditional contact wear.",
          },
          {
            lead: "Age matters too. Programs building feeder systems or community-based football organizations need uniforms that feel premium but remain easy to size and repeat. That is often where",
            link: { href: makeHref(link(5).slug), label: link(5).label },
            tail: "become a more practical choice for long-term continuity and parent-facing organization.",
          },
        ],
      },
      {
        heading: "What Buyers in Texas Need From a Uniform Supplier",
        paragraphs: [
          {
            lead: "Texas buyers usually need more than a good-looking mockup. They need a supplier that can organize artwork, personalization, sizes, and timelines without introducing confusion at the approval stage. Uniform orders touch more moving parts than standalone apparel, so communication and repeatability matter as much as design. A strong category page should therefore help the buyer compare use cases, not only styles. It should show which uniform direction suits camps, school seasons, youth programs, and event teams.",
          },
          {
            lead: "When the right category is chosen early, the rest of the process gets easier: digital approval is cleaner, production becomes more predictable, and reorder planning becomes much less disruptive later in the season.",
          },
          {
            lead: "That is especially valuable for Texas programs working around preseason calendars, photo-day deadlines, travel plans, and staff coordination. A good category page should reduce confusion before the first quote request is even sent.",
          },
        ],
      },
    ],
    "Practice Gear": () => [
      {
        heading: "Why Practice Gear Should Not Feel Like an Afterthought",
        paragraphs: [
          {
            lead: "Training apparel often gets treated like a utility purchase, but in organized Texas programs it plays a larger role than many buyers expect. Practice gear affects athlete comfort, staff efficiency, and how consistently the team brand appears outside formal game environments. When coaches issue practice pieces that feel disconnected from the main visual identity, the overall program starts to feel fragmented. Strong practice gear solves that problem by carrying enough structure, color discipline, and customization potential to support the same standards seen on game day. Programs comparing training tops usually begin with",
            link: { href: makeHref(link(0).slug), label: link(0).label },
            tail: "because they make it easier to assign units, organize repeated reps, and maintain readable athlete identification.",
          },
          {
            lead: "The category becomes especially important when camps, offseason work, and travel-heavy sessions demand equipment that can absorb constant use without looking disposable.",
          },
        ],
      },
      {
        heading: "Training Protection, Mobility, and Repetition",
        paragraphs: [
          {
            lead: "Practice environments create different physical demands than game-day uniforms. Repetition, pad integration, heat, and mobility tend to shape buying decisions more than visual drama. Teams that want integrated support for contact-heavy drills often evaluate",
            link: { href: makeHref(link(1).slug), label: link(1).label },
            tail: "because they give athletes an additional functional layer while helping coaches organize practice-day equipment more consistently.",
          },
          {
            lead: "Mobility also matters. Practice gear should reduce unnecessary bulk while still creating a disciplined team look that fits the seriousness of the session. That is particularly true during long summer blocks in Texas.",
          },
        ],
      },
      {
        heading: "Accessories That Support a Complete Practice Setup",
        paragraphs: [
          {
            lead: "The most effective practice category pages do not stop at tops. They help buyers think through how supporting items contribute to comfort and consistency across a full training schedule. Grip support, matched legwear, and movement-oriented bottoms all shape whether athletes feel prepared and whether coaches can maintain a clean standard. Buyers focused on hand performance and branded detail often compare",
            link: { href: makeHref(link(2).slug), label: link(2).label },
            tail: "when they want accessories that look coordinated instead of generic.",
          },
          {
            lead: "For teams trying to maintain a more unified head-to-toe setup,",
            link: { href: makeHref(link(3).slug), label: link(3).label },
            tail: "help complete the look while also supporting comfort and compression needs inside daily training routines.",
          },
        ],
      },
      {
        heading: "Movement, Heat, and Texas Practice Conditions",
        paragraphs: [
          {
            lead: "Texas practice blocks can be demanding, especially when sessions run across hot afternoons, camps, and repeated install periods. Training apparel therefore has to support movement and airflow without sacrificing function. That is why many buyers also look into",
            link: { href: makeHref(link(4).slug), label: link(4).label },
            tail: "for movement sessions, warm-weather work, and travel-friendly practice kits that do not feel restrictive.",
          },
          {
            lead: "The strongest programs treat practice apparel as a category worth planning, not improvising. When those pieces are selected carefully, the result is better comfort for athletes and better visual continuity for the full staff.",
          },
        ],
      },
      {
        heading: "How Buyers Use Practice Gear to Improve Organization",
        paragraphs: [
          {
            lead: "Practice gear can also solve administrative problems. Color-coded units, roster identification, repeat issue ordering, and camp-day athlete management all get easier when the category is selected with structure in mind. Training apparel should support how the staff works, not create another layer of sorting problems. Premium practice gear helps programs stay clear, consistent, and ready for the speed of real football operations in Texas.",
          },
          {
            lead: "That operational value is one reason these products deserve richer category content. Buyers need help comparing purpose, not just appearance, so the final purchase aligns with how the team actually trains.",
          },
          {
            lead: "When practice items are chosen intentionally, they support smoother drills, cleaner inventory tracking, and a more professional daily environment for both athletes and coaches.",
          },
        ],
      },
    ],
    "Team Packages": () => [
      {
        heading: "Why Team Packages Simplify Large Football Orders",
        paragraphs: [
          {
            lead: "Team packages exist for buyers who do not want to build a football apparel system piece by piece. For many Texas schools and clubs, that is the smarter path because it reduces the risk of mismatched trims, inconsistent personalization, and disconnected supplier communication. A package-based approach lets the staff think in terms of the whole program: how the roster will be outfitted, how alternates will be handled, and how repeat orders will stay aligned over time. Buyers starting from a true full-team perspective usually examine",
            link: { href: makeHref(link(0).slug), label: link(0).label },
            tail: "to understand how one coordinated solution can replace multiple disconnected apparel decisions.",
          },
          {
            lead: "The real value is not only visual polish. It is the reduction of friction across artwork approval, player data, and multi-item production planning.",
          },
        ],
      },
      {
        heading: "Coordinating Identity Across Multiple Pieces",
        paragraphs: [
          {
            lead: "A package category page should help buyers think about apparel as a system. Logos, numbers, trim colors, and roster rules need to translate consistently across the core jersey direction and the rest of the order. Many programs use",
            link: { href: makeHref(link(1).slug), label: link(1).label },
            tail: "as part of that structure because they allow the main team identity to stay consistent even when product use cases vary from event to event.",
          },
          {
            lead: "When those decisions are made inside a package mindset instead of one product at a time, the final result feels more intentional and easier to manage across the whole season.",
          },
        ],
      },
      {
        heading: "When Full Uniform Systems Make More Sense",
        paragraphs: [
          {
            lead: "Some buyers enter the package conversation because their current process has become too fragmented. Different rosters, multiple teams, and recurring add-ons create unnecessary complexity when the apparel system is not unified from the start. That is where",
            link: { href: makeHref(link(2).slug), label: link(2).label },
            tail: "often become part of the conversation, especially for programs that want a broader teamwear structure rather than isolated jersey ordering.",
          },
          {
            lead: "At the scholastic level, packages can be even more valuable because they support long-term continuity. Programs comparing",
            link: { href: makeHref(link(3).slug), label: link(3).label },
            tail: "often do so because they need a complete season-ready plan rather than a short-term apparel fix.",
          },
        ],
      },
      {
        heading: "Package Buying as an Operational Advantage",
        paragraphs: [
          {
            lead: "The operational upside of team packages is often underestimated. Organized ordering structures reduce mistakes, improve communication, and make reorders easier to document. Instead of treating every need as a separate transaction, the staff can work from one coordinated approval path. That is particularly useful in Texas, where football calendars move quickly and apparel decisions often intersect with camps, media days, preseason installs, and booster expectations all at once.",
          },
          {
            lead: "A better package page therefore needs deeper content, not a thin grid, because buyers need to understand how package thinking improves both the final look and the day-to-day logistics behind the order.",
          },
          {
            lead: "For many programs, the biggest gain is not only visual consistency but decision clarity. Team packages help administrators avoid fragmented approvals and keep large apparel orders moving with fewer handoff problems.",
          },
        ],
      },
    ],
    "Team Apparel": () => [
      {
        heading: "Why Team Apparel Extends Program Identity Beyond the Field",
        paragraphs: [
          {
            lead: "Football programs in Texas are evaluated in more places than the field alone. Travel days, sideline presence, staff appearance, and booster participation all contribute to how organized and premium a team feels. Team apparel gives programs the ability to extend their identity into those spaces without relying on generic stock gear that feels disconnected from the main uniform system. For many buyers, the category starts with comfort and branding, but it quickly becomes a broader conversation about consistency. Teams wanting relaxed travel and off-field layering often begin by comparing",
            link: { href: makeHref(link(0).slug), label: link(0).label },
            tail: "so they can balance retail-style comfort with team-ready presentation.",
          },
          {
            lead: "A well-built apparel plan turns travel, sideline, and support wear into part of the same visual story rather than a separate afterthought.",
          },
        ],
      },
      {
        heading: "Sideline, Travel, and Pregame Coordination",
        paragraphs: [
          {
            lead: "The strongest apparel programs usually separate needs by environment. Some pieces are meant for warmth and travel cohesion, while others are better for pregame movement or event presentation. Buyers who want coordinated pregame identity often review",
            link: { href: makeHref(link(1).slug), label: link(1).label },
            tail: "because matching sets make the team feel more disciplined from arrival through warmups.",
          },
          {
            lead: "Weather exposure also drives apparel decisions. Programs needing more protection and sideline structure often compare",
            link: { href: makeHref(link(2).slug), label: link(2).label },
            tail: "when they want an outer layer that still supports clean branding and travel polish.",
          },
        ],
      },
      {
        heading: "Staff Apparel and Coaching Presence",
        paragraphs: [
          {
            lead: "Team identity does not stop with athletes. Coaches, coordinators, and support staff also shape how professional a program appears. Consistent, well-branded apparel on the sideline can reinforce authority and create a more complete visual standard for everyone involved. That is why many schools and clubs include",
            link: { href: makeHref(link(3).slug), label: link(3).label },
            tail: "in their category planning, especially when they want coaching gear to feel aligned with the rest of the program instead of improvised.",
          },
          {
            lead: "This is especially useful for organizations managing multiple teams, age groups, or event staff under one visual identity system.",
          },
        ],
      },
      {
        heading: "Supporter Apparel and Broader Program Reach",
        paragraphs: [
          {
            lead: "Some apparel categories also intersect with booster engagement and supporter culture. When teams want an item that extends branding to families and fans without blurring the difference between roster gear and retail-style wear,",
            link: { href: makeHref(link(4).slug), label: link(4).label },
            tail: "can support that role while still keeping the overall visual language tied to the program.",
          },
          {
            lead: "This matters because football programs increasingly live across social media, sponsor touchpoints, travel environments, and event photography. Apparel that feels coherent in those settings helps the entire organization appear more stable and premium.",
          },
        ],
      },
      {
        heading: "What Texas Buyers Need From a Team Apparel Category Page",
        paragraphs: [
          {
            lead: "A useful apparel category page should help buyers compare purpose, layering, decoration methods, and order structure. It should not stop at naming the product type. Coaches and administrators need to understand which apparel pieces best fit travel, sideline, booster, and staff use cases. When the category is explained clearly, the final order becomes easier to plan and easier to expand later if the program adds another team, event, or support layer.",
          },
          {
            lead: "That is ultimately what makes the category valuable: it helps football programs in Texas build a cleaner identity in every environment where the team is seen, not only on the field.",
          },
          {
            lead: "When apparel decisions are handled with the same care as uniforms, the entire program looks more consistent, more organized, and more credible to families, athletes, and supporters.",
          },
        ],
      },
    ],
  };

  return content[category.group]();
}

export function getCategoryClosingContent(category: CategoryPage): CategoryClosingContent {
  const content: Record<CategoryGroup, CategoryClosingContent> = {
    Jerseys: {
      heading: "What Makes a Strong Jersey Category Page for Real Buyers",
      subheading: "The goal is clarity, not noise.",
      paragraphs: [
        "A useful jersey page should help coaches, athletic staff, and program managers compare fit, fabric behavior, personalization needs, and reorder practicality without turning every sentence into a sales pitch. The buyer usually wants a cleaner decision path, not more clutter.",
        "That means the best jersey category experience combines visual comparison with practical guidance. Programs should be able to understand which jersey direction fits game day, which one better supports practice or event use, and which options are likely to stay manageable when the roster changes later.",
        "For Texas teams, the strongest jersey decision is usually the one that balances heat management, graphic clarity, and long-term repeatability. When those pieces line up, the final order feels easier to approve and much more consistent once it reaches the field.",
      ],
    },
    Uniforms: {
      heading: "How Better Uniform Planning Improves the Season",
      subheading: "Uniform buying should reduce friction, not create it.",
      paragraphs: [
        "A complete uniform order touches more people than most apparel categories. Coaches, administrators, athletes, families, and equipment managers all feel the effect of whether the process was organized properly. That is why uniform content needs to guide planning, not just display products.",
        "The strongest category pages help buyers compare full-system needs such as game-day image, athlete comfort, personalization structure, and reorder stability. Those are the factors that often decide whether a program feels prepared or rushed when the season begins.",
        "For Texas football, uniforms are part of how the program is perceived in person and online. A cleaner category structure helps buyers move from inspiration into practical approval without sacrificing the premium image they want to project.",
      ],
    },
    "Practice Gear": {
      heading: "Why Practice Gear Still Deserves Premium Planning",
      subheading: "Training apparel influences both comfort and organization.",
      paragraphs: [
        "Practice gear affects the rhythm of the football week. If tops, accessories, and movement pieces are inconsistent, the result is usually more confusion for coaches and less comfort for athletes. That is why even supporting training products benefit from a more organized category experience.",
        "A useful practice gear page should explain how different items support drills, unit identification, climate comfort, and repeat ordering. Buyers need to know what each product solves, not only how it looks inside a card.",
        "When training apparel is treated like part of the full football system, teams get more value from every session. The category becomes easier to shop, easier to justify, and easier to maintain throughout the season.",
      ],
    },
    "Team Packages": {
      heading: "Why Team Packages Appeal to Organized Programs",
      subheading: "Packages are about structure as much as appearance.",
      paragraphs: [
        "A coordinated package often helps football programs avoid one of the most common apparel problems: making multiple disconnected decisions that never fully align. Buyers looking after a whole roster usually need one plan that keeps the order organized from the first mockup through the final delivery.",
        "The category should therefore explain how packages simplify approval, preserve visual consistency, and make later additions less disruptive. Those operational gains are often what matter most once the season starts moving quickly.",
        "In Texas, where football programs can have strong visibility and high expectations, package thinking gives teams a cleaner way to present themselves while also keeping staff workload more manageable behind the scenes.",
      ],
    },
    "Team Apparel": {
      heading: "How Team Apparel Strengthens the Full Program Image",
      subheading: "The sideline and travel look matter too.",
      paragraphs: [
        "Support apparel has a broader effect on program identity than many buyers expect. Coaches, athletes, and supporters are seen in many environments beyond the field, and those moments still shape how complete the football brand feels.",
        "A better category experience helps buyers decide which pieces belong in travel, which ones are better for coaches, and which options create the strongest bridge between on-field identity and off-field presentation.",
        "When team apparel is planned with the same discipline as uniforms and jerseys, the entire program benefits. The result is a more polished image, a more coherent purchase, and a stronger impression across every touchpoint.",
      ],
    },
  };

  return content[category.group];
}

export function getCategoryBulletSections(category: CategoryPage): CategoryBulletSection[] {
  const sections: Record<CategoryGroup, CategoryBulletSection[]> = {
    Jerseys: [
      {
        heading: "Fabric Options for Football Jerseys",
        bullets: [
          "Mesh fabric for airflow during hotter Texas sessions",
          "Polyester blends for strength and repeat washing",
          "Stretch panels for easier movement through contact and cuts",
          "Sublimated fabric for full-color artwork without cracking",
          "Lightweight builds for camps and training-focused use",
        ],
      },
      {
        heading: "Customization Options for Texas Teams",
        bullets: [
          "Team name placement",
          "Player names and numbers",
          "Logo positioning on chest or sleeves",
          "Color matching to school or club identity",
          "Sleeve and shoulder detail options",
          "Sponsor placement where appropriate",
        ],
      },
    ],
    Uniforms: [
      {
        heading: "What Buyers Usually Compare in Full Uniform Orders",
        bullets: [
          "Game-day durability and stitching quality",
          "Breathability for Texas weather",
          "Number visibility from distance",
          "Consistency across home, away, and alternate looks",
          "Roster personalization and reorder support",
        ],
      },
      {
        heading: "Common Customization Priorities",
        bullets: [
          "School or club color matching",
          "Front, back, and sleeve number structure",
          "Logo placement and trim balance",
          "Player names and captain details",
          "Program-wide consistency across age groups",
        ],
      },
    ],
    "Practice Gear": [
      {
        heading: "What Buyers Usually Need From Practice Gear",
        bullets: [
          "Breathability for repeated sessions",
          "Comfort under warm Texas conditions",
          "Simple roster organization and unit separation",
          "Durability for daily repetition",
          "Easy reordering when camp numbers change",
        ],
      },
      {
        heading: "Training Product Priorities",
        bullets: [
          "Lightweight tops for movement",
          "Protective padded layers where needed",
          "Grip and accessory support",
          "Color consistency with the main team identity",
          "Practical sizing across mixed roster groups",
        ],
      },
    ],
    "Team Packages": [
      {
        heading: "What Buyers Look for in Team Packages",
        bullets: [
          "One coordinated order structure instead of multiple fragmented decisions",
          "Cleaner artwork approval across multiple products",
          "Consistent player personalization",
          "Program-wide color and logo continuity",
          "Better reorder visibility later in the season",
        ],
      },
      {
        heading: "Best Uses for Package-Based Ordering",
        bullets: [
          "School-wide football programs",
          "Club organizations with more than one roster",
          "Season launch planning",
          "Programs combining uniforms and supporting items",
          "Teams that need clearer administrative control",
        ],
      },
    ],
    "Team Apparel": [
      {
        heading: "What Buyers Compare in Team Apparel",
        bullets: [
          "Travel comfort and layering",
          "Sideline presentation",
          "Coach and staff identity",
          "Weather coverage for Texas schedules",
          "Consistency with the main team brand",
        ],
      },
      {
        heading: "Common Customization Needs",
        bullets: [
          "Program logos on outerwear and hoodies",
          "Consistent color matching with uniforms",
          "Staff and coach apparel planning",
          "Travel and warm-up coordination",
          "Supporter-facing branded items where needed",
        ],
      },
    ],
  };

  return sections[category.group];
}

export function getCategoryComparison(category: CategoryPage): CategoryComparison {
  const comparisons: Record<CategoryGroup, CategoryComparison> = {
    Jerseys: {
      heading: "Game Jerseys vs Practice Jerseys",
      rows: [
        ["Material", "Premium durable fabric", "Lightweight breathable fabric"],
        ["Design", "Full team branding", "Simpler training design"],
        ["Best For", "Matches and tournaments", "Daily practice"],
        ["Customization", "Names, numbers, logos", "Basic numbers or team name"],
        ["Ordering", "Full roster runs", "Bulk training sets"],
      ],
    },
    Uniforms: {
      heading: "Varsity Uniforms vs Youth Uniforms",
      rows: [
        ["Build Focus", "Presentation and durability", "Comfort and sizing simplicity"],
        ["Branding Detail", "Full program identity", "Clean team consistency"],
        ["Best For", "Competitive school or club use", "Feeder and youth programs"],
        ["Customization", "Advanced trim and personalization", "Practical roster personalization"],
        ["Reorders", "Structured season add-ons", "Growth-based repeat orders"],
      ],
    },
    "Practice Gear": {
      heading: "Practice Tops vs Protective Training Layers",
      rows: [
        ["Primary Use", "Movement and athlete identification", "Support during contact drills"],
        ["Material", "Lightweight mesh or polyester", "Compression blends with pad zones"],
        ["Branding", "Simple team marks and numbers", "Limited branding where useful"],
        ["Best For", "Daily sessions and camps", "More physical training environments"],
        ["Ordering", "Bulk training quantities", "Position or roster-specific needs"],
      ],
    },
    "Team Packages": {
      heading: "Single Product Orders vs Team Packages",
      rows: [
        ["Order Structure", "One product at a time", "Coordinated multi-item planning"],
        ["Brand Consistency", "Can vary between orders", "Built for unified identity"],
        ["Admin Efficiency", "More fragmented approvals", "Cleaner centralized workflow"],
        ["Best For", "Simple short-term needs", "Programs with larger coordination demands"],
        ["Reorders", "Separate follow-up decisions", "More organized repeat structure"],
      ],
    },
    "Team Apparel": {
      heading: "Travel Apparel vs Sideline Apparel",
      rows: [
        ["Main Goal", "Comfort and program image", "Weather coverage and field presence"],
        ["Typical Products", "Hoodies and warm-up sets", "Jackets and coach layers"],
        ["Branding Style", "Retail-style but team aligned", "Sharper, more visible team marks"],
        ["Best For", "Arrival, travel, and downtime", "Game day and pregame environments"],
        ["Ordering", "Roster or support group based", "Staff and weather-driven planning"],
      ],
    },
  };

  return comparisons[category.group];
}

export function getCategoryFaqs(category: CategoryPage): CategoryFaq[] {
  const faqs: Record<CategoryGroup, CategoryFaq[]> = {
    Jerseys: [
      { question: "What types of custom football jerseys are available in this category?", answer: "The jersey category includes adult, youth, reversible, sublimated, fan, flag, lightweight, and personalized jersey options so teams can choose based on game use, training needs, and branding goals." },
      { question: "Can names and numbers be customized on football jerseys?", answer: "Yes. Names and numbers can be personalized across the roster, with layout support to keep spacing, readability, and team branding consistent." },
      { question: "Are these jerseys suitable for Texas heat?", answer: "Many jersey styles in this category are designed with breathable performance fabrics that help teams handle warmer Texas conditions more comfortably." },
      { question: "What is the usual minimum order for jersey projects?", answer: "Most jersey products begin at team-friendly minimums, with final order structure depending on the exact style and personalization needs." },
      { question: "Can I choose lightweight or game-weight jersey options?", answer: "Yes. This category includes lighter practice-oriented builds as well as more structured game-ready jersey options." },
      { question: "Do these jerseys work for youth and adult teams?", answer: "Yes. Size ranges vary by product, but the category includes both youth-focused and adult-focused jersey options." },
      { question: "How long does custom jersey production usually take?", answer: "Turnaround typically falls between 2 and 4 weeks after final artwork approval, depending on the product and roster complexity." },
      { question: "Can booster groups order fan-focused football jerseys too?", answer: "Yes. Fan-oriented jersey styles can help booster clubs and supporters stay connected to the same team identity." },
    ],
    Uniforms: [
      { question: "What products are included in the football uniforms category?", answer: "This category includes full football uniform options for youth, high school, college, 7-on-7, and flag programs that need complete team presentation." },
      { question: "Can full uniforms be customized with team colors and logos?", answer: "Yes. Uniforms are built around your colors, logos, names, numbers, and preferred visual direction." },
      { question: "Are these uniforms suitable for Texas school programs?", answer: "Yes. The category is structured for youth leagues, high school teams, club programs, and other organized football buyers in Texas." },
      { question: "How do I choose between different uniform styles?", answer: "The best option depends on your level of play, athlete age, climate priorities, and whether you want a lighter event build or a fuller game-day system." },
      { question: "Can youth and varsity teams use the same design direction?", answer: "Yes. Many programs use one visual framework across multiple age groups while adjusting sizes and product structure as needed." },
      { question: "What customization methods are common for football uniforms?", answer: "Common methods include sublimation, roster personalization, and optional upgrades like tackle twill depending on the final build." },
      { question: "What is the standard turnaround for custom uniforms?", answer: "Most uniform programs run about 3 to 4 weeks after artwork approval, depending on order complexity." },
      { question: "Can uniforms be reordered later for roster additions?", answer: "Yes. A well-organized initial order makes replacement and add-on uniform requests much easier later in the season." },
    ],
    "Practice Gear": [
      { question: "What counts as football practice gear in this category?", answer: "This category includes practice jerseys, padded shirts, gloves, socks, and shorts that support training-day performance and team organization." },
      { question: "Is practice gear customizable with team branding?", answer: "Yes. Many practice products can be color matched or customized so your training gear stays aligned with the team identity." },
      { question: "Can this category support summer camps and repeated sessions?", answer: "Yes. Practice gear is selected with repeated use, movement, and Texas training conditions in mind." },
      { question: "Do padded shirts and practice tops come in youth sizes?", answer: "Sizing depends on the product, but youth and adult options are available across much of the category." },
      { question: "Are football gloves and socks included in quote-based orders?", answer: "Yes. Accessories can be included alongside training apparel to create a more complete practice setup." },
      { question: "How is practice gear different from game uniforms?", answer: "Practice gear is usually chosen for repetition, comfort, mobility, and athlete organization rather than formal game presentation." },
      { question: "How fast can practice gear usually be produced?", answer: "Most practice-focused items are produced in roughly 2 to 3 weeks after approval." },
      { question: "Can coaches reorder practice items mid-season?", answer: "Yes. Practice gear is often reordered as programs add players, replace worn pieces, or expand camp inventory." },
    ],
    "Team Packages": [
      { question: "What is a football team package?", answer: "A football team package is a coordinated ordering approach that helps programs source multiple teamwear pieces under one structured plan." },
      { question: "Are team packages better than ordering products separately?", answer: "For many programs, yes. Packages help reduce mismatched design decisions and make ordering more organized across the roster." },
      { question: "Can team packages include custom jerseys and full uniforms?", answer: "Yes. Packages can be built around core products like full uniforms, jerseys, and related supporting items." },
      { question: "Who benefits most from team packages?", answer: "Schools, clubs, and organizations managing full rosters or multiple teams usually gain the most from package-based ordering." },
      { question: "Can packages help with repeat orders later in the season?", answer: "Yes. Package planning keeps artwork and coordination cleaner, which makes add-on orders easier later." },
      { question: "Are team packages customized for each program?", answer: "Yes. Package direction depends on your roster size, goals, product mix, and branding priorities." },
      { question: "How long do package orders usually take?", answer: "Most coordinated package orders take around 3 to 4 weeks after final approvals are complete." },
      { question: "Can team packages support Texas school and club programs?", answer: "Yes. The category is especially useful for Texas programs that need full-team coordination and stronger operational structure." },
    ],
    "Team Apparel": [
      { question: "What products are included in football team apparel?", answer: "This category includes hoodies, warm-up suits, sideline jackets, and coaches apparel built for travel, sideline, and support use." },
      { question: "Can team apparel match our football uniform branding?", answer: "Yes. Team apparel can be customized to align with your colors, logos, and broader program identity." },
      { question: "Is this category only for players?", answer: "No. Team apparel can be used by athletes, coaches, support staff, and even related supporter programs depending on the product." },
      { question: "What is the difference between team apparel and game uniforms?", answer: "Team apparel focuses on travel, layering, sideline visibility, and off-field presentation rather than direct game-play use." },
      { question: "Can coaches apparel be included in the same order?", answer: "Yes. Coaching apparel is part of this category and can be planned alongside other team layers." },
      { question: "How long does custom team apparel usually take?", answer: "Most team apparel orders are completed in about 2 to 3 weeks after artwork and product details are approved." },
      { question: "Are these apparel products useful for booster and travel programs too?", answer: "Yes. Team apparel is often used to strengthen overall program image beyond the roster alone." },
      { question: "Can jackets and warm-up suits be ordered for full rosters?", answer: "Yes. Team apparel can be structured for full player groups, coaching staffs, and multi-piece program orders." },
    ],
  };

  return faqs[category.group];
}

export function buildCategoryFaqSchema(category: CategoryPage) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getCategoryFaqs(category).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildCategoryCollectionSchema(category: CategoryPage, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: `${SITE_URL}/categories/${category.slug}/`,
    about: {
      "@type": "Thing",
      name: category.group,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/${product.slug}/`,
        name: product.name,
      })),
    },
  };
}

export function getProductBySlug(slug: string) {
  return getAllProducts().find((product) => product.slug === slug);
}

export function getRelatedProductsBySlug(slug: string) {
  const products = getAllProducts();
  const index = products.findIndex((item) => item.slug === slug);
  return products
    .filter((item) => item.slug !== slug)
    .slice(index % (products.length - 4), (index % (products.length - 4)) + 4);
}

export function buildMetaTitle(product: Product) {
  const raw = `${product.name} in Texas | Custom Football Uniform Quotes`;
  const short = `${product.name} Texas | Custom Football Quote`;
  return truncateAtWord(raw.length <= 65 ? raw : short, 65, 58);
}

export function buildMetaDescription(product: Product) {
  const raw = `Shop premium custom ${product.name.toLowerCase()} for Texas teams with fast turnarounds, player personalization, and quote-first ordering support.`;
  return truncateAtWord(raw, 150, 140);
}

export function buildProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} | Texas Football Uniforms`,
    image: product.images.map((image) => `${SITE_URL}${image}`),
    description: product.shortDescription,
    brand: {
      "@type": "Brand",
      name: company.name,
    },
    sku: product.slug.toUpperCase(),
    category: product.name,
    material: product.material,
    audience: {
      "@type": "Audience",
      geographicArea: "Texas",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "38",
    },
    url: `${SITE_URL}/${product.slug}/`,
  };
}

export function buildFaqSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: SITE_URL,
    email: company.email,
    telephone: company.phoneDisplay,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [],
  };
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportingGoodsStore",
    name: company.name,
    url: SITE_URL,
    telephone: company.phoneDisplay,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.addressLines[0],
      addressLocality: company.city,
      addressRegion: company.state,
      postalCode: company.postalCode,
      addressCountry: "US",
    },
    areaServed: "Texas",
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/all-categories/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
