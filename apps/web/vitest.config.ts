import { uiConfig } from "@repo/vitest-config/ui";
import { mergeConfig } from "vitest/config";
import path from "path";

export default mergeConfig(uiConfig, {
  test: {
    setupFiles: "./tests/setup.ts",
    include: ["./**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
