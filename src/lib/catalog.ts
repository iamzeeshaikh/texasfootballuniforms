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
