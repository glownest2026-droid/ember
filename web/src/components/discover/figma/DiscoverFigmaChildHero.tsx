'use client';

import { EmberRobinMark } from '@/components/figma/discover/EmberRobinMark';
import { getDiscoverHeroCopy } from './discoverHeroCopy';
import { DiscoverFigmaImage } from './DiscoverFigmaImage';

const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1509781827353-fb95c262fc40?w=1080&q=80';

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

  return (
    <section className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-center pt-2 md:pt-6 w-full">
      <div className="relative md:hidden w-full rounded-[24px] overflow-hidden aspect-[4/3] border border-[#E7E2DC] shadow-sm">
        {heroImg}
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FBFAF7] border border-[#E7E2DC] px-2.5 py-1.5 rounded-full mb-4 shadow-sm">
            <EmberRobinMark size="lg" />
            <span className="text-[13px] font-bold text-[#253044]">{chipLabel}</span>
          </div>

          <h1 className="text-[32px] leading-[1.1] md:text-[44px] md:leading-[1.05] font-bold text-[#253044] mb-4">
            {headline}
          </h1>
          <p className="text-[16px] md:text-[17px] text-[#66717D] leading-relaxed max-w-lg">{sub}</p>
        </div>

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
      </div>

      <div className="flex-1 hidden md:block">
        <div className="relative rounded-[20px] overflow-hidden aspect-[4/3] border border-[#E7E2DC] shadow-sm">{heroImg}</div>
      </div>
    </section>
  );
}
