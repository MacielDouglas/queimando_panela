import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingRecipesPage from '@/app/(public)/receitas/loading';

describe('LoadingRecipesPage', () => {
  it('renderiza os skeletons do topo', () => {
    const { container } = render(<LoadingRecipesPage />);

    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    );
  });

  it('renderiza 6 cards de skeleton de receita', () => {
    const { container } = render(<LoadingRecipesPage />);

    const cards = container.querySelectorAll(
      '.grid.gap-5.sm\\:grid-cols-2.xl\\:grid-cols-3 > div',
    );

    expect(cards).toHaveLength(6);
  });
});
