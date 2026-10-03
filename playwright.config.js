const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",

  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
  },

  webServer: {
    command: "npx http-server . -p 3000 -c-1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
});