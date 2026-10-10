const { test, expect } = require("@playwright/test");

const fakeQuestions = [
  {
    id: "1",
    question: "What is the capital of Sweden?",
    correctAnswer: "Stockholm",
    incorrectAnswers: ["Oslo", "Helsinki", "Copenhagen"],
  },
  {
    id: "2",
    question: "What is 2 + 2?",
    correctAnswer: "4",
    incorrectAnswers: ["3", "5", "6"],
  },
];

test("classic quiz can be started and moved to the next question", async ({
  page,
}) => {
  await page.route(
    "https://the-trivia-api.com/api/questions**",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fakeQuestions),
      });
    }
  );

  await page.goto("/");

  await page.locator("#start-button").click();
  await page.locator("#rules-continue").click();

  await page.selectOption("#quiz-mode-select", "classic");
  await page.selectOption("#category-select", "all");
  await page.selectOption("#difficulty-select", "easy");
  await page.selectOption("#question-limit-input", "10");

  await page.locator("#config-next").click();

  const currentQuestion = page.locator(".container-mid:not(.hide)");

  await expect(currentQuestion).toBeVisible();
  await expect(currentQuestion.locator(".option-div")).toHaveCount(4);

  await currentQuestion.locator(".option-div").first().click();

  await page.locator("#next-button").click();

  await expect(page.locator(".number-of-question")).toContainText("2 of 2");
});

test("AI quiz works with generated questions", async ({ page }) => {
  await page.route(
    "https://devops-quizapp-project.vercel.app/api/generate-quiz",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          questions: [
            {
              question: "Which planet is known as the Red Planet?",
              correctAnswer: "Mars",
              incorrectAnswers: ["Venus", "Jupiter", "Saturn"],
              category: "science",
              difficulty: "medium"
            },
            {
              question: "What is the capital of Sweden?",
              correctAnswer: "Stockholm",
              incorrectAnswers: ["Oslo", "Helsinki", "Copenhagen"],
              category: "geography",
              difficulty: "medium"
            }
          ]
        })
      });
    }
  );

  await page.goto("/");

  await page.click("#start-button");
  await page.click("#rules-continue");

  await page.selectOption("#quiz-mode-select", "ai");
  await page.selectOption("#category-select", "all");
  await page.selectOption("#difficulty-select", "medium");
  await page.selectOption("#question-limit-input", "10");

  await page.click("#config-next");

  const visibleQuestion = page.locator(
    ".container-mid:not(.hide) .question"
  );

  const visibleOptions = page.locator(
    ".container-mid:not(.hide) .option-div"
  );

  await expect(visibleQuestion).toBeVisible();
  await expect(visibleOptions).toHaveCount(4);

  await visibleOptions.first().click();
  await page.click("#next-button");

  await expect(
    page.locator(".container-mid:not(.hide) .question")
  ).toBeVisible();
});