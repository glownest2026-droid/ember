export const dynamic = "force-dynamic";
import { createClient } from '@/utils/supabase/server';
import ProductForm from '../_components/ProductForm';
export default async function EditProductPage({ params }: { params: { id: string }}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', params.id).single();
  if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;
  return (<div className="p-6 space-y-4"><h1 className="text-xl font-semibold">Edit product</h1><ProductForm initial={data} /></div>);
}
