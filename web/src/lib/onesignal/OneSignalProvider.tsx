'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  getOneSignalAppId,
  linkOneSignalExternalUser,
  unlinkOneSignalExternalUser,
} from './client';

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  const lastSyncedUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!getOneSignalAppId()) return;

    const supabase = createClient();
    let cancelled = false;

    const syncUser = async (userId: string | null) => {
      if (cancelled || lastSyncedUserIdRef.current === userId) return;
      try {
        if (userId) {
          await linkOneSignalExternalUser(userId);
        } else {
          await unlinkOneSignalExternalUser();
        }
        if (!cancelled) {
          lastSyncedUserIdRef.current = userId;
        }
      } catch {
        // Fail closed: keep Ember usable even if OneSignal fails.
      }
    };

    void supabase.auth.getUser().then(({ data }) => {
      void syncUser(data.user?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncUser(session?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
