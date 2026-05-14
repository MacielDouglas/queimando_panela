import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecipeGrid } from '@/features/recipes/components/recipe-grid';

vi.mock('@/features/recipes/components/recipe-card-item', () => ({
  RecipeCardItem: vi.fn(({ recipe }: { recipe: { title: string } }) => (
    <div data-testid="recipe-card">{recipe.title}</div>
  )),
}));

const makeRecipe = (id: string, title: string) => ({
  id,
  slug: id,
  title,
  type: 'SWEET',
  difficulty: 'EASY' as const,
  summary: null,
  prepTimeMinutes: null,
  cookTimeMinutes: null,
  servings: null,
  images: [],
  _count: { ingredients: 0 },
  isPublished: true,
  authorId: 'u1',
  story: null,
  suggestions: null,
  notesAuthor: null,
  notesPublic: null,
  nutritionSummary: null,
  nutritionPer100g: null,
  modeOfPreparation: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: null,
});

describe('RecipeGrid', () => {
  it('renderiza estado vazio quando não há receitas', () => {
    render(<RecipeGrid recipes={[]} />);
    expect(screen.getByText('Nenhuma receita encontrada')).toBeInTheDocument();
  });

  it('renderiza um card por receita', () => {
    render(
      <RecipeGrid
        recipes={[makeRecipe('r1', 'Bolo de Banana'), makeRecipe('r2', 'Sopa de Legumes')]}
      />,
    );
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(2);
    expect(screen.getByText('Bolo de Banana')).toBeInTheDocument();
    expect(screen.getByText('Sopa de Legumes')).toBeInTheDocument();
  });
});
