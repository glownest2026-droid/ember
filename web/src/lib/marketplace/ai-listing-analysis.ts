import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildMarketplaceImageAnalysisPrompt } from "./ai-listing-prompt";

export const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";
const DEFAULT_GEMINI_REQUEST_TIMEOUT_MS = 8000;

type ConfidenceBucket = "high" | "medium" | "low";

export type GeminiListingCandidate = {
  label: string;
  slug_hint: string;
  confidence: number;
  why: string;
};

export type GeminiListingAnalysisOutput = {
  detected_item_label: string;
  possible_brand: string;
  visible_text: string[];
  broad_category: string;
  likely_age_range_months: {
    min: number | null;
    max: number | null;
    confidence: ConfidenceBucket;
  };
  product_type_candidates: GeminiListingCandidate[];
  condition_observations: string[];
  missing_parts_questions: string[];
  safety_warnings: string[];
  confidence_bucket: ConfidenceBucket;
};

export type GeminiTokenUsage = {
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
};

export class GeminiConfigError extends Error {}
export class GeminiProviderError extends Error {}
export class GeminiParseError extends Error {}

function clampConfidence(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(1, parsed));
}

function normalizeBucket(value: unknown): ConfidenceBucket {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "high" || normalized === "medium" || normalized === "low") {
    return normalized;
  }
  return "low";
}

function stringList(value: unknown, maxItems = 8): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => String(entry ?? "").trim())
    .filter((entry) => entry.length > 0)
    .slice(0, maxItems);
}

function extractJsonText(rawText: string): string {
  const trimmed = rawText.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fenced = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  if (fenced.startsWith("{") && fenced.endsWith("}")) {
    return fenced;
  }

  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return fenced.slice(start, end + 1);
  }
  return fenced;
}

function normalizeAgeRange(value: unknown): GeminiListingAnalysisOutput["likely_age_range_months"] {
  const source = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const min = Number(source.min);
  const max = Number(source.max);
  return {
    min: Number.isFinite(min) ? Math.max(0, Math.floor(min)) : null,
    max: Number.isFinite(max) ? Math.max(0, Math.floor(max)) : null,
    confidence: normalizeBucket(source.confidence),
  };
}

function normalizeCandidates(value: unknown, fallbackLabel: string): GeminiListingCandidate[] {
  if (!Array.isArray(value)) {
    return [
      {
        label: fallbackLabel,
        slug_hint: "",
        confidence: 0.2,
        why: "The photo suggests this item type, but confidence is low.",
      },
    ];
  }

  const normalized = value
    .map((entry) => (entry && typeof entry === "object" ? (entry as Record<string, unknown>) : null))
    .filter((entry): entry is Record<string, unknown> => Boolean(entry))
    .map((entry) => ({
      label: String(entry.label ?? "").trim(),
      slug_hint: String(entry.slug_hint ?? "").trim(),
      confidence: clampConfidence(entry.confidence),
      why: String(entry.why ?? "").trim(),
    }))
    .filter((entry) => entry.label.length > 0)
    .slice(0, 4);

  if (normalized.length > 0) return normalized;

  return [
    {
      label: fallbackLabel,
      slug_hint: "",
      confidence: 0.2,
      why: "The photo suggests this item type, but confidence is low.",
    },
  ];
}

function normalizeAnalysisOutput(value: unknown): GeminiListingAnalysisOutput {
  const source = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const detectedLabel = String(source.detected_item_label ?? "").trim() || "unknown item";

  return {
    detected_item_label: detectedLabel,
    possible_brand: String(source.possible_brand ?? "").trim() || "unknown",
    visible_text: stringList(source.visible_text),
    broad_category: String(source.broad_category ?? "").trim() || "unknown",
    likely_age_range_months: normalizeAgeRange(source.likely_age_range_months),
    product_type_candidates: normalizeCandidates(source.product_type_candidates, detectedLabel),
    condition_observations: stringList(source.condition_observations),
    missing_parts_questions: stringList(source.missing_parts_questions),
    safety_warnings: stringList(source.safety_warnings),
    confidence_bucket: normalizeBucket(source.confidence_bucket),
  };
}

function parseGeminiAnalysisOutput(rawText: string): GeminiListingAnalysisOutput {
  const jsonText = extractJsonText(rawText);
  if (!jsonText) {
    throw new GeminiParseError("Gemini did not return JSON.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new GeminiParseError("Gemini JSON could not be parsed.");
  }
  return normalizeAnalysisOutput(parsed);
}

export async function analyseListingImageWithGemini(args: {
  apiKey: string | undefined;
  model: string | undefined;
  imageBase64: string;
  mimeType: string;
  timeoutMs?: number;
}): Promise<{
  modelUsed: string;
  analysis: GeminiListingAnalysisOutput;
  tokenUsage: GeminiTokenUsage;
  rawText: string;
}> {
  const apiKey = args.apiKey?.trim();
  if (!apiKey) {
    throw new GeminiConfigError("Missing GEMINI_API_KEY.");
  }

  const modelUsed = args.model?.trim() || DEFAULT_GEMINI_MODEL;
  const timeoutMs =
    typeof args.timeoutMs === "number" && Number.isFinite(args.timeoutMs)
      ? Math.max(1000, Math.floor(args.timeoutMs))
      : DEFAULT_GEMINI_REQUEST_TIMEOUT_MS;
  const prompt = buildMarketplaceImageAnalysisPrompt();

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: modelUsed,
    generationConfig: {
      temperature: 0.1,
    },
  });

  let resultText = "";
  let usage: GeminiTokenUsage = {
    prompt_tokens: null,
    completion_tokens: null,
    total_tokens: null,
  };

  try {
    const result = await model.generateContent(
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: args.imageBase64,
                  mimeType: args.mimeType,
                },
              },
            ],
          },
        ],
      },
      { timeout: timeoutMs }
    );

    const response = result.response;
    resultText = response.text();
    usage = {
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
  } catch (error) {
    throw new GeminiProviderError(error instanceof Error ? error.message : "Gemini request failed.");
  }

  const analysis = parseGeminiAnalysisOutput(resultText);
  return {
    modelUsed,
    analysis,
    tokenUsage: usage,
    rawText: resultText,
  };
}
