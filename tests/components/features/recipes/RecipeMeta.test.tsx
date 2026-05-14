import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeMeta } from '@/features/recipes/components/recipe-meta';

const base = {
  id: 'r1',
  slug: 'x',
  title: 'x',
  type: 'SWEET',
  difficulty: 'EASY' as const,
  summary: null,
  story: null,
  ingredients: [],
  utensils: [],
  images: [],
  isPublished: true,
  authorId: 'u1',
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

describe('RecipeMeta', () => {
  it('não renderiza nada quando não há dados de tempo ou porções', () => {
    const { container } = render(
      <RecipeMeta
        recipe={{ ...base, prepTimeMinutes: null, cookTimeMinutes: null, servings: null }}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza tempo de preparo quando fornecido', () => {
    render(
      <RecipeMeta
        recipe={{ ...base, prepTimeMinutes: 15, cookTimeMinutes: null, servings: null }}
      />,
    );
    expect(screen.getByText('15 min')).toBeInTheDocument();
    expect(screen.getByText('Preparo')).toBeInTheDocument();
  });

  it('renderiza todas as métricas quando fornecidas', () => {
    render(
      <RecipeMeta recipe={{ ...base, prepTimeMinutes: 10, cookTimeMinutes: 30, servings: 4 }} />,
    );
    expect(screen.getByText('10 min')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Porções')).toBeInTheDocument();
  });
});
