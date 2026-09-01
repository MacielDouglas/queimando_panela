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
    signUp: {
      email: vi.fn(),
    },
  },
}));

import { SignUpForm } from '@/components/auth/sign-up-form';
import { authClient } from '@/lib/auth-client';

describe('SignUpForm (components/auth)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza os campos do formulário', () => {
    render(<SignUpForm />);

    expect(screen.getByPlaceholderText('voce@exemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Crie uma senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repita sua senha')).toBeInTheDocument();
  });

  it('renderiza o botão "Criar conta"', () => {
    render(<SignUpForm />);
    expect(
      screen.getByRole('button', { name: /criar conta/i }),
    ).toBeInTheDocument();
  });

  it('cria conta com sucesso', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.signUp.email).mockResolvedValue({ error: null });

    render(<SignUpForm />);

    await user.type(screen.getByPlaceholderText('Seu nome'), 'Douglas');
    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.type(screen.getByPlaceholderText('Crie uma senha'), '12345678');
    await user.type(
      screen.getByPlaceholderText('Repita sua senha'),
      '12345678',
    );
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        {
          name: 'Douglas',
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
    vi.mocked(authClient.signUp.email).mockImplementation(
      async (_values: any, opts: any) => {
        opts.onError({ error: { message: 'E-mail já cadastrado.' } });
        return { error: { message: 'E-mail já cadastrado.' } };
      },
    );

    render(<SignUpForm />);

    await user.type(screen.getByPlaceholderText('Seu nome'), 'Douglas');
    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.type(screen.getByPlaceholderText('Crie uma senha'), '12345678');
    await user.type(
      screen.getByPlaceholderText('Repita sua senha'),
      '12345678',
    );
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(
      await screen.findByText('E-mail já cadastrado.'),
    ).toBeInTheDocument();
  });

  it('exibe erro do result.error.message quando não usa callback', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      error: { message: 'Conta duplicada.' },
    });

    render(<SignUpForm />);

    await user.type(screen.getByPlaceholderText('Seu nome'), 'Douglas');
    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.type(screen.getByPlaceholderText('Crie uma senha'), '12345678');
    await user.type(
      screen.getByPlaceholderText('Repita sua senha'),
      '12345678',
    );
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(await screen.findByText('Conta duplicada.')).toBeInTheDocument();
  });

  it('exibe mensagem de concordância com termos', () => {
    render(<SignUpForm />);
    expect(
      screen.getByText(/você concorda com nossos termos/i),
    ).toBeInTheDocument();
  });

  it('valida nome obrigatório via Zod', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.type(screen.getByPlaceholderText('Crie uma senha'), '12345678');
    await user.type(
      screen.getByPlaceholderText('Repita sua senha'),
      '12345678',
    );
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(await screen.findByText('Informe seu nome.')).toBeInTheDocument();
  });
});
