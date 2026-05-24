const MAX_MESSAGE_LENGTH = 2000;

const CONTACT_PATTERN =
  /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b0\d{10,11}\b|\b\d{5}\s?\d{6}\b/i;

export function normalizeMessageBody(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_MESSAGE_LENGTH) return null;
  return trimmed;
}

export function privacyWarningForMessage(body: string): string | null {
  if (CONTACT_PATTERN.test(body)) {
    return "For privacy, avoid sharing personal contact details until you're ready.";
  }
  return null;
}

export const MARKETPLACE_MESSAGE_MAX_LENGTH = MAX_MESSAGE_LENGTH;
