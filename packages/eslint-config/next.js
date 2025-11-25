import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import pluginNext from "@next/eslint-plugin-next";
import { baseConfig } from "./base.js";
import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";
import vitest from "eslint-plugin-vitest";

/**
 * Custom ESLint config for Next.js apps
 */
export const nextJsConfig = [
  ...baseConfig,

  js.configs.recommended,
  ...tseslint.configs.recommended,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts"
  ]),

  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker
      }
    }
  },

  {
    plugins: {
      "@next/next": pluginNext
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules
    }
  },

  {
    plugins: {
      "react-hooks": pluginReactHooks
    },
    settings: { react: { version: "detect" }, "import/resolver": {"typescript": {}}},
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off"
    }
  },

  {
    files: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/*.test.[jt]s?(x)",
      "**/*.spec.[jt]s?(x)"
    ],
    plugins: {
      "testing-library": testingLibrary,
      "jest-dom": jestDom,
      "vitest": vitest
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...vitest.environments.env.globals // ✅ recognize test, expect, vi, etc.
      }
    },
    rules: {
      // ✅ Testing Library Best Practices
      ...testingLibrary.configs["react"].rules,

      // ✅ Jest-DOM Assertions
      ...jestDom.configs.recommended.rules,

      // ✅ Vitest Best Practices
      ...vitest.configs.recommended.rules
    }
  },

  // MUST BE LAST
  eslintConfigPrettier
];
