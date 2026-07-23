export const dynamic = "force-dynamic";
export const revalidate = 0;

import Filters from './_components/Filters';
import Grid from './_components/Grid';

async function getProducts() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const resp = await fetch(
    `${url}/rest/v1/products?select=*&order=updated_at.desc&limit=200`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: 'no-store',
    }
  );
  if (!resp.ok) {
    throw new Error(`Supabase REST error ${resp.status}`);
  }
  return resp.json();
}

export default async function ProductsPage() {
  const all = await getProducts();
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Products</h1>
      <Filters />
      <Grid initialRows={all ?? []} />
    </div>
  );
}
