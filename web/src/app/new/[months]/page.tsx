import { permanentRedirect } from 'next/navigation';

/** Route consolidation: /new/[months] → /discover/[months] (308). Preserves query params. */
export default async function NewMonthsRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ months: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { months } = await params;
  const sp = await searchParams;
  const qs = new URLSearchParams();
  Object.entries(sp || {}).forEach(([k, v]) => {
    if (v !== undefined) qs.set(k, Array.isArray(v) ? v[0]! : v);
  });
  const query = qs.toString();
  permanentRedirect(`/discover/${months}${query ? `?${query}` : ''}`);
}
