import { NextRequest } from "next/server";
import {
  getMarketplacePreferencesForUser,
  saveMarketplacePreferencesForUser,
} from "@/lib/marketplace/marketplace-preferences-service";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const preferences = await getMarketplacePreferencesForUser(supabase, user.id);
  return json({ preferences }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Please sign in to continue." }, { status: 401 });
  }

  let body: {
    postcode?: string;
    lat?: number;
    lng?: number;
    radius_miles?: number;
  } = {};

  try {
    const raw = await request.text();
    if (raw) body = JSON.parse(raw) as typeof body;
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = await saveMarketplacePreferencesForUser(supabase, user.id, {
    postcode: body.postcode,
    lat: body.lat,
    lng: body.lng,
    radius_miles: body.radius_miles,
  });

  if ("error" in result) {
    return json({ error: result.error }, { status: 400 });
  }

  return json({ preferences: result.preferences }, { status: 200 });
}
