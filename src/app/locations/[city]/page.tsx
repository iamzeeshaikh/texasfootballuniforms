import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createMetadata } from "@/lib/seo";
import { CityLocation } from "@/components/city-location";
import { locationCities, getLocationCity } from "@/data/locations";

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  // Corpus Christi lives at /corpus-christi-football-uniforms/ instead of /locations/.
  return locationCities.filter((c) => c.slug !== "corpus-christi").map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const loc = getLocationCity(city);
  if (!loc) return {};
  return createMetadata({
    title: loc.metaTitle,
    description: loc.metaDescription,
    path: `/locations/${loc.slug}/`,
  });
}

export default async function CityLocationPage({ params }: Props) {
  const { city } = await params;
  const loc = getLocationCity(city);
  if (!loc) notFound();
  return <CityLocation loc={loc} />;
}
