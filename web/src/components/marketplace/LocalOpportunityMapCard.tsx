"use client";

import { OpportunityMapCard } from "@/components/marketplace/OpportunityMapCard";

type Props = {
  areaLabel: string;
  radiusMiles: number;
  hotspotCount: number;
};

/** @deprecated Use OpportunityMapCard directly. */
export function LocalOpportunityMapCard({ areaLabel, radiusMiles, hotspotCount }: Props) {
  return (
    <OpportunityMapCard
      approximateAreaLabel={areaLabel}
      radiusMiles={radiusMiles}
      totalMayBeInterestedCount={hotspotCount}
      compact
    />
  );
}
