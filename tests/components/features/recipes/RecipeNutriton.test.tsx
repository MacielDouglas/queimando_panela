import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecipeNutrition } from '@/features/recipes/components/RecipeNutrition';
import { NutritionTable } from '@/features/recipes/components/NutritionTable';
import type { NutritionRow } from '@/server/ai/groq/recipe-generator.types';

vi.mock('@/features/recipes/components/NutritionTable', () => ({
  NutritionTable: vi.fn(() => <div data-testid="nutrition-table-mock" />),
}));

describe('RecipeNutrition', () => {
  it('não renderiza nada quando não há linhas', () => {
    const { container } = render(<RecipeNutrition nutritionPer100g={[]} nutritionSummary={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza seção e delega para NutritionTable quando há dados', () => {
    const rows: NutritionRow[] = [
      { nutrient: 'Calorias', amount: '200', unit: 'kcal', dailyValue: '10%' },
    ];

    render(<RecipeNutrition nutritionPer100g={rows} nutritionSummary="Resumo" />);

    expect(screen.getByText(/Informação nutricional/i)).toBeInTheDocument();
    expect(screen.getByTestId('nutrition-table-mock')).toBeInTheDocument();

    expect(NutritionTable).toHaveBeenCalledWith(
      expect.objectContaining({
        rows,
        summary: 'Resumo',
      }),
      undefined,
    );
  });
});
