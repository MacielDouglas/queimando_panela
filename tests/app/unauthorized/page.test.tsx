import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import UnauthorizedPage from '@/app/unauthorized/page';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('UnauthorizedPage', () => {
  it('renderiza o título "Sem permissão para acessar"', () => {
    render(<UnauthorizedPage />);

    expect(
      screen.getByRole('heading', { name: /sem permissão para acessar/i }),
    ).toBeInTheDocument();
  });

  it('renderiza o eyebrow "Acesso restrito"', () => {
    render(<UnauthorizedPage />);

    expect(screen.getByText('Acesso restrito')).toBeInTheDocument();
  });

  it('renderiza a descrição', () => {
    render(<UnauthorizedPage />);

    expect(
      screen.getByText(/Faça login com conta válida/i),
    ).toBeInTheDocument();
  });

  it('tem link para /sign-in', () => {
    render(<UnauthorizedPage />);

    const link = screen.getByRole('link', { name: /entrar/i });
    expect(link).toHaveAttribute('href', '/sign-in');
  });

  it('tem link para voltar ao início', () => {
    render(<UnauthorizedPage />);

    const link = screen.getByRole('link', { name: /voltar ao início/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
