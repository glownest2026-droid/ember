export const dynamic = "force-dynamic";
import Link from 'next/link';
import { createClient } from '../../../../utils/supabase/server';
import { calculateAgeBand } from '../../../../lib/ageBand';

export default async function ChildrenPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return (
      <div className="p-6">
        <p>Please <Link className="underline" href="/signin">sign in</Link>.</p>
      </div>
    );
  }

  const { data: children, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Child Profiles</h1>
        <Link href="/app/children/new" className="px-3 py-2 rounded bg-black text-white">
          Add Profile
        </Link>
      </div>

      {!children || children.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No child profiles yet.</p>
          <Link href="/app/children/new" className="mt-2 inline-block underline">
            Create your first profile
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {children.map((child: any) => {
            const computedAgeBand = child.birthdate ? calculateAgeBand(child.birthdate) : null;
            const displayAgeBand = child.age_band || computedAgeBand || '—';
            
            return (
              <div key={child.id} className="border rounded p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">
                      {child.birthdate ? (
                        <>Birthdate: {new Date(child.birthdate).toLocaleDateString()}</>
                      ) : (
                        <>Birthdate: —</>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Age band: {displayAgeBand}
                    </div>
                    {child.gender && (
                      <div className="text-sm text-gray-600">
                        Gender: {child.gender}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/app/children/${child.id}`}
                    className="px-3 py-1 text-sm rounded border hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

