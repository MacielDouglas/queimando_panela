import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeIngredients } from '@/features/recipes/components/RecipeIngredients';

describe('RecipeIngredients', () => {
  it('não renderiza nada quando não há ingredientes', () => {
    const { container } = render(<RecipeIngredients ingredients={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza lista de ingredientes com quantidade e unidade', () => {
    render(
      <RecipeIngredients
        ingredients={[
          {
            id: '1',
            amount: '2',
            unit: 'xícaras',
            name: 'farinha de trigo',
          },
          {
            id: '2',
            amount: null,
            unit: null,
            name: 'sal',
          },
        ]}
      />,
    );

    expect(screen.getByText('Ingredientes')).toBeInTheDocument();
    expect(screen.getByText('2 xícaras')).toBeInTheDocument();
    expect(screen.getByText('farinha de trigo')).toBeInTheDocument();

    // quando não há amount/unit, mostra "—"
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('sal')).toBeInTheDocument();
  });
});
