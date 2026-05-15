import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
// import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/unit/**/*.test.ts',
      'tests/integration/**/*.test.ts',
      'tests/components/**/*.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './test-results/coverage',
      include: [
        'src/features/**/*.ts',
        'src/features/**/*.tsx',
        'src/lib/**/*.ts',
        'src/server/**/*.ts',
      ],
      exclude: [
        'src/generated/**',
        'src/lib/prisma.ts',
        'src/lib/auth.ts',
        'src/lib/auth-client.ts',
        'src/lib/use-auth.ts',
        'src/lib/get-server-session.ts',
        'src/lib/__mocks__/**',
        'src/features/**/types/**',
        'src/server/ai/groq/types.ts',
      ],
      thresholds: {
        statements: 80,
        lines: 80,
        functions: 80,
        branches: 67,
        'src/features/recipes/components/**/*.tsx': {
          statements: 80,
          lines: 80,
          functions: 80,
          branches: 70,
        },
        'src/features/recipes/actions/**/*.ts': {
          statements: 85,
          lines: 85,
          functions: 90,
          branches: 70,
        },
      },
    },
  },
});
