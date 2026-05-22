'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';

type CategoryRow = {
  type: string;
  recipes: RecipeCardData[];
};

export const getRecipesByCategory = cache(
  async (take = 4): Promise<CategoryRow[]> => {
    const types = await prisma.recipe.findMany({
      where: { isPublished: true, type: { not: null } },
      distinct: ['type'],
      select: { type: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    const rows = await Promise.all(
      types.map(async ({ type }) => {
        const items = await prisma.recipe.findMany({
          where: { isPublished: true, type: type as string },
          orderBy: { createdAt: 'desc' },
          take,
          include: {
            images: { orderBy: { order: 'asc' } },
            author: { select: { name: true } },
          },
        });

        return {
          type: type as string,
          recipes: items.map((recipe) => {
            const cover =
              recipe.images.find((img) => img.isCover) ??
              recipe.images[0] ??
              null;

            return {
              id: recipe.id,
              slug: recipe.slug,
              title: recipe.title,
              summary: recipe.summary,
              type: recipe.type,
              difficulty: recipe.difficulty,
              prepTimeMinutes: recipe.prepTimeMinutes,
              cookTimeMinutes: recipe.cookTimeMinutes,
              createdAt: recipe.createdAt,
              coverUrl: cover?.url ?? null,
              authorName: recipe.author?.name ?? null,
            } satisfies RecipeCardData;
          }),
        };
      }),
    );

    return rows.filter((row) => row.recipes.length > 0);
  },
);
