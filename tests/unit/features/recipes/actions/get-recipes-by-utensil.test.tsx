import { beforeEach, describe, expect, it, vi } from 'vitest';

const findManyMock = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    utensil: {
      findMany: (...args: any[]) => findManyMock(...args),
    },
    recipe: {
      findMany: (...args: any[]) => findManyMock(...args),
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

    findManyMock
      .mockResolvedValueOnce([{ id: 'u1', name: 'Forma' }])
      .mockResolvedValueOnce([
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
          images: [{ url: '/bolo.jpg', isCover: true, order: 0 }],
          author: { name: 'Douglas' },
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
    findManyMock
      .mockResolvedValueOnce([{ id: 'u1', name: 'Forma' }])
      .mockResolvedValueOnce([]);

    const result = await getRecipesByUtensil(4);

    expect(result).toEqual([]);
  });
});
