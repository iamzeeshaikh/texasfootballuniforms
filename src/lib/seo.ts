import type { Metadata } from "next";

import { SITE_URL } from "@/lib/site";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  images?: string[];
};

/** Google truncates around here; past it the brand costs us the tail of the title. */
const TITLE_BUDGET = 60;
const BRAND_SUFFIX = " | Texas Football Uniforms";

/**
 * Drops the brand suffix when keeping it would push the title past the snippet
 * budget. The city and topic are what differentiate these results, so the brand
 * name is what gives way.
 */
function trimBrandSuffix(title: string) {
  if (title.length <= TITLE_BUDGET || !title.endsWith(BRAND_SUFFIX)) return title;
  return title.slice(0, -BRAND_SUFFIX.length);
}

export function createMetadata({
  title,
  description,
  path = "/",
  images = ["/assets/football team kits/1.jpg"],
}: MetadataInput): Metadata {
  const snippetTitle = trimBrandSuffix(title);

  return {
    title: snippetTitle,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: snippetTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Texas Football Uniforms",
      type: "website",
      images: images.map((image) => ({
        url: `${SITE_URL}${image}`,
        alt: title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: snippetTitle,
      description,
      images: images.map((image) => `${SITE_URL}${image}`),
    },
  };
}
