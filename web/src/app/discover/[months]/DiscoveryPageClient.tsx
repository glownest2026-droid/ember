'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { GatewayPick, GatewayWrapperPublic } from '@/lib/pl/public';
import { getWrapperIcon } from './_lib/wrapperIcons';

const SURFACE_STYLE = {
  backgroundColor: 'var(--ember-surface-primary)',
  borderRadius: '12px',
  boxShadow: '0px 4px 24px rgba(0,0,0,0.04)',
};

/* TODO: replace with local brand-approved image asset */
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
  showDebug = false,
}: DiscoveryPageClientProps) {
  const router = useRouter();
  const [whyOpen, setWhyOpen] = useState(false);
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

  const handleAgeBandChange = (index: number) => setSelectedBandIndex(index);

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

  const ctaEnabled = !!selectedBand && !!selectedWrapper;
  const selectedWrapperLabel = wrappers.find((w) => w.ux_slug === selectedWrapper)?.ux_label ?? selectedWrapper ?? '';

  const debugText =
    showDebug && monthParam !== null && ageBand !== null
      ? `path → band: ${ageBand.id}${resolutionDebug ? ` | ${resolutionDebug}` : ''}`
      : null;

  const sliderProgress = ageBands.length > 0 ? (selectedBandIndex / Math.max(1, ageBands.length - 1)) * 100 : 0;

  const leftSurface = (
    <div className="w-full md:max-w-[640px] lg:max-w-[560px] shrink-0" style={SURFACE_STYLE}>
      <div className="py-6 px-4 sm:px-6 sm:py-8">
        <section className="mb-6">
          <h1
            className="mb-2 text-[28px] leading-[1.1] md:text-[32px]"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
          >
            Ideas that fit.
          </h1>
          <p
            className="mb-4 text-base leading-[1.6]"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
          >
            A short set of three picks and why they fit—then save what you like to your shortlist.
          </p>
          <div className="flex flex-wrap gap-2">
            {['No child name', 'Under a minute', 'Reasoned picks'].map((label) => (
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
                onChange={(e) => handleAgeBandChange(Number(e.target.value))}
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
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {wrappers.map((w) => {
                    const isSelected = selectedWrapper === w.ux_slug;
                    const Icon = getWrapperIcon(w.ux_slug, w.ux_label);
                    return (
                      <button
                        key={w.ux_wrapper_id}
                        type="button"
                        onClick={() => handleWrapperSelect(w.ux_slug)}
                        className="min-h-[72px] rounded-xl p-3 lg:p-3 text-left transition-all duration-[var(--ember-motion-duration)] cursor-pointer flex flex-col gap-1 motion-reduce:transition-none"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          backgroundColor: 'var(--ember-surface-primary)',
                          border: isSelected ? 'none' : '1px solid var(--ember-border-subtle)',
                          boxShadow: isSelected ? '0px 0px 28px rgba(255, 99, 71, 0.35)' : 'none',
                          outline: 'none',
                        }}
                        aria-selected={isSelected}
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            color: isSelected ? 'var(--ember-accent-hover)' : 'var(--ember-text-low)',
                            flexShrink: 0,
                          }}
                        />
                        <span
                          className="block font-medium leading-tight"
                          style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ember-text-high)' }}
                        >
                          {w.ux_label}
                        </span>
                        <span
                          className="block text-sm line-clamp-2"
                          style={{ color: 'var(--ember-text-low)' }}
                        >
                          {w.ux_description || 'See picks that fit this focus.'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!ctaEnabled) return;
                    router.push(
                      `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper!)}&show=1`,
                      { scroll: false }
                    );
                  }}
                  className="w-full rounded-lg py-3 px-4 font-medium text-white transition-all duration-[var(--ember-motion-duration)] cursor-pointer disabled:cursor-default"
                  style={{
                    height: '48px',
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
                  Show my 3 picks
                </button>
                <p
                  className="text-center text-sm"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)', fontSize: '14px' }}
                >
                  Takes about a minute.
                </p>
              </div>
            </>
          ) : (
            <div
              className="rounded-xl border p-6 text-center"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-surface-soft)',
              }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--ember-text-low)' }}>
                We&apos;re still building picks for {formatBandLabel(ageBand)}.
              </p>
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
                Catalogue coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const rightSurface = (
    <div
      className="w-full md:max-w-[400px] lg:max-w-[360px] shrink-0 lg:sticky"
      style={{ ...SURFACE_STYLE, top: 'calc(var(--header-height, 56px) + 1.5rem)' }}
    >
      <div className="py-6 px-4 sm:px-6 sm:py-8 flex flex-col gap-6">
        <section id="findsSection">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h2
              className="text-lg font-medium m-0"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
            >
              Your 3 picks
            </h2>
            <button
              type="button"
              className="rounded-lg border-0 bg-transparent py-2 px-0 text-sm cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)', fontSize: '14px' }}
              onClick={() => setWhyOpen((o) => !o)}
            >
              Why these?
            </button>
          </div>

          {whyOpen && (
            <div
              className="mb-4 rounded-xl border p-4"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-surface-soft)',
              }}
            >
              <h3
                className="mb-2 text-base font-medium"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
              >
                Why these?
              </h3>
              <ul
                className="m-0 list-disc pl-5 space-y-1 text-sm"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-high)' }}
              >
                <li>Chosen for this age range ({formatBandLabel(selectedBand)}).</li>
                <li>Here&apos;s why: they match the focus you picked ({selectedWrapperLabel || 'this focus'}).</li>
                <li>Curated for relevance and fit—no automated guessing.</li>
              </ul>
            </div>
          )}

          {!selectedBandHasPicks ? (
            <div
              className="rounded-xl border p-6 text-center"
              style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}
            >
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
                Catalogue coming soon.
              </p>
            </div>
          ) : !showPicks ? (
            <div
              className="rounded-xl border p-6 text-center"
              style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}
            >
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
                Choose a focus, then tap &quot;Show my 3 picks&quot;.
              </p>
            </div>
          ) : showPicks && picks.length === 0 ? (
            <div
              className="rounded-xl border p-6 text-center"
              style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}
            >
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
                We&apos;re still building picks for this focus. Try another.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {picks.map((pick, index) => (
                <article
                  key={pick.product.id}
                  className="rounded-xl border overflow-hidden"
                  style={{
                    borderColor: 'var(--ember-border-subtle)',
                    backgroundColor: 'var(--ember-surface-primary)',
                  }}
                >
                  <div className="h-[100px] relative bg-[var(--ember-surface-soft)]">
                    <div
                      className="absolute left-2 top-2 rounded-lg px-2 py-1 text-xs"
                      style={{
                        backgroundColor: 'var(--ember-surface-primary)',
                        border: '1px solid var(--ember-border-subtle)',
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--ember-text-low)',
                      }}
                    >
                      Pick {index + 1}
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <strong
                      className="block font-medium text-sm"
                      style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-high)' }}
                    >
                      {pick.product.name}
                    </strong>
                    <span className="block text-xs" style={{ color: 'var(--ember-text-low)' }}>
                      {pick.categoryType.label || pick.categoryType.name || 'Toy category'}
                    </span>
                    <Link
                      href={getSigninUrl(pick.product.id)}
                      className="block w-full min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center"
                      style={{
                        borderColor: 'var(--ember-border-subtle)',
                        backgroundColor: 'var(--ember-surface-primary)',
                        color: 'var(--ember-text-high)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      Save to shortlist
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3
            className="text-base font-medium mb-3"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
          >
            What most parents see
          </h3>
          <img
            src={PLACEHOLDER_IMAGE}
            alt=""
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
      style={{
        backgroundColor: 'var(--ember-bg-canvas)',
        transition: 'background-color var(--ember-motion-duration) var(--ember-motion-ease)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Desktop: two-panel */}
        <div className="hidden md:flex md:gap-8 lg:gap-10 md:items-start">
          {leftSurface}
          {rightSurface}
        </div>

        {/* Mobile: single column */}
        <div className="md:hidden flex flex-col gap-8">
          {leftSurface}
          {rightSurface}
        </div>
      </div>
    </div>
  );
}
