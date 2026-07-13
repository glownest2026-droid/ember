'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

const PIP_LOGO_URL =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

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
};

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'free',
    title: 'The Free Catalogue',
    desc: 'Search, save, and browse stage-aware ideas at your own pace.',
    isFree: true,
    Icon: LayoutList,
    cardTag: 'Self-guided',
    cardTitle: 'Explore the catalogue',
    cardSub: 'Browse stage-aware ideas by age, category, or need.',
    cardImage:
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'trail',
    title: "Pip's Trail",
    desc: "Gentle, timely cues based on your child's stage. No spam.",
    isFree: false,
    Icon: Route,
    cardTag: 'Stage shift',
    cardTitle: 'Ready to stack?',
    cardSub: 'Bring out the wooden blocks and cups.',
    cardImage:
      'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'picks',
    title: 'Pip Picks',
    desc: 'Curated shortlists when buying new. Skip the research.',
    isFree: false,
    Icon: Gift,
    cardTag: 'Pip Pick',
    cardTitle: 'Top raincoats under £30',
    cardSub: 'Highly rated for durability and sizing up.',
    cardImage:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'nearby',
    title: 'Pip Nearby',
    desc: 'Spot local parent matches when you need to borrow or buy.',
    isFree: false,
    Icon: MapPin,
    cardTag: 'Local match',
    cardTitle: 'Balance bike nearby',
    cardSub: 'Great condition, listed 2 miles away.',
    cardImage:
      'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'seasons',
    title: 'Pip Seasons',
    desc: 'Ahead-of-time ideas for summer, Christmas, and holidays.',
    isFree: false,
    Icon: Sun,
    cardTag: 'Season',
    cardTitle: 'Summer holidays',
    cardSub: 'Sun safety, travel and playtime prep.',
    cardImage:
      'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'moments',
    title: 'Pip Moments',
    desc: 'Guidance for big shifts like starting nursery or a new sibling.',
    isFree: false,
    Icon: Star,
    cardTag: 'Big shift',
    cardTitle: 'Starting nursery soon',
    cardSub: "The settling-in kit you'll actually use.",
    cardImage:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'moveon',
    title: 'Pip Move-On',
    desc: 'Nudges to pass things on and clear space at home.',
    isFree: false,
    Icon: Package,
    cardTag: 'Clear space',
    cardTitle: 'Ready to pass on?',
    cardSub: "The baby bouncer hasn't been used recently.",
    cardImage:
      'https://images.unsplash.com/photo-1584824486509-1133cb6632fa?auto=format&fit=crop&w=800&q=80',
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
      <div className={styles.sectionPipLogo}>
        <img src={PIP_LOGO_URL} alt="Pip" width={90} height={90} />
      </div>
      <p className={styles.subtitle}>
        The catalogue is yours to explore anytime. With Ember Plus, Pip connects the dots through
        your child&apos;s journey.
      </p>

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
              JOURNEY_STEPS[currentIndex]?.isFree ? styles.pipTravelerSleeping : styles.pipTravelerActive,
            ].join(' ')}
            style={{ transform: pipTransform }}
            onClick={() => activateStep(currentIndex === 0 ? 1 : currentIndex, true)}
            aria-label="Pip along the journey"
          >
            <img src={PIP_LOGO_URL} alt="" width={50} height={50} />
          </button>

          <div>{freeSteps.map((s) => renderNode(s, JOURNEY_STEPS.indexOf(s)))}</div>

          <div className={styles.trackDivider}>
            <span className={styles.trackDividerBadge}>
              <Plus size={14} strokeWidth={2} aria-hidden />
              Ember Plus
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
            <div className={styles.conceptCard}>
              <div
                className={styles.conceptImage}
                style={{ backgroundImage: `url('${step.cardImage}')` }}
                role="img"
                aria-label={step.cardTitle}
              />
              <div className={styles.conceptBody}>
                <div>
                  <div
                    className={[
                      styles.conceptTag,
                      step.isFree ? '' : styles.conceptTagPlus,
                    ]
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
            </div>
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
