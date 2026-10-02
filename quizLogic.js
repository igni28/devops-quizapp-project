function buildApiUrl(category, difficulty, limit) {
  const params = new URLSearchParams({
    limit: String(limit),
    region: "NG",
    difficulty: difficulty
  });

  if (category !== "all") {
    params.set("categories", category);
  }

  return `https://the-trivia-api.com/api/questions?${params.toString()}`;
}

function mapApiQuestion(item) {
  return {
    id: item.id,
    question: item.question,
    correct: item.correctAnswer,
    options: [...item.incorrectAnswers, item.correctAnswer]
  };
}
//trivial but good tests
function isCorrectAnswer(selectedAnswer, correctAnswer) {
  return selectedAnswer === correctAnswer;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    buildApiUrl,
    mapApiQuestion,
    isCorrectAnswer
  };
}