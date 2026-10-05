import fs from "node:fs/promises";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const numberOfQuestions = 10;
const category = "general knowledge";
const difficulty = "medium";

const quizSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      minItems: numberOfQuestions,
      maxItems: numberOfQuestions,
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
          },
          correctAnswer: {
            type: "string",
          },
          incorrectAnswers: {
            type: "array",
            items: {
              type: "string",
            },
            minItems: 3,
            maxItems: 3,
          },
          category: {
            type: "string",
          },
          difficulty: {
            type: "string",
          },
        },
        required: [
          "question",
          "correctAnswer",
          "incorrectAnswers",
          "category",
          "difficulty",
        ],
      },
    },
  },
  required: ["questions"],
};

const prompt = `
Generate ${numberOfQuestions} original trivia quiz questions.

Category: ${category}
Difficulty: ${difficulty}

For every question:
- provide exactly one correct answer
- provide exactly three incorrect but plausible answers
- make all four answers unique
- avoid ambiguous questions
- do not reveal the answer in the question
`;

const response = await ai.interactions.create({
  model: "gemini-3.5-flash-lite",
  input: prompt,
  response_format: {
    type: "text",
    mime_type: "application/json",
    schema: quizSchema,
  },
});

const result = JSON.parse(response.output_text);

await fs.mkdir("data", { recursive: true });

await fs.writeFile(
  "data/ai-questions.json",
  JSON.stringify(result.questions, null, 2)
);

console.log(`Generated ${result.questions.length} AI questions.`);