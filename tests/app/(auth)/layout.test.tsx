import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import AuthLayout from '@/app/(auth)/layout';

const redirectMock = vi.fn();
const headersMock = vi.fn();
const getSessionMock = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => redirectMock(...args),
}));

vi.mock('next/headers', () => ({
  headers: () => headersMock(),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => getSessionMock(...args),
    },
  },
}));

describe('AuthLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  it('renderiza os children quando não existe sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    const result = await AuthLayout({
      children: <div>conteúdo protegido de auth</div>,
    });

    render(result);

    expect(screen.getByText('conteúdo protegido de auth')).toBeInTheDocument();
    expect(getSessionMock).toHaveBeenCalledWith({
      headers: expect.any(Headers),
    });
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('redireciona para a home quando existe sessão', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user_1', email: 'douglas@example.com' },
    });

    await AuthLayout({
      children: <div>conteúdo protegido de auth</div>,
    });

    expect(redirectMock).toHaveBeenCalledWith('/');
  });
});