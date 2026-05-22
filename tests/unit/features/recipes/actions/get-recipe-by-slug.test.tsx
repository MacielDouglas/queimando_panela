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

describe('getRecipeBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      include: {
        author: { select: { name: true } },
        images: { orderBy: { order: 'asc' } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            ingredients: { orderBy: { order: 'asc' } },
          },
        },
        ingredients: {
          where: { sectionId: null },
          orderBy: { order: 'asc' },
        },
        utensils: {
          include: { utensil: true },
        },
      },
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
});
