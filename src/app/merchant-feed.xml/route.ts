import { getAllProducts, moqCount, packPrice } from "@/lib/catalog";
import { company, SITE_URL } from "@/lib/site";

/**
 * Google Merchant feed, built from the same catalog the product pages, their
 * Product schema, the cart and /api/order read. One item per product, listed
 * at its minimum order (g:multipack) for packPrice(), the number the page's
 * fact strip and Offer schema print. Free shipping anywhere in the US; 1 to 2
 * weeks of production (5 to 10 business days), then 2 to 5 in transit.
 */
export const dynamic = "force-static";

const x = (s: unknown) =>
  String(s ?? "").replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export function GET() {
  const items = getAllProducts()
    .filter((p) => p.images.length)
    .map((p) => {
      const n = moqCount(p);
      const imgs = p.images.slice(0, 6).map((i) => `${SITE_URL}${i}`);
      return `  <item>
    <g:id>TFU-${x(p.slug)}</g:id>
    <title>${x(`${p.name} - Custom, Set of ${n}`)}</title>
    <description>${x(`${p.shortDescription} Sold as the minimum order of ${p.moq}, custom made with your team's names, numbers and logos after you approve a free design mockup. Paid by PayPal invoice.`)}</description>
    <link>${SITE_URL}/${x(p.slug)}/</link>
    <g:image_link>${x(imgs[0])}</g:image_link>${imgs
      .slice(1)
      .map((u) => `\n    <g:additional_image_link>${x(u)}</g:additional_image_link>`)
      .join("")}
    <g:availability>in_stock</g:availability>
    <g:condition>new</g:condition>
    <g:price>${packPrice(p).toFixed(2)} USD</g:price>
    <g:multipack>${n}</g:multipack>
    <g:brand>${x(company.name)}</g:brand>
    <g:identifier_exists>no</g:identifier_exists>
    <g:mpn>${x(p.slug.toUpperCase())}</g:mpn>
    <g:google_product_category>5322</g:google_product_category>
    <g:product_type>${x(p.productFamily)}</g:product_type>
    <g:shipping><g:country>US</g:country><g:service>Free shipping</g:service><g:price>0.00 USD</g:price><g:min_transit_time>2</g:min_transit_time><g:max_transit_time>5</g:max_transit_time></g:shipping>
    <g:min_handling_time>5</g:min_handling_time>
    <g:max_handling_time>10</g:max_handling_time>
  </item>`;
    })
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>${x(company.name)}</title>
  <link>${SITE_URL}/</link>
  <description>Custom football uniforms and team apparel.</description>
${items}
</channel>
</rss>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
