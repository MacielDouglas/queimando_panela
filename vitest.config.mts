import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
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
        // Inicialização e clientes — sem lógica testável
        'src/lib/prisma.ts',
        'src/lib/auth.ts',
        'src/lib/auth-client.ts',
        'src/lib/use-auth.ts',
        'src/lib/get-server-session.ts',
        'src/lib/__mocks__/**',
        // Apenas tipos
        'src/features/**/types/**',
        'src/server/ai/groq/types.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
      },
    },
  },
});
