'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';

export const getLatestRecipe = cache(
  async (): Promise<RecipeCardData | null> => {
    const recipe = await prisma.recipe.findFirst({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { order: 'asc' } },
        author: { select: { name: true } },
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
      type: recipe.type,
      difficulty: recipe.difficulty,
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      createdAt: recipe.createdAt,
      coverUrl: cover?.url ?? null,
      authorName: recipe.author?.name ?? null,
    };
  },
);
