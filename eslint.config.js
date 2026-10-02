const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended, {
    files: ["script.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        buildApiUrl: "readonly",
        mapApiQuestion: "readonly",
        isCorrectAnswer: "readonly"
      }
    }
  },

  {
    files: ["quizLogic.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node
    }
  }
];