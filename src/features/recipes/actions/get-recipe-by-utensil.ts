'use server';

import { cache } from 'react';
import type { RecipeDifficulty } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';

type UtensilRow = {
  utensilName: string;
  recipes: RecipeCardData[];
};

function mapDifficulty(
  difficulty: RecipeDifficulty,
): 'EASY' | 'MEDIUM' | 'HARD' {
  if (difficulty === 'EASY') return 'EASY';
  if (difficulty === 'HARD') return 'HARD';

  // EASY_MEDIUM, MEDIUM, MEDIUM_HARD caem aqui
  return 'MEDIUM';
}

export const getRecipesByUtensil = cache(
  async (take = 4): Promise<UtensilRow[]> => {
    try {
      const utensils = await prisma.utensil.findMany({
        where: {
          recipes: {
            some: {
              recipe: { isPublished: true },
            },
          },
        },
        orderBy: { name: 'asc' },
        take: 4,
        select: { id: true, name: true },
      });

      const rows = await Promise.all(
        utensils.map(async (utensil) => {
          const items = await prisma.recipe.findMany({
            where: {
              isPublished: true,
              utensils: {
                some: { utensilId: utensil.id },
              },
            },
            orderBy: { createdAt: 'desc' },
            take,
            select: {
              id: true,
              slug: true,
              title: true,
              summary: true,
              difficulty: true,
              prepTimeMinutes: true,
              cookTimeMinutes: true,
              createdAt: true,
              images: {
                orderBy: { order: 'asc' },
                take: 2,
                select: { url: true, isCover: true, order: true },
              },
              author: { select: { name: true } },
              recipeTypes: {
                select: { recipeType: { select: { name: true } } },
              },
            },
          });

          return {
            utensilName: utensil.name,
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
                difficulty: mapDifficulty(recipe.difficulty),
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
    } catch (error) {
      if (process.env.NODE_ENV === 'production')
        console.error('[getRecipesByUtensil] fallback:', error);
      return [];
    }
  },
);
