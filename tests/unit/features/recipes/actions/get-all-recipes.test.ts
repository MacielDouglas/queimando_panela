import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAllRecipes } from '@/features/recipes/actions/get-all-recipes';
import { prisma } from '@/lib/__mocks__/prisma';

vi.mock('@/lib/prisma');

describe('getAllRecipes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('busca receitas paginadas com filtros padrão', async () => {
    prisma.recipe.findMany.mockResolvedValueOnce([] as never);
    prisma.recipe.count.mockResolvedValueOnce(0 as never);

    const result = await getAllRecipes({});

    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 12,
      }),
    );

    expect(prisma.recipe.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isPublished: true } }),
    );

    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it('aplica filtros de type e difficulty', async () => {
    prisma.recipe.findMany.mockResolvedValueOnce([] as never);
    prisma.recipe.count.mockResolvedValueOnce(0 as never);

    await getAllRecipes({ page: 2, type: 'SWEET', difficulty: 'EASY' });

    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPublished: true, type: 'SWEET', difficulty: 'EASY' },
        skip: 12, // página 2
        take: 12,
      }),
    );
  });

  it('calcula totalPages corretamente', async () => {
    prisma.recipe.findMany.mockResolvedValueOnce([] as never);
    prisma.recipe.count.mockResolvedValueOnce(25 as never);

    const result = await getAllRecipes({ page: 1 });

    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3);
  });
});
