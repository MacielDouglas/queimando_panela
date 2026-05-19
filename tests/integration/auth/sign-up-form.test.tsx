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
    signUp: {
      email: vi.fn(),
    },
    signIn: {
      social: vi.fn(),
    },
  },
}));

import { authClient } from '@/lib/auth-client';
import { SignUpForm } from '@/features/auth/components/SignUpForm';

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza os campos do formulário', () => {
    render(<SignUpForm />);

    expect(screen.getByPlaceholderText('Seu nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('voce@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('valida senha com menos de 8 caracteres', async () => {
    const user = userEvent.setup();

    render(<SignUpForm />);

    await user.type(screen.getByPlaceholderText('Seu nome'), 'Douglas');
    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'douglas@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '1234567');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(
      await screen.findByText('A senha deve ter pelo menos 8 caracteres.'),
    ).toBeInTheDocument();
  });

  it('cria conta com sucesso', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signUp.email).mockResolvedValue({ error: null });

    render(<SignUpForm />);

    await user.type(screen.getByPlaceholderText('Seu nome'), 'Douglas');
    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'douglas@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith({
        name: 'Douglas',
        email: 'douglas@email.com',
        password: '12345678',
      });
      expect(replace).toHaveBeenCalledWith('/');
      expect(refresh).toHaveBeenCalled();
    });
  });

  it('exibe erro retornado pela API', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signUp.email).mockResolvedValue({
      error: { message: 'E-mail já cadastrado.' },
    });

    render(<SignUpForm />);

    await user.type(screen.getByPlaceholderText('Seu nome'), 'Douglas');
    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'douglas@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(
      await screen.findByText('E-mail já cadastrado.'),
    ).toBeInTheDocument();
  });
  it('exibe erro inesperado quando signUp.email lança exceção', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signUp.email).mockRejectedValue(
      new Error('Falha inesperada'),
    );

    render(<SignUpForm />);

    await user.type(screen.getByPlaceholderText('Seu nome'), 'Douglas');
    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'douglas@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(
      await screen.findByText('Erro inesperado ao criar conta.'),
    ).toBeInTheDocument();
  });

  it('chama login social com Google no cadastro', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.social).mockResolvedValue({ error: null });

    render(<SignUpForm />);

    await user.click(
      screen.getByRole('button', { name: /continuar com google/i }),
    );

    await waitFor(() => {
      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider: 'google',
      });
    });
  });

  it('exibe erro retornado no cadastro com Google', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.social).mockResolvedValue({
      error: { message: 'Não foi possível criar conta com Google.' },
    });

    render(<SignUpForm />);

    await user.click(
      screen.getByRole('button', { name: /continuar com google/i }),
    );

    expect(
      await screen.findByText('Não foi possível criar conta com Google.'),
    ).toBeInTheDocument();
  });

  it('exibe erro inesperado ao usar login com Google', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.social).mockRejectedValue(
      new Error('Falha Google'),
    );

    render(<SignUpForm />);

    await user.click(
      screen.getByRole('button', { name: /continuar com google/i }),
    );

    expect(
      await screen.findByText('Erro inesperado ao usar login com Google.'),
    ).toBeInTheDocument();
  });

  it('usa mensagem padrão quando o cadastro falha sem message', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signUp.email).mockResolvedValue({
      error: {},
    } as Awaited<ReturnType<typeof authClient.signUp.email>>);

    render(<SignUpForm />);

    await user.type(screen.getByPlaceholderText('Seu nome'), 'Douglas');
    await user.type(
      screen.getByPlaceholderText('voce@email.com'),
      'douglas@email.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível criar a conta.',
    );
  });

  it('usa mensagem padrão quando o Google retorna erro sem message', async () => {
    const user = userEvent.setup();

    vi.mocked(authClient.signIn.social).mockResolvedValue({
      error: {},
    } as Awaited<ReturnType<typeof authClient.signIn.social>>);

    render(<SignUpForm />);

    await user.click(
      screen.getByRole('button', { name: /continuar com google/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível criar conta com Google.',
    );
  });
});
