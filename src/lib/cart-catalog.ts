import { getAllProducts, getOrderableProducts } from "@/lib/catalog";
import type { CartCatalog } from "@/lib/cart";

/**
 * The product facts the cart renders, resolved on the server at build time.
 *
 * Nothing about money, minimums or sizes is kept in the browser's copy of a
 * cart line: a line stores a slug and a quantity, and the name, the unit price
 * and the published size run are looked up here on every render. A price change
 * on the site therefore reprices a cart that has been sitting in someone's
 * localStorage for a week, instead of quoting them last month's number.
 */
export function buildCartCatalog(): CartCatalog {
  const heroImages = new Map(getAllProducts().map((product) => [product.slug, product.heroImage]));

  return Object.fromEntries(
    getOrderableProducts().map((product) => [
      product.slug,
      {
        slug: product.slug,
        name: product.name,
        fromPrice: product.fromPrice,
        priceUnit: product.priceUnit,
        minimum: product.minimum,
        sizesLabel: product.sizesLabel,
        sizeRun: [...product.sizeRun],
        href: product.href,
        image: heroImages.get(product.slug),
      },
    ]),
  );
}
