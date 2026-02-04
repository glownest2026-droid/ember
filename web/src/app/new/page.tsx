import { permanentRedirect } from 'next/navigation';

/** /new → /discover (308). Preserves query params. */
export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  Object.entries(sp || {}).forEach(([k, v]) => {
    if (v !== undefined) qs.set(k, Array.isArray(v) ? v[0]! : v);
  });
  const query = qs.toString();
  permanentRedirect(`/discover${query ? `?${query}` : ''}`);
}
