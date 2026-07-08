'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';

export const getRandomRecipe = cache(
  async (): Promise<RecipeCardData | null> => {
    const count = await prisma.recipe.count({
      where: { isPublished: true },
    });

    if (count === 0) return null;

    const skip = Math.floor(Math.random() * count);

    const recipe = await prisma.recipe.findFirst({
      where: { isPublished: true },
      skip,
      include: {
        images: { orderBy: { order: 'asc' } },
        author: { select: { name: true } },
        recipeTypes: {
          include: { recipeType: true },
        },
      },
    });

    if (!recipe) return null;

    const cover =
      recipe.images.find((img) => img.isCover) ?? recipe.images[0] ?? null;

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
  },
);
