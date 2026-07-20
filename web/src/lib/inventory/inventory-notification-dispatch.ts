import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { sendOneSignalPushToUser } from "@/lib/onesignal/server";
import { REMINDER_TOPIC_KEYS } from "@/lib/reminders/topicKeys";

type NotificationRow = {
  id: string;
  notification_type: "patch_find" | "pass_on_demand" | "pass_on_encourage";
  recipient_user_id: string;
  title: string;
  body: string;
  deep_link: string | null;
};

function topicKeyForType(
  type: NotificationRow["notification_type"]
): string {
  if (type === "patch_find") return REMINDER_TOPIC_KEYS.PATCH_FINDS;
  return REMINDER_TOPIC_KEYS.MOVE_IT_ON_PROMPTS;
}

async function recipientAllowsPush(
  supabase: SupabaseClient,
  userId: string,
  topicKey: string
): Promise<boolean> {
  const { data: topic } = await supabase
    .from("user_reminder_topic_prefs")
    .select("push_enabled")
    .eq("user_id", userId)
    .eq("topic_key", topicKey)
    .maybeSingle();

  if (topic?.push_enabled === true) return true;

  // Default-on for Patch Finds when parent has not configured topics yet.
  if (topicKey === REMINDER_TOPIC_KEYS.PATCH_FINDS && !topic) {
    const { data: master } = await supabase
      .from("user_notification_prefs")
      .select("development_reminders_enabled")
      .eq("user_id", userId)
      .maybeSingle();
    return master?.development_reminders_enabled === true;
  }

  return false;
}

export async function processQueuedInventoryNotifications(
  supabase: SupabaseClient,
  limit = 40
): Promise<{ sent: number; skipped: number; failed: number }> {
  const { data: rows, error } = await supabase
    .from("inventory_notification_events")
    .select("id, notification_type, recipient_user_id, title, body, deep_link")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error || !rows?.length) {
    return { sent: 0, skipped: 0, failed: 0 };
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows as NotificationRow[]) {
    const topicKey = topicKeyForType(row.notification_type);
    const allowed = await recipientAllowsPush(supabase, row.recipient_user_id, topicKey);

    if (!allowed) {
      await supabase
        .from("inventory_notification_events")
        .update({
          status: "skipped",
          skip_reason: "push_topic_disabled",
        })
        .eq("id", row.id);
      skipped += 1;
      continue;
    }

    const push = await sendOneSignalPushToUser({
      userId: row.recipient_user_id,
      title: row.title,
      body: row.body,
      url: row.deep_link,
    });

    if (!push.ok) {
      const isConfig = push.reason === "onesignal_not_configured";
      await supabase
        .from("inventory_notification_events")
        .update({
          status: isConfig ? "skipped" : "failed",
          skip_reason: push.reason,
        })
        .eq("id", row.id);
      if (isConfig) skipped += 1;
      else failed += 1;
      continue;
    }

    await supabase
      .from("inventory_notification_events")
      .update({
        status: "sent",
        onesignal_notification_id: push.notificationId,
        sent_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    sent += 1;
  }

  return { sent, skipped, failed };
}

export async function fanOutPatchFindsForListing(
  supabase: SupabaseClient,
  listingId: string
): Promise<{ queued: number; dispatch: { sent: number; skipped: number; failed: number } }> {
  const { data: queued, error } = await supabase.rpc("queue_patch_finds_for_listing", {
    p_listing_id: listingId,
  });
  if (error) {
    console.warn("[patch-finds] queue_patch_finds_for_listing failed", error.message);
    return { queued: 0, dispatch: { sent: 0, skipped: 0, failed: 0 } };
  }

  const dispatch = await processQueuedInventoryNotifications(supabase, 40);
  return { queued: Number(queued ?? 0), dispatch };
}

export async function runPassOnPromptScan(
  supabase: SupabaseClient,
  limit = 40
): Promise<{ queued: number; dispatch: { sent: number; skipped: number; failed: number } }> {
  const { data: queued, error } = await supabase.rpc("queue_pass_on_prompts", {
    p_limit: limit,
  });
  if (error) {
    console.warn("[pass-on] queue_pass_on_prompts failed", error.message);
    return { queued: 0, dispatch: { sent: 0, skipped: 0, failed: 0 } };
  }

  const dispatch = await processQueuedInventoryNotifications(supabase, limit);
  return { queued: Number(queued ?? 0), dispatch };
}
