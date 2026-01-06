export const dynamic = "force-dynamic";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../../../../../utils/supabase/server';
import { isAdmin } from '../../../../../../lib/admin';
import MomentSetEditor from './_components/MomentSetEditor';

export default async function AgeBandAdminPage({ 
  params 
}: { 
  params: Promise<{ ageBandId: string }> 
}) {
  const { ageBandId } = await params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/signin?next=/app/admin/pl/${ageBandId}`);
  }

  const admin = await isAdmin();
  if (!admin) {
    return (
      <div className="container-wrap py-8">
        <div className="card p-6 space-y-4 max-w-md">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>Not authorized</h1>
          <p className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Load age band
  let ageBand: any = null;
  let moments: any[] = [];
  let sets: any[] = [];
  let categoryTypes: any[] = [];
  let products: any[] = [];
  let dbError: string | null = null;

  try {
    const { data: ageBandData, error: ageBandError } = await supabase
      .from('pl_age_bands')
      .select('*')
      .eq('id', ageBandId)
      .single();

    if (ageBandError) {
      if (ageBandError.code === '42P01' || ageBandError.message.includes('does not exist')) {
        dbError = 'Database not migrated yet. Please run the PL-0 migration SQL file.';
      } else {
        dbError = `Error loading age band: ${ageBandError.message}`;
      }
    } else {
      ageBand = ageBandData;
    }

    // Load active moments
    const { data: momentsData, error: momentsError } = await supabase
      .from('pl_moments')
      .select('*')
      .eq('is_active', true)
      .order('label', { ascending: true });

    if (!momentsError) {
      moments = momentsData || [];
    }

    // Load existing sets for this age band with cards and evidence
    const { data: setsData, error: setsError } = await supabase
      .from('pl_age_moment_sets')
      .select(`
        *,
        pl_reco_cards (
          id,
          rank,
          lane,
          because,
          category_type_id,
          product_id,
          pl_evidence (
            id,
            source_type,
            url,
            quote_snippet,
            confidence,
            captured_at
          )
        )
      `)
      .eq('age_band_id', ageBandId)
      .order('created_at', { ascending: true });

    if (!setsError) {
      sets = setsData || [];
    }

    // Load category types for dropdowns
    const { data: categoryTypesData } = await supabase
      .from('pl_category_types')
      .select('*')
      .order('label', { ascending: true });

    if (categoryTypesData) {
      categoryTypes = categoryTypesData;
    }

    // Load products for dropdowns (limit to reasonable number)
    const { data: productsData } = await supabase
      .from('products')
      .select('id, name, age_band')
      .eq('age_band', ageBandId)
      .order('name', { ascending: true })
      .limit(100);

    if (productsData) {
      products = productsData;
    }
  } catch (err: any) {
    dbError = `Unexpected error: ${err.message || 'Unknown error'}`;
  }

  if (dbError) {
    return (
      <div className="p-6 space-y-4">
        <Link href="/app/admin/pl" className="text-blue-600 hover:underline">← Back to Product Library</Link>
        <div className="card p-6">
          <div className="rounded bg-yellow-100 p-4 text-yellow-800">
            <div className="font-semibold">Database Migration Required</div>
            <div className="text-sm mt-1">{dbError}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!ageBand) {
    return (
      <div className="p-6 space-y-4">
        <Link href="/app/admin/pl" className="text-blue-600 hover:underline">← Back to Product Library</Link>
        <div className="card p-6">
          <p className="text-red-600">Age band not found</p>
        </div>
      </div>
    );
  }

  // Group sets by moment_id for easier lookup
  const setsByMoment: Record<string, any> = {};
  for (const set of sets) {
    setsByMoment[set.moment_id] = set;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/app/admin/pl" className="text-blue-600 hover:underline">← Back to Product Library</Link>
        <h1 className="text-xl font-semibold mt-2" style={{ fontFamily: 'var(--brand-font-head, inherit)' }}>
          {ageBand.label} ({ageBand.min_months}-{ageBand.max_months} months)
        </h1>
      </div>

      {moments.length === 0 ? (
        <div className="card p-6">
          <p className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
            No active moments configured yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {moments.map((moment) => {
            const set = setsByMoment[moment.id];
            return (
              <MomentSetEditor
                key={moment.id}
                ageBandId={ageBandId}
                moment={moment}
                set={set}
                categoryTypes={categoryTypes}
                products={products}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

