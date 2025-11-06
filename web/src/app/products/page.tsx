export const dynamic = "force-dynamic";
export const revalidate = 0;
import Filters from './_components/Filters';
import Grid from './_components/Grid';
import { createClient } from '../../utils/supabase/server';

export default async function ProductsPage() {
  const supabase = createClient();
  const { data: allData, error } = await supabase
    .from('products').select('*')
    .order('updated_at', { ascending: false }).limit(200);

  if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;

  const all = allData ?? [];
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Products</h1>
      <Filters />
      <Grid initialRows={all} />
    </div>
  );
}
