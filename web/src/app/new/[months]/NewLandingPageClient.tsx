'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { GatewayPick, GatewayWrapperPublic } from '../../../lib/pl/public';

interface AgeBand {
  id: string;
  label?: string | null;
  min_months: number | null;
  max_months: number | null;
}

type Wrapper = Pick<GatewayWrapperPublic, 'ux_wrapper_id' | 'ux_label' | 'ux_slug' | 'ux_description' | 'rank'>;
type PickItem = GatewayPick;

interface NewLandingPageClientProps {
  ageBands: AgeBand[];
  ageBand: AgeBand | null;
  selectedBandHasPicks: boolean;
  monthParam: number | null;
  resolutionDebug?: string | null;
  wrappers: Wrapper[];
  selectedWrapperSlug: string | null;
  showPicks: boolean;
  picks: PickItem[];
  basePath?: string; // '/new' or '/discover' for URL building
}

export default function NewLandingPageClient({
  ageBands,
  ageBand,
  selectedBandHasPicks,
  monthParam,
  resolutionDebug,
  wrappers,
  selectedWrapperSlug,
  showPicks,
  picks,
  basePath = '/new',
}: NewLandingPageClientProps) {
  const router = useRouter();
  const [whyOpen, setWhyOpen] = useState(false);

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

  const formatBandTick = (band: AgeBand): string => {
    const range = getBandRange(band);
    if (!range) return band.id;
    return `${range.min}–${range.max}m`;
  };

  const getRepresentativeMonthForBand = (band: AgeBand | null): number | null => {
    const range = getBandRange(band);
    if (!range) return null;
    return range.min;
  };

  const getBandIndexById = (id: string | null): number => {
    if (!id) return 0;
    const idx = ageBands.findIndex(b => b.id === id);
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
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }, [showPicks]);

  useEffect(() => {
    if (selectedBandIndex !== propBandIndex) {
      const nextBand = ageBands[selectedBandIndex] ?? null;
      const repMonth = getRepresentativeMonthForBand(nextBand) ?? currentMonth;
      router.push(`${basePath}/${repMonth}`, { scroll: false });
    }
  }, [selectedBandIndex, basePath, currentMonth, ageBands, propBandIndex, router]);

  const handleAgeBandChange = (index: number) => {
    setSelectedBandIndex(index);
  };

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
  const selectedWrapperLabel = wrappers.find(w => w.ux_slug === selectedWrapper)?.ux_label ?? selectedWrapper ?? '';

  const [showDebug, setShowDebug] = useState(false);
  const [debugPath, setDebugPath] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    setShowDebug(host !== 'ember-mocha-eight.vercel.app');
    setDebugPath(`${window.location.pathname}${window.location.search}`);
  }, []);
  const debugText =
    showDebug && monthParam !== null && ageBand !== null
      ? `path: ${debugPath ?? ''} | month param: ${monthParam} → resolved band: ${ageBand.id}${resolutionDebug ? ` | ${resolutionDebug}` : ''}`
      : null;

  const sliderProgress = ageBands.length > 0 ? (selectedBandIndex / Math.max(1, ageBands.length - 1)) * 100 : 0;

  return (
    <div
      className="min-h-screen w-full px-4 py-6 sm:px-6 sm:py-8"
      style={{
        backgroundColor: 'var(--ember-bg-canvas)',
        transition: 'background-color var(--ember-motion-duration) var(--ember-motion-ease)',
      }}
    >
      {/* Central surface container */}
      <div
        className="mx-auto w-full max-w-[100%] rounded-xl py-6 px-4 sm:px-8 sm:py-8 md:max-w-[640px] lg:max-w-[720px]"
        style={{
          backgroundColor: 'var(--ember-surface-primary)',
          borderRadius: '12px',
          boxShadow: '0px 4px 24px rgba(0,0,0,0.04)',
        }}
      >
        {/* Header */}
        <section className="mb-6">
          <h1
            className="mb-2 text-[32px] leading-[1.1] md:text-[48px]"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--ember-text-high)',
            }}
          >
            Ideas that fit this stage.
          </h1>
          <p
            className="mb-4 text-base leading-[1.6]"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--ember-text-low)',
            }}
          >
            A short set of three picks and why they fit—then save what you like to your shortlist.
          </p>

          {/* Trust chips (exactly 3, no icons) */}
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

        {/* Control deck */}
        <div className="relative">
          {/* Age slider */}
          <div className="mb-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ember-text-high)',
                  fontSize: '14px',
                }}
              >
                {formatBandLabel(selectedBand)}
              </span>
            </div>
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
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ember-text-low)',
                fontSize: '14px',
              }}
            >
              We only use age to tailor ideas.
            </p>
            {debugText && (
              <div className="mt-2 text-[11px]" style={{ color: 'var(--ember-text-low)' }}>
                {debugText}
              </div>
            )}
          </div>

          {selectedBandHasPicks ? (
            <>
              {/* Wrapper grid */}
              <div className="mb-6">
                <p
                  className="mb-3 text-sm"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
                >
                  What do you want help with today?
                </p>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {wrappers.map((w) => {
                    const isSelected = selectedWrapper === w.ux_slug;
                    return (
                      <button
                        key={w.ux_wrapper_id}
                        type="button"
                        onClick={() => handleWrapperSelect(w.ux_slug)}
                        className="min-h-[74px] rounded-xl border p-3 text-left transition-all duration-[var(--ember-motion-duration)] cursor-pointer flex items-center gap-3"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          backgroundColor: 'var(--ember-surface-primary)',
                          border: isSelected ? 'none' : '1px solid var(--ember-border-subtle)',
                          boxShadow: isSelected ? '0px 0px 16px rgba(255, 99, 71, 0.4)' : 'none',
                          outline: 'none',
                        }}
                        aria-selected={isSelected}
                      >
                        <div className="min-w-0 flex-1">
                          <span
                            className="block font-medium leading-tight mb-0.5"
                            style={{
                              fontSize: '16px',
                              color: 'var(--ember-text-high)',
                            }}
                          >
                            {w.ux_label}
                          </span>
                          <span
                            className="block text-sm"
                            style={{ color: 'var(--ember-text-low)' }}
                          >
                            {w.ux_description || 'See picks that fit this focus.'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!ctaEnabled) return;
                    router.push(`${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper!)}&show=1`, { scroll: false });
                  }}
                  className="w-full rounded-lg py-3 px-4 font-medium text-white transition-all duration-[var(--ember-motion-duration)] cursor-pointer disabled:cursor-default"
                  style={{
                    height: '48px',
                    fontFamily: 'var(--font-sans)',
                    backgroundColor: ctaEnabled ? 'var(--ember-accent-base)' : 'var(--ember-accent-base)',
                    opacity: ctaEnabled ? 1 : 0.3,
                    borderRadius: '8px',
                  }}
                  aria-disabled={!ctaEnabled}
                  onMouseEnter={(e) => {
                    if (ctaEnabled) e.currentTarget.style.backgroundColor = 'var(--ember-accent-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ctaEnabled ? 'var(--ember-accent-base)' : 'var(--ember-accent-base)';
                  }}
                >
                  Show my 3 picks
                </button>
                <p
                  className="text-center text-sm"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--ember-text-low)',
                    fontSize: '14px',
                  }}
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

      {/* Picks section */}
      <section id="findsSection" className="mx-auto mt-8 w-full max-w-[100%] md:max-w-[640px] lg:max-w-[720px]">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h2
            className="text-lg font-medium m-0"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--ember-text-high)',
            }}
          >
            Your 3 picks
          </h2>
          <button
            type="button"
            className="rounded-lg border-0 bg-transparent py-2 px-0 text-sm cursor-pointer"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--ember-text-low)',
              fontSize: '14px',
            }}
            onClick={() => setWhyOpen((o) => !o)}
          >
            Why these?
          </button>
        </div>

        {/* Why these? inline block */}
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
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--ember-text-high)',
              }}
            >
              Why these?
            </h3>
            <ul
              className="m-0 list-disc pl-5 space-y-1 text-sm"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ember-text-high)',
              }}
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
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              boxShadow: '0px 4px 24px rgba(0,0,0,0.04)',
            }}
          >
            <p className="text-sm mb-2" style={{ color: 'var(--ember-text-low)' }}>
              We&apos;re still building picks for {formatBandLabel(ageBand)}.
            </p>
            <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
              Catalogue coming soon.
            </p>
          </div>
        ) : !showPicks ? (
          <div
            className="rounded-xl border p-6 text-center"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              boxShadow: '0px 4px 24px rgba(0,0,0,0.04)',
            }}
          >
            <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
              Choose a focus above, then tap &quot;Show my 3 picks&quot;.
            </p>
          </div>
        ) : showPicks && picks.length === 0 ? (
          <div
            className="rounded-xl border p-6 text-center"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              boxShadow: '0px 4px 24px rgba(0,0,0,0.04)',
            }}
          >
            <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
              We&apos;re still building picks for this focus in this age range. Try another focus.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {picks.map((pick, index) => (
              <article
                key={pick.product.id}
                className="rounded-xl border overflow-hidden transition-all duration-[var(--ember-motion-duration)]"
                style={{
                  borderColor: 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-surface-primary)',
                  boxShadow: '0px 4px 24px rgba(0,0,0,0.04)',
                }}
              >
                <div className="h-[162px] relative bg-[var(--ember-surface-soft)]">
                  <div
                    className="absolute left-3 top-3 rounded-lg px-2.5 py-2 inline-flex items-center gap-2"
                    style={{
                      backgroundColor: 'var(--ember-surface-primary)',
                      border: '1px solid var(--ember-border-subtle)',
                    }}
                  >
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
                    >
                      Pick {index + 1}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <strong
                      className="block font-medium mb-0.5"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--ember-text-high)',
                        fontSize: '16px',
                      }}
                    >
                      Try: {pick.product.name}
                    </strong>
                    <span
                      className="block text-sm"
                      style={{ color: 'var(--ember-text-low)' }}
                    >
                      {pick.categoryType.label || pick.categoryType.name || 'Toy category'}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center mt-1">
                    <Link
                      href={getSigninUrl(pick.product.id)}
                      className="flex-1 min-h-[44px] rounded-lg border font-medium text-sm flex items-center justify-center transition-all duration-[var(--ember-motion-duration)]"
                      style={{
                        borderColor: 'var(--ember-border-subtle)',
                        backgroundColor: 'var(--ember-surface-primary)',
                        color: 'var(--ember-text-high)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      Save to shortlist
                    </Link>
                    <button
                      type="button"
                      className="flex-shrink-0 text-sm py-2.5 px-2.5 rounded-lg border-0 bg-transparent cursor-pointer"
                      style={{ color: 'var(--ember-text-low)', fontFamily: 'var(--font-sans)' }}
                    >
                      Already got it?
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
