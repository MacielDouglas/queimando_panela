'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export type RecipeCategoryCount = {
  name: string;
  count: number;
};

export const getRecipeCategoryCounts = cache(
  async (take = 8): Promise<RecipeCategoryCount[]> => {
    try {
      const safeTake = Math.min(Math.max(take, 1), 12);
      // 1 query: tipos com contagem de publicadas, mais populares primeiro.
      const types = await prisma.recipeType.findMany({
        where: { recipes: { some: { recipe: { isPublished: true } } } },
        select: {
          name: true,
          _count: {
            select: { recipes: { where: { recipe: { isPublished: true } } } },
          },
        },
        orderBy: { recipes: { _count: 'desc' } },
        take: safeTake,
      });

      return types.map((t) => ({ name: t.name, count: t._count.recipes }));
    } catch (error) {
      if (process.env.NODE_ENV === 'production')
        console.error('[getRecipeCategoryCounts] fallback:', error);
      return [];
    }
  },
);
