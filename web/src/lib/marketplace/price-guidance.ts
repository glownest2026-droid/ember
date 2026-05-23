import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAiListingEnvironment } from "@/lib/marketplace/ai-listing-gemini-config";
import type { PriceGuidance, PriceSourceType } from "./beta-listing-types";

const CONDITION_MULTIPLIERS: Record<string, number> = {
  new: 1,
  like_new: 0.9,
  good: 0.75,
  fair: 0.55,
  needs_repair: 0.35,
  not_sure: 0.5,
};

type PriceInput = {
  item_label: string;
  category_label: string | null;
  condition: string;
};

function manualBand(input: PriceInput): PriceGuidance | null {
  const label = `${input.item_label} ${input.category_label ?? ""}`.toLowerCase();
  let baseLow = 8;
  let baseHigh = 15;

  if (label.includes("microphone") || label.includes("instrument") || label.includes("xylophone")) {
    baseLow = 6;
    baseHigh = 12;
  } else if (label.includes("plush") || label.includes("bear") || label.includes("paddington")) {
    baseLow = 5;
    baseHigh = 12;
  } else if (label.includes("cart") || label.includes("kitchen") || label.includes("shop")) {
    baseLow = 10;
    baseHigh = 25;
  } else if (label.includes("doctor") || label.includes("kit")) {
    baseLow = 8;
    baseHigh = 18;
  }

  const multiplier = CONDITION_MULTIPLIERS[input.condition] ?? 0.5;
  const price_low = Math.max(2, Math.round(baseLow * multiplier));
  const price_high = Math.max(price_low + 1, Math.round(baseHigh * multiplier));

  return {
    price_low,
    price_high,
    currency: "GBP",
    confidence: "medium",
    source_type: "manual_price_band",
    explanation: "Based on a cautious category band and your chosen condition.",
    caveats: ["Early estimate", "Final price is your choice."],
  };
}

async function aiEstimate(input: PriceInput): Promise<PriceGuidance | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const env = getAiListingEnvironment();
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: env.effectiveModel });

  const prompt = `You help UK parents price second-hand children's items for a private family marketplace.
Item: ${input.item_label}
Category: ${input.category_label ?? "unknown"}
Parent-confirmed condition: ${input.condition}

Return ONLY valid JSON:
{
  "price_low": number,
  "price_high": number,
  "confidence": "low" | "medium" | "high",
  "explanation": "short parent-friendly sentence"
}

Rules:
- Give a cautious UK second-hand resale RANGE in GBP, not an exact price.
- If evidence is weak, confidence must be low.
- Do NOT claim this is based on sold listings or RRP unless you were given that data (you were not).
- Do NOT invent RRP.
- price_high must be >= price_low.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]) as {
      price_low?: number;
      price_high?: number;
      confidence?: string;
      explanation?: string;
    };
    const low = Number(parsed.price_low);
    const high = Number(parsed.price_high);
    if (!Number.isFinite(low) || !Number.isFinite(high) || high < low) return null;
    const confidence =
      parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
        ? parsed.confidence
        : "low";

    return {
      price_low: Math.round(low),
      price_high: Math.round(high),
      currency: "GBP",
      confidence,
      source_type: "ai_general_estimate",
      explanation: parsed.explanation ?? "Early estimate based on item type and condition.",
      caveats: ["Early estimate", "Final price is your choice."],
    };
  } catch {
    return null;
  }
}

export async function buildPriceGuidance(input: PriceInput): Promise<PriceGuidance> {
  if (input.condition === "not_sure") {
    return {
      price_low: null,
      price_high: null,
      currency: "GBP",
      confidence: "low",
      source_type: "insufficient_data",
      explanation:
        "Price guidance is limited when condition is not confirmed. You can still choose your own asking price.",
      caveats: ["Choose a condition for a clearer range.", "Final price is your choice."],
    };
  }

  const manual = manualBand(input);
  if (manual) return manual;

  const ai = await aiEstimate(input);
  if (ai) return ai;

  return {
    price_low: null,
    price_high: null,
    currency: "GBP",
    confidence: "low",
    source_type: "insufficient_data",
    explanation: "Price guidance is limited for this item. You can still choose your own asking price.",
    caveats: ["Final price is your choice."],
  };
}
