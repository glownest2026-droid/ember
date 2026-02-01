import NewLandingPageClient from './NewLandingPageClient';
import {
  getGatewayAgeBands,
  getGatewayCategoryTypes,
  getGatewayProducts,
  getGatewayWrapperDetail,
  getGatewayWrappers,
} from '../../../lib/pl/gatewayPublic';
import { formatMonthToBandDebugBadge, resolveAgeBandForMonth } from '../../../lib/pl/ageBandResolution';

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

  const showDebugBadge =
    (process.env.VERCEL_ENV ? process.env.VERCEL_ENV !== 'production' : process.env.NODE_ENV !== 'production');

  const ageBandsRes = await getGatewayAgeBands();
  const resolution = resolveAgeBandForMonth(clampedMonths, ageBandsRes.data);
  const ageBandId = ageBandsRes.error ? null : resolution.ageBandId;
  const debugBadgeText = showDebugBadge
    ? formatMonthToBandDebugBadge({
        selectedMonth: clampedMonths,
        ageBandsLoaded: ageBandsRes.data.length,
        resolution,
        ageBandsError: ageBandsRes.error,
      })
    : null;

  if (!ageBandId) {
    return (
      <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
        <NewLandingPageClient
          ageBandId={null}
          wrappers={[]}
          selectedWrapperId={null}
          wrapperDetail={null}
          products={[]}
          currentMonths={clampedMonths}
          minMonths={24}
          maxMonths={30}
          showDebugBadge={showDebugBadge}
          debugBadgeText={debugBadgeText}
          catalogueErrorMessage={ageBandsRes.error ? "We’re having trouble loading the catalogue." : null}
        />
      </main>
    );
  }

  const wrappersRes = await getGatewayWrappers(ageBandId);
  if (wrappersRes.error) {
    return (
      <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
        <NewLandingPageClient
          ageBandId={ageBandId}
          wrappers={[]}
          selectedWrapperId={null}
          wrapperDetail={null}
          products={[]}
          currentMonths={clampedMonths}
          minMonths={24}
          maxMonths={30}
          showDebugBadge={showDebugBadge}
          debugBadgeText={showDebugBadge ? `wrappers fetch failed: ${wrappersRes.error}` : null}
          catalogueErrorMessage={"We’re having trouble loading the catalogue."}
        />
      </main>
    );
  }

  const wrappers = wrappersRes.data;
  const wrapperExists = (id: string) => wrappers.some((w) => w.ux_wrapper_id === id);
  const selectedWrapperId =
    wrapperParam && wrapperExists(wrapperParam)
      ? wrapperParam
      : wrappers.length > 0
      ? wrappers[0].ux_wrapper_id
      : null;

  let wrapperDetail = null;
  let products: any[] = [];

  if (selectedWrapperId) {
    const detailRes = await getGatewayWrapperDetail(ageBandId, selectedWrapperId);
    if (detailRes.error) {
      return (
        <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
          <NewLandingPageClient
            ageBandId={ageBandId}
            wrappers={wrappers}
            selectedWrapperId={selectedWrapperId}
            wrapperDetail={null}
            products={[]}
            currentMonths={clampedMonths}
            minMonths={24}
            maxMonths={30}
            showDebugBadge={showDebugBadge}
            debugBadgeText={showDebugBadge ? `wrapper detail fetch failed: ${detailRes.error}` : null}
            catalogueErrorMessage={"We’re having trouble loading the catalogue."}
          />
        </main>
      );
    }

    wrapperDetail = detailRes.data;

    if (wrapperDetail) {
      const catsRes = await getGatewayCategoryTypes(ageBandId, wrapperDetail.development_need_id);
      if (catsRes.error) {
        return (
          <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
            <NewLandingPageClient
              ageBandId={ageBandId}
              wrappers={wrappers}
              selectedWrapperId={selectedWrapperId}
              wrapperDetail={wrapperDetail}
              products={[]}
              currentMonths={clampedMonths}
              minMonths={24}
              maxMonths={30}
              showDebugBadge={showDebugBadge}
              debugBadgeText={showDebugBadge ? `category types fetch failed: ${catsRes.error}` : null}
              catalogueErrorMessage={"We’re having trouble loading the catalogue."}
            />
          </main>
        );
      }

      const categoryTypeIds = catsRes.data.slice(0, 3).map((c) => c.id);
      const prodRes = await getGatewayProducts(ageBandId, categoryTypeIds);
      if (prodRes.error) {
        return (
          <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
            <NewLandingPageClient
              ageBandId={ageBandId}
              wrappers={wrappers}
              selectedWrapperId={selectedWrapperId}
              wrapperDetail={wrapperDetail}
              products={[]}
              currentMonths={clampedMonths}
              minMonths={24}
              maxMonths={30}
              showDebugBadge={showDebugBadge}
              debugBadgeText={showDebugBadge ? `products fetch failed: ${prodRes.error}` : null}
              catalogueErrorMessage={"We’re having trouble loading the catalogue."}
            />
          </main>
        );
      }

      products = prodRes.data
        .slice()
        .sort((a, b) => (a.rank - b.rank) || a.id.localeCompare(b.id))
        .slice(0, 3);
    }
  }

  return (
    <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
      <NewLandingPageClient
        ageBandId={ageBandId}
        wrappers={wrappers}
        selectedWrapperId={selectedWrapperId}
        wrapperDetail={wrapperDetail}
        products={products}
        currentMonths={clampedMonths}
        minMonths={24}
        maxMonths={30}
        showDebugBadge={showDebugBadge}
        debugBadgeText={debugBadgeText}
        catalogueErrorMessage={null}
      />
    </main>
  );
}

