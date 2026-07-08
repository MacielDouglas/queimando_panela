import { beforeEach, describe, expect, it, vi } from 'vitest';

const utensilFindManyMock = vi.fn();
const recipeFindManyMock = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    utensil: {
      findMany: (...args: any[]) => utensilFindManyMock(...args),
    },
    recipe: {
      findMany: (...args: any[]) => recipeFindManyMock(...args),
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
        images: [{ url: '/bolo.jpg', isCover: true, order: 0 }],
        author: { name: 'Douglas' },
        recipeTypes: [{ recipeType: { name: 'Bolo' } }],
      },
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

    const result = await getRecipesByUtensil(4);

    expect(result).toEqual([]);
  });
});
