import { Metadata } from 'next';
import { createClient } from '../../../utils/supabase/server';
import { parseAgeBandSlug, getAgeBandByRange, getActiveMomentsForAgeBand, getPublishedSetsForAgeBand } from '../../../lib/pl/public';
import DiscoveryPage from '../../../components/pl/DiscoveryPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface AgePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AgePageProps): Promise<Metadata> {
  const { slug } = await params;
  const range = parseAgeBandSlug(slug);
  
  if (!range) {
    return {
      title: 'Age Range Not Found',
      description: 'The requested age range could not be found.',
    };
  }

  // Fetch age band to get label
  const ageBand = await getAgeBandByRange(range.min, range.max);
  
  if (!ageBand) {
    return {
      title: 'Age Range Not Found',
      description: 'The requested age range could not be found.',
    };
  }

  // Use relative URL - Next.js will resolve to the correct domain
  const canonicalUrl = `/ages/${slug}`;

  return {
    title: `Play Recommendations for ${ageBand.label}`,
    description: `Age-appropriate play recommendations for ${ageBand.label}.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function AgePage({ params }: AgePageProps) {
  const { slug } = await params;
  const range = parseAgeBandSlug(slug);

  if (!range) {
    return (
      <main className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Age range not found</h2>
            <p className="text-sm opacity-80">The requested age range could not be found.</p>
          </div>
        </div>
      </main>
    );
  }

  // Find age band by min/max months
  const ageBand = await getAgeBandByRange(range.min, range.max);

  if (!ageBand) {
    return (
      <main className="min-h-screen pt-20">
        <DiscoveryPage
          ageBand={null}
          moments={[]}
          setsByMoment={{}}
          currentAge={Math.floor((range.min + range.max) / 2)}
          minAge={12}
          maxAge={48}
          isCanonical={true}
          canonicalSlug={slug}
        />
      </main>
    );
  }

  // Fetch moments that have published sets for this age band
  const moments = await getActiveMomentsForAgeBand(ageBand.id);

  // Fetch all published sets for this age band
  const sets = await getPublishedSetsForAgeBand(ageBand.id) || [];

  // Group sets by moment_id
  const setsByMoment: Record<string, typeof sets> = {};
  for (const set of sets) {
    if (!setsByMoment[set.moment_id]) {
      setsByMoment[set.moment_id] = [];
    }
    setsByMoment[set.moment_id].push(set);
  }

  // Filter moments to only those with published sets
  const momentsWithSets = moments.filter(m => setsByMoment[m.id] && setsByMoment[m.id].length > 0);

  // Calculate average age for the slider
  const averageAge = Math.floor((range.min + range.max) / 2);

  return (
    <main className="min-h-screen pt-20">
      <DiscoveryPage
        ageBand={ageBand}
        moments={momentsWithSets}
        setsByMoment={setsByMoment}
        currentAge={averageAge}
        minAge={12}
        maxAge={48}
        isCanonical={true}
        canonicalSlug={slug}
      />
    </main>
  );
}

