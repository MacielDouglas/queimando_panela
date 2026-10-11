'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const getRecipeBySlug = cache(async (slug: string) => {
  // Validação anti-abuso: slug fora do padrão nem chega ao Neon.
  if (!slug || slug.length > 120 || !SLUG_PATTERN.test(slug)) return null;

  try {
    // Select explícito: fora ficam colunas pesadas não usadas no detalhe
    // (notesAuthor, notesPublic, classification, createdAt/updatedAt).
    return await prisma.recipe.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        story: true,
        modeOfPreparation: true,
        difficulty: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        servings: true,
        suggestions: true,
        nutritionSummary: true,
        nutritionPer100g: true,
        isPublished: true,
        isAiGenerated: true,
        authorId: true,
        author: { select: { name: true } },
        images: {
          orderBy: { order: 'asc' },
          select: {
            url: true,
            alt: true,
            isCover: true,
            order: true,
          },
        },
        sections: {
          orderBy: { order: 'asc' },
          select: {
            name: true,
            modeOfPreparation: true,
            ingredients: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                name: true,
                amount: true,
                unit: true,
                originalText: true,
                order: true,
              },
            },
          },
        },
        ingredients: {
          where: { sectionId: null },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            amount: true,
            unit: true,
            originalText: true,
            order: true,
          },
        },
        utensils: {
          select: { utensil: { select: { name: true } } },
        },
        recipeTypes: {
          select: { recipeType: { select: { name: true } } },
        },
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'production')
      console.error('[getRecipeBySlug] fallback:', error);
    return null;
  }
});
