import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "vitest.config.ts",
  {
    test: {
      include: ["**/*.browser.{test,spec}.{ts,tsx}"],
      name: "browser",
      browser: {
        enabled: false,
        name: "chromium",
        provider: "playwright",
        // https://playwright.dev
        providerOptions: {},
      },
    },
  },
]);
