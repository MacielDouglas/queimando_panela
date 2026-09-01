import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

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
        'src/lib/env/env.server.ts',
        'src/app/layout.tsx',
        'src/features/recipes/actions/update-recipe-copy.ts',
        'src/features/geladeira/**',
        'src/app/(public)/geladeira/**',
        'src/app/(public)/o-que-tem/**',
        'src/app/api/geladeira/**',
        'src/app/**/loading.tsx',
        'src/app/manifest.ts',
        'src/app/robots.ts',
        'src/app/sitemap.ts',
        'src/app/opengraph-image.tsx',
        'src/components/about/**',
        'src/app/(public)/sobre/**',
      ],
      thresholds: {
        lines: 63.9,
        functions: 60,
        statements: 63.5,
        branches: 53,
      },
    },
  },
});
