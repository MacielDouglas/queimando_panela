'use server';

import { unstable_cache } from 'next/cache';
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

function toOptions(items: { name: string }[]): FilterOption[] {
  return items.map((item) => ({ label: item.name, value: item.name }));
}

// Cache compartilhado entre requests (24h). Sem shuffle server-side para
// permitir CDN/ISR — embaralhe no client se precisar de variedade.
async function fetchRecipeFilterOptions(): Promise<RecipeFilterOptions> {
  const categories: FilterOption[] = [
    { label: 'Prato principal', value: 'Prato principal' },
    { label: 'Sobremesa', value: 'Sobremesa' },
    { label: 'Massa', value: 'Massa' },
    { label: 'Ave', value: 'Ave' },
    { label: 'Café da manhã', value: 'Café da manhã' },
    { label: 'Lanche', value: 'Lanche' },
    { label: 'Acompanhamento', value: 'Acompanhamento' },
  ];

  try {
    const [types, utensils, ingredients] = await Promise.all([
      prisma.recipeType.findMany({
        orderBy: { name: 'asc' },
        select: { name: true },
        take: 60,
      }),
      prisma.utensil.findMany({
        orderBy: { name: 'asc' },
        select: { name: true },
        take: 6,
      }),
      prisma.generalIngredient.findMany({
        orderBy: { name: 'asc' },
        select: { name: true },
        take: 12,
      }),
    ]);

    return {
      categories,
      types: toOptions(types),
      utensils: toOptions(utensils),
      ingredients: toOptions(ingredients),
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'production')
      console.error('[getRecipeFilterOptions] fallback:', error);
    return { categories, types: [], utensils: [], ingredients: [] };
  }
}

export const getRecipeFilterOptions = unstable_cache(
  fetchRecipeFilterOptions,
  ['recipe-filter-options'],
  { revalidate: 86400, tags: ['recipe-filters'] },
);
