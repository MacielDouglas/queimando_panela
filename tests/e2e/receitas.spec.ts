import { test, expect } from '@playwright/test';

test('fluxo completo de receitas', async ({ page }) => {
  const recipe = {
    titulo: `Sopa de Legumes Deliciosa ${Date.now()}`,
    tituloEditado: `Sopa de Legumes Deliciosa Editada ${Date.now()}`,
    historia:
      'Esta receita foi criada durante testes automatizados E2E do Queimando Panela.',
    ingredientes:
      '2 cenouras\n1 abobrinha\n1 cebola\n2 dentes de alho\nSal e pimenta a gosto\n1L de caldo de legumes',
    modoPreparo:
      '1. Refogue a cebola e o alho.\n2. Adicione os legumes cortados.\n3. Cubra com o caldo e cozinhe por 20 minutos.\n4. Tempere e sirva.',
  };

  let editUrl = '';

  await test.step('validar receita existente', async () => {
    await page.goto('/receitas/rolinho-crocante-de-abobrinha-e-mucarela');

    await expect(page).toHaveURL(
      /\/receitas\/rolinho-crocante-de-abobrinha-e-mucarela/,
    );

    await expect(
      page.getByRole('heading', {
        name: 'Rolinho Crocante de Abobrinha e Muçarela',
        level: 1,
      }),
    ).toBeVisible({ timeout: 15000 });
  });

  await test.step('abrir tela de nova receita', async () => {
    await page.goto('/receitas');

    const novaReceitaBtn = page
      .getByRole('button', { name: /enviar nova receita/i })
      .or(page.getByRole('link', { name: /enviar nova receita/i }))
      .first();

    await expect(novaReceitaBtn).toBeVisible({ timeout: 15000 });
    await novaReceitaBtn.click();

    await expect(page).toHaveURL(/\/receitas\/new/);
  });

  await test.step('preencher, analisar com IA e salvar', async () => {
    await page.getByLabel(/título da receita|título/i).fill(recipe.titulo);
    await page
      .getByLabel(/história da receita|história/i)
      .fill(recipe.historia);
    await page.getByLabel(/ingredientes/i).fill(recipe.ingredientes);
    await page.getByLabel(/modo de preparo/i).fill(recipe.modoPreparo);

    const btnIA = page.getByRole('button', {
      name: /analisar receita com ia|reanalisar receita com ia/i,
    });
    await expect(btnIA).toBeVisible();
    await btnIA.click();

    await expect(
      page.getByRole('heading', { name: /revisão final/i, level: 2 }),
    ).toBeVisible({ timeout: 30000 });

    const btnSalvar = page.getByRole('button', {
      name: /salvar receita|salvar/i,
    });
    await expect(btnSalvar).toBeVisible({ timeout: 10000 });
    await btnSalvar.click();

    await expect(page.getByText(/erro ao salvar a receita/i)).not.toBeVisible({
      timeout: 5000,
    });

    await expect(page).toHaveURL(/\/receitas$/, {
      timeout: 20000,
    });
  });

  page.on('console', (msg) => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));

  const erroSalvar = page.getByText(/erro ao salvar a receita/i);

  if (await erroSalvar.isVisible().catch(() => false)) {
    throw new Error('A aplicação exibiu erro ao salvar a receita.');
  }

  await test.step('abrir a receita recém-criada pela listagem', async () => {
    const verReceitaCompleta = page
      .getByRole('link', { name: /ver receita completa/i })
      .first();

    await expect(verReceitaCompleta).toBeVisible({ timeout: 20000 });
    await verReceitaCompleta.click();

    await expect(page).toHaveURL(/\/receitas\/[^/]+$/, { timeout: 15000 });
  });

  await test.step('capturar link de edição', async () => {
    const editarLink = page
      .getByRole('link', { name: /editar receita/i })
      .first();

    await expect(editarLink).toBeVisible({ timeout: 10000 });

    const href = await editarLink.getAttribute('href');
    expect(href).toBeTruthy();

    editUrl = href!;
  });

  await test.step('editar receita na revisão final', async () => {
    await page.goto(editUrl);

    await expect(page).toHaveURL(/\/receitas\/.+\/editar/);

    await expect(
      page.getByRole('heading', { name: /revisão final/i, level: 2 }),
    ).toBeVisible({ timeout: 10000 });

    const tituloInput = page.getByLabel(/título/i).last();
    await expect(tituloInput).toBeVisible({ timeout: 10000 });
    await tituloInput.fill(recipe.tituloEditado);

    const salvarAlteracoes = page.getByRole('button', {
      name: /salvar alterações|salvar receita/i,
    });

    await expect(salvarAlteracoes).toBeVisible({ timeout: 10000 });
    await salvarAlteracoes.click();

    await expect(page).toHaveURL(/\/receitas\/[^/]+$/, { timeout: 20000 });
  });

  await test.step('deletar receita editada', async () => {
    await expect(page).toHaveURL(/\/receitas\/[^/]+$/, { timeout: 10000 });

    const btnExcluir = page.getByRole('button', { name: /excluir receita/i });

    await expect(btnExcluir).toBeVisible({ timeout: 10000 });
    await btnExcluir.click();

    const modalTitle = page.getByRole('heading', {
      name: /excluir receita/i,
      level: 2,
    });
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    const btnConfirmar = page.getByRole('button', { name: /sim,\s*excluir/i });
    await expect(btnConfirmar).toBeVisible({ timeout: 5000 });
    await btnConfirmar.click();

    await expect(page).toHaveURL(/\/receitas$/, { timeout: 15000 });
  });
});
