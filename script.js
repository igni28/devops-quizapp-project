//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let rulesQuiz = document.querySelector(".rules-quiz");
let rulesContinue = document.getElementById("rules-continue");
let rulesGoBack = document.getElementById("rules-go-back");
let startButton = document.getElementById("start-button");
let categoryDiv = document.querySelector(".category");
let configBack = document.getElementById("config-back");

let questionCount;
let scoreCount = 0;
let count = 11;
let countdown;
let quizArray = [];

let quizMode = "ai";
let categoryValue = "all";
let difficultyValue = "medium";
let limitValue = "10";


document
  .getElementById("quiz-mode-select")
  .addEventListener("change", (event) => {
    quizMode = event.target.value;
  });

// Add event listener to the category dropdown
document
  .getElementById("category-select")
  .addEventListener("change", (event) => {
    categoryValue = event.target.value;
  });

// Add event listener to the difficulty dropdown
document
  .getElementById("difficulty-select")
  .addEventListener("change", (event) => {
    difficultyValue = event.target.value;
  });

// Add event listener to the question limit dropdown
document
  .getElementById("question-limit-input")
  .addEventListener("change", (event) => {
    limitValue = event.target.value;
  });

async function getAiQuestions() {
  const response = await fetch(
    "https://devops-quizapp-project.vercel.app/api/generate-quiz",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: categoryValue,
        difficulty: difficultyValue,
        count: Number(limitValue),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("AI quiz generation failed");
  }

  const data = await response.json();

  return data.questions.map((item, index) => ({
    id: `ai-${index}`,
    question: item.question,
    correct: item.correctAnswer,
    options: [...item.incorrectAnswers, item.correctAnswer],
  }));
}

document.getElementById("config-next").addEventListener("click", async () => {
  if (!navigator.onLine) {
    alert("An error occurred while fetching questions. Please check your Internet connection and try again.");
    return;
  }

  try {
    if (quizMode === "ai") {
      quizArray = await getAiQuestions();
    } else {
      const url = buildApiUrl(
        categoryValue,
        difficultyValue,
        limitValue
      );

      const response = await fetch(url);
      const data = await response.json();

      quizArray = data.map((item) => mapApiQuestion(item));
    }

    categoryDiv.style.display = "none";
    displayContainer.style.display = "block";
    initial();

  } catch (error) {
    console.error(error);
    alert("An error occurred while loading questions.");
  }
});


//Restart Quiz
restart.addEventListener("click", () => {
  location.reload();
});

//Next Button
const displayNext = () => {
  //increment questionCount
  questionCount += 1;

  //if last question
  if (questionCount == quizArray.length) {
    //hide question container and display score
    displayContainer.style.display = "none";
    startScreen.classList.add("hide");
    scoreContainer.classList.remove("hide");

    //user score
    userScore.innerHTML =
      "Your score: " +
      scoreCount +
      "<br> Total score: " +
      questionCount +
      " <br> Category: " +
      document.getElementById("category-select").value +
      "<br> Difficulty: " +
      document.getElementById("difficulty-select").value;
  } else {
    //display questionCount
    startScreen.classList.add("hide");

    countOfQuestion.innerHTML =
      questionCount + 1 + " of " + quizArray.length + " Questions.";

    //display quiz
    quizDisplay(questionCount);

    count = 11;
    clearInterval(countdown);
    timerDisplay();
  }
};

nextBtn.addEventListener("click", displayNext);

//Timer
const timerDisplay = () => {
  countdown = setInterval(() => {
    count--;
    timeLeft.innerHTML = `${count}s`;

    if (count == 0) {
      clearInterval(countdown);
      displayNext();
    }
  }, 1000);
};

//Display quiz
const quizDisplay = (questionCount) => {
  let quizCards = document.querySelectorAll(".container-mid");

  //Hide other cards
  quizCards.forEach((card) => {
    card.classList.add("hide");
  });

  //display current question card
  quizCards[questionCount].classList.remove("hide");
};

//Quiz Creation
function quizCreator() {
  //randomly sort questions
  quizArray.sort(() => Math.random() - 0.5);

  //generate quiz
  for (let i of quizArray) {
    //randomly sort options
    i.options.sort(() => Math.random() - 0.5);

    //quiz card creation
    let div = document.createElement("div");
    div.classList.add("container-mid", "hide");

    //question number
    countOfQuestion.innerHTML =
      1 + " of " + quizArray.length + " Questions.";

    //question
    let question_DIV = document.createElement("p");
    question_DIV.classList.add("question");
    question_DIV.innerHTML = i.question;
    div.appendChild(question_DIV);

    //options
    div.innerHTML += `
    <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
    <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
    <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
    <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
    `;

    quizContainer.appendChild(div);
  }
}

//Checker Function to check if option is correct or not
function checker(userOption) {
  let userSolution = userOption.innerText;

  let question =
    document.getElementsByClassName("container-mid")[questionCount];

  let options = question.querySelectorAll(".option-div");

  //if user clicked answer == correct option stored in object
  if (isCorrectAnswer(userSolution, quizArray[questionCount].correct)) {
    userOption.classList.add("correct");
    scoreCount++;
  } else {
    userOption.classList.add("incorrect");

    //For marking the correct option
    options.forEach((element) => {
      if (element.innerText == quizArray[questionCount].correct) {
        element.classList.add("correct");
      }
    });
  }

  //clear interval(stop timer)
  clearInterval(countdown);

  //disable all options
  options.forEach((element) => {
    element.disabled = true;
  });
}

window.checker = checker;

//initial setup
function initial() {
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  count = 11;

  clearInterval(countdown);

  timerDisplay();
  quizCreator();
  quizDisplay(questionCount);
}

//when user click on start button
startButton.addEventListener("click", () => {
  rulesQuiz.style.display = "block";
  startScreen.classList.add("hide");
});

//when user clicks on rules' go back button
rulesGoBack.addEventListener("click", () => {
  rulesQuiz.style.display = "none";
  startScreen.classList.remove("hide");
});

//when user clicks on rules' next button
rulesContinue.addEventListener("click", () => {
  rulesQuiz.style.display = "none";
  categoryDiv.style.display = "block";
});

//when user clicks on config page go back button
configBack.addEventListener("click", () => {
  categoryDiv.style.display = "none";
  rulesQuiz.style.display = "block";
});

//hide quiz and display start screen
window.onload = () => {
  startScreen.classList.remove("hide");
  displayContainer.classList.add("hide");
};