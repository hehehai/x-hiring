/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["eslint:recommended", "prettier", "eslint-config-turbo"],
  env: {
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  ignorePatterns: [
    "**/.eslintrc.cjs",
    "**/*.config.js",
    "**/*.config.cjs",
    ".next",
    "dist",
    "pnpm-lock.yaml",
  ],
  reportUnusedDisableDirectives: true,
};

module.exports = config;
