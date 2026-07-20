import "server-only";

type OneSignalSendResult =
  | { ok: true; notificationId: string }
  | { ok: false; reason: string };

/** Server-side OneSignal push by Ember user id (external_id). Best-effort. */
export async function sendOneSignalPushToUser(args: {
  userId: string;
  title: string;
  body: string;
  url?: string | null;
}): Promise<OneSignalSendResult> {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID?.trim();
  const apiKey = process.env.ONESIGNAL_REST_API_KEY?.trim();
  if (!appId || !apiKey) {
    return { ok: false, reason: "onesignal_not_configured" };
  }

  const payload: Record<string, unknown> = {
    app_id: appId,
    target_channel: "push",
    include_aliases: { external_id: [args.userId] },
    headings: { en: args.title },
    contents: { en: args.body },
  };
  if (args.url?.trim()) {
    payload.url = args.url.trim();
  }

  try {
    const res = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { id?: string; errors?: string[] };
    if (!res.ok) {
      const err = json.errors?.join("; ") ?? `HTTP ${res.status}`;
      return { ok: false, reason: err };
    }
    if (!json.id) {
      return { ok: false, reason: "missing_notification_id" };
    }
    return { ok: true, notificationId: json.id };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "onesignal_request_failed",
    };
  }
}
