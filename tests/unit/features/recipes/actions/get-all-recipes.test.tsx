import { beforeEach, describe, expect, it, vi } from 'vitest';

const findManyMock = vi.fn();
const countMock = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    recipe: {
      findMany: (...args: any[]) => findManyMock(...args),
      count: (...args: any[]) => countMock(...args),
    },
  },
}));

import { getAllRecipes } from '@/features/recipes/actions/get-all-recipes';

describe('getAllRecipes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna receitas mapeadas e total sem filtros', async () => {
    const createdAt = new Date('2026-05-22T12:00:00.000Z');

    findManyMock.mockResolvedValue([
      {
        id: '1',
        slug: 'bolo-de-milho',
        title: 'Bolo de milho',
        summary: 'Fofo e cremoso',
        types: ['Bolo'],
        difficulty: 'EASY',
        prepTimeMinutes: 15,
        cookTimeMinutes: 45,
        createdAt,
        images: [
          { url: '/capa.jpg', isCover: true, order: 0 },
          { url: '/outra.jpg', isCover: false, order: 1 },
        ],
        author: { name: 'Douglas' },
      },
    ]);

    countMock.mockResolvedValue(1);

    const result = await getAllRecipes({});

    expect(findManyMock).toHaveBeenCalledWith({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 24,
      skip: 0,
      include: {
        images: { orderBy: { order: 'asc' } },
        author: { select: { name: true } },
      },
    });

    expect(countMock).toHaveBeenCalledWith({
      where: { isPublished: true },
    });

    expect(result).toEqual({
      recipes: [
        {
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
        },
      ],
      total: 1,
    });
  });

  it('usa a primeira imagem quando não existe cover', async () => {
    const createdAt = new Date('2026-05-22T12:00:00.000Z');

    findManyMock.mockResolvedValue([
      {
        id: '1',
        slug: 'bolo-de-milho',
        title: 'Bolo de milho',
        summary: null,
        types: [],
        difficulty: 'MEDIUM',
        prepTimeMinutes: null,
        cookTimeMinutes: null,
        createdAt,
        images: [{ url: '/primeira.jpg', isCover: false, order: 0 }],
        author: { name: null },
      },
    ]);

    countMock.mockResolvedValue(1);

    const result = await getAllRecipes({});

    expect(result.recipes[0]?.coverUrl).toBe('/primeira.jpg');
    expect(result.recipes[0]?.authorName).toBeNull();
  });

  it('retorna coverUrl null quando não há imagens', async () => {
    const createdAt = new Date('2026-05-22T12:00:00.000Z');

    findManyMock.mockResolvedValue([
      {
        id: '1',
        slug: 'bolo-de-milho',
        title: 'Bolo de milho',
        summary: null,
        types: [],
        difficulty: 'HARD',
        prepTimeMinutes: null,
        cookTimeMinutes: null,
        createdAt,
        images: [],
        author: null,
      },
    ]);

    countMock.mockResolvedValue(1);

    const result = await getAllRecipes({});

    expect(result.recipes[0]?.coverUrl).toBeNull();
    expect(result.recipes[0]?.authorName).toBeNull();
  });

  it('aplica filtros normalizados e paginação', async () => {
    findManyMock.mockResolvedValue([]);
    countMock.mockResolvedValue(0);

    await getAllRecipes({
      query: '  milho  ',
      type: '  bolo ',
      difficulty: 'EASY',
      utensilName: ' forma ',
      take: 12,
      skip: 24,
    });

    const expectedWhere = {
      isPublished: true,
      AND: [
        {
          OR: [
            { title: { contains: 'milho', mode: 'insensitive' } },
            { summary: { contains: 'milho', mode: 'insensitive' } },
          ],
        },
        {
          types: { has: 'bolo' },
        },
        {
          difficulty: 'EASY',
        },
        {
          utensils: {
            some: {
              utensil: {
                name: { contains: 'forma', mode: 'insensitive' },
              },
            },
          },
        },
      ],
    };

    expect(findManyMock).toHaveBeenCalledWith({
      where: expectedWhere,
      orderBy: { createdAt: 'desc' },
      take: 12,
      skip: 24,
      include: {
        images: { orderBy: { order: 'asc' } },
        author: { select: { name: true } },
      },
    });

    expect(countMock).toHaveBeenCalledWith({
      where: expectedWhere,
    });
  });
});