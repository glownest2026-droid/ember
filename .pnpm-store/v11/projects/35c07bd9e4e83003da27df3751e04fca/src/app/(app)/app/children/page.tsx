import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/** Backwards compatibility: redirect /app/children to /add-children */
export default function ChildrenPageRedirect() {
  redirect('/add-children');
}
