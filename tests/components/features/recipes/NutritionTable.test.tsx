import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NutritionTable } from '@/features/recipes/components/NutritionTable';
import type { NutritionRow } from '@/server/ai/groq/recipe-generator.types';

describe('NutritionTable', () => {
  it('não renderiza nada quando não há linhas', () => {
    const { container } = render(<NutritionTable rows={[]} summary="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza tabela com linhas e summary', () => {
    const rows: NutritionRow[] = [
      { nutrient: 'Calorias', amount: '200', unit: 'kcal', dailyValue: '10%' },
      { nutrient: 'Proteínas', amount: '5', unit: 'g', dailyValue: '' },
    ];

    render(<NutritionTable rows={rows} summary="Resumo nutricional" />);

    expect(screen.getByText(/Informação Nutricional/i)).toBeInTheDocument();
    expect(screen.getByText('Calorias')).toBeInTheDocument();
    expect(screen.getByText('200 kcal')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('Proteínas')).toBeInTheDocument();
    expect(screen.getByText('5 g')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument(); // dailyValue vazio
    expect(screen.getByText('Resumo nutricional')).toBeInTheDocument();
    expect(
      screen.getByText(/Valores Diários com base em uma dieta de 2.000 kcal/i),
    ).toBeInTheDocument();
  });
});
