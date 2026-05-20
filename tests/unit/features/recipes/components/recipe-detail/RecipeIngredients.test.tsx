import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RecipeIngredients } from '@/features/recipes/components/recipe-detail/RecipeIngredients';

describe('RecipeIngredients', () => {
  it('renderiza ingredientes e utensílios', () => {
    render(
      <RecipeIngredients
        sections={[
          {
            name: 'Receita',
            ingredients: [
              {
                id: '1',
                amount: '2',
                unit: null,
                name: 'ovos',
              },
              {
                id: '2',
                amount: '1',
                unit: 'xícara',
                name: 'farinha',
              },
            ],
          },
        ]}
        utensils={['Batedor', 'Tigela']}
      />,
    );

    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/ovos/i)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText(/xícara/i)).toBeInTheDocument();
    expect(screen.getByText(/farinha/i)).toBeInTheDocument();
    expect(screen.getByText('Batedor')).toBeInTheDocument();
    expect(screen.getByText('Tigela')).toBeInTheDocument();
  });

  it('renderiza título da seção quando há mais de uma seção', () => {
    render(
      <RecipeIngredients
        sections={[
          {
            name: 'Massa',
            ingredients: [
              {
                id: '1',
                amount: '2',
                unit: null,
                name: 'ovos',
              },
            ],
          },
          {
            name: 'Cobertura',
            ingredients: [
              {
                id: '2',
                amount: '1',
                unit: 'xícara',
                name: 'chocolate',
              },
            ],
          },
        ]}
        utensils={[]}
      />,
    );

    expect(screen.getByText('Massa')).toBeInTheDocument();
    expect(screen.getByText('Cobertura')).toBeInTheDocument();
  });
});
