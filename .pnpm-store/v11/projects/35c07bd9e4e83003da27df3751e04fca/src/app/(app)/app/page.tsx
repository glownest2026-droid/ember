export const dynamic = "force-dynamic";
// web/src/app/(app)/app/page.tsx
import { redirect } from 'next/navigation';

/** Legacy PWA start_url and bookmarks — send to the real app home. */
export default function AppHome() {
  redirect('/discover');
}
