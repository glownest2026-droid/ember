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
    cardTitle: 'Explore 600+ stage ideas',
    cardSub:
      'Personalised by age. Guidance that assumes your cupboards aren’t empty — and a Smart Marketplace when you’re listing or looking locally.',
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
    cardTitle: 'Bring the cups back out',
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
    cardTitle: 'First puzzles for this stage',
    cardSub: 'Ember does the sorting; you keep the evening.',
    cardImage: PRICING_JOURNEY_IMAGES.picks,
    miniList: [
      ['Chunky 2-piece starter', 'why now'],
      ['Simple knob puzzle', 'why now'],
      ['Skip if you’ve got one', 'reuse'],
    ],
  },
  {
    id: 'proximity',
    title: 'Pip Proximity',
    desc: 'Local matches for this age — when they fit — so you’re not living in the listings.',
    isFree: false,
    Icon: MapPin,
    cardTag: 'Pip Proximity',
    cardTitle: 'Balance gear two streets away',
    cardSub:
      'Need-first matching on the Smart Marketplace. Borrow or buy pre-loved when new isn’t needed.',
    cardImage: PRICING_JOURNEY_IMAGES.proximity,
  },
  {
    id: 'seasons',
    title: "Pip’s Seasons",
    desc: 'Christmas, birthdays, summer — timed early enough to act, tuned to their age.',
    isFree: false,
    Icon: Sun,
    cardTag: 'Pip’s Seasons',
    cardTitle: 'Christmas list before December hits',
    cardSub: 'Useful ideas relatives can follow — so you’re not still deciding on the 22nd.',
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
    cardTitle: 'Nursery starts next month',
    cardSub: 'Spare clothes, comfort kit, settling weeks — sized to their age, for this week.',
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
    cardTitle: 'Ready to pass on?',
    cardSub:
      'Kit that’s aging out of use — list on the Smart Marketplace, donate, or find a family nearby.',
    cardImage: PRICING_JOURNEY_IMAGES.moveOn,
  },
];

export function PipJourneyExplainer() {
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [pipTransform, setPipTransform] = useState('translateY(0) scale(1)');
  const [fillHeight, setFillHeight] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
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
    layoutPip(currentIndex);
  }, [currentIndex, layoutPip]);

  useEffect(() => {
    const onResize = () => layoutPip(currentIndex);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [currentIndex, layoutPip]);

  const activateStep = useCallback(
    (index: number, isManual = false) => {
      if (isManual) {
        setPaused(true);
        setProgress(0);
      }

      setCurrentIndex(index);
      setIsFading(true);

      const fadeMs = reducedMotion ? 0 : 300;
      window.setTimeout(() => {
        setDisplayIndex(index);
        setIsFading(false);
      }, fadeMs);
    },
    [reducedMotion],
  );

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

  const step = JOURNEY_STEPS[displayIndex];
  const StepIcon = step.Icon;
  const freeSteps = JOURNEY_STEPS.filter((s) => s.isFree);
  const plusSteps = JOURNEY_STEPS.filter((s) => !s.isFree);
  const hasExtras = Boolean(step.miniList?.length || step.pills?.length);

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

  const cardInner = (
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
          <div className={styles.conceptTitle}>{step.cardTitle}</div>
          <div className={styles.conceptSub}>{step.cardSub}</div>
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
          {step.cardHref ? (
            <span className={styles.conceptLink}>→ Open Discover</span>
          ) : null}
        </div>
        {!hasExtras && step.cardHref ? (
          <ChevronRight className={styles.conceptChevron} strokeWidth={2} aria-hidden />
        ) : null}
      </div>
    </>
  );

  return (
    <div id="pip-world" className={styles.root}>
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
            {step.cardHref ? (
              <Link href={step.cardHref} className={styles.conceptCardLink}>
                <div className={styles.conceptCard}>{cardInner}</div>
              </Link>
            ) : (
              <div className={styles.conceptCard}>{cardInner}</div>
            )}
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
  );
}
