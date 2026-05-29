'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

type FilterOption = {
  label: string;
  value: string;
};

type RecipeFilterOptions = {
  categories: FilterOption[];
  types: FilterOption[];
  utensils: FilterOption[];
  ingredients: FilterOption[];
};

function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export const getRecipeFilterOptions = cache(
  async (): Promise<RecipeFilterOptions> => {
    const [types, utensils, ingredients] = await Promise.all([
      prisma.recipeType.findMany({
        orderBy: { name: 'asc' },
        select: { name: true },
      }),
      prisma.utensil.findMany({
        orderBy: { name: 'asc' },
        select: { name: true },
        take: 24,
      }),
      prisma.generalIngredient.findMany({
        orderBy: { name: 'asc' },
        select: { name: true },
        take: 48,
      }),
    ]);

    const categories: FilterOption[] = [
      { label: 'Prato principal', value: 'Prato principal' },
      { label: 'Sobremesa', value: 'Sobremesa' },
      { label: 'Massa', value: 'Massa' },
      { label: 'Ave', value: 'Ave' },
      { label: 'Café da manhã', value: 'Café da manhã' },
      { label: 'Lanche', value: 'Lanche' },
      { label: 'Acompanhamento', value: 'Acompanhamento' },
    ];

    return {
      categories,
      types: types.map((item) => ({
        label: item.name,
        value: item.name,
      })),
      utensils: shuffle(utensils)
        .slice(0, 6)
        .map((item) => ({
          label: item.name,
          value: item.name,
        })),
      ingredients: shuffle(ingredients)
        .slice(0, 12)
        .map((item) => ({
          label: item.name,
          value: item.name,
        })),
    };
  },
);
