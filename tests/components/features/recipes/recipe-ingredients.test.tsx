import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeIngredients } from '@/features/recipes/components/recipe-ingredients';

describe('recipe-ingredients (detail)', () => {
  it('não renderiza nada quando lista está vazia', () => {
    const { container } = render(<RecipeIngredients ingredients={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza ingredientes com quantidade, unidade e nome', () => {
    render(
      <RecipeIngredients
        ingredients={[
          {
            id: '1',
            name: 'farinha',
            amount: '2',
            unit: 'xícaras',
            originalText: '',
            order: 0,
            recipeId: 'r1',
            createdAt: new Date(),
          },
          {
            id: '2',
            name: 'sal',
            amount: null,
            unit: null,
            originalText: '',
            order: 1,
            recipeId: 'r1',
            createdAt: new Date(),
          },
        ]}
      />,
    );

    expect(screen.getByText('2 xícaras')).toBeInTheDocument();
    expect(screen.getByText('farinha')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('sal')).toBeInTheDocument();
  });
});
