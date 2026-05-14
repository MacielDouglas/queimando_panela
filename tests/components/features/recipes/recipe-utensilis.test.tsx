import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeUtensils } from '@/features/recipes/components/recipe-utensils';

const makeUtensil = (id: string, name: string) => ({
  utensil: { id, name, createdAt: new Date() },
  createdAt: new Date(),
  recipeId: 'recipe-123',
  utensilId: id,
});

describe('recipe-utensils (detail)', () => {
  it('renderiza lista de utensílios', () => {
    render(
      <RecipeUtensils utensils={[makeUtensil('u1', 'Tigela'), makeUtensil('u2', 'Panela')]} />,
    );

    expect(screen.getByText('Utensílios')).toBeInTheDocument();
    expect(screen.getByText('Tigela')).toBeInTheDocument();
    expect(screen.getByText('Panela')).toBeInTheDocument();
  });

  it('renderiza seção mesmo quando lista está vazia', () => {
    render(<RecipeUtensils utensils={[]} />);
    expect(screen.getByText('Utensílios')).toBeInTheDocument();
  });
});
