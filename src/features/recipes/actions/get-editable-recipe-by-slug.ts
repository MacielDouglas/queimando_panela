'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getEditableRecipeBySlug = cache(
  async (slug: string, userId: string) => {
    const recipe = await prisma.recipe.findFirst({
      where: {
        slug,
        authorId: userId,
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            ingredients: {
              orderBy: { order: 'asc' },
              include: {
                generalIngredient: true,
              },
            },
          },
        },
        utensils: {
          include: { utensil: true },
        },
        recipeTypes: {
          include: { recipeType: true },
        },
      },
    });

    if (!recipe) return null;

    return {
      id: recipe.id,
      slug: recipe.slug,
      title: recipe.title,
      story: recipe.story ?? '',
      summary: recipe.summary ?? '',
      difficulty: recipe.difficulty,
      difficultyLabel:
        recipe.difficulty === 'EASY'
          ? 'Fácil'
          : recipe.difficulty === 'MEDIUM'
            ? 'Médio'
            : 'Difícil',
      types: recipe.recipeTypes.map((rt) => rt.recipeType.name),
      prepTimeMinutes: recipe.prepTimeMinutes ?? 0,
      cookTimeMinutes: recipe.cookTimeMinutes ?? 0,
      suggestions: recipe.suggestions ?? '',
      nutritionSummary: recipe.nutritionSummary ?? '',
      nutritionPer100g:
        (recipe.nutritionPer100g as { nutrient: string; quantity: string }[]) ??
        [],
      utensils: recipe.utensils.map((item) => item.utensil.name),
      sections: recipe.sections.map((section) => ({
        name: section.name,
        ingredients: section.ingredients.map((ingredient) => ({
          originalText: ingredient.originalText,
          name: ingredient.name,
          generalName:
            ingredient.generalIngredient?.name ?? ingredient.name.toLowerCase(),
        })),
        modeOfPreparation: section.modeOfPreparation,
      })),
      images: recipe.images.map((image) => ({
        id: image.id,
        key: image.key,
        url: image.url,
        alt: image.alt,
        isCover: image.isCover,
        order: image.order,
      })),
    };
  },
);
