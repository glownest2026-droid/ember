export const dynamic = "force-dynamic";
import Link from 'next/link';
import { validateImage } from '../../lib/imagePolicy';
import { createClient } from '../../utils/supabase/server';

export default async function ProductsPage() {
  const supabase = createClient();
  const { data: rows, error } = await supabase
    .from('products').select('*')
    .order('updated_at', { ascending: false }).limit(100);

  if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(rows ?? []).map((p: any) => {
          const ok = validateImage(p.image_source, p.image_url, {
            affiliate_program: p.affiliate_program,
            proof: p.proof_of_rights_url
          });
          const src = ok ? p.image_url : '/placeholder.svg';
          return (
            <div key={p.id} className="rounded-2xl shadow p-4">
              <div className="w-full aspect-square overflow-hidden rounded bg-gray-100">
                <img
                  src={src}
                  alt={p.name}
                  style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  loading="lazy"
                />
              </div>
              {/* Debug banner (clickable URL) */}
              <div className="mt-1 p-1 text-xs bg-yellow-50 text-yellow-800 break-all border border-yellow-200 rounded">
                IMG SRC: {src}
              </div>

              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <p className="text-sm opacity-80">⭐ {p.rating?.toFixed?.(1)} · {p.age_band}</p>
              {p.why_it_matters && <p className="mt-2 text-sm">{p.why_it_matters}</p>}
              {p.affiliate_deeplink && (
                <Link className="mt-3 inline-block underline" href={p.affiliate_deeplink} target="_blank">
                  View at retailer
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
