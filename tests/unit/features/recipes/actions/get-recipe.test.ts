import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getRecipeBySlug } from '@/features/recipes/actions/get-recipe';
import { prisma } from '@/lib/__mocks__/prisma';

vi.mock('@/lib/prisma');

describe('getRecipeBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('busca receita por slug com relacionamentos e ordenações corretas', async () => {
    prisma.recipe.findUnique.mockResolvedValueOnce(null as never);

    const slug = 'bolo-de-banana';
    await getRecipeBySlug(slug);

    expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
      where: { slug },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        utensils: {
          include: { utensil: true },
          orderBy: { createdAt: 'asc' },
        },
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
  });
});
