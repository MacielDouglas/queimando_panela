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

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renderiza a barra lateral de categorias em skeleton', () => {
    const { container } = render(<LoadingRecipesPage />);

    const sidebar = container.querySelector('.border-2');
    expect(sidebar).toBeInTheDocument();
  });
});
