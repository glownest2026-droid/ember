'use client';

import { useEffect } from 'react';
import { discoverManrope } from '@/lib/discover/manrope';

/** Manrope + Figma app-shell CSS variables on document root (discover / my-ideas / marketplace / family). */
export function useFigmaAppShellTypography() {
  useEffect(() => {
    document.documentElement.classList.add(discoverManrope.variable, 'ember-figma-app');
    document.documentElement.style.setProperty('--brand-font-body', 'var(--font-discover-manrope)');
    document.documentElement.style.setProperty('--brand-font-heading', 'var(--font-discover-manrope)');
    document.documentElement.style.setProperty('--brand-font-subheading', 'var(--font-discover-manrope)');
    return () => {
      document.documentElement.classList.remove(discoverManrope.variable, 'ember-figma-app');
      document.documentElement.style.removeProperty('--brand-font-body');
      document.documentElement.style.removeProperty('--brand-font-heading');
      document.documentElement.style.removeProperty('--brand-font-subheading');
    };
  }, []);
}
