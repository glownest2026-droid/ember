'use client';

import type { ReactNode } from 'react';
import { EmberRobinMark } from '@/components/figma/discover/EmberRobinMark';
import { getDiscoverHeroCopy } from './discoverHeroCopy';
import { DiscoverFigmaImage } from './DiscoverFigmaImage';

const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1509781827353-fb95c262fc40?w=1080&q=80';

function AgeBandChip({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[#FBFAF7] border border-[#E7E2DC] px-2.5 py-1.5 rounded-full shadow-sm">
      <EmberRobinMark size="lg" />
      <span className="text-[13px] font-bold text-[#253044]">{label}</span>
    </div>
  );
}

function AgeSliderCard({
  name,
  bandLabel,
  selectedBandIndex,
  bandCount,
  sliderProgress,
  onBandIndexChange,
}: {
  name: string | null;
  bandLabel: string;
  selectedBandIndex: number;
  bandCount: number;
  sliderProgress: number;
  onBandIndexChange: (index: number) => void;
}) {
  return (
    <div className="bg-white border border-[#E7E2DC] rounded-[20px] p-5 shadow-sm">
      <div className="mb-4">
        <span className="font-bold text-[#253044] text-[17px]">
          {name ? `${name} · ${bandLabel}` : bandLabel}
        </span>
      </div>
      <div
        className="discovery-slider-wrap relative w-full h-5 mb-3"
        style={{ '--slider-progress': `${sliderProgress}%` } as React.CSSProperties}
      >
        <input
          type="range"
          min={0}
          max={Math.max(0, bandCount - 1)}
          step={1}
          value={selectedBandIndex}
          onChange={(e) => onBandIndexChange(Number(e.target.value))}
          className="discovery-age-slider w-full"
          aria-label="Age range"
        />
      </div>
      <p className="text-[13px] text-[#66717D] m-0">
        Slide to a different age if you want to explore another stage.
      </p>
    </div>
  );
}

export function DiscoverFigmaChildHero({
  childDisplayLabel,
  monthAge,
  bandLabel,
  bandRange,
  isExpecting = false,
  heroImageUrl,
  selectedBandIndex,
  bandCount,
  sliderProgress,
  onBandIndexChange,
  audienceToggle,
}: {
  childDisplayLabel: string | null;
  childGender?: string | null;
  monthAge: number;
  bandLabel: string;
  bandRange?: { min: number; max: number } | null;
  /** True when the selected band is the newborn/expecting (0–0 months) stage. */
  isExpecting?: boolean;
  heroImageUrl?: string | null;
  selectedBandIndex: number;
  bandCount: number;
  sliderProgress: number;
  onBandIndexChange: (index: number) => void;
  /** Parent/gift toggle — desktop: top-right above hero image; mobile: below slider. */
  audienceToggle?: ReactNode;
}) {
  const name = childDisplayLabel?.trim() || null;
  const chipLabel = name ? `For ${name} · ${bandLabel}` : bandLabel;
  const { headline, sub } = getDiscoverHeroCopy({
    bandRange: bandRange ?? null,
    childDisplayLabel,
    isExpecting,
    monthAge,
  });

  const heroImg = (
    <DiscoverFigmaImage
      src={heroImageUrl || HERO_FALLBACK}
      alt=""
      variant="hero"
      priority
      className="object-cover"
    />
  );

  const sliderCard = (
    <AgeSliderCard
      name={name}
      bandLabel={bandLabel}
      selectedBandIndex={selectedBandIndex}
      bandCount={bandCount}
      sliderProgress={sliderProgress}
      onBandIndexChange={onBandIndexChange}
    />
  );

  return (
    <section className="w-full pt-2 md:pt-6">
      {/* Mobile: image first */}
      <div className="relative mb-6 w-full overflow-hidden rounded-[24px] border border-[#E7E2DC] aspect-[4/3] shadow-sm md:hidden">
        {heroImg}
      </div>

      {/* Mobile: stacked content */}
      <div className="flex flex-col gap-6 md:hidden">
        <AgeBandChip label={chipLabel} />
        <div>
          <h1 className="font-sans text-[32px] leading-[1.1] font-bold text-[#253044] mb-4">{headline}</h1>
          <p className="text-[16px] text-[#66717D] leading-relaxed max-w-lg">{sub}</p>
        </div>
        {sliderCard}
        {audienceToggle ? <div className="w-full">{audienceToggle}</div> : null}
      </div>

      {/* Desktop: age chip + toggle row, headline, then matched desc/slider | image */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-5 md:items-start">
        <AgeBandChip label={chipLabel} />
        {audienceToggle ? (
          <div className="flex justify-end self-start">{audienceToggle}</div>
        ) : (
          <div aria-hidden />
        )}

        <h1 className="font-sans col-start-1 text-[44px] leading-[1.05] font-bold text-[#253044] m-0">
          {headline}
        </h1>
        <div className="col-start-2 row-start-2" aria-hidden />

        <div className="col-start-1 row-start-3 flex flex-col gap-6">
          <p className="text-[17px] text-[#66717D] leading-relaxed max-w-lg m-0">{sub}</p>
          {sliderCard}
        </div>

        <div className="col-start-2 row-start-3 relative h-full min-h-[12rem] overflow-hidden rounded-[20px] border border-[#E7E2DC] shadow-sm">
          {heroImg}
        </div>
      </div>
    </section>
  );
}
