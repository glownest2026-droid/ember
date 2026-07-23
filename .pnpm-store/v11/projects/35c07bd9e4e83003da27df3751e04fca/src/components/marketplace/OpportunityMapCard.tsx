"use client";

import type { DemandConfidence } from "@/lib/marketplace/beta-listing-types";
import {
  ensureAreaLabel,
  formatAreaRadiusHeadline,
  formatDemandPrimaryCopy,
  formatDemandSupportingCopy,
  formatMarketplaceListingCopy,
  hotspotBlobCount,
  OPPORTUNITY_MAP_PRIVACY_COPY,
} from "@/lib/marketplace/opportunity-map-display";

export type OpportunityMapCardProps = {
  approximateAreaLabel: string;
  radiusMiles: number;
  totalMayBeInterestedCount: number;
  demandConfidence?: DemandConfidence;
  breakdown?: Record<string, number>;
  compact?: boolean;
  title?: string;
  nearbyListingCount?: number;
  mode?: "opportunity" | "marketplace";
};

function MapIllustration({ blobCount, compact }: { blobCount: number; compact?: boolean }) {
  const blobPositions = [
    { cx: 38, cy: 42, r: 14 },
    { cx: 58, cy: 55, r: 11 },
    { cx: 72, cy: 38, r: 9 },
    { cx: 48, cy: 68, r: 8 },
    { cx: 65, cy: 72, r: 7 },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className={`absolute inset-0 h-full w-full ${compact ? "opacity-50" : "opacity-60"}`}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="ember-map-sky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#EEF2FF" />
        </linearGradient>
        <radialGradient id="ember-radius-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B4A" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#FF6B4A" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#ember-map-sky)" />
      {[20, 35, 50, 65, 80].map((y) => (
        <line
          key={`h-${y}`}
          x1="0"
          y1={y}
          x2="100"
          y2={y}
          stroke="#CBD5E1"
          strokeWidth="0.4"
          opacity="0.35"
        />
      ))}
      {[15, 30, 45, 60, 75, 90].map((x) => (
        <line
          key={`v-${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="100"
          stroke="#CBD5E1"
          strokeWidth="0.4"
          opacity="0.35"
        />
      ))}
      <circle cx="50" cy="50" r="34" fill="url(#ember-radius-glow)" />
      <circle
        cx="50"
        cy="50"
        r="28"
        fill="none"
        stroke="#FF6B4A"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        opacity="0.45"
      />
      <circle cx="50" cy="50" r="6" fill="#FF6B4A" opacity="0.25" />
      {blobPositions.slice(0, blobCount).map((blob, index) => (
        <circle
          key={index}
          cx={blob.cx}
          cy={blob.cy}
          r={blob.r}
          fill="#FF6B4A"
          opacity={0.18 + index * 0.04}
        />
      ))}
    </svg>
  );
}

export function OpportunityMapCard({
  approximateAreaLabel,
  radiusMiles,
  totalMayBeInterestedCount,
  demandConfidence,
  compact,
  title,
  nearbyListingCount,
  mode = "opportunity",
}: OpportunityMapCardProps) {
  const area = ensureAreaLabel(approximateAreaLabel);
  const headline = formatAreaRadiusHeadline(area, radiusMiles);
  const isMarketplace = mode === "marketplace";
  const hasDemand = totalMayBeInterestedCount > 0;

  const primaryCopy = isMarketplace
    ? formatMarketplaceListingCopy(nearbyListingCount ?? 0, area)
    : formatDemandPrimaryCopy(totalMayBeInterestedCount);

  const supportingCopy = isMarketplace
    ? `Showing listings around ${area} within ${radiusMiles} miles.`
    : formatDemandSupportingCopy(demandConfidence, hasDemand);

  const blobCount = isMarketplace
    ? hotspotBlobCount(nearbyListingCount ?? 0)
    : hotspotBlobCount(totalMayBeInterestedCount);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] ${
        compact ? "p-3" : "p-4"
      }`}
      data-testid="opportunity-map-card"
    >
      <MapIllustration blobCount={blobCount} compact={compact} />
      <MapCardContent
        compact={compact}
        title={title}
        headline={headline}
        primaryCopy={primaryCopy}
        supportingCopy={supportingCopy}
      />
    </div>
  );
}

function MapCardContent({
  compact,
  title,
  headline,
  primaryCopy,
  supportingCopy,
}: {
  compact?: boolean;
  title?: string;
  headline: string;
  primaryCopy: string;
  supportingCopy: string;
}) {
  return (
    <div className={`relative space-y-1 ${compact ? "min-h-[88px]" : "min-h-[120px]"}`}>
      {title ? (
        <p className={`font-medium text-[#1A1E23] ${compact ? "text-xs" : "text-sm"}`}>{title}</p>
      ) : null}
      <p className={`font-medium text-[#1A1E23] ${compact ? "text-sm" : "text-base"}`}>{headline}</p>
      <p className={`text-[#1A1E23] ${compact ? "text-xs" : "text-sm"}`}>{primaryCopy}</p>
      {!compact ? <p className="text-xs text-[#5C646D]">{supportingCopy}</p> : null}
      <p className={`text-[#5C646D] ${compact ? "text-[10px]" : "text-xs"}`}>
        {OPPORTUNITY_MAP_PRIVACY_COPY}
      </p>
    </div>
  );
}
