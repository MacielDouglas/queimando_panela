'use server';

import { cache } from 'react';
import { normalizeString } from '@/features/recipes/lib/recipe-params';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type { RecipeDifficultyValue } from '../types/recipe.types';
import { mapToRecipeCardData, recipeCardSelect } from './recipe-card-select';

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

/**
 * Higieniza termo de busca: limite de 60 chars e sem curingas de LIKE.
 * Prisma parametriza a query (sem risco de SQL injection), mas `%`/`_`
 * gigantes forçam seq scan no Neon — barato de prevenir.
 */
function sanitizeSearchTerm(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const cleaned = value
    .replace(/[%_\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
  return cleaned || undefined;
}

// Cache compartilhado via ISR da rota (revalidate em page.tsx):
// entre revalidações o CDN serve HTML sem tocar o Neon.
// cache() do React faz o dedupe dentro do request.
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
    const normalizedQuery = sanitizeSearchTerm(normalizeString(query));
    const normalizedCategory = normalizeString(category);
    const normalizedTypes = normalizeStringList(types);
    const normalizedDifficulties = normalizeDifficultyList(difficulty);
    const normalizedUtensils = normalizeStringList(utensils);
    const normalizedIngredients = normalizeStringList(ingredients);

    const andFilters: Prisma.RecipeWhereInput[] = [];

    if (normalizedQuery) {
      // Busca só em title/summary (Fase D: índice trigram cobre esses campos).
      // `story` (TEXT longo, sem índice) saía em seq scan — fora da busca.
      andFilters.push({
        OR: [
          { title: { contains: normalizedQuery, mode: 'insensitive' } },
          { summary: { contains: normalizedQuery, mode: 'insensitive' } },
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

    // Trava anti-abuso: bots varrendo page=9999 geravam offset gigante no Neon.
    const safeTake = Math.min(Math.max(take, 1), 48);
    const safeSkip = Math.min(Math.max(skip, 0), 480);

    try {
      const [items, total] = await Promise.all([
        prisma.recipe.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: safeTake,
          skip: safeSkip,
          select: recipeCardSelect,
        }),
        prisma.recipe.count({ where }),
      ]);

      return {
        recipes: items.map(mapToRecipeCardData),
        total,
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'production')
        console.error('[getAllRecipes] fallback:', error);
      return { recipes: [], total: 0 };
    }
  },
);
