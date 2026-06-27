'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { readDiscoverSession } from '@/lib/discover/discoverSession';

/** Client redirect: resume saved discover section or fall back to server-computed default. */
export function DiscoverSessionRedirect({
  defaultPath,
  childId,
}: {
  defaultPath: string;
  childId?: string | null;
}) {
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    const saved = readDiscoverSession(childId);
    router.replace(saved ?? defaultPath);
  }, [defaultPath, childId, router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-[#FBFAF7] text-[#66717D] text-sm">
      Loading discover…
    </div>
  );
}
