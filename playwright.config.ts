import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    // Projeto de setup: faz login e salva o estado de autenticação
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    // Testes rodando com sessão autenticada salva
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'bun run start',
    url: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
