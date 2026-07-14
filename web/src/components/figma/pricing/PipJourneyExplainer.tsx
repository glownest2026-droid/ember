'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

type JourneyStep = {
  id: string;
  title: string;
  desc: string;
  isFree: boolean;
  Icon: LucideIcon;
  cardTag: string;
  cardTitle: string;
  cardSub: string;
  cardImage: string;
  cardHref?: string;
  miniList?: [string, string][];
  pills?: string[];
};

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'free',
    title: 'Discover + Smart Marketplace',
    desc: '600+ stage ideas, saves, gift lists and local matching — whenever you open Ember.',
    isFree: true,
    Icon: LayoutList,
    cardTag: 'Free',
    cardTitle: 'Catalogue example',
    cardSub:
      'Browse stage ideas by age when you’ve got a minute — and list or look on the Smart Marketplace without living in endless tabs.',
    cardImage: PRICING_JOURNEY_IMAGES.catalogue,
    cardHref: '/discover',
  },
  {
    id: 'pathway',
    title: "Pip’s Pathway",
    desc: 'A nudge when they’re moving into something new — before you feel six months behind.',
    isFree: false,
    Icon: Route,
    cardTag: 'Pip’s Pathway',
    cardTitle: 'Cups back out',
    cardSub:
      'If you’ve already got stacking cups, this stage is pouring and nesting — not another set cluttering the shelf.',
    cardImage: PRICING_JOURNEY_IMAGES.pathway,
  },
  {
    id: 'picks',
    title: "Pip’s Picks",
    desc: 'A short research-backed list for this age — already sorted.',
    isFree: false,
    Icon: Gift,
    cardTag: 'Pip’s Picks',
    cardTitle: 'Sample shortlist',
    cardSub:
      'A few stage-fit options with why they matter now — so you can decide tonight without another research spiral.',
    cardImage: PRICING_JOURNEY_IMAGES.picks,
    miniList: [
      ['Argos', 'chunky starter puzzle'],
      ['Amazon', 'simple knob puzzle'],
      ['Ergobaby', 'carrier — if you need one'],
    ],
  },
  {
    id: 'proximity',
    title: 'Pip Proximity',
    desc: 'Local matches for this age — when they fit — so you’re not living in the listings.',
    isFree: false,
    Icon: MapPin,
    cardTag: 'Pip Proximity',
    cardTitle: 'Local match',
    cardSub:
      'Need-first matching on the Smart Marketplace — borrow or buy pre-loved nearby when new isn’t needed.',
    cardImage: PRICING_JOURNEY_IMAGES.proximity,
  },
  {
    id: 'seasons',
    title: "Pip’s Seasons",
    desc: 'Christmas, birthdays, summer — timed early enough to act, tuned to their age.',
    isFree: false,
    Icon: Sun,
    cardTag: 'Pip’s Seasons',
    cardTitle: 'Season nudge',
    cardSub:
      'Useful gift and kit ideas relatives can follow — so you’re not still deciding on the 22nd of December.',
    cardImage: PRICING_JOURNEY_IMAGES.seasons,
    pills: ['Christmas', 'Birthdays', 'Summer'],
  },
  {
    id: 'moments',
    title: "Pip’s Moments",
    desc: 'Practical help for the moment you’re in — not a generic month label.',
    isFree: false,
    Icon: Star,
    cardTag: 'Pip’s Moments',
    cardTitle: 'Life moment',
    cardSub:
      'Spare clothes, comfort kit and settling weeks for nursery — sized to their age, for the week you’re in.',
    cardImage: PRICING_JOURNEY_IMAGES.moments,
    pills: ['Nursery', 'New sibling', 'Travel'],
  },
  {
    id: 'moveon',
    title: 'Pip Move-On',
    desc: 'A heads-up when something’s done its job — and a path to pass it on.',
    isFree: false,
    Icon: Package,
    cardTag: 'Pip Move-On',
    cardTitle: 'Pass-on nudge',
    cardSub:
      'Kit that’s aging out of use — list on the Smart Marketplace, donate, or find a family nearby.',
    cardImage: PRICING_JOURNEY_IMAGES.moveOn,
  },
];

function ConceptCard({ step }: { step: JourneyStep }) {
  const StepIcon = step.Icon;
  const hasExtras = Boolean(step.miniList?.length || step.pills?.length);

  const inner = (
    <>
      <div className={styles.conceptImageWrap}>
        <div
          className={styles.conceptImage}
          style={{ backgroundImage: step.cardImage ? `url('${step.cardImage}')` : undefined }}
          role="img"
          aria-label={step.cardTitle}
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
          <p className={styles.conceptExplainer}>{step.cardSub}</p>
          <div className={styles.conceptSampleTitle}>{step.cardTitle}</div>
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
    const pipCenterOffset = 40;

    if (step.isFree) {
      const restY = firstPlusNode ? firstPlusNode.offsetTop - 56 : 110;
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
        <p className={styles.mobileSwipeHint}>Swipe to discover each feature</p>
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
                      Plus starts here
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
                    <img src={PIP_LOGO_URL} alt="" width={36} height={36} />
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
              <img src={PIP_LOGO_URL} alt="Pip" width={50} height={50} />
            </button>

            <div>{freeSteps.map((s) => renderNode(s, JOURNEY_STEPS.indexOf(s)))}</div>

            <div className={styles.trackDivider}>
              <span className={styles.trackDividerBadge}>
                <img src={PIP_LOGO_URL} alt="" width={16} height={16} />
                <Plus size={12} strokeWidth={2.5} aria-hidden />
                Plus starts here
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
