import { expect, test } from '@playwright/test';

test.describe('Login', () => {
  test('renderiza formulário de login', async ({ page }) => {
    await page.goto('/login');

    await expect(
      page.getByRole('heading', { name: /entrar|login/i }),
    ).toBeVisible();

    await expect(page.getByLabel(/e-mail|email/i)).toBeVisible();
    await expect(page.getByLabel(/senha/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });
});
