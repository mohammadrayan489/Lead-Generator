import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Order: try 'gemini-flash-latest' first for maximum availability during spikes, then 'gemini-3.8-flash', then 'gemini-3.1-flash-lite'
export const GEMINI_CANDIDATE_MODELS = [
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
];

export const GEMINI_MODEL = "gemini-flash-latest";

export interface GenerateWithFallbackParams {
  contents: GenerateContentParameters['contents'];
  config?: GenerateContentParameters['config'];
  preferredModels?: string[];
}

/**
 * Executes a generateContent call with automatic fallback across models
 * when experiencing 503 (high demand / unavailable) or 429 (rate limits).
 */
export async function generateContentWithFallback(
  params: GenerateWithFallbackParams
): Promise<GenerateContentResponse> {
  const ai = getGenAI();
  const models = params.preferredModels || GEMINI_CANDIDATE_MODELS;
  let lastError: any = null;

  for (const model of models) {
    // Up to 2 attempts per model for transient errors
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const statusCode = err?.status || err?.code || (err?.message?.includes('503') ? 503 : undefined);

        // If 503 (high demand) or 429 (rate limit), retry after brief pause or fall through to next model
        if (statusCode === 503 || statusCode === 429) {
          if (attempt < 2) {
            await new Promise((res) => setTimeout(res, 400 * attempt));
            continue;
          }
          // Move to next model
          break;
        }

        // For other errors, break and try next candidate model
        break;
      }
    }
  }

  throw lastError || new Error("Failed to generate content across available models");
}

