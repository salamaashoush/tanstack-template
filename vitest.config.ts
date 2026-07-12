import { paraglideVitePlugin } from "@inlang/paraglide-js";
import viteReact from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { configDefaults, defineConfig } from "vitest/config";

import { paraglideOptions } from "./paraglide.options";

export default defineConfig({
  plugins: [viteReact(), paraglideVitePlugin(paraglideOptions)],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "happy-dom",
          setupFiles: ["happy-dom.setup.ts"],
          exclude: [
            ...configDefaults.exclude,
            "e2e/**",
            "**/*.browser.{test,spec}.{ts,tsx}",
          ],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["**/*.browser.{test,spec}.{ts,tsx}"],
          browser: {
            enabled: false,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
