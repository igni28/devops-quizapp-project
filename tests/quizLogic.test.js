const test = require("node:test");
const assert = require("node:assert/strict")
const {buildApiUrl, mapApiQuestion, isCorrectAnswer} = require("../quizLogic")

test("buildApiUrl makes URL for all categories", () => {
  const url = new URL(buildApiUrl("all", "easy", 10));

  assert.equal(url.searchParams.get("difficulty"), "easy");
  assert.equal(url.searchParams.get("limit"), "10");
  assert.equal(url.searchParams.get("categories"), null);
});

test("buildApiUrl contain selected category", () => {
  const url = new URL(buildApiUrl("geography", "hard", 20));

  assert.equal(url.searchParams.get("categories"), "geography");

  assert.equal(url.searchParams.get("difficulty"),"hard");

  assert.equal( url.searchParams.get("limit"), "20");
});

test("mapApiQuestion converts API response to quiz format", () => {
  const apiQuestion = {
    id: "123",
    question: "What is the capital of Sweden?",
    correctAnswer: "Stockholm",
    incorrectAnswers: [
      "Oslo",
      "Copenhagen",
      "Helsinki"
    ]
  };

  const result = mapApiQuestion(apiQuestion);

  assert.equal(result.id, "123");
  assert.equal(result.question, "What is the capital of Sweden?");
  assert.equal(result.correct, "Stockholm");

  assert.deepEqual(result.options, [
    "Oslo",
    "Copenhagen",
    "Helsinki",
    "Stockholm"
  ]);
});