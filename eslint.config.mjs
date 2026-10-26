// @ts-check
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default defineConfig(
  {
    ignores: [
      "node_modules/",
      "playwright-report/",
      "test-results/",
      "eslint.config.mjs",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["tests/**/*.ts"],
    ...playwright.configs["flat/recommended"],
  },
  {
    files: ["tests/**/*.ts"],
    rules: {
      "playwright/expect-expect": [
        "error",
        { assertFunctionNames: ["assertSuccessResponseCode"] },
      ],
    },
  },
);
