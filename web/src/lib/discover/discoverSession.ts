/** Persist /discover journey position so returning via /discover resumes where the user left off. */

const SESSION_PREFIX = 'ember_discover_session';

function sessionKey(childId: string | null | undefined): string {
  const id = childId?.trim() || 'none';
  return `${SESSION_PREFIX}:${id}`;
}

/** Save the full discover path (pathname + search) for this child scope. */
export function saveDiscoverSession(path: string, childId?: string | null): void {
  if (typeof window === 'undefined') return;
  const trimmed = path.trim();
  if (!trimmed.startsWith('/discover')) return;
  try {
    sessionStorage.setItem(sessionKey(childId), trimmed);
  } catch {
    // ignore quota / private mode
  }
}

/** Read saved discover path without clearing. */
export function readDiscoverSession(childId?: string | null): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = sessionStorage.getItem(sessionKey(childId));
    if (!value?.startsWith('/discover')) return null;
    return value;
  } catch {
    return null;
  }
}
