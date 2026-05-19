import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';
import { vi } from 'vitest';

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

    expect(
      screen.getByText(/esse cheirinho não tava no cardápio/i),
    ).toBeInTheDocument();
  });

  it('tem link para voltar para a página inicial', () => {
    render(<NotFound />);

    const link = screen.getByRole('link', {
      name: /Voltar para a página inicial/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
