import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeCardItem } from '@/features/recipes/components/recipe-card-item';

const base = {
  id: 'recipe_1',
  slug: 'bolo-de-chocolate',
  title: 'Bolo de Chocolate',
  type: 'Bolo',
  difficulty: 'EASY' as const,
  summary: 'Receita clássica',
  story: null,
  modeOfPreparation: 'Misture os ingredientes e asse até dourar.',
  prepTimeMinutes: 20,
  cookTimeMinutes: 35,
  servings: 8,
  suggestions: null,
  nutritionSummary: null,
  nutritionPer100g: null,
  notesAuthor: null,
  notesPublic: null,
  authorId: 'user_1',
  isPublished: true,
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
  _count: {
    ingredients: 5,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: null,
};

describe('RecipeCardItem', () => {
  it('renderiza título, tipo e dificuldade', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByText('Bolo de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Bolo')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
  });

  it('renderiza tempo total e porções', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByText('⏱ 55 min')).toBeInTheDocument();
    expect(screen.getByText('🍽 8 porções')).toBeInTheDocument();
  });

  it('renderiza contagem de ingredientes', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByText('5 ingredientes')).toBeInTheDocument();
  });

  it('renderiza summary quando fornecido', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByText('Receita clássica')).toBeInTheDocument();
  });

  it('não exibe tempo quando prepTimeMinutes e cookTimeMinutes são zero', () => {
    render(<RecipeCardItem recipe={{ ...base, prepTimeMinutes: null, cookTimeMinutes: null }} />);
    expect(screen.queryByText(/min/i)).not.toBeInTheDocument();
  });

  it('link aponta para o slug correto', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/receitas/bolo-de-chocolate');
  });
});
