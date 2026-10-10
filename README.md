# DevOps and LLMOps Pipeline for a Web-Based Quiz Application

This project extends an existing web-based quiz application with a complete DevOps pipeline and an AI-generated quiz mode.

The application supports two quiz modes:

- **Classic Quiz** – questions are retrieved from The Trivia API.
- **AI Generated Quiz** – new questions are generated dynamically using Google Gemini based on the selected category, difficulty and number of questions.

The project focuses on CI/CD automation, infrastructure as code, automated testing, security automation and LLM quality evaluation.

The site is being run at github pages: https://igni28.github.io/devops-quizapp-project/

---

## Running Locally

Install dependencies:

```bash
npm install
```

Set the Gemini API key.

On Windows CMD:

```cmd
set GEMINI_API_KEY=YOUR_API_KEY
```

Generate AI questions:

```bash
npm run generate:ai
```

Run deterministic evaluation:

```bash
npm run evaluate:ai
```

Run the LLM judge:

```bash
npm run judge:ai
```

Run unit tests:

```bash
npm test
```

Run integration tests:

```bash
npm run test:e2e
```

Run the application locally:

```bash
npx http-server . -p 3000 -c-1
```

Then open:

```text
http://127.0.0.1:3000
```

## Features



### AI Generated Quiz

When AI mode is selected in the application:

1. The frontend sends the quiz configuration to a serverless API.
2. The API creates a prompt for Google Gemini.
3. Gemini generates a new set of questions.
4. Structured output enforces the expected JSON format.
5. Runtime validation checks the generated questions.
6. Valid questions are returned to the application.

The Gemini API key is stored only on the server and is never exposed in the frontend.

---

## CI/CD Architecture

```text
                    GitHub Repository
                           |
                           v
                    GitHub Actions
                           |
          +----------------+----------------+
          |                                 |
          v                                 v
     Standard CI                       LLM Quality Gate
          |                                 |
      ESLint                          Gemini generation
      Unit tests                            |
      Playwright                            v
      Terraform validation        Deterministic evaluation
                                            |
                                            v
                                      LLM-as-a-Judge
                                            |
                         +------------------+------------------+
                         |                                     |
                       PASS                                  FAIL
                         |                                     |
                         v                                     v
                     Deployment                         Pipeline blocked
                         |
                         v
                   GitHub Pages
```

---

## Technologies used

### Frontend

- HTML
- CSS
- JavaScript

### DevOps

- GitHub
- GitHub Actions
- GitHub Pages
- Dependabot
- Terraform

### Testing and Quality

- Node.js built-in test runner
- ESLint
- Playwright

### AI / LLMOps

- Google Gemini API
- Google GenAI SDK
- Structured JSON output
- Deterministic AI output evaluation
- LLM-as-a-Judge
- Runtime validation

### Backend

- Vercel Serverless Functions

---

## CI Pipeline

The CI workflow automatically performs:

```text
npm ci
↓
ESLint
↓
JavaScript syntax validation
↓
Unit tests
↓
Playwright integration tests
↓
Terraform validation
↓
LLM quality evaluation
```


---

## LLM Quality Gate

The project contains two levels of AI output evaluation.

### Deterministic Evaluation

`llm/evaluate.mjs` checks:

- expected number of questions,
- non-empty question text,
- correct answer exists,
- exactly three incorrect answers,
- four unique answer options,
- correct answer is not duplicated among incorrect answers,
- obvious answer leakage is avoided.

If any rule fails, `process.exit(1)` causes the CI pipeline to fail.

### LLM-as-a-Judge

`llm/judge.mjs` uses Gemini to evaluate generated questions according to:

- factual correctness,
- clarity,
- distractor quality,
- answerability.

Each category receives a score from 1 to 5.

Questions below the required quality threshold cause the quality gate to fail.

This prevents deployment when generated content does not meet the expected quality level.

---

## Runtime AI Validation

Questions generated for real users are also validated by the backend before being returned to the application.

This provides two different protection layers:

```text
CI quality gate
→ evaluates the AI system before deployment

Runtime validation
→ validates content generated for users
```

---

## Automated Tests

### Unit Tests

Pure quiz logic is separated into `quizLogic.js` and tested using the Node.js test runner.

Run:

```bash
npm test
```

### Playwright Tests

The project contains integration tests for both ai and classic quiz modes.

#### Classic Quiz

The Trivia API request is intercepted and replaced with deterministic test data.

#### AI Quiz

The Vercel API request is intercepted and replaced with a deterministic AI-style response.

This allows the UI flow to be tested without depending on an external API during Playwright tests.

Run:

```bash
npm run test:e2e
```

---

## Security Automation

Dependabot monitors project dependencies and creates pull requests when updates are available.

Both npm dependencies and GitHub Actions can be monitored automatically.

Secrets such as `GEMINI_API_KEY` are stored using environment variables and GitHub/Vercel secrets and are never committed to the repository.

---

## Infrastructure as Code

Terraform is used to describe the GitHub Pages configuration.

Terraform files are stored in:

```text
infra/
```

The CI pipeline performs:

```bash
terraform init -backend=false
terraform fmt -check
terraform validate
```

Infrastructure changes can therefore be validated automatically before merging.

---

## Continuous Deployment

The frontend is deployed using GitHub Pages.

The CD workflow only runs after the CI workflow succeeds.

```text
CI SUCCESS
    |
    v
CD
    |
    v
GitHub Pages
```

If tests or the LLM quality gate fail, the new frontend version is not deployed.

The AI backend is deployed separately using Vercel Serverless Functions.

---


---

## AI-Assisted Development

Described in `AI_USAGE.md`.

---

## Limitations

The project has several expected limitations:

- LLM output is non-deterministic.
- Generated questions can still contain factual errors despite automated evaluation.
- AI mode depends on the availability and rate limits of the Gemini API.
- The LLM judge is itself an AI model and therefore cannot provide a perfect guarantee of correctness.
- Serverless generation introduces additional latency compared with the Classic Quiz mode.

The project reduces these risks through structured output, deterministic validation, automated testing and LLM-based evaluation.

---

## Original Project

This project is based on the original quiz application by Jimike110.

To see the original README and source project, go to the original repository:

https://github.com/Jimike110/quizApp
