import { beforeEach, describe, expect, it, vi } from 'vitest';

const findManyMock = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    recipe: {
      findMany: (...args: any[]) => findManyMock(...args),
    },
  },
}));

import { getRecipesByCategory } from '@/features/recipes/actions/get-recipes-by-category';

describe('getRecipesByCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna categorias com receitas mapeadas', async () => {
    const createdAt = new Date('2026-05-22T12:00:00.000Z');

    findManyMock.mockResolvedValue([
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
      {
        id: '2',
        slug: 'coxinha',
        title: 'Coxinha',
        summary: 'Crocante',
        types: ['Salgado'],
        difficulty: 'MEDIUM',
        prepTimeMinutes: 20,
        cookTimeMinutes: 25,
        createdAt,
        images: [{ url: '/coxinha.jpg', isCover: true, order: 0 }],
        author: { name: 'Douglas' },
      },
    ]);

    const result = await getRecipesByCategory(4);

    expect(result).toHaveLength(2);

    expect(result).toContainEqual({
      type: 'Bolo',
      recipes: expect.arrayContaining([
        expect.objectContaining({
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
        }),
      ]),
    });

    expect(result).toContainEqual({
      type: 'Salgado',
      recipes: expect.arrayContaining([
        expect.objectContaining({
          id: '2',
          slug: 'coxinha',
          title: 'Coxinha',
          summary: 'Crocante',
          types: ['Salgado'],
          difficulty: 'MEDIUM',
          prepTimeMinutes: 20,
          cookTimeMinutes: 25,
          createdAt,
          coverUrl: '/coxinha.jpg',
          authorName: 'Douglas',
        }),
      ]),
    });
  });

  it('filtra categorias vazias', async () => {
    findManyMock.mockResolvedValue([
      {
        id: '2',
        slug: 'coxinha',
        title: 'Coxinha',
        summary: 'Crocante',
        types: [],
        difficulty: 'MEDIUM',
        prepTimeMinutes: 20,
        cookTimeMinutes: 25,
        createdAt: new Date('2026-05-22T12:00:00.000Z'),
        images: [{ url: '/coxinha.jpg', isCover: true, order: 0 }],
        author: { name: 'Douglas' },
      },
    ]);

    const result = await getRecipesByCategory(4);

    expect(result).toEqual([]);
  });
});
