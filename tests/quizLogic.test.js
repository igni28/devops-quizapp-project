const test = require("node:test");
const assert = require("node:assert/strict")
const {buildApiUrl, mapApiQuestion, isCorrectAnswer} = require("../quizLogic")

test("buildApiUrl makes URL for all categories", () => {
  const url = new URL(buildApiUrl("all", "easy", 10));

  assert.equal(url.searchParams.get("difficulty"), "easy");
  assert.equal(url.searchParams.get("limit"), "10");
  assert.equal(url.searchParams.get("categories"), null);
});