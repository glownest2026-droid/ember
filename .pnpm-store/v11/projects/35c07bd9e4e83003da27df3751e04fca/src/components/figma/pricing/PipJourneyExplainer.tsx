'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Gift,
  LayoutList,
  MapPin,
  Package,
  Plus,
  Route,
  Star,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import styles from './pip-journey-explainer.module.css';
import { PIP_LOGO_URL, PRICING_JOURNEY_IMAGES } from './pricingImages';

const AUTO_DURATION_MS = 5000;
const UPDATE_RATE_MS = 50;
const MOBILE_MQ = '(max-width: 767px)';

function MarketplaceLink({ children = 'Marketplace' }: { children?: ReactNode }) {
  return (
    <Link href="/marketplace" className={styles.inlineLink} onClick={(e) => e.stopPropagation()}>
      {children}
    </Link>
  );
}

type JourneyStep = {
  id: string;
  title: string;
  desc: string;
  isFree: boolean;
  Icon: LucideIcon;
  cardTag: string;
  /** Parent-facing foot note only — never internal labels like “Catalogue example”. */
  cardFootnote?: string;
  cardBody: ReactNode;
  cardImage: string;
  cardHref?: string;
  miniList?: [string, string][];
  pills?: string[];
  footLinks?: { href: string; label: string }[];
};

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'free',
    title: 'Free: Discover + Smart Marketplace',
    desc: '600+ play ideas, saves, gift lists and local matching — whenever you need Ember.',
    isFree: true,
    Icon: LayoutList,
    cardTag: 'Free',
    cardBody: (
      <div className={styles.conceptLines}>
        <p className={styles.conceptLine}>
          Browse play ideas by age — and find local matches on the{' '}
          <MarketplaceLink>Smart Marketplace</MarketplaceLink>.
        </p>
      </div>
    ),
    cardImage: PRICING_JOURNEY_IMAGES.catalogue,
    footLinks: [
      { href: '/discover', label: '→ Open Discover' },
      { href: '/marketplace', label: '→ Marketplace' },
    ],
  },
  {
    id: 'pathway',
    title: "Pip’s Pathway",
    desc: 'A nudge when your child is on the verge of something new — know what they’ll need, to stay one step ahead.',
    isFree: false,
    Icon: Route,
    cardTag: 'Pip’s Pathway',
    cardBody: (
      <div className={styles.conceptLines}>
        <p className={styles.conceptLine}>
          In the next 3 months, they’re likely to try{' '}
          <span className={styles.spike}>stacking cups and pouring</span>.
        </p>
        <p className={styles.conceptLine}>Learn why — and check the best buys →</p>
      </div>
    ),
    cardImage: PRICING_JOURNEY_IMAGES.pathway,
  },
  {
    id: 'picks',
    title: "Pip’s Picks",
    desc: 'A shortlist we’ve already weighed up for this age — and why each one fits.',
    isFree: false,
    Icon: Gift,
    cardTag: 'Pip’s Picks',
    cardBody: (
      <div className={styles.conceptLines}>
        <p className={styles.conceptLine}>
          Ember has noticed they keep coming back to{' '}
          <span className={styles.spike}>animal play</span>.
        </p>
        <p className={styles.conceptLine}>A few solid options for right now:</p>
      </div>
    ),
    cardImage: PRICING_JOURNEY_IMAGES.picks,
    miniList: [
      ['Argos', 'chunky animal set'],
      ['Amazon', 'soft farm pals'],
      ['VTech', 'talking animal book'],
    ],
  },
  {
    id: 'proximity',
    title: "Pip’s Patch Finds",
    desc: "Local toy finds for your child’s age — the moment they fit. You’ll know when a neighbour has a nearby match.",
    isFree: false,
    Icon: MapPin,
    cardTag: "Pip’s Patch Finds",
    cardBody: (
      <div className={styles.conceptLines}>
        <p className={styles.conceptLine}>
          Pip has been scouting for local <span className={styles.spike}>walkers</span> to help with
          first steps.
        </p>
        <p className={styles.conceptLine}>
          You have <span className={styles.spike}>1 new perfect match</span> within a mile.
        </p>
      </div>
    ),
    cardImage: PRICING_JOURNEY_IMAGES.proximity,
  },
  {
    id: 'seasons',
    title: "Pip’s Seasons",
    desc: 'Christmas, birthdays, summer — timed early enough to act, tuned to their age.',
    isFree: false,
    Icon: Sun,
    cardTag: 'Pip’s Seasons',
    cardBody: (
      <div className={styles.conceptLines}>
        <p className={styles.conceptLine}>
          Your <span className={styles.spike}>personalised gift list</span> is ready for Christmas
          2026.
        </p>
        <p className={styles.conceptLine}>Share with family →</p>
      </div>
    ),
    cardImage: PRICING_JOURNEY_IMAGES.seasons,
    pills: ['Christmas', 'Birthdays', 'Summer'],
  },
  {
    id: 'moments',
    title: "Pip’s Chapters",
    desc: 'First day at nursery, a new sibling, travel — help for the chapter you’re actually in.',
    isFree: false,
    Icon: Star,
    cardTag: "Pip’s Chapters",
    cardFootnote: 'First day at nursery',
    cardBody: (
      <div className={styles.conceptLines}>
        <p className={styles.conceptLine}>
          Nursery starts in <span className={styles.spike}>1 month</span>.
        </p>
        <p className={styles.conceptLine}>
          Here are <span className={styles.spike}>five personalised ideas</span> to help them settle
          →
        </p>
      </div>
    ),
    cardImage: PRICING_JOURNEY_IMAGES.moments,
    pills: ['First day at nursery', 'New sibling', 'Travel'],
  },
  {
    id: 'moveon',
    title: "Pip’s Pass-On",
    desc: 'A heads-up when something’s done its job — and the right local family to pass it on.',
    isFree: false,
    Icon: Package,
    cardTag: "Pip’s Pass-On",
    cardBody: (
      <div className={styles.conceptLines}>
        <p className={styles.conceptLine}>
          Ember has noticed your <span className={styles.spike}>white noise machine</span> — 6
          months on.
        </p>
        <p className={styles.conceptLine}>
          <span className={styles.spike}>2 local babies</span> within a mile would love it.
        </p>
        <p className={styles.conceptLine}>Free up space →</p>
      </div>
    ),
    cardImage: PRICING_JOURNEY_IMAGES.moveOn,
  },
];

function ConceptCard({ step }: { step: JourneyStep }) {
  const StepIcon = step.Icon;
  const hasExtras = Boolean(step.miniList?.length || step.pills?.length || step.footLinks?.length);

  const inner = (
    <>
      <div className={styles.conceptImageWrap}>
        <div
          className={styles.conceptImage}
          style={{ backgroundImage: step.cardImage ? `url('${step.cardImage}')` : undefined }}
          role="img"
          aria-label={step.cardTag}
        />
        {!step.isFree && (
          <span className={styles.pipChip}>
            <img src={PIP_LOGO_URL} alt="" width={20} height={20} />
            Pip’s note
          </span>
        )}
      </div>
      <div
        className={[styles.conceptBody, hasExtras || !step.cardHref ? styles.conceptBodyStack : '']
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles.conceptText}>
          <div
            className={[styles.conceptTag, step.isFree ? '' : styles.conceptTagPlus]
              .filter(Boolean)
              .join(' ')}
          >
            <StepIcon className={styles.conceptTagIcon} strokeWidth={2} aria-hidden />
            {step.cardTag}
          </div>
          {step.cardBody}
          {step.cardFootnote ? (
            <div className={styles.conceptSampleTitle}>{step.cardFootnote}</div>
          ) : null}
          {step.miniList ? (
            <ul className={styles.miniList}>
              {step.miniList.map(([label, meta]) => (
                <li key={label}>
                  <span>{label}</span>
                  <span className={styles.miniListMeta}>{meta}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {step.pills ? (
            <div className={styles.momentRow}>
              {step.pills.map((pill) => (
                <span key={pill} className={styles.momentPill}>
                  {pill}
                </span>
              ))}
            </div>
          ) : null}
          {step.footLinks ? (
            <div className={styles.conceptFootLinks}>
              {step.footLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.inlineLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
          {step.cardHref ? <span className={styles.conceptLink}>→ Open Discover</span> : null}
        </div>
        {!hasExtras && step.cardHref ? (
          <ChevronRight className={styles.conceptChevron} strokeWidth={2} aria-hidden />
        ) : null}
      </div>
    </>
  );

  if (step.cardHref) {
    return (
      <Link href={step.cardHref} className={styles.conceptCardLink}>
        <div className={styles.conceptCard}>{inner}</div>
      </Link>
    );
  }

  return <div className={styles.conceptCard}>{inner}</div>;
}

export function PipJourneyExplainer() {
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const scrollSyncLock = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [pipTransform, setPipTransform] = useState('translateY(0) scale(1)');
  const [fillHeight, setFillHeight] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileMq = window.matchMedia(MOBILE_MQ);
    setReducedMotion(motionMq.matches);
    setIsMobile(mobileMq.matches);
    const onMotion = () => setReducedMotion(motionMq.matches);
    const onMobile = () => setIsMobile(mobileMq.matches);
    motionMq.addEventListener('change', onMotion);
    mobileMq.addEventListener('change', onMobile);
    return () => {
      motionMq.removeEventListener('change', onMotion);
      mobileMq.removeEventListener('change', onMobile);
    };
  }, []);

  const layoutPip = useCallback((index: number) => {
    const targetNode = nodeRefs.current[index];
    const firstPlusNode = nodeRefs.current[1];
    if (!targetNode) return;

    const step = JOURNEY_STEPS[index];
    const nodeCenterY = targetNode.offsetTop + targetNode.offsetHeight / 2;
    const pipCenterOffset = 60;

    if (step.isFree) {
      const restY = firstPlusNode ? firstPlusNode.offsetTop - 72 : 110;
      setPipTransform(`translateY(${restY}px) scale(0.85)`);
      setFillHeight(0);
    } else {
      const activeY = nodeCenterY - pipCenterOffset;
      setPipTransform(`translateY(${activeY}px) scale(1)`);
      setFillHeight(activeY + pipCenterOffset - 32);
    }
  }, []);

  useLayoutEffect(() => {
    if (!isMobile) layoutPip(currentIndex);
  }, [currentIndex, layoutPip, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const onResize = () => layoutPip(currentIndex);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [currentIndex, layoutPip, isMobile]);

  const activateStep = useCallback(
    (index: number, isManual = false) => {
      if (isManual) {
        setPaused(true);
        setProgress(0);
      }

      setCurrentIndex(index);

      if (isMobile) {
        setDisplayIndex(index);
        setIsFading(false);
        return;
      }

      setIsFading(true);
      const fadeMs = reducedMotion ? 0 : 300;
      window.setTimeout(() => {
        setDisplayIndex(index);
        setIsFading(false);
      }, fadeMs);
    },
    [reducedMotion, isMobile],
  );

  // Mobile: scroll active slide into view when index changes (autoplay / dots)
  useEffect(() => {
    if (!isMobile) return;
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    scrollSyncLock.current = true;
    scroller.scrollTo({
      left: currentIndex * scroller.clientWidth,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
    const t = window.setTimeout(() => {
      scrollSyncLock.current = false;
    }, reducedMotion ? 50 : 450);
    return () => window.clearTimeout(t);
  }, [currentIndex, isMobile, reducedMotion]);

  useEffect(() => {
    if (paused || reducedMotion) return;

    const id = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + (UPDATE_RATE_MS / AUTO_DURATION_MS) * 100;
        if (next >= 100) {
          const nextIndex = (currentIndex + 1) % JOURNEY_STEPS.length;
          activateStep(nextIndex);
          return 0;
        }
        return next;
      });
    }, UPDATE_RATE_MS);

    return () => window.clearInterval(id);
  }, [paused, reducedMotion, currentIndex, activateStep]);

  const onMobileScroll = useCallback(() => {
    if (scrollSyncLock.current) return;
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;
    const width = scroller.clientWidth;
    if (!width) return;
    const index = Math.round(scroller.scrollLeft / width);
    const clamped = Math.max(0, Math.min(JOURNEY_STEPS.length - 1, index));
    if (clamped !== currentIndex) {
      setPaused(true);
      setProgress(0);
      setCurrentIndex(clamped);
      setDisplayIndex(clamped);
    }
  }, [currentIndex]);

  const step = JOURNEY_STEPS[displayIndex];
  const freeSteps = JOURNEY_STEPS.filter((s) => s.isFree);
  const plusSteps = JOURNEY_STEPS.filter((s) => !s.isFree);

  const renderNode = (journeyStep: JourneyStep, globalIndex: number) => {
    const Icon = journeyStep.Icon;
    const isActive = currentIndex === globalIndex;
    return (
      <button
        key={journeyStep.id}
        type="button"
        ref={(el) => {
          nodeRefs.current[globalIndex] = el;
        }}
        className={[
          styles.journeyNode,
          journeyStep.isFree ? styles.journeyNodeFree : '',
          isActive ? styles.journeyNodeActive : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => activateStep(globalIndex, true)}
        aria-pressed={isActive}
      >
        <span className={styles.nodeDot} aria-hidden />
        <span className={styles.nodeContent}>
          <span className={styles.nodeTitle}>
            {journeyStep.title}
            <Icon className={styles.nodeInlineIcon} strokeWidth={2} aria-hidden />
          </span>
          <span className={styles.nodeDesc}>{journeyStep.desc}</span>
        </span>
      </button>
    );
  };

  return (
    <div id="pip-world" className={styles.root}>
      {/* Mobile: one feature + one card per horizontal snap slide */}
      <div className={styles.mobileJourney} aria-hidden={!isMobile}>
        <p className={styles.mobileSwipeHint}>Swipe to discover &gt;</p>
        <div
          ref={mobileScrollerRef}
          className={styles.mobileScroller}
          onScroll={onMobileScroll}
          role="region"
          aria-roledescription="carousel"
          aria-label="Pip journey"
        >
          {JOURNEY_STEPS.map((journeyStep, index) => {
            const Icon = journeyStep.Icon;
            const showPlusGate = index === 1;
            return (
              <article
                key={journeyStep.id}
                className={styles.mobileSlide}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${JOURNEY_STEPS.length}: ${journeyStep.title}`}
              >
                {showPlusGate ? (
                  <div className={styles.mobilePlusGate}>
                    <span className={styles.trackDividerBadge}>
                      <img src={PIP_LOGO_URL} alt="" width={16} height={16} />
                      <Plus size={12} strokeWidth={2.5} aria-hidden />
                      Ember Plus starts here
                    </span>
                  </div>
                ) : null}
                <div className={styles.mobileFeatureHead}>
                  <div
                    className={[
                      styles.mobilePipMark,
                      journeyStep.isFree ? styles.mobilePipMarkFree : styles.mobilePipMarkPlus,
                    ].join(' ')}
                  >
                    <img src={PIP_LOGO_URL} alt="" width={64} height={64} />
                  </div>
                  <div className={styles.mobileFeatureCopy}>
                    <div
                      className={[
                        styles.mobileFeatureTitle,
                        journeyStep.isFree ? '' : styles.mobileFeatureTitlePlus,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {journeyStep.title}
                      <Icon className={styles.mobileFeatureIcon} strokeWidth={2} aria-hidden />
                    </div>
                    <p className={styles.mobileFeatureDesc}>{journeyStep.desc}</p>
                  </div>
                </div>
                <ConceptCard step={journeyStep} />
              </article>
            );
          })}
        </div>

        <div className={styles.mobileDots} role="tablist" aria-label="Journey stops">
          {JOURNEY_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={currentIndex === i}
              aria-label={s.title}
              className={[styles.mobileDot, currentIndex === i ? styles.mobileDotActive : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => activateStep(i, true)}
            />
          ))}
        </div>

        <div className={styles.progressBar} aria-hidden>
          <div
            className={[
              styles.progressFill,
              JOURNEY_STEPS[currentIndex]?.isFree ? styles.progressFillFree : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ width: `${paused || reducedMotion ? 0 : Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Desktop: vertical track + sticky concept card */}
      <div className={styles.desktopJourney} aria-hidden={isMobile}>
        <div className={styles.journeyContainer}>
          <div className={styles.journeyTrackPanel} ref={trackRef}>
            <div className={styles.trackLineBg} aria-hidden />
            <div className={styles.trackLinePlusBg} aria-hidden />
            <div
              className={styles.trackLineFill}
              style={{ height: `${Math.max(0, fillHeight)}px` }}
              aria-hidden
            />

            <button
              type="button"
              className={[
                styles.pipTraveler,
                JOURNEY_STEPS[currentIndex]?.isFree
                  ? styles.pipTravelerSleeping
                  : styles.pipTravelerActive,
              ].join(' ')}
              style={{ transform: pipTransform }}
              onClick={() => activateStep(currentIndex === 0 ? 1 : currentIndex, true)}
              aria-label="Pip along the journey"
            >
              <img src={PIP_LOGO_URL} alt="Pip" width={100} height={100} />
            </button>

            <div>{freeSteps.map((s) => renderNode(s, JOURNEY_STEPS.indexOf(s)))}</div>

            <div className={styles.trackDivider}>
              <span className={styles.trackDividerBadge}>
                <img src={PIP_LOGO_URL} alt="" width={16} height={16} />
                <Plus size={12} strokeWidth={2.5} aria-hidden />
                Ember Plus starts here
              </span>
            </div>

            <div>{plusSteps.map((s) => renderNode(s, JOURNEY_STEPS.indexOf(s)))}</div>
          </div>

          <div className={styles.journeyDisplayPanel}>
            <div
              className={[styles.conceptViewer, isFading ? styles.conceptViewerFading : '']
                .filter(Boolean)
                .join(' ')}
            >
              <ConceptCard step={step} />
            </div>
            <div className={styles.progressBar} aria-hidden>
              <div
                className={[styles.progressFill, step.isFree ? styles.progressFillFree : '']
                  .filter(Boolean)
                  .join(' ')}
                style={{ width: `${paused || reducedMotion ? 0 : Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
