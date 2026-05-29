import type { ImageProps } from 'next/image';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RecipeDetailHero } from '@/features/recipes/components/recipe-detail/RecipeDetailHero';

vi.mock('next/image', () => ({
  default: (props: ImageProps) => {
    return (
      <span
        data-testid="next-image"
        data-src={String(props.src)}
        data-alt={props.alt}
      />
    );
  },
}));

describe('RecipeDetailHero', () => {
  it('renderiza título, resumo e metadados', () => {
    render(
      <RecipeDetailHero
        slug="bolo-de-cenoura"
        title="Bolo de Cenoura"
        summary="Fofo"
        types={['Bolo']}
        difficulty="EASY"
        prepTimeMinutes={10}
        cookTimeMinutes={20}
        servings={8}
        coverUrl="/bolo.jpg"
        authorName="Douglas"
        story={null}
      />,
    );

    expect(screen.getByText('Bolo de milho')).toBeInTheDocument();
    expect(screen.getByText(/Fofo e cremoso/)).toBeInTheDocument();
    expect(screen.getByText('Bolo')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
    expect(screen.getByText('60 min')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Douglas')).toBeInTheDocument();

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('data-src', '/bolo.jpg');
    expect(image).toHaveAttribute('data-alt', 'Bolo de milho');
  });
});
