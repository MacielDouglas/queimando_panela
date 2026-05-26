import { expect, test } from '@playwright/test';

test.describe.serial('Receita autenticada - create + update', () => {
  const createdTitle = `Receita E2E ${Date.now()}`;
  const updatedTitle = `${createdTitle} Atualizada`;
  let createdSlug = '';

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/recipes/analyze', async (route) => {
      const request = route.request();
      const body = request.postDataJSON() as {
        title?: string;
        sections?: Array<{
          name?: string;
          ingredientsText?: string;
          modeOfPreparation?: string;
        }>;
      };

      const requestedTitle = body?.title?.trim() || createdTitle;
      const firstSection = body?.sections?.[0];

      const ingredients = firstSection?.ingredientsText
        ?.split('\n')
        .map((item) => item.trim())
        .filter(Boolean) ?? ['2 ovos', '1 xícara de açúcar'];

      const modeOfPreparation =
        firstSection?.modeOfPreparation?.trim() || 'Misture tudo e asse.';

      const sectionName = firstSection?.name?.trim() || 'Receita';

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            title: requestedTitle,
            summary: 'Resumo E2E',
            difficulty: 'EASY',
            difficultyLabel: 'Fácil',
            types: ['Bolo'],
            prepTimeMinutes: 10,
            cookTimeMinutes: 20,
            suggestions: 'Sugestão E2E',
            nutritionSummary: 'Resumo nutricional E2E',
            nutritionPer100g: [{ nutrient: 'Calorias', quantity: '100 kcal' }],
            utensils: ['Tigela'],
            sections: [{ name: sectionName, ingredients, modeOfPreparation }],
          },
        }),
      });
    });
  });

  test('cria uma nova receita com sucesso', async ({ page }) => {
    await page.goto('/receitas/new');

    await expect(page).toHaveURL(/\/receitas\/new/);
    await expect(
      page.getByRole('heading', { name: /compartilhe sua receita/i }),
    ).toBeVisible();

    await page.getByLabel(/título/i).fill(createdTitle);

    const textareas = page.locator('textarea');
    await expect(textareas).toHaveCount(3);

    await textareas
      .nth(0)
      .fill('Receita criada automaticamente via Playwright.');
    await textareas
      .nth(1)
      .fill('2 ovos\n1 xícara de açúcar\n1 xícara de farinha');
    await textareas
      .nth(2)
      .fill('Misture os ingredientes e asse por 20 minutos.');

    await page
      .getByRole('button', { name: /analisar receita com ia/i })
      .click();

    await expect(
      page.getByRole('heading', { name: /revisão final/i }),
    ).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /salvar receita/i }).click();

    await page.waitForURL(/\/receitas$/i, { timeout: 20_000 });
    await expect(page).toHaveURL(/\/receitas$/i);

    // Título pode aparecer em múltiplos headings — usamos o primeiro
    await expect(
      page.getByRole('heading', { name: createdTitle }).first(),
    ).toBeVisible({ timeout: 10_000 });

    createdSlug = slugify(createdTitle);
  });

  test('edita a receita criada com sucesso', async ({ page }) => {
    test.skip(!createdSlug, 'Receita não foi criada no passo anterior.');

    await page.goto(`/receitas/${createdSlug}/editar`);

    await expect(page).toHaveURL(
      new RegExp(`/receitas/${createdSlug}/editar$`),
    );
    await expect(
      page.getByRole('heading', {
        name: new RegExp(`editar: ${escapeRegex(createdTitle)}`, 'i'),
      }),
    ).toBeVisible();

    const titleInput = page.getByLabel(/título/i);
    await expect(titleInput).toBeVisible();
    await titleInput.fill(updatedTitle);

    const textareas = page.locator('textarea');
    await expect(textareas.first()).toBeVisible();

    await textareas
      .nth(0)
      .fill('Receita atualizada automaticamente via Playwright.');

    await page
      .getByRole('button', { name: /reanalisar receita com ia/i })
      .click();

    await expect(
      page.getByRole('heading', { name: /revisão final/i }),
    ).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /salvar alterações/i }).click();

    await page.waitForURL(new RegExp(`/receitas/${createdSlug}$`), {
      timeout: 20_000,
    });

    await expect(page).toHaveURL(new RegExp(`/receitas/${createdSlug}$`));
    await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 10_000 });
  });
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
