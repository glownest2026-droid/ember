"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect /app/listings to canonical route /marketplace/listings.
 */
export default function AppListingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/marketplace/listings");
  }, [router]);
  return (
    <div className="p-6 text-[#5C646D]">
      Redirecting to your listings…
    </div>
  );
}
