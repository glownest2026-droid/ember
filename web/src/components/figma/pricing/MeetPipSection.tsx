'use client';

import Image from 'next/image';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';
import { PIP_LOGO_URL } from './pricingImages';

/**
 * Meet Pip — intro profile (before price cards).
 * Compact so Free/Plus still peek on a phone fold.
 */
export function MeetPipSection() {
  return (
    <section id="meet-pip" className="pb-8 pt-2 lg:pb-10 lg:pt-4">
      <div className={EMBER_MARKETING_CONTAINER}>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#E7E2DC] bg-white shadow-[0_12px_40px_-16px_rgba(37,48,68,0.12)]">
          <div className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:p-8 sm:text-left">
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#F1DED3] bg-[#FFF6F3] shadow-[0_16px_32px_-12px_rgba(255,92,52,0.25)] sm:h-32 sm:w-32">
                <Image
                  src={PIP_LOGO_URL}
                  alt="Pip"
                  width={120}
                  height={120}
                  className="h-[72px] w-auto sm:h-[84px]"
                  unoptimized
                  priority
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FF5C34] px-3 py-1 text-[0.6875rem] font-semibold text-white shadow-sm sm:text-xs">
                Comes with Ember Plus
              </span>
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-[#FF5C34]">
                Your pocket play coach
              </p>
              <h2
                className="mb-1.5 font-semibold tracking-[-0.02em] text-[#253044]"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', lineHeight: 1.1 }}
              >
                Meet Pip
              </h2>
              <p className="mb-2.5 font-medium text-[#253044] sm:text-[1.0625rem]">
                Doing the homework for you
              </p>
              <p className="text-[0.9375rem] leading-relaxed text-[#66717D] sm:text-[1.0625rem]">
                With Ember Plus, Pip keeps watch for what&apos;s changing, what to get next, great
                local toys, Christmas gifts, and big moments like nursery. Leave the homework to
                Ember — stop scrolling, and sit back.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
