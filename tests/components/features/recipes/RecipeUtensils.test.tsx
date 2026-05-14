import { RecipeUtensils } from '@/features/recipes/components/RecipeUtensilis';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('RecipeUtensils', () => {
  it('não renderiza nada quando não há utensílios', () => {
    const { container } = render(<RecipeUtensils utensils={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza chips de utensílios', () => {
    render(
      <RecipeUtensils
        utensils={[
          { utensil: { id: 'u1', name: 'Tigela' } },
          { utensil: { id: 'u2', name: 'Forma' } },
        ]}
      />,
    );

    expect(screen.getByText('Utensílios')).toBeInTheDocument();
    expect(screen.getByText('Tigela')).toBeInTheDocument();
    expect(screen.getByText('Forma')).toBeInTheDocument();
  });
});
