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

// Fallback mirrors the /discover taxonomy so the slider renders instantly and
// still works if the bands endpoint is unavailable; the live fetch below keeps
// the homepage and /discover in sync.
const FALLBACK_BANDS: AgeBand[] = [
  { id: '23-25m', label: '23–25 months', min_months: 23, max_months: 25 },
  { id: '25-27m', label: '25–27 months', min_months: 25, max_months: 27 },
  { id: '28-30m', label: '28–30 months', min_months: 28, max_months: 30 },
  { id: '31-33m', label: '31–33 months', min_months: 31, max_months: 33 },
  { id: '34-36m', label: '34–36 months', min_months: 34, max_months: 36 },
];

function bandLabelFor(band: AgeBand | undefined): string {
  if (!band) return '';
  if (band.label && band.label.trim()) return band.label.trim();
  if (band.min_months != null && band.max_months != null) {
    return `${band.min_months}–${band.max_months} months`;
  }
  return '';
}

export function HomeAgeSlider() {
  const reducedMotion = useReducedMotion() ?? false;
  const [bands, setBands] = useState<AgeBand[]>(FALLBACK_BANDS);
  const [selectedIndex, setSelectedIndex] = useState(() => Math.floor((FALLBACK_BANDS.length - 1) / 2));

  // Pull the same age-band taxonomy /discover uses so the two sliders stay in sync.
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
        // Keep fallback bands on failure.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const lastIndex = Math.max(0, bands.length - 1);
  const selectedBand = bands[selectedIndex] ?? bands[0];
  const currentAgeLabel = bandLabelFor(selectedBand);
  const sliderProgress = useMemo(
    () => (lastIndex > 0 ? (selectedIndex / lastIndex) * 100 : 0),
    [selectedIndex, lastIndex]
  );
  // Navigate using the band's start month, exactly as the /discover slider does,
  // so the landing page resolves to the same band the user selected here.
  const repMonth = selectedBand?.min_months ?? 26;
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
            <p className="text-lg text-[var(--ember-text-low)] mb-2">My toddler&apos;s current age</p>
            <motion.p
              key={currentAgeLabel}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="text-3xl lg:text-4xl text-[var(--ember-text-high)]"
              style={{ fontWeight: 600 }}
            >
              {currentAgeLabel}
            </motion.p>
          </div>

          <div className="mb-10 max-w-xl mx-auto">
            <div
              className="discovery-slider-wrap relative w-full h-6 mb-3"
              style={{ ['--slider-progress' as string]: `${sliderProgress}%` }}
            >
              <input
                type="range"
                min={0}
                max={lastIndex}
                step={1}
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="discovery-age-slider w-full"
                aria-label="Select your toddler's age range"
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--ember-text-low)]">
              <span>{bandLabelFor(bands[0]).replace(' months', 'm')}</span>
              <span>{bandLabelFor(bands[lastIndex]).replace(' months', 'm')}</span>
            </div>
          </div>

          <div className="text-center">
            <Link href={discoverHref} passHref legacyBehavior>
              <motion.a
                href={discoverHref}
                whileHover={reducedMotion ? {} : { scale: 1.02 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--ember-accent-base)] text-white text-lg rounded-xl transition-all duration-300 hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_12px_40px_rgba(255,99,71,0.35)]"
                style={{ fontWeight: 600 }}
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
