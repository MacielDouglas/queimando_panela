import { prisma } from '@/lib/prisma';

const PER_PAGE = 12;

export async function getAllRecipes({
  page = 1,
  type,
  difficulty,
}: {
  page?: number;
  type?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}) {
  const where = {
    isPublished: true,
    ...(type ? { type } : {}),
    ...(difficulty ? { difficulty } : {}),
  };

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        _count: {
          select: {
            ingredients: true,
          },
        },
      },
    }),
    prisma.recipe.count({ where }),
  ]);

  return {
    recipes,
    total,
    totalPages: Math.ceil(total / PER_PAGE),
  };
}

export type RecipeListItem = Awaited<ReturnType<typeof getAllRecipes>>['recipes'][number];
