import { eslintConfigPrettier, js, globals, config as baseConfig } from "@repo/eslint-config/base"
import prettierPlugin from "eslint-plugin-prettier"

export default [
    ...baseConfig, // inherit shared rules
    eslintConfigPrettier,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: globals.node, // node environment globals
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            // --- ESLint rules for Node/Express ---
            indent: ["error", 2, { SwitchCase: 1 }],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "single"],
            semi: ["error", "always"],
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-console": "off", // useful in backend logs
            "prefer-const": "error",
            "no-var": "error",
            "object-shorthand": "error",
            "prefer-arrow-callback": "error",

            // --- Prettier integration ---
            "prettier/prettier": [
                "error",
                {
                    semi: true,
                    trailingComma: "es5",
                    singleQuote: true,
                    printWidth: 80,
                    tabWidth: 2,
                    useTabs: false,
                    bracketSpacing: true,
                    arrowParens: "avoid",
                    endOfLine: "lf",
                },
            ],
        },
    },
    {
        files: ["tests/**/*.js"],
        languageOptions: {
            globals: {
                describe: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                jest: "readonly",
            },
        },
    },
    {
        ignores: ["node_modules/**", "coverage/**", "logs/**"],
    },
];
