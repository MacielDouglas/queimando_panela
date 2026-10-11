'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  deleteRecipeImagesByKeys,
  uploadRecipeImage,
} from '@/features/recipes/server/recipe-image.service';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidateRecipePages } from '@/lib/revalidate-recipes';
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

  const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
  for (const file of newImageFiles.slice(0, 3)) {
    if (!file.type.startsWith('image/')) {
      return { error: 'Formato de arquivo inválido. Envie apenas imagens.' };
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return { error: 'Imagem muito grande. Envie arquivo de até 10 MB.' };
    }
  }

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

      // ingredientes + GeneralIngredient em lote (evita N+1 dentro da transação)
      const flatIngredients: {
        sectionId: string;
        originalText: string;
        name: string;
        order: number;
        generalName: string;
      }[] = [];
      for (const [sectionIndex, section] of analysis.sections.entries()) {
        const createdSection = updated.sections[sectionIndex];
        if (!createdSection) continue;
        for (const [order, ingredient] of section.ingredients.entries()) {
          flatIngredients.push({
            sectionId: createdSection.id,
            originalText: ingredient.originalText.trim().slice(0, 500),
            name: ingredient.name.trim().slice(0, 200),
            order,
            generalName: normalizeLower(ingredient.generalName ?? ''),
          });
        }
      }

      const uniqueGenerals = Array.from(
        new Set(flatIngredients.map((i) => i.generalName).filter(Boolean)),
      );
      const generalIdByName = new Map<string, string>();
      if (uniqueGenerals.length > 0) {
        const existingGenerals = await tx.generalIngredient.findMany({
          where: { name: { in: uniqueGenerals } },
          select: { id: true, name: true },
        });
        for (const g of existingGenerals) generalIdByName.set(g.name, g.id);
        const missing = uniqueGenerals.filter((n) => !generalIdByName.has(n));
        if (missing.length > 0) {
          await tx.generalIngredient.createMany({
            data: missing.map((name) => ({ name })),
            skipDuplicates: true,
          });
          const createdGenerals = await tx.generalIngredient.findMany({
            where: { name: { in: missing } },
            select: { id: true, name: true },
          });
          for (const g of createdGenerals) generalIdByName.set(g.name, g.id);
        }
      }

      if (flatIngredients.length > 0) {
        await tx.ingredient.createMany({
          data: flatIngredients.map((item) => ({
            recipeId: updated.id,
            sectionId: item.sectionId,
            originalText: item.originalText,
            name: item.name,
            amount: null,
            unit: null,
            order: item.order,
            generalIngredientId: generalIdByName.get(item.generalName) ?? null,
          })),
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

  revalidateRecipePages();

  redirect(`/receitas/${slug}`);
}
