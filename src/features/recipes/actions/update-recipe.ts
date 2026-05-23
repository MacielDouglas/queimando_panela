'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  deleteRecipeImagesByKeys,
  uploadRecipeImage,
} from '@/features/recipes/server/recipe-image.service';
import type { AiRecipeAnalysis } from '../types/recipe-ai.types';

type ExistingImagePayload = {
  id: string;
  key: string;
  url: string;
  alt: string;
};

export async function updateRecipe(
  slug: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'Não autorizado.' };

  const analysisRaw = formData.get('analysis');
  const storyRaw = formData.get('story');
  const existingImagesRaw = formData.get('existingImages');
  const newImageFiles = formData
    .getAll('images')
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!analysisRaw || typeof analysisRaw !== 'string') {
    return { error: 'Dados da receita inválidos.' };
  }

  const analysis = JSON.parse(analysisRaw) as AiRecipeAnalysis;
  const story = typeof storyRaw === 'string' ? storyRaw : undefined;

  let existingImages: ExistingImagePayload[] = [];
  if (typeof existingImagesRaw === 'string' && existingImagesRaw.trim()) {
    existingImages = JSON.parse(existingImagesRaw) as ExistingImagePayload[];
  }

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
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!recipe) {
      return { error: 'Receita não encontrada ou sem permissão de edição.' };
    }

    const keptIds = new Set(existingImages.map((image) => image.id));
    const removedImages = recipe.images.filter(
      (image) => !keptIds.has(image.id),
    );

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

      if (removedImages.length > 0) {
        await tx.recipeImage.deleteMany({
          where: {
            id: {
              in: removedImages.map((image) => image.id),
            },
          },
        });
      }

      const uploadedNewImages = await Promise.all(
        newImageFiles.slice(0, 3).map((file, index) =>
          uploadRecipeImage({
            recipeId: recipe.id,
            file,
            alt: `${analysis.title} - foto nova ${index + 1}`,
            order: index,
            isCover: false,
          }),
        ),
      );

      const finalImageSequence = [
        ...existingImages.map((image) => ({
          kind: 'existing' as const,
          ...image,
        })),
        ...uploadedNewImages.map((image) => ({
          kind: 'new' as const,
          ...image,
        })),
      ].slice(0, 3);

      for (const [index, image] of finalImageSequence.entries()) {
        if (image.kind === 'existing') {
          await tx.recipeImage.update({
            where: { id: image.id },
            data: {
              order: index,
              isCover: index === 0,
              alt: image.alt || `${analysis.title} - foto ${index + 1}`,
            },
          });
        } else {
          await tx.recipeImage.create({
            data: {
              recipeId: recipe.id,
              key: image.key,
              url: image.url,
              alt: image.alt,
              contentType: image.contentType,
              sizeBytes: image.sizeBytes,
              width: image.width,
              height: image.height,
              order: index,
              isCover: index === 0,
            },
          });
        }
      }
    });

    if (removedImages.length > 0) {
      await deleteRecipeImagesByKeys(removedImages.map((image) => image.key));
    }
  } catch (error) {
    console.error('Update recipe error:', error);
    return { error: 'Erro ao atualizar a receita. Tente novamente.' };
  }

  redirect(`/receitas/${slug}`);
}
