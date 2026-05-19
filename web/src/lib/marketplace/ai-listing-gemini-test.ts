import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  extractProviderDetails,
  getEffectiveGeminiModel,
  sanitizeProviderMessage,
} from "./ai-listing-gemini-config";

export type GeminiProviderTestResult = {
  attempted: boolean;
  providerStatus: number | null;
  providerCode: string | null;
  responseReceived: boolean;
  textPreview: string | null;
  parsedOk: boolean;
  safeMessage: string | null;
  projectIdentityNote: string;
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

export function buildProviderTestFailureSummary(result: GeminiProviderTestResult): string {
  if (result.parsedOk) return "Gemini text-only provider test succeeded.";
  if (!result.attempted) return "Gemini provider test was not attempted.";
  return sanitizeProviderMessage(
    result.safeMessage ?? "Gemini text-only provider test failed.",
    180
  );
}
