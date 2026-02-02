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
  wrappers: Wrapper[];
  selectedWrapperSlug: string | null;
  showPicks: boolean;
  picks: PickItem[];
}

export default function NewLandingPageClient({
  ageBands,
  ageBand,
  selectedBandHasPicks,
  monthParam,
  wrappers,
  selectedWrapperSlug,
  showPicks,
  picks,
}: NewLandingPageClientProps) {
  const router = useRouter();
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
    return Math.round((range.min + range.max) / 2);
  };

  const getBandIndexById = (id: string | null): number => {
    if (!id) return 0;
    const idx = ageBands.findIndex(b => b.id === id);
    return idx >= 0 ? idx : 0;
  };

  const propBandIndex = getBandIndexById(ageBand?.id ?? null);
  const [selectedBandIndex, setSelectedBandIndex] = useState(propBandIndex);
  const [selectedWrapper, setSelectedWrapper] = useState<string | null>(selectedWrapperSlug);

  // Sync state with props when route changes
  useEffect(() => {
    setSelectedBandIndex(propBandIndex);
    setSelectedWrapper(selectedWrapperSlug);
  }, [propBandIndex, selectedWrapperSlug]);

  const selectedBand = ageBands[selectedBandIndex] ?? ageBand;
  const currentMonth = monthParam ?? 26;

  // When picks are requested, scroll directly to results.
  useEffect(() => {
    if (!showPicks) return;
    const el = document.getElementById('findsSection');
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 0);
  }, [showPicks]);

  // Update URL when age changes (deep linking)
  useEffect(() => {
    if (selectedBandIndex !== propBandIndex) {
      const nextBand = ageBands[selectedBandIndex] ?? null;
      const repMonth = getRepresentativeMonthForBand(nextBand) ?? currentMonth;
      router.push(`/new/${repMonth}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBandIndex]);

  // Handle age-band slider change (index into ageBands)
  const handleAgeBandChange = (index: number) => {
    setSelectedBandIndex(index);
  };

  const handleWrapperSelect = (wrapperSlug: string) => {
    setSelectedWrapper(wrapperSlug);
    if (showPicks) {
      router.push(`/new/${currentMonth}?wrapper=${encodeURIComponent(wrapperSlug)}&show=1`, { scroll: false });
    }
  };

  // Build signin redirect URL with current state
  const getSigninUrl = (productId?: string) => {
    const params = new URLSearchParams();
    const next = selectedWrapper
      ? `/new/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1`
      : `/new/${currentMonth}`;
    params.set('next', next);
    if (productId) {
      params.set('productId', productId);
    }
    return `/signin?${params.toString()}`;
  };

  // Non-prod debug badge:
  // - show on Vercel previews (and localhost)
  // - hide on production host
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
      ? `path: ${debugPath ?? ''} | month param: ${monthParam} → resolved band: ${ageBand.id} (rule: min≤m≤max; tie-break: highest min_months)`
      : null;

  return (
    <div className="max-w-[430px] mx-auto px-3.5 pb-14" style={{
      background: 'linear-gradient(180deg, #FFF3EA 0%, #FFFDFB 58%, #FFFFFF 100%)',
      minHeight: '100vh',
    }}>
      {/* Hero Section */}
      <section className="pt-4 pb-2.5 relative">
        <h1 className="font-serif text-[28px] leading-[1.06] tracking-[-0.6px] my-1.5" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
          Toy ideas that fit your child&apos;s age.
        </h1>
        <p className="text-sm leading-[1.55] opacity-70 mb-3" style={{ color: '#6B5B52' }}>
          A quick starter set (3 picks + the &quot;why&quot;), then save your shortlist to unlock more like what they love.
        </p>

        {/* Promise Pills */}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs px-2.5 py-2 rounded-full border bg-white/65 shadow-sm" style={{ 
            color: 'rgba(23,17,14,.84)',
            borderColor: 'rgba(23,17,14,.10)',
          }}>
            No child name
          </span>
          <span className="text-xs px-2.5 py-2 rounded-full border bg-white/65 shadow-sm" style={{ 
            color: 'rgba(23,17,14,.84)',
            borderColor: 'rgba(23,17,14,.10)',
          }}>
            Under a minute
          </span>
          <span className="text-xs px-2.5 py-2 rounded-full border bg-white/65 shadow-sm" style={{ 
            color: 'rgba(23,17,14,.84)',
            borderColor: 'rgba(23,17,14,.10)',
          }}>
            Reasoned picks
          </span>
        </div>

        {/* Control Deck */}
        <div className="mt-3.5 rounded-[28px] bg-gradient-to-b from-white/86 to-white/66 border shadow-md overflow-hidden relative" style={{
          borderColor: 'rgba(23,17,14,.08)',
          boxShadow: '0 18px 46px rgba(23,17,14,.10)',
        }}>
          <div className="p-4 pb-3.5 relative">
            {/* Age Slider Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2.5 mb-2">
                <label className="text-sm opacity-70" style={{ color: '#6B5B52' }}>
                  Age range:
                </label>
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-full bg-white/78 border shadow-xs" style={{
                  borderColor: 'rgba(23,17,14,.10)',
                }}>
                  <strong className="font-extrabold text-xs">{formatBandLabel(selectedBand)}</strong>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={0}
                max={Math.max(0, ageBands.length - 1)}
                step={1}
                value={selectedBandIndex}
                onChange={(e) => handleAgeBandChange(Number(e.target.value))}
                className="w-full new-age-slider"
              />

              {/* Tick marks */}
              <div className="flex justify-between text-[11px] opacity-42 mt-0.5 px-0.5" style={{ color: 'rgba(23,17,14,.42)' }}>
                {ageBands.map((band) => (
                  <span key={band.id}>{formatBandTick(band)}</span>
                ))}
              </div>

              {debugText && (
                <div className="mt-2 text-[11px] opacity-60" style={{ color: '#6B5B52' }}>
                  {debugText}
                </div>
              )}
            </div>

            {/* Trust indicator */}
            <div className="flex items-center gap-2 mt-1.5 mb-4">
              <span className="w-[7px] h-[7px] rounded-full" style={{
                background: 'rgba(227,91,63,.55)',
                boxShadow: '0 8px 18px rgba(227,91,63,.22)',
              }}></span>
              <span className="text-xs opacity-70" style={{ color: '#8A756A' }}>
                We only use age + what you pick below to tailor ideas.
              </span>
            </div>

            {selectedBandHasPicks ? (
              <>
                {/* Wrapper Selection */}
                <div className="mb-4">
                  <div className="text-sm opacity-70 mb-2.5" style={{ color: '#6B5B52' }}>
                    What do you want help with today?
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {wrappers.map((w) => {
                      const isSelected = selectedWrapper === w.ux_slug;
                      return (
                        <button
                          key={w.ux_wrapper_id}
                          onClick={() => handleWrapperSelect(w.ux_slug)}
                          className="min-h-[74px] p-3 rounded-[20px] border bg-white/92 shadow-xs cursor-pointer transition-all flex items-center gap-3 relative overflow-hidden"
                          style={{
                            borderColor: isSelected ? 'rgba(227,91,63,.42)' : 'rgba(23,17,14,.10)',
                            boxShadow: isSelected ? '0 18px 40px rgba(227,91,63,.16)' : '0 6px 16px rgba(23,17,14,.06)',
                            background: isSelected 
                              ? 'radial-gradient(circle at 20% 15%, rgba(244,167,122,.28), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.65) 70%)'
                              : 'linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.65) 70%)',
                          }}
                          aria-selected={isSelected}
                        >
                          {/* Icon placeholder */}
                          <div className="w-[42px] h-[42px] rounded-2xl bg-gradient-to-br from-white via-orange-200 to-orange-400 border flex-shrink-0" style={{
                            borderColor: 'rgba(255,255,255,.55)',
                            boxShadow: '0 16px 30px rgba(227,91,63,.18)',
                          }}></div>
                          <div className="min-w-0 flex-1">
                            <strong className="block text-sm font-extrabold leading-tight mb-0.5 tracking-[-0.15px]">
                              {w.ux_label}
                            </strong>
                            <span className="block text-xs opacity-70 whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#6B5B52' }}>
                              {w.ux_description || 'See picks that fit this focus.'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      if (!selectedWrapper) return;
                      router.push(`/new/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1`, { scroll: false });
                    }}
                    className="w-full min-h-[44px] rounded-[20px] border-0 py-3.5 px-4 font-extrabold text-[15px] tracking-[0.1px] text-white cursor-pointer transition-all"
                    style={{
                      background: 'linear-gradient(180deg, rgba(227,91,63,.98) 0%, rgba(185,67,52,.98) 100%)',
                      boxShadow: '0 22px 48px rgba(227,91,63,.26)',
                      opacity: selectedWrapper ? 1 : 0.6,
                    }}
                    aria-disabled={!selectedWrapper}
                  >
                    Show my 3 picks
                  </button>
                  <p className="text-center text-xs opacity-70" style={{ color: '#8A756A' }}>
                    Tip: save one thing to unlock &quot;more like this&quot;.
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm p-6 text-center" style={{
                borderColor: 'rgba(23,17,14,.08)',
              }}>
                <p className="text-sm opacity-70 mb-2" style={{ color: '#6B5B52' }}>
                  We&apos;re still building picks for {formatBandLabel(ageBand)}.
                </p>
                <p className="text-xs opacity-70 m-0" style={{ color: '#8A756A' }}>
                  Catalogue coming soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section id="findsSection" className="mt-4.5 pt-1.5">
        <div className="flex items-baseline justify-between gap-2.5 mb-2.5">
          <h2 className="text-base font-black tracking-[-0.15px] m-0">
            Your 3 picks
          </h2>
          <button className="bg-white/62 border rounded-2xl px-3 py-2.5 text-sm opacity-70 shadow-xs cursor-pointer" style={{
            borderColor: 'rgba(23,17,14,.10)',
            color: '#6B5B52',
          }}>
            Why these?
          </button>
        </div>

        {/* Cards */}
        {!selectedBandHasPicks ? (
          <div className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm p-6 text-center" style={{
            borderColor: 'rgba(23,17,14,.08)',
          }}>
            <p className="text-sm opacity-70 mb-2" style={{ color: '#6B5B52' }}>
              We&apos;re still building picks for {formatBandLabel(ageBand)}.
            </p>
            <p className="text-xs opacity-70 m-0" style={{ color: '#8A756A' }}>
              Catalogue coming soon.
            </p>
          </div>
        ) : !showPicks ? (
          <div className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm p-6 text-center" style={{
            borderColor: 'rgba(23,17,14,.08)',
          }}>
            <p className="text-sm opacity-70 mb-2" style={{ color: '#6B5B52' }}>
              Choose a focus above, then tap “Show my 3 picks”.
            </p>
          </div>
        ) : showPicks && picks.length === 0 ? (
          <div className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm p-6 text-center" style={{
            borderColor: 'rgba(23,17,14,.08)',
          }}>
            <p className="text-sm opacity-70 mb-2" style={{ color: '#6B5B52' }}>
              We&apos;re still building picks for this focus in this age range. Try another focus.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {picks.map((pick, index) => (
              <article
                key={pick.product.id}
                className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm overflow-hidden"
                style={{
                  borderColor: 'rgba(23,17,14,.08)',
                  boxShadow: '0 12px 28px rgba(23,17,14,.08)',
                }}
              >
                {/* Media placeholder */}
                <div className="h-[162px] relative bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
                  <div className="absolute left-3 top-3 px-2.5 py-2 rounded-full bg-white/78 border backdrop-blur-sm shadow-xs inline-flex items-center gap-2" style={{
                    borderColor: 'rgba(255,255,255,.55)',
                  }}>
                    <span className="w-2 h-2 rounded-full" style={{
                      background: 'rgba(227,91,63,.60)',
                      boxShadow: '0 10px 20px rgba(227,91,63,.25)',
                    }}></span>
                    <span className="text-xs opacity-80" style={{ color: 'rgba(23,17,14,.80)' }}>
                      Pick {index + 1}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-2.5">
                  <div>
                    <strong className="block text-base font-black tracking-[-0.2px] mb-0.5">
                      Try: {pick.product.name}
                    </strong>
                    <span className="block text-xs leading-[1.45] opacity-70" style={{ color: '#8A756A' }}>
                      {pick.categoryType.label || pick.categoryType.name || 'Toy category'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 items-center mt-1">
                    <Link
                      href={getSigninUrl(pick.product.id)}
                      className="flex-1 min-h-[44px] rounded-[20px] border bg-white/88 shadow-xs font-black text-sm text-inherit cursor-pointer transition-all flex items-center justify-center"
                      style={{
                        borderColor: 'rgba(23,17,14,.10)',
                      }}
                    >
                      Save to shortlist
                    </Link>
                    <button
                      className="flex-shrink-0 text-sm opacity-70 py-2.5 px-2.5 rounded-2xl border-0 bg-transparent cursor-pointer"
                      style={{ color: '#6B5B52' }}
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

