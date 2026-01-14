export const dynamic = "force-dynamic";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../../../../../utils/supabase/server';
import { isAdmin } from '../../../../../../lib/admin';
import { ensureDraftSetPopulated } from '../_actions';
import MerchandisingOffice from './_components/MerchandisingOffice';

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
  let poolItems: any[] = [];
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
          is_locked,
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

    // Load category types for dropdowns: only those with fits for this age_band_id
    // Query pl_category_type_fits filtered by age_band_id, joined to pl_category_types
    const { data: categoryTypesData } = await supabase
      .from('pl_category_type_fits')
      .select(`
        category_type_id,
        pl_category_types (
          id,
          name,
          label,
          slug
        )
      `)
      .eq('age_band_id', ageBandId);

    if (categoryTypesData) {
      // Transform to match expected format, extracting category type data
      categoryTypes = categoryTypesData
        .map((fit: any) => fit.pl_category_types)
        .filter((ct: any) => ct !== null)
        .map((ct: any) => ({
          id: ct.id,
          name: ct.name || ct.label,
          label: ct.label,
          slug: ct.slug,
        }))
        .sort((a, b) => (a.label || a.name || '').localeCompare(b.label || b.name || ''));
    }

    // Load products for dropdowns: eligible for internal selection (is_ready_for_recs = true)
    // Query v_pl_product_fits_ready_for_recs filtered by age_band_id and is_ready_for_recs
    const { data: productsData } = await supabase
      .from('v_pl_product_fits_ready_for_recs')
      .select('*')
      .eq('age_band_id', ageBandId)
      .eq('is_ready_for_recs', true)
      .order('product_name', { ascending: true });

    if (productsData && productsData.length > 0) {
      // Get product_ids from the view (assuming it has product_id column)
      // If not, we may need to join to products table by name/brand
      const productIds = productsData
        .map((p: any) => p.product_id)
        .filter((id: any) => id !== null && id !== undefined);

      // Fetch confidence_score and quality_score from pl_product_fits
      let productFitsMap: Record<string, any> = {};
      if (productIds.length > 0) {
        const { data: productFitsData } = await supabase
          .from('pl_product_fits')
          .select('product_id, confidence_score_0_to_10, quality_score_0_to_10')
          .eq('age_band_id', ageBandId)
          .in('product_id', productIds);

        if (productFitsData) {
          productFitsData.forEach((fit: any) => {
            productFitsMap[fit.product_id] = {
              confidence_score_0_to_10: fit.confidence_score_0_to_10,
              quality_score_0_to_10: fit.quality_score_0_to_10,
            };
          });
        }
      }

      // Transform to include all needed fields
      products = productsData.map((p: any) => ({
        id: p.product_id, // View should have product_id
        name: p.product_name,
        brand: p.product_brand,
        category_type_slug: p.category_type_slug,
        evidence_count: p.evidence_count,
        evidence_domain_count: p.evidence_domain_count,
        is_ready_for_publish: p.is_ready_for_publish,
        confidence_score_0_to_10: productFitsMap[p.product_id]?.confidence_score_0_to_10,
        quality_score_0_to_10: productFitsMap[p.product_id]?.quality_score_0_to_10,
      }));
    }

    // Load pool items for this age band
    const { data: poolItemsData } = await supabase
      .from('pl_pool_items')
      .select(`
        *,
        pl_category_types (
          id,
          name,
          slug
        )
      `)
      .eq('age_band_id', ageBandId)
      .order('created_at', { ascending: true });

    if (poolItemsData) {
      poolItems = poolItemsData;
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

  // Group pool items by moment_id
  const poolItemsByMoment: Record<string, any[]> = {};
  for (const item of poolItems) {
    if (!poolItemsByMoment[item.moment_id]) {
      poolItemsByMoment[item.moment_id] = [];
    }
    poolItemsByMoment[item.moment_id].push(item);
  }

  // System status info
  const buildCommit = process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';
  const vercelEnv = process.env.VERCEL_ENV || 'development';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] || 'unknown';
  const userId = user?.id || 'not authenticated';
  const isAdminValue = admin;

  // Raw count queries for truth panel (with error handling)
  let setsCount = 0;
  let setsCountError: string | null = null;
  let cardsCount = 0;
  let cardsCountError: string | null = null;
  let categoryFitsCount = 0;
  let categoryFitsError: string | null = null;
  let productFitsCount = 0;
  let productFitsError: string | null = null;

  try {
    // Count pl_age_moment_sets
    const { count: setsCountData, error: setsCountErr } = await supabase
      .from('pl_age_moment_sets')
      .select('*', { count: 'exact', head: true })
      .eq('age_band_id', ageBandId);
    
    if (setsCountErr) {
      setsCountError = setsCountErr.message;
    } else {
      setsCount = setsCountData || 0;
    }

    // Get set IDs for card count
    const { data: setIdsData } = await supabase
      .from('pl_age_moment_sets')
      .select('id')
      .eq('age_band_id', ageBandId);
    
    const setIds = setIdsData?.map(s => s.id) || [];

    // Count pl_reco_cards
    if (setIds.length > 0) {
      const { count: cardsCountData, error: cardsCountErr } = await supabase
        .from('pl_reco_cards')
        .select('*', { count: 'exact', head: true })
        .in('set_id', setIds);
      
      if (cardsCountErr) {
        cardsCountError = cardsCountErr.message;
      } else {
        cardsCount = cardsCountData || 0;
      }
    }

    // Count pl_category_type_fits
    const { count: categoryFitsData, error: categoryFitsErr } = await supabase
      .from('pl_category_type_fits')
      .select('*', { count: 'exact', head: true })
      .eq('age_band_id', ageBandId);
    
    if (categoryFitsErr) {
      categoryFitsError = categoryFitsErr.message;
    } else {
      categoryFitsCount = categoryFitsData || 0;
    }

    // Count pl_product_fits
    const { count: productFitsData, error: productFitsErr } = await supabase
      .from('pl_product_fits')
      .select('*', { count: 'exact', head: true })
      .eq('age_band_id', ageBandId);
    
    if (productFitsErr) {
      productFitsError = productFitsErr.message;
    } else {
      productFitsCount = productFitsData || 0;
    }
  } catch (err: any) {
    // Catch any unexpected errors
    console.error('Error fetching raw counts:', err);
  }

  // Log system status (server-side)
  console.log(`[System Status] ageBand=${ageBandId} commit=${buildCommit} env=${vercelEnv} supabaseRef=${supabaseRef} userId=${userId} isAdmin=${isAdminValue} sets=${setsCount} cards=${cardsCount} categoryFits=${categoryFitsCount} productFits=${productFitsCount}`);

  // Auto-populate draft sets for each moment (non-blocking)
  for (const moment of moments) {
    // Don't await - let it run in background
    ensureDraftSetPopulated(ageBandId, moment.id).catch((err) => {
      // Silently fail - this is best-effort auto-population
      console.error(`Failed to auto-populate draft for moment ${moment.id}:`, err);
    });
  }

  return (
    <div className="p-6 space-y-6">
      {/* System Status / Truth Panel */}
      <div className="bg-gray-100 border rounded p-3 text-xs space-y-2" style={{ fontFamily: 'monospace' }}>
        <div className="font-semibold mb-2">System Status / Truth Panel</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          <div>
            <span className="font-medium">Build commit:</span> {buildCommit.substring(0, 7)}
          </div>
          <div>
            <span className="font-medium">Vercel env:</span> {vercelEnv}
          </div>
          <div>
            <span className="font-medium">Supabase ref:</span> {supabaseRef}
          </div>
          <div>
            <span className="font-medium">User ID:</span> {userId.substring(0, 8)}...
          </div>
          <div>
            <span className="font-medium">isAdmin:</span> {isAdminValue ? 'true' : 'false'}
          </div>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="font-medium mb-1">Raw Counts (age_band_id={ageBandId}):</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <span className="font-medium">pl_age_moment_sets:</span>{' '}
              {setsCountError ? (
                <span className="text-red-600">ERROR: {setsCountError}</span>
              ) : (
                setsCount
              )}
            </div>
            <div>
              <span className="font-medium">pl_reco_cards:</span>{' '}
              {cardsCountError ? (
                <span className="text-red-600">ERROR: {cardsCountError}</span>
              ) : (
                cardsCount
              )}
            </div>
            <div>
              <span className="font-medium">pl_category_type_fits:</span>{' '}
              {categoryFitsError ? (
                <span className="text-red-600">ERROR: {categoryFitsError}</span>
              ) : (
                categoryFitsCount
              )}
            </div>
            <div>
              <span className="font-medium">pl_product_fits:</span>{' '}
              {productFitsError ? (
                <span className="text-red-600">ERROR: {productFitsError}</span>
              ) : (
                productFitsCount
              )}
            </div>
          </div>
        </div>
      </div>

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
              <MerchandisingOffice
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

