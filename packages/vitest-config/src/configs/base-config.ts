import { defineConfig } from 'vitest/config';

export const baseConfig = defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: [
        [
          'json',
          {
            file: '../coverage.json',
          },
        ],
      ],
      enabled: true,
    },
  },
});
