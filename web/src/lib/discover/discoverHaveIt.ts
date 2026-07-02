/** Session persistence for Discover "Have it" toggles (survives re-renders / auth hydration). */

const STORAGE_KEY = 'ember.discover.haveCategories.v1';

type HaveStore = Record<string, true>;

function scopeKey(userId: string, childId: string | null | undefined): string {
  return `${userId}|${childId ?? '__none__'}`;
}

function readStore(): HaveStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as HaveStore;
  } catch {
    return {};
  }
}

function writeStore(store: HaveStore) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors
  }
}

export function readHaveCategoryIds(userId: string, childId: string | null | undefined): Set<string> {
  const store = readStore();
  const prefix = `${scopeKey(userId, childId)}:`;
  const ids = new Set<string>();
  for (const key of Object.keys(store)) {
    if (key.startsWith(prefix)) ids.add(key.slice(prefix.length));
  }
  return ids;
}

export function writeHaveCategoryId(
  userId: string,
  childId: string | null | undefined,
  categoryId: string,
  have: boolean
) {
  const store = readStore();
  const entryKey = `${scopeKey(userId, childId)}:${categoryId}`;
  if (have) store[entryKey] = true;
  else delete store[entryKey];
  writeStore(store);
}

export function mergeHaveCategoryIds(
  userId: string,
  childId: string | null | undefined,
  fromDb: Iterable<string>
): Set<string> {
  const merged = readHaveCategoryIds(userId, childId);
  for (const id of fromDb) merged.add(id);
  return merged;
}
