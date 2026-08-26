import { render, screen } from '@testing-library/react';
import type { ImageProps } from 'next/image';
import { describe, expect, it, vi } from 'vitest';

import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { RecipeCard } from '@/features/recipes/components/recipe-list/RecipeCard';

vi.mock('next/image', () => ({
  default: (props: ImageProps) => (
    <span
      data-testid="next-image"
      data-src={String(props.src)}
      data-alt={props.alt}
    />
  ),
}));

const baseRecipe: RecipeCardData = {
  id: '1',
  slug: 'bolo-de-milho',
  title: 'Bolo de milho',
  summary: 'Fofo e cremoso',
  types: ['Bolo'],
  difficulty: 'EASY',
  prepTimeMinutes: 15,
  cookTimeMinutes: 45,
  createdAt: new Date('2026-05-22T12:00:00.000Z'),
  coverUrl: '/bolo.jpg',
  authorName: 'Douglas',
};

describe('RecipeCard', () => {
  it('renderiza título, resumo, tipo e dificuldade', () => {
    render(<RecipeCard recipe={baseRecipe} />);

    expect(screen.getByText('Bolo de milho')).toBeInTheDocument();
    expect(screen.getByText('Fofo e cremoso')).toBeInTheDocument();
    expect(screen.getByText('Bolo')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
    expect(screen.getByText('60 min')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Ver receita: Bolo de milho/i }),
    ).toHaveAttribute('href', '/receitas/bolo-de-milho');
    expect(screen.getByTestId('next-image')).toHaveAttribute(
      'data-src',
      '/bolo.jpg',
    );
  });

  it('renderiza placeholder Sem foto quando coverUrl é null', () => {
    render(<RecipeCard recipe={{ ...baseRecipe, coverUrl: null }} />);

    expect(screen.getByText('Sem foto')).toBeInTheDocument();
    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
  });

  it('não renderiza summary quando é null', () => {
    render(<RecipeCard recipe={{ ...baseRecipe, summary: null }} />);

    expect(screen.queryByText('Fofo e cremoso')).not.toBeInTheDocument();
  });
});
