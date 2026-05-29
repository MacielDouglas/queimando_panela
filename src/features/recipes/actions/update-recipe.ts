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
import { buildRecipeCoreData, normalizeLower } from './recipe-core';
import { buildFinalImageSequence } from './recipe-imagem-helpers';

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

    const coreData = buildRecipeCoreData(analysis, story);

    await prisma.$transaction(async (tx) => {
      // limpa derivados de IA
      await tx.ingredient.deleteMany({
        where: { recipeId: recipe.id },
      });

      await tx.utensilOnRecipe.deleteMany({
        where: { recipeId: recipe.id },
      });

      await tx.recipeTypeOnRecipe.deleteMany({
        where: { recipeId: recipe.id },
      });

      await tx.recipeSection.deleteMany({
        where: { recipeId: recipe.id },
      });

      const updated = await tx.recipe.update({
        where: { id: recipe.id },
        data: coreData,
        include: {
          sections: {
            orderBy: { order: 'asc' },
          },
        },
      });

      // ingredientes + GeneralIngredient
      for (const [sectionIndex, section] of analysis.sections.entries()) {
        const createdSection = updated.sections[sectionIndex];
        if (!createdSection) continue;

        for (const [order, ingredient] of section.ingredients.entries()) {
          const generalName = normalizeLower(ingredient.generalName);

          const generalIngredient = generalName
            ? await tx.generalIngredient.upsert({
                where: { name: generalName },
                update: {},
                create: { name: generalName },
              })
            : null;

          await tx.ingredient.create({
            data: {
              recipeId: updated.id,
              sectionId: createdSection.id,
              originalText: ingredient.originalText.trim(),
              name: ingredient.name.trim(),
              amount: null,
              unit: null,
              order,
              generalIngredientId: generalIngredient?.id,
            },
          });
        }
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

      const finalImageSequence = buildFinalImageSequence({
        title: analysis.title,
        existingImages,
        uploadedImages: uploadedNewImages,
        maxImages: 3,
      });

      for (const image of finalImageSequence) {
        if (image.kind === 'existing') {
          await tx.recipeImage.update({
            where: { id: image.id },
            data: {
              order: image.order,
              isCover: image.isCover,
              alt: image.alt,
            },
          });
        } else {
          await tx.recipeImage.create({
            data: {
              recipeId: recipe.id,
              key: image.key,
              url: image.url,
              alt: image.alt,
              contentType: image.contentType ?? null,
              sizeBytes: image.sizeBytes ?? null,
              width: image.width ?? null,
              height: image.height ?? null,
              order: image.order,
              isCover: image.isCover,
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
