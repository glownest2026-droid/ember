export const dynamic = "force-dynamic";
import Link from 'next/link';
import { createClient } from '../../../../utils/supabase/server';
import { calculateAgeBand } from '../../../../lib/ageBand';
import ChildSelector from './_components/ChildSelector';
import ProductCard from './_components/ProductCard';

export default async function RecommendationsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ child?: string }> 
}) {
  const params = await searchParams;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return (
      <div className="p-6">
        <p>Please <Link className="underline" href="/signin">sign in</Link>.</p>
      </div>
    );
  }

  // Fetch children
  const { data: children, error: childrenError } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (childrenError) {
    return (
      <div className="p-6 text-red-600">
        Error: {childrenError.message}
      </div>
    );
  }

  // Empty state: no children
  if (!children || children.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Recommendations</h1>
        <div className="p-6 text-center text-gray-500">
          <p>Add a profile to see personalized recommendations.</p>
          <Link href="/app/children/new" className="mt-2 inline-block px-3 py-2 rounded bg-black text-white">
            Add a profile
          </Link>
        </div>
      </div>
    );
  }

  // Determine selected child
  const selectedChildId = params.child || children[0]?.id;
  const selectedChild = children.find((c: any) => c.id === selectedChildId) || children[0];
  
  // Calculate age band for selected child
  const computedAgeBand = selectedChild.birthdate ? calculateAgeBand(selectedChild.birthdate) : null;
  const selectedChildAgeBand = selectedChild.age_band || computedAgeBand;

  // If no age band, show message
  if (!selectedChildAgeBand) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Recommendations</h1>
        <ChildSelector children={children} selectedChildId={selectedChildId} />
        <div className="p-6 text-center text-gray-500">
          <p>Please add a birthdate to the selected profile to see recommendations.</p>
        </div>
      </div>
    );
  }

  // Query products with filters
  // Try to exclude archived products if field exists
  let productsQuery = supabase
    .from('products')
    .select('*')
    .eq('age_band', selectedChildAgeBand)
    .gte('rating', 4.0)
    .not('rating', 'is', null)
    .eq('is_archived', false)
    .order('rating', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(50);

  let { data: products, error: productsError } = await productsQuery;
  
  // If error suggests missing column, retry without archived filter
  if (productsError && (
    productsError.message?.includes('column') && 
    productsError.message?.includes('does not exist')
  )) {
    productsQuery = supabase
      .from('products')
      .select('*')
      .eq('age_band', selectedChildAgeBand)
      .gte('rating', 4.0)
      .not('rating', 'is', null)
      .order('rating', { ascending: false })
      .order('updated_at', { ascending: false })
      .limit(50);
    
    const retryResult = await productsQuery;
    products = retryResult.data;
    productsError = retryResult.error;
  }

  if (productsError) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Recommendations</h1>
        <ChildSelector children={children} selectedChildId={selectedChildId} />
        <div className="p-6 text-red-600">
          Error loading products: {productsError.message}
        </div>
      </div>
    );
  }

  // Defensive filter: exclude any products with null rating (shouldn't happen but be safe)
  const filteredProducts = (products || []).filter((p: any) => p.rating != null && p.rating >= 4.0);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Recommendations</h1>
      <ChildSelector children={children} selectedChildId={selectedChildId} />
      
      {filteredProducts.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No recommendations found for age band "{selectedChildAgeBand}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

