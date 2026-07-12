'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';

type AgeBand = {
  id: string;
  label: string | null;
  min_months: number | null;
  max_months: number | null;
};

function rangeOf(band: AgeBand | undefined): { min: number; max: number } | null {
  if (!band) return null;
  const min = typeof band.min_months === 'number' ? band.min_months : NaN;
  const max = typeof band.max_months === 'number' ? band.max_months : NaN;
  if (!Number.isNaN(min) && !Number.isNaN(max)) return { min, max };
  const match = band.id?.match(/(\d+)\D+(\d+)/);
  if (match) return { min: Number(match[1]), max: Number(match[2]) };
  return null;
}

// The newborn band (0-0 months) represents an unborn baby: show "Expecting",
// mirroring /discover's formatBandLabel.
function isExpectingRange(r: { min: number; max: number } | null): boolean {
  return !!r && r.min === 0 && r.max === 0;
}

// Match /discover's formatBandLabel exactly: derive from min/max, not the label field.
function longLabel(band: AgeBand | undefined): string {
  const r = rangeOf(band);
  if (isExpectingRange(r)) return 'Expecting';
  return r ? `${r.min}–${r.max} months` : band?.label ?? '';
}

function shortLabel(band: AgeBand | undefined): string {
  const r = rangeOf(band);
  if (isExpectingRange(r)) return 'Expecting';
  return r ? `${r.min}–${r.max}m` : band?.label ?? '';
}

export function HomeAgeSlider() {
  const reducedMotion = useReducedMotion() ?? false;
  const [bands, setBands] = useState<AgeBand[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Pull the exact age-band taxonomy /discover uses so the two sliders stay in sync.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/discover/age-bands');
        if (!res.ok) return;
        const data = (await res.json()) as { bands?: AgeBand[] };
        const next = Array.isArray(data.bands) ? data.bands.filter((b) => b && b.id) : [];
        if (!cancelled && next.length > 0) {
          setBands(next);
          setSelectedIndex(Math.floor((next.length - 1) / 2));
        }
      } catch {
        // Leave the slider in its loading state if the taxonomy can't be fetched.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ready = bands.length > 0;
  const lastIndex = Math.max(0, bands.length - 1);
  const selectedBand = bands[selectedIndex];
  const currentAgeLabel = longLabel(selectedBand);
  const sliderProgress = useMemo(
    () => (lastIndex > 0 ? (selectedIndex / lastIndex) * 100 : 0),
    [selectedIndex, lastIndex]
  );
  // Navigate using the band's start month, exactly as the /discover slider does.
  const repMonth = rangeOf(selectedBand)?.min ?? 26;
  const discoverHref = `/discover/${repMonth}`;

  return (
    <section className="bg-[var(--ember-surface-primary)] border-y border-[var(--ember-border-subtle)]">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <p className="text-lg text-[var(--ember-text-low)] mb-2">My child&apos;s current age</p>
            <motion.p
              key={currentAgeLabel || 'loading'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="text-3xl lg:text-4xl text-[var(--ember-text-high)] font-bold"
            >
              {ready ? currentAgeLabel : '\u00A0'}
            </motion.p>
          </div>

          <div className="mb-10 max-w-2xl mx-auto">
            <div
              className="discovery-slider-wrap relative w-full h-6"
              style={{ ['--slider-progress' as string]: `${sliderProgress}%` }}
            >
              <input
                type="range"
                min={0}
                max={lastIndex}
                step={1}
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                disabled={!ready}
                className="discovery-age-slider w-full"
                aria-label="Select your toddler's age range"
              />
            </div>

            {/* Inset by half the thumb width (12px) so the ticks line up with the
                native slider thumb positions across the whole track. Every band gets a
                tick mark; labels thin out on small screens so they stay readable. */}
            <div className="relative mx-3 mt-3 h-12">
              {ready
                ? bands.map((band, index) => {
                    const pct = lastIndex > 0 ? (index / lastIndex) * 100 : 0;
                    const active = index === selectedIndex;
                    const isEdge = index === 0 || index === lastIndex;
                    const showLabelOnMobile = active || isEdge || index % 2 === 0;
                    return (
                      <button
                        key={band.id}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                        style={{ left: `${pct}%` }}
                        aria-label={longLabel(band)}
                      >
                        <span
                          className={`mb-1 block w-[2px] rounded-full transition-all ${
                            active ? 'h-3 bg-[var(--ember-accent-base)]' : 'h-2 bg-[var(--ember-border-subtle)]'
                          }`}
                        />
                        <span
                          className={`text-[10px] sm:text-[11px] leading-tight whitespace-nowrap transition-colors ${
                            showLabelOnMobile ? 'block' : 'hidden sm:block'
                          } ${
                            active
                              ? 'text-[var(--ember-accent-base)] font-semibold'
                              : 'text-[var(--ember-text-low)]'
                          }`}
                        >
                          {shortLabel(band)}
                        </span>
                      </button>
                    );
                  })
                : null}
            </div>
          </div>

          <div className="text-center">
            <Link href={discoverHref} passHref legacyBehavior>
              <motion.a
                href={discoverHref}
                whileHover={reducedMotion ? {} : { scale: 1.02 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--ember-accent-base)] text-white text-lg rounded-xl transition-all duration-300 hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_12px_40px_rgba(255,92,52,0.35)] font-medium"
              >
                Begin your journey
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </motion.a>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
