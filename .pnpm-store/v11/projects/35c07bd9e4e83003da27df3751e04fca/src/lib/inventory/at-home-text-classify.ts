import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  extractJsonText,
  GeminiConfigError,
  GeminiParseError,
  GeminiProviderError,
} from "@/lib/marketplace/ai-listing-analysis";
import {
  extractProviderDetails,
  getEffectiveGeminiModel,
  resolveGeminiTimeoutMs,
} from "@/lib/marketplace/ai-listing-gemini-config";
import { runWithGeminiModelFallback } from "@/lib/marketplace/ai-listing-gemini-fallback";
import type { AtHomeCatalogue } from "./at-home-catalogue";
import { buildAtHomeTextClassifyPrompt } from "./at-home-text-classify-prompt";

export type AtHomeTextClassifyOutput = {
  family_slug: string;
  product_type_slug: string;
  parent_hint: string;
  confidence: number;
  why: string;
};

export type AtHomeTextClassifyResult = {
  modelUsed: string;
  classification: AtHomeTextClassifyOutput;
  rawText: string;
};

function clampConfidence(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(1, parsed));
}

function normalizeClassification(value: unknown): AtHomeTextClassifyOutput {
  const source = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return {
    family_slug: String(source.family_slug ?? "").trim(),
    product_type_slug: String(source.product_type_slug ?? "").trim(),
    parent_hint: String(source.parent_hint ?? "").trim(),
    confidence: clampConfidence(source.confidence),
    why: String(source.why ?? "").trim(),
  };
}

export function parseAtHomeTextClassifyOutput(rawText: string): AtHomeTextClassifyOutput {
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

  return normalizeClassification(parsed);
}

async function generateAtHomeTextClassifyContent(args: {
  apiKey: string;
  model: string;
  prompt: string;
  timeoutMs: number;
}): Promise<{ modelUsed: string; rawText: string }> {
  const client = new GoogleGenerativeAI(args.apiKey);
  const model = client.getGenerativeModel({
    model: args.model,
    generationConfig: { temperature: 0.1 },
  });

  try {
    const result = await model.generateContent(
      { contents: [{ role: "user", parts: [{ text: args.prompt }] }] },
      { timeout: args.timeoutMs }
    );
    return {
      modelUsed: args.model,
      rawText: result.response.text(),
    };
  } catch (error) {
    const details = extractProviderDetails(error);
    throw new GeminiProviderError(
      error instanceof Error ? error.message : "Gemini request failed.",
      details.providerStatus,
      details.providerCode
    );
  }
}

export async function classifyAtHomeTextWithGemini(args: {
  apiKey: string | undefined;
  model?: string;
  query: string;
  catalogue: AtHomeCatalogue;
  timeoutMs?: number;
}): Promise<AtHomeTextClassifyResult> {
  const apiKey = args.apiKey?.trim();
  if (!apiKey) {
    throw new GeminiConfigError("Missing GEMINI_API_KEY.");
  }

  const modelUsed = args.model?.trim() || getEffectiveGeminiModel();
  const { timeoutMs } =
    typeof args.timeoutMs === "number"
      ? resolveGeminiTimeoutMs(String(args.timeoutMs))
      : resolveGeminiTimeoutMs();

  const prompt = buildAtHomeTextClassifyPrompt(args.query, args.catalogue);

  const { result: generated, meta } = await runWithGeminiModelFallback({
    primaryModel: modelUsed,
    attempt: (model) =>
      generateAtHomeTextClassifyContent({
        apiKey,
        model,
        prompt,
        timeoutMs,
      }),
  });

  const classification = parseAtHomeTextClassifyOutput(generated.rawText);
  return {
    modelUsed: meta.modelUsed,
    classification,
    rawText: generated.rawText,
  };
}

export const AT_HOME_AI_MIN_CONFIDENCE = 0.72;

export function isAtHomeAiClassificationUsable(
  classification: AtHomeTextClassifyOutput,
  catalogue: AtHomeCatalogue
): boolean {
  if (classification.confidence < AT_HOME_AI_MIN_CONFIDENCE) return false;
  if (!classification.family_slug || !classification.product_type_slug) return false;

  const family = catalogue.families.find((entry) => entry.slug === classification.family_slug);
  if (!family) return false;

  const type = catalogue.typeBySlug.get(classification.product_type_slug);
  if (!type || type.family_slug !== classification.family_slug) return false;

  return true;
}
