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

    const quizSchema = {
      type: "object",
      properties: {
        questions: {
          type: "array",
          minItems: count,
          maxItems: count,
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
Generate ${count} original trivia quiz questions.

Category: ${categoryText}
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
    
    const questions = result.questions;

    const validQuestions =
      Array.isArray(questions) &&
      questions.length === count &&
      questions.every((item) => {
        if (!item.question || !item.correctAnswer) {
          return false;
        }

        if (!Array.isArray(item.incorrectAnswers) || item.incorrectAnswers.length !== 3) {
          return false;
        }

        const answers = [item.correctAnswer, ...item.incorrectAnswers,].map((answer) => answer.trim().toLowerCase());

        return new Set(answers).size === 4;
      });

    if (!validQuestions) {
      throw new Error("Generated questions failed validation");
    }

    return Response.json(
      {
        questions: result.questions,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
      console.error(error);

      return Response.json(
        {
          error: error.message,
        },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
}