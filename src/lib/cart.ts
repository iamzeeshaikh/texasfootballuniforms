/**
 * Cart model, storage and arithmetic.
 *
 * Deliberately free of any import that reaches the filesystem (`@/lib/catalog`
 * reads `public/assets` with `fs`), because every client component in the cart,
 * the drawer and the checkout imports this file.
 *
 * Two rules hold everywhere a line is written:
 *   1. quantity is a whole number and never below MIN_LINE_QUANTITY;
 *   2. the size breakdown adds up to the quantity, exactly.
 * The UI enforces both before a line is saved, `normalizeLines` re-checks them
 * when storage is read back, and /api/order checks them again on the server —
 * a posted order that breaks either is rejected, not repaired.
 */

export const CART_STORAGE_KEY = "tfu:cart:v1";
export const ORDER_STORAGE_KEY = "tfu:last-order";
/** Broadcast within the tab so every mounted cart view updates together. */
export const CART_EVENT = "tfu:cart-changed";

/** Minimum per design, site-wide. Every product publishes "10". */
export const MIN_LINE_QUANTITY = 10;

export type SizeBreakdown = Record<string, number>;

export type CartLine = {
  id: string;
  slug: string;
  quantity: number;
  sizes: SizeBreakdown;
  /** Team colors, in the buyer's own words. */
  colors: string;
  /** Names, numbers, logo placement — anything about decoration. */
  notes: string;
  addedAt: number;
};

/** What a cart view needs to render a line. Built on the server from the catalog. */
export type CartProduct = {
  slug: string;
  name: string;
  fromPrice: number;
  priceUnit: string;
  minimum: number;
  sizesLabel: string;
  sizeRun: string[];
  href: string;
  image?: string;
};

export type CartCatalog = Record<string, CartProduct>;

export type PaymentMethod = "cod" | "bank-transfer";

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; detail: string }[] = [
  {
    id: "cod",
    label: "Cash on delivery",
    detail: "Pay the driver in cash when the boxes reach you. Nothing is charged before then.",
  },
  {
    id: "bank-transfer",
    label: "Bank transfer (we email an invoice)",
    detail:
      "We email an itemized invoice with the transfer details once your mockup is approved. No account numbers are published on this site.",
  },
];

export function paymentMethodLabel(method: PaymentMethod) {
  return PAYMENT_METHODS.find((option) => option.id === method)?.label ?? method;
}

export function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function sizeTotal(sizes: SizeBreakdown) {
  return Object.values(sizes).reduce((total, count) => total + (Number(count) || 0), 0);
}

/** The filled sizes in chart order, so "Youth S" never prints after "Adult L". */
export function sizeEntries(sizes: SizeBreakdown, sizeRun: string[]) {
  return sizeRun
    .map((size) => [size, Number(sizes[size]) || 0] as const)
    .filter(([, count]) => count > 0);
}

export function sizeSummary(sizes: SizeBreakdown, sizeRun: string[]) {
  return sizeEntries(sizes, sizeRun)
    .map(([size, count]) => `${size} ×${count}`)
    .join(", ");
}

export function emptySizes(): SizeBreakdown {
  return {};
}

export function lineSubtotal(line: Pick<CartLine, "quantity">, product: CartProduct) {
  return Math.round(line.quantity * product.fromPrice * 100) / 100;
}

export function cartTotal(lines: CartLine[], catalog: CartCatalog) {
  return (
    Math.round(
      lines.reduce((total, line) => {
        const product = catalog[line.slug];
        return product ? total + lineSubtotal(line, product) : total;
      }, 0) * 100,
    ) / 100
  );
}

/** Badge number: pieces, because that is the number a coach is tracking. */
export function cartCount(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function isLineBalanced(line: Pick<CartLine, "quantity" | "sizes">) {
  return sizeTotal(line.sizes) === line.quantity;
}

function biggestSize(sizes: SizeBreakdown, sizeRun: string[]) {
  let pick: string | null = null;
  sizeRun.forEach((size) => {
    const count = Number(sizes[size]) || 0;
    if (count > 0 && (pick === null || count > (Number(sizes[pick]) || 0))) pick = size;
  });
  return pick as string | null;
}

/** Where a fresh grid puts the first pieces: the middle of the published run. */
export function defaultSize(sizeRun: string[]) {
  return sizeRun.includes("Adult L") ? "Adult L" : sizeRun[Math.floor(sizeRun.length / 2)];
}

/**
 * Move a breakdown onto a new quantity without losing the shape of the roster.
 *
 * Extra pieces land on the size the buyer already ordered most of; pieces come
 * off the largest buckets first so a single Youth S is not the first thing to
 * disappear. Used by the +/- steppers, which have to keep the breakdown and the
 * quantity in step at all times, and by the "Match quantity" helper.
 */
export function balanceSizes(sizes: SizeBreakdown, target: number, sizeRun: string[]): SizeBreakdown {
  const next: SizeBreakdown = {};
  sizeRun.forEach((size) => {
    const count = Math.max(0, Math.floor(Number(sizes[size]) || 0));
    if (count > 0) next[size] = count;
  });

  const total = sizeTotal(next);
  if (total === target) return next;

  if (total < target) {
    const key = biggestSize(next, sizeRun) ?? defaultSize(sizeRun);
    next[key] = (next[key] ?? 0) + (target - total);
    return next;
  }

  let over = total - target;
  while (over > 0) {
    const key = biggestSize(next, sizeRun);
    if (!key) break;
    const take = Math.min(next[key], over);
    next[key] -= take;
    over -= take;
    if (next[key] <= 0) delete next[key];
  }
  return next;
}

/** Keep only sizes this product actually publishes, and only whole counts. */
export function cleanSizes(sizes: SizeBreakdown, sizeRun: string[]): SizeBreakdown {
  const next: SizeBreakdown = {};
  sizeRun.forEach((size) => {
    const count = Math.max(0, Math.floor(Number(sizes[size]) || 0));
    if (count > 0) next[size] = count;
  });
  return next;
}

export function newLineId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // Older browsers and non-secure origins: fall through.
  }
  return `line-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeLine(raw: unknown, catalog: CartCatalog): CartLine | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const slug = typeof value.slug === "string" ? value.slug : "";
  const product = catalog[slug];
  if (!product) return null;

  const quantity = Math.floor(Number(value.quantity));
  if (!Number.isFinite(quantity) || quantity < MIN_LINE_QUANTITY) return null;

  const sizes = cleanSizes(
    (value.sizes && typeof value.sizes === "object" ? value.sizes : {}) as SizeBreakdown,
    product.sizeRun,
  );
  if (sizeTotal(sizes) !== quantity) return null;

  return {
    id: typeof value.id === "string" && value.id ? value.id : newLineId(),
    slug,
    quantity,
    sizes,
    colors: typeof value.colors === "string" ? value.colors.slice(0, 200) : "",
    notes: typeof value.notes === "string" ? value.notes.slice(0, 600) : "",
    addedAt: Number.isFinite(Number(value.addedAt)) ? Number(value.addedAt) : Date.now(),
  };
}

/**
 * Read a stored cart back and drop anything that no longer holds: a product
 * that has left the catalog, a size that is no longer published, a breakdown
 * that does not add up. Dropping is right rather than repairing — a silently
 * repaired roster is a wrong order nobody notices.
 */
export function normalizeLines(raw: unknown, catalog: CartCatalog): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((line) => normalizeLine(line, catalog))
    .filter((line): line is CartLine => line !== null)
    .slice(0, 40);
}

export function readStoredCart(catalog: CartCatalog): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return normalizeLines(JSON.parse(raw), catalog);
  } catch {
    // Private mode, blocked site data, corrupted JSON: start empty rather than
    // throwing inside a render.
    return [];
  }
}

export function writeStoredCart(lines: CartLine[]) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage can be full or blocked; the cart still works for this page view.
  }
}

/** GA4 `items` for add_to_cart / begin_checkout / place_order. */
export function gaItems(lines: CartLine[], catalog: CartCatalog) {
  return lines
    .map((line) => {
      const product = catalog[line.slug];
      if (!product) return null;
      return {
        item_id: line.slug,
        item_name: product.name,
        price: product.fromPrice,
        quantity: line.quantity,
      };
    })
    .filter(Boolean);
}
