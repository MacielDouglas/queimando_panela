import { expect, test } from '@playwright/test';

// Mock minimalista para POST /api/recipes/analyze
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
  // ─── Home ──────────────────────────────────────────────────────────────
  test('home carrega com hero e navegação', async ({ page }) => {
    await page.goto('/');

    // Header visível e logo
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(
      page.getByRole('link', { name: /queimando/i }).first(),
    ).toBeVisible();

    // Hero — título principal ou fallback quando sem receita em destaque
    await expect(page.getByText(/queimando panela/i).first()).toBeVisible();
    // CTA principais da home
    await expect(
      page.getByRole('link', { name: /ver receitas/i }).first(),
    ).toBeVisible();

    // Footer deve existir
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  // ─── Lista /receitas ─────────────────────────────────────────────────
  test('lista /receitas carrega com grid, busca e filtros', async ({
    page,
  }) => {
    await page.goto('/receitas');

    await expect(page).toHaveURL(/\/receitas/);
    await expect(
      page.getByRole('heading', { name: /receitas para.*aquecer/i }),
    ).toBeVisible();

    // Faixa de busca
    await expect(
      page.getByRole('searchbox', { name: /pesquisar receitas/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /^buscar$/i })).toBeVisible();

    // Sidebar de filtros
    await expect(page.getByText(/filtros queimando panela/i)).toBeVisible();
    await expect(page.getByText(/^categoria$/i)).toBeVisible();

    // Grid header "Todas as receitas" ou "Resultados para"
    await expect(
      page.getByText(/todas as receitas|resultados para/i).first(),
    ).toBeVisible();

    // Ao menos um estado: grid com cards OU empty state "Nenhuma receita"
    const grid = page.locator('a[href^="/receitas/"]');
    const empty = page.getByText(/nenhuma receita encontrada/i);
    await expect(grid.first().or(empty)).toBeVisible({ timeout: 15_000 });
  });

  test('busca por termo via ?q funciona', async ({ page }) => {
    await page.goto('/receitas?q=Bolo');

    await expect(page).toHaveURL(/q=Bolo/);
    await expect(page.getByText(/resultados para "Bolo"/i)).toBeVisible();
    // Input deve refletir o termo
    await expect(
      page.getByRole('searchbox', { name: /pesquisar receitas/i }),
    ).toHaveValue('Bolo');
  });

  test('filtros por categoria/dificuldade alteram URL e conteúdo', async ({
    page,
  }) => {
    await page.goto('/receitas');

    // Pega primeira categoria disponível (ex: link chip com href ?categoria=...)
    const categoriaLink = page.locator('a[href*="categoria="]').first();
    if (await categoriaLink.isVisible().catch(() => false)) {
      const href = await categoriaLink.getAttribute('href');
      await categoriaLink.click();
      await expect(page).toHaveURL(/categoria=/);
      // Verifica que o href clicado bate com a URL atual
      if (href)
        await expect(page).toHaveURL(
          new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 30)),
        );
      // Botão "Limpar filtros" aparece quando há filtro ativo
      await expect(
        page.getByRole('link', { name: /limpar filtros/i }),
      ).toBeVisible();
    } else {
      // Fallback: navega direto com query de dificuldade
      await page.goto('/receitas?dificuldade=EASY');
      await expect(page).toHaveURL(/dificuldade=EASY/);
      await expect(
        page.getByRole('link', { name: /limpar filtros/i }),
      ).toBeVisible();
    }

    // Toggle multi-param (tipo) — se houver
    const tipoLink = page.locator('a[href*="tipo="]').first();
    if (await tipoLink.isVisible().catch(() => false)) {
      await tipoLink.click();
      await expect(page).toHaveURL(/tipo=/);
    }

    // Paginação preserva filtros (se houver mais de 1 página)
    const nextLink = page.getByRole('link', { name: /próxima/i });
    if (await nextLink.isVisible().catch(() => false)) {
      const href = await nextLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  // ─── Detalhe da receita ──────────────────────────────────────────────
  test('detalhe /receitas/[slug] carrega quando há receitas', async ({
    page,
  }) => {
    await page.goto('/receitas');

    const firstCardLink = page.locator('a[href^="/receitas/"]').first();
    const empty = page.getByText(/nenhuma receita encontrada/i);

    // Se não há receitas no banco de teste, pula gracefully
    if (await empty.isVisible().catch(() => false)) {
      test.skip(true, 'Sem receitas no banco — detalhe não testável');
      return;
    }

    await expect(firstCardLink).toBeVisible({ timeout: 15_000 });
    const href = await firstCardLink.getAttribute('href');
    expect(href).toMatch(/^\/receitas\//);

    await firstCardLink.click();
    await expect(page).toHaveURL(/\/receitas\/.+/);

    // Hero do detalhe: título h1, badges de tipo/dificuldade, tempo, autor
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText(/receita de/i).first()).toBeVisible();

    // Se for receita sem imagem, fallback "Sem imagem"
    // Caso contrário imagem deve estar visível — aceita ambos
    const img = page.locator('img').first();
    const noImage = page.getByText(/sem imagem/i);
    await expect(img.or(noImage)).toBeVisible({ timeout: 10_000 });

    // 404 para slug inexistente
    await page.goto('/receitas/slug-que-nao-existe-xyz-123');
    await expect(page.getByText(/não encontrada|404/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  // ─── Auth guard: /receitas/new ───────────────────────────────────────
  test.describe('rota protegida /receitas/new', () => {
    // Este bloco usa storageState vazio para simular visitante deslogado
    test.use({ storageState: { cookies: [], origins: [] } });

    test('redireciona visitante deslogado para /login', async ({ page }) => {
      await page.goto('/receitas/new');

      // Middleware/page faz redirect('/login') quando sem sessão
      await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
      await expect(
        page.getByRole('heading', { name: /queimando panela/i }),
      ).toBeVisible();
      await expect(page.getByLabel(/e-mail/i)).toBeVisible();
    });
  });

  // ─── Fluxo criar receita com IA (mockado) ────────────────────────────
  test('fluxo criar receita com IA — preenche form, analisa e revisa (mock)', async ({
    page,
  }) => {
    // Se storageState veio vazio (sem credenciais), pula
    // Detecta pela tentativa de acessar /receitas/new
    await page.goto('/receitas/new');

    if (page.url().includes('/login')) {
      test.skip(
        true,
        'Sem sessão autenticada — defina E2E_USER_EMAIL/PASSWORD e rode `npx playwright test --project setup`',
      );
      return;
    }

    await expect(
      page.getByRole('heading', { name: /compartilhe sua receita/i }),
    ).toBeVisible({ timeout: 15_000 });

    // Mock da API de IA — intercepta antes do clique em "Analisar"
    await page.route('**/api/recipes/analyze', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAnalyzeResponse),
      });
    });

    // Preenche título
    await page.getByLabel(/título da receita/i).fill('Bolo de milho teste E2E');
    // História opcional
    await page
      .getByLabel(/história da receita/i)
      .fill('Memória de infância na fazenda da avó.');

    // Seção única — ingredientes e modo de preparo
    // SectionField usa textarea sem label explícita; usa placeholder/ordem
    const ingredientesField = page.getByPlaceholder(/ingredientes/i).first();
    const modoField = page.getByPlaceholder(/modo de preparo/i).first();

    // Fallback: busca por textbox dentro da seção
    if (await ingredientesField.isVisible().catch(() => false)) {
      await ingredientesField.fill(
        '3 ovos\n1 xícara de milho\n1 xícara de leite',
      );
    } else {
      // Textarea sem placeholder — pega por role textbox
      const textboxes = page.getByRole('textbox');
      // 0: title, 1: story, 2: ingredientes, 3: modo
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

    // Clica "Analisar receita com IA"
    await page
      .getByRole('button', { name: /analisar receita com ia/i })
      .click();

    // Aguarda painel de revisão aparecer
    await expect(page.getByText(/revisão final/i)).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByText(/análise da ia.*edite antes de salvar/i),
    ).toBeVisible();

    // Campos do AiReviewPanel devem estar preenchidos com mock
    await expect(
      page.getByLabel(/bolo de milho da minha avó/i).first(),
    ).toBeVisible();
    await expect(page.getByText(/sugestões de substituição/i)).toBeVisible();
    await expect(page.getByText(/tabela nutricional/i)).toBeVisible();

    // Botão salvar deve estar habilitado
    await expect(
      page.getByRole('button', { name: /salvar receita/i }),
    ).toBeEnabled();

    // Verifica utensílios mockados renderizados
    await expect(page.getByLabel(/forma/i).first()).toBeVisible();

    // Não submete de verdade — apenas valida que o fluxo de IA funciona
    // Para teste real de criação, descomente e configure intercept de createRecipe:
    // await page.route('**/api/recipes**', ... ) + click salvar
    await page.unroute('**/api/recipes/analyze');
  });

  test('validação do form — título curto bloqueia análise', async ({
    page,
  }) => {
    await page.goto('/receitas/new');
    if (page.url().includes('/login')) {
      test.skip(true, 'Sem sessão — pule validação autenticada');
      return;
    }

    // Tenta analisar com título muito curto / vazio
    await page.getByLabel(/título da receita/i).fill('ab');
    await page
      .getByRole('button', { name: /analisar receita com ia/i })
      .click();

    // Deve mostrar erro de validação zod ("ao menos 3 caracteres") e NÃO chamar IA
    await expect(page.getByText(/ao menos 3 caracteres/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/revisão final/i)).not.toBeVisible();
  });
});
