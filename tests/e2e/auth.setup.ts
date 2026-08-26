import path from 'node:path';
import { expect, test as setup } from '@playwright/test';

const authFile = path.join(__dirname, 'playwright/.auth/user.json');

/**
 * Setup de autenticação — E2E
 *
 * - Tenta autenticar via better-auth API (`POST /api/auth/sign-in/email`)
 * - Fallback via UI (`/login`) se a API falhar
 * - Se `E2E_USER_EMAIL` / `E2E_USER_PASSWORD` não estiverem definidos, cria
 *   storageState vazio e pula (para CI sem secrets / dev local)
 * - Salva cookies + localStorage em `tests/e2e/playwright/.auth/user.json`
 *   consumido pelo projeto `chromium` em `playwright.config.ts:34`
 */
setup('authenticate', async ({ page, request }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

  // Sem credenciais → storage vazio (testes autenticados serão skip ou rodam como guest)
  if (!email || !password) {
    console.log(
      '[auth.setup] E2E_USER_EMAIL/PASSWORD não definidos — criando storageState vazio. ' +
        'Defina E2E_USER_EMAIL e E2E_USER_PASSWORD para testar fluxos autenticados.',
    );
    await page.context().storageState({ path: authFile });
    // Marca como skip visual no report, mas não falha o setup
    setup.skip(!email || !password, 'Credenciais E2E ausentes — storage vazio');
    return;
  }

  // ── Tentativa 1: API better-auth ──────────────────────────────────────
  // Endpoint exposto por `src/app/api/auth/[...all]/route.ts` → better-auth
  // POST /api/auth/sign-in/email { email, password }
  console.log(
    `[auth.setup] Tentando login via API para ${email} em ${baseURL}`,
  );
  const apiResponse = await request.post(`${baseURL}/api/auth/sign-in/email`, {
    data: { email, password },
    headers: { 'Content-Type': 'application/json' },
  });

  if (apiResponse.ok()) {
    // A API define cookies httpOnly; o `request` context já os guarda.
    // Precisamos transferir para o `page` context navegando uma vez.
    await page.goto('/');
    // Garante que o storage reflita a sessão autenticada
    await page.context().storageState({ path: authFile });

    // Validação leve: verifica que não fomos redirecionados para /login
    await page.goto('/receitas/new');
    // Se autenticado, /receitas/new renderiza editor; se não, redireciona /login
    const url = page.url();
    if (url.includes('/login')) {
      console.warn(
        '[auth.setup] API retornou 200 mas sessão não persistiu — tentando fallback UI',
      );
    } else {
      console.log('[auth.setup] Login via API bem-sucedido');
      return;
    }
  } else {
    const body = await apiResponse.text().catch(() => '');
    console.warn(
      `[auth.setup] API login falhou (${apiResponse.status()}): ${body.slice(0, 300)} — tentando UI`,
    );
  }

  // ── Tentativa 2: Fallback UI ──────────────────────────────────────────
  await page.goto('/login');
  await expect(
    page.getByRole('heading', { name: /queimando panela/i }),
  ).toBeVisible({ timeout: 15_000 });

  // AuthForm (login) usa inputs com label "E-mail" e "Senha"
  await page.getByLabel(/e-mail/i).fill(email);
  await page.getByLabel(/^senha$/i).fill(password);
  await page.getByRole('button', { name: /^entrar$/i }).click();

  // Aguarda navegação pós-login — better-auth redireciona para "/"
  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 20_000,
  });
  await expect(page).not.toHaveURL(/\/login/);

  await page.context().storageState({ path: authFile });
  console.log(
    '[auth.setup] Login via UI bem-sucedido — storageState salvo em',
    authFile,
  );
});
