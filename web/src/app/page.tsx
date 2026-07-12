'use client';

import { ContentSpacer } from '@/components/subnav/ContentSpacer';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
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
  const { user } = useSubnavStats();
  return (
    <main
      className={`homepage-discover-brand min-h-screen bg-[var(--ember-bg-canvas)] ${user ? 'pb-20 md:pb-0' : ''}`}
    >
      <ContentSpacer />
      <HomeHero />
      <HomeAgeSlider />
      <HomeHowItWorks />
      <HomeFinalCTA />
      <HomeStageBlocks />
      <HomeShowsUp />
      <HomeHowWeChoose />
    </main>
  );
}
