import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/** Backwards compatibility: redirect /app/children/new to /add-children */
export default function NewChildPageRedirect() {
  redirect('/add-children');
}
