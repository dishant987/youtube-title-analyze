import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY!;
const model = new GoogleGenerativeAI(GEMINI_KEY).getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateTitleAndReason(
  originalTitle: string,
  videoUrl: string
) {
  const prompt = `Given this YouTube video title: "${originalTitle}" and link: ${videoUrl}
Produce:
1) A shorter, more clickable title (<= 70 chars) that preserves meaning and increases CTR.
2) One sentence explaining WHY this new title is better (focus on clarity, searchability & emotional hook).

Return JSON with keys: newTitle, reason. Ensure well-formed JSON ONLY.
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  // Remove ```json or ``` and whitespace
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      newTitle: parsed.newTitle ?? "",
      reason: parsed.reason ?? "",
    };
  } catch (err) {
    return {
      newTitle: originalTitle, // Fallback
      reason: "Generated output could not be parsed.",
    };
  }
}
