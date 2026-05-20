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
  const slug = `${baseSlug}-${Date.now()}`;

  try {
    await prisma.recipe.create({
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
        isPublished: false,
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
    });
  } catch (err) {
    console.error('Create recipe error:', err);
    return { error: 'Erro ao salvar a receita. Tente novamente.' };
  }

  redirect(`/receitas`);
}
