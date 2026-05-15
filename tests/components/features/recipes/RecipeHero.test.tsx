import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeHero } from '@/features/recipes/components/RecipeHero';

const base = {
  slug: 'bolo-de-chocolate',
  title: 'Bolo de Chocolate',
  type: 'Bolo',
  difficulty: 'EASY' as const,
  summary: 'Receita clássica',
  images: [
    {
      id: 'img_1',
      key: 'recipes/recipe_1/cover-123.webp',
      url: 'https://example.com/bolo.webp',
      alt: 'Bolo de Chocolate',
      contentType: 'image/webp',
      sizeBytes: 180000,
      width: 1200,
      height: 800,
      order: 0,
      isCover: true,
      recipeId: 'recipe_1',
      createdAt: new Date(),
    },
  ],
};

describe('RecipeHero', () => {
  it('renderiza título, tipo e dificuldade', () => {
    render(<RecipeHero recipe={base} />);
    expect(screen.getByText('Bolo de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Bolo')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
  });

  it('renderiza summary quando fornecido', () => {
    render(<RecipeHero recipe={base} />);
    expect(screen.getByText('Receita clássica')).toBeInTheDocument();
  });

  it('não renderiza summary quando ausente', () => {
    render(<RecipeHero recipe={{ ...base, summary: null }} />);
    expect(screen.queryByText('Receita deliciosa.')).not.toBeInTheDocument();
  });

  it('renderiza link de edição apontando para o slug correto', () => {
    render(<RecipeHero recipe={base} />);
    expect(screen.getByRole('link', { name: /editar/i })).toHaveAttribute(
      'href',
      '/receitas/bolo-de-chocolate/editar',
    );
  });

  it('renderiza placeholder emoji quando não há imagem de capa', () => {
    render(<RecipeHero recipe={{ ...base, images: [] }} />);
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });
});
