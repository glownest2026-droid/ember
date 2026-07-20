'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';import {
  Baby,
  BookOpen,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Hand,
  Home,
  Images,
  Maximize2,
  Moon,
  Package,
  Plane,
  RectangleHorizontal,
  Save,
  ScanFace,
  Shirt,
  TreePine,
  Truck,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { GatewayPick } from '@/lib/pl/public';
import { retailerLinkRel } from '@/lib/compliance/externalRetailerLink';
import styles from './PipsPicksGlassStage.module.css';

const ROBIN_LOGO_URL =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

/** Per-pick Ember warm accents — Glass Stage template (never purple). */
const PICK_ACCENTS = [
  { accent: '#FF5C34', soft: '#FFB199', orb: 'rgba(255,92,52,0.45)', orb2: 'rgba(255,224,216,0.22)' },
  { accent: '#E8A05A', soft: '#F5D0A8', orb: 'rgba(232,160,90,0.42)', orb2: 'rgba(255,236,210,0.2)' },
  { accent: '#FF7A55', soft: '#FFC4B0', orb: 'rgba(255,122,85,0.44)', orb2: 'rgba(255,200,180,0.22)' },
  { accent: '#D9785C', soft: '#F0C4B4', orb: 'rgba(217,120,92,0.40)', orb2: 'rgba(240,200,188,0.2)' },
  { accent: '#F0A07A', soft: '#FFE0D0', orb: 'rgba(240,160,122,0.42)', orb2: 'rgba(255,230,216,0.22)' },
] as const;

function pickAccent(index: number) {
  return PICK_ACCENTS[index % PICK_ACCENTS.length];
}
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

/**
 * Hard rule (founder, bug bash 2026-07-19 follow-up, item 9): every Stage 3 card
 * title gets the lucide icon that best matches WHAT THE PRODUCT IS. Match the
 * most specific product noun first (a "washable floor playmat" is a mat, not a
 * tree). Word boundaries prevent substring accidents ("cards" is not a "car").
 * When ingesting a new category, extend this map — never let picks fall through
 * to Package silently if a better icon exists.
 */
function pickIcon(productName: string, categoryLabel: string): LucideIcon {
  const text = `${productName} ${categoryLabel}`.toLowerCase();
  if (/\b(playmat|play mat|floor mat|activity mat|mat)\b/.test(text)) return RectangleHorizontal;
  if (/\bmirror\b/.test(text)) return ScanFace;
  if (/\b(flash ?cards?|sensory cards?|art cards?|cards?)\b/.test(text)) return Images;
  if (/\b(book|books|story|stories|reading|library)\b/.test(text)) return BookOpen;
  if (/\b(muslin|burp|cloth|cloths|bib|bibs|swaddle)\b/.test(text)) return Shirt;
  if (/\b(car seat|carrier seat|isize|i-size)\b/.test(text) || (/\bcar\b/.test(text) && /\bseat\b/.test(text))) return Car;
  if (/\b(mattress|cot|crib|sleep|bedtime|moses)\b/.test(text)) return Moon;
  if (/\b(carrier|sling|wrap|babywearing)\b/.test(text)) return Baby;
  if (/\b(rattle|teether|grasp|grasping|grab|reach|oball|ball|balls)\b/.test(text)) return Hand;
  if (/\b(plane|airport|travel|trip|trips|outings)\b/.test(text)) return Plane;
  if (/\b(truck|lorry|recycling|delivery|vehicle)\b/.test(text)) return Truck;
  if (/\b(tree|garden|outdoor|nature)\b/.test(text)) return TreePine;
  if (/\b(home|village|house|town)\b/.test(text)) return Home;
  if (/\b(shape|shapes|block|blocks|stack|stacking|contrast)\b/.test(text)) return Circle;
  if (/\b(face|faces|tummy)\b/.test(text)) return Baby;
  return Package;
}

/**
 * Founder rule (bug bash 2026-07-19, item 5v): retailer CTAs never deep-link a
 * single retailer. Always send parents to Google Shopping so the journey
 * survives retailer stock/URL churn and shows live offers.
 */
function googleShoppingUrl(product: PipsPickProduct): string {
  const query = [product.brand, product.name].filter(Boolean).join(' ');
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
}

function getDisplayFields(pick: PipsPick, childName?: string | null) {
  const product = pick.product;
  const categoryLabel = pick.categoryType.label || pick.categoryType.name || 'this age';
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
    tag: product.best_for_tag || null,
    title: product.name,
    brand: product.brand || '',
    description,
    verdict: personalizePickCopy(verdict, childName),
    Icon: pickIcon(product.name, categoryLabel),
  };
}

type ExpandedPickFields = ReturnType<typeof getDisplayFields> & {
  url: string;
  rank: number;
  total: number;
};

/**
 * Glass Stage compact card body (founder-selected 2026-07-19).
 * Spec: web/docs/ui/STAGE3_GLASS_STAGE_CARD.md
 *
 * Description fills leftover card height (no empty mt-auto gap above the
 * drawer). Line count = floor(availableHeight / lineHeight).
 */
const MAX_DESC_LINES = 8;
const MIN_DESC_LINES = 2;

function PickCardBody({
  locked,
  fields,
  url,
  rank,
  total,
  onExpand,
  onSave,
}: {
  locked: boolean;
  fields: ReturnType<typeof getDisplayFields>;
  url: string;
  rank: number;
  total: number;
  onExpand: () => void;
  onSave?: (trigger: HTMLButtonElement) => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [descLines, setDescLines] = useState(4);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    setDrawerOpen(false);
  }, [fields.title, fields.verdict]);

  useEffect(() => {
    const root = rootRef.current;
    const desc = descRef.current;
    if (!root || !desc) return;

    const fit = () => {
      // Let the description flex-grow into free space, then clamp to whole lines.
      desc.style.flex = drawerOpen ? '0 0 auto' : '1 1 auto';
      desc.style.minHeight = '0';
      desc.style.height = 'auto';
      desc.style.maxHeight = 'none';
      desc.style.display = '-webkit-box';
      desc.style.setProperty('-webkit-box-orient', 'vertical');
      desc.style.overflow = 'hidden';
      // Unlimited clamp while measuring the flex-assigned box height.
      desc.style.setProperty('-webkit-line-clamp', '99');

      const cs = window.getComputedStyle(desc);
      const fontSize = parseFloat(cs.fontSize) || 13;
      const lhRaw = Number.parseFloat(cs.lineHeight);
      const lineHeight = Number.isFinite(lhRaw) ? lhRaw : fontSize * 1.5;
      const boxH = desc.clientHeight;
      const maxForBox = Math.max(MIN_DESC_LINES, Math.floor(boxH / lineHeight));
      const lines = drawerOpen
        ? MIN_DESC_LINES
        : Math.min(MAX_DESC_LINES, Math.max(MIN_DESC_LINES, maxForBox));

      desc.style.setProperty('-webkit-line-clamp', String(lines));
      setDescLines(lines);
    };

    fit();
    const observer = new ResizeObserver(() => fit());
    observer.observe(root);
    document.fonts?.ready.then(() => fit()).catch(() => {});
    return () => observer.disconnect();
  }, [fields.description, fields.title, fields.brand, fields.tag, drawerOpen]);

  return (
    <div
      ref={rootRef}
      className={`relative z-10 flex h-full min-h-0 flex-1 flex-col overflow-hidden px-4 py-3.5 transition duration-300 md:p-[18px] ${
        locked ? 'pointer-events-none select-none opacity-30 blur-[12px] grayscale' : ''
      }`}
    >
      <div className="mb-0.5 shrink-0 pr-[96px] md:mb-1">
        <div className={styles.rankGhost}>{rank}</div>
        <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-white/50">
          of {total}
        </div>
      </div>

      {fields.tag ? (
        <span
          className={`${styles.tagPill} mb-2 mt-2 shrink-0 self-start rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] md:mt-3 md:mb-2.5 md:text-[10.5px] md:tracking-[0.1em]`}
        >
          {fields.tag}
        </span>
      ) : null}

      <h3 className="m-0 mb-1 shrink-0 pr-[96px] text-[19px] font-extrabold leading-[1.2] tracking-normal text-white line-clamp-2 md:text-[22px] md:leading-[1.18]">
        {fields.title}
      </h3>
      {fields.brand ? (
        <p className="m-0 mb-2 shrink-0 text-[11px] font-bold uppercase leading-normal tracking-[0.06em] text-white/60 line-clamp-1 md:mb-2.5 md:text-[12px]">
          {fields.brand}
        </p>
      ) : null}
      <p
        ref={descRef}
        className={`mb-3 min-h-0 text-[13px] font-medium leading-[1.5] text-white/90 md:text-[13.5px] md:leading-[1.55] ${styles.descBase} ${
          drawerOpen ? `shrink-0 ${styles.descDim}` : 'flex-1'
        }`}
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: descLines,
          overflow: 'hidden',
        }}
      >
        {fields.description}
      </p>

      <div className={`flex min-h-0 shrink-0 flex-col ${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}>
        <button
          type="button"
          className={`${styles.drawerHead} flex min-h-11 w-full items-center justify-between gap-2.5 border-0 bg-transparent px-3.5 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-[0.06em] md:min-h-[46px] md:py-3 md:text-[12px]`}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((open) => !open)}
        >
          Why Pip picked this
          <ChevronDown
            size={16}
            strokeWidth={2.5}
            aria-hidden
            className={`shrink-0 ${styles.drawerChevron} ${drawerOpen ? styles.drawerChevronOpen : ''} ${
              shouldReduceMotion ? '!transition-none' : ''
            }`}
          />
        </button>
        <div
          className={`${styles.drawerPanel} ${drawerOpen ? styles.drawerPanelOpen : ''} ${
            shouldReduceMotion ? '!transition-none' : ''
          }`}
        >
          <p className="m-0 px-3.5 pb-1 text-[13px] font-semibold leading-[1.55] text-white/[0.94]">
            {fields.verdict}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex shrink-0 items-center gap-2 md:mt-3.5">
        <a
          href={url}
          target="_blank"
          rel={retailerLinkRel(url)}
          className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full bg-[#FF5C34] px-3 py-3 text-[13px] font-extrabold text-white shadow-[0_14px_36px_rgba(255,92,52,0.4),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform active:scale-[0.97] md:px-4 md:text-[14px]"
        >
          Browse offers
        </a>
        <button
          type="button"
          onClick={onExpand}
          className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label={`Read full details for ${fields.title}`}
        >
          <Maximize2 size={18} strokeWidth={2.5} aria-hidden />
        </button>
        {onSave ? (
          <button
            type="button"
            onClick={(e) => onSave(e.currentTarget)}
            className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
            title="Save"
            aria-label={`Save ${fields.title} to your list`}
          >
            <Save size={18} strokeWidth={2.5} aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Full-screen reader for one pick, mirroring the Stage 2 expanded-card pattern.
 * Swipeable/navigable (founder rule, item 5/11): the reader moves between every
 * pick the member can see, so nobody has to close it just to keep browsing.
 * The close button is anchored to the card, not the screen corner.
 */
function PipsPickExpanded({
  fields,
  locked = false,
  lockedCount = 0,
  onClose,
  onNavigate,
  hasPrev,
  hasNext,
}: {
  fields: ExpandedPickFields;
  /** Locked upsell card: show the Ember Plus pitch instead of pick details. */
  locked?: boolean;
  lockedCount?: number;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const Icon = fields.Icon;
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(-1);
      if (e.key === 'ArrowRight' && hasNext) onNavigate(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate, hasPrev, hasNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? startX) - startX;
    if (Math.abs(delta) < 60) return;
    if (delta > 0 && hasPrev) onNavigate(-1);
    if (delta < 0 && hasNext) onNavigate(1);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col bg-[#FBFAF7]"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="expanded-pick-title"
    >
      <motion.div
        className="flex-1 overflow-y-auto px-4 py-6 [touch-action:pan-y] md:flex md:items-center md:justify-center md:py-8"
        initial={shouldReduceMotion ? false : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative mx-auto w-full max-w-2xl">
          {/* Desktop: previous/next just outside the card, thumb-height. */}
          {hasPrev ? (
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              className="absolute -left-16 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#E7E2DC] bg-white text-[#253044] shadow-lg transition hover:bg-[#FBFAF7] lg:inline-flex"
              aria-label="Previous pick"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
          ) : null}
          {hasNext ? (
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="absolute -right-16 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#E7E2DC] bg-white text-[#253044] shadow-lg transition hover:bg-[#FBFAF7] lg:inline-flex"
              aria-label="Next pick"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          ) : null}

          <article className="relative w-full overflow-hidden rounded-[28px] bg-[#253044] text-white shadow-lg md:rounded-[32px]">
            {/* Close sits on the card itself so it is always in reach. */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close expanded pick"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <div className="flex flex-col gap-4 p-6 md:p-8">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-[13px] font-extrabold tracking-wide text-white">
                  {fields.rank} / {fields.total}
                </span>
              </div>
              {locked ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  {lockedCount > 0 ? (
                    <span className="inline-flex items-center rounded-full border border-[#FF5C34]/40 bg-[#FF5C34]/15 px-4 py-1.5 text-[13px] font-extrabold tracking-wide text-[#FFE0D8]">
                      {lockedCount} more {lockedCount === 1 ? 'pick' : 'picks'} available
                    </span>
                  ) : null}
                  <h2 id="expanded-pick-title" className="m-0 text-[22px] font-extrabold leading-tight text-white md:text-[26px]">
                    Discover Pip&apos;s Picks with Ember Plus
                  </h2>
                  <p className="m-0 max-w-[300px] text-[14px] font-semibold leading-relaxed text-white/80">
                    Pick 1 is free. Ember Plus shows the full shortlist and why each option fits.
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-2 inline-flex w-full max-w-[280px] items-center justify-center rounded-full bg-[#FF5C34] px-6 py-4 text-[15px] font-extrabold text-white shadow-[0_16px_48px_rgba(255,92,52,0.3)]"
                  >
                    Discover Ember Plus
                  </Link>
                </div>
              ) : (
                <>
                  {fields.tag ? (
                    <p className="m-0 pr-12 text-[11px] font-extrabold uppercase tracking-widest text-[#FFE0D8]">
                      {fields.tag}
                    </p>
                  ) : null}
                  <h2
                    id="expanded-pick-title"
                    className="m-0 flex items-start gap-2.5 text-[24px] font-extrabold leading-tight text-white md:text-[28px]"
                  >
                    <Icon className="mt-1 h-7 w-7 flex-shrink-0 text-white" strokeWidth={2.5} aria-hidden />
                    {fields.title}
                  </h2>
                  {fields.brand ? (
                    <p className="m-0 text-[13px] font-bold uppercase tracking-wider text-white/80 md:text-[14px]">
                      {fields.brand}
                    </p>
                  ) : null}
                  <p className="m-0 text-[15px] font-medium leading-relaxed text-white/95 md:text-[16px]">
                    {fields.description}
                  </p>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 md:p-5">
                    <strong className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-[#FF5C34]">
                      Why Pip picked this
                    </strong>
                    <p className="m-0 text-[14px] font-semibold leading-relaxed text-white/95 md:text-[15px]">
                      {fields.verdict}
                    </p>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2">
                {hasPrev ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(-1)}
                    className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 lg:hidden"
                    aria-label="Previous pick"
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} aria-hidden />
                  </button>
                ) : null}
                {locked ? (
                  <span className="inline-flex min-h-12 flex-1 items-center justify-center px-4 text-[13px] font-semibold text-white/50">
                    Included with Ember Plus
                  </span>
                ) : (
                  <a
                    href={fields.url}
                    target="_blank"
                    rel={retailerLinkRel(fields.url)}
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#FF5C34] px-4 py-3 text-[15px] font-extrabold text-white shadow-[0_16px_48px_rgba(255,92,52,0.3)] transition-transform active:scale-[0.97]"
                  >
                    Browse offers
                  </a>
                )}
                {hasNext ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(1)}
                    className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 lg:hidden"
                    aria-label="Next pick"
                  >
                    <ChevronRight size={20} strokeWidth={2.5} aria-hidden />
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </motion.div>
    </motion.div>
  );
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
  onSavePick,
  bottomNavVisible = false,
}: {
  picks: GatewayPick[];
  childDisplayLabel?: string | null;
  isEmberPlusMember: boolean;
  /** Save this Stage 3 pick to the parent's list — Products tab (thumb-row save icon). */
  onSavePick?: (pick: GatewayPick, triggerEl: HTMLButtonElement | null) => void;
  /** Signed-in mobile shows the fixed bottom tab bar; the card's bottom reserve must clear it. */
  bottomNavVisible?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  // 3D card physics only on hover/fine-pointer devices; touch gets a flat snap carousel.
  const [enable3d, setEnable3d] = useState(false);
  // Up to 10 picks per category (bug bash item 8); the research decides depth.
  const renderedPicks = useMemo(() => picks.slice(0, 10) as PipsPick[], [picks]);

  const lockedFlags = useMemo(
    () =>
      renderedPicks.map(
        (pick, index) =>
          Boolean(pick.product.is_locked ?? pick.product.locked_for_non_members ?? index > 0) &&
          !isEmberPlusMember
      ),
    [renderedPicks, isEmberPlusMember]
  );
  const lockedCount = lockedFlags.filter(Boolean).length;
  // Non-members see one locked upsell card instead of four identical ones;
  // the counter on it signals how many picks they are missing.
  const displayPicks = useMemo(() => {
    const firstLockedIndex = lockedFlags.indexOf(true);
    return firstLockedIndex === -1 ? renderedPicks : renderedPicks.slice(0, firstLockedIndex + 1);
  }, [renderedPicks, lockedFlags]);

  useEffect(() => {
    setExpandedIndex(null);
  }, [displayPicks]);

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
    const next = Math.max(0, Math.min(displayPicks.length - 1, activeIndex + direction));
    scrollToIndex(next);
  }, [activeIndex, displayPicks.length, scrollToIndex]);

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
  }, [displayPicks.length, updateActiveIndex, enable3d]);

  if (!displayPicks.length) return null;

  const activeAccent = pickAccent(activeIndex);

  return (
    // Full-bleed viewport column (founder, round 4): the section runs to the very
    // bottom of the screen so the disclosure smallprint and the next section stay
    // below the fold. The Start over FAB hovers inside the card's bottom reserve.
    <section className="relative flex min-h-[calc(100dvh-var(--header-height,88px)-4px)] flex-col overflow-hidden text-[#253044]">
      {/* Compact header on mobile so heading + card + Start over share one viewport. */}
      <div
        id="pips-picks-heading"
        className="relative z-20 shrink-0 scroll-mt-2 px-2 pb-1 text-center md:mt-0 md:scroll-mt-[calc(var(--header-height,112px)+2px)] md:px-0 md:pb-5"
      >
        <div className="inline-flex items-center justify-center gap-2 md:gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand mark is a stable public asset */}
          <img src={ROBIN_LOGO_URL} alt="" className="h-8 w-8 object-contain md:h-20 md:w-20" />
          <h2 className="m-0 text-[20px] font-extrabold leading-tight tracking-normal text-[#253044] md:text-[40px]">
            Pip&apos;s Picks
          </h2>
        </div>
        <p className="mx-auto mt-0.5 max-w-xl text-[11px] font-semibold leading-snug text-[#66717D] line-clamp-2 md:mt-1 md:max-w-lg md:text-base md:leading-relaxed md:line-clamp-none">
          Pip has foraged the industry for {childDisplayLabel?.trim() || 'your child'}, matching current
          development needs to the best-suited, top-rated products available today.
        </p>
      </div>

      <div
        className={`relative min-h-0 flex-1 overflow-hidden rounded-[28px] ${styles.trackShell}`}
        style={enable3d ? { perspective: '1200px' } : undefined}
      >
        {/* Ambient orbs — recolour with the active pick's accent */}
        <div
          className={`${styles.orb} ${styles.orbA}`}
          style={{ background: activeAccent.orb }}
          aria-hidden
        />
        <div
          className={`${styles.orb} ${styles.orbB}`}
          style={{ background: activeAccent.orb2 }}
          aria-hidden
        />
        <div
          className={`${styles.orb} ${styles.orbC}`}
          style={{ background: activeAccent.orb }}
          aria-hidden
        />
        <div
          ref={trackRef}
          className={`absolute inset-0 z-10 flex snap-x snap-mandatory items-stretch overflow-x-auto px-[calc(50vw_-_150px)] pt-2 [scrollbar-width:none] md:items-center md:px-[calc(50%_-_185px)] md:pb-[88px] md:pt-4 ${
            // Short-phone: oversized padding was empty dark track below the card.
            bottomNavVisible ? 'pb-[96px]' : 'pb-[64px]'
          }`}
          style={enable3d ? { transformStyle: 'preserve-3d' } : undefined}
        >
          {displayPicks.map((pick, index) => {
            const rank = index + 1;
            const locked = lockedFlags[index];
            const url = googleShoppingUrl(pick.product);
            const fields = getDisplayFields(pick, childDisplayLabel);
            const accent = pickAccent(index);

            return (
              <div
                key={`${pick.product.id}-${rank}`}
                data-pips-card-wrapper
                className="relative flex w-[300px] flex-[0_0_300px] snap-center items-stretch justify-center self-stretch py-0 md:max-h-[610px] md:w-[370px] md:flex-[0_0_370px] md:self-center md:py-2"
                style={enable3d ? { transformStyle: 'preserve-3d' } : undefined}
              >
                <article
                  data-pips-card
                  className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] text-white transition-transform duration-150 md:rounded-[32px] ${styles.glassCard}`}
                  style={
                    {
                      '--accent': accent.accent,
                      '--accent-soft': accent.soft,
                      ...(enable3d ? { transformStyle: 'preserve-3d' } : {}),
                    } as CSSProperties
                  }
                >
                  <div className={styles.glassGrain} aria-hidden />
                  {/* Corner robin — upright, top-right; founder: ≥2× prior 44px → 88px */}
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand mark is a stable public asset */}
                  <img
                    src={ROBIN_LOGO_URL}
                    alt=""
                    className="pointer-events-none absolute right-2 top-2 z-40 h-[88px] w-[88px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                  />

                  <PickCardBody
                    locked={locked}
                    fields={fields}
                    url={url}
                    rank={rank}
                    total={renderedPicks.length}
                    onExpand={() => setExpandedIndex(index)}
                    onSave={onSavePick ? (trigger) => onSavePick(pick, trigger) : undefined}
                  />

                  {locked ? (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[28px] bg-[#1C2436]/95 p-8 text-center backdrop-blur-sm md:rounded-[32px]">
                      {/* eslint-disable-next-line @next/next/no-img-element -- brand mark is a stable public asset */}
                      <img
                        src={ROBIN_LOGO_URL}
                        alt=""
                        className="pointer-events-none absolute right-2 top-2 h-[88px] w-[88px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                      />
                      {lockedCount > 0 ? (
                        <span className="mb-4 inline-flex items-center rounded-full border border-[#FF5C34]/40 bg-[#FF5C34]/15 px-4 py-1.5 text-[13px] font-extrabold tracking-wide text-[#FFE0D8]">
                          {lockedCount} more {lockedCount === 1 ? 'pick' : 'picks'} available
                        </span>
                      ) : null}
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
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg transition hover:bg-white/20 disabled:opacity-30"
            aria-label="Previous Pip's Pick"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
        </div>
        <div className="absolute inset-y-0 right-3 z-30 hidden items-center md:flex">
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={activeIndex >= displayPicks.length - 1}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg transition hover:bg-white/20 disabled:opacity-30"
            aria-label="Next Pip's Pick"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        </div>
        <div className={`absolute left-0 right-0 z-30 flex justify-center gap-2 ${
            bottomNavVisible ? 'bottom-[88px]' : 'bottom-3'
          } md:bottom-2.5`}
        >
          {displayPicks.map((pick, index) => (
            <button
              key={pick.product.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index ? 'w-[22px] bg-[#FF5C34]' : 'w-2 bg-white/25'
              }`}
              aria-label={`Go to Pip's Pick ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expandedIndex !== null && displayPicks[expandedIndex] ? (() => {
          const pick = displayPicks[expandedIndex];
          // Reader navigation covers every card in the deck, including the
          // locked upsell card — swiping there shows the Ember Plus pitch
          // instead of dead-ending the gesture.
          const navigate = (direction: -1 | 1) => {
            const nextIndex = expandedIndex + direction;
            if (nextIndex < 0 || nextIndex >= displayPicks.length) return;
            setExpandedIndex(nextIndex);
            scrollToIndex(nextIndex);
          };
          return (
            <PipsPickExpanded
              key={`${pick.product.id}-expanded`}
              fields={{
                ...getDisplayFields(pick, childDisplayLabel),
                url: googleShoppingUrl(pick.product),
                rank: expandedIndex + 1,
                total: renderedPicks.length,
              }}
              locked={lockedFlags[expandedIndex]}
              lockedCount={lockedCount}
              onClose={() => setExpandedIndex(null)}
              onNavigate={navigate}
              hasPrev={expandedIndex > 0}
              hasNext={expandedIndex < displayPicks.length - 1}
            />
          );
        })() : null}
      </AnimatePresence>
    </section>
  );
}
