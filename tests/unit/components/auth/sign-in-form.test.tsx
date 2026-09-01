import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
    },
  },
}));

import { SignInForm } from '@/components/auth/sign-in-form';
import { authClient } from '@/lib/auth-client';

describe('SignInForm (components/auth)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza os campos de email e senha', () => {
    render(<SignInForm />);

    expect(screen.getByPlaceholderText('voce@exemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
  });

  it('renderiza o botão "Entrar"', () => {
    render(<SignInForm />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('renderiza link "Esqueci minha senha"', () => {
    render(<SignInForm />);
    expect(
      screen.getByRole('link', { name: /esqueci minha senha/i }),
    ).toHaveAttribute('href', '/forgot-password');
  });

  it('faz login com sucesso', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.signIn.email).mockResolvedValue({ error: null });

    render(<SignInForm />);

    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.type(
      screen.getByPlaceholderText('Digite sua senha'),
      '12345678',
    );
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith(
        {
          email: 'teste@email.com',
          password: '12345678',
          callbackURL: '/',
        },
        expect.objectContaining({ onError: expect.any(Function) }),
      );
    });
  });

  it('exibe erro da API via onError callback', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.signIn.email).mockImplementation(
      async (_values: any, opts: any) => {
        opts.onError({ error: { message: 'Credenciais inválidas.' } });
        return { error: { message: 'Credenciais inválidas.' } };
      },
    );

    render(<SignInForm />);

    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.type(
      screen.getByPlaceholderText('Digite sua senha'),
      '12345678',
    );
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText('Credenciais inválidas.'),
    ).toBeInTheDocument();
  });

  it('exibe mensagem padrão quando API retorna erro sem message', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.signIn.email).mockImplementation(
      async (_values: any, opts: any) => {
        opts.onError({ error: {} });
        return { error: {} };
      },
    );

    render(<SignInForm />);

    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.type(
      screen.getByPlaceholderText('Digite sua senha'),
      '12345678',
    );
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText('Não foi possível entrar.'),
    ).toBeInTheDocument();
  });

  it('exibe erro do result.error.message quando não usa callback', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      error: { message: 'Token expirado.' },
    });

    render(<SignInForm />);

    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.type(
      screen.getByPlaceholderText('Digite sua senha'),
      '12345678',
    );
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('Token expirado.')).toBeInTheDocument();
  });
});
