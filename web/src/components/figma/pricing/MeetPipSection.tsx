'use client';

import Image from 'next/image';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';
import { PIP_LOGO_URL } from './pricingImages';

/** Compact Meet Pip profile. */
export function MeetPipSection() {
  return (
    <section id="meet-pip" className="py-12 lg:py-16">
      <div className={EMBER_MARKETING_CONTAINER}>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#E7E2DC] bg-white">
          <div className="flex flex-col items-center gap-8 p-8 text-center sm:flex-row sm:items-center sm:gap-10 sm:p-10 sm:text-left">
            <div className="relative shrink-0">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-[#F1DED3] bg-[#FFF6F3] shadow-[0_20px_40px_-12px_rgba(255,92,52,0.25)] sm:h-40 sm:w-40">
                <Image
                  src={PIP_LOGO_URL}
                  alt="Pip"
                  width={120}
                  height={120}
                  className="h-[100px] w-auto sm:h-[110px]"
                  unoptimized
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FF5C34] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Comes with Plus
              </span>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#FF5C34]">
                Meet Pip
              </p>
              <h2
                className="mb-3 font-semibold tracking-[-0.01em] text-[#253044]"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.2 }}
              >
                The bit of Ember that does the homework with you
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-[#66717D]">
                Free Ember is what you browse when you&apos;ve got a minute. Pip is who you get with
                Plus — a nudge when something&apos;s changing, a few options when you might buy, and a
                prod when it&apos;s time to clear space. Less scrolling. Fewer 90-minute rabbit holes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
