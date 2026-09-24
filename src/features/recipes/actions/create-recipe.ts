'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { uploadRecipeImage } from '@/features/recipes/server/recipe-image.service';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { AiRecipeAnalysis } from '../types/recipe-ai.types';
import {
  buildRecipeCoreData,
  normalizeLower,
  resolveUniqueSlug,
} from './recipe-core';
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

  // Validação precoce de upload: evita criar receita + gastar Neon/R2 com arquivo abusivo.
  const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
  for (const file of imageFiles.slice(0, 3)) {
    if (!file.type.startsWith('image/')) {
      return { error: 'Formato de arquivo inválido. Envie apenas imagens.' };
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return { error: 'Imagem muito grande. Envie arquivo de até 10 MB.' };
    }
  }

  const slug = await resolveUniqueSlug(analysis.title, async (candidate) =>
    Boolean(await prisma.recipe.findUnique({ where: { slug: candidate } })),
  );

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

    // Lote em vez de N+1: coleta tudo, resolve generals com 2 queries, 1 createMany.
    const flatIngredients: {
      sectionId: string;
      originalText: string;
      name: string;
      order: number;
      generalName: string;
    }[] = [];
    for (const [sectionIndex, section] of analysis.sections.entries()) {
      const createdSection = recipe.sections[sectionIndex];
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
      const existing = await prisma.generalIngredient.findMany({
        where: { name: { in: uniqueGenerals } },
        select: { id: true, name: true },
      });
      for (const g of existing) generalIdByName.set(g.name, g.id);
      const missing = uniqueGenerals.filter((n) => !generalIdByName.has(n));
      if (missing.length > 0) {
        await prisma.generalIngredient.createMany({
          data: missing.map((name) => ({ name })),
          skipDuplicates: true,
        });
        const createdGenerals = await prisma.generalIngredient.findMany({
          where: { name: { in: missing } },
          select: { id: true, name: true },
        });
        for (const g of createdGenerals) generalIdByName.set(g.name, g.id);
      }
    }

    if (flatIngredients.length > 0) {
      await prisma.ingredient.createMany({
        data: flatIngredients.map((item) => ({
          recipeId: recipe.id,
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
