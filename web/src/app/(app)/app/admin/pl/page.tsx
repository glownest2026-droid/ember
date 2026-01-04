export const dynamic = "force-dynamic";
import { redirect } from 'next/navigation';
import { createClient } from '../../../../../utils/supabase/server';
import { isAdmin } from '../../../../../lib/admin';

export default async function ProductLibraryAdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/signin?next=/app/admin/pl');
  }

  const admin = await isAdmin();
  if (!admin) {
    // Show clear "Not authorized" screen instead of silent redirect
    return (
      <div className="container-wrap py-8">
        <div className="card p-6 space-y-4 max-w-md">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>Not authorized</h1>
          <p className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
            You don't have permission to access this page. Product Library settings are only available to administrators.
          </p>
          <p className="text-xs" style={{ color: 'var(--brand-muted, #6b7280)' }}>
            Signed in as: {user.email}
          </p>
        </div>
      </div>
    );
  }

  // Query pl_age_bands and pl_moments
  // Handle case where tables don't exist yet (graceful degradation)
  let ageBands: any[] = [];
  let moments: any[] = [];
  let dbError: string | null = null;

  try {
    const { data: ageBandsData, error: ageBandsError } = await supabase
      .from('pl_age_bands')
      .select('*')
      .order('min_months', { ascending: true });

    if (ageBandsError) {
      // Check if error is due to table not existing (relation does not exist)
      if (ageBandsError.code === '42P01' || ageBandsError.message.includes('does not exist')) {
        dbError = 'Database not migrated yet. Please run the PL-0 migration SQL file.';
      } else {
        dbError = `Error loading age bands: ${ageBandsError.message}`;
      }
    } else {
      ageBands = ageBandsData || [];
    }

    const { data: momentsData, error: momentsError } = await supabase
      .from('pl_moments')
      .select('*')
      .order('label', { ascending: true });

    if (momentsError && !dbError) {
      // Only set error if we haven't already set one
      if (momentsError.code === '42P01' || momentsError.message.includes('does not exist')) {
        dbError = 'Database not migrated yet. Please run the PL-0 migration SQL file.';
      } else {
        dbError = `Error loading moments: ${momentsError.message}`;
      }
    } else if (!momentsError) {
      moments = momentsData || [];
    }
  } catch (err: any) {
    dbError = `Unexpected error: ${err.message || 'Unknown error'}`;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ fontFamily: 'var(--brand-font-head, inherit)' }}>
          Product Library (PL-0)
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--brand-muted, #6b7280)' }}>
          Ground truth & guardrails — coming next
        </p>
      </div>

      {dbError ? (
        <div className="card p-6 space-y-4">
          <div className="rounded bg-yellow-100 p-4 text-yellow-800">
            <div className="font-semibold">Database Migration Required</div>
            <div className="text-sm mt-1">{dbError}</div>
            <div className="text-xs mt-2">
              Migration file: <code className="bg-yellow-200 px-1 rounded">supabase/sql/202601041654_pl0_product_library.sql</code>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Age Bands Section */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Age Bands</h2>
            {ageBands.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                No age bands configured yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Label</th>
                      <th className="text-left p-2">Min Months</th>
                      <th className="text-left p-2">Max Months</th>
                      <th className="text-left p-2">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ageBands.map((band) => (
                      <tr key={band.id} className="border-b">
                        <td className="p-2 font-mono text-xs">{band.id}</td>
                        <td className="p-2">{band.label}</td>
                        <td className="p-2">{band.min_months}</td>
                        <td className="p-2">{band.max_months}</td>
                        <td className="p-2">{band.is_active ? '✓' : '✗'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Moments Section */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Moments</h2>
            {moments.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                No moments configured yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Label</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moments.map((moment) => (
                      <tr key={moment.id} className="border-b">
                        <td className="p-2 font-mono text-xs">{moment.id}</td>
                        <td className="p-2">{moment.label}</td>
                        <td className="p-2" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                          {moment.description || '—'}
                        </td>
                        <td className="p-2">{moment.is_active ? '✓' : '✗'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

