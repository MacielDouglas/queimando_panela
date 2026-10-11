import { beforeEach, describe, expect, it, vi } from 'vitest';

const findUniqueMock = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    recipe: {
      findUnique: (...args: any[]) => findUniqueMock(...args),
    },
  },
}));

import { getRecipeBySlug } from '@/features/recipes/actions/get-recipe-by-slug';

const expectedSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  story: true,
  modeOfPreparation: true,
  difficulty: true,
  prepTimeMinutes: true,
  cookTimeMinutes: true,
  servings: true,
  suggestions: true,
  nutritionSummary: true,
  nutritionPer100g: true,
  isPublished: true,
  isAiGenerated: true,
  authorId: true,
  author: { select: { name: true } },
  images: {
    orderBy: { order: 'asc' },
    select: {
      url: true,
      alt: true,
      isCover: true,
      order: true,
    },
  },
  sections: {
    orderBy: { order: 'asc' },
    select: {
      name: true,
      modeOfPreparation: true,
      ingredients: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          name: true,
          amount: true,
          unit: true,
          originalText: true,
          order: true,
        },
      },
    },
  },
  ingredients: {
    where: { sectionId: null },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      amount: true,
      unit: true,
      originalText: true,
      order: true,
    },
  },
  utensils: {
    select: { utensil: { select: { name: true } } },
  },
  recipeTypes: {
    select: { recipeType: { select: { name: true } } },
  },
};

describe('getRecipeBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna null quando a receita não existe', async () => {
    findUniqueMock.mockResolvedValue(null);

    const result = await getRecipeBySlug('inexistente');

    expect(result).toBeNull();
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { slug: 'inexistente' },
      select: expectedSelect,
    });
  });

  it('retorna a receita com relações incluídas', async () => {
    findUniqueMock.mockResolvedValue({
      id: '1',
      slug: 'bolo-de-milho',
      title: 'Bolo de milho',
      author: { name: 'Douglas' },
      images: [],
      sections: [],
      ingredients: [],
      utensils: [],
    });

    const result = await getRecipeBySlug('bolo-de-milho');

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { slug: 'bolo-de-milho' },
      select: expectedSelect,
    });

    expect(result).toEqual({
      id: '1',
      slug: 'bolo-de-milho',
      title: 'Bolo de milho',
      author: { name: 'Douglas' },
      images: [],
      sections: [],
      ingredients: [],
      utensils: [],
    });
  });

  it('rejeita slug inválido sem consultar o banco', async () => {
    const result = await getRecipeBySlug('../../etc/passwd');

    expect(result).toBeNull();
    expect(findUniqueMock).not.toHaveBeenCalled();
  });
});
