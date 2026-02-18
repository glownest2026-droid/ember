/**
 * PR2: Gate actions behind auth and replay once after sign-in.
 * No anonymous saves; pending action stored in sessionStorage and replayed exactly once.
 */

const PENDING_ACTION_KEY = 'ember.pendingAuthAction.v1';

export interface PendingAuthAction {
  actionId: string;
  payload: Record<string, unknown>;
  returnUrl: string;
  createdAt: number;
}

export interface RequireAuthThenOpts {
  actionId: string;
  payload: Record<string, unknown>;
  run: () => Promise<void> | void;
  openAuthModal: (opts: { signinUrl: string }) => void;
  isAuthenticated: () => Promise<boolean>;
  getReturnUrl?: () => string;
}

/**
 * If user is authed, run() immediately. If not, store pending action and open auth modal.
 * Replay is triggered separately by replayPendingAuthAction() after sign-in.
 */
export async function requireAuthThen(opts: RequireAuthThenOpts): Promise<void> {
  const { actionId, payload, run, openAuthModal, isAuthenticated, getReturnUrl } = opts;
  const authed = await isAuthenticated();
  if (authed) {
    await run();
    return;
  }
  const returnUrl = typeof getReturnUrl === 'function' ? getReturnUrl() : getReturnUrlDefault();
  const pending: PendingAuthAction = {
    actionId,
    payload,
    returnUrl,
    createdAt: Date.now(),
  };
  try {
    sessionStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(pending));
  } catch {
    // sessionStorage full or unavailable
  }
  const signinUrl = `/signin?next=${encodeURIComponent(returnUrl)}`;
  openAuthModal({ signinUrl });
}

function getReturnUrlDefault(): string {
  if (typeof window === 'undefined') return '/discover';
  return window.location.pathname + window.location.search + window.location.hash || '/discover';
}

/**
 * Read and remove pending action from sessionStorage. Call from ONE place after auth success
 * (e.g. DiscoveryPageClient when user becomes authed or on mount if already authed).
 * Returns the pending action if valid and not already replayed; clears storage before running
 * to prevent double-exec on re-renders.
 */
export function consumePendingAuthAction(): PendingAuthAction | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PENDING_ACTION_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING_ACTION_KEY);
    const parsed = JSON.parse(raw) as PendingAuthAction;
    if (!parsed?.actionId || !parsed.returnUrl) return null;
    return parsed;
  } catch {
    return null;
  }
}

export type ReplayRunner = (action: PendingAuthAction) => Promise<void> | void;

export interface ReplayPendingAuthActionOpts {
  currentPath: string;
  runReplay: ReplayRunner;
  onReplayFailure?: () => void;
}

/**
 * If there is a pending action and current path matches returnUrl (or same route),
 * run it exactly once. Call this after auth success (e.g. in DiscoveryPageClient).
 */
export async function replayPendingAuthAction(opts: ReplayPendingAuthActionOpts): Promise<boolean> {
  const { currentPath, runReplay, onReplayFailure } = opts;
  const action = consumePendingAuthAction();
  if (!action) return false;
  const returnPath = action.returnUrl.split('?')[0].split('#')[0];
  const currentPathBase = currentPath.split('?')[0].split('#')[0];
  if (returnPath !== currentPathBase) {
    return false;
  }
  try {
    await runReplay(action);
    return true;
  } catch {
    onReplayFailure?.();
    return true; // consumed, don't retry
  }
}

/**
 * Message for non-blocking toast when replay fails.
 */
export const REPLAY_FAILURE_MESSAGE =
  "Signed in — we couldn't save that just now. Please try again.";
