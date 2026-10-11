import { beforeEach, describe, expect, it, vi } from 'vitest';

const recipeFindManyMock = vi.fn();
const recipeTypeFindManyMock = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    recipe: {
      findMany: (...args: any[]) => recipeFindManyMock(...args),
    },
    recipeType: {
      findMany: (...args: any[]) => recipeTypeFindManyMock(...args),
    },
  },
}));

import { getRecipesByCategory } from '@/features/recipes/actions/get-recipes-by-category';

describe('getRecipesByCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna categorias com receitas mapeadas em lote único', async () => {
    const createdAt = new Date('2026-05-22T12:00:00.000Z');

    recipeTypeFindManyMock.mockResolvedValueOnce([
      { id: 't1', name: 'Bolo' },
      { id: 't2', name: 'Salgado' },
    ]);
    // Lote único: 1 query com `in` para todos os tipos
    recipeFindManyMock.mockResolvedValueOnce([
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
      {
        id: '2',
        slug: 'coxinha',
        title: 'Coxinha',
        summary: 'Crocante',
        difficulty: 'MEDIUM',
        prepTimeMinutes: 20,
        cookTimeMinutes: 25,
        createdAt,
        images: [{ url: '/coxinha.jpg' }],
        author: { name: 'Douglas' },
        recipeTypes: [{ recipeType: { name: 'Salgado' } }],
      },
    ]);

    const result = await getRecipesByCategory(4);

    expect(recipeFindManyMock).toHaveBeenCalledTimes(1);
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
    recipeTypeFindManyMock.mockResolvedValueOnce([
      { id: 't2', name: 'Salgado' },
    ]);
    // Nenhuma receita publicada para esse tipo
    recipeFindManyMock.mockResolvedValueOnce([]);

    const result = await getRecipesByCategory(4);

    expect(result).toEqual([]);
  });
});
