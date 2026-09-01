import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    requestPasswordReset: vi.fn(),
  },
}));

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { authClient } from '@/lib/auth-client';

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o campo de email', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByPlaceholderText('voce@exemplo.com')).toBeInTheDocument();
  });

  it('renderiza o botão "Enviar instruções"', () => {
    render(<ForgotPasswordForm />);
    expect(
      screen.getByRole('button', { name: /enviar instruções/i }),
    ).toBeInTheDocument();
  });

  it('envia o formulário com sucesso', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.requestPasswordReset).mockResolvedValue({
      error: null,
    });

    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.click(
      screen.getByRole('button', { name: /enviar instruções/i }),
    );

    await waitFor(() => {
      expect(authClient.requestPasswordReset).toHaveBeenCalled();
    });
  });

  it('exibe mensagem de sucesso', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.requestPasswordReset).mockImplementation(
      async (_opts: any, callbacks: any) => {
        callbacks.onSuccess();
        return { error: null };
      },
    );

    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.click(
      screen.getByRole('button', { name: /enviar instruções/i }),
    );

    expect(
      await screen.findByText(/enviaremos as instruções/i),
    ).toBeInTheDocument();
  });

  it('exibe erro da API', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.requestPasswordReset).mockImplementation(
      async (_opts: any, callbacks: any) => {
        callbacks.onError({ error: { message: 'Email não encontrado.' } });
        return { error: { message: 'Email não encontrado.' } };
      },
    );

    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByPlaceholderText('voce@exemplo.com'),
      'teste@email.com',
    );
    await user.click(
      screen.getByRole('button', { name: /enviar instruções/i }),
    );

    expect(
      await screen.findByText('Email não encontrado.'),
    ).toBeInTheDocument();
  });
});
