'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';

type ClassicRecipeRow = {
  type: string;
  recipes: RecipeCardData[];
};

export const getClassicRecipes = cache(
  async (typesCount = 4, recipesPerType = 1): Promise<ClassicRecipeRow[]> => {
    const publishedTypes = await prisma.recipeType.findMany({
      where: {
        recipes: {
          some: { recipe: { isPublished: true } },
        },
      },
      include: {
        _count: {
          select: { recipes: { where: { recipe: { isPublished: true } } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (publishedTypes.length === 0) return [];

    const shuffled = [...publishedTypes].sort(() => Math.random() - 0.5);
    const selectedTypes = shuffled.slice(0, typesCount);

    const rows = await Promise.all(
      selectedTypes.map(async (recipeType) => {
        const items = await prisma.recipe.findMany({
          where: {
            isPublished: true,
            recipeTypes: {
              some: { recipeTypeId: recipeType.id },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: recipesPerType,
          include: {
            images: { orderBy: { order: 'asc' } },
            author: { select: { name: true } },
            recipeTypes: {
              include: { recipeType: true },
            },
          },
        });

        return {
          type: recipeType.name,
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
