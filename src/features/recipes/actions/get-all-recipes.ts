'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { normalizeString } from '@/features/recipes/lib/recipe-params';
import type { RecipeDifficultyValue } from '../types/recipe.types';

type MaybeArray<T> = T | T[] | undefined;

export type RecipeCardData = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  types: string[];
  difficulty: RecipeDifficultyValue;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  createdAt: Date;
  coverUrl: string | null;
  authorName: string | null;
};

export type GetAllRecipesParams = {
  query?: MaybeArray<string>;
  category?: MaybeArray<string>;
  types?: MaybeArray<string>;
  difficulty?: MaybeArray<RecipeDifficultyValue>;
  utensils?: MaybeArray<string>;
  ingredients?: MaybeArray<string>;
  take?: number;
  skip?: number;
};

function normalizeStringList(value: MaybeArray<string>): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return Array.from(
    new Set(
      values
        .map((item) => normalizeString(item))
        .filter((item): item is string => Boolean(item)),
    ),
  );
}

function normalizeDifficultyList(
  value: MaybeArray<RecipeDifficultyValue>,
): RecipeDifficultyValue[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return Array.from(
    new Set(
      values.filter(
        (item): item is RecipeDifficultyValue =>
          item === 'EASY' ||
          item === 'EASY_MEDIUM' ||
          item === 'MEDIUM' ||
          item === 'MEDIUM_HARD' ||
          item === 'HARD',
      ),
    ),
  );
}

function buildRecipeCard(recipe: {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: RecipeDifficultyValue;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  createdAt: Date;
  images: { url: string; isCover: boolean; order: number }[];
  author?: { name: string | null } | null;
  recipeTypes: { recipeType: { name: string } }[];
}): RecipeCardData {
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
  };
}

export const getAllRecipes = cache(
  async ({
    query,
    category,
    types,
    difficulty,
    utensils,
    ingredients,
    take = 24,
    skip = 0,
  }: GetAllRecipesParams): Promise<{
    recipes: RecipeCardData[];
    total: number;
  }> => {
    const normalizedQuery = normalizeString(query);
    const normalizedCategory = normalizeString(category);
    const normalizedTypes = normalizeStringList(types);
    const normalizedDifficulties = normalizeDifficultyList(difficulty);
    const normalizedUtensils = normalizeStringList(utensils);
    const normalizedIngredients = normalizeStringList(ingredients);

    const andFilters: Prisma.RecipeWhereInput[] = [];

    if (normalizedQuery) {
      andFilters.push({
        OR: [
          { title: { contains: normalizedQuery, mode: 'insensitive' } },
          { summary: { contains: normalizedQuery, mode: 'insensitive' } },
          { story: { contains: normalizedQuery, mode: 'insensitive' } },
        ],
      });
    }

    if (normalizedCategory) {
      andFilters.push({
        recipeTypes: {
          some: {
            recipeType: {
              name: {
                equals: normalizedCategory,
                mode: 'insensitive',
              },
            },
          },
        },
      });
    }

    if (normalizedTypes.length > 0) {
      andFilters.push({
        recipeTypes: {
          some: {
            recipeType: {
              name: {
                in: normalizedTypes,
              },
            },
          },
        },
      });
    }

    if (normalizedDifficulties.length === 1) {
      andFilters.push({
        difficulty: normalizedDifficulties[0],
      });
    }

    if (normalizedDifficulties.length > 1) {
      andFilters.push({
        difficulty: {
          in: normalizedDifficulties,
        },
      });
    }

    if (normalizedUtensils.length > 0) {
      andFilters.push({
        utensils: {
          some: {
            utensil: {
              name: {
                in: normalizedUtensils,
              },
            },
          },
        },
      });
    }

    if (normalizedIngredients.length > 0) {
      andFilters.push({
        OR: [
          {
            ingredients: {
              some: {
                generalIngredient: {
                  name: {
                    in: normalizedIngredients,
                  },
                },
              },
            },
          },
          {
            sections: {
              some: {
                ingredients: {
                  some: {
                    generalIngredient: {
                      name: {
                        in: normalizedIngredients,
                      },
                    },
                  },
                },
              },
            },
          },
        ],
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
          recipeTypes: {
            include: { recipeType: true },
          },
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
