import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  extractProviderDetails,
  getEffectiveGeminiFallbackModel,
  getEffectiveGeminiModel,
  sanitizeProviderMessage,
} from "./ai-listing-gemini-config";
import { shouldAttemptGeminiFallback } from "./ai-listing-gemini-fallback";

export type GeminiProviderTestResult = {
  attempted: boolean;
  model: string;
  providerStatus: number | null;
  providerCode: string | null;
  responseReceived: boolean;
  textPreview: string | null;
  parsedOk: boolean;
  safeMessage: string | null;
  projectIdentityNote: string;
};

export type GeminiProviderTestWithFallbackResult = {
  primary: GeminiProviderTestResult;
  fallback: GeminiProviderTestResult | null;
  finalSuccess: boolean;
  finalModelUsed: string | null;
  fallbackUsed: boolean;
};

export async function runGeminiProviderTextTest(args: {
  apiKey: string;
  timeoutMs: number;
  model?: string;
}): Promise<GeminiProviderTestResult> {
  const modelUsed = args.model?.trim() || getEffectiveGeminiModel();
  const projectIdentityNote =
    "Could not verify project identity from API response. Founder must verify manually in Google AI Studio → API Keys.";

  try {
    const client = new GoogleGenerativeAI(args.apiKey);
    const model = client.getGenerativeModel({ model: modelUsed });
    const result = await model.generateContent(
      {
        contents: [{ role: "user", parts: [{ text: 'Return JSON only: {"ok":true}' }] }],
      },
      { timeout: args.timeoutMs }
    );

    const text = result.response.text().trim();
    const textPreview = text.length > 120 ? `${text.slice(0, 120)}…` : text;
    let parsedOk = false;
    try {
      const parsed = JSON.parse(text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "")) as { ok?: unknown };
      parsedOk = parsed?.ok === true;
    } catch {
      parsedOk = false;
    }

    return {
      attempted: true,
      model: modelUsed,
      providerStatus: 200,
      providerCode: null,
      responseReceived: true,
      textPreview,
      parsedOk,
      safeMessage: parsedOk ? null : "Provider responded but JSON did not match {\"ok\":true}.",
      projectIdentityNote,
    };
  } catch (error) {
    const details = extractProviderDetails(error);
    return {
      attempted: true,
      model: modelUsed,
      providerStatus: details.providerStatus,
      providerCode: details.providerCode,
      responseReceived: false,
      textPreview: null,
      parsedOk: false,
      safeMessage: details.providerMessageSafe,
      projectIdentityNote,
    };
  }
}

export async function runGeminiProviderTextTestWithFallback(args: {
  apiKey: string;
  timeoutMs: number;
  primaryModel?: string;
  fallbackModel?: string;
}): Promise<GeminiProviderTestWithFallbackResult> {
  const primaryModel = args.primaryModel?.trim() || getEffectiveGeminiModel();
  const fallbackModel = args.fallbackModel?.trim() || getEffectiveGeminiFallbackModel();

  const primary = await runGeminiProviderTextTest({
    apiKey: args.apiKey,
    timeoutMs: args.timeoutMs,
    model: primaryModel,
  });

  if (primary.parsedOk) {
    return {
      primary,
      fallback: null,
      finalSuccess: true,
      finalModelUsed: primaryModel,
      fallbackUsed: false,
    };
  }

  const shouldFallback =
    primaryModel !== fallbackModel &&
    shouldAttemptGeminiFallback({
      providerStatus: primary.providerStatus,
      providerCode: primary.providerCode,
    });

  if (!shouldFallback) {
    return {
      primary,
      fallback: null,
      finalSuccess: false,
      finalModelUsed: null,
      fallbackUsed: false,
    };
  }

  const fallback = await runGeminiProviderTextTest({
    apiKey: args.apiKey,
    timeoutMs: args.timeoutMs,
    model: fallbackModel,
  });

  return {
    primary,
    fallback,
    finalSuccess: fallback.parsedOk,
    finalModelUsed: fallback.parsedOk ? fallbackModel : null,
    fallbackUsed: true,
  };
}

export function buildProviderTestFailureSummary(result: GeminiProviderTestResult): string {
  if (result.parsedOk) return "Gemini text-only provider test succeeded.";
  if (!result.attempted) return "Gemini provider test was not attempted.";
  return sanitizeProviderMessage(
    result.safeMessage ?? "Gemini text-only provider test failed.",
    180
  );
}

export function buildProviderTestWithFallbackSummary(
  result: GeminiProviderTestWithFallbackResult
): string {
  if (result.finalSuccess) {
    return result.fallbackUsed
      ? `Primary model unavailable; fallback ${result.finalModelUsed} succeeded.`
      : `Gemini text-only provider test succeeded on ${result.finalModelUsed}.`;
  }
  if (result.fallbackUsed) {
    return "Primary and fallback Gemini models failed (503/UNAVAILABLE or invalid response).";
  }
  return buildProviderTestFailureSummary(result.primary);
}
