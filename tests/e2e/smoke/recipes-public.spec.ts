import { expect, test } from '@playwright/test';

test.describe('Receitas públicas', () => {
  test('carrega a listagem e permite pesquisar', async ({ page }) => {
    await page.goto('/receitas');

    await expect(
      page.getByRole('heading', {
        name: /Receitas para aquecer o coração e a cozinha/i,
      }),
    ).toBeVisible();

    const searchInput = page.getByRole('searchbox', {
      name: /Pesquisar receitas/i,
    });

    await searchInput.fill('bolo');
    await page.getByRole('button', { name: /Buscar/i }).click();

    await expect(page).toHaveURL(/\/receitas\?q=bolo/i);
    await expect(page.getByRole('main')).toBeVisible();
  });
});
