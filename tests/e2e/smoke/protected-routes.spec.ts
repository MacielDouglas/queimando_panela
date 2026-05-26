import { expect, test } from '@playwright/test';

test.describe('Rotas protegidas', () => {
  test('redireciona usuário não autenticado ao acessar nova receita', async ({
    page,
  }) => {
    await page.goto('/receitas/new');

    await expect(page).toHaveURL(/\/login/i);
  });
});
