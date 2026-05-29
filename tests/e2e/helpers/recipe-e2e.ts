import { expect, type Page, type Route } from '@playwright/test';

export function uniqueRecipeTitle(suffix: string) {
  return `Receita E2E ${suffix} ${Date.now()}`;
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function ensureAuthenticatedHome(page: Page) {
  await page.goto('/');
  await expect(page).not.toHaveURL(/\/login/i);
}

export async function mockAnalyze(page: Page, fallbackTitle: string) {
  await page.unroute('**/api/recipes/analyze').catch(() => {});
  await page.route('**/api/recipes/analyze', async (route: Route) => {
    const body = route.request().postDataJSON() as {
      title?: string;
      sections?: Array<{
        name?: string;
        ingredientsText?: string;
        modeOfPreparation?: string;
      }>;
    };

    const requestedTitle = body?.title?.trim() || fallbackTitle;
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
}

export async function createRecipe(
  page: Page,
  title: string,
  description = 'Receita criada automaticamente via Playwright.',
) {
  await mockAnalyze(page, title);

  await page.goto('/receitas/new');
  await expect(page).toHaveURL(/\/receitas\/new$/i);
  await expect(
    page.getByRole('heading', { name: /compartilhe sua receita/i }),
  ).toBeVisible();

  await page.getByLabel(/título/i).fill(title);

  const textareas = page.locator('textarea');
  await expect(textareas.nth(0)).toBeVisible();
  await expect(textareas.nth(1)).toBeVisible();
  await expect(textareas.nth(2)).toBeVisible();

  await textareas.nth(0).fill(description);
  await textareas
    .nth(1)
    .fill('2 ovos\n1 xícara de açúcar\n1 xícara de farinha');
  await textareas.nth(2).fill('Misture os ingredientes e asse por 20 minutos.');

  await page.getByRole('button', { name: /analisar receita com ia/i }).click();

  await expect(
    page.getByRole('heading', { name: /revisão final/i }),
  ).toBeVisible({ timeout: 20_000 });

  const saveButton = page.getByRole('button', { name: /salvar receita/i });
  await expect(saveButton).toBeVisible({ timeout: 10_000 });
  await expect(saveButton).toBeEnabled({ timeout: 10_000 });

  await saveButton.click();

  const navigated = await expect
    .poll(() => new URL(page.url()).pathname, { timeout: 10_000 })
    .toMatch(/^\/receitas\/(?!new$)[^/?#]+\/?$/i)
    .then(() => true)
    .catch(() => false);

  if (!navigated) {
    const alert = page.getByRole('alert').first();
    const status = page.getByRole('status').first();
    const main = page.getByRole('main');

    const alertText = (await alert.textContent().catch(() => null))?.trim();
    const statusText = (await status.textContent().catch(() => null))?.trim();
    const mainText = (await main.textContent().catch(() => null))
      ?.trim()
      ?.slice(0, 1000);

    throw new Error(
      [
        'Salvar receita não saiu de /receitas/new.',
        `URL atual: ${page.url()}`,
        alertText ? `alert: ${alertText}` : null,
        statusText ? `status: ${statusText}` : null,
        mainText ? `main: ${mainText}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  const slug = new URL(page.url()).pathname.match(
    /^\/receitas\/(?!new$)([^/?#]+)\/?$/i,
  )?.[1];

  expect(slug).toBeTruthy();
  await expect(page.getByRole('main')).toBeVisible({ timeout: 10_000 });

  return slug!;
}

export async function openRecipe(page: Page, slug: string) {
  await page.goto(`/receitas/${slug}`);
  await expect(page).toHaveURL(
    new RegExp(`/receitas/${escapeRegex(slug)}/?$`, 'i'),
  );
  await expect(page.getByRole('main')).toBeVisible({ timeout: 10_000 });
}

export async function assertRecipeContent(page: Page, expectedTitle: string) {
  await expect(page.getByRole('main')).toContainText(expectedTitle, {
    timeout: 20_000,
  });
}

export async function updateRecipe(
  page: Page,
  slug: string,
  updatedTitle: string,
) {
  await mockAnalyze(page, updatedTitle);

  await page.goto(`/receitas/${slug}/editar`);
  await expect(page).toHaveURL(
    new RegExp(`/receitas/${escapeRegex(slug)}/editar/?$`, 'i'),
    { timeout: 20_000 },
  );

  await expect(
    page.getByText(/esse cheirinho não tava no cardápio/i),
  ).not.toBeVisible({ timeout: 10_000 });

  const titleInput = page
    .locator('#recipe-title')
    .or(page.getByLabel(/título/i))
    .first();

  await expect(titleInput).toBeVisible({ timeout: 10_000 });
  await titleInput.fill(updatedTitle);

  const textareas = page.locator('textarea');
  await expect(textareas.nth(0)).toBeVisible();
  await textareas
    .nth(0)
    .fill('Receita atualizada automaticamente via Playwright.');

  const reanalyzeButton = page.getByRole('button', {
    name: /reanalisar receita com ia/i,
  });

  if (await reanalyzeButton.isVisible().catch(() => false)) {
    await reanalyzeButton.click();
    await expect(
      page.getByRole('heading', { name: /revisão final/i }),
    ).toBeVisible({ timeout: 20_000 });
  }

  const saveChangesButton = page.getByRole('button', {
    name: /salvar alterações|salvar receita/i,
  });

  await expect(saveChangesButton).toBeVisible({ timeout: 10_000 });
  await saveChangesButton.click();

  await expect(page).toHaveURL(
    new RegExp(`/receitas/${escapeRegex(slug)}/?$`, 'i'),
    { timeout: 20_000 },
  );
}

export async function deleteRecipe(page: Page, slug: string) {
  await page.goto(`/receitas/${slug}`);

  const deleteButton = page.getByRole('button', { name: /excluir receita/i });
  await expect(deleteButton).toBeVisible({ timeout: 10_000 });
  await deleteButton.click();

  const confirmButton = page.getByRole('button', {
    name: /confirmar|excluir/i,
  });
  await expect(confirmButton).toBeVisible({ timeout: 10_000 });
  await confirmButton.click();

  await expect(page).toHaveURL(/\/receitas$/i, { timeout: 20_000 });

  await page.goto(`/receitas/${slug}`);
  await expect(
    page.getByText(/esse cheirinho não tava no cardápio/i),
  ).toBeVisible({ timeout: 10_000 });
}

export async function logout(page: Page) {
  await page.goto('/');

  const logoutButton = page.getByRole('button', { name: /sair|logout/i });
  const logoutLink = page.getByRole('link', { name: /sair|logout/i });

  if (await logoutButton.isVisible().catch(() => false)) {
    await logoutButton.click();
  } else if (await logoutLink.isVisible().catch(() => false)) {
    await logoutLink.click();
  } else {
    throw new Error('Não foi possível localizar o botão/link de logout.');
  }

  await expect(page).toHaveURL(/\/login|\/$/i);
}
