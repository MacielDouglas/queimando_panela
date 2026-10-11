import { beforeEach, describe, expect, it, vi } from 'vitest';

const utensilFindManyMock = vi.fn();
const recipeFindManyMock = vi.fn();
const utensilOnRecipeFindManyMock = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    utensil: {
      findMany: (...args: any[]) => utensilFindManyMock(...args),
    },
    recipe: {
      findMany: (...args: any[]) => recipeFindManyMock(...args),
    },
    utensilOnRecipe: {
      findMany: (...args: any[]) => utensilOnRecipeFindManyMock(...args),
    },
  },
}));

import { getRecipesByUtensil } from '@/features/recipes/actions/get-recipe-by-utensil';

describe('getRecipesByUtensil', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna utensílios com receitas mapeadas', async () => {
    const createdAt = new Date('2026-05-22T12:00:00.000Z');

    utensilFindManyMock.mockResolvedValue([{ id: 'u1', name: 'Forma' }]);
    recipeFindManyMock.mockResolvedValue([
      {
        id: '1',
        slug: 'bolo-de-milho',
        title: 'Bolo de milho',
        summary: 'Fofo',
        difficulty: 'EASY',
        prepTimeMinutes: 10,
        cookTimeMinutes: 30,
        createdAt,
        images: [{ url: '/bolo.jpg' }],
        author: { name: 'Douglas' },
        recipeTypes: [{ recipeType: { name: 'Bolo' } }],
      },
    ]);
    utensilOnRecipeFindManyMock.mockResolvedValue([
      { recipeId: '1', utensilId: 'u1' },
    ]);

    const result = await getRecipesByUtensil(4);

    expect(result).toEqual([
      {
        utensilName: 'Forma',
        recipes: [
          {
            id: '1',
            slug: 'bolo-de-milho',
            title: 'Bolo de milho',
            summary: 'Fofo',
            types: ['Bolo'],
            difficulty: 'EASY',
            prepTimeMinutes: 10,
            cookTimeMinutes: 30,
            createdAt,
            coverUrl: '/bolo.jpg',
            authorName: 'Douglas',
          },
        ],
      },
    ]);
  });

  it('filtra utensílios vazios', async () => {
    utensilFindManyMock.mockResolvedValue([{ id: 'u1', name: 'Forma' }]);
    recipeFindManyMock.mockResolvedValue([]);
    utensilOnRecipeFindManyMock.mockResolvedValue([]);

    const result = await getRecipesByUtensil(4);

    expect(result).toEqual([]);
  });
});
