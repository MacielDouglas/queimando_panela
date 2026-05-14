import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeHero } from '@/features/recipes/components/RecipeHero';

const base = {
  slug: 'bolo-de-banana',
  title: 'Bolo de Banana',
  type: 'SWEET',
  difficulty: 'EASY' as const,
  summary: 'Receita deliciosa.',
  images: [] as {
    id: string;
    url: string;
    alt: string;
    order: number;
    isCover: boolean;
    recipeId: string;
    createdAt: Date;
  }[],
};

describe('RecipeHero', () => {
  it('renderiza título, tipo e dificuldade', () => {
    render(<RecipeHero recipe={base} />);
    expect(screen.getByText('Bolo de Banana')).toBeInTheDocument();
    expect(screen.getByText('SWEET')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
  });

  it('renderiza summary quando fornecido', () => {
    render(<RecipeHero recipe={base} />);
    expect(screen.getByText('Receita deliciosa.')).toBeInTheDocument();
  });

  it('não renderiza summary quando ausente', () => {
    render(<RecipeHero recipe={{ ...base, summary: null }} />);
    expect(screen.queryByText('Receita deliciosa.')).not.toBeInTheDocument();
  });

  it('renderiza link de edição apontando para o slug correto', () => {
    render(<RecipeHero recipe={base} />);
    expect(screen.getByRole('link', { name: /editar/i })).toHaveAttribute(
      'href',
      '/receitas/bolo-de-banana/editar',
    );
  });

  it('renderiza placeholder emoji quando não há imagem de capa', () => {
    render(<RecipeHero recipe={{ ...base, images: [] }} />);
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });
});
