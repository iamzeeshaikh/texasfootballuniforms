import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createMetadata } from "@/lib/seo";
import { CityLocation } from "@/components/city-location";
import { getLocationCity } from "@/data/locations";

export function generateMetadata(): Metadata {
  const loc = getLocationCity("corpus-christi");
  if (!loc) return {};
  return createMetadata({
    title: loc.metaTitle,
    description: loc.metaDescription,
    path: "/corpus-christi-football-uniforms/",
  });
}

export default function CorpusChristiPage() {
  const loc = getLocationCity("corpus-christi");
  if (!loc) notFound();
  return <CityLocation loc={loc} />;
}
