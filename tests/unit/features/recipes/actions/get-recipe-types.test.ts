import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getRecipeTypes } from '@/features/recipes/actions/get-recipe-types';
import { prisma } from '@/lib/__mocks__/prisma';

vi.mock('@/lib/prisma');

describe('getRecipeTypes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('busca tipos distintos apenas de receitas publicadas e não vazias', async () => {
    // O mock simula o retorno do Prisma APÓS distinct já aplicado
    prisma.recipe.findMany.mockResolvedValueOnce([{ type: 'SAVORY' }, { type: 'SWEET' }] as never);

    const types = await getRecipeTypes();

    expect(prisma.recipe.findMany).toHaveBeenCalledWith({
      where: { isPublished: true, type: { not: '' } },
      select: { type: true },
      distinct: ['type'],
      orderBy: { type: 'asc' },
    });

    expect(types).toEqual(['SAVORY', 'SWEET']);
  });
});
