import { getAllProducts } from "@/lib/catalog";

/**
 * Data for the "Design Your Uniform" tool.
 *
 * Two rules hold this file together:
 *
 * 1. **Every price is a product's published starting price.** Options are
 *    defined by product slug and read `fromPrice` / `priceUnit` straight off
 *    the blueprint in `src/lib/catalog.ts`, so the number in the tool and the
 *    "from $" on the product page cannot drift. The old version carried its
 *    own invented numbers (38 / 74 / 92) plus invented fabric and decoration
 *    surcharges, so a coach could read two different prices for one jersey.
 *    Fabric, decoration, fit and markings are specification choices here, not
 *    priced line items — we do not publish a surcharge we have not published
 *    anywhere else on the site.
 * 2. **Every visual is one of the site's own photos.** Garment, decoration and
 *    add-on cards show the real product photography in `public/assets/<folder>/`;
 *    fabric is the one step with no honest photo, so it shows a labelled swatch.
 *
 * An unknown slug throws at build time on purpose: renaming a product slug
 * should break the build, not silently blank out a card.
 */

export type DesignOption = {
  id: string;
  label: string;
  hint: string;
  image?: string;
  imageAlt?: string;
  /** Starting price in USD at the 10-piece minimum. */
  price?: number;
  /** The unit that price is quoted in — "jersey", "set", "pair". */
  unit?: string;
  /** Product page the price and photo come from. */
  href?: string;
  /** Swatch color for fabric cards, which have no representative photo. */
  swatch?: string;
};

export type ColorChip = { name: string; hex: string };

export type DesignOptions = {
  garments: DesignOption[];
  decorations: DesignOption[];
  fabrics: DesignOption[];
  fits: DesignOption[];
  addOns: DesignOption[];
  colors: ColorChip[];
  rosters: number[];
  /** The order minimum every price on this page is quoted at. */
  minimumPieces: number;
};

type Row = { slug: string; label: string; hint: string; imageIndex?: number };

const GARMENT_ROWS: Row[] = [
  { slug: "american-football-jerseys", label: "Game jersey", hint: "Game-day jersey, sublimated" },
  { slug: "sublimated-football-jerseys", label: "Sublimated jersey", hint: "Full dye, unlimited colors" },
  { slug: "reversible-football-jerseys", label: "Reversible jersey", hint: "Two colors, one jersey" },
  { slug: "football-practice-jerseys", label: "Practice jersey", hint: "Daily-contact training top" },
  { slug: "american-football-uniforms", label: "Jersey + pants set", hint: "Full game uniform" },
  { slug: "high-school-football-uniforms", label: "High school uniform", hint: "Varsity and JV kits" },
  { slug: "youth-football-uniforms", label: "Youth uniform", hint: "True youth block, youth XS up" },
  { slug: "football-team-kits", label: "Full team kit", hint: "Jersey, pants and layers" },
  { slug: "7-on-7-football-uniforms", label: "7-on-7 uniform", hint: "Summer weight, no pads" },
  { slug: "flag-football-uniforms", label: "Flag football uniform", hint: "Jersey and shorts set" },
  { slug: "football-warm-up-suits", label: "Warm-up suit", hint: "Sideline and travel layer" },
  { slug: "coaches-apparel", label: "Coaches uniform", hint: "Staff polos and sideline shirts" },
];

const DECORATION_ROWS: Row[] = [
  { slug: "sublimated-football-jerseys", label: "Full sublimation", hint: "Edge-to-edge print, nothing to peel", imageIndex: 1 },
  { slug: "custom-name-football-jerseys", label: "Player names", hint: "Nameplate for every player" },
  { slug: "custom-number-football-jerseys", label: "Player numbers", hint: "Front, back and sleeve numbers" },
  { slug: "custom-team-jerseys", label: "Team logo and wordmark", hint: "School mark, script or crest" },
  { slug: "blank-football-jerseys", label: "Blank, decorate later", hint: "No names or numbers applied" },
];

const ADD_ON_ROWS: Row[] = [
  { slug: "football-shorts", label: "Matching shorts", hint: "Compression or game cut" },
  { slug: "football-socks", label: "Team socks", hint: "Custom stripe and color" },
  { slug: "football-gloves", label: "Team gloves", hint: "Printed palm and back" },
  { slug: "padded-football-shirts", label: "Padded shirt", hint: "Integrated shoulder and rib pads" },
  { slug: "football-sideline-jackets", label: "Sideline jacket", hint: "Travel and warm-up layer" },
  { slug: "football-hoodies", label: "Team hoodie", hint: "Fleece with team mark" },
];

/**
 * Fabric has no photo that honestly shows it — a jersey picture proves the
 * cut, not the knit — so each option is a labelled swatch instead.
 */
const FABRICS: DesignOption[] = [
  { id: "poly-mesh", label: "Poly mesh", hint: "Breathable classic game knit", swatch: "#1f3f6d" },
  { id: "mock-mesh", label: "Mock mesh", hint: "Smooth surface, sharpest print", swatch: "#2f5f8f" },
  { id: "dazzle", label: "Dazzle", hint: "Shine finish, hard wearing", swatch: "#8e9bb0" },
  { id: "stretch", label: "4-way stretch", hint: "Compression fit, no drag", swatch: "#0b1f3a" },
  { id: "wicking-knit", label: "Moisture-wicking knit", hint: "Cool touch for summer work", swatch: "#4f7f6f" },
];

const FITS: DesignOption[] = [
  { id: "adult", label: "Adult standard", hint: "S to 5XL" },
  { id: "adult-slim", label: "Adult slim / pro cut", hint: "Tapered body and sleeve" },
  { id: "youth", label: "Youth", hint: "Youth XS to youth XL" },
  { id: "mixed", label: "Mixed roster", hint: "Adult and youth in one order" },
];

/** Named so the spec that reaches the shop reads "Navy", not "#0b1f3a". */
const COLORS: ColorChip[] = [
  { name: "Navy", hex: "#0b1f3a" },
  { name: "Royal blue", hex: "#1d4ed8" },
  { name: "Columbia blue", hex: "#7dd3fc" },
  { name: "Red", hex: "#c8102e" },
  { name: "Maroon", hex: "#7a0019" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Gold", hex: "#ffd166" },
  { name: "Vegas gold", hex: "#c5b358" },
  { name: "Kelly green", hex: "#1b7f4f" },
  { name: "Forest green", hex: "#14532d" },
  { name: "Purple", hex: "#5b21b6" },
  { name: "Black", hex: "#111111" },
  { name: "Silver", hex: "#c0c5cb" },
  { name: "White", hex: "#ffffff" },
];

export const DESIGN_ROSTERS = [10, 15, 20, 25, 35, 50, 75];

/** The minimum every published price on this site is quoted at. */
export const DESIGN_MINIMUM = 10;

export function getDesignOptions(): DesignOptions {
  const bySlug = new Map(getAllProducts().map((product) => [product.slug, product]));

  const build = (rows: Row[]): DesignOption[] =>
    rows.map((row) => {
      const product = bySlug.get(row.slug);
      if (!product) {
        throw new Error(`Design tool option points at an unknown product slug: ${row.slug}`);
      }

      return {
        id: row.slug,
        label: row.label,
        hint: row.hint,
        image: product.images[row.imageIndex ?? 0] ?? product.heroImage,
        imageAlt: `${product.name} — ${row.label.toLowerCase()} option in the uniform designer`,
        price: product.fromPrice,
        unit: product.priceUnit,
        href: `/${product.slug}/`,
      };
    });

  return {
    garments: build(GARMENT_ROWS),
    decorations: build(DECORATION_ROWS),
    fabrics: FABRICS,
    fits: FITS,
    addOns: build(ADD_ON_ROWS),
    colors: COLORS,
    rosters: DESIGN_ROSTERS,
    minimumPieces: DESIGN_MINIMUM,
  };
}

/**
 * Which garment card a product page should open with. Products that are not
 * garments in their own right (socks, gloves, a padded shirt) point at the
 * garment they are normally ordered beside; the add-on card for the product
 * itself is switched on separately by `designAddOnForProduct`.
 */
const GARMENT_FOR_PRODUCT: Record<string, string> = {
  "adult-football-jerseys": "american-football-jerseys",
  "fan-football-jerseys": "american-football-jerseys",
  "lightweight-football-jerseys": "football-practice-jerseys",
  "youth-football-jerseys": "youth-football-uniforms",
  "flag-football-jerseys": "flag-football-uniforms",
  "college-football-uniforms": "high-school-football-uniforms",
  "football-gloves": "american-football-jerseys",
  "football-socks": "american-football-jerseys",
  "football-shorts": "american-football-jerseys",
  "padded-football-shirts": "football-practice-jerseys",
  "football-sideline-jackets": "football-warm-up-suits",
  "football-hoodies": "football-warm-up-suits",
};

const GARMENT_IDS = new Set(GARMENT_ROWS.map((row) => row.slug));
const ADD_ON_IDS = new Set(ADD_ON_ROWS.map((row) => row.slug));

export function designGarmentForProduct(slug: string): string | undefined {
  if (GARMENT_IDS.has(slug)) return slug;
  return GARMENT_FOR_PRODUCT[slug];
}

export function designAddOnForProduct(slug: string): string | undefined {
  return ADD_ON_IDS.has(slug) ? slug : undefined;
}
