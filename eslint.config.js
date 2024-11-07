/// <reference types="./eslint.d.ts" />

import path from "node:path";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import pluginRouter from "@tanstack/eslint-plugin-router";
import importPlugin from "eslint-plugin-import";
import jsx11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");
/**
 * All packages that leverage t3-env should use this rule
 */
export const restrictEnvAccess = tseslint.config({
  files: ["**/*.js", "**/*.ts", "**/*.tsx"],
  rules: {
    "no-restricted-properties": [
      "error",
      {
        object: "process",
        property: "env",
        message:
          "Use `import { env } from '~/env'` instead to ensure validated types.",
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        name: "process",
        importNames: ["env"],
        message:
          "Use `import { env } from '~/env'` instead to ensure validated types.",
      },
      {
        name: "react-i18next",
        message:
          "Import from `~/i18n/client` instead to ensure type safety and proper initialization.",
      },
      {
        name: "i18next",
        message:
          "Import from `~/i18n/client` instead to ensure type safety and proper initialization.",
      },
    ],
  },
});

const baseConfig = tseslint.config(
  // Ignore files not tracked by VCS and any config files
  includeIgnoreFile(gitignorePath),
  {
    ignores: ["**/*.config.*", "**/generated", "**/routeTree.gen.ts"],
  },
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    plugins: {
      import: importPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      // ...tseslint.configs.strictTypeChecked,
    ],
    rules: {
      "@tanstack/router/create-route-property-order": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-misused-promises": [
        2,
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { projectService: true } },
  },
);

const reactConfig = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "jsx-a11y": jsx11yPlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...jsx11yPlugin.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        React: "writable",
      },
    },
  },
];

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  ...restrictEnvAccess,
  ...reactConfig,
  ...pluginRouter.configs["flat/recommended"],
];
