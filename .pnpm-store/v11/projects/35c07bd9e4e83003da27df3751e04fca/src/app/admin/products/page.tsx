export const dynamic = "force-dynamic";
import Link from 'next/link';
import { validateImage } from '../../../lib/imagePolicy';
import { createClient } from '../../../utils/supabase/server';

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-6">Please <Link className="underline" href="/signin">sign in</Link>.</div>;

  const { data: rows, error } = await supabase.from('products').select('*').order('updated_at', { ascending: false }).limit(200);
  if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="px-3 py-2 rounded bg-black text-white">New</Link>
      </div>
      <table className="w-full text-sm border">
        <thead><tr className="bg-gray-50">
          <th className="p-2 text-left">Name</th><th className="p-2">Rating</th><th className="p-2">Age</th>
          <th className="p-2">Image</th><th className="p-2">Compliance</th><th className="p-2">Updated</th><th className="p-2"></th>
        </tr></thead>
        <tbody>
          {(rows ?? []).map((p: any) => {
            const ok = validateImage(p.image_source, p.image_url, { affiliate_program: p.affiliate_program, proof: p.proof_of_rights_url });
            return (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2 text-center">{p.rating?.toFixed?.(1) ?? ''}</td>
                <td className="p-2 text-center">{p.age_band}</td>
                <td className="p-2 max-w-[240px] truncate">{p.image_url || <span className="opacity-50">—</span>}</td>
                <td className="p-2 text-center"><span className={`inline-block rounded px-2 py-0.5 text-xs ${ok ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{ok ? 'OK' : 'Placeholder'}</span></td>
                <td className="p-2 text-center">{p.last_refreshed_at ? new Date(p.last_refreshed_at).toLocaleDateString() : '—'}</td>
                <td className="p-2 text-right"><Link className="underline" href={`/admin/products/${p.id}`}>Edit</Link></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
