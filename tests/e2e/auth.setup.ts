import {
  expect,
  test as setup,
  request,
  type Locator,
  type Page,
} from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

async function resolveEmailInput(page: Page): Promise<Locator> {
  const candidates = [
    page.getByRole('textbox', { name: /e-mail|email/i }),
    page.getByLabel(/e-mail|email/i),
    page.getByPlaceholder(/e-mail|email/i),
    page.locator('input[type="email"]'),
    page.locator('input[name="email"]'),
  ];

  for (const locator of candidates) {
    if (
      await locator
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      return locator.first();
    }
  }

  throw new Error(
    'Não foi possível localizar o campo de e-mail na página de login.',
  );
}

async function resolvePasswordInput(page: Page): Promise<Locator> {
  const candidates = [
    page.getByLabel(/senha|password/i),
    page.getByPlaceholder(/senha|password/i),
    page.locator('input[type="password"]'),
    page.locator('input[name="password"]'),
  ];

  for (const locator of candidates) {
    if (
      await locator
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      return locator.first();
    }
  }

  throw new Error(
    'Não foi possível localizar o campo de senha na página de login.',
  );
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/login/i);

  const emailInput = await resolveEmailInput(page);
  const passwordInput = await resolvePasswordInput(page);

  await emailInput.fill(email);
  await passwordInput.fill(password);

  const submitButton = page.getByRole('button', {
    name: /entrar|login|acessar/i,
  });

  await expect(submitButton).toBeVisible({ timeout: 10_000 });

  // Espera um sinal concreto: sair da página de login OU aparecer algo típico do app autenticado
  await Promise.all([
    page
      .waitForURL((url) => !/\/login/i.test(url.pathname + url.search), {
        timeout: 15_000,
      })
      .catch(() => null),
    submitButton.click(),
  ]);
}

setup('authenticate user', async ({ page, baseURL }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;
  const name = process.env.E2E_USER_NAME ?? 'E2E User';

  if (!email || !password) {
    throw new Error(
      'Defina E2E_USER_EMAIL e E2E_USER_PASSWORD nas variáveis de ambiente.',
    );
  }

  // Tenta logar diretamente
  await signIn(page, email, password);

  // Se ainda estiver na tela de login, tenta criar usuário e logar de novo
  const stillOnLogin = /\/login/i.test(new URL(page.url()).pathname);
  if (stillOnLogin) {
    const api = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });

    const signUpResponse = await api.post('/api/auth/sign-up/email', {
      data: { email, password, name },
    });

    if (!signUpResponse.ok()) {
      const responseText = await signUpResponse.text();
      const alreadyExists =
        signUpResponse.status() === 409 ||
        /already exists|user already exists|duplicate|exists/i.test(
          responseText,
        );

      if (!alreadyExists) {
        throw new Error(
          `Falha ao criar usuário E2E: ${signUpResponse.status()} - ${responseText}`,
        );
      }
    }

    await signIn(page, email, password);
  }

  // Última validação: o login não pode continuar na rota /login
  await expect(page).not.toHaveURL(/\/login/i);

  // Salva estado
  await page.context().storageState({ path: authFile });
});
