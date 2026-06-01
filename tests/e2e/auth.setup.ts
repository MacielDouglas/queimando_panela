import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, 'playwright/.auth/user.json');

setup('autenticar usuário e salvar sessão', async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Variáveis E2E_USER_EMAIL e E2E_USER_PASSWORD não encontradas no .env',
    );
  }

  await page.goto('/');

  // Aguarda redirecionamento para a página de login caso o usuário não esteja autenticado
  // Ajuste o seletor conforme o seu formulário de login (better-auth)
  await page
    .waitForURL(/login|sign-in|signin/, { timeout: 10_000 })
    .catch(() => {
      // Se não redirecionar, pode já estar na home — navegue explicitamente
    });

  // Caso a URL não tenha mudado, navegue manualmente para o login
  if (!page.url().includes('login') && !page.url().includes('sign-in')) {
    await page.goto('/login');
  }

  await page.getByLabel(/e-?mail/i).fill(email);
  await page.getByLabel(/senha|password/i).fill(password);
  await page.getByRole('button', { name: /entrar|login|sign in/i }).click();

  // Confirma que o login foi bem-sucedido aguardando saída da página de auth
  await page.waitForURL((url) => !url.toString().includes('login'), {
    timeout: 15_000,
  });

  await expect(page).not.toHaveURL(/login|sign-in/);

  // Salva cookies + localStorage para reusar em todos os outros testes
  await page.context().storageState({ path: authFile });
});
