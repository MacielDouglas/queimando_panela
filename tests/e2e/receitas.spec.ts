import { expect, test } from '@playwright/test';

const AUTH_STATE = 'tests/e2e/playwright/.auth/user.json';

const mockAnalyzeResponse = {
  data: {
    title: 'Bolo de milho da minha avó (revisado)',
    summary:
      'Fofinho, amanteigado e com cheirinho de fazenda — vai perfumar a cozinha inteira.',
    difficulty: 'EASY' as const,
    difficultyLabel: 'Fácil',
    types: ['Sobremesa', 'Clássico brasileiro', 'Forno'],
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    suggestions:
      'Substitua manteiga por óleo se quiser.\n\nAtenção ao açúcar: use menos se preferir menos doce.\n\nSirva com café coado na hora.',
    nutritionSummary: 'Receita rica em carboidratos e moderada em gorduras.',
    nutritionPer100g: [
      { nutrient: 'Valor energético (kcal)', quantity: '320 kcal' },
      { nutrient: 'Carboidratos', quantity: '45,0 g' },
      { nutrient: 'Açúcares', quantity: '20,0 g' },
      { nutrient: 'Proteínas', quantity: '5,0 g' },
      { nutrient: 'Gorduras totais', quantity: '12,0 g' },
      { nutrient: 'Gorduras saturadas', quantity: '6,0 g' },
      { nutrient: 'Colesterol', quantity: '30 mg' },
      { nutrient: 'Cálcio', quantity: '40 mg' },
      { nutrient: 'Fibras', quantity: '2,0 g' },
      { nutrient: 'Ferro', quantity: '1,2 mg' },
      { nutrient: 'Sódio', quantity: '80 mg' },
    ],
    utensils: ['Forma', 'Liquidificador', 'Forno'],
    sections: [
      {
        name: 'Receita',
        ingredients: [
          { originalText: '3 ovos', name: 'ovos', generalName: 'ovo' },
          {
            originalText: '1 xícara de milho verde',
            name: 'milho verde',
            generalName: 'milho',
          },
          {
            originalText: '1 xícara de leite',
            name: 'leite',
            generalName: 'leite',
          },
        ],
        modeOfPreparation:
          '1. Bata tudo no liquidificador.\n2. Despeje na forma untada.\n3. Asse por 35 minutos a 180°C.',
      },
    ],
  },
};

test.describe('Queimando Panela — E2E', () => {
  test('home carrega com hero e navegação', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(
      page.getByRole('link', { name: /queimando/i }).first(),
    ).toBeVisible();

    await expect(page.getByText(/queimando panela/i).first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: /ver receitas/i }).first(),
    ).toBeVisible();

    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('lista /receitas carrega com grid, busca e filtros', async ({
    page,
  }) => {
    await page.goto('/receitas');

    await expect(page).toHaveURL(/\/receitas/);
    await expect(
      page.getByRole('heading', { name: /receitas para.*aquecer/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('searchbox', { name: /pesquisar receitas/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /^buscar$/i })).toBeVisible();

    await expect(page.getByText(/filtros queimando panela/i)).toBeVisible();
    await expect(page.getByText(/^categoria$/i)).toBeVisible();

    await expect(
      page.getByText(/todas as receitas|resultados para/i).first(),
    ).toBeVisible();

    const grid = page.locator('a[href^="/receitas/"]');
    const empty = page.getByText(/nenhuma receita encontrada/i);
    await expect(grid.first().or(empty)).toBeVisible({ timeout: 15_000 });
  });

  test('busca por termo via ?q funciona', async ({ page }) => {
    await page.goto('/receitas?q=Bolo');

    await expect(page).toHaveURL(/q=Bolo/);
    await expect(page.getByText(/resultados para "Bolo"/i)).toBeVisible();
    await expect(
      page.getByRole('searchbox', { name: /pesquisar receitas/i }),
    ).toHaveValue('Bolo');
  });

  test('filtros por categoria/dificuldade alteram URL e conteúdo', async ({
    page,
  }) => {
    await page.goto('/receitas');

    const categoriaLink = page.locator('a[href*="categoria="]').first();
    if (await categoriaLink.isVisible().catch(() => false)) {
      const href = await categoriaLink.getAttribute('href');
      await categoriaLink.click();
      await expect(page).toHaveURL(/categoria=/);
      if (href) {
        await expect(page).toHaveURL(
          new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 30)),
        );
      }
      await expect(
        page.getByRole('link', { name: /limpar filtros/i }),
      ).toBeVisible();
    } else {
      await page.goto('/receitas?dificuldade=EASY');
      await expect(page).toHaveURL(/dificuldade=EASY/);
      await expect(
        page.getByRole('link', { name: /limpar filtros/i }),
      ).toBeVisible();
    }

    const tipoLink = page.locator('a[href*="tipo="]').first();
    if (await tipoLink.isVisible().catch(() => false)) {
      await tipoLink.click();
      await expect(page).toHaveURL(/tipo=/);
    }

    const nextLink = page.getByRole('link', { name: /próxima/i });
    if (await nextLink.isVisible().catch(() => false)) {
      const href = await nextLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('detalhe /receitas/[slug] carrega quando há receitas', async ({
    page,
  }) => {
    await page.goto('/receitas');

    const firstCardLink = page.locator('a[href^="/receitas/"]').first();
    const empty = page.getByText(/nenhuma receita encontrada/i);

    if (await empty.isVisible().catch(() => false)) {
      test.skip(true, 'Sem receitas no banco — detalhe não testável');
      return;
    }

    await expect(firstCardLink).toBeVisible({ timeout: 15_000 });
    const href = await firstCardLink.getAttribute('href');
    expect(href).toMatch(/^\/receitas\//);

    await firstCardLink.click();
    await expect(page).toHaveURL(/\/receitas\/.+/);

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText(/receita de/i).first()).toBeVisible();

    const img = page.locator('img').first();
    const noImage = page.getByText(/sem imagem/i);
    await expect(img.or(noImage)).toBeVisible({ timeout: 10_000 });

    await page.goto('/receitas/slug-que-nao-existe-xyz-123');
    await expect(page.getByText(/não encontrada|404/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });
});

test.describe('rota protegida /receitas/new — visitante', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('redireciona visitante deslogado para /login', async ({ page }) => {
    await page.goto('/receitas/new');

    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
    await expect(
      page.getByRole('heading', { name: /queimando panela/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/e-mail/i)).toBeVisible();
  });
});

test.describe('rota protegida /receitas/new — autenticado', () => {
  test.use({ storageState: AUTH_STATE });

  test('fluxo criar receita com IA — preenche form, analisa e revisa (mock)', async ({
    page,
  }) => {
    await page.goto('/receitas/new');
    await page.waitForLoadState('networkidle');

    if (page.url().includes('/login')) {
      test.skip(
        true,
        'Sem sessão autenticada — defina E2E_USER_EMAIL/PASSWORD e rode o projeto setup',
      );
      return;
    }

    await expect(
      page.getByRole('heading', { name: /compartilhe sua receita/i }),
    ).toBeVisible({ timeout: 15_000 });

    await page.route('**/api/recipes/analyze', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAnalyzeResponse),
      });
    });

    await page.getByLabel(/título da receita/i).fill('Bolo de milho teste E2E');
    await page
      .getByLabel(/história da receita/i)
      .fill('Memória de infância na fazenda da avó.');

    const ingredientesField = page.getByPlaceholder(/ingredientes/i).first();
    const modoField = page.getByPlaceholder(/modo de preparo/i).first();

    if (await ingredientesField.isVisible().catch(() => false)) {
      await ingredientesField.fill(
        '3 ovos\n1 xícara de milho\n1 xícara de leite',
      );
    } else {
      const textboxes = page.getByRole('textbox');
      await textboxes
        .nth(2)
        .fill('3 ovos\n1 xícara de milho\n1 xícara de leite');
    }

    if (await modoField.isVisible().catch(() => false)) {
      await modoField.fill('1. Bata no liquidificador.\n2. Asse por 35 min.');
    } else {
      const textboxes = page.getByRole('textbox');
      await textboxes
        .nth(3)
        .fill('1. Bata no liquidificador.\n2. Asse por 35 min.');
    }

    await page
      .getByRole('button', { name: /analisar receita com ia/i })
      .click();

    await expect(page.getByText(/revisão final/i)).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByText(/análise da ia.*edite antes de salvar/i),
    ).toBeVisible();

    await expect(
      page.getByLabel(/bolo de milho da minha avó/i).first(),
    ).toBeVisible();
    await expect(page.getByText(/sugestões de substituição/i)).toBeVisible();
    await expect(page.getByText(/tabela nutricional/i)).toBeVisible();

    await expect(
      page.getByRole('button', { name: /salvar receita/i }),
    ).toBeEnabled();

    await expect(page.getByLabel(/forma/i).first()).toBeVisible();

    await page.unroute('**/api/recipes/analyze');
  });

  test('validação do form — título curto bloqueia análise', async ({
    page,
  }) => {
    await page.goto('/receitas/new');
    await page.waitForLoadState('networkidle');

    if (page.url().includes('/login')) {
      test.skip(true, 'Sem sessão — pule validação autenticada');
      return;
    }

    await page.getByLabel(/título da receita/i).fill('ab');
    await page
      .getByRole('button', { name: /analisar receita com ia/i })
      .click();

    await expect(page.getByText(/ao menos 3 caracteres/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/revisão final/i)).not.toBeVisible();
  });
});
