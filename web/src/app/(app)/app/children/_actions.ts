'use server';

/**
 * Re-export shared children actions. All redirects go to /add-children.
 * Canonical implementation: @/lib/children/actions
 */
export { saveChild, deleteChild } from '@/lib/children/actions';
