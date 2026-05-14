import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeSteps } from '@/features/recipes/components/RecipeSteps';

describe('RecipeSteps', () => {
  it('renderiza passos numerados como lista ordenada', () => {
    render(<RecipeSteps modeOfPreparation={`1. Misture tudo\n2. Leve ao forno\n3. Sirva`} />);

    expect(screen.getByText('Misture tudo')).toBeInTheDocument();
    expect(screen.getByText('Leve ao forno')).toBeInTheDocument();
    expect(screen.getByText('Sirva')).toBeInTheDocument();
  });

  it('renderiza texto livre quando não há numeração', () => {
    const text = 'Misture tudo e leve ao forno por 30 minutos.';
    render(<RecipeSteps modeOfPreparation={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
