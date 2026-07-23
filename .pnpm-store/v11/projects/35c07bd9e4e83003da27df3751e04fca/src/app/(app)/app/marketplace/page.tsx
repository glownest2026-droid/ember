import { Suspense } from "react";
import { MarketplacePageClient } from "@/components/marketplace/MarketplacePageClient";

export default function AppMarketplacePage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#5C646D]">Loading marketplace…</div>}>
      <MarketplacePageClient />
    </Suspense>
  );
}
