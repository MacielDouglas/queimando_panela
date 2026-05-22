import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RecipeUtensilRow } from '@/features/recipes/components/recipe-list/RecipeUtensilRow';

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
    slug: 'frango-assado',
    title: 'Frango assado',
    summary: 'Dourado e suculento',
    type: 'Carnes',
    difficulty: 'MEDIUM' as const,
    prepTimeMinutes: 20,
    cookTimeMinutes: 60,
    createdAt: new Date('2026-05-21T12:00:00.000Z'),
    coverUrl: '/frango.jpg',
    authorName: 'Douglas',
  },
];

describe('RecipeUtensilRow', () => {
  it('retorna null quando não há receitas', () => {
    const { container } = render(
      <RecipeUtensilRow utensilName="Forma" recipes={[]} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renderiza utensílio, link e cards com aspectRatio 3/4', () => {
    render(<RecipeUtensilRow utensilName="Forma" recipes={recipes} />);

    expect(screen.getByRole('heading', { name: 'Forma' })).toBeInTheDocument();

    expect(screen.getByText('Método de preparo')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Ver todas →/i });
    expect(link).toHaveAttribute('href', '/receitas?utensilio=Forma');

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

  it('codifica o nome do utensílio na url do link', () => {
    render(<RecipeUtensilRow utensilName="Air Fryer" recipes={recipes} />);

    const link = screen.getByRole('link', { name: /Ver todas →/i });

    expect(link).toHaveAttribute('href', '/receitas?utensilio=Air%20Fryer');
  });
});
