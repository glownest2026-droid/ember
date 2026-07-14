'use client';

import Image from 'next/image';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';
import { PIP_LOGO_URL } from './pricingImages';

/** Meet Pip — founder V3 voice: homework for you, leave the research to Ember. */
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
              <h2
                className="mb-3 font-semibold tracking-[-0.02em] text-[#253044]"
                style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: 1.1 }}
              >
                Meet Pip
              </h2>
              <p
                className="mb-3 font-medium text-[#FF5C34]"
                style={{ fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)', lineHeight: 1.35 }}
              >
                Doing the homework for you
              </p>
              <p className="text-[1.0625rem] leading-relaxed text-[#66717D]">
                Ember guidance is free to all — providing science-backed toy suggestions and a Smart
                Marketplace to trade the right toys. Pip is your personal assistant with an Ember Plus
                membership: keeping daily watch for what&apos;s changing, what to get next, notifying
                great local toys, getting you and the family ready for Christmas gifts, or helping
                with major milestones like a new nursery. Pip allows you to leave the research to
                Ember — stop scrolling, and sit back.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
