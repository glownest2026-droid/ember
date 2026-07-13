'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell, Gift, RefreshCw } from 'lucide-react';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';
import { PIP_LOGO_URL } from './pricingImages';

const PILLARS = [
  {
    icon: Bell,
    title: 'What’s useful next',
    body: 'Calm cues when your child moves stage — what to notice, bring back out, or skip for now.',
  },
  {
    icon: Gift,
    title: 'Smarter buying',
    body: 'Shortlists instead of endless tabs. Clear buy, borrow, wait, or gift judgements.',
  },
  {
    icon: RefreshCw,
    title: 'Family life, not just toys',
    body: 'Help with seasons, nursery, gifts for family, and when something’s ready to pass on.',
  },
] as const;

export function MeetPipSection() {
  return (
    <section id="meet-pip" className="py-16 lg:py-20">
      <div className={EMBER_MARKETING_CONTAINER}>
        <div className="overflow-hidden rounded-3xl border border-[#E7E2DC] bg-white">
          <div className="grid items-center gap-10 p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-12">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="relative mb-6">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-[#F1DED3] bg-[#FFF6F3] shadow-[0_20px_40px_-12px_rgba(255,92,52,0.25)] sm:h-48 sm:w-48">
                  <Image
                    src={PIP_LOGO_URL}
                    alt="Pip"
                    width={140}
                    height={140}
                    className="h-[110px] w-auto sm:h-[130px]"
                    unoptimized
                  />
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FF5C34] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Ember Plus guide
                </span>
              </div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#FF5C34]">
                Meet Pip
              </p>
              <h2
                className="mb-4 font-semibold tracking-[-0.01em] text-[#253044]"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', lineHeight: 1.15 }}
              >
                Your guide for the messy middle of parenting
              </h2>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-[#66717D]">
                Free Ember is the map: stage ideas you can browse anytime. Pip is who you get with
                Ember Plus — a warm guide that helps you act at the right time, so you spend less
                time researching and more time feeling one step ahead.
              </p>
            </div>

            <div className="space-y-4">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex gap-4 rounded-2xl border border-[#E7E2DC] bg-[#FBFAF7] p-4 sm:p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF6F3]">
                    <pillar.icon size={22} className="text-[#FF5C34]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-[#253044]">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-[#66717D]">{pillar.body}</p>
                  </div>
                </div>
              ))}
              <p className="pt-2 text-center text-sm text-[#66717D] lg:text-left">
                That logo up there? That&apos;s Pip — Ember&apos;s mark, and your Plus companion
                through{' '}
                <Link href="#compare" className="font-medium text-[#FF5C34] underline-offset-2 hover:underline">
                  the journey below
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
