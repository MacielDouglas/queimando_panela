import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingRecipesPage from '@/app/(public)/receitas/loading';

describe('LoadingRecipesPage', () => {
  it('renderiza os blocos principais do skeleton', () => {
    const { container } = render(<LoadingRecipesPage />);

    const pulseBlocks = container.querySelectorAll('.animate-pulse');

    expect(pulseBlocks.length).toBeGreaterThan(10);
  });

  it('renderiza 6 cards de skeleton de receita', () => {
    const { container } = render(<LoadingRecipesPage />);

    const cards = container.querySelectorAll(
      '.grid.gap-5.sm\\:grid-cols-2.xl\\:grid-cols-3 > div',
    );

    expect(cards).toHaveLength(6);
  });

  it('renderiza a barra lateral de categorias em skeleton', () => {
    const { container } = render(<LoadingRecipesPage />);

    const sidebar = container.querySelector(
      '.space-y-4.border.border-neutral-200.bg-white.p-5',
    );

    expect(sidebar).toBeInTheDocument();
    expect(
      sidebar?.querySelectorAll('.animate-pulse').length,
    ).toBeGreaterThanOrEqual(7);
  });
});
