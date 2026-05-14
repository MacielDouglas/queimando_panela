import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeHeader } from '@/features/recipes/components/recipe-header';

const base = {
  id: 'r1',
  slug: 'bolo-de-banana',
  title: 'Bolo de Banana',
  type: 'SWEET',
  difficulty: 'EASY' as const,
  summary: 'Receita deliciosa.',
  story: 'História da vovó.',
  ingredients: [],
  utensils: [],
  images: [],
  prepTimeMinutes: null,
  cookTimeMinutes: null,
  servings: null,
  modeOfPreparation: '',
  isPublished: true,
  authorId: 'user-1',
  suggestions: null,
  notesAuthor: null,
  notesPublic: null,
  nutritionSummary: null,
  nutritionPer100g: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: null,
};

describe('RecipeHeader', () => {
  it('renderiza título, tipo e dificuldade', () => {
    render(<RecipeHeader recipe={base} />);

    expect(screen.getByText('Bolo de Banana')).toBeInTheDocument();
    expect(screen.getByText('SWEET')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
  });

  it('renderiza summary quando fornecido', () => {
    render(<RecipeHeader recipe={base} />);
    expect(screen.getByText('Receita deliciosa.')).toBeInTheDocument();
  });

  it('renderiza story quando fornecido', () => {
    render(<RecipeHeader recipe={base} />);
    expect(screen.getByText('História da vovó.')).toBeInTheDocument();
  });

  it('não renderiza summary quando ausente', () => {
    render(<RecipeHeader recipe={{ ...base, summary: null }} />);
    expect(screen.queryByText('Receita deliciosa.')).not.toBeInTheDocument();
  });
});
