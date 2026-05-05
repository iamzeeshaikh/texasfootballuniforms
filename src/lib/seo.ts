import type { Metadata } from "next";

import { SITE_URL } from "@/lib/site";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  images?: string[];
};

export function createMetadata({
  title,
  description,
  path = "/",
  images = ["/assets/football team kits/1.jpg"],
}: MetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
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
      title,
      description,
      images: images.map((image) => `${SITE_URL}${image}`),
    },
  };
}
