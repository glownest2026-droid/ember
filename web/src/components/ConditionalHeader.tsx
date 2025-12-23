'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show marketing header on /app routes (they have their own header)
  if (pathname?.startsWith('/app')) {
    return null;
  }
  
  return <Header />;
}

