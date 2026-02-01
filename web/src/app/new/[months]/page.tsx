import { getActiveMomentsForAgeBand, getAgeBandForAge, getGatewayAgeBandIdsWithPicks, getGatewayAgeBandsPublic, getPublishedSetForAgeBandAndMoment } from '../../../lib/pl/public';
import NewLandingPageClient from './NewLandingPageClient';

interface NewMonthsPageProps {
  params: Promise<{ months: string }>;
  searchParams: Promise<{ moment?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function NewMonthsPage({ params, searchParams }: NewMonthsPageProps) {
  const { months } = await params;
  const { moment: momentParam } = await searchParams;
  
  // Parse month param (keep /new/[months] deep links)
  const monthsNum = parseInt(months, 10);
  const parsedMonth: number | null = isNaN(monthsNum) ? null : monthsNum;

  // Load available age bands (for age-band slider)
  const ageBands = await getGatewayAgeBandsPublic();
  const bandsWithPicks = await getGatewayAgeBandIdsWithPicks();

  // Map months to age band
  const ageBand = parsedMonth === null ? null : await getAgeBandForAge(parsedMonth);
  const selectedBandHasPicks = ageBand ? bandsWithPicks.has(ageBand.id) : false;
  
  if (!ageBand) {
    // Age band not found - show empty state
    return (
      <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
        <NewLandingPageClient
          ageBands={ageBands}
          ageBand={null}
          moments={[]}
          selectedSet={null}
          monthParam={parsedMonth}
          selectedBandHasPicks={false}
          selectedMomentId={momentParam || null}
        />
      </main>
    );
  }

  // Fetch moments that have published sets for this age band
  const moments = await getActiveMomentsForAgeBand(ageBand.id);

  // Get selected moment (from query param or first available, or default to "bath" if available)
  let selectedMomentId: string | null = momentParam || null;
  
  // If no moment selected, try to find a default moment
  // The mockup uses: "bath", "help", "quiet", "energy"
  // Try to match these IDs first
  const defaultMomentIds = ['bath', 'help', 'quiet', 'energy'];
  if (!selectedMomentId && moments.length > 0) {
    // Try to find one of the default moments
    const foundDefault = moments.find(m => defaultMomentIds.includes(m.id));
    selectedMomentId = foundDefault?.id || moments[0]?.id || null;
  }

  // Fetch the published set for selected age band + moment
  let selectedSet = null;
  if (selectedMomentId) {
    selectedSet = await getPublishedSetForAgeBandAndMoment(ageBand.id, selectedMomentId);
  }

  return (
    <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
      <NewLandingPageClient
        ageBands={ageBands}
        ageBand={ageBand}
        moments={moments}
        selectedSet={selectedSet}
        monthParam={parsedMonth}
        selectedBandHasPicks={selectedBandHasPicks}
        selectedMomentId={selectedMomentId}
      />
    </main>
  );
}

