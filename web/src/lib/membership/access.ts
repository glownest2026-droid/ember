import type { User } from '@supabase/supabase-js';

export type EmberMembershipType = 'free' | 'ember_plus';

export type EmberMembershipAccess = {
  membershipType: EmberMembershipType;
  canSeeLockedPicks: boolean;
  isFounderProxy: boolean;
};

const FOUNDER_EMAIL = 'timwd23@gmail.com';

function normaliseMembershipType(value: unknown): EmberMembershipType {
  const raw = String(value ?? '').trim().toLowerCase();
  if (raw === 'ember_plus' || raw === 'plus' || raw === 'paid') return 'ember_plus';
  return 'free';
}

export function resolveEmberMembershipAccess(user: User | null | undefined): EmberMembershipAccess {
  const email = user?.email?.trim().toLowerCase() ?? '';
  const isFounderProxy = email === FOUNDER_EMAIL;

  const metadataMembership =
    user?.app_metadata?.membership_type ??
    user?.app_metadata?.membershipType;

  const membershipType = isFounderProxy ? 'ember_plus' : normaliseMembershipType(metadataMembership);

  return {
    membershipType,
    canSeeLockedPicks: membershipType === 'ember_plus',
    isFounderProxy,
  };
}
