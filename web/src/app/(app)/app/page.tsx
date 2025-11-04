// web/src/app/(app)/app/page.tsx
import Link from 'next/link';
import { createClient } from '../../../utils/supabase/server';

export default async function AppHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Middleware should normally redirect first, but this is a safe fallback.
    return (
      <div className="container-wrap">
        <h1 className="text-2xl font-semibold mb-2">Not signed in</h1>
        <Link href="/signin" className="btn btn-primary">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="container-wrap">
      <h1 className="text-2xl font-semibold mb-2">Welcome</h1>
      <p className="mb-4">Signed in as <strong>{user.email}</strong></p>

      {/* Post to /auth/signout to clear session on the server and return home */}
      <form action="/auth/signout" method="post">
        <button className="btn">Sign out</button>
      </form>
    </div>
  );
}
