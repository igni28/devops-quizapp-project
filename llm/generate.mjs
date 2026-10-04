import fs from "node:fs/promises";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const numberOfQuestions = 10;
const category = "general knowledge";
const difficulty = "medium";

const prompt = `
Generate ${numberOfQuestions} original trivia quiz questions.

Category: ${category}
Difficulty: ${difficulty}

For every question:
- provide exactly one correct answer,
- provide exactly three incorrect but plausible answers,
- make all four answers unique,
- avoid ambiguous questions,
- do not reveal the answer in the question.

Return ONLY a valid JSON in this structure:

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

const rawText = response.output_text.trim();

const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

const result = JSON.parse(cleanJson);

await fs.mkdir("data", { recursive: true });

await fs.writeFile(
  "data/ai-questions.json",
  JSON.stringify(result.questions, null, 2)
);

console.log(`Generated ${result.questions.length} AI questions.`);