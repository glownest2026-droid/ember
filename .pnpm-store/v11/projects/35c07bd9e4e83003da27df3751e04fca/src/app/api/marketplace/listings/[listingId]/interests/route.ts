import { NextRequest } from "next/server";
import { listListingInterestsForSeller } from "@/lib/marketplace/marketplace-conversation-service";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const { listingId } = await params;
  if (!listingId) return json({ error: "Listing id is required." }, { status: 400 });

  const result = await listListingInterestsForSeller(supabase, listingId, user.id);
  if ("error" in result) {
    return json({ error: result.error }, { status: result.status });
  }

  return json({ interests: result }, { status: 200 });
}
