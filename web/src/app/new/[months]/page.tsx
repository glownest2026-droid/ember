import { notFound } from 'next/navigation';
import { 
  getGatewayAgeBandForAge, 
  getGatewayWrappersForAgeBand, 
  getGatewayWrapperDetail,
  getGatewayCategoryTypes,
  getGatewayProducts
} from '../../../lib/pl/public';
import NewLandingPageClient from './NewLandingPageClient';

interface NewMonthsPageProps {
  params: Promise<{ months: string }>;
  searchParams: Promise<{ wrapper?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function NewMonthsPage({ params, searchParams }: NewMonthsPageProps) {
  const { months } = await params;
  const { wrapper: wrapperParam } = await searchParams;
  
  // Parse and clamp months to 24-30 (matching the mockup range)
  const monthsNum = parseInt(months, 10);
  const clampedMonths = isNaN(monthsNum) || monthsNum < 24 || monthsNum > 30 
    ? 26 
    : monthsNum;

  // Map months to gateway age band
  const ageBand = await getGatewayAgeBandForAge(clampedMonths);
  
  if (!ageBand) {
    // Age band not found - show empty state
    return (
      <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
        <NewLandingPageClient
          ageBand={null}
          wrappers={[]}
          wrapperDetail={null}
          categories={[]}
          products={[]}
          currentMonths={clampedMonths}
          selectedWrapperId={wrapperParam || null}
          minMonths={24}
          maxMonths={30}
        />
      </main>
    );
  }

  // Fetch gateway wrappers for this age band
  const wrappers = await getGatewayWrappersForAgeBand(ageBand.id);

  // Get selected wrapper (from query param or first available)
  let selectedWrapperId: string | null = wrapperParam || null;
  
  if (!selectedWrapperId && wrappers.length > 0) {
    selectedWrapperId = wrappers[0]?.ux_wrapper_id || null;
  }

  // Fetch wrapper detail, categories, and products for selected wrapper
  let wrapperDetail = null;
  let categories: any[] = [];
  let products: any[] = [];
  
  if (selectedWrapperId) {
    wrapperDetail = await getGatewayWrapperDetail(ageBand.id, selectedWrapperId);
    
    if (wrapperDetail?.development_need_id) {
      // Fetch categories for this wrapper's development need
      categories = await getGatewayCategoryTypes(ageBand.id, wrapperDetail.development_need_id);
      
      // Fetch products for each category (top 3 per category, or top 3 total)
      const allProducts: any[] = [];
      for (const category of categories.slice(0, 3)) { // Limit to top 3 categories
        const categoryProducts = await getGatewayProducts(ageBand.id, category.id);
        allProducts.push(...categoryProducts.slice(0, 1)); // Top 1 product per category
      }
      products = allProducts.slice(0, 3); // Top 3 products total
    }
  }

  return (
    <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
      <NewLandingPageClient
        ageBand={ageBand}
        wrappers={wrappers}
        wrapperDetail={wrapperDetail}
        categories={categories}
        products={products}
        currentMonths={clampedMonths}
        selectedWrapperId={selectedWrapperId}
        minMonths={24}
        maxMonths={30}
      />
    </main>
  );
}

