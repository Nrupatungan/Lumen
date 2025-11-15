import { uiConfig } from "@repo/vitest-config/ui";
import { mergeConfig } from "vitest/config";

export default mergeConfig(uiConfig, {
  test: {
    setupFiles: "./test/setup.ts",
  },
});
