'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import {
  Baby,
  BookOpen,
  Car,
  Circle,
  Hand,
  Home,
  Moon,
  Package,
  Plane,
  Shirt,
  TreePine,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import type { GatewayPick } from '@/lib/pl/public';
import { retailerLinkRel } from '@/lib/compliance/externalRetailerLink';

const ROBIN_LOGO_URL =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

type PipsPickProduct = GatewayPick['product'] & {
  best_for_tag?: string | null;
  title?: string | null;
  product_description_under_30_words?: string | null;
  why_pip_picked_this?: string | null;
  ember_verdict?: string | null;
  personalization_hint?: string | null;
  is_locked?: boolean | null;
  locked_for_non_members?: boolean | null;
  price_text?: string | null;
  retailer?: string | null;
};

type PipsPick = Omit<GatewayPick, 'product'> & {
  product: PipsPickProduct;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function lowerFirst(value: string) {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

function personalizePickCopy(copy: string, childName?: string | null) {
  const name = childName?.trim();
  if (!copy?.trim() || !name) return copy;
  if (new RegExp(`\\b${escapeRegExp(name)}\\b`, 'i').test(copy)) return copy;

  let out = copy
    .replace(/\bIt suits children who are likely to be\b/i, `It is suitable for ${name}, who is likely to be`)
    .replace(/\bIt suits children who\b/i, `It is suitable for ${name}, who is likely to`)
    .replace(/\bIt suits children\b/i, `It is suitable for ${name}`)
    .replace(/\bsuits children who are likely to be\b/i, `suitable for ${name}, who is likely to be`)
    .replace(/\bsuits children who\b/i, `suitable for ${name}, who is likely to`)
    .replace(/\bsuits children\b/i, `suitable for ${name}`);

  if (out !== copy) return out;
  return `For ${name}, this is likely to fit because ${lowerFirst(copy)}`;
}

function personalizeFromHint(hint: string | null | undefined, childName?: string | null) {
  const name = childName?.trim();
  const cleanHint = hint?.trim();
  if (!name || !cleanHint) return null;
  const normalized = cleanHint.replace(/^is\s+/i, '').replace(/^likely to\s+/i, 'likely to ');
  return `Suitable for ${name}, who is ${normalized}`;
}

function pickIcon(productName: string, categoryLabel: string): LucideIcon {
  const text = `${productName} ${categoryLabel}`.toLowerCase();
  if (/(airport|plane|travel|trip|car seat|car|vehicle|outings|trips)/.test(text)) return text.includes('car') ? Car : Plane;
  if (/(book|story|stories|reading|faces)/.test(text)) return BookOpen;
  if (/(tree|garden|outdoor|floor|mat)/.test(text)) return TreePine;
  if (/(truck|lorry|recycling|delivery)/.test(text)) return Truck;
  if (/(home|village|house|town|cot|mattress|sleep)/.test(text)) return text.includes('sleep') || text.includes('mattress') ? Moon : Home;
  if (/(hands|grab|grasp|reach|rattle)/.test(text)) return Hand;
  if (/(muslin|cloth|burp|feed|bib)/.test(text)) return Shirt;
  if (/(baby|mirror|tummy|sling|carrier)/.test(text)) return Baby;
  if (/(shape|block|stack|card|contrast)/.test(text)) return Circle;
  return Package;
}

function getDisplayFields(pick: PipsPick, rank: number, childName?: string | null) {
  const product = pick.product;
  const categoryLabel = pick.categoryType.label || pick.categoryType.name || 'this age';
  const bestFor = product.best_for_tag || `Pick ${rank}`;
  const description =
    product.product_description_under_30_words ||
    product.title ||
    product.name;
  const verdict =
    personalizeFromHint(product.personalization_hint, childName) ||
    product.ember_verdict ||
    product.why_pip_picked_this ||
    product.rationale ||
    pick.categoryType.label ||
    'Chosen for this age and focus.';

  return {
    tag: `Pick ${rank} • ${bestFor}`,
    title: product.name,
    brand: [product.brand, product.price_text].filter(Boolean).join(' • '),
    description,
    verdict: personalizePickCopy(verdict, childName),
    Icon: pickIcon(product.name, categoryLabel),
  };
}

function updateTrackPhysics(track: HTMLDivElement | null) {
  if (!track) return;
  const trackCenter = track.scrollLeft + track.clientWidth / 2;
  const wrappers = track.querySelectorAll<HTMLElement>('[data-pips-card-wrapper]');

  wrappers.forEach((wrapper) => {
    const card = wrapper.querySelector<HTMLElement>('[data-pips-card]');
    if (!card) return;
    const wrapperCenter = wrapper.offsetLeft + wrapper.clientWidth / 2;
    const rawOffset = (wrapperCenter - trackCenter) / wrapper.clientWidth;
    const offset = Math.max(-2.5, Math.min(2.5, rawOffset));
    const abs = Math.abs(offset);
    card.style.transform = `rotateY(${offset * -35}deg) scale(${1 - abs * 0.15}) translateZ(${abs * -100}px)`;
    card.style.zIndex = String(Math.round(100 - abs * 10));
  });
}

export function PipsPicksPersimmonCarousel({
  picks,
  childDisplayLabel,
  isEmberPlusMember,
  getProductUrl,
}: {
  picks: GatewayPick[];
  childDisplayLabel?: string | null;
  isEmberPlusMember: boolean;
  getProductUrl: (pick: GatewayPick) => string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const renderedPicks = useMemo(() => picks.slice(0, 5) as PipsPick[], [picks]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => window.requestAnimationFrame(() => updateTrackPhysics(track));
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [renderedPicks.length]);

  if (!renderedPicks.length) return null;

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-[#FF5C34] text-white shadow-[0_24px_56px_rgba(255,92,52,0.22)]">
      <div className="relative z-20 px-5 pt-5 text-center md:px-7 md:pt-7">
        <div className="inline-flex items-center justify-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand mark is a stable public asset */}
          <img src={ROBIN_LOGO_URL} alt="" className="h-9 w-9 object-contain" />
          <h2 className="m-0 text-[26px] font-extrabold leading-tight tracking-normal text-white md:text-[32px]">
            Pip&apos;s Picks
          </h2>
        </div>
        <p className="mx-auto mt-2 max-w-md text-[13px] font-semibold leading-relaxed text-white/85 md:text-sm">
          A shortlist we&apos;ve already weighed up, and why. Picks 2-5 are for Ember Plus members.
        </p>
      </div>

      <div className="relative min-h-[540px] overflow-hidden md:min-h-[580px]" style={{ perspective: '1200px' }}>
        <div
          ref={trackRef}
          className="absolute inset-0 z-10 flex snap-x snap-mandatory items-center overflow-x-auto px-[calc(50vw_-_165px)] py-5 [scrollbar-width:none] md:px-[calc(50%_-_185px)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {renderedPicks.map((pick, index) => {
            const rank = index + 1;
            const productLocked = Boolean(pick.product.is_locked ?? pick.product.locked_for_non_members ?? index > 0);
            const locked = productLocked && !isEmberPlusMember;
            const url = getProductUrl(pick);
            const canVisit = url && url !== '#';
            const fields = getDisplayFields(pick, rank, childDisplayLabel);
            const Icon = fields.Icon;

            return (
              <div
                key={`${pick.product.id}-${rank}`}
                data-pips-card-wrapper
                className="relative flex h-full max-h-[520px] w-[330px] flex-[0_0_330px] snap-center items-center justify-center md:w-[370px] md:flex-[0_0_370px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <article
                  data-pips-card
                  className="absolute flex h-full w-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#161D2B] text-white shadow-[0_32px_64px_rgba(0,0,0,0.25)] transition-transform duration-150"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- decorative brand watermark */}
                  <img
                    src={ROBIN_LOGO_URL}
                    alt=""
                    className="pointer-events-none absolute -right-24 -top-8 z-0 h-[380px] w-[380px] rotate-[15deg] object-contain opacity-25 mix-blend-overlay invert"
                  />

                  <div className="relative z-10 flex h-full flex-col p-7">
                    <span className="mb-6 inline-flex self-start rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-[13px] font-extrabold tracking-wide text-white">
                      {rank} / {renderedPicks.length}
                    </span>

                    <div
                      className={`flex flex-1 flex-col transition duration-300 ${
                        locked ? 'pointer-events-none select-none opacity-30 blur-[12px] grayscale' : ''
                      }`}
                    >
                      <p className="m-0 mb-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#FFE0D8]">
                        {fields.tag}
                      </p>
                      <h3 className="m-0 mb-2 flex items-center gap-2.5 text-[22px] font-extrabold leading-tight tracking-normal text-white">
                        <Icon className="h-6 w-6 flex-shrink-0 text-white" strokeWidth={2.5} aria-hidden />
                        {fields.title}
                      </h3>
                      {fields.brand ? (
                        <p className="m-0 mb-4 text-[13px] font-bold uppercase tracking-wider text-white/80">
                          {fields.brand}
                        </p>
                      ) : null}
                      <p className="m-0 mb-5 text-[15px] font-medium leading-relaxed text-white/95">
                        {fields.description}
                      </p>

                      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.08] p-4">
                        <strong className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-[#FF5C34]">
                          Why Pip picked this
                        </strong>
                        <p className="m-0 text-[14px] font-semibold leading-relaxed text-white/95">
                          {fields.verdict}
                        </p>
                      </div>

                      {canVisit ? (
                        <a
                          href={url}
                          target="_blank"
                          rel={retailerLinkRel(url)}
                          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#FF5C34] px-4 py-4 text-[15px] font-extrabold text-white shadow-[0_16px_48px_rgba(255,92,52,0.3)] transition-transform active:scale-[0.97]"
                        >
                          View retailer
                        </a>
                      ) : (
                        <span className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white/10 px-4 py-4 text-[15px] font-extrabold text-white/75">
                          Link soon
                        </span>
                      )}
                    </div>
                  </div>

                  {locked ? (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#253044]/70 p-8 text-center backdrop-blur-2xl">
                      <strong className="mb-3 text-[20px] font-extrabold leading-tight text-white">
                        Discover Pip&apos;s Picks with Ember Plus
                      </strong>
                      <p className="m-0 max-w-[240px] text-sm font-semibold leading-relaxed text-white/80">
                        Pick 1 is free. Ember Plus shows the full shortlist and why each option fits.
                      </p>
                      <Link
                        href="/pricing"
                        className="mt-5 inline-flex w-full max-w-[240px] items-center justify-center rounded-full bg-[#FF5C34] px-6 py-4 text-[15px] font-extrabold text-white shadow-[0_16px_48px_rgba(255,92,52,0.3)]"
                      >
                        Discover Ember Plus
                      </Link>
                    </div>
                  ) : null}
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
