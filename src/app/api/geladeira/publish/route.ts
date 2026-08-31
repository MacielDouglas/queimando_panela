import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  buildRecipeCoreData,
  normalizeLower,
  slugify,
} from '@/features/recipes/actions/recipe-core';
import type { AiRecipeAnalysis } from '@/features/recipes/types/recipe-ai.types';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      recipe: AiRecipeAnalysis;
      story?: string;
    };
    const recipe = body.recipe;
    if (!recipe?.title || !recipe?.sections?.length) {
      return NextResponse.json({ error: 'Receita inválida.' }, { status: 400 });
    }

    // Validação básica
    if (!Array.isArray(recipe.types) || recipe.types.length === 0) {
      return NextResponse.json({ error: 'Tipos inválidos.' }, { status: 400 });
    }

    const baseSlug = slugify(recipe.title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.recipe.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const coreData = buildRecipeCoreData(
      recipe as AiRecipeAnalysis,
      body.story,
    );

    const created = await prisma.recipe.create({
      data: {
        slug,
        isPublished: true,
        isAiGenerated: true,
        authorId: session.user.id,
        ...coreData,
      },
      include: { sections: { orderBy: { order: 'asc' } } },
    });

    // Cria ingredientes + GeneralIngredient como em create-recipe
    for (const [sectionIndex, section] of recipe.sections.entries()) {
      const createdSection = created.sections[sectionIndex];
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
            recipeId: created.id,
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

    return NextResponse.json({ slug: created.slug, id: created.id });
  } catch (e) {
    console.error('[geladeira/publish] error', e);
    return NextResponse.json({ error: 'Erro ao publicar.' }, { status: 500 });
  }
}
