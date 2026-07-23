import { ALL_DOORWAYS, normaliseSlug, resolveDoorwayToWrapper } from '@/lib/discover/doorways';

/** Map ?focus= doorway key or wrapper slug to a gateway wrapper slug for this age band. */
export function resolveWrapperSlugFromFocusParam(
  focus: string | undefined,
  wrappers: { ux_slug: string }[]
): string | null {
  if (!focus?.trim()) return null;
  const key = normaliseSlug(focus.trim());

  const doorway = ALL_DOORWAYS.find(
    (d) =>
      normaliseSlug(d.key) === key ||
      normaliseSlug(d.wrapperSlug) === key ||
      (d.alternateSlugs ?? []).some((s) => normaliseSlug(s) === key)
  );
  if (doorway) {
    const resolved = resolveDoorwayToWrapper(doorway, wrappers);
    if (resolved) return resolved.ux_slug;
  }

  const direct = wrappers.find((w) => normaliseSlug(w.ux_slug) === key);
  return direct?.ux_slug ?? null;
}
