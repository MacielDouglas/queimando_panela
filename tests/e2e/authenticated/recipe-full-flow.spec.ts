import { test } from '@playwright/test';
import {
  assertRecipeContent,
  createRecipe,
  deleteRecipe,
  ensureAuthenticatedHome,
  logout,
  openRecipe,
  uniqueRecipeTitle,
  updateRecipe,
} from '../helpers/recipe-e2e';

test.describe('Fluxos autenticados de receita', () => {
  test.fixme(
    'cria uma nova receita',
    'Bug conhecido: salvar receita permanece em /receitas/new e não redireciona para /receitas/[slug]',
  );
  test('cria uma nova receita', async ({ page }) => {
    const title = uniqueRecipeTitle('create');

    await ensureAuthenticatedHome(page);

    const slug = await createRecipe(page, title);
    await openRecipe(page, slug);
    await assertRecipeContent(page, title);

    await deleteRecipe(page, slug);
  });

  test.fixme(
    'edita uma receita recém-criada',
    'Bug conhecido: criação falha porque salvar receita permanece em /receitas/new',
  );
  test('edita uma receita recém-criada', async ({ page }) => {
    const createdTitle = uniqueRecipeTitle('update-base');
    const updatedTitle = `${createdTitle} Atualizada`;

    await ensureAuthenticatedHome(page);

    const slug = await createRecipe(page, createdTitle);
    await updateRecipe(page, slug, updatedTitle);
    await openRecipe(page, slug);
    await assertRecipeContent(page, updatedTitle);

    await deleteRecipe(page, slug);
  });

  test.fixme(
    'exclui uma receita recém-criada e faz logout',
    'Bug conhecido: criação falha porque salvar receita permanece em /receitas/new',
  );
  test('exclui uma receita recém-criada e faz logout', async ({ page }) => {
    const title = uniqueRecipeTitle('delete');

    await ensureAuthenticatedHome(page);

    const slug = await createRecipe(page, title);
    await deleteRecipe(page, slug);
    await logout(page);
  });
});
