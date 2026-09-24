import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  buildRecipeCoreData,
  normalizeLower,
  resolveUniqueSlug,
} from '@/features/recipes/actions/recipe-core';
import type { AiRecipeAnalysis } from '@/features/recipes/types/recipe-ai.types';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const NO_STORE = { 'Cache-Control': 'no-store' };

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

    const baseSlug = recipe.title;
    const slug = await resolveUniqueSlug(baseSlug, async (candidate) =>
      Boolean(await prisma.recipe.findUnique({ where: { slug: candidate } })),
    );

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

    // Lote: 1 findMany + 1 createMany para generals, 1 createMany para ingredients.
    const flatIngredients: {
      sectionId: string;
      originalText: string;
      name: string;
      order: number;
      generalName: string;
    }[] = [];
    for (const [sectionIndex, section] of recipe.sections.entries()) {
      const createdSection = created.sections[sectionIndex];
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
          recipeId: created.id,
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

    return NextResponse.json(
      { slug: created.slug, id: created.id },
      { headers: NO_STORE },
    );
  } catch (e) {
    console.error('[geladeira/publish] error', e);
    return NextResponse.json({ error: 'Erro ao publicar.' }, { status: 500 });
  }
}
