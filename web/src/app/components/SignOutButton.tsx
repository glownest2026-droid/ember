'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  return (
    <button
      className="btn"
      onClick={async () => {
        await supabase.auth.signOut();
        router.replace('/');
      }}
    >
      Sign out
    </button>
  );
}
