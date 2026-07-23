'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { HOME_STAGE2_IMAGES } from './homeStage2Images';
import { HomeStage2Media } from './HomeStage2Media';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';

export function HomeStageBlocks() {
  const reducedMotion = useReducedMotion() ?? false;
  const transition = { duration: reducedMotion ? 0 : 0.7 };

  return (
    <>
      {/* Block 1: Parenting moves in stages (image left) */}
      <section className={`${EMBER_MARKETING_CONTAINER} py-20 lg:py-28`}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={transition}
            className="home-media relative h-[320px] lg:h-[380px] lg:order-1"
          >
            <HomeStage2Media
              src={HOME_STAGE2_IMAGES.stages}
              alt="Low shelf tidy-up Stage 2 play idea"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={transition}
            className="lg:order-2"
          >
            <p className="home-pullquote text-[var(--ember-text-high)]">
              Parenting moves in stages. So should what you buy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Block 2: Built around how children actually grow */}
      <section className="bg-gradient-to-b from-[var(--ember-surface-primary)] to-[var(--ember-surface-soft)] py-20 lg:py-28">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={transition}
            >
              <h2 className="home-section-title mb-4 text-[var(--ember-text-high)]">
                Built around how children actually grow.
              </h2>
              <p className="home-section-lead mb-6">
                Every stage brings new discoveries. We show you what&apos;s next for their stage.
              </p>
              <Link
                href="/discover"
                className="home-link inline-flex items-center gap-2 text-[var(--ember-accent-base)] hover:gap-3 transition-all"
              >
                Learn about stages
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={transition}
              className="home-media relative h-[360px] lg:h-[440px]"
            >
              <HomeStage2Media
                src={HOME_STAGE2_IMAGES.grow}
                alt="Hide-and-squeak toys Stage 2 play idea"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>

          {/* Block 3: What they're practising matters */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={transition}
              className="home-media relative h-[360px] lg:h-[440px] lg:order-1"
            >
              <HomeStage2Media
                src={HOME_STAGE2_IMAGES.practising}
                alt="Stacking and nesting cups Stage 2 play idea"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={transition}
              className="lg:order-2"
            >
              <h2 className="home-section-title mb-4 text-[var(--ember-text-high)]">
                What they&apos;re practising matters.
              </h2>
              <p className="home-section-lead mb-6">
                We match products to what your child is actually doing, not what marketing says they should have.
              </p>
              <Link
                href="/discover"
                className="home-link inline-flex items-center gap-2 text-[var(--ember-accent-base)] hover:gap-3 transition-all"
              >
                See examples
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
