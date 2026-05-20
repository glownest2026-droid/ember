import "server-only";

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-lite";
const DEFAULT_DAILY_LIMIT = 5;
export const DEFAULT_GEMINI_TIMEOUT_MS = 30000;
const MIN_GEMINI_TIMEOUT_MS = 5000;
const MAX_GEMINI_TIMEOUT_MS = 60000;

export type GeminiTimeoutSource = "default" | "env" | "clamped";

export type ResolvedGeminiTimeout = {
  timeoutMs: number;
  timeoutSource: GeminiTimeoutSource;
};

export type AiListingEnvironment = {
  configured: boolean;
  effectiveModel: string;
  dailyLimit: number;
  provider: "gemini";
  hasApiKey: boolean;
  timeoutMs: number;
  timeoutSource: GeminiTimeoutSource;
};

export type ProviderDetails = {
  providerStatus: number | null;
  providerCode: string | null;
  providerMessageSafe: string;
};

export type ClassifiedGeminiError = {
  errorCode: string;
  message: string;
  retryable: boolean;
  httpStatus: number;
  providerStatus: number | null;
  providerCode: string | null;
};

export function getEffectiveGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? "");
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
}

export function resolveGeminiTimeoutMs(rawEnv?: string | null): ResolvedGeminiTimeout {
  const trimmed = (rawEnv ?? process.env.GEMINI_TIMEOUT_MS ?? "").trim();
  if (!trimmed) {
    return { timeoutMs: DEFAULT_GEMINI_TIMEOUT_MS, timeoutSource: "default" };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return { timeoutMs: DEFAULT_GEMINI_TIMEOUT_MS, timeoutSource: "default" };
  }

  const floored = Math.floor(parsed);
  if (floored < MIN_GEMINI_TIMEOUT_MS) {
    return { timeoutMs: DEFAULT_GEMINI_TIMEOUT_MS, timeoutSource: "clamped" };
  }
  if (floored > MAX_GEMINI_TIMEOUT_MS) {
    return { timeoutMs: MAX_GEMINI_TIMEOUT_MS, timeoutSource: "clamped" };
  }

  return { timeoutMs: floored, timeoutSource: "env" };
}

export function getAiListingEnvironment(): AiListingEnvironment {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY?.trim());
  const { timeoutMs, timeoutSource } = resolveGeminiTimeoutMs();
  return {
    configured: hasApiKey,
    effectiveModel: getEffectiveGeminiModel(),
    dailyLimit: parsePositiveInt(process.env.AI_LISTING_DAILY_LIMIT, DEFAULT_DAILY_LIMIT),
    provider: "gemini",
    hasApiKey,
    timeoutMs,
    timeoutSource,
  };
}

export function sanitizeProviderMessage(message: string, maxLength = 240): string {
  const trimmed = message.replace(/\s+/g, " ").trim();
  if (!trimmed) return "Provider request failed.";
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength)}…` : trimmed;
}

export function extractProviderDetails(error: unknown): ProviderDetails {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Provider request failed.";
  const statusMatch = message.match(/\b([45]\d{2})\b/);
  const providerStatus = statusMatch ? Number(statusMatch[1]) : null;
  const upper = message.toUpperCase();
  const codeMatch = upper.match(
    /\b(RESOURCE_EXHAUSTED|UNAVAILABLE|PERMISSION_DENIED|UNAUTHENTICATED|INVALID_ARGUMENT|DEADLINE_EXCEEDED|INTERNAL)\b/
  );

  return {
    providerStatus: Number.isFinite(providerStatus ?? NaN) ? providerStatus : null,
    providerCode: codeMatch ? codeMatch[1] : null,
    providerMessageSafe: sanitizeProviderMessage(message),
  };
}

export function classifyGeminiProviderError(details: ProviderDetails, rawMessage = ""): ClassifiedGeminiError {
  const lower = rawMessage.toLowerCase();
  const status = details.providerStatus;
  const code = details.providerCode;

  if (
    lower.includes("api key") ||
    lower.includes("permission denied") ||
    lower.includes("unauthorized") ||
    code === "PERMISSION_DENIED" ||
    code === "UNAUTHENTICATED"
  ) {
    return {
      errorCode: "gemini_auth_failed",
      message: "Gemini credentials are invalid or not authorized for this project.",
      retryable: false,
      httpStatus: 500,
      providerStatus: status,
      providerCode: code,
    };
  }

  if (lower.includes("model") && (lower.includes("not found") || lower.includes("unsupported"))) {
    return {
      errorCode: "gemini_model_unavailable",
      message: "Configured Gemini model is unavailable for this project.",
      retryable: false,
      httpStatus: 500,
      providerStatus: status,
      providerCode: code,
    };
  }

  if (status === 429 || code === "RESOURCE_EXHAUSTED") {
    return {
      errorCode: "gemini_quota_limited",
      message: "Gemini is rate-limiting this test project. Please wait and try again.",
      retryable: true,
      httpStatus: 429,
      providerStatus: status,
      providerCode: code,
    };
  }

  if (status === 503 || code === "UNAVAILABLE" || lower.includes("service unavailable")) {
    return {
      errorCode: "gemini_temporarily_unavailable",
      message: "Gemini is temporarily unavailable. Please try again in a minute.",
      retryable: true,
      httpStatus: 503,
      providerStatus: status,
      providerCode: code,
    };
  }

  if (status === 500 || code === "INTERNAL") {
    return {
      errorCode: "gemini_provider_error",
      message: "Gemini had a temporary error. Please try again in a minute.",
      retryable: true,
      httpStatus: 500,
      providerStatus: status,
      providerCode: code,
    };
  }

  if (code === "DEADLINE_EXCEEDED" || lower.includes("aborted") || lower.includes("timeout")) {
    return {
      errorCode: "gemini_timeout",
      message: "Gemini took too long to respond. Please try again.",
      retryable: true,
      httpStatus: 504,
      providerStatus: status,
      providerCode: code,
    };
  }

  return {
    errorCode: "gemini_temporarily_unavailable",
    message: "Gemini is temporarily unavailable. Please try again in a minute.",
    retryable: true,
    httpStatus: 503,
    providerStatus: status,
    providerCode: code,
  };
}

export function isPreviewOrDevelopment(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const vercelEnv = process.env.VERCEL_ENV?.trim().toLowerCase();
  return vercelEnv === "preview" || vercelEnv === "development";
}
