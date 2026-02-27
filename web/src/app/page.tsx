'use client';

import { ContentSpacer } from '@/components/subnav/ContentSpacer';
import {
  HomeHero,
  HomeAgeSlider,
  HomeHowItWorks,
  HomeStageBlocks,
  HomeShowsUp,
  HomeHowWeChoose,
  HomeFinalCTA,
} from '@/components/home';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--ember-bg-canvas)]" style={{ fontFamily: 'var(--font-sans)' }}>
      <ContentSpacer />
      <HomeHero />
      <HomeAgeSlider />
      <HomeHowItWorks />
      <HomeStageBlocks />
      <HomeShowsUp />
      <HomeHowWeChoose />
      <HomeFinalCTA />
    </main>
  );
}
