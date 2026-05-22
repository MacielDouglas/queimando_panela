import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RecipeNutrition } from '@/features/recipes/components/recipe-detail/RecipeNutrition';

describe('RecipeNutrition', () => {
  it('renderiza resumo, tabela nutricional e sugestões', () => {
    render(
      <RecipeNutrition
        summary="Resumo nutricional"
        per100g={[
          { nutrient: 'Calorias', quantity: '200 kcal' },
          { nutrient: 'Proteínas', quantity: '8 g' },
        ]}
        suggestions="Troque leite integral por desnatado."
      />,
    );

    expect(screen.getByText(/Resumo nutricional/)).toBeInTheDocument();
    expect(screen.getByText('Calorias')).toBeInTheDocument();
    expect(screen.getByText('200 kcal')).toBeInTheDocument();
    expect(screen.getByText(/Sugestões/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Troque leite integral por desnatado./i),
    ).toBeInTheDocument();
  });

  it('retorna null quando não há summary nem per100g', () => {
    const { container } = render(
      <RecipeNutrition summary={null} per100g={null} suggestions={null} />,
    );

    expect(container.firstChild).toBeNull();
  });
});
