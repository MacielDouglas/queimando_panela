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
  await page.goto('/login');

  const emailInput = await resolveEmailInput(page);
  const passwordInput = await resolvePasswordInput(page);

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await page.getByRole('button', { name: /entrar|login|acessar/i }).click();
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

  await signIn(page, email, password);

  const loginError = page.getByText(
    /não foi possível entrar|erro inesperado|invalid password|senha|credenciais/i,
  );

  const loggedIn = await Promise.race([
    page
      .waitForURL(/\/$/, { timeout: 10_000 })
      .then(() => true)
      .catch(() => false),
    loginError
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => false)
      .catch(() => false),
  ]);

  if (!loggedIn) {
    const api = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });

    const signUpResponse = await api.post('/api/auth/sign-up/email', {
      data: {
        email,
        password,
        name,
      },
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
    await page.waitForURL(/\/$/, { timeout: 15_000 });
  }

  await expect(page).toHaveURL(/\/$/);
  await page.context().storageState({ path: authFile });
});
