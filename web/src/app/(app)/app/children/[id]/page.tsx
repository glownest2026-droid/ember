export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

/** Backwards compatibility: redirect /app/children/[id] to /add-children/[id] */
export default async function EditChildPageRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/add-children/${id}`);
}
