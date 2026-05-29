'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadRecipeImage } from '@/features/recipes/server/recipe-image.service';
import type { AiRecipeAnalysis } from '../types/recipe-ai.types';
import { buildRecipeCoreData, normalizeLower, slugify } from './recipe-core';
import {
  buildFinalImageSequence,
  type FinalNewImage,
} from './recipe-imagem-helpers';

export async function createRecipe(
  formData: FormData,
): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'Não autorizado.' };

  const analysisRaw = formData.get('analysis');
  const storyRaw = formData.get('story');
  const imageFiles = formData
    .getAll('images')
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!analysisRaw || typeof analysisRaw !== 'string') {
    return { error: 'Dados da receita inválidos.' };
  }

  const analysis = JSON.parse(analysisRaw) as AiRecipeAnalysis;
  const story = typeof storyRaw === 'string' ? storyRaw : undefined;
  const slug = slugify(analysis.title);

  try {
    const coreData = buildRecipeCoreData(analysis, story);

    const recipe = await prisma.recipe.create({
      data: {
        slug,
        isPublished: true,
        authorId: session.user.id,
        ...coreData,
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // criação de ingredientes + GeneralIngredient (versão nova)
    for (const [sectionIndex, section] of analysis.sections.entries()) {
      const createdSection = recipe.sections[sectionIndex];
      if (!createdSection) continue;

      for (const [order, ingredient] of section.ingredients.entries()) {
        const generalName = normalizeLower(ingredient.generalName);

        const generalIngredient = generalName
          ? await prisma.generalIngredient.upsert({
              where: { name: generalName },
              update: {},
              create: { name: generalName },
            })
          : null;

        await prisma.ingredient.create({
          data: {
            recipeId: recipe.id,
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

    if (imageFiles.length > 0) {
      const uploadedImages = await Promise.all(
        imageFiles.slice(0, 3).map((file, index) =>
          uploadRecipeImage({
            recipeId: recipe.id,
            file,
            alt: `${analysis.title} - foto ${index + 1}`,
            order: index,
            isCover: index === 0,
          }),
        ),
      );

      const finalImages = buildFinalImageSequence({
        title: analysis.title,
        existingImages: [],
        uploadedImages,
        maxImages: 3,
      });

      // como não há imagens existentes no create, filtramos:
      const finalNewImages = finalImages.filter(
        (img): img is FinalNewImage => img.kind === 'new',
      );

      await prisma.recipeImage.createMany({
        data: finalNewImages.map((image) => ({
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
        })),
      });
    }
  } catch (error) {
    console.error('Create recipe error:', error);
    return { error: 'Erro ao salvar a receita. Tente novamente.' };
  }

  redirect('/receitas');
}
