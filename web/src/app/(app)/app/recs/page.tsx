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
  // Age band is required; other gating applied in-memory below
  // Fetch a larger set to allow for in-memory filtering (we'll apply gating rules below)
  let productsQuery = supabase
    .from('products')
    .select('*')
    .eq('age_band', selectedChildAgeBand)
    .eq('is_archived', false)
    .limit(200);

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
      .limit(200);
    
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

  // Apply Manus-ready gating rules:
  // 1. Quality gate: (quality_score >= 8) OR (amazon_rating >= 4)
  // 2. Confidence gate: 
  //    - If confidence_score is present: require confidence_score >= 5
  //    - If confidence_score is NULL: require amazon_rating >= 4.2 AND amazon_review_count >= 50 (fallback)
  const filteredProducts = (products || []).filter((p: any) => {
    // Quality gate: pass if quality_score >= 8 OR amazon_rating >= 4
    const passesQualityGate = 
      (p.quality_score != null && p.quality_score >= 8) ||
      (p.amazon_rating != null && p.amazon_rating >= 4);
    
    if (!passesQualityGate) return false;
    
    // Confidence gate
    if (p.confidence_score != null) {
      // If confidence_score exists, require >= 5
      return p.confidence_score >= 5;
    } else {
      // If confidence_score is NULL, use fallback: amazon_rating >= 4.2 AND review_count >= 50
      return (
        p.amazon_rating != null && 
        p.amazon_rating >= 4.2 && 
        p.amazon_review_count != null && 
        p.amazon_review_count >= 50
      );
    }
  });

  // Sort: quality_score desc nulls last, amazon_rating desc nulls last, confidence_score desc nulls last
  filteredProducts.sort((a: any, b: any) => {
    // Primary: quality_score (desc, nulls last)
    if (a.quality_score != null && b.quality_score != null) {
      if (b.quality_score !== a.quality_score) {
        return b.quality_score - a.quality_score;
      }
    } else if (a.quality_score != null) return -1;
    else if (b.quality_score != null) return 1;
    
    // Secondary: amazon_rating (desc, nulls last)
    if (a.amazon_rating != null && b.amazon_rating != null) {
      if (b.amazon_rating !== a.amazon_rating) {
        return b.amazon_rating - a.amazon_rating;
      }
    } else if (a.amazon_rating != null) return -1;
    else if (b.amazon_rating != null) return 1;
    
    // Tertiary: confidence_score (desc, nulls last)
    if (a.confidence_score != null && b.confidence_score != null) {
      return b.confidence_score - a.confidence_score;
    } else if (a.confidence_score != null) return -1;
    else if (b.confidence_score != null) return 1;
    
    return 0;
  });

  // Limit to top 50 after sorting
  const topProducts = filteredProducts.slice(0, 50);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Recommendations</h1>
      <ChildSelector children={children} selectedChildId={selectedChildId} />
      
      {topProducts.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No high-confidence picks yet for this stage — we're still building the pool.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {topProducts.map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product}
              selectedChildId={selectedChildId}
              selectedChildAgeBand={selectedChildAgeBand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

