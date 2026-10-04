import fs from "node:fs/promises";

const EXPECTED_QUESTIONS = 10;

const questions = JSON.parse(await fs.readFile("data/ai-questions.json", "utf8"));

const errors = [];

if (!Array.isArray(questions)) {
  console.error("ai-questions.json must contain an array.");
  process.exit(1);
}

if (questions.length !== EXPECTED_QUESTIONS) {
  errors.push(`Expected ${EXPECTED_QUESTIONS} questions, but found ${questions.length}.`);
}

questions.forEach((item, index) => {
  const number = index + 1;

  // CHeck if question exists
  if (typeof item.question !== "string" || item.question.trim().length === 0) {
    errors.push(`Question ${number}: missing question text.`);
  }

  // Correct answer exists
  if (typeof item.correctAnswer !== "string" || item.correctAnswer.trim().length === 0) {
    errors.push(`Question ${number}: missing correct answer.`);
  }

  // 3 incorrect answers
  if (!Array.isArray(item.incorrectAnswers) || item.incorrectAnswers.length !== 3) {
    errors.push(`Question ${number}: must contain exactly 3 incorrect answers.`);
    return;
  }

  const allAnswers = [
    item.correctAnswer,
    ...item.incorrectAnswers
  ];

  // No empty answers
  if (allAnswers.some((answer) => typeof answer !== "string" || answer.trim().length === 0)) {
    errors.push(`Question ${number}: contains an empty answer.`);
  }

  // All four answers must be unique
  const normalizedAnswers = allAnswers.map((answer) =>
    String(answer).trim().toLowerCase()
  );

  if (new Set(normalizedAnswers).size !== 4) {
    errors.push(`Question ${number}: answers are not unique.`);
  }

  // Correct answer cannot also appear among incorrect answers
  const correct = String(item.correctAnswer)
    .trim()
    .toLowerCase();

  const incorrect = item.incorrectAnswers.map((answer) =>
    String(answer).trim().toLowerCase()
  );

  if (incorrect.includes(correct)) {
    errors.push(`Question ${number}: correct answer also appears as an incorrect answer.`);
  }

  // Question should not contain the answer
  if (typeof item.question === "string" && item.question.toLowerCase().includes(correct)) {
    errors.push(`Question ${number}: question contains the correct answer.`);
  }
});

if (errors.length > 0) {
  console.error("\nAI question evaluation failed:\n");

  errors.forEach((error) => {
    console.error(`- ${error}`);
  });

  console.error(`\nFound ${errors.length} problem(s).`);
  process.exit(1);
}

console.log(`Evaluation passed`);