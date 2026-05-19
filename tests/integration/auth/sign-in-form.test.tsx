import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const replace = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace,
    refresh,
  }),
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
      social: vi.fn(),
    },
  },
}));

import { authClient } from '@/lib/auth-client';
import { SignInForm } from '@/features/auth/components/SignInForm';

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza os campos do formulário', () => {
    render(<SignInForm />);

    expect(screen.getByPlaceholderText('voce@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('valida senha com menos de 8 caracteres', async () => {
    const user = userEvent.setup();

    render(<SignInForm />);

    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'teste@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '1234567');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText('A senha deve ter pelo menos 8 caracteres.'),
    ).toBeInTheDocument();
  });

  it('faz login com sucesso', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.email).mockResolvedValue({ error: null });

    render(<SignInForm />);

    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'teste@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email: 'teste@email.com',
        password: '12345678',
        callbackURL: '/',
      });
      expect(replace).toHaveBeenCalledWith('/');
      expect(refresh).toHaveBeenCalled();
    });
  });

  it('exibe erro retornado pela API no login por email', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.email).mockResolvedValue({
      error: { message: 'Credenciais inválidas.' },
    });

    render(<SignInForm />);

    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'teste@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText('Credenciais inválidas.'),
    ).toBeInTheDocument();
  });

  it('exibe erro inesperado quando signIn.email lança exceção', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.email).mockRejectedValue(
      new Error('Falha inesperada'),
    );

    render(<SignInForm />);

    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'teste@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText('Erro inesperado ao tentar entrar.'),
    ).toBeInTheDocument();
  });

  it('faz login social com Google', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.social).mockResolvedValue({ error: null });

    render(<SignInForm />);

    await user.click(
      screen.getByRole('button', { name: /continuar com google/i }),
    );

    await waitFor(() => {
      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider: 'google',
      });
    });
  });

  it('exibe erro inesperado ao entrar com Google', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.social).mockRejectedValue(
      new Error('Falha Google'),
    );

    render(<SignInForm />);

    await user.click(
      screen.getByRole('button', { name: /continuar com google/i }),
    );

    expect(
      await screen.findByText('Erro inesperado ao entrar com Google.'),
    ).toBeInTheDocument();
  });

  it('usa mensagem padrão quando a API retorna erro sem message', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.email).mockResolvedValue({
      error: {},
    } as Awaited<ReturnType<typeof authClient.signIn.email>>);

    render(<SignInForm />);

    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'teste@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível entrar.',
    );
  });
});
