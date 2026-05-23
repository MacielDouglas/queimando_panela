import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['tests/setup/vitest.setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: [...configDefaults.exclude, 'tests/e2e/**', 'src/generated/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/app/api/auth/**',
        'src/generated/**',
        'src/**/*.d.ts',
        'src/**/*.types.ts',
        'src/features/recipes/types/**',
        'src/lib/prisma.ts',
        'src/lib/auth.ts',
        'src/lib/auth-client.ts',
        'src/lib/get-server-session.ts',
        'src/app/layout.tsx',
        'src/features/recipes/actions/update-recipe-copy.ts',
      ],
      thresholds: {
        lines: 75,
        functions: 72,
        statements: 75,
        branches: 57,
      },
    },
  },
});
