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
    const published = await prisma.recipe.findMany({
      where: {
        isPublished: true,
        recipeTypes: {
          some: {},
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        recipeTypes: {
          include: { recipeType: true },
        },
      },
    });

    const seen = new Set<string>();
    for (const { recipeTypes } of published) {
      for (const rt of recipeTypes) {
        const t = rt.recipeType.name;
        if (!seen.has(t)) seen.add(t);
        if (seen.size >= 4) break;
      }
      if (seen.size >= 4) break;
    }

    const distinctTypes = Array.from(seen);

    const rows = await Promise.all(
      distinctTypes.map(async (type) => {
        const items = await prisma.recipe.findMany({
          where: {
            isPublished: true,
            recipeTypes: {
              some: {
                recipeType: { name: type },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take, // <- aqui o parâmetro é de fato usado
          include: {
            images: { orderBy: { order: 'asc' } },
            author: { select: { name: true } },
            recipeTypes: {
              include: { recipeType: true },
            },
          },
        });

        return {
          type,
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
              types: recipe.recipeTypes.map((rt) => rt.recipeType.name),
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
