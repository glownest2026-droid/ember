import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/** Backwards compatibility: redirect /app/children/new to /add-children/new */
export default function NewChildPageRedirect() {
  redirect('/add-children/new');
}
