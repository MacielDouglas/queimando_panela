import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecipeDetailView } from '@/features/recipes/components/recipe-detail-view';

vi.mock('@/features/recipes/components/RecipeHero', () => ({
  RecipeHero: () => <div>RecipeHero</div>,
}));

vi.mock('@/features/recipes/components/RecipeMetrics', () => ({
  RecipeMetrics: () => <div>RecipeMetrics</div>,
}));

vi.mock('@/features/recipes/components/RecipeIngredients', () => ({
  RecipeIngredients: () => <div>RecipeIngredients</div>,
}));

vi.mock('@/features/recipes/components/RecipeUtensilis', () => ({
  RecipeUtensils: () => <div>RecipeUtensils</div>,
}));

vi.mock('@/features/recipes/components/RecipeSteps', () => ({
  RecipeSteps: () => <div>RecipeSteps</div>,
}));

vi.mock('@/features/recipes/components/RecipeNutrition', () => ({
  RecipeNutrition: () => <div>RecipeNutrition</div>,
}));

const baseRecipe = {
  id: 'recipe-1',
  title: 'Bolo de Fubá',
  summary: 'Resumo',
  story: 'Receita de família',
  suggestions: 'Sirva com café',
  notesPublic: 'Melhor no dia seguinte',
  modeOfPreparation: 'Misture tudo',
  prepTimeMinutes: 10,
  cookTimeMinutes: 35,
  servings: 8,
  nutritionPer100g: [],
  nutritionSummary: '100 kcal',
  ingredients: [{ id: '1', name: 'Fubá' }],
  utensils: [{ id: '1', utensil: { name: 'Tigela' } }],
  images: [],
};

describe('RecipeDetailView', () => {
  it('renderiza seções opcionais quando dados existem', () => {
    render(<RecipeDetailView recipe={baseRecipe as never} />);

    expect(screen.getByText('RecipeHero')).toBeInTheDocument();
    expect(screen.getByText('RecipeMetrics')).toBeInTheDocument();
    expect(screen.getByText('RecipeIngredients')).toBeInTheDocument();
    expect(screen.getByText('RecipeUtensils')).toBeInTheDocument();
    expect(screen.getByText('RecipeSteps')).toBeInTheDocument();
    expect(screen.getByText('RecipeNutrition')).toBeInTheDocument();

    expect(screen.getByText('História')).toBeInTheDocument();
    expect(screen.getByText('Sugestões')).toBeInTheDocument();
    expect(screen.getByText('Notas')).toBeInTheDocument();
    expect(screen.getByText('Receita de família')).toBeInTheDocument();
    expect(screen.getByText('Sirva com café')).toBeInTheDocument();
    expect(screen.getByText('Melhor no dia seguinte')).toBeInTheDocument();
  });

  it('não renderiza seções opcionais quando dados não existem', () => {
    render(
      <RecipeDetailView
        recipe={
          {
            ...baseRecipe,
            story: null,
            suggestions: null,
            notesPublic: null,
          } as never
        }
      />,
    );

    expect(screen.queryByText('História')).not.toBeInTheDocument();
    expect(screen.queryByText('Sugestões')).not.toBeInTheDocument();
    expect(screen.queryByText('Notas')).not.toBeInTheDocument();
  });
});
