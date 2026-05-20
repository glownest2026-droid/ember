import "server-only";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type DraftLookupDiagnostic = {
  draftIdProvided: string;
  tableQueried: "marketplace_listing_drafts";
  validUuid: boolean;
  currentUserIdPresent: boolean;
  foundByIdAndOwner: boolean;
  foundByIdWithoutOwnership: boolean | null;
  draftUserMatchesCurrentUser: boolean | null;
  notFoundReason:
    | "row_missing"
    | "owner_mismatch"
    | "rls_hidden"
    | "invalid_uuid"
    | "lookup_error"
    | null;
  lookupError: string | null;
};

function createMarketplaceServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE?.trim();
  if (!url || !key) return null;
  return createServiceClient(url, key, { auth: { persistSession: false } });
}

export async function resolveDraftLookupDiagnostic(args: {
  supabase: SupabaseClient;
  draftId: string;
  currentUserId: string | null;
  allowServiceRoleProbe: boolean;
}): Promise<DraftLookupDiagnostic> {
  const draftIdProvided = args.draftId.trim();
  const validUuid = UUID_PATTERN.test(draftIdProvided);
  const base: DraftLookupDiagnostic = {
    draftIdProvided,
    tableQueried: "marketplace_listing_drafts",
    validUuid,
    currentUserIdPresent: Boolean(args.currentUserId),
    foundByIdAndOwner: false,
    foundByIdWithoutOwnership: null,
    draftUserMatchesCurrentUser: null,
    notFoundReason: null,
    lookupError: null,
  };

  if (!validUuid) {
    return { ...base, notFoundReason: "invalid_uuid" };
  }
  if (!args.currentUserId) {
    return { ...base, notFoundReason: "row_missing" };
  }

  const { data: ownedDraft, error: ownedError } = await args.supabase
    .from("marketplace_listing_drafts")
    .select("id, user_id")
    .eq("id", draftIdProvided)
    .eq("user_id", args.currentUserId)
    .maybeSingle();

  if (ownedError) {
    return {
      ...base,
      lookupError: ownedError.message,
      notFoundReason: "lookup_error",
    };
  }

  if (ownedDraft?.id) {
    return {
      ...base,
      foundByIdAndOwner: true,
      foundByIdWithoutOwnership: true,
      draftUserMatchesCurrentUser: true,
      notFoundReason: null,
    };
  }

  if (!args.allowServiceRoleProbe) {
    return { ...base, notFoundReason: "row_missing" };
  }

  const service = createMarketplaceServiceClient();
  if (!service) {
    return {
      ...base,
      lookupError: "service_role_unavailable",
      notFoundReason: "row_missing",
    };
  }

  const { data: anyDraft, error: serviceError } = await service
    .from("marketplace_listing_drafts")
    .select("id, user_id")
    .eq("id", draftIdProvided)
    .maybeSingle();

  if (serviceError) {
    return {
      ...base,
      lookupError: serviceError.message,
      notFoundReason: "lookup_error",
    };
  }

  if (!anyDraft?.id) {
    return { ...base, foundByIdWithoutOwnership: false, notFoundReason: "row_missing" };
  }

  const matches = anyDraft.user_id === args.currentUserId;
  return {
    ...base,
    foundByIdWithoutOwnership: true,
    draftUserMatchesCurrentUser: matches,
    notFoundReason: matches ? "rls_hidden" : "owner_mismatch",
  };
}
