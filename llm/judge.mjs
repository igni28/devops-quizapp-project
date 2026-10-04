import fs from "node:fs/promises";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const questions = JSON.parse(
  await fs.readFile("data/ai-questions.json", "utf8")
);

const prompt = `
You are evaluating trivia quiz questions.

Evaluate every question from 1 to 5 in these categories:

- factualCorrectness: Is the stated correct answer factually correct?
- clarity: Is the question clear and understandable?
- distractorQuality: Are the incorrect answers plausible but clearly incorrect?
- answerability: Is there one clear correct answer?

5 = excellent
1 = unacceptable

Return ONLY valid JSON in this format:

{
  "evaluations": [
    {
      "index": 1,
      "factualCorrectness": 5,
      "clarity": 5,
      "distractorQuality": 4,
      "answerability": 5,
      "reason": "Short explanation"
    }
  ]
}

Questions:

${JSON.stringify(questions, null, 2)}
`;




const response = await ai.interactions.create({
  model: "gemini-3.5-flash-lite",
  input: prompt,
});

const rawText = response.output_text.trim();

const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

const result = JSON.parse(cleanJson);

let totalScore = 0;
let scoreCount = 0;
let failed = false;

for (const evaluation of result.evaluations) {
  const scores = [
    evaluation.factualCorrectness,
    evaluation.clarity,
    evaluation.distractorQuality,
    evaluation.answerability
  ];

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  totalScore += average;
  scoreCount++;

  console.log(`Question ${evaluation.index}: ${average.toFixed(2)}/5`);

  console.log(`  ${evaluation.reason}`);

  if (evaluation.factualCorrectness < 4 || average < 4) {
    failed = true;
  }
}

const overallScore = totalScore / scoreCount;

console.log(`\nOverall quality score: ${overallScore.toFixed(2)}/5`);

if (failed || overallScore < 4) {
  console.error("LLM quality evaluation failed.");
  process.exit(1);
}

console.log("LLM quality evaluation passed.");