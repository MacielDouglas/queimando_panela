'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import {
  normalizeString,
  normalizeDifficulty,
} from '@/features/recipes/lib/recipe-params';

type MaybeArray<T> = T | T[] | undefined;

export type RecipeCardData = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  types: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  createdAt: Date;
  coverUrl: string | null;
  authorName: string | null;
};

export type GetAllRecipesParams = {
  query?: MaybeArray<string>;
  type?: MaybeArray<string>;
  difficulty?: MaybeArray<'EASY' | 'MEDIUM' | 'HARD'>;
  utensilName?: MaybeArray<string>;
  take?: number;
  skip?: number;
};

function buildRecipeCard(recipe: {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  types: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  createdAt: Date;
  images: { url: string; isCover: boolean; order: number }[];
  author?: { name: string | null } | null;
}): RecipeCardData {
  const cover =
    recipe.images.find((img) => img.isCover) ?? recipe.images[0] ?? null;

  return {
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    summary: recipe.summary,
    types: recipe.types,
    difficulty: recipe.difficulty,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    createdAt: recipe.createdAt,
    coverUrl: cover?.url ?? null,
    authorName: recipe.author?.name ?? null,
  };
}

export const getAllRecipes = cache(
  async ({
    query,
    type,
    difficulty,
    utensilName,
    take = 24,
    skip = 0,
  }: GetAllRecipesParams): Promise<{
    recipes: RecipeCardData[];
    total: number;
  }> => {
    const normalizedQuery = normalizeString(query);
    const normalizedType = normalizeString(type);
    const normalizedDifficulty = normalizeDifficulty(difficulty);
    const normalizedUtensil = normalizeString(utensilName);

    const andFilters: Prisma.RecipeWhereInput[] = [];

    if (normalizedQuery) {
      andFilters.push({
        OR: [
          { title: { contains: normalizedQuery, mode: 'insensitive' } },
          { summary: { contains: normalizedQuery, mode: 'insensitive' } },
        ],
      });
    }

    if (normalizedType) {
      andFilters.push({
        types: { has: normalizedType },
      });
    }

    if (normalizedDifficulty) {
      andFilters.push({
        difficulty: normalizedDifficulty,
      });
    }

    if (normalizedUtensil) {
      andFilters.push({
        utensils: {
          some: {
            utensil: {
              name: { contains: normalizedUtensil, mode: 'insensitive' },
            },
          },
        },
      });
    }

    const where: Prisma.RecipeWhereInput = {
      isPublished: true,
      ...(andFilters.length > 0 ? { AND: andFilters } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          images: { orderBy: { order: 'asc' } },
          author: { select: { name: true } },
        },
      }),
      prisma.recipe.count({ where }),
    ]);

    return {
      recipes: items.map(buildRecipeCard),
      total,
    };
  },
);
