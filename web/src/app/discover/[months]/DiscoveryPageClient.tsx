'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { GatewayPick, GatewayWrapperPublic } from '@/lib/pl/public';
import { TODAY_DOORWAYS, resolveDoorwayToWrapper } from '@/lib/discover/doorways';
import { ideaIconForTitle } from './_lib/ideaIcons';
import { getWrapperIcon } from './_lib/wrapperIcons';

const SURFACE_STYLE = {
  backgroundColor: 'var(--ember-surface-primary)',
  borderRadius: '12px',
  boxShadow: '0px 4px 24px rgba(0,0,0,0.04)',
};

const PLACEHOLDER_IMAGE =
  'https://media.istockphoto.com/id/1340240183/photo/little-boy-playing-in-living-room.jpg?s=612x612&w=0&k=20&c=NWnLKf8hePPEHgjdKPb5ttCFnnf5o6mzvJ6TbZa9Bq4=';

interface AgeBand {
  id: string;
  label?: string | null;
  min_months: number | null;
  max_months: number | null;
}

type Wrapper = Pick<GatewayWrapperPublic, 'ux_wrapper_id' | 'ux_label' | 'ux_slug' | 'ux_description' | 'rank'>;
type PickItem = GatewayPick;

interface DiscoveryPageClientProps {
  ageBands: AgeBand[];
  ageBand: AgeBand | null;
  selectedBandHasPicks: boolean;
  monthParam: number | null;
  resolutionDebug?: string | null;
  wrappers: Wrapper[];
  selectedWrapperSlug: string | null;
  showPicks: boolean;
  picks: PickItem[];
  exampleProducts: PickItem[];
  showDebug?: boolean;
}

export default function DiscoveryPageClient({
  ageBands,
  ageBand,
  selectedBandHasPicks,
  monthParam,
  resolutionDebug,
  wrappers,
  selectedWrapperSlug,
  showPicks,
  picks,
  exampleProducts,
  showDebug = false,
}: DiscoveryPageClientProps) {
  const router = useRouter();
  const [whyOpen, setWhyOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const basePath = '/discover';

  const getBandRange = (band: AgeBand | null): { min: number; max: number } | null => {
    if (!band) return null;
    const min = typeof band.min_months === 'number' ? band.min_months : NaN;
    const max = typeof band.max_months === 'number' ? band.max_months : NaN;
    if (!isNaN(min) && !isNaN(max)) return { min, max };
    const match = band.id.match(/^(\d+)-(\d+)m$/);
    if (!match) return null;
    return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
  };

  const formatBandLabel = (band: AgeBand | null): string => {
    if (!band) return 'Age range';
    const range = getBandRange(band);
    if (!range) return band.label || band.id;
    return `${range.min}–${range.max} months`;
  };

  const getRepresentativeMonthForBand = (band: AgeBand | null): number | null => {
    const range = getBandRange(band);
    if (!range) return null;
    return range.min;
  };

  const getBandIndexById = (id: string | null): number => {
    if (!id) return 0;
    const idx = ageBands.findIndex((b) => b.id === id);
    return idx >= 0 ? idx : 0;
  };

  const propBandIndex = getBandIndexById(ageBand?.id ?? null);
  const [selectedBandIndex, setSelectedBandIndex] = useState(propBandIndex);
  const [selectedWrapper, setSelectedWrapper] = useState<string | null>(selectedWrapperSlug);

  useEffect(() => {
    setSelectedBandIndex(propBandIndex);
    setSelectedWrapper(selectedWrapperSlug);
  }, [propBandIndex, selectedWrapperSlug]);

  const selectedBand = ageBands[selectedBandIndex] ?? ageBand;
  const currentMonth = monthParam ?? 25;

  useEffect(() => {
    if (!showPicks) return;
    const el = document.getElementById('findsSection');
    if (!el) return;
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }, [showPicks]);

  useEffect(() => {
    if (selectedBandIndex !== propBandIndex) {
      const nextBand = ageBands[selectedBandIndex] ?? null;
      const repMonth = getRepresentativeMonthForBand(nextBand) ?? currentMonth;
      router.push(`${basePath}/${repMonth}`, { scroll: false });
    }
  }, [selectedBandIndex, basePath, currentMonth, ageBands, propBandIndex, router]);

  const handleWrapperSelect = (wrapperSlug: string) => {
    setSelectedWrapper(wrapperSlug);
    if (showPicks) {
      router.push(`${basePath}/${currentMonth}?wrapper=${encodeURIComponent(wrapperSlug)}&show=1`, { scroll: false });
    }
  };

  const getSigninUrl = (productId?: string) => {
    const params = new URLSearchParams();
    const next = selectedWrapper
      ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1`
      : `${basePath}/${currentMonth}`;
    params.set('next', next);
    if (productId) params.set('productId', productId);
    return `/signin?${params.toString()}`;
  };

  const getProductUrl = (p: PickItem) =>
    p.product.canonical_url || p.product.amazon_uk_url || p.product.affiliate_url || p.product.affiliate_deeplink || '#';

  const ctaEnabled = !!selectedBand && !!selectedWrapper;
  const selectedWrapperLabel = wrappers.find((w) => w.ux_slug === selectedWrapper)?.ux_label ?? selectedWrapper ?? '';

  const visibleDoorways = TODAY_DOORWAYS.map((d) => ({
    type: 'doorway' as const,
    ...d,
    resolved: resolveDoorwayToWrapper(d, wrappers),
  }));
  const moreWrappers = wrappers.filter(
    (w) => !visibleDoorways.some((t) => t.resolved?.ux_slug === w.ux_slug)
  );
  const allTiles = showMore
    ? [...visibleDoorways, ...moreWrappers.map((w) => ({ type: 'more' as const, wrapper: w }))]
    : visibleDoorways;

  const debugText =
    showDebug && monthParam !== null && ageBand !== null
      ? `path → band: ${ageBand.id}${resolutionDebug ? ` | ${resolutionDebug}` : ''}`
      : null;

  const sliderProgress = ageBands.length > 0 ? (selectedBandIndex / Math.max(1, ageBands.length - 1)) * 100 : 0;

  const displayIdeas = showPicks && picks.length > 0 ? picks : exampleProducts;
  const isExampleMode = !showPicks || picks.length === 0;

  const IdeaCard = ({ pick, index, doorwayLabel }: { pick: PickItem; index: number; doorwayLabel?: string }) => {
    const Icon = ideaIconForTitle(pick.product.name);
    const href = getProductUrl(pick);
    return (
      <article
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}
      >
        <div className="h-[80px] relative bg-[var(--ember-surface-soft)] flex items-center px-3 gap-3">
          <div
            className="rounded-lg px-2 py-1.5 flex items-center gap-2 shrink-0"
            style={{
              backgroundColor: 'var(--ember-surface-primary)',
              border: '1px solid var(--ember-border-subtle)',
            }}
          >
            <Icon size={16} strokeWidth={1.5} style={{ color: '#5C646D' }} />
            <span className="text-xs" style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}>
              Idea {index + 1}
            </span>
          </div>
          <strong
            className="block font-medium text-sm line-clamp-2 flex-1 min-w-0"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-high)' }}
          >
            {pick.product.name}
          </strong>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex flex-wrap gap-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--ember-surface-soft)', color: 'var(--ember-text-low)' }}>
              Best for: {formatBandLabel(selectedBand)}
            </span>
            {doorwayLabel && (
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--ember-surface-soft)', color: 'var(--ember-text-low)' }}>
                Focus: {doorwayLabel}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href={getSigninUrl(pick.product.id)}
              className="flex-1 min-h-[36px] rounded-lg border font-medium text-xs flex items-center justify-center"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-surface-primary)',
                color: 'var(--ember-text-high)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Save to my list
            </Link>
            {href !== '#' && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[36px] px-3 rounded-lg border font-medium text-xs flex items-center justify-center"
                style={{
                  borderColor: 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-surface-primary)',
                  color: 'var(--ember-text-high)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                View
              </a>
            )}
          </div>
        </div>
      </article>
    );
  };

  const leftSurface = (
    <div className="w-full lg:max-w-[600px] shrink-0" style={SURFACE_STYLE}>
      <div className="py-6 px-4 sm:px-6 sm:py-8">
        <section className="mb-6">
          <h1
            className="mb-2 text-[28px] leading-[1.1] md:text-[32px]"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
          >
            Three age-right ideas in under a minute.
          </h1>
          <p
            className="mb-4 text-base leading-[1.6]"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
          >
            A short set of three ideas and why they fit—then save what you like to your list.
          </p>
          <div className="flex flex-wrap gap-2">
            {['No child details', 'Under a minute', 'Clear reasons'].map((label) => (
              <span
                key={label}
                className="rounded-lg px-3 py-1.5 text-sm"
                style={{
                  backgroundColor: 'var(--ember-surface-soft)',
                  color: 'var(--ember-text-low)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        <div className="relative">
          <div className="mb-5">
            <span
              className="block text-sm mb-2"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember-text-high)', fontSize: '14px' }}
            >
              {formatBandLabel(selectedBand)}
            </span>
            <div
              className="discovery-slider-wrap relative w-full"
              style={{ '--slider-progress': `${sliderProgress}%` } as React.CSSProperties}
            >
              <input
                type="range"
                min={0}
                max={Math.max(0, ageBands.length - 1)}
                step={1}
                value={selectedBandIndex}
                onChange={(e) => setSelectedBandIndex(Number(e.target.value))}
                className="discovery-age-slider w-full"
                aria-label="Age range"
              />
            </div>
            <p
              className="mt-1.5 text-sm"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)', fontSize: '14px' }}
            >
              We only use age to tailor ideas.
            </p>
            {debugText && (
              <div className="mt-2 text-[11px] px-2 py-1 rounded bg-amber-50" style={{ color: 'var(--ember-text-low)' }}>
                {debugText}
              </div>
            )}
          </div>

          {selectedBandHasPicks ? (
            <>
              <div className="mb-6">
                <p
                  className="mb-3 text-sm"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
                >
                  What do you want help with today?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                  {allTiles.map((tile) => {
                    if (tile.type === 'doorway' && !tile.resolved) {
                      return (
                        <div
                          key={tile.key}
                          className="h-[96px] lg:h-[104px] rounded-xl p-3 flex flex-col gap-1 overflow-hidden opacity-60 cursor-not-allowed border border-[var(--ember-border-subtle)]"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          <tile.icon size={18} strokeWidth={1.5} style={{ color: '#5C646D', flexShrink: 0 }} />
                          <span className="block font-medium line-clamp-1 text-sm" style={{ color: 'var(--ember-text-high)' }}>{tile.label}</span>
                          <span className="block text-xs line-clamp-1" style={{ color: 'var(--ember-text-low)' }}>Coming soon</span>
                        </div>
                      );
                    }
                    const slug = tile.type === 'doorway' ? tile.resolved!.ux_slug : tile.wrapper.ux_slug;
                    const label = tile.type === 'doorway' ? tile.resolved!.ux_label : tile.wrapper.ux_label;
                    const desc = tile.type === 'doorway' ? wrappers.find((w) => w.ux_slug === slug)?.ux_description : tile.wrapper.ux_description;
                    const isSelected = selectedWrapper === slug;
                    const Icon = tile.type === 'doorway' ? tile.icon : getWrapperIcon(tile.wrapper.ux_slug, tile.wrapper.ux_label);
                    return (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => handleWrapperSelect(slug)}
                        className="h-[96px] lg:h-[104px] rounded-xl p-3 text-left transition-all duration-[var(--ember-motion-duration)] cursor-pointer flex flex-col gap-0.5 overflow-hidden motion-reduce:transition-none border"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          backgroundColor: 'var(--ember-surface-primary)',
                          borderColor: isSelected ? 'transparent' : 'var(--ember-border-subtle)',
                          boxShadow: isSelected ? '0 0 18px rgba(255, 99, 71, 0.42)' : 'none',
                          transform: isSelected ? 'translateY(-1px)' : 'none',
                          outline: 'none',
                        }}
                        aria-selected={isSelected}
                      >
                        <Icon size={18} strokeWidth={1.5} style={{ color: '#5C646D', flexShrink: 0 }} />
                        <span className="block font-medium line-clamp-2 text-sm" style={{ color: 'var(--ember-text-high)' }}>{label}</span>
                        <span className="block text-xs line-clamp-1" style={{ color: 'var(--ember-text-low)' }}>
                          {desc || 'See ideas for this focus.'}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {moreWrappers.length > 0 && !showMore && (
                  <button
                    type="button"
                    className="mt-2 text-sm"
                    style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
                    onClick={() => setShowMore(true)}
                  >
                    More
                  </button>
                )}
              </div>

              <div className="lg:sticky lg:bottom-6 lg:pt-4 lg:pb-2 lg:mt-4 lg:rounded-xl lg:bg-white lg:border-t lg:border-[var(--ember-border-subtle)] space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!ctaEnabled) return;
                    router.push(`${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper!)}&show=1`, { scroll: false });
                  }}
                  className="w-full rounded-lg py-3 px-4 font-medium text-white h-12 cursor-pointer disabled:cursor-default"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    backgroundColor: 'var(--ember-accent-base)',
                    opacity: ctaEnabled ? 1 : 0.3,
                    borderRadius: '8px',
                  }}
                  aria-disabled={!ctaEnabled}
                  onMouseEnter={(e) => {
                    if (ctaEnabled) e.currentTarget.style.backgroundColor = 'var(--ember-accent-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--ember-accent-base)';
                  }}
                >
                  Show my 3 ideas
                </button>
                <p className="text-center text-sm" style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}>
                  Takes about a minute.
                </p>
              </div>
            </>
          ) : (
            <div
              className="rounded-xl border p-6 text-center"
              style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-soft)' }}
            >
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
                Catalogue coming soon for {formatBandLabel(ageBand)}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const rightSurface = (
    <div
      className="w-full lg:max-w-[420px] shrink-0 lg:sticky"
      style={{ ...SURFACE_STYLE, top: 'calc(var(--header-height, 56px) + 1.5rem)' }}
    >
      <div className="py-6 px-4 sm:px-6 sm:py-8 flex flex-col gap-6">
        <section id="findsSection">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h2 className="text-lg font-medium m-0" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
              {isExampleMode ? 'A quick example' : `Three ideas for ${selectedWrapperLabel}`}
            </h2>
            {!isExampleMode && displayIdeas.length > 0 && (
              <button
                type="button"
                className="rounded-lg border-0 bg-transparent py-2 px-0 text-sm cursor-pointer"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)', fontSize: '14px' }}
                onClick={() => setWhyOpen((o) => !o)}
              >
                Why these?
              </button>
            )}
          </div>

          {whyOpen && !isExampleMode && displayIdeas.length > 0 && (
            <div
              className="mb-4 rounded-xl border p-4"
              style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-soft)' }}
            >
              <h3 className="mb-2 text-base font-medium" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
                Why these?
              </h3>
              <ul className="m-0 list-disc pl-5 space-y-1 text-sm" style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-high)' }}>
                <li>Why it fits this age: chosen for {formatBandLabel(selectedBand)}.</li>
                <li>Why it helps today: matches the focus you picked ({selectedWrapperLabel}).</li>
              </ul>
            </div>
          )}

          {!selectedBandHasPicks ? (
            <div className="rounded-xl border p-4 text-center" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}>
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>Catalogue coming soon for {formatBandLabel(ageBand)}.</p>
            </div>
          ) : isExampleMode && exampleProducts.length === 0 ? (
            <div className="rounded-xl border p-4 text-center" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}>
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>Catalogue coming soon for {formatBandLabel(ageBand)}.</p>
            </div>
          ) : !showPicks ? (
            <div className="rounded-xl border p-4 text-center" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}>
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>Choose a focus to see three ideas.</p>
            </div>
          ) : showPicks && picks.length === 0 ? (
            <div className="rounded-xl border p-4 text-center" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}>
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>We&apos;re still building ideas for this focus. Try another.</p>
            </div>
          ) : (
            <>
              {!isExampleMode && (
                <p className="text-xs mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}>
                  Chosen for {formatBandLabel(selectedBand)} • Explained
                </p>
              )}
              <div className="space-y-4">
                {displayIdeas.map((pick, index) => (
                  <IdeaCard key={pick.product.id} pick={pick} index={index} doorwayLabel={!isExampleMode ? selectedWrapperLabel : undefined} />
                ))}
              </div>
            </>
          )}
        </section>

        <section>
          <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
            Example results
          </h3>
          <img
            src={PLACEHOLDER_IMAGE}
            alt="Toddler playing with toys in a living room"
            className="w-full rounded-xl object-cover"
            style={{ aspectRatio: '16/10', borderRadius: '12px' }}
          />
        </section>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full px-4 py-6 sm:px-6 sm:py-8"
      style={{ backgroundColor: 'var(--ember-bg-canvas)' }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="hidden md:flex md:gap-10 lg:gap-12 md:items-start">
          {leftSurface}
          {rightSurface}
        </div>
        <div className="md:hidden flex flex-col gap-8">
          {leftSurface}
          {rightSurface}
        </div>
      </div>
    </div>
  );
}
