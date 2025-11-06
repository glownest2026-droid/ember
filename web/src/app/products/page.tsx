export const dynamic = "force-dynamic";
import Image from 'next/image';
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
          const src = ok ? p.image_url : '/placeholder.png';
          return (
            <div key={p.id} className="rounded-2xl shadow p-4">
              <div className="relative w-full aspect-square">
                <Image src={src} alt={p.name} fill sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <h3 className="mt-3 font-semibold">{p.name}</h3>
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
