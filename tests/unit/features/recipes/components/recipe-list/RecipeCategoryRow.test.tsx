import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RecipeCategoryRow } from '@/features/recipes/components/recipe-list/RecipeCategoryRow';

const recipeCardMock = vi.fn();

vi.mock('@/features/recipes/components/recipe-list/RecipeCard', () => ({
  RecipeCard: (props: any) => {
    recipeCardMock(props);
    return <article data-testid="recipe-card">{props.recipe.title}</article>;
  },
}));

const recipes = [
  {
    id: '1',
    slug: 'bolo-de-milho',
    title: 'Bolo de milho',
    summary: 'Fofo',
    type: 'Bolo',
    difficulty: 'EASY' as const,
    prepTimeMinutes: 15,
    cookTimeMinutes: 45,
    createdAt: new Date('2026-05-22T12:00:00.000Z'),
    coverUrl: '/bolo.jpg',
    authorName: 'Douglas',
  },
  {
    id: '2',
    slug: 'bolo-de-fuba',
    title: 'Bolo de fubá',
    summary: 'Caseiro',
    type: 'Bolo',
    difficulty: 'MEDIUM' as const,
    prepTimeMinutes: 10,
    cookTimeMinutes: 35,
    createdAt: new Date('2026-05-21T12:00:00.000Z'),
    coverUrl: '/fuba.jpg',
    authorName: 'Douglas',
  },
];

describe('RecipeCategoryRow', () => {
  it('retorna null quando não há receitas', () => {
    const { container } = render(
      <RecipeCategoryRow type="Bolo" recipes={[]} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renderiza categoria, link e cards com aspectRatio 3/4', () => {
    render(<RecipeCategoryRow type="Bolo" recipes={recipes} />);

    expect(screen.getByRole('heading', { name: 'Bolo' })).toBeInTheDocument();

    expect(screen.getByText('Categoria')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Ver todas →/i });
    expect(link).toHaveAttribute('href', '/receitas?tipo=Bolo');

    expect(screen.getAllByTestId('recipe-card')).toHaveLength(2);

    expect(recipeCardMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        recipe: recipes[0],
        aspectRatio: '3/4',
      }),
    );

    expect(recipeCardMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        recipe: recipes[1],
        aspectRatio: '3/4',
      }),
    );
  });

  it('codifica o tipo na url do link', () => {
    render(<RecipeCategoryRow type="Prato Principal" recipes={recipes} />);

    const link = screen.getByRole('link', { name: /Ver todas →/i });

    expect(link).toHaveAttribute('href', '/receitas?tipo=Prato%20Principal');
  });
});
