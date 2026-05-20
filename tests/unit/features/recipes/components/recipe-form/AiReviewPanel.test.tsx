import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AiReviewPanel } from '@/features/recipes/components/recipe-form/AiReviewPanel';

const base = {
  title: 'Estrogonofe',
  summary: 'Estrogonofe cremoso e cheio de sabor.',
  difficulty: 'MEDIUM' as const,
  difficultyLabel: 'Fácil a Médio',
  type: 'Prato principal / Carne',
  prepTimeMinutes: 15,
  cookTimeMinutes: 20,
  suggestions: 'Troque carne por frango.',
  nutritionSummary: 'Rico em proteínas e gorduras.',
  nutritionPer100g: [
    { nutrient: 'Calorias', quantity: '250 kcal' },
    { nutrient: 'Carboidratos', quantity: '5 g' },
  ],
  utensils: ['Frigideira grande', 'Espátula'],
  sections: [
    {
      name: 'Receita',
      ingredients: ['300g de filé', '200ml de creme de leite'],
      modeOfPreparation:
        '1. Refogue a cebola.\n2. Adicione a carne.\n3. Junte os demais ingredientes.',
    },
  ],
};

describe('AiReviewPanel', () => {
  it('renderiza título, resumo e metadados', () => {
    render(<AiReviewPanel data={base} />);

    expect(screen.getByText('Estrogonofe')).toBeInTheDocument();
    expect(screen.getByText(/Estrogonofe cremoso/i)).toBeInTheDocument();
    expect(screen.getByText('Fácil a Médio')).toBeInTheDocument();
    expect(screen.getByText(/Preparo: 15 min/)).toBeInTheDocument();
    expect(screen.getByText(/Cozimento: 20 min/)).toBeInTheDocument();
  });

  it('renderiza ingredientes, utensílios e sugestões', () => {
    render(<AiReviewPanel data={base} />);

    expect(screen.getByText('300g de filé')).toBeInTheDocument();
    expect(screen.getByText('Frigideira grande')).toBeInTheDocument();
    expect(screen.getByText(/Troque carne por frango/)).toBeInTheDocument();
  });

  it('remove numeração duplicada dos passos', () => {
    render(<AiReviewPanel data={base} />);

    expect(screen.getByText('Refogue a cebola.')).toBeInTheDocument();
    expect(
      screen.queryByText(/^1\.\sRefogue a cebola\.$/),
    ).not.toBeInTheDocument();
  });
});
