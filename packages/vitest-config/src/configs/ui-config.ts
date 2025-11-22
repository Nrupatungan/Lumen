import { defineConfig } from "vitest/config";

export const uiConfig = defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      reporter: [
        [
          "json",
          {
            file: "../coverage.json",
          },
        ],
      ],
      enabled: true,
    },
  },
});
