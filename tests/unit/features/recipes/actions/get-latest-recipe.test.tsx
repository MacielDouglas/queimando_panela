import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeRecipeMock } from '@/../tests/unit/factories/make-recipe-mock';

const findFirstMock = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    recipe: {
      findFirst: (...args: any[]) => findFirstMock(...args),
    },
  },
}));

import { getLatestRecipe } from '@/features/recipes/actions/get-latest-recipe';

describe('getLatestRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna null quando não há receita publicada', async () => {
    findFirstMock.mockResolvedValue(null);

    const result = await getLatestRecipe();

    expect(result).toBeNull();
  });

  it('retorna a receita mais recente com capa correta', async () => {
    const createdAt = new Date('2026-05-22T12:00:00.000Z');

    findFirstMock.mockResolvedValue(
      makeRecipeMock({
        id: '1',
        slug: 'bolo-de-milho',
        title: 'Bolo de milho',
        summary: 'Fofo e cremoso',
        difficulty: 'EASY',
        prepTimeMinutes: 15,
        cookTimeMinutes: 45,
        createdAt,
        images: [
          { url: '/capa.jpg', alt: 'Capa', isCover: true, order: 0 },
          { url: '/outra.jpg', alt: 'Outra', isCover: false, order: 1 },
        ],
        author: { id: 'user-1', name: 'Douglas' },
        recipeTypes: [{ recipeType: { name: 'Bolo' } }],
      }),
    );

    const result = await getLatestRecipe();

    expect(findFirstMock).toHaveBeenCalledWith({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { order: 'asc' } },
        author: { select: { name: true } },
        recipeTypes: {
          include: { recipeType: true },
        },
      },
    });

    expect(result).toEqual({
      id: '1',
      slug: 'bolo-de-milho',
      title: 'Bolo de milho',
      summary: 'Fofo e cremoso',
      types: ['Bolo'],
      difficulty: 'EASY',
      prepTimeMinutes: 15,
      cookTimeMinutes: 45,
      createdAt,
      coverUrl: '/capa.jpg',
      authorName: 'Douglas',
    });
  });
});
