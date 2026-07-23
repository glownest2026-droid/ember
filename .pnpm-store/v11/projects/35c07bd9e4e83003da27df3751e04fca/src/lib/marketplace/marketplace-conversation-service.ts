import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { buyerCanViewBetaListing, type BetaListingRow } from "./beta-listing-visibility";
import { normalizeMessageBody, privacyWarningForMessage } from "./conversation-validation";
import type {
  ConversationDetail,
  ConversationSummary,
  SafeMessage,
} from "./conversation-types";
import { resolveUserMarketplaceLocation } from "./marketplace-preferences-service";

type ConversationRow = {
  id: string;
  listing_id: string;
  seller_user_id: string;
  buyer_user_id: string;
  interest_id: string | null;
  status: string;
  last_message_at: string | null;
  seller_last_read_at: string | null;
  buyer_last_read_at: string | null;
  created_at: string;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  listing_id: string;
  sender_user_id: string;
  recipient_user_id: string;
  body: string;
  message_type: string;
  created_at: string;
  deleted_at: string | null;
};

type ListingRow = {
  id: string;
  user_id: string;
  title: string | null;
  item_label: string | null;
  condition: string | null;
  approximate_area_label: string | null;
  status: string;
};

const SAFETY_GUIDANCE = [
  "Your email is never shown.",
  "Your exact address is not shared.",
  "Arrange handover details only when you're comfortable.",
  "Agree a public or familiar handover spot where possible.",
];

function listingTitle(listing: ListingRow): string {
  return listing.title?.trim() || listing.item_label?.trim() || "Listing";
}

function participantLabel(role: "buyer" | "seller", forViewer: "buyer" | "seller"): string {
  if (forViewer === role) return "You";
  return role === "buyer" ? "Interested parent" : "Seller";
}

async function isBlockedBetween(
  supabase: SupabaseClient,
  userA: string,
  userB: string,
  conversationId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("marketplace_user_blocks")
    .select("blocker_user_id, blocked_user_id")
    .eq("conversation_id", conversationId);

  return (data ?? []).some(
    (row) =>
      (row.blocker_user_id === userA && row.blocked_user_id === userB) ||
      (row.blocker_user_id === userB && row.blocked_user_id === userA)
  );
}

export async function ensureBuyerInterest(
  supabase: SupabaseClient,
  listing: ListingRow,
  buyerUserId: string
): Promise<{ id: string } | { error: string }> {
  const { data: existing } = await supabase
    .from("marketplace_listing_interests")
    .select("id")
    .eq("listing_id", listing.id)
    .eq("buyer_user_id", buyerUserId)
    .eq("status", "interested")
    .maybeSingle();

  if (existing?.id) return { id: existing.id };

  const { data: inserted, error } = await supabase
    .from("marketplace_listing_interests")
    .upsert(
      {
        listing_id: listing.id,
        buyer_user_id: buyerUserId,
        seller_user_id: listing.user_id,
        status: "interested",
      },
      { onConflict: "listing_id,buyer_user_id" }
    )
    .select("id")
    .single();

  if (error || !inserted?.id) {
    return { error: error?.message ?? "Could not record interest." };
  }
  return { id: inserted.id };
}

export async function getOrCreateConversationForListing(
  supabase: SupabaseClient,
  listingId: string,
  buyerUserId: string
): Promise<{ conversation_id: string; created: boolean } | { error: string; status: number }> {
  const { data: listing, error: listingError } = await supabase
    .from("marketplace_listings")
    .select(
      "id, user_id, title, item_label, condition, approximate_area_label, approximate_lat, approximate_lng, radius_miles, postcode, status"
    )
    .eq("id", listingId)
    .maybeSingle();

  if (listingError) return { error: listingError.message, status: 500 };
  if (!listing) return { error: "Listing not found.", status: 404 };
  if (listing.status !== "published_beta") {
    return { error: "This listing is not available.", status: 400 };
  }
  if (listing.user_id === buyerUserId) {
    return { error: "You cannot message yourself on your own listing.", status: 400 };
  }

  const buyerLocation = await resolveUserMarketplaceLocation(supabase, buyerUserId);
  if (!(await buyerCanViewBetaListing(listing as BetaListingRow, buyerUserId, buyerLocation))) {
    return { error: "This listing is not available in your area.", status: 403 };
  }

  const interest = await ensureBuyerInterest(supabase, listing as ListingRow, buyerUserId);
  if ("error" in interest) return { error: interest.error, status: 500 };

  const { data: existing } = await supabase
    .from("marketplace_conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_user_id", buyerUserId)
    .maybeSingle();

  if (existing?.id) {
    return { conversation_id: existing.id, created: false };
  }

  const { data: created, error: createError } = await supabase
    .from("marketplace_conversations")
    .insert({
      listing_id: listingId,
      seller_user_id: listing.user_id,
      buyer_user_id: buyerUserId,
      interest_id: interest.id,
      status: "open",
    })
    .select("id")
    .single();

  if (createError || !created?.id) {
    if (createError?.code === "23505") {
      const { data: race } = await supabase
        .from("marketplace_conversations")
        .select("id")
        .eq("listing_id", listingId)
        .eq("buyer_user_id", buyerUserId)
        .maybeSingle();
      if (race?.id) return { conversation_id: race.id, created: false };
    }
    return { error: createError?.message ?? "Could not start conversation.", status: 500 };
  }

  await supabase.from("marketplace_messages").insert({
    conversation_id: created.id,
    listing_id: listingId,
    sender_user_id: buyerUserId,
    recipient_user_id: listing.user_id,
    body: "Hi — I'm interested in this listing.",
    message_type: "system",
  });

  return { conversation_id: created.id, created: true };
}

function unreadForUser(conversation: ConversationRow, userId: string): number {
  if (!conversation.last_message_at) return 0;
  const readAt =
    userId === conversation.seller_user_id
      ? conversation.seller_last_read_at
      : conversation.buyer_last_read_at;
  if (!readAt) return 1;
  return new Date(conversation.last_message_at) > new Date(readAt) ? 1 : 0;
}

export async function listConversationsForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<ConversationSummary[]> {
  const { data: rows } = await supabase
    .from("marketplace_conversations")
    .select(
      "id, listing_id, seller_user_id, buyer_user_id, status, last_message_at, seller_last_read_at, buyer_last_read_at, created_at"
    )
    .or(`seller_user_id.eq.${userId},buyer_user_id.eq.${userId}`)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  const conversations = (rows ?? []) as ConversationRow[];
  if (conversations.length === 0) return [];

  const listingIds = [...new Set(conversations.map((c) => c.listing_id))];
  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select("id, title, item_label, approximate_area_label")
    .in("id", listingIds);

  const listingMap = new Map((listings ?? []).map((l) => [l.id, l as ListingRow]));

  const summaries: ConversationSummary[] = [];

  for (const conversation of conversations) {
    const listing = listingMap.get(conversation.listing_id);
    const role: "buyer" | "seller" =
      conversation.buyer_user_id === userId ? "buyer" : "seller";
    const otherRole = role === "buyer" ? "seller" : "buyer";

    const { data: lastMessage } = await supabase
      .from("marketplace_messages")
      .select("body, message_type")
      .eq("conversation_id", conversation.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const snippet =
      lastMessage?.message_type === "system"
        ? lastMessage.body
        : lastMessage?.body?.slice(0, 120) ?? null;

    summaries.push({
      id: conversation.id,
      listing_id: conversation.listing_id,
      listing_title: listing ? listingTitle(listing) : "Listing",
      approximate_area_label: listing?.approximate_area_label ?? null,
      role,
      other_participant_label: participantLabel(otherRole, role),
      last_message_snippet: snippet,
      last_message_at: conversation.last_message_at,
      unread_count: unreadForUser(conversation, userId),
      status: conversation.status as ConversationSummary["status"],
    });
  }

  return summaries;
}

async function loadConversationForParticipant(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string
): Promise<
  | { conversation: ConversationRow; listing: ListingRow; role: "buyer" | "seller" }
  | { error: string; status: number }
> {
  const { data: conversation, error } = await supabase
    .from("marketplace_conversations")
    .select(
      "id, listing_id, seller_user_id, buyer_user_id, interest_id, status, last_message_at, seller_last_read_at, buyer_last_read_at, created_at"
    )
    .eq("id", conversationId)
    .maybeSingle();

  if (error) return { error: error.message, status: 500 };
  if (!conversation) return { error: "Conversation not found.", status: 404 };

  const row = conversation as ConversationRow;
  if (row.seller_user_id !== userId && row.buyer_user_id !== userId) {
    return { error: "Not allowed to view this conversation.", status: 403 };
  }

  const { data: listing } = await supabase
    .from("marketplace_listings")
    .select("id, user_id, title, item_label, condition, approximate_area_label, status")
    .eq("id", row.listing_id)
    .maybeSingle();

  if (!listing) return { error: "Listing not found.", status: 404 };

  const role: "buyer" | "seller" = row.buyer_user_id === userId ? "buyer" : "seller";
  return { conversation: row, listing: listing as ListingRow, role };
}

export async function getConversationDetail(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
  markRead: boolean
): Promise<ConversationDetail | { error: string; status: number }> {
  const loaded = await loadConversationForParticipant(supabase, conversationId, userId);
  if ("error" in loaded) return loaded;

  const { conversation, listing, role } = loaded;
  const otherRole = role === "buyer" ? "seller" : "buyer";

  if (markRead && conversation.status === "open") {
    const patch =
      role === "seller"
        ? { seller_last_read_at: new Date().toISOString() }
        : { buyer_last_read_at: new Date().toISOString() };
    await supabase.from("marketplace_conversations").update(patch).eq("id", conversationId);
  }

  const { data: messageRows } = await supabase
    .from("marketplace_messages")
    .select("id, conversation_id, listing_id, sender_user_id, recipient_user_id, body, message_type, created_at, deleted_at")
    .eq("conversation_id", conversationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(200);

  const messages: SafeMessage[] = ((messageRows ?? []) as MessageRow[]).map((m) => ({
    id: m.id,
    body: m.body,
    message_type: m.message_type as "text" | "system",
    is_mine: m.sender_user_id === userId,
    created_at: m.created_at,
  }));

  const blocked = await isBlockedBetween(
    supabase,
    conversation.buyer_user_id,
    conversation.seller_user_id,
    conversationId
  );

  const canSend = conversation.status === "open" && !blocked;

  return {
    id: conversation.id,
    status: conversation.status as ConversationDetail["status"],
    listing: {
      title: listingTitle(listing),
      approximate_area_label: listing.approximate_area_label,
      condition: listing.condition,
    },
    participant: {
      role,
      display_label: participantLabel(role, role),
    },
    other_participant: {
      role: otherRole,
      display_label: participantLabel(otherRole, role),
    },
    messages,
    can_send: canSend,
    safety_guidance: SAFETY_GUIDANCE,
  };
}

export async function sendConversationMessage(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
  rawBody: string
): Promise<{ message: SafeMessage; privacy_warning: string | null } | { error: string; status: number }> {
  const body = normalizeMessageBody(rawBody);
  if (!body) {
    return { error: "Message must be between 1 and 2000 characters.", status: 400 };
  }

  const loaded = await loadConversationForParticipant(supabase, conversationId, userId);
  if ("error" in loaded) return loaded;

  const { conversation } = loaded;

  if (conversation.status !== "open") {
    return { error: "This conversation is closed.", status: 400 };
  }

  const blocked = await isBlockedBetween(
    supabase,
    conversation.buyer_user_id,
    conversation.seller_user_id,
    conversationId
  );
  if (blocked) {
    return { error: "Messaging is blocked for this conversation.", status: 403 };
  }

  const recipientId =
    userId === conversation.buyer_user_id
      ? conversation.seller_user_id
      : conversation.buyer_user_id;

  const { data: inserted, error: insertError } = await supabase
    .from("marketplace_messages")
    .insert({
      conversation_id: conversationId,
      listing_id: conversation.listing_id,
      sender_user_id: userId,
      recipient_user_id: recipientId,
      body,
      message_type: "text",
    })
    .select("id, body, message_type, created_at, sender_user_id")
    .single();

  if (insertError || !inserted) {
    return { error: insertError?.message ?? "Could not send message.", status: 500 };
  }

  const now = new Date().toISOString();
  await supabase
    .from("marketplace_conversations")
    .update({ last_message_at: now })
    .eq("id", conversationId);

  return {
    message: {
      id: inserted.id,
      body: inserted.body,
      message_type: "text",
      is_mine: true,
      created_at: inserted.created_at,
    },
    privacy_warning: privacyWarningForMessage(body),
  };
}

export async function reportConversation(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
  reason?: string | null,
  details?: string | null
): Promise<{ ok: true } | { error: string; status: number }> {
  const loaded = await loadConversationForParticipant(supabase, conversationId, userId);
  if ("error" in loaded) return loaded;

  const { conversation } = loaded;
  const reportedUserId =
    userId === conversation.buyer_user_id
      ? conversation.seller_user_id
      : conversation.buyer_user_id;

  const { error: reportError } = await supabase.from("marketplace_conversation_reports").insert({
    conversation_id: conversationId,
    listing_id: conversation.listing_id,
    reporter_user_id: userId,
    reported_user_id: reportedUserId,
    reason: reason?.trim() || null,
    details: details?.trim() || null,
    status: "open",
  });

  if (reportError) return { error: reportError.message, status: 500 };

  await supabase
    .from("marketplace_conversations")
    .update({ status: "reported" })
    .eq("id", conversationId);

  return { ok: true };
}

export async function blockConversation(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
  reason?: string | null
): Promise<{ ok: true } | { error: string; status: number }> {
  const loaded = await loadConversationForParticipant(supabase, conversationId, userId);
  if ("error" in loaded) return loaded;

  const { conversation } = loaded;
  const blockedUserId =
    userId === conversation.buyer_user_id
      ? conversation.seller_user_id
      : conversation.buyer_user_id;

  const { error: blockError } = await supabase.from("marketplace_user_blocks").upsert(
    {
      blocker_user_id: userId,
      blocked_user_id: blockedUserId,
      conversation_id: conversationId,
      listing_id: conversation.listing_id,
      reason: reason?.trim() || null,
    },
    { onConflict: "blocker_user_id,blocked_user_id,conversation_id" }
  );

  if (blockError) return { error: blockError.message, status: 500 };

  await supabase
    .from("marketplace_conversations")
    .update({ status: "blocked" })
    .eq("id", conversationId);

  return { ok: true };
}

export async function listListingInterestsForSeller(
  supabase: SupabaseClient,
  listingId: string,
  sellerUserId: string
): Promise<
  | Array<{ interest_id: string; conversation_id: string | null; buyer_label: string }>
  | { error: string; status: number }
> {
  const { data: listing } = await supabase
    .from("marketplace_listings")
    .select("id, user_id")
    .eq("id", listingId)
    .eq("user_id", sellerUserId)
    .maybeSingle();

  if (!listing) return { error: "Listing not found.", status: 404 };

  const { data: interests } = await supabase
    .from("marketplace_listing_interests")
    .select("id, buyer_user_id")
    .eq("listing_id", listingId)
    .eq("seller_user_id", sellerUserId)
    .eq("status", "interested");

  const rows = interests ?? [];
  const result: Array<{ interest_id: string; conversation_id: string | null; buyer_label: string }> = [];

  for (const interest of rows) {
    const { data: conversation } = await supabase
      .from("marketplace_conversations")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_user_id", interest.buyer_user_id)
      .maybeSingle();

    result.push({
      interest_id: interest.id,
      conversation_id: conversation?.id ?? null,
      buyer_label: "Interested parent",
    });
  }

  return result;
}
