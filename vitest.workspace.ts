import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      environment: "happy-dom",
      // reporters: ["default", "html"],
      setupFiles: ["happy-dom.setup.ts"],
      include: ["**/*.{test,spec}.{ts,tsx}"],
      name: "unit",
    },
  },
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
