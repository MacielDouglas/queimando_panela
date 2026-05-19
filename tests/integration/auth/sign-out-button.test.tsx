import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    signOut: vi.fn(),
  },
}));

import { authClient } from '@/lib/auth-client';
import { SignOutButton } from '@/components/auth/sign-out-button';

describe('SignOutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o botão sair', () => {
    render(<SignOutButton />);
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument();
  });

  it('redireciona para login ao sair com sucesso', async () => {
    vi.mocked(authClient.signOut).mockResolvedValue({ error: null });

    render(<SignOutButton />);
    fireEvent.click(screen.getByRole('button', { name: /sair/i }));

    await waitFor(() => {
      expect(authClient.signOut).toHaveBeenCalled();
      expect(replace).toHaveBeenCalledWith('/login');
      expect(refresh).toHaveBeenCalled();
    });
  });

  it('exibe mensagem quando ocorrer erro', async () => {
    vi.mocked(authClient.signOut).mockResolvedValue({
      error: { message: 'Não foi possível sair.' },
    });

    render(<SignOutButton />);
    fireEvent.click(screen.getByRole('button', { name: /sair/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível sair.',
    );
  });

  it('usa mensagem padrão quando o erro não possui message', async () => {
    vi.mocked(authClient.signOut).mockResolvedValue({
      error: {},
    } as Awaited<ReturnType<typeof authClient.signOut>>);

    render(<SignOutButton />);
    fireEvent.click(screen.getByRole('button', { name: /sair/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível sair.',
    );
  });

  it('exibe erro inesperado quando signOut lança exceção', async () => {
    vi.mocked(authClient.signOut).mockRejectedValue(
      new Error('Falha inesperada'),
    );

    render(<SignOutButton />);
    fireEvent.click(screen.getByRole('button', { name: /sair/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Erro inesperado ao sair.',
    );
  });
});
