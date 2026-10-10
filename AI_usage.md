# AI Usage

AI tools were used both as part of the application functionality and during development of the project.

## Gemini API

Google Gemini is used in two places in the project.

### Quiz question generation

The application supports an AI-generated quiz mode. When the user selects this mode, the frontend sends the selected category, difficulty and number of questions to a serverless API endpoint.

The API uses Gemini to generate new quiz questions dynamically. Structured JSON output is used to enforce the expected response format.

### LLM quality evaluation

Gemini is also used as an LLM judge in the CI pipeline, apart from a deterministic evaluation.

Generated questions are evaluated according to:
- factual correctness,
- clarity,
- distractor quality,
- answerability.

Questions that do not reach the required quality threshold cause the CI job to fail.


## AI-assisted development

ChatGPT was used during development to assist with:

- designing the CI/CD pipeline,
- debugging JavaScript and GitHub Actions workflows,
- integrating Gemini,
- reviewing code, especially JS.

Generated suggestions were reviewed, modified and tested before being added to the project.
