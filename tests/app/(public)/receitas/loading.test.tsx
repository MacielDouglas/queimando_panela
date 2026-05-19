import { render, screen } from '@testing-library/react';
import LoadingRecipesPage from '@/app/(public)/receitas/loading';

describe('LoadingRecipesPage', () => {
  it('renderiza os skeletons do topo', () => {
    render(<LoadingRecipesPage />);

    expect(screen.getByTestId('loading-hero-chip')).toBeInTheDocument();
    expect(screen.getByTestId('loading-hero-title')).toBeInTheDocument();
    expect(screen.getByTestId('loading-hero-description')).toBeInTheDocument();
  });

  it('renderiza 6 cards de skeleton de receita', () => {
    render(<LoadingRecipesPage />);

    const cards = screen.getAllByTestId('recipe-skeleton-card');
    expect(cards).toHaveLength(6);
  });
});
