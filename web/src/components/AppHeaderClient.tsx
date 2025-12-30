'use client';

import { AppHeader } from './Header';
import SignOutButton from '../app/components/SignOutButton';

export default function AppHeaderClient({ userEmail, isAdmin }: { userEmail?: string; isAdmin?: boolean }) {
  return <AppHeader userEmail={userEmail} isAdmin={isAdmin} signOutButton={<SignOutButton />} />;
}
