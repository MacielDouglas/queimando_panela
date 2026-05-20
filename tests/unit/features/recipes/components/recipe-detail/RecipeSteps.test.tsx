import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RecipeSteps } from '@/features/recipes/components/recipe-detail/RecipeSteps';

describe('RecipeSteps', () => {
  it('renderiza seções e passos sem numeração duplicada', () => {
    render(
      <RecipeSteps
        story={null}
        sections={
          [
            {
              name: 'Receita',
              modeOfPreparation:
                '1. Misture os ingredientes.\n2. Asse por 30 minutos.',
            },
          ] as any
        }
      />,
    );

    expect(screen.getByText('Modo de preparo')).toBeInTheDocument();
    expect(screen.getByText('Misture os ingredientes.')).toBeInTheDocument();
    expect(screen.getByText('Asse por 30 minutos.')).toBeInTheDocument();

    expect(
      screen.queryByText(/^1\.\sMisture os ingredientes\.$/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/^2\.\sAsse por 30 minutos\.$/),
    ).not.toBeInTheDocument();
  });
});
