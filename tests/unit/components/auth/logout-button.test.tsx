import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const push = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signOut: vi.fn(),
  },
}));

import { LogoutButton } from '@/components/auth/logout-button';
import { authClient } from '@/lib/auth-client';

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o botão "Sair"', () => {
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument();
  });

  it('chama signOut e redireciona ao clicar', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.signOut).mockImplementation(async (opts: any) => {
      opts.fetchOptions.onSuccess();
      return { error: null };
    });

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /sair/i }));

    await waitFor(() => {
      expect(authClient.signOut).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith('/sign-in');
      expect(refresh).toHaveBeenCalled();
    });
  });

  it('mostra "Saindo..." durante o logout', async () => {
    const user = userEvent.setup();
    let resolveSignOut: any;
    vi.mocked(authClient.signOut).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignOut = resolve;
        }) as any,
    );

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /sair/i }));

    expect(screen.getByText('Saindo...')).toBeInTheDocument();

    resolveSignOut({ error: null });
  });

  it('reseta estado ao erro no signOut', async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.signOut).mockImplementation(async (opts: any) => {
      opts.fetchOptions.onError();
      return { error: { message: 'Falha' } };
    });

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /sair/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sair/i })).toBeEnabled();
    });
  });

  it('aceita className customizado', () => {
    render(<LogoutButton className="my-custom-class" />);
    expect(screen.getByRole('button', { name: /sair/i })).toHaveClass(
      'my-custom-class',
    );
  });
});
