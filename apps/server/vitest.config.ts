import { baseConfig } from '@repo/vitest-config/base';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(baseConfig, {
  test: {
    hookTimeout: 180000, // 2 minutes
    testTimeout: 180000,
  },
});
