'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { AiRecipeAnalysis } from '../types/recipe-ai.types';

export async function updateRecipe(
  slug: string,
  analysis: AiRecipeAnalysis,
  story?: string,
): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'Não autorizado.' };

  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        slug,
        authorId: session.user.id,
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!recipe) {
      return { error: 'Receita não encontrada ou sem permissão de edição.' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany({
        where: { recipeId: recipe.id },
      });

      await tx.utensilOnRecipe.deleteMany({
        where: { recipeId: recipe.id },
      });

      await tx.recipeSection.deleteMany({
        where: { recipeId: recipe.id },
      });

      const updated = await tx.recipe.update({
        where: { id: recipe.id },
        data: {
          title: analysis.title,
          summary: analysis.summary,
          story: story ?? null,
          difficulty: analysis.difficulty,
          type: analysis.type,
          prepTimeMinutes: analysis.prepTimeMinutes,
          cookTimeMinutes: analysis.cookTimeMinutes,
          suggestions: analysis.suggestions,
          nutritionSummary: analysis.nutritionSummary,
          nutritionPer100g: analysis.nutritionPer100g,
          sections: {
            create: analysis.sections.map((section, index) => ({
              name: section.name,
              modeOfPreparation: section.modeOfPreparation,
              order: index,
            })),
          },
          utensils: {
            create: analysis.utensils.map((name) => ({
              utensil: {
                connectOrCreate: {
                  where: { name },
                  create: { name },
                },
              },
            })),
          },
        },
        include: {
          sections: { orderBy: { order: 'asc' } },
        },
      });

      const ingredientData = analysis.sections.flatMap(
        (section, sectionIndex) => {
          const createdSection = updated.sections[sectionIndex];
          if (!createdSection) return [];

          return section.ingredients.map((originalText, order) => {
            const match = originalText
              .trim()
              .match(
                /^([\d¼½¾⅓⅔.,/\s]+)?\s*([a-zA-ZÀ-ú()%.\s]+?)?\s+de\s+(.+)$/i,
              );

            const amount = match?.[1]?.trim() ?? null;
            const unit = match?.[2]?.trim() ?? null;
            const name = match?.[3]?.trim() ?? originalText.trim();

            return {
              recipeId: updated.id,
              sectionId: createdSection.id,
              originalText: originalText.trim(),
              name,
              amount,
              unit,
              order,
            };
          });
        },
      );

      if (ingredientData.length > 0) {
        await tx.ingredient.createMany({
          data: ingredientData,
        });
      }
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    return { error: 'Erro ao atualizar a receita. Tente novamente.' };
  }

  redirect(`/receitas/${slug}`);
}
