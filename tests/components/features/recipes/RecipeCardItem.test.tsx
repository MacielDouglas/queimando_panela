import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeCardItem } from '@/features/recipes/components/recipe-card-item';

const base = {
  id: 'r1',
  slug: 'bolo-de-banana',
  title: 'Bolo de Banana',
  type: 'SWEET',
  difficulty: 'EASY' as const,
  summary: 'Receita deliciosa.',
  prepTimeMinutes: 10,
  cookTimeMinutes: 30,
  servings: 4,
  images: [] as {
    id: string;
    url: string;
    alt: string;
    order: number;
    isCover: boolean;
    recipeId: string;
    createdAt: Date;
  }[],
  _count: { ingredients: 5 },
  isPublished: true,
  authorId: 'u1',
  story: null,
  suggestions: null,
  notesAuthor: null,
  notesPublic: null,
  nutritionSummary: null,
  nutritionPer100g: null,
  modeOfPreparation: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: null,
};

describe('RecipeCardItem', () => {
  it('renderiza título, tipo e dificuldade', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByText('Bolo de Banana')).toBeInTheDocument();
    expect(screen.getByText('SWEET')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
  });

  it('renderiza tempo total e porções', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByText('⏱ 40 min')).toBeInTheDocument();
    expect(screen.getByText('🍽 4 porções')).toBeInTheDocument();
  });

  it('renderiza contagem de ingredientes', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByText('5 ingredientes')).toBeInTheDocument();
  });

  it('renderiza summary quando fornecido', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByText('Receita deliciosa.')).toBeInTheDocument();
  });

  it('não exibe tempo quando prepTimeMinutes e cookTimeMinutes são zero', () => {
    render(<RecipeCardItem recipe={{ ...base, prepTimeMinutes: null, cookTimeMinutes: null }} />);
    expect(screen.queryByText(/min/i)).not.toBeInTheDocument();
  });

  it('link aponta para o slug correto', () => {
    render(<RecipeCardItem recipe={base} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/receitas/bolo-de-banana');
  });
});
