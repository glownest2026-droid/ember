// web/src/app/page.tsx
import { getServerUser } from "../lib/auth";
import HomePageClient from "./page-client";

export default async function HomePage() {
  const { user } = await getServerUser();
  const isSignedIn = !!user;

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--brand-bg-1, #FFFCF8) 0%, var(--brand-bg-2, #FFFFFF) 100%)' }}>
      <HomePageClient isSignedIn={isSignedIn} />
    </main>
  );
}
