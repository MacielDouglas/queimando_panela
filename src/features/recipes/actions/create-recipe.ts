'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { AiRecipeAnalysis } from '../types/recipe-ai.types';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function createRecipe(
  analysis: AiRecipeAnalysis,
  story?: string,
): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'Não autorizado.' };

  const baseSlug = slugify(analysis.title);
  const slug = `${baseSlug}`;

  try {
    // 1. Cria a receita com seções e utensílios
    const recipe = await prisma.recipe.create({
      data: {
        slug,
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
        isPublished: true,
        authorId: session.user.id,
        sections: {
          create: analysis.sections.map((s, i) => ({
            name: s.name,
            modeOfPreparation: s.modeOfPreparation,
            order: i,
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

    // 2. Insere ingredientes vinculados à seção correta
    const ingredientData = analysis.sections.flatMap((s, sectionIndex) => {
      const section = recipe.sections[sectionIndex];
      if (!section) return [];

      return s.ingredients.map((originalText, order) => {
        // Tenta separar quantidade + unidade do nome
        // Ex: "2 xícaras de farinha" → amount="2", unit="xícaras", name="farinha"
        const match = originalText
          .trim()
          .match(/^([\d¼½¾⅓⅔.,/\s]+)?\s*([a-zA-ZÀ-ú()\s]+?)?\s+de\s+(.+)$/i);

        const amount = match?.[1]?.trim() ?? null;
        const unit = match?.[2]?.trim() ?? null;
        const name = match?.[3]?.trim() ?? originalText.trim();

        return {
          recipeId: recipe.id,
          sectionId: section.id,
          originalText: originalText.trim(),
          name,
          amount,
          unit,
          order,
        };
      });
    });

    if (ingredientData.length > 0) {
      await prisma.ingredient.createMany({ data: ingredientData });
    }
  } catch (err) {
    console.error('Create recipe error:', err);
    return { error: 'Erro ao salvar a receita. Tente novamente.' };
  }

  redirect(`/receitas`);
}
