import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/__mocks__/prisma';
import { getRecipeBySlug } from '@/features/recipes/server/get-recipe-by-slug';

vi.mock('@/lib/prisma');

describe('getRecipeBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('busca receita por slug com includes necessários', async () => {
    prisma.recipe.findUnique.mockResolvedValue({ id: 'recipe-1' } as never);

    const result = await getRecipeBySlug('bolo-de-fuba');

    expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
      where: { slug: 'bolo-de-fuba' },
      include: {
        ingredients: true,
        utensils: {
          include: {
            utensil: true,
          },
        },
        images: true,
      },
    });

    expect(result).toEqual({ id: 'recipe-1' });
  });

  it('retorna null quando não encontra receita', async () => {
    prisma.recipe.findUnique.mockResolvedValue(null as never);

    const result = await getRecipeBySlug('inexistente');

    expect(result).toBeNull();
  });
});
