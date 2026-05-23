"use client";

type Props = {
  areaLabel: string;
  radiusMiles: number;
  hotspotCount: number;
};

export function LocalOpportunityMapCard({ areaLabel, radiusMiles, hotspotCount }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] p-4">
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/30" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10" />
        {hotspotCount > 0 &&
          Array.from({ length: Math.min(hotspotCount, 3) }).map((_, index) => (
            <span
              key={index}
              className="absolute h-3 w-3 rounded-full bg-primary/50"
              style={{
                left: `${30 + index * 20}%`,
                top: `${35 + (index % 2) * 18}%`,
              }}
            />
          ))}
      </div>
      <div className="relative space-y-1">
        <p className="text-sm font-medium text-[#1A1E23]">{areaLabel}</p>
        <p className="text-xs text-[#5C646D]">Approximate area · within {radiusMiles} miles</p>
        <p className="text-xs text-[#5C646D]">Exact address is not shown.</p>
      </div>
    </div>
  );
}
