import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import NotFound from '@/app/not-found';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('NotFound', () => {
  it('mostra a mensagem divertida de 404', () => {
    render(<NotFound />);

    expect(screen.getByText(/Essa receita queimou/i)).toBeInTheDocument();
  });

  it('tem link para voltar para a página inicial', () => {
    render(<NotFound />);

    const link = screen.getByRole('link', {
      name: /Voltar ao menu/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
