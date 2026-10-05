import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://igni28.github.io",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    const {
      category = "all",
      difficulty = "medium",
      count = 10,
    } = await request.json();

    const categoryText =
      category === "all"
        ? "any category"
        : category.replaceAll("_", " ");

    const prompt = `
Generate ${count} original trivia quiz questions.

Category: ${categoryText}
Difficulty: ${difficulty}

For every question:
- provide exactly one correct answer
- provide exactly three incorrect but plausible answers
- make all four answers unique
- avoid ambiguous questions
- do not reveal the answer in the question

Return ONLY valid JSON in this structure:

{
  "questions": [
    {
      "question": "...",
      "correctAnswer": "...",
      "incorrectAnswers": ["...", "...", "..."],
      "category": "...",
      "difficulty": "..."
    }
  ]
}
`;

    const response = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: prompt,
    });

    const cleanJson = response.output_text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

    const result = JSON.parse(cleanJson);

    return Response.json({questions: result.questions,}, {headers: corsHeaders,});
  } catch (error) {
    console.error(error);
    return Response.json({error: "Failed to generate quiz."}, {headers: corsHeaders,});
  }
}