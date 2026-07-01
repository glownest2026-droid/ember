'use client';

import type { ReactNode } from 'react';
import { EmberRobinMark } from '@/components/figma/discover/EmberRobinMark';
import { getDiscoverHeroCopy } from './discoverHeroCopy';
import { DiscoverFigmaImage } from './DiscoverFigmaImage';

const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1509781827353-fb95c262fc40?w=1080&q=80';

function AgeBandChip({ label }: { label: string }) {
  return (
    <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#E7E2DC] bg-[#FBFAF7] px-2.5 py-1.5 shadow-sm">
      <EmberRobinMark size="lg" />
      <span className="whitespace-nowrap text-[13px] font-bold text-[#253044]">{label}</span>
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
    <div className="rounded-[20px] border border-[#E7E2DC] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <span className="text-[17px] font-bold text-[#253044]">
          {name ? `${name} · ${bandLabel}` : bandLabel}
        </span>
      </div>
      <div
        className="discovery-slider-wrap relative h-5 w-full mb-3"
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
      <p className="m-0 text-[13px] text-[#66717D]">
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
  audienceToggleMobile,
}: {
  childDisplayLabel: string | null;
  childGender?: string | null;
  monthAge: number;
  bandLabel: string;
  bandRange?: { min: number; max: number } | null;
  isExpecting?: boolean;
  heroImageUrl?: string | null;
  selectedBandIndex: number;
  bandCount: number;
  sliderProgress: number;
  onBandIndexChange: (index: number) => void;
  /** Desktop top row — inline pill toggle only. */
  audienceToggle?: ReactNode;
  /** Mobile — full card below slider. */
  audienceToggleMobile?: ReactNode;
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

  const leftContent = (
    <>
      <h1 className="font-sans m-0 text-[32px] font-bold leading-[1.1] text-[#253044] md:text-[44px] md:leading-[1.05]">
        {headline}
      </h1>
      <p className="m-0 max-w-lg text-[16px] leading-relaxed text-[#66717D] md:text-[17px]">{sub}</p>
      {sliderCard}
    </>
  );

  return (
    <section className="w-full pt-2 md:pt-6">
      {/* Mobile: image first */}
      <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-[#E7E2DC] shadow-sm md:hidden">
        {heroImg}
      </div>

      {/* Mobile: stacked content */}
      <div className="flex flex-col gap-6 md:hidden">
        <AgeBandChip label={chipLabel} />
        <div className="flex flex-col gap-4">{leftContent}</div>
        {audienceToggleMobile ? <div className="w-full">{audienceToggleMobile}</div> : null}
      </div>

      {/* Desktop: single-line top bar, then title + copy + slider | image */}
      <div className="hidden md:flex md:flex-col md:gap-5">
        <div className="flex items-center justify-between gap-4">
          <AgeBandChip label={chipLabel} />
          {audienceToggle ? <div className="shrink-0">{audienceToggle}</div> : null}
        </div>

        <div className="grid grid-cols-2 items-stretch gap-x-12">
          <div className="flex flex-col gap-5">{leftContent}</div>
          <div className="relative min-h-[16rem] overflow-hidden rounded-[20px] border border-[#E7E2DC] shadow-sm">
            {heroImg}
          </div>
        </div>
      </div>
    </section>
  );
}
