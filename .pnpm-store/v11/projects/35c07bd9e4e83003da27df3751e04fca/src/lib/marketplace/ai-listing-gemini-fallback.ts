import "server-only";

import {
  classifyGeminiProviderError,
  extractProviderDetails,
  getEffectiveGeminiFallbackModel,
  getEffectiveGeminiModel,
  type ProviderDetails,
} from "./ai-listing-gemini-config";

export const GEMINI_UNAVAILABLE_USER_MESSAGE =
  "Gemini is temporarily unavailable. Please try again in a minute.";
export const GEMINI_UNAVAILABLE_USER_HELPER =
  "This is usually temporary and not caused by your photo.";

export type GeminiModelAttemptMeta = {
  primaryModel: string;
  fallbackModel: string;
  modelUsed: string;
  fallbackUsed: boolean;
  primaryProviderStatus: number | null;
  primaryProviderCode: string | null;
  primaryErrorCode: string | null;
};

export function shouldAttemptGeminiFallback(args: {
  providerStatus: number | null;
  providerCode: string | null;
  errorCode?: string | null;
}): boolean {
  if (args.errorCode === "gemini_temporarily_unavailable") return true;
  return args.providerStatus === 503 || args.providerCode === "UNAVAILABLE";
}

function readProviderFields(error: unknown): ProviderDetails & { rawMessage: string } {
  const rawMessage = error instanceof Error ? error.message : String(error ?? "");
  const status =
    error && typeof error === "object" && "providerStatus" in error
      ? (error as { providerStatus: number | null }).providerStatus
      : null;
  const code =
    error && typeof error === "object" && "providerCode" in error
      ? (error as { providerCode: string | null }).providerCode
      : null;
  const extracted = extractProviderDetails(error);
  return {
    providerStatus: status ?? extracted.providerStatus,
    providerCode: code ?? extracted.providerCode,
    providerMessageSafe: extracted.providerMessageSafe,
    rawMessage,
  };
}

function isFallbackEligibleProviderError(error: unknown): {
  eligible: boolean;
  providerStatus: number | null;
  providerCode: string | null;
  errorCode: string | null;
} {
  const fields = readProviderFields(error);
  const classified = classifyGeminiProviderError(
    {
      providerStatus: fields.providerStatus,
      providerCode: fields.providerCode,
      providerMessageSafe: fields.providerMessageSafe,
    },
    fields.rawMessage
  );
  const eligible = shouldAttemptGeminiFallback({
    providerStatus: fields.providerStatus,
    providerCode: fields.providerCode,
    errorCode: classified.errorCode,
  });
  return {
    eligible,
    providerStatus: fields.providerStatus,
    providerCode: fields.providerCode,
    errorCode: classified.errorCode,
  };
}

export async function runWithGeminiModelFallback<T>(args: {
  primaryModel?: string;
  fallbackModel?: string;
  attempt: (model: string) => Promise<T>;
}): Promise<{ result: T; meta: GeminiModelAttemptMeta }> {
  const primaryModel = args.primaryModel?.trim() || getEffectiveGeminiModel();
  const fallbackModel = args.fallbackModel?.trim() || getEffectiveGeminiFallbackModel();

  const baseMeta: Omit<GeminiModelAttemptMeta, "modelUsed" | "fallbackUsed"> = {
    primaryModel,
    fallbackModel,
    primaryProviderStatus: null,
    primaryProviderCode: null,
    primaryErrorCode: null,
  };

  try {
    const result = await args.attempt(primaryModel);
    return {
      result,
      meta: {
        ...baseMeta,
        modelUsed: primaryModel,
        fallbackUsed: false,
      },
    };
  } catch (primaryError) {
    const eligibility = isFallbackEligibleProviderError(primaryError);
    if (!eligibility.eligible || primaryModel === fallbackModel) {
      throw primaryError;
    }

    try {
      const result = await args.attempt(fallbackModel);
      return {
        result,
        meta: {
          ...baseMeta,
          modelUsed: fallbackModel,
          fallbackUsed: true,
          primaryProviderStatus: eligibility.providerStatus,
          primaryProviderCode: eligibility.providerCode,
          primaryErrorCode: eligibility.errorCode,
        },
      };
    } catch {
      attachAttemptMeta(primaryError, {
        ...baseMeta,
        modelUsed: fallbackModel,
        fallbackUsed: true,
        primaryProviderStatus: eligibility.providerStatus,
        primaryProviderCode: eligibility.providerCode,
        primaryErrorCode: eligibility.errorCode,
      });
      throw primaryError;
    }
  }
}

function attachAttemptMeta(error: unknown, meta: GeminiModelAttemptMeta): void {
  if (!error || typeof error !== "object") return;
  (error as { geminiAttempt?: GeminiModelAttemptMeta | null }).geminiAttempt = meta;
}

export function readGeminiAttemptMeta(error: unknown): GeminiModelAttemptMeta | null {
  if (!error || typeof error !== "object") return null;
  const meta = (error as { geminiAttempt?: GeminiModelAttemptMeta }).geminiAttempt;
  return meta ?? null;
}

export function geminiAttemptMetaForVisionFeatures(meta: GeminiModelAttemptMeta) {
  return {
    primary_model: meta.primaryModel,
    fallback_model: meta.fallbackModel,
    model_used: meta.modelUsed,
    fallback_used: meta.fallbackUsed,
    primary_provider_status: meta.primaryProviderStatus,
    primary_provider_code: meta.primaryProviderCode,
    primary_error_code: meta.primaryErrorCode,
  };
}
