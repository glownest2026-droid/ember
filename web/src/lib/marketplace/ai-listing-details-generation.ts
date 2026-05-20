import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractJsonText, type GeminiTokenUsage } from "./ai-listing-analysis";
import {
  classifyGeminiProviderError,
  extractProviderDetails,
  getEffectiveGeminiModel,
  resolveGeminiTimeoutMs,
} from "./ai-listing-gemini-config";
import {
  LISTING_ARRAY_MAX_ITEMS,
  LISTING_DESCRIPTION_MAX,
  LISTING_TITLE_MAX,
  type ListingDraftDetailsJson,
} from "./ai-listing-details-types";

export class GeminiDetailsConfigError extends Error {}
export class GeminiDetailsProviderError extends Error {
  providerStatus: number | null;
  providerCode: string | null;

  constructor(message: string, providerStatus: number | null = null, providerCode: string | null = null) {
    super(message);
    this.name = "GeminiDetailsProviderError";
    this.providerStatus = providerStatus;
    this.providerCode = providerCode;
  }
}
export class GeminiDetailsParseError extends Error {}

const FORBIDDEN_PRICE_PATTERN =
  /\b(rrp|£|\$|€|price|priced|costs?|worth|valued at|msrp|retail)\b/i;

function stringList(value: unknown, maxItems = LISTING_ARRAY_MAX_ITEMS): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => String(entry ?? "").trim())
    .filter((entry) => entry.length > 0 && !FORBIDDEN_PRICE_PATTERN.test(entry))
    .slice(0, maxItems);
}

function clampText(value: unknown, maxLength: number, fallback: string): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || FORBIDDEN_PRICE_PATTERN.test(trimmed)) return fallback;
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1)}…` : trimmed;
}

export function normalizeListingDraftDetails(
  value: unknown,
  modelUsed: string
): ListingDraftDetailsJson {
  const source = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return {
    suggested_title: clampText(source.suggested_title, LISTING_TITLE_MAX, "Second-hand item"),
    suggested_description: clampText(
      source.suggested_description,
      LISTING_DESCRIPTION_MAX,
      "Please review and edit this draft description before anything is used."
    ),
    category_label: clampText(source.category_label, 80, "General"),
    condition_suggestion: clampText(
      source.condition_suggestion,
      120,
      "Condition needs parent confirmation"
    ),
    condition_questions: stringList(source.condition_questions),
    included_parts_checklist: stringList(source.included_parts_checklist),
    missing_parts_questions: stringList(source.missing_parts_questions),
    safety_resale_notes: stringList(source.safety_resale_notes),
    photo_improvement_suggestions: stringList(source.photo_improvement_suggestions),
    restricted_or_blocked: Boolean(source.restricted_or_blocked),
    parent_editing_note: clampText(
      source.parent_editing_note,
      200,
      "Please review and edit before publishing."
    ),
    generation_model: modelUsed,
    generated_at: new Date().toISOString(),
  };
}

export function parseListingDraftDetails(rawText: string, modelUsed: string): ListingDraftDetailsJson {
  const jsonText = extractJsonText(rawText);
  if (!jsonText) {
    throw new GeminiDetailsParseError("Gemini did not return JSON.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new GeminiDetailsParseError("Gemini JSON could not be parsed.");
  }
  return normalizeListingDraftDetails(parsed, modelUsed);
}

export async function generateListingDetailsWithGemini(args: {
  apiKey: string | undefined;
  model?: string;
  timeoutMs?: number;
  prompt: string;
}): Promise<{
  details: ListingDraftDetailsJson;
  rawText: string;
  tokenUsage: GeminiTokenUsage;
  modelUsed: string;
}> {
  const apiKey = args.apiKey?.trim();
  if (!apiKey) {
    throw new GeminiDetailsConfigError("Missing GEMINI_API_KEY.");
  }

  const modelUsed = args.model?.trim() || getEffectiveGeminiModel();
  const { timeoutMs } =
    typeof args.timeoutMs === "number"
      ? resolveGeminiTimeoutMs(String(args.timeoutMs))
      : resolveGeminiTimeoutMs();

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: modelUsed,
    generationConfig: { temperature: 0.2 },
  });

  try {
    const result = await model.generateContent(
      {
        contents: [{ role: "user", parts: [{ text: args.prompt }] }],
      },
      { timeout: timeoutMs }
    );

    const response = result.response;
    const rawText = response.text();
    const tokenUsage: GeminiTokenUsage = {
      prompt_tokens:
        typeof response.usageMetadata?.promptTokenCount === "number"
          ? response.usageMetadata.promptTokenCount
          : null,
      completion_tokens:
        typeof response.usageMetadata?.candidatesTokenCount === "number"
          ? response.usageMetadata.candidatesTokenCount
          : null,
      total_tokens:
        typeof response.usageMetadata?.totalTokenCount === "number"
          ? response.usageMetadata.totalTokenCount
          : null,
    };

    const details = parseListingDraftDetails(rawText, modelUsed);
    return { details, rawText, tokenUsage, modelUsed };
  } catch (error) {
    if (error instanceof GeminiDetailsParseError) throw error;
    const details = extractProviderDetails(error);
    throw new GeminiDetailsProviderError(
      error instanceof Error ? error.message : "Gemini request failed.",
      details.providerStatus,
      details.providerCode
    );
  }
}

export function classifyDetailsProviderError(error: unknown): {
  errorCode: string;
  message: string;
  retryable: boolean;
  httpStatus: number;
  providerStatus: number | null;
  providerCode: string | null;
} {
  const message = error instanceof Error ? error.message : "";
  const providerStatus =
    error instanceof GeminiDetailsProviderError ? error.providerStatus : extractProviderDetails(error).providerStatus;
  const providerCode =
    error instanceof GeminiDetailsProviderError ? error.providerCode : extractProviderDetails(error).providerCode;

  const classified = classifyGeminiProviderError(
    {
      providerStatus,
      providerCode,
      providerMessageSafe: extractProviderDetails(error).providerMessageSafe,
    },
    message
  );

  if (classified.errorCode === "gemini_timeout") {
    return {
      ...classified,
      message: "Gemini took too long to respond. Please try again.",
    };
  }

  if (
    classified.errorCode === "gemini_temporarily_unavailable" ||
    classified.errorCode === "gemini_provider_error"
  ) {
    return {
      ...classified,
      message: "Ember couldn’t draft the listing right now. Please try again in a minute.",
    };
  }

  return classified;
}
