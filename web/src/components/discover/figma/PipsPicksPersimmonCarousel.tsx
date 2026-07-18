'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Baby,
  BookOpen,
  Car,
  ChevronLeft,
  ChevronRight,
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
  product_description?: string | null;
  product_url?: string | null;
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

  const out = copy
    .replace(/\bIt suits children who are likely to be\b/i, `It is suitable for ${name}, who is likely to be`)
    .replace(/\bIt suits children who\b/i, `It is suitable for ${name}, who is likely to`)
    .replace(/\bIt suits children\b/i, `It is suitable for ${name}`)
    .replace(/\bsuits children who are likely to be\b/i, `suitable for ${name}, who is likely to be`)
    .replace(/\bsuits children who\b/i, `suitable for ${name}, who is likely to`)
    .replace(/\bsuits children\b/i, `suitable for ${name}`);

  if (out !== copy) return out;
  if (/^(this|it)\s+(supports|helps|gives|offers|adds|lets|makes)\b/i.test(copy)) {
    return `For ${name}, this is likely to fit because ${lowerFirst(copy)}`;
  }
  return copy;
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
    product.product_description ||
    product.title ||
    product.name;
  const verdict =
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

function updateTrackPhysics(track: HTMLDivElement | null, enable3d: boolean) {
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
    if (enable3d) {
      card.style.transform = `rotateY(${offset * -35}deg) scale(${1 - abs * 0.15}) translateZ(${abs * -100}px)`;
    } else {
      // Touch devices: flat scale only. rotateY/translateZ inside a scroll-snap track
      // breaks tap hit-testing on mobile browsers (dead CTAs).
      card.style.transform = `scale(${1 - abs * 0.08})`;
    }
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
  const [activeIndex, setActiveIndex] = useState(0);
  // 3D card physics only on hover/fine-pointer devices; touch gets a flat snap carousel.
  const [enable3d, setEnable3d] = useState(false);
  const renderedPicks = useMemo(() => picks.slice(0, 5) as PipsPick[], [picks]);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnable3d(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nextIndex = 0;
    let closest = Number.POSITIVE_INFINITY;
    track.querySelectorAll<HTMLElement>('[data-pips-card-wrapper]').forEach((wrapper, index) => {
      const center = wrapper.offsetLeft + wrapper.clientWidth / 2;
      const distance = Math.abs(center - trackCenter);
      if (distance < closest) {
        closest = distance;
        nextIndex = index;
      }
    });
    setActiveIndex(nextIndex);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const wrapper = track?.querySelectorAll<HTMLElement>('[data-pips-card-wrapper]')[index];
    if (!track || !wrapper) return;
    const left = wrapper.offsetLeft - (track.clientWidth - wrapper.clientWidth) / 2;
    track.scrollTo({ left, behavior: 'smooth' });
  }, []);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const next = Math.max(0, Math.min(renderedPicks.length - 1, activeIndex + direction));
    scrollToIndex(next);
  }, [activeIndex, renderedPicks.length, scrollToIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => window.requestAnimationFrame(() => {
      updateTrackPhysics(track, enable3d);
      updateActiveIndex();
    });
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [renderedPicks.length, updateActiveIndex, enable3d]);

  if (!renderedPicks.length) return null;

  return (
    <section className="relative overflow-hidden text-[#253044]">
      <div className="relative z-20 px-2 pb-5 text-center md:px-0">
        <div className="inline-flex items-center justify-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand mark is a stable public asset */}
          <img src={ROBIN_LOGO_URL} alt="" className="h-16 w-16 object-contain md:h-20 md:w-20" />
          <h2 className="m-0 text-[30px] font-extrabold leading-tight tracking-normal text-[#253044] md:text-[40px]">
            Pip&apos;s Picks
          </h2>
        </div>
        <p className="mx-auto mt-1 max-w-lg text-[14px] font-semibold leading-relaxed text-[#66717D] md:text-base">
          {isEmberPlusMember
            ? "A shortlist we've already weighed up, with the full reasoning behind each pick."
            : "A shortlist we've already weighed up. Pick 1 is free; picks 2-5 are for Ember Plus."}
        </p>
      </div>

      <div
        className="relative min-h-[545px] overflow-hidden rounded-[28px] bg-[#E4E9E6] shadow-[0_24px_56px_rgba(37,48,68,0.12)] md:min-h-[610px]"
        style={enable3d ? { perspective: '1200px' } : undefined}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-28 bg-gradient-to-r from-[#E4E9E6] to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-28 bg-gradient-to-l from-[#E4E9E6] to-transparent md:block" />
        <div
          ref={trackRef}
          className="absolute inset-0 z-10 flex snap-x snap-mandatory items-center overflow-x-auto px-[calc(50vw_-_150px)] py-4 [scrollbar-width:none] md:px-[calc(50%_-_185px)]"
          style={enable3d ? { transformStyle: 'preserve-3d' } : undefined}
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
                className="relative flex h-full max-h-[500px] w-[300px] flex-[0_0_300px] snap-center items-center justify-center md:max-h-[570px] md:w-[370px] md:flex-[0_0_370px]"
                style={enable3d ? { transformStyle: 'preserve-3d' } : undefined}
              >
                <article
                  data-pips-card
                  className="absolute flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-[#253044] text-white shadow-[0_28px_52px_rgba(37,48,68,0.22)] transition-transform duration-150 md:rounded-[32px]"
                  style={enable3d ? { transformStyle: 'preserve-3d' } : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- decorative brand watermark */}
                  <img
                    src={ROBIN_LOGO_URL}
                    alt=""
                    className="pointer-events-none absolute -right-24 top-10 z-0 h-[360px] w-[360px] rotate-[15deg] object-contain opacity-10 mix-blend-overlay invert"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element -- visible brand mark for each pick card */}
                  <img
                    src={ROBIN_LOGO_URL}
                    alt=""
                    className="pointer-events-none absolute right-5 top-5 z-20 h-[88px] w-[88px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.22)] md:h-24 md:w-24"
                  />

                  <div className="relative z-10 flex h-full flex-col p-5 md:p-7">
                    <span className="mb-4 inline-flex self-start rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-[13px] font-extrabold tracking-wide text-white md:mb-5">
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
                      <h3 className="m-0 mb-2 flex items-start gap-2.5 text-[20px] font-extrabold leading-tight tracking-normal text-white md:text-[22px]">
                        <Icon className="h-6 w-6 flex-shrink-0 text-white" strokeWidth={2.5} aria-hidden />
                        {fields.title}
                      </h3>
                      {fields.brand ? (
                        <p className="m-0 mb-3 text-[12px] font-bold uppercase tracking-wider text-white/80 md:mb-4 md:text-[13px]">
                          {fields.brand}
                        </p>
                      ) : null}
                      <p className="m-0 mb-3 text-[14px] font-medium leading-relaxed text-white/95 md:mb-4 md:text-[15px]">
                        {fields.description}
                      </p>

                      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.08] p-3 md:p-4">
                        <strong className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-[#FF5C34]">
                          Why Pip picked this
                        </strong>
                        <p className="m-0 text-[13px] font-semibold leading-relaxed text-white/95 md:text-[14px]">
                          {fields.verdict}
                        </p>
                      </div>

                      {canVisit ? (
                        <a
                          href={url}
                          target="_blank"
                          rel={retailerLinkRel(url)}
                          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#FF5C34] px-4 py-3 text-[14px] font-extrabold text-white shadow-[0_16px_48px_rgba(255,92,52,0.3)] transition-transform active:scale-[0.97] md:mt-4 md:min-h-12 md:text-[15px]"
                        >
                          View retailer
                        </a>
                      ) : (
                        <span className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white/10 px-4 py-3 text-[14px] font-extrabold text-white/75 md:mt-4 md:min-h-12 md:text-[15px]">
                          Link soon
                        </span>
                      )}
                    </div>
                  </div>

                  {locked ? (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[28px] bg-[#253044] p-8 text-center md:rounded-[32px]">
                      {/* eslint-disable-next-line @next/next/no-img-element -- visible brand mark for locked pick cards */}
                      <img
                        src={ROBIN_LOGO_URL}
                        alt=""
                        className="pointer-events-none absolute right-5 top-5 h-[88px] w-[88px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.22)] md:h-24 md:w-24"
                      />
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
        <div className="absolute inset-y-0 left-3 z-30 hidden items-center md:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={activeIndex === 0}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#E7E2DC] bg-white text-[#253044] shadow-lg transition hover:bg-[#FBFAF7] disabled:opacity-30"
            aria-label="Previous Pip's Pick"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
        </div>
        <div className="absolute inset-y-0 right-3 z-30 hidden items-center md:flex">
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={activeIndex >= renderedPicks.length - 1}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#E7E2DC] bg-white text-[#253044] shadow-lg transition hover:bg-[#FBFAF7] disabled:opacity-30"
            aria-label="Next Pip's Pick"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        </div>
        <div className="absolute bottom-2 left-0 right-0 z-30 flex justify-center gap-2">
          {renderedPicks.map((pick, index) => (
            <button
              key={pick.product.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-5 bg-[#FF5C34]' : 'w-2 bg-[#D8D1CA]'}`}
              aria-label={`Go to Pip's Pick ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
