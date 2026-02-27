'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

const STAGES_IMAGE = '/home/stages.png';
const UNSPLASH_PARENT =
  'https://images.unsplash.com/photo-1758513359249-95d9f54f280b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
const UNSPLASH_BLOCKS =
  'https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

export function HomeStageBlocks() {
  const reducedMotion = useReducedMotion() ?? false;
  const transition = { duration: reducedMotion ? 0 : 0.7 };

  return (
    <>
      {/* Block 1: Parenting moves in stages — image left */}
      <section className="max-w-[90rem] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={transition}
            className="relative rounded-3xl overflow-hidden shadow-[0px_20px_60px_rgba(0,0,0,0.12)] h-[350px] lg:h-[400px] lg:order-1"
          >
            <Image src={STAGES_IMAGE} alt="Children sharing toys" className="w-full h-full object-cover" width={800} height={400} sizes="(max-width: 1024px) 100vw, 50vw" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={transition}
            className="lg:order-2"
          >
            <p
              className="text-3xl lg:text-5xl text-[var(--ember-text-high)] leading-tight"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, letterSpacing: '-0.01em' }}
            >
              Parenting moves in stages. So should what you buy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Block 2: Built around how children actually grow */}
      <section className="bg-gradient-to-b from-[var(--ember-surface-primary)] to-[var(--ember-surface-soft)] py-24 lg:py-32">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={transition}
            >
              <h2
                className="text-4xl lg:text-5xl mb-6 text-[var(--ember-text-high)]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, letterSpacing: '-0.01em' }}
              >
                Built around how children actually grow.
              </h2>
              <p className="text-xl lg:text-2xl text-[var(--ember-text-low)] leading-relaxed mb-8">
                Every stage brings new discoveries. We show you what&apos;s next for their stage.
              </p>
              <Link href="/discover" className="flex items-center gap-2 text-[var(--ember-accent-base)] text-lg hover:gap-3 transition-all font-semibold">
                Learn about stages
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={transition}
              className="relative rounded-3xl overflow-hidden shadow-[0px_20px_60px_rgba(0,0,0,0.12)] h-[400px] lg:h-[500px]"
            >
              <Image src={UNSPLASH_PARENT} alt="Parent playing with toddler" className="w-full h-full object-cover" width={1080} height={500} sizes="(max-width: 1024px) 100vw, 50vw" />
            </motion.div>
          </div>

          {/* Block 3: What they're practising matters */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={transition}
              className="relative rounded-3xl overflow-hidden shadow-[0px_20px_60px_rgba(0,0,0,0.12)] h-[400px] lg:h-[500px] lg:order-1"
            >
              <Image src={UNSPLASH_BLOCKS} alt="Toddler learning with blocks" className="w-full h-full object-cover" width={1080} height={500} sizes="(max-width: 1024px) 100vw, 50vw" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={transition}
              className="lg:order-2"
            >
              <h2
                className="text-4xl lg:text-5xl mb-6 text-[var(--ember-text-high)]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, letterSpacing: '-0.01em' }}
              >
                What they&apos;re practising matters.
              </h2>
              <p className="text-xl lg:text-2xl text-[var(--ember-text-low)] leading-relaxed mb-8">
                We match products to what your child is actually doing — not what marketing says they should have.
              </p>
              <Link href="/discover" className="flex items-center gap-2 text-[var(--ember-accent-base)] text-lg hover:gap-3 transition-all font-semibold">
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
