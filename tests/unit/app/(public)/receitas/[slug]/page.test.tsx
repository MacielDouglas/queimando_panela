import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import RecipeDetailPage from '@/app/(public)/receitas/[slug]/page';

const notFoundMock = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});

vi.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}));

const findUniqueMock = vi.fn();

vi.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    recipe: {
      findUnique: (args: unknown) => findUniqueMock(args),
    },
  },
}));

vi.mock('@/features/recipes/components/recipe-detail/RecipeDetailHero', () => ({
  RecipeDetailHero: (props: any) => (
    <div data-testid="recipe-detail-hero">{JSON.stringify(props)}</div>
  ),
}));

vi.mock(
  '@/features/recipes/components/recipe-detail/RecipeIngredients',
  () => ({
    RecipeIngredients: (props: any) => (
      <div data-testid="recipe-ingredients">{JSON.stringify(props)}</div>
    ),
  }),
);

vi.mock('@/features/recipes/components/recipe-detail/RecipeSteps', () => ({
  RecipeSteps: (props: any) => (
    <div data-testid="recipe-steps">{JSON.stringify(props)}</div>
  ),
}));

vi.mock('@/features/recipes/components/recipe-detail/RecipeNutrition', () => ({
  RecipeNutrition: (props: any) => (
    <div data-testid="recipe-nutrition">{JSON.stringify(props)}</div>
  ),
}));

describe('RecipeDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('chama notFound quando a receita não existe', async () => {
    findUniqueMock.mockResolvedValue(null);

    const promise = RecipeDetailPage({
      params: Promise.resolve({ slug: 'slug-inexistente' }),
    });

    await expect(promise).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
  });

  it('renderiza a página com dados da receita e seções existentes', async () => {
    findUniqueMock.mockResolvedValue({
      title: 'Bolo de milho',
      summary: 'Fofo e cremoso',
      type: 'Bolo',
      difficulty: 'EASY',
      prepTimeMinutes: 10,
      cookTimeMinutes: 40,
      servings: 8,
      story: 'Receita da família',
      nutritionSummary: 'Resumo',
      nutritionPer100g: [{ nutrient: 'Calorias', quantity: '210 kcal' }],
      suggestions: 'Troque leite integral por desnatado',
      modeOfPreparation: null,
      author: { name: 'Douglas' },
      images: [{ url: '/capa.jpg', isCover: true, order: 0 }],
      sections: [
        {
          name: 'Massa',
          modeOfPreparation: 'Misture tudo.',
          ingredients: [{ id: '1', amount: '2', unit: null, name: 'ovos' }],
          order: 0,
        },
      ],
      ingredients: [],
      utensils: [
        { utensil: { name: 'Tigela' } },
        { utensil: { name: 'Forma' } },
      ],
    });

    const ui = await RecipeDetailPage({
      params: Promise.resolve({ slug: 'bolo-de-milho' }),
    });

    render(ui);

    expect(screen.getByTestId('recipe-detail-hero')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-ingredients')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-steps')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-nutrition')).toBeInTheDocument();

    expect(screen.getByTestId('recipe-detail-hero')).toHaveTextContent(
      '"coverUrl":"/capa.jpg"',
    );
    expect(screen.getByTestId('recipe-ingredients')).toHaveTextContent('Massa');
    expect(screen.getByTestId('recipe-ingredients')).toHaveTextContent(
      'Tigela',
    );
    expect(screen.getByTestId('recipe-steps')).toHaveTextContent(
      'Receita da família',
    );
    expect(screen.getByTestId('recipe-nutrition')).toHaveTextContent(
      '210 kcal',
    );
  });

  it('usa fallback de seção única quando não há sections', async () => {
    findUniqueMock.mockResolvedValue({
      title: 'Pudim',
      summary: null,
      type: null,
      difficulty: 'MEDIUM',
      prepTimeMinutes: null,
      cookTimeMinutes: null,
      servings: null,
      story: null,
      nutritionSummary: null,
      nutritionPer100g: null,
      suggestions: null,
      modeOfPreparation: 'Bata e asse.',
      author: { name: 'Douglas' },
      images: [],
      sections: [],
      ingredients: [
        { id: '1', amount: '1', unit: 'lata', name: 'leite condensado' },
      ],
      utensils: [],
    });

    const ui = await RecipeDetailPage({
      params: Promise.resolve({ slug: 'pudim' }),
    });

    render(ui);

    expect(screen.getByTestId('recipe-ingredients')).toHaveTextContent(
      'Receita',
    );
    expect(screen.getByTestId('recipe-ingredients')).toHaveTextContent(
      'leite condensado',
    );
    expect(screen.getByTestId('recipe-steps')).toHaveTextContent(
      'Bata e asse.',
    );
  });
});
