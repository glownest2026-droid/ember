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
  /** Optional destination for the concept card (e.g. Discover). */
  cardHref?: string;
};

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'free',
    title: 'Browse Ember free',
    desc: 'Stage ideas, saves, and gift lists — at your own pace.',
    isFree: true,
    Icon: LayoutList,
    cardTag: 'Free',
    cardTitle: 'Explore the catalogue',
    cardSub: 'Over 600 stage-aware ideas. Open Discover and browse by age.',
    cardImage: PRICING_JOURNEY_IMAGES.catalogue,
    cardHref: '/discover',
  },
  {
    id: 'trail',
    title: "Pip's Trail",
    desc: 'Calm cues when your child’s stage shifts.',
    isFree: false,
    Icon: Route,
    cardTag: 'Pip’s Trail',
    cardTitle: 'Bring the cups back out',
    cardSub: 'If you already have stacking cups, the shift now is pouring and nesting — not buying another set.',
    cardImage: PRICING_JOURNEY_IMAGES.trail,
  },
  {
    id: 'picks',
    title: 'Pip Picks',
    desc: 'A short product list when buying is worth it.',
    isFree: false,
    Icon: Gift,
    cardTag: 'Pip Picks',
    cardTitle: 'First puzzles worth considering',
    cardSub: 'A tight shortlist for this stage — with why now, not a shop floor dump.',
    cardImage: PRICING_JOURNEY_IMAGES.picks,
  },
  {
    id: 'nearby',
    title: 'Pip Nearby',
    desc: 'Local matches when borrow or pre-loved fits better.',
    isFree: false,
    Icon: MapPin,
    cardTag: 'Pip Nearby',
    cardTitle: 'Balance gear near you',
    cardSub: 'Spot local listings that fit this stage before you buy new.',
    cardImage: PRICING_JOURNEY_IMAGES.nearby,
  },
  {
    id: 'moveon',
    title: 'Pip Move-On',
    desc: 'When something’s outgrown — pass on, list, or clear space.',
    isFree: false,
    Icon: Package,
    cardTag: 'Pip Move-On',
    cardTitle: 'Ready to pass on?',
    cardSub: 'Pip flags kit you may no longer need, and who nearby might want it.',
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
            {!journeyStep.isFree && (
              <img src={PIP_LOGO_URL} alt="" className={styles.nodePipMark} width={18} height={18} />
            )}
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
            Pip spotted this
          </span>
        )}
      </div>
      <div className={styles.conceptBody}>
        <div>
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
        </div>
        <ChevronRight className={styles.conceptChevron} strokeWidth={2} aria-hidden />
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
              Pip joins with Plus
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
