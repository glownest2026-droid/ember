import { redirect } from 'next/navigation';
import { getActiveAgeBands } from '../../lib/pl/public';
import { getNearestSupportedMonth, resolveAgeBandForMonth } from '../../lib/pl/ageBandResolution';

export default async function NewPage() {
  // Default target month (matching the mockup)
  const defaultMonth = 26;

  // Use the shared deterministic resolver so /new always lands on a supported month when possible.
  try {
    const ageBands = await getActiveAgeBands();
    const resolution = resolveAgeBandForMonth(defaultMonth, ageBands);
    if (resolution.band) {
      redirect(`/new/${defaultMonth}`);
    }
    const nearest = getNearestSupportedMonth(defaultMonth, ageBands);
    if (nearest !== null) {
      redirect(`/new/${nearest}`);
    }
  } catch {
    // Fall through to default redirect
  }

  redirect(`/new/${defaultMonth}`);
}

